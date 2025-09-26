import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Brain, User, Sparkles, Trash2, MessageSquare, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'ai';
  created_at: string;
}

interface ChatSession {
  id: string;
  created_at: string;
  title: string;
}

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const speechEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef("");

  const sendMessage = useCallback(async (messageContent?: string) => {
    const messageToSend = (messageContent || currentMessage).trim();
    if (!messageToSend || !user) return;

    if (isRecording) {
      recognitionRef.current?.stop();
    }
    if (speechEndTimeoutRef.current) {
      clearTimeout(speechEndTimeoutRef.current);
    }

    setCurrentMessage("");
    setIsLoading(true);
    finalTranscriptRef.current = "";

    try {
      const currentSessionId = sessionId;
      if (!sessionId) setSessionId("new");

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        message: messageToSend,
        sender_type: 'user',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: messageToSend, sessionId: currentSessionId === "new" ? null : currentSessionId, moodRating: 5 },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      if (data.sessionId && (!sessionId || sessionId === "new")) setSessionId(data.sessionId);

      if (data.response) {
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          message: data.response,
          sender_type: 'ai',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
        speak(data.response);
      }

    } catch (error: any) {
      toast({ title: "Message Failed", description: error.message, variant: "destructive" });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      // Using useCallback for loadChatHistory will be beneficial if it's a dependency elsewhere
      loadChatHistory();
    }
  }, [currentMessage, user, sessionId, isRecording, toast]); // Removed speak, loadchathistory

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        if (speechEndTimeoutRef.current) {
            clearTimeout(speechEndTimeoutRef.current);
        }

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        finalTranscriptRef.current = finalTranscript;
        setCurrentMessage(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({ title: "Speech Recognition Error", description: event.error, variant: "destructive" });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (speechEndTimeoutRef.current) {
            clearTimeout(speechEndTimeoutRef.current);
        }
        speechEndTimeoutRef.current = setTimeout(() => {
            const messageToSend = finalTranscriptRef.current.trim();
            if (messageToSend) {
                sendMessage(messageToSend);
            }
        }, 1500); 
      };
    } else {
      toast({ title: "Speech Recognition Not Supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechEndTimeoutRef.current) {
        clearTimeout(speechEndTimeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, [toast, sendMessage]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      finalTranscriptRef.current = "";
      setCurrentMessage("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const speak = (text: string) => {
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, created_at, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error loading chat history", description: error.message, variant: "destructive" });
    } else {
      setChatHistory(data || []);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user, loadChatHistory]);

  const loadSessionMessages = async (sessionId: string) => {
    window.speechSynthesis.cancel();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, message, sender_type, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: "Error loading session", description: error.message, variant: "destructive" });
      return;
    }
    setMessages((data || []).map(msg => ({ ...msg, sender_type: msg.sender_type as 'user' | 'ai' })));
    setSessionId(sessionId);
    setShowHistory(false);
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setSessionId(null);
    window.speechSynthesis.cancel();
    toast({ title: "Current chat cleared." });
  };

  const deleteSession = async (sessionIdToDelete: string) => {
    const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionIdToDelete);

    if (error) {
        toast({ title: "Error deleting session", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Session deleted" });
        setChatHistory(prev => prev.filter(s => s.id !== sessionIdToDelete));
        if (sessionId === sessionIdToDelete) {
            clearCurrentChat();
        }
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!sessionId || sessionId === "new") return;
    const channel = supabase
      .channel(`chat-messages:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            if (newMessage.sender_type === 'ai') speak(newMessage.message);
            return [...prev, newMessage];
          });
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Chat Support</h1>
            <p className="text-lg text-muted-foreground mb-8">Please sign in to start a confidential conversation with our AI assistant.</p>
            <AuthModal><Button size="lg">Sign In to Chat</Button></AuthModal>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-transparent">
      <Navigation />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-full flex max-w-7xl mx-auto py-4 gap-4 w-full">
          <Card className={`w-1/3 transition-all duration-300 ${showHistory ? 'block' : 'hidden'} md:flex md:flex-col transparent-card`}>
            <CardHeader><CardTitle>Chat History</CardTitle></CardHeader>
            <ScrollArea className="h-full p-4">{chatHistory.map(session => (
                <div key={session.id} className="relative mb-2 rounded-lg hover:bg-white/10 flex items-center justify-between" >
                  <div className="p-2 cursor-pointer flex-grow" onClick={() => loadSessionMessages(session.id)}>
                    <p className="font-semibold truncate">{session.title || 'New Session'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 flex-shrink-0"
                    onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                </div>))}
            </ScrollArea>
          </Card>

          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col shadow-sm transparent-card">
                <CardHeader className="border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><Brain className="text-primary" />MindCareAi Assistant</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
                          {isVoiceEnabled ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5"/>}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="md:hidden"><MessageSquare className="h-4 w-4"/></Button>
                        <Button variant="outline" size="sm" onClick={clearCurrentChat}><Trash2 className="h-4 w-4 mr-2"/>New Chat</Button>
                      </div>
                    </div>
                </CardHeader>
                <CardContent ref={scrollAreaRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.sender_type === 'user' ? 'justify-end' : ''}`}>
                          {msg.sender_type === 'ai' && <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Sparkles className="h-5 w-5 text-primary" /></div>}
                          <div className={`max-w-[75%] rounded-xl px-4 py-2 ${msg.sender_type === 'user' ? 'bg-primary text-white' : 'bg-white/80'}`}>
                              <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                          </div>
                          {msg.sender_type === 'user' && <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-secondary-foreground" /></div>}
                      </div>
                  ))}
                  {isLoading && (
                      <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="h-5 w-5 text-primary" /></div>
                          <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm text-muted-foreground">AI is thinking...</span></div>
                      </div>
                  )}
                </CardContent>
                <div className="border-t border-white/20 p-4">
                    <div className="relative flex items-center">
                        <Input 
                            placeholder={isRecording ? "Listening..." : "Type your message..."} 
                            className="pr-20"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            disabled={isLoading}
                        />
                        <div className="absolute right-2 flex gap-1">
                          <Button size="icon" variant={isRecording ? "destructive" : "ghost"} onClick={toggleRecording} disabled={isLoading}>
                              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => sendMessage()} disabled={isLoading || !currentMessage.trim()}>
                              <Send className="h-5 w-5" />
                          </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Your conversation is private and secure. If you are in a crisis, please call a helpline. In India, you can call 112 (emergency), 108 (medical), or 104 (health advice).</p>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
