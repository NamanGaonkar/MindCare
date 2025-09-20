import { useState } from "react";
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


const Booking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: "",
    preferredDate: new Date(),
    preferredTime: "10:00",
    sessionType: "individual",
    urgencyLevel: "medium",
    contactPhone: "",
    topicAreas: [],
    additionalNotes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast({ title: "Missing Information", description: "Please select a date and time.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formattedDate = formData.preferredDate.toISOString().split('T')[0];

      const { error } = await supabase.from('counseling_bookings').insert({
        user_id: user.id,
        booking_type: formData.bookingType,
        preferred_date: formattedDate,
        preferred_time: formData.preferredTime,
        session_type: formData.sessionType,
        urgency_level: formData.urgencyLevel,
        contact_phone: formData.contactPhone,
        topic_areas: formData.topicAreas,
        additional_notes: formData.additionalNotes,
        status: 'pending'
      });

      if (error) throw error;

      toast({ title: "Booking Submitted!" });
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

    } catch (error) {
      toast({ title: "Submission Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = [
    "Anxiety", "Depression", "Stress Management", "Relationships", "Academic Pressure",
    "Sleep Issues", "Self-Esteem", "Grief & Loss", "Addiction", "Other"
  ];

  if (!user) {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container px-4 py-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Sign In to Book Appointment</h1>
                <p className="text-lg text-muted-foreground mb-8">Access our booking system and schedule your confidential appointment.</p>
                <AuthModal><Button size="lg">Sign In to Continue</Button></AuthModal>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Schedule Your Appointment</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our platform provides a secure and confidential way to book appointments with licensed counselors. If you are in crisis, please contact the helpline at +91 98765 43210.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
                <CardHeader><CardTitle>Campus Counseling</CardTitle></CardHeader>
                <CardContent><p>Connect with our on-campus counselors for confidential, one-on-one sessions. They can help with a wide range of issues, from academic stress to personal growth.</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Crisis Support</CardTitle></CardHeader>
                <CardContent><p>For urgent matters, our crisis support team is available to provide immediate assistance. These sessions are designed to help you navigate through difficult moments.</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Group Therapy</CardTitle></CardHeader>
                <CardContent><p>Join a group of peers to share experiences and learn from others in a supportive environment. Group sessions are led by a qualified facilitator.</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Consultation</CardTitle></CardHeader>
                <CardContent><p>Not sure what you need? A consultation is a brief, informal chat to help you understand your options and decide on the best path forward.</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Form</CardTitle>
              <CardDescription>Fill out the form to schedule your session.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Select required value={formData.bookingType} onValuechange={(value) => setFormData(prev => ({ ...prev, bookingType: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campus_counseling">Campus Counseling</SelectItem>
                        <SelectItem value="crisis_support">Crisis Support</SelectItem>
                        <SelectItem value="group_therapy">Group Therapy</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input type="tel" value={formData.contactPhone} onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Date *</Label>
                    <DayPicker mode="single" selected={formData.preferredDate} onSelect={(date) => setFormData(prev => ({ ...prev, preferredDate: date }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Time *</Label>
                    <Input type='time' value={formData.preferredTime} onChange={(e) => setFormData(prev => ({...prev, preferredTime: e.target.value}))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea value={formData.additionalNotes} onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))} placeholder="Anything else you'd like to share?" />
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