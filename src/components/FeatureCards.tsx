import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  BarChart3, 
  Brain,
  Shield,
  Clock,
  ArrowRight
} from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Get immediate help with our AI-guided chatbot that provides coping strategies and gentle guidance.",
      benefits: ["24/7 availability", "Personalized responses", "Crisis intervention"],
      href: "/chat",
      gradient: "from-primary to-primary-dark",
      iconBg: "bg-primary"
    },
    {
      icon: Calendar,
      title: "Confidential Booking",
      description: "Schedule private appointments with campus counselors and mental health professionals.",
      benefits: ["Complete privacy", "Flexible scheduling", "Professional support"],
      href: "/booking", 
      gradient: "from-secondary to-success",
      iconBg: "bg-secondary"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access guided meditations, wellness videos, and educational content in multiple languages.",
      benefits: ["Multilingual content", "Self-paced learning", "Evidence-based resources"],
      href: "/resources",
      gradient: "from-accent to-primary-light",
      iconBg: "bg-accent"
    },
    {
      icon: Users,
      title: "Peer Support Forum",
      description: "Connect with fellow students in a safe, moderated community space.",
      benefits: ["Peer connections", "Trained moderators", "Anonymous participation"],
      href: "/forum",
      gradient: "from-success to-secondary",
      iconBg: "bg-success"
    },
    {
      icon: BarChart3,
      title: "Wellness Analytics",
      description: "Institutional dashboard for understanding campus mental health trends and needs.",
      benefits: ["Anonymous insights", "Trend analysis", "Program planning"],
      href: "/admin",
      gradient: "from-warning to-accent",
      iconBg: "bg-warning"
    }
  ];

  return (
    <section className="py-16 bg-background relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--muted))_0%,transparent_70%)] opacity-50" />
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Comprehensive Support</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="block text-primary">Mental Wellness</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides multiple pathways to support, ensuring every student can find help in their preferred way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={feature.title} className="group relative overflow-hidden shadow-card hover:shadow-floating transition-all duration-300 ease-bounce border-border/50 hover:border-primary/30">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardHeader className="relative">
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300 ease-bounce`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <ul className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <Link to={feature.href}>
                  <Button variant="ghost" size="sm" className="w-full group/btn hover:bg-primary/10 transition-all">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick access section */}
        <div className="bg-gradient-card rounded-2xl p-8 shadow-floating border border-border/50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Secure</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center space-x-2 text-success">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">24/7</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center space-x-2 text-accent-foreground">
                  <Brain className="h-5 w-5" />
                  <span className="font-medium">Confidential</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Need immediate support?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our crisis support is available 24/7 for urgent situations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="shadow-soft hover:shadow-floating transition-all ease-bounce">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Crisis Chat
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover:bg-muted/50 transition-all ease-gentle">
                Call Campus Hotline: (555) 123-HELP
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;