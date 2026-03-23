import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, ClipboardList, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { bookings, laboratories } from "@/lib/placeholder-data";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "Total Users", value: "1,247", icon: Users, trend: "+12%", up: true },
  { label: "Active Labs", value: "52", icon: Building2, trend: "+3", up: true },
  { label: "Bookings Today", value: "34", icon: ClipboardList, trend: "+8%", up: true },
  { label: "Revenue This Month", value: "₹12.4L", icon: DollarSign, trend: "+15%", up: true },
  { label: "Pending Approvals", value: "8", icon: Clock, trend: "-2", up: false },
];

const pieData = [
  { name: "Pending", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Approved", value: 25, color: "hsl(142, 71%, 45%)" },
  { name: "In Progress", value: 30, color: "hsl(199, 89%, 48%)" },
  { name: "Completed", value: 45, color: "hsl(231, 48%, 48%)" },
  { name: "Rejected", value: 5, color: "hsl(0, 72%, 51%)" },
];

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(Math.random() * 50000) + 20000,
}));

export default function AdminDashboard() {
  const pendingBookings = bookings.filter((b) => b.status === "Pending");

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? "text-status-approved" : "text-status-rejected"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Booking Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(176, 78%, 25%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Pending Approvals</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link to="/admin/bookings">View All</Link></Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Booking ID</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {pendingBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.id}</TableCell>
                  <TableCell>{b.user}</TableCell>
                  <TableCell>{b.product}</TableCell>
                  <TableCell>₹{b.amount.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-status-approved border-status-approved hover:bg-status-approved-bg">Approve</Button>
                      <Button size="sm" variant="outline" className="text-status-rejected border-status-rejected hover:bg-status-rejected-bg">Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lab Performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Lab Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Lab Name</TableHead><TableHead>Bookings This Month</TableHead><TableHead>Avg TAT</TableHead><TableHead>Completion Rate</TableHead><TableHead>Revenue</TableHead></TableRow></TableHeader>
            <TableBody>
              {laboratories.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell>{lab.activeBookings}</TableCell>
                  <TableCell>3.5 days</TableCell>
                  <TableCell>96%</TableCell>
                  <TableCell>₹{(lab.revenue / 1000).toFixed(0)}K</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
