import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, User, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Booking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !date) {
      toast({ title: "Authentication or Date Missing", description: "Please sign in and select a date.", variant: "destructive" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setLoading(true);
    try {
      const { error } = await supabase.from('counseling_bookings').insert({
        user_id: user.id,
        preferred_date: format(date, "yyyy-MM-dd"),
        preferred_time: data.time,
        session_type: data.sessionType,
        additional_notes: data.notes,
        status: 'pending'
      });

      if (error) throw error;

      toast({ title: "Booking Submitted!", description: "We will contact you to confirm." });
      e.currentTarget.reset();
      setDate(new Date());

    } catch (error: any) {
      toast({ title: "Submission Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="container text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to book an appointment.</p>
          <AuthModal><Button>Sign In</Button></AuthModal>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="bg-background">
      <Navigation />
      <div className="container py-12 px-4">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Book a Counseling Session</h1>
                <p className="mt-3 text-lg text-muted-foreground">Find a time that works for you. All sessions are confidential.</p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Session Type</Label>
                                <Select name="sessionType" defaultValue="individual">
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual"><div className="flex items-center gap-2"><User className="h-4 w-4"/>Individual</div></SelectItem>
                                        <SelectItem value="group"><div className="flex items-center gap-2"><Users className="h-4 w-4"/>Group</div></SelectItem>
                                        <SelectItem value="crisis"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4"/>Crisis Support</div></SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Preferred Time</Label>
                                <Select name="time" defaultValue="10:00">
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map(time => (
                                            <SelectItem key={time} value={time}><div className="flex items-center gap-2"><Clock className="h-4 w-4"/>{time}</div></SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label>Preferred Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            
                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea id="notes" name="notes" placeholder="Anything specific you'd like to discuss?" rows={4}/>
                            </div>
                        </div>
                    </CardContent>
                    <div className="border-t p-6 flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Request Appointment'}</Button>
                    </div>
                </form>
            </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
