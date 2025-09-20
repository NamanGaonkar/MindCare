import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Shield, Clock, Users, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

interface BookingFormData {
  bookingType: string;
  preferredDate: Date | undefined;
  preferredTime: string | null;
  sessionType: 'individual' | 'group' | 'crisis';
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
  contactPhone: string;
  topicAreas: string[];
  additionalNotes: string;
}

const Booking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    bookingType: "",
    preferredDate: new Date(),
    preferredTime: "10:00",
    sessionType: "individual",
    urgencyLevel: "medium",
    contactPhone: "",
    topicAreas: [],
    additionalNotes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to book an appointment.", variant: "destructive" });
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast({ title: "Missing Information", description: "Please select a preferred date and time.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Format date to 'YYYY-MM-DD' to avoid timezone issues and match 'date' type in DB
      const date = new Date(formData.preferredDate);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const { error } = await supabase.from('counseling_bookings').insert({
        user_id: user.id,
        booking_type: formData.bookingType,
        preferred_date: formattedDate, // Sending date in YYYY-MM-DD format
        preferred_time: formData.preferredTime, // Sending time in HH:mm format
        session_type: formData.sessionType,
        urgency_level: formData.urgencyLevel,
        contact_phone: formData.contactPhone,
        topic_areas: formData.topicAreas,
        additional_notes: formData.additionalNotes,
        status: 'pending'
      });

      if (error) throw error;

      toast({ title: "Booking Submitted! 📅", description: "Your appointment request has been received. We'll contact you shortly." });

      // Reset form
      setFormData({
        bookingType: "",
        preferredDate: new Date(),
        preferredTime: "10:00",
        sessionType: "individual",
        urgencyLevel: "medium",
        contactPhone: "",
        topicAreas: [],
        additionalNotes: ""
      });

    } catch (error: any) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Submission Error",
        description: `Failed to submit booking. ${error.message || "Please try again or contact support."}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topicAreas: prev.topicAreas.includes(topic)
        ? prev.topicAreas.filter((t: string) => t !== topic)
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Sign In to Book Appointment</h1>
            <p className="text-lg text-muted-foreground mb-8">Please sign in to access our booking system and schedule your confidential appointment.</p>
            <AuthModal><Button size="lg">Sign In to Continue</Button></AuthModal>
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Schedule Your Appointment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Book private, confidential appointments with licensed campus counselors and mental health professionals.</p>
          </div>

          <Card className="shadow-floating border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              <CardDescription>Fill out the form below to schedule your confidential session</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookingType">Service Type *</Label>
                    <Select required value={formData.bookingType} onValueChange={(value: string) => setFormData((prev) => ({ ...prev, bookingType: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
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
                    <Select value={formData.sessionType} onValueChange={(value: BookingFormData['sessionType']) => setFormData((prev) => ({ ...prev, sessionType: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual (60 min)</SelectItem>
                        <SelectItem value="group">Group (90 min)</SelectItem>
                        <SelectItem value="crisis">Crisis (90 min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                    <DayPicker mode="single" selected={formData.preferredDate} onSelect={(date) => setFormData((prev) => ({ ...prev, preferredDate: date }))} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time *</Label>
                    <TimePicker onChange={(time) => setFormData((prev) => ({ ...prev, preferredTime: time }))} value={formData.preferredTime} className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <Select value={formData.urgencyLevel} onValueChange={(value: BookingFormData['urgencyLevel']) => setFormData((prev) => ({ ...prev, urgencyLevel: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Input type="tel" value={formData.contactPhone} onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Areas of Concern</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {topicOptions.map((topic) => (
                      <Button key={topic} type="button" variant={formData.topicAreas.includes(topic) ? "default" : "outline"} size="sm" onClick={() => handleTopicToggle(topic)} className="justify-start">{topic}</Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea value={formData.additionalNotes} onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))} placeholder="Share anything that might help us prepare..." rows={4} />
                </div>

                <div className="bg-muted/30 p-4 rounded-lg flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Your Privacy is Protected</p>
                    <p>Your information is confidential and will only be used to coordinate your appointment. We adhere to strict privacy guidelines.</p>
                  </div>
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting..." : "Schedule Appointment"}</Button>
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
