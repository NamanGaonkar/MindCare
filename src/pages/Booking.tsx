import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Shield, Clock, Users, Phone, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

const Booking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: "",
    preferredDate: "",
    preferredTime: "",
    sessionType: "individual",
    urgencyLevel: "medium",
    contactPhone: "",
    topicAreas: [] as string[],
    additionalNotes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('counseling_bookings')
        .insert({
          user_id: user.id,
          booking_type: formData.bookingType,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          session_type: formData.sessionType as 'individual' | 'group' | 'crisis',
          urgency_level: formData.urgencyLevel as 'low' | 'medium' | 'high' | 'crisis',
          contact_phone: formData.contactPhone,
          topic_areas: formData.topicAreas,
          additional_notes: formData.additionalNotes,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking submitted! 📅",
        description: "Your appointment request has been received. We'll contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        bookingType: "",
        preferredDate: "",
        preferredTime: "",
        sessionType: "individual",
        urgencyLevel: "medium",
        contactPhone: "",
        topicAreas: [],
        additionalNotes: ""
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error submitting booking",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topicAreas: prev.topicAreas.includes(topic)
        ? prev.topicAreas.filter(t => t !== topic)
        : [...prev.topicAreas, topic]
    }));
  };

  const topicOptions = [
    "Anxiety", "Depression", "Stress Management", "Relationships", "Academic Pressure",
    "Sleep Issues", "Self-Esteem", "Grief & Loss", "Addiction", "Other"
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-secondary/20 px-4 py-2 mb-4">
              <Calendar className="h-4 w-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Authentication Required</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sign In to Book Appointment
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Please sign in to access our booking system and schedule your confidential appointment.
            </p>
            
            <AuthModal>
              <Button size="lg">
                Sign In to Continue
              </Button>
            </AuthModal>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span>Campus Counseling</span>
                </CardTitle>
                <CardDescription>
                  Meet with licensed counselors at the campus wellness center
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Completely confidential</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Individual or group sessions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span>Crisis Support</span>
                </CardTitle>
                <CardDescription>
                  Immediate support for urgent mental health situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Emergency intervention</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Trained crisis counselors</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span>Group Therapy</span>
                </CardTitle>
                <CardDescription>
                  Join supportive group sessions with other students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Peer support groups</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Weekly sessions</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>Safe, moderated environment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <Card className="shadow-floating border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              <CardDescription>
                Fill out the form below to schedule your confidential session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookingType">Service Type *</Label>
                    <Select value={formData.bookingType} onValueChange={(value) => setFormData(prev => ({ ...prev, bookingType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campus_counseling">Campus Counseling</SelectItem>
                        <SelectItem value="crisis_support">Crisis Support</SelectItem>
                        <SelectItem value="group_therapy">Group Therapy</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionType">Session Type</Label>
                    <Select value={formData.sessionType} onValueChange={(value) => setFormData(prev => ({ ...prev, sessionType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual (60 min)</SelectItem>
                        <SelectItem value="group">Group (90 min)</SelectItem>
                        <SelectItem value="crisis">Crisis (90 min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time *</Label>
                    <Input
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <Select value={formData.urgencyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, urgencyLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait a week</SelectItem>
                        <SelectItem value="medium">Medium - Within few days</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                        <SelectItem value="crisis">Crisis - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Concern (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {topicOptions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        variant={formData.topicAreas.includes(topic) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTopicToggle(topic)}
                        className="justify-start"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Please share any additional information that might help us prepare for your session..."
                    rows={4}
                  />
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Privacy Notice</p>
                      <p>Your information is completely confidential and will only be used to coordinate your appointment. We follow strict HIPAA guidelines to protect your privacy.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !formData.bookingType || !formData.preferredDate || !formData.preferredTime}
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Submitting..." : "Schedule Appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;