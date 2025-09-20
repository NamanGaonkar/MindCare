import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Calendar, Users, BookOpen, Shield } from "lucide-react";

const Home = () => {
  const features = [
    { 
      icon: MessageCircle, 
      title: "Chat Support", 
      description: "Connect with our AI chatbot for immediate, confidential support, 24/7.",
      link: "/chat"
    },
    { 
      icon: Calendar, 
      title: "Book Appointments", 
      description: "Schedule secure, private sessions with licensed campus counselors.",
      link: "/booking"
    },
    { 
      icon: Users, 
      title: "Peer Community", 
      description: "Join our anonymous forum to share experiences and find support.",
      link: "/peer-support"
    },
    { 
      icon: BookOpen, 
      title: "Wellness Resources", 
      description: "Explore a curated library of articles, videos, and tools for mental well-being.",
      link: "/resources"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <main className="container px-4 py-16 sm:py-24 text-center">
        <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
          Your Safe Space for Mental Wellness
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Find Your Balance, Find Your Peace
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          MindCare provides confidential, accessible mental health support tailored for students. You're not alone—we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/chat">Chat Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/booking">Book a Session</Link>
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-16 sm:py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">A Comprehensive Support System</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mt-4">
              Everything you need to support your mental wellness journey, all in one confidential platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto text-primary">
                    <Link to={feature.link}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Confidentiality Section */}
      <section className="py-16 sm:py-24">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto bg-muted/50 border border-border/50 rounded-xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="p-5 rounded-full bg-primary/10">
                        <Shield className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Privacy is Our Priority</h2>
                        <p className="text-muted-foreground mb-4">
                            We are committed to providing a secure and confidential environment. All your interactions on this platform are encrypted and protected. Feel safe to share and seek help without any fear.
                        </p>
                        <Button variant="secondary" asChild>
                           <Link to="/privacy">Read Our Privacy Policy</Link>
                        </Button>
                    </div>
                </div>
            </div>
          </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
