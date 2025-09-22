import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, MessageCircle } from "lucide-react";
import FeatureCards from "@/components/FeatureCards";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
        <div className="container px-4 py-16 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            AI-Powered Mental Wellness
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Personal AI <span className="text-primary">Mental Health</span> Assistant
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant, confidential mental health support from our AI assistant trained specifically for students. Available 24/7, completely private.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link to="/chat">
                Start AI Chat <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
              <Link to="/resources">
                Explore Resources <Brain className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Features Section */}
      <FeatureCards />

      {/* Trust & Safety Section */}
      <div className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Students Trust Our AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with student privacy and mental health expertise at its core.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Confidential</h3>
              <p className="text-muted-foreground">Your conversations are completely private and never shared.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">Get support whenever you need it, day or night.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student-Focused</h3>
              <p className="text-muted-foreground">Specifically trained on student mental health challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;