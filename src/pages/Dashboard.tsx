import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, MessageSquare, Edit, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DailyActivityBarChart } from "@/components/Charts";
import MoodTracker from "@/components/MoodTracker";
import Journaling from "@/components/Journaling";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    sessions: 0, 
    messages: 0, 
    posts: 0, 
    totalChatTime: 0 
  });
  const [chartData, setChartData] = useState({ barChart: [], moodData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch main stats
        const { count: sessions } = await supabase.from('chat_sessions').select('id', { count: 'exact' }).eq('user_id', user.id);
        const { count: messages } = await supabase.from('chat_messages').select('id', { count: 'exact' }).eq('user_id', user.id).eq('sender_type', 'user');
        const { count: posts } = await supabase.from('peer_support_posts').select('id', { count: 'exact' }).eq('user_id', user.id);
        
        // Calculate approximate chat time (assume 2 mins per message)
        const totalChatTime = (messages || 0) * 2;
        
        setStats({ 
          sessions: sessions || 0, 
          messages: messages || 0, 
          posts: posts || 0, 
          totalChatTime 
        });

        // Fetch data for bar chart (daily activity)
        const { data: barData, error: barError } = await supabase.rpc('get_user_daily_activity', { user_id_param: user.id });
        if (barError) throw barError;

        // Fetch mood data
        const { data: moodData, error: moodError } = await supabase
          .from('mood_entries')
          .select('mood_value, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);
        if (moodError) throw moodError;
        
        setChartData({ barChart: barData || [], moodData: moodData || [] });

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
    { title: "AI Chat Sessions", value: stats.sessions, icon: MessageSquare, color: "text-primary" },
    { title: "Messages Sent", value: stats.messages, icon: Edit, color: "text-blue-500" },
    { title: "Community Posts", value: stats.posts, icon: Edit, color: "text-rose-500" },
    { title: "Chat Time (mins)", value: stats.totalChatTime, icon: Clock, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</h1>
          <p className="text-muted-foreground">Track your AI chat usage and mental wellness journey.</p>
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
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Your recent AI chat sessions and community posts.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.barChart.length > 0 ? <DailyActivityBarChart data={chartData.barChart} /> : <p>No activity data yet. Start your first chat!</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Track your mood over time.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.moodData.length > 0 ? (
                <div className="space-y-2">
                  <p>Recent mood entries: {chartData.moodData.length}</p>
                  <p>Latest mood: {chartData.moodData[0]?.mood_value}/10</p>
                </div>
              ) : (
                <p>No mood data yet. Use the mood tracker to get started!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;