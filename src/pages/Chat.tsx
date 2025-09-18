import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageCircle, 
  Brain, 
  Shield, 
  Heart, 
  Send, 
  Loader2, 
  AlertTriangle,
  Smile,
  Meh,
  Frown
} from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'ai';
  created_at: string;
  contains_crisis_keywords?: boolean;
}

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [moodRating, setMoodRating] = useState<number>(5);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing chat messages if user has a session
  useEffect(() => {
    if (user && sessionId) {
      loadChatHistory();
    }
  }, [user, sessionId]);

  const loadChatHistory = async () => {
    if (!sessionId) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as ChatMessage[]);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !user) return;

    setIsLoading(true);
    const userMessage = currentMessage.trim();
    setCurrentMessage("");

    // Hide mood selector after first message
    if (showMoodSelector) {
      setShowMoodSelector(false);
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: userMessage,
          sessionId,
          moodRating: showMoodSelector ? moodRating : undefined
        }
      });

      if (error) throw error;

      // Set session ID for future messages
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Show crisis alert if detected
      if (data.containsCrisis) {
        toast({
          title: "🆘 Crisis Support Available",
          description: "We've detected you might be in distress. Please see the resources in our response.",
          variant: "destructive",
        });
      }

      // Reload messages to get the latest conversation
      if (data.sessionId) {
        setTimeout(() => loadChatHistory(), 500);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message failed",
        description: "Please try again. If the problem persists, contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodIcon = (rating: number) => {
    if (rating <= 3) return <Frown className="h-5 w-5 text-destructive" />;
    if (rating <= 7) return <Meh className="h-5 w-5 text-warning" />;
    return <Smile className="h-5 w-5 text-success" />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Chat Support</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              24/7 Mental Health Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with our AI-guided chatbot for immediate support, coping strategies, and gentle guidance towards professional help when needed.
            </p>

            <Card className="shadow-floating border-border/50 bg-gradient-card max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                    <Brain className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl">Sign In Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-success/10 border border-success/20">
                    <Shield className="h-4 w-4 text-success" />
                    <div className="text-left">
                      <h4 className="font-medium text-foreground text-sm">Confidential</h4>
                      <p className="text-xs text-muted-foreground">Private conversations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Heart className="h-4 w-4 text-primary" />
                    <div className="text-left">
                      <h4 className="font-medium text-foreground text-sm">Personalized</h4>
                      <p className="text-xs text-muted-foreground">Tailored support</p>
                    </div>
                  </div>
                </div>
                
                <AuthModal>
                  <Button size="lg" className="w-full shadow-soft hover:shadow-floating transition-all ease-bounce">
                    Sign In to Start Chatting
                  </Button>
                </AuthModal>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">MindfulMate AI Assistant</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Your Safe Space to Chat
            </h1>
            <p className="text-muted-foreground">
              I'm here to listen and support you through whatever you're going through.
            </p>
          </div>

          {/* Mood Selector */}
          {showMoodSelector && (
            <Card className="mb-6 shadow-soft border-border/50 bg-gradient-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getMoodIcon(moodRating)}
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium min-w-fit">Struggling</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={moodRating}
                      onChange={(e) => setMoodRating(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium min-w-fit">Great</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Rating: {moodRating}/10 - This helps me provide better support
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="flex-1 shadow-floating border-border/50 bg-gradient-card flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">Start Your Conversation</h3>
                      <p className="text-sm text-muted-foreground">
                        Share what's on your mind. I'm here to listen without judgment.
                      </p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.sender_type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {message.contains_crisis_keywords && message.sender_type === 'user' && (
                          <div className="flex items-center gap-2 mb-2 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Crisis support resources included in response</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 border border-border">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">MindfulMate is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Chat Input */}
              <div className="mt-6 flex gap-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  size="icon"
                  className="shadow-soft hover:shadow-floating transition-all ease-bounce"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Crisis Resources Footer */}
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  🆘 <strong>Crisis Support:</strong> If you're in immediate danger, call 911 or 988 (Suicide & Crisis Lifeline). 
                  Text "HELLO" to 741741 for Crisis Text Line.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;