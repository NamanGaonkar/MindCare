import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarClock, BookOpen, MessageSquare, TrendingUp, Activity } from "lucide-react";
import { ResponsiveContainer, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart, PieChart, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalPosts: 0,
    totalSessions: 0
  });
  const [chartData, setChartData] = useState({
    bookingTypes: [],
    dailyActivity: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch basic stats (admin can see all)
        const { count: totalUsers } = await supabase.from('profiles').select('id', { count: 'exact' });
        const { count: totalBookings } = await supabase.from('counseling_bookings').select('id', { count: 'exact' });
        const { count: totalPosts } = await supabase.from('peer_support_posts').select('id', { count: 'exact' });
        const { count: totalSessions } = await supabase.from('chat_sessions').select('id', { count: 'exact' });

        setStats({
          totalUsers: totalUsers || 0,
          totalBookings: totalBookings || 0,
          totalPosts: totalPosts || 0,
          totalSessions: totalSessions || 0
        });

        // Fetch booking types data
        const { data: bookings } = await supabase
          .from('counseling_bookings')
          .select('booking_type');

        const bookingTypesData = bookings?.reduce((acc, booking) => {
          const type = booking.booking_type.replace('_', ' ');
          const existing = acc.find(item => item.name === type);
          if (existing) {
            existing.value++;
          } else {
            acc.push({ name: type, value: 1 });
          }
          return acc;
        }, []) || [];

        // Fetch daily activity for last 7 days
        const { data: dailyData } = await supabase.rpc('get_session_trends');
        
        // Simulate user growth data
        const userGrowthData = [
          { month: 'Jan', users: 45 },
          { month: 'Feb', users: 78 },
          { month: 'Mar', users: 134 },
          { month: 'Apr', users: 189 },
          { month: 'May', users: 267 },
          { month: 'Jun', users: 324 },
        ];

        setChartData({
          bookingTypes: bookingTypesData,
          dailyActivity: dailyData || [],
          userGrowth: userGrowthData
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Total Bookings", value: stats.totalBookings, icon: CalendarClock, color: "text-green-500" },
    { title: "Community Posts", value: stats.totalPosts, icon: MessageSquare, color: "text-purple-500" },
    { title: "AI Sessions", value: stats.totalSessions, icon: Activity, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
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
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform activity and user engagement</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((card, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">Platform total</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.bookingTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      dataKey="value" 
                      data={chartData.bookingTypes} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      fill="#8884d8" 
                      label 
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No booking data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Session Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.dailyActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No activity data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Privacy Notice</h3>
          <p className="text-sm text-muted-foreground">
            This dashboard shows platform statistics and general usage data. 
            Individual student chat messages remain completely private and are never accessible to administrators.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;