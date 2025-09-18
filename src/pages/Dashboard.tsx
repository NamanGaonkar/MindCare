import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  BookOpen,
  TrendingUp,
  Activity,
  Heart,
  AlertTriangle
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalChatSessions: number;
  totalBookings: number;
  totalResources: number;
  urgentBookings: number;
  crisisIndicators: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalChatSessions: 0,
    totalBookings: 0,
    totalResources: 0,
    urgentBookings: 0,
    crisisIndicators: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    sessionTrends: [],
    bookingsByType: [],
    moodDistribution: []
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load basic stats
      const [profilesRes, sessionsRes, bookingsRes, resourcesRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('chat_sessions').select('id, created_at, mood_rating, crisis_indicators', { count: 'exact' }),
        supabase.from('counseling_bookings').select('id, booking_type, urgency_level', { count: 'exact' }),
        supabase.from('mental_health_resources').select('id', { count: 'exact' })
      ]);

      // Calculate stats
      const totalUsers = profilesRes.count || 0;
      const totalChatSessions = sessionsRes.count || 0;
      const totalBookings = bookingsRes.count || 0;
      const totalResources = resourcesRes.count || 0;
      
      const urgentBookings = bookingsRes.data?.filter(b => 
        b.urgency_level === 'high' || b.urgency_level === 'crisis'
      ).length || 0;
      
      const crisisIndicators = sessionsRes.data?.filter(s => 
        s.crisis_indicators && Object.keys(s.crisis_indicators).length > 0
      ).length || 0;

      setStats({
        totalUsers,
        totalChatSessions,
        totalBookings,
        totalResources,
        urgentBookings,
        crisisIndicators
      });

      // Prepare chart data
      const sessionTrends = generateSessionTrends(sessionsRes.data || []);
      const bookingsByType = generateBookingsChart(bookingsRes.data || []);
      const moodDistribution = generateMoodChart(sessionsRes.data || []);

      setChartData({
        sessionTrends,
        bookingsByType,
        moodDistribution
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSessionTrends = (sessions: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayStart = new Date(date).toISOString();
      const dayEnd = new Date(date + 'T23:59:59').toISOString();
      const count = sessions.filter(s => 
        s.created_at >= dayStart && s.created_at <= dayEnd
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: count
      };
    });
  };

  const generateBookingsChart = (bookings: any[]) => {
    const types = ['individual', 'group', 'crisis', 'follow_up'];
    return types.map(type => ({
      type: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
      count: bookings.filter(b => b.booking_type === type).length
    }));
  };

  const generateMoodChart = (sessions: any[]) => {
    const moodRanges = [
      { range: '1-3 (Low)', min: 1, max: 3, color: '#ef4444' },
      { range: '4-6 (Medium)', min: 4, max: 6, color: '#f59e0b' },
      { range: '7-10 (High)', min: 7, max: 10, color: '#10b981' }
    ];

    return moodRanges.map(range => ({
      range: range.range,
      count: sessions.filter(s => 
        s.mood_rating >= range.min && s.mood_rating <= range.max
      ).length,
      color: range.color
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Monitor platform usage, trends, and student wellbeing insights to improve mental health support.
            </p>
            
            <Card className="shadow-floating border-border/50 bg-gradient-card max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Access Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Please sign in to access the analytics dashboard.
                </p>
                <AuthModal>
                  <Button size="lg" className="w-full">
                    Sign In to View Dashboard
                  </Button>
                </AuthModal>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor platform usage and student wellbeing trends (anonymized data).
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                <MessageCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalChatSessions}</div>
                <p className="text-xs text-muted-foreground">Total AI conversations</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.urgentBookings} urgent/crisis
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crisis Indicators</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {loading ? '...' : stats.crisisIndicators}
                </div>
                <p className="text-xs text-muted-foreground">Sessions flagged</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Session Trends (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.sessionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.bookingsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.moodDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, count }) => `${range}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resource Usage</span>
                  <Badge variant="secondary">{stats.totalResources} available</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crisis Response</span>
                  <Badge variant={stats.crisisIndicators > 0 ? "destructive" : "default"}>
                    {stats.crisisIndicators === 0 ? 'All Clear' : `${stats.crisisIndicators} flagged`}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Status</span>
                  <Badge variant="default">Operational</Badge>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Export Crisis Reports
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Download Analytics Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;