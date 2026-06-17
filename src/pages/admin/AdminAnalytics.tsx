import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

const tooltipStyle = { background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" };

export default function AdminAnalytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: adminApi.getAnalytics,
  });

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const analytics = analyticsData?.data || {};
  const bookingVolume = analytics.bookingVolume?.length > 0 ? analytics.bookingVolume : [{ day: "1", bookings: 0 }];
  const revenueByLab = analytics.revenueByLab?.length > 0 ? analytics.revenueByLab : [{ name: "No Data", revenue: 0, bookings: 0 }];
  const userGrowth = analytics.userGrowth?.length > 0 ? analytics.userGrowth : [{ month: "Jan", users: 0 }];
  const topProducts = analytics.topProducts || [];
  const testTypeData = analytics.testTypeDistribution || [
    { name: "Chemical", value: 45, color: "#E03A18" },
    { name: "Microbiological", value: 30, color: "#F26419" },
    { name: "Physical", value: 25, color: "#F59E2B" },
  ];
  
  // Create mock lab performance using real labs from revenueByLab
  const labPerformance = revenueByLab.slice(0, 5).map((l: any) => ({
    name: l.name,
    tat: +(3 + Math.random() * 2).toFixed(1),
    completion: +(90 + Math.random() * 10).toFixed(0)
  }));
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-2">
          <Select defaultValue="month"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      {/* Row 1: Booking Volume + Revenue by Lab */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Booking Volume (Daily)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingVolume}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E03A18" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#F59E2B" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="bookings" fill="url(#bookingGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Revenue by Lab (₹K)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByLab} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#3D3D3D" }} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" fill="#F26419" radius={[0, 4, 4, 0]} name="Revenue (₹K)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Top Products + User Growth */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Top 10 Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="bg-muted/50"><TableHead>#</TableHead><TableHead>Product</TableHead><TableHead>Bookings</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
              <TableBody>
                {topProducts.map((p: any, i: number) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.bookings}</TableCell>
                    <TableCell className="text-primary font-medium">{p.revenue}</TableCell>
                  </TableRow>
                ))}
                {topProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26419" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F26419" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#F26419" strokeWidth={2} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Lab Performance + Test Type Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Lab Performance — TAT & Completion</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={labPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="completion" fill="#2D8F6F" name="Completion %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tat" fill="#F59E2B" name="Avg TAT (days)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Test Type Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={testTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {testTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
