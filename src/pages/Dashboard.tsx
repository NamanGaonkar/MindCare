import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, MessageCircle, Calendar, RefreshCw, Heart, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalChatSessions: 0, totalBookings: 0, urgentBookings: 0, crisisIndicators: 0 });
  const [chartData, setChartData] = useState({ sessionTrends: [], bookingsByType: [], moodDistribution: [] });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionsRes, bookingsRes, recentSessionsRes] = await Promise.all([
        supabase.from('chat_sessions').select('id, created_at, mood_rating, crisis_indicators', { count: 'exact' }),
        supabase.from('counseling_bookings').select('id, booking_type, urgency_level', { count: 'exact' }),
        supabase.from('chat_sessions').select('id, created_at, mood_rating').order('created_at', { ascending: false }).limit(5)
      ]);

      const totalChatSessions = sessionsRes.count || 0;
      const totalBookings = bookingsRes.count || 0;
      const urgentBookings = bookingsRes.data?.filter(b => b.urgency_level === 'high' || b.urgency_level === 'crisis').length || 0;
      const crisisIndicators = sessionsRes.data?.filter(s => s.crisis_indicators && Object.keys(s.crisis_indicators).length > 0).length || 0;

      setStats({ totalChatSessions, totalBookings, urgentBookings, crisisIndicators });

      const sessionTrends = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: sessionsRes.data?.filter(s => s.created_at.startsWith(date)).length || 0
      })).reverse();
      
      const bookingsByType = ['campus_counseling', 'crisis_support', 'group_therapy', 'consultation'].map(type => ({
        type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: bookingsRes.data?.filter(b => b.booking_type === type).length || 0
      }));

      const moodDistribution = [ { range: '1-3', color: '#ef4444' }, { range: '4-7', color: '#f59e0b' }, { range: '8-10', color: '#10b981' } ].map(r => ({
          ...r,
          count: sessionsRes.data?.filter(s => {
              const [min, max] = r.range.split('-').map(Number);
              return s.mood_rating >= min && s.mood_rating <= max;
          }).length || 0
      }));

      setChartData({ sessionTrends, bookingsByType, moodDistribution });
      setRecentSessions(recentSessionsRes.data || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg text-muted-foreground mb-8">Please sign in to view analytics.</p>
            <AuthModal><Button size="lg">Sign In</Button></AuthModal>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Analytics for MindCare.</p>
            </div>
            <Button onClick={loadDashboardData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Chat Sessions</CardTitle><MessageCircle className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.totalChatSessions}</div></CardContent></Card>
             <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Bookings</CardTitle><Calendar className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : stats.totalBookings}</div><p className="text-xs text-muted-foreground">{stats.urgentBookings} urgent</p></CardContent></Card>
             <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Crisis Indicators</CardTitle><AlertTriangle className="h-4 w-4 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{loading ? '...' : stats.crisisIndicators}</div></CardContent></Card>
             <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : 'N/A'}</div></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader><CardTitle>Session Trends (Last 7 Days)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.sessionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader><CardTitle>Mood Distribution</CardTitle></CardHeader>
                    <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                        <Pie data={chartData.moodDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={100} label>
                            {chartData.moodDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle>Recent AI Chat Sessions</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentSessions.map(session => (
                        <div key={session.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                            <p className="text-sm">Session <span className="font-mono text-xs">{session.id.substring(0,8)}...</span></p>
                            <div className="flex items-center gap-2">
                               <Heart className="h-4 w-4 text-primary" />
                               <span className="text-sm font-semibold">{session.mood_rating}/10</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
