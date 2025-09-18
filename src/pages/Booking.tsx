import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Shield, Clock, Users } from "lucide-react";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 rounded-full bg-secondary/20 px-4 py-2 mb-4">
              <Calendar className="h-4 w-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Confidential Booking</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Schedule Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book private, confidential appointments with licensed campus counselors and mental health professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span>Campus Counseling</span>
                </CardTitle>
                <CardDescription>
                  Meet with licensed counselors at the campus wellness center
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Completely confidential</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="h-4 w-4 text-accent-foreground" />
                    <span>Individual or group sessions</span>
                  </div>
                </div>
                <Button className="w-full" variant="secondary">
                  Book Campus Appointment
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span>Crisis Support</span>
                </CardTitle>
                <CardDescription>
                  Immediate support for urgent mental health situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Clock className="h-4 w-4 text-success" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Emergency intervention</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="h-4 w-4 text-accent-foreground" />
                    <span>Trained crisis counselors</span>
                  </div>
                </div>
                <Button className="w-full">
                  Emergency Booking
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 shadow-floating border-border/50 bg-gradient-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Ready to connect your booking system?
              </h3>
              <p className="text-muted-foreground mb-6">
                Enable appointment scheduling by connecting to Supabase for secure data storage and booking management.
              </p>
              <Button size="lg" className="shadow-soft hover:shadow-floating transition-all ease-bounce">
                Connect Supabase for Booking System
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Booking;