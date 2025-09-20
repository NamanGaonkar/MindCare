import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BarChart2, Calendar, MessageSquare, Edit, Trash2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ bookings: 0, sessions: 0, posts: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { count: bookings } = await supabase.from('counseling_bookings').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: sessions } = await supabase.from('chat_sessions').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: posts } = await supabase.from('peer_support_posts').select('id', { count: 'exact' }).eq('user_id', user.id);
        setStats({ bookings: bookings || 0, sessions: sessions || 0, posts: posts || 0 });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchRecentSessions = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('chat_sessions')
          .select('id, title, created_at, mood_rating')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentSessions(data || []);
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
      }
    };

    const fetchRecentBookings = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('counseling_bookings')
          .select('id, booking_type, preferred_date, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        setRecentBookings(data || []);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentSessions(), fetchRecentBookings()]);
      setLoading(false);
    };

    if (user) {
      loadData();

      // Set up real-time listeners
      const sessionListener = supabase
        .channel('dashboard-sessions')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'chat_sessions', 
          filter: `user_id=eq.${user.id}` 
        }, () => {
          fetchRecentSessions();
          fetchStats();
        })
        .subscribe();

      const bookingListener = supabase
        .channel('dashboard-bookings')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'counseling_bookings', 
          filter: `user_id=eq.${user.id}` 
        }, () => {
          fetchRecentBookings();
          fetchStats();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(sessionListener);
        supabase.removeChannel(bookingListener);
      };
    }
  }, [user]);

  const deleteSession = async (sessionId) => {
    try {
      // Delete messages first
      await supabase.from('chat_messages').delete().eq('session_id', sessionId);
      // Then delete session
      const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
      if (error) throw error;
      toast({ title: "Chat session deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting session", description: error.message, variant: "destructive" });
    }
  };

  const statCards = [
    { title: "Appointments Booked", value: stats.bookings, icon: Calendar, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "AI Chats Started", value: stats.sessions, icon: MessageSquare, color: "text-sky-500", bgColor: "bg-sky-500/10" },
    { title: "Community Posts", value: stats.posts, icon: Edit, color: "text-rose-500", bgColor: "bg-rose-500/10" },
    { title: "Wellness Score", value: "78/100", icon: Award, color: "text-green-500", bgColor: "bg-green-500/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground">Here's your mental wellness dashboard overview.</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <motion.div 
                    className={`h-12 w-12 rounded-full ${card.bgColor} flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring", bounce: 0.5 }}
                  >
                    {card.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent AI Chat Sessions
                </CardTitle>
                <CardDescription>Review and manage your recent conversations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.length > 0 ? recentSessions.map((session, index) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/20 hover:from-muted to-muted/40 transition-all duration-300 border border-border/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{session.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(session.created_at).toLocaleDateString()}</span>
                          {session.mood_rating && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              Mood: {session.mood_rating}/10
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/chat?session_id=${session.id}`} className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Resume
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteSession(session.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">No chat sessions yet. Start your first conversation!</p>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link to="/chat">Start New Chat</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Bookings
                </CardTitle>
                <CardDescription>Your appointment booking history.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/20 border border-border/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium capitalize">
                            {booking.booking_type?.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.preferred_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">No bookings yet. Schedule your first appointment!</p>
                  )}
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/booking">Book Appointment</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
