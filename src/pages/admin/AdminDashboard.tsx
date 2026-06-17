import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, ClipboardList, DollarSign, Clock, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useQuery({ queryKey: ["adminStats"], queryFn: adminApi.getStats });
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({ queryKey: ["adminBookings"], queryFn: adminApi.getBookings });
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({ queryKey: ["adminAnalytics"], queryFn: adminApi.getAnalytics });
  const { data: labsData, isLoading: labsLoading } = useQuery({ queryKey: ["adminLabs"], queryFn: adminApi.getLabs });

  const isLoading = statsLoading || bookingsLoading || analyticsLoading || labsLoading;

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const stats = statsData?.data || { totalUsers: 0, totalLabs: 0, totalBookings: 0, totalRevenue: 0 };
  const rawBookings = bookingsData?.data || [];
  const labs = labsData?.data || [];
  const analytics = analyticsData?.data || { bookingVolume: [] };

  const pendingBookings = rawBookings.filter((b: any) => b.status === "Pending" || b.status === "PENDING").slice(0, 5);

  const kpis = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, trend: "+12%", up: true },
    { label: "Active Labs", value: stats.totalLabs.toLocaleString(), icon: Building2, trend: "+3", up: true },
    { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), icon: ClipboardList, trend: "+8%", up: true },
    { label: "Total Revenue", value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, trend: "+15%", up: true },
    { label: "Pending Approvals", value: pendingBookings.length.toString(), icon: Clock, trend: "-2", up: false },
  ];

  const statuses = rawBookings.reduce((acc: any, b: any) => {
    const s = b.status === "PENDING" ? "Pending" : b.status === "COMPLETED" ? "Completed" : b.status === "IN_PROGRESS" ? "In Progress" : b.status || 'Pending';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: "Pending", value: statuses['Pending'] || 0, color: "#E03A18" },
    { name: "Approved", value: statuses['Approved'] || 0, color: "#2D8F6F" },
    { name: "In Progress", value: statuses['In Progress'] || 0, color: "#F59E2B" },
    { name: "Completed", value: statuses['Completed'] || 0, color: "#1A6B54" },
    { name: "Rejected", value: statuses['Rejected'] || 0, color: "#C01F0E" },
  ].filter(d => d.value > 0);
  
  if (pieData.length === 0) pieData.push({ name: "No Data", value: 1, color: "#CCC" });

  // Fallback to empty array if no data
  const revenueData = analytics.bookingVolume?.length > 0 ? analytics.bookingVolume : [{ day: "1", bookings: 0 }];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="p-4 pl-5">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-full bg-flame-red-tint flex items-center justify-center">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? "text-litmus-emerald" : "text-status-rejected"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Booking Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                <Tooltip contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E03A18" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E03A18" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9A9A9A" }} />
                <Tooltip contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="bookings" stroke="#E03A18" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Pending Approvals</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link to="/admin/bookings">View All</Link></Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Booking ID</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {pendingBookings.map((b: any) => (
                <TableRow key={b._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-sm">BKG-{b._id.substring(b._id.length - 6).toUpperCase()}</TableCell>
                  <TableCell>{b.userId?.firstName} {b.userId?.lastName}</TableCell>
                  <TableCell>{b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || b.items?.[0]?.testId?.name || "Service Item"}</TableCell>
                  <TableCell className="font-medium">₹{(b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0).toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={b.status === "PENDING" ? "Pending" : b.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 bg-litmus-emerald hover:bg-litmus-teal text-white" asChild><Link to="/admin/bookings">Review</Link></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pendingBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No pending approvals</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lab Performance */}
      <Card className="border border-border shadow-sm">
        <CardHeader><CardTitle className="text-base">Lab Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Lab Name</TableHead><TableHead>Bookings</TableHead><TableHead>Avg TAT</TableHead><TableHead>Completion Rate</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
            <TableBody>
              {labs.slice(0, 5).map((lab: any) => (
                <TableRow key={lab._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{lab.labName}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>3.5 days</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-flame-amber rounded-full" style={{ width: "96%" }} />
                      </div>
                      <span className="text-sm">96%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">N/A</TableCell>
                </TableRow>
              ))}
              {labs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No labs found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
