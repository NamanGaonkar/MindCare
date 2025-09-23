import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Brain, User, Sparkles, Trash2, MessageSquare } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
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
  };

  const loadSessionMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, message, sender_type, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: "Error loading session", description: error.message, variant: "destructive" });
      return;
    }
    setMessages((data || []).map(msg => ({
      ...msg,
      sender_type: msg.sender_type as 'user' | 'ai'
    })));
    setSessionId(sessionId);
    setShowHistory(false);
  };


  const sendMessage = async () => {
    if (!currentMessage.trim() || !user) return;

    const userMessageContent = currentMessage.trim();
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      const currentSessionId = sessionId; // Don't create invalid UUIDs
      if (!sessionId) {
        // Let the backend create the session ID
        setSessionId("new");
      }

      // Add user message to state immediately
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        message: userMessageContent,
        sender_type: 'user',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message: userMessageContent, 
          sessionId: currentSessionId === "new" ? null : currentSessionId,
          moodRating: 5 // Default mood rating since we removed the mood tracker from chat
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      // Update session ID if it was created by backend
      if (data.sessionId && (!sessionId || sessionId === "new")) {
        setSessionId(data.sessionId);
      }

      // Add AI response immediately as fallback (in case realtime doesn't work)
      if (data.response) {
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          message: data.response,
          sender_type: 'ai',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error: any) {
      toast({ title: "Message Failed", description: error.message, variant: "destructive" });
      // remove the user message if the call fails
      setMessages(prev => prev.slice(0, -1)); 
    } finally {
      setIsLoading(false);
      loadChatHistory(); // Refresh history to show new/updated session
    }
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setSessionId(null);
    toast({ title: "Current chat cleared." });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!sessionId || sessionId === "new") return;

    const channel = supabase
      .channel(`chat-messages:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Prevent duplicate messages by checking if message already exists
          setMessages(prev => {
            const exists = prev.some(msg => 
              msg.message === newMessage.message && 
              msg.sender_type === newMessage.sender_type &&
              Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 5000
            );
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    <div className="flex h-screen flex-col bg-muted/20">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex max-w-7xl mx-auto py-4 gap-4">
          <Card className={`w-1/3 transition-all duration-300 ${showHistory ? 'block' : 'hidden'} md:block`}>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-4rem)] p-4">
              {chatHistory.map(session => (
                <div key={session.id} className="mb-2 cursor-pointer p-2 rounded-lg hover:bg-muted" onClick={() => loadSessionMessages(session.id)}>
                  <p className="font-semibold truncate">{session.title || 'New Session'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</p>
                </div>
              ))}
            </ScrollArea>
          </Card>

          <div className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col border-border/50 shadow-sm">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><Brain className="text-primary" />MindCare AI Assistant</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="md:hidden"><MessageSquare className="h-4 w-4"/></Button>
                        <Button variant="outline" size="sm" onClick={clearCurrentChat}><Trash2 className="h-4 w-4 mr-2"/>New Chat</Button>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full p-6">
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground pt-16">
                                    <p>No messages yet. Send a message to start.</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender_type === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender_type === 'ai' && <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="h-5 w-5 text-primary" /></div>}
                                    <div className={`max-w-[75%] rounded-xl px-4 py-2 ${msg.sender_type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                    </div>
                                    {msg.sender_type === 'user' && <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"><User className="h-5 w-5 text-secondary-foreground" /></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="h-5 w-5 text-primary" /></div>
                                    <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
                <div className="border-t p-4 bg-background/95">
                    <div className="relative">
                        <Input 
                            placeholder="Type your message..." 
                            className="pr-12" 
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            disabled={isLoading}
                        />
                        <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={sendMessage} disabled={isLoading || !currentMessage.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
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
