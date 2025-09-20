import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, MessageSquare, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SessionTypePieChart, DailyActivityBarChart } from "@/components/Charts";
import MoodTracker from "@/components/MoodTracker";
import Journaling from "@/components/Journaling";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, sessions: 0, posts: 0 });
  const [chartData, setChartData] = useState({ pieChart: [], barChart: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch main stats
        const { count: bookings } = await supabase.from('counseling_bookings').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: sessions } = await supabase.from('chat_sessions').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: posts } = await supabase.from('peer_support_posts').select('id', { count: 'exact' }).eq('user_id', user.id);
        setStats({ bookings: bookings || 0, sessions: sessions || 0, posts: posts || 0 });

        // Fetch data for pie chart
        const { data: pieData, error: pieError } = await supabase
          .from('counseling_bookings')
          .select('booking_type')
          .eq('user_id', user.id);
        if (pieError) throw pieError;

        const pieChartData = pieData.reduce((acc, booking) => {
          const type = booking.booking_type.replace('_', ' ');
          const existing = acc.find(item => item.label === type);
          if (existing) {
            existing.value++;
          } else {
            acc.push({ label: type, value: 1 });
          }
          return acc;
        }, []);

        // Fetch data for bar chart
        const { data: barData, error: barError } = await supabase.rpc('get_user_daily_activity', { user_id_param: user.id });
        if (barError) throw barError;
        
        setChartData({ pieChart: pieChartData, barChart: barData });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.name || 'User'}</h1>
          <p className="text-muted-foreground">Here is your mental wellness dashboard.</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <MoodTracker />
          <Journaling />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>A breakdown of your booked sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.pieChart.length > 0 ? <SessionTypePieChart data={chartData.pieChart} /> : <p>No session data yet.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Your recent sessions and posts.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.barChart.length > 0 ? <DailyActivityBarChart data={chartData.barChart} /> : <p>No activity data yet.</p>}
            </CradContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;