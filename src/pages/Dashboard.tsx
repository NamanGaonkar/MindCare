import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BarChart2, Calendar, MessageSquare, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, sessions: 0, posts: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { count: bookings } = await supabase.from('counseling_bookings').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: sessions } = await supabase.from('chat_sessions').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: posts } = await supabase.from('peer_support_posts').select('id', { count: 'exact' }).eq('user_id', user.id);
        setStats({ bookings, sessions, posts });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchRecentSessions = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('chat_sessions')
          .select('id, title, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentSessions(data || []);
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentSessions()]);
      setLoading(false);
    };

    if (user) {
      loadData();

      const sessionListener = supabase
        .channel('public:chat_sessions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions', filter: `user_id=eq.${user.id}` }, () => {
          fetchRecentSessions();
          fetchStats();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(sessionListener);
      };
    }
  }, [user]);

  const statCards = [
    { title: "Appointments Booked", value: stats.bookings, icon: Calendar, color: "text-primary" },
    { title: "AI Chats Started", value: stats.sessions, icon: MessageSquare, color: "text-sky-500" },
    { title: "Community Posts", value: stats.posts, icon: Edit, color: "text-rose-500" },
    { title: "Wellness Score", value: "78/100", icon: Award, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.name || 'User'}</h1>
          <p className="text-muted-foreground">Here is your mental wellness dashboard.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Chat Sessions</CardTitle>
              <CardDescription>Review your recent conversations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(session.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/chat?session_id=${session.id}`}>Resume</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Your recent activity on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Activity feed content goes here */}
              <p className="text-muted-foreground">No recent activity.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
