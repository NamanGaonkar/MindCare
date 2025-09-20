import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Brain, AlertTriangle, User, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'ai';
  created_at: string;
}

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = useCallback(async (sid: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sid)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);
    } catch (error: any) {
      toast({ title: "Error Loading History", description: error.message, variant: "destructive" });
    }
  }, [toast]);

  // Effect to initialize session
  useEffect(() => {
    if (user && !sessionId) {
      const newSessionId = `session_${user.id}_${Date.now()}`;
      setSessionId(newSessionId);
      // You could potentially save this session ID in the user's profile or local storage
      // to persist sessions across page loads.
    }
  }, [user, sessionId]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || !user || !sessionId) return;

    const userMessageContent = currentMessage.trim();
    const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        message: userMessageContent,
        sender_type: 'user',
        created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      // Use Supabase Edge Function for AI chat
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: userMessageContent, sessionId },
      });

      if (error) throw new Error(error.message);
      if (!data.aiResponse) throw new Error("No response from AI assistant.");

      const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          message: data.aiResponse,
          sender_type: 'ai',
          created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (data.containsCrisis) {
        toast({
            title: "Crisis Support Resources",
            description: "It sounds like you are going through a difficult time. Please know there is support available.",
            variant: "destructive",
            duration: 10000,
        });
      }

    } catch (error: any) {
      toast({ title: "Message Failed", description: error.message, variant: "destructive" });
      setMessages(prev => prev.slice(0, -1)); // Remove the user's message if send failed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(scrollToBottom, [messages]);

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
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto py-4">
            <Card className="flex-1 flex flex-col border-border/50 shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2"><Brain className="text-primary" />MindCare AI Assistant</CardTitle>
                    <CardDescription>Your confidential space to talk.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full p-6">
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground pt-16">
                                    <p>No messages yet. Send a message to start the conversation.</p>
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
                    <p className="text-xs text-muted-foreground mt-2 text-center">Your conversation is private and secure. If you are in a crisis, please call 911 or a helpline.</p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
