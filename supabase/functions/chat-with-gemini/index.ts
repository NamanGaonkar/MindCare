import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Graceful Environment Variable Handling ---
// Instead of crashing with '!', we'll check for each variable and provide a clear error.

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

// Main server function
serve(async (req) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Environment Variable Validation ---
    // Return a specific error if any required environment variable is missing.
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables (URL and Service Key) are not set.');
    }
    if (!geminiApiKey) {
      throw new Error('The GEMINI_API_KEY environment variable is not set. Please add it in your Supabase project settings under Functions.');
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Authenticate the user from the request header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the incoming request body
    const { message, sessionId, moodRating } = await req.json();
    
    // --- Crisis Keyword Detection ---
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 
      'cutting', 'overdose', 'can't go on', 'better off dead', 'hopeless',
      'worthless', 'emergency', 'crisis'
    ];
    const containsCrisisKeywords = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // --- Session Management ---
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          mood_rating: moodRating,
          crisis_indicators: containsCrisisKeywords ? { detected: true, keywords: crisisKeywords.filter(k => message.toLowerCase().includes(k)) } : {}
        })
        .select()
        .single();
      
      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw sessionError;
      }
      currentSessionId = newSession.id;
    }

    // --- Save User Message ---
    const { error: messageError } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      user_id: user.id,
      message,
      sender_type: 'user',
      contains_crisis_keywords: containsCrisisKeywords
    });

    if (messageError) {
      console.error('Error saving user message:', messageError);
      throw messageError;
    }

    // --- AI System Prompt Generation ---
    let systemPrompt = `You are MindfulMate, a compassionate AI mental health assistant...`; // (rest of prompt omitted for brevity)
    if (containsCrisisKeywords) {
      systemPrompt += `

🚨 CRISIS RESPONSE REQUIRED...`; // (rest of prompt omitted for brevity)
    }

    // --- Call Gemini API ---
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}

Student Message: ${message}` }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      // This will now return the actual error from the Gemini API
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    let aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to support you. Can you tell me more about what you're going through?";

    // --- Save AI Response ---
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      user_id: user.id,
      message: aiResponse,
      sender_type: 'ai'
    });

    // --- Return Successful Response ---
    return new Response(JSON.stringify({ 
      response: aiResponse, 
      sessionId: currentSessionId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // --- Centralized Error Handling ---
    // This block will now catch ANY error from above, including the missing key.
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
