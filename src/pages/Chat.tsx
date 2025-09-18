import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Brain, Shield, Heart } from "lucide-react";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Chat Support</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              24/7 Mental Health Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with our AI-guided chatbot for immediate support, coping strategies, and gentle guidance towards professional help when needed.
            </p>
          </div>

          <Card className="shadow-floating border-border/50 bg-gradient-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                  <Brain className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-xl">AI Mental Health Assistant</CardTitle>
              <CardDescription>
                This feature requires the Supabase integration to connect with the Gemini API for AI responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-success/10 border border-success/20">
                  <Shield className="h-5 w-5 text-success" />
                  <div>
                    <h3 className="font-medium text-foreground">Confidential</h3>
                    <p className="text-sm text-muted-foreground">Private conversations</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">24/7 Available</h3>
                    <p className="text-sm text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <Heart className="h-5 w-5 text-accent-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Caring</h3>
                    <p className="text-sm text-muted-foreground">Empathetic responses</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  To enable the AI chatbot with Gemini API, connect your project to Supabase.
                </p>
                <Button size="lg" className="shadow-soft hover:shadow-floating transition-all ease-bounce">
                  Connect Supabase to Enable Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;