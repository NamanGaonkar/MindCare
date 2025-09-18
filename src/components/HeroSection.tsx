import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Calendar, Heart, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-mental-health.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Hero background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero/80" />
      
      {/* Additional decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--secondary))_0%,transparent_50%)] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent))_0%,transparent_50%)] opacity-20" />
      
      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm px-4 py-2 shadow-soft">
            <Heart className="h-4 w-4 text-primary-foreground animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              Your mental wellness matters
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            A Safe Space for
            <span className="block bg-gradient-to-r from-primary-foreground via-white to-primary-foreground bg-clip-text text-transparent animate-pulse">
              Student Wellbeing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with support, access resources, and prioritize your mental health in a 
            stigma-free environment designed just for students.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/chat">
              <Button size="lg" variant="secondary" className="group shadow-floating hover:shadow-soft transition-all ease-bounce">
                <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Chat Support
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/booking">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 shadow-soft hover:shadow-floating transition-all ease-bounce">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm shadow-card">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mb-2 shadow-soft">
                <Heart className="h-6 w-6 text-success-foreground" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-1">Confidential</h3>
              <p className="text-sm text-primary-foreground/80 text-center">
                Your privacy is our priority
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm shadow-card">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mb-2 shadow-soft">
                <MessageCircle className="h-6 w-6 text-warning-foreground" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-1">24/7 Support</h3>
              <p className="text-sm text-primary-foreground/80 text-center">
                Available whenever you need us
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm shadow-card">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-2 shadow-soft">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-1">Professional Care</h3>
              <p className="text-sm text-primary-foreground/80 text-center">
                Licensed counselors ready to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;