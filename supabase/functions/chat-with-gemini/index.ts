import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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

    const { message, sessionId, moodRating } = await req.json();
    
    console.log('Processing chat request:', { userId: user.id, sessionId, message: message.substring(0, 100) });
    console.log('Gemini API Key loaded:', geminiApiKey ? 'Yes' : 'No');

    // Crisis detection keywords
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 
      'cutting', 'overdose', 'can\'t go on', 'better off dead', 'hopeless',
      'worthless', 'emergency', 'crisis'
    ];
    
    const containsCrisisKeywords = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Create or get session
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

    // Save user message
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

    // Generate system prompt based on context
    let systemPrompt = `You are MindfulMate, a compassionate AI mental health assistant specifically designed for college students. 

CORE GUIDELINES:
- You are warm, empathetic, and non-judgmental
- Use simple, student-friendly language
- Provide practical coping strategies
- Always validate feelings
- Encourage professional help when needed
- Be culturally sensitive and inclusive

RESPONSE STYLE:
- Keep responses concise but caring (2-4 paragraphs max)
- Use encouraging, hopeful language
- Offer specific, actionable advice
- Ask follow-up questions to show engagement

SAFETY PROTOCOLS:
- If you detect crisis language (suicide, self-harm), immediately provide crisis resources
- Encourage professional counseling for persistent issues
- Never provide medical advice or diagnosis
- Always remind users that you're an AI, not a replacement for human support

COMMON STUDENT ISSUES TO ADDRESS:
- Academic stress and exam anxiety
- Social anxiety and relationship issues
- Homesickness and adjustment problems
- Sleep and lifestyle concerns
- Financial stress
- Identity and self-esteem issues`;

    if (containsCrisisKeywords) {
      systemPrompt += `

🚨 CRISIS RESPONSE REQUIRED: The user's message contains potential crisis indicators. Respond with immediate care and provide crisis resources:
- Validate their feelings without judgment
- Provide immediate crisis hotlines (988 Suicide & Crisis Lifeline)
- Encourage them to reach out to campus counseling
- Suggest contacting trusted friends, family, or emergency services if in immediate danger
- Remind them that help is available and their life has value`;
    }

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nStudent Message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Gemini API error', 
        details: errorText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    let aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to support you. Can you tell me more about what you're going through?";

    // Add crisis resources if needed
    if (containsCrisisKeywords) {
      aiResponse += `\n\n🆘 **Immediate Support Resources:**\n- **Crisis Hotline:** 988 (24/7 Suicide & Crisis Lifeline)\n- **Text:** Text "HELLO" to 741741 (Crisis Text Line)\n- **Campus Counseling:** Contact your student counseling center\n- **Emergency:** Call 911 or go to your nearest emergency room\n\nYou're not alone in this. Please reach out for help. 💙`;
    }

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      user_id: user.id,
      message: aiResponse,
      sender_type: 'ai'
    });

    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse, 
      sessionId: currentSessionId,
      containsCrisis: containsCrisisKeywords 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});