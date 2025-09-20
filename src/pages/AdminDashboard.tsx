import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";

const AdminDashboard = () => {
  // Mock data for now, will be replaced with actual data from Supabase
  const totalStudents = 0;
  const chatSessions = 2;
  const bookings = 0;
  const crisisIndicators = 0;

  const sessionTrendsData = {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Sessions',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#36A2EB',
      tension: 0.1
    }]
  };

  const bookingTypesData = {
    labels: ['Individual', 'Group', 'Crisis', 'Follow up'],
    datasets: [{
      label: 'Bookings',
      data: [0, 0, 0, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  const moodDistributionData = {
    labels: ['1-3 (Low)', '4-6 (Medium)', '7-10 (High)'],
    datasets: [{
      data: [0, 2, 0],
      backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
    }]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform usage and student wellbeing trends (anonymized data).</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card><CardHeader><CardTitle>Total Students</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalStudents}</p><p className="text-xs text-muted-foreground">Registered users</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Chat Sessions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{chatSessions}</p><p className="text-xs text-muted-foreground">Total AI conversations</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Bookings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{bookings}</p><p className="text-xs text-muted-foreground">0 urgent/crisis</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Crisis Indicators</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{crisisIndicators}</p><p className="text-xs text-muted-foreground">Sessions flagged</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card><CardHeader><CardTitle>Session Trends (Last 7 Days)</CardTitle></CardHeader><CardContent><Line data={sessionTrendsData} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Booking Types</CardTitle></CardHeader><CardContent><Bar data={bookingTypesData} /></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card><CardHeader><CardTitle>Mood Distribution</CardTitle></CardHeader><CardContent><Pie data={moodDistributionData} /></CardContent></Card>
            <Card>
                <CardHeader><CardTitle>Platform Health</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-2"><p>Resource Usage</p><span className="text-sm font-semibold">5 available</span></div>
                    <div className="flex justify-between items-center mb-2"><p>Crisis Response</p><span className="text-sm font-semibold text-orange-500">All Clear</span></div>
                    <div className="flex justify-between items-center mb-4"><p>System Status</p><span className="text-sm font-semibold text-green-500">Operational</span></div>
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg">Export Crisis Reports</button>
                </CardContent>
            </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
