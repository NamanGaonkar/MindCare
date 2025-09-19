import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Calendar, Brain, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-secondary px-4 py-2">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-secondary-foreground">
              Your mental wellness matters
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            A Safe Space for
            <span className="block text-primary">
              Student Wellbeing
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with support, access resources, and prioritize your mental health in a
            stigma-free environment designed just for students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/chat">
              <Button size="lg" className="group">
                <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Chat Support
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/booking">
              <Button size="lg" variant="secondary" className="group">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Confidential</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your privacy is our priority
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">24/7 Support</h3>
              <p className="text-sm text-muted-foreground text-center">
                Available whenever you need us
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Professional Care</h3>
              <p className="text-sm text-muted-foreground text-center">
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
