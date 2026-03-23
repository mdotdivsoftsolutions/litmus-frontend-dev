import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, ClipboardList, DollarSign, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { bookings, laboratories } from "@/lib/placeholder-data";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const kpis = [
  { label: "Total Users", value: "1,247", icon: Users, trend: "+12%", up: true },
  { label: "Active Labs", value: "52", icon: Building2, trend: "+3", up: true },
  { label: "Bookings Today", value: "34", icon: ClipboardList, trend: "+8%", up: true },
  { label: "Revenue This Month", value: "₹12.4L", icon: DollarSign, trend: "+15%", up: true },
  { label: "Pending Approvals", value: "8", icon: Clock, trend: "-2", up: false },
];

const pieData = [
  { name: "Pending", value: 15, color: "#E03A18" },
  { name: "Approved", value: 25, color: "#2D8F6F" },
  { name: "In Progress", value: 30, color: "#F59E2B" },
  { name: "Completed", value: 45, color: "#1A6B54" },
  { name: "Rejected", value: 5, color: "#C01F0E" },
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
                <YAxis tick={{ fontSize: 10, fill: "#9A9A9A" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#E03A18" strokeWidth={2} fill="url(#revenueGrad)" />
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
              {pendingBookings.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-sm">{b.id}</TableCell>
                  <TableCell>{b.user}</TableCell>
                  <TableCell>{b.product}</TableCell>
                  <TableCell className="font-medium">₹{b.amount.toLocaleString()}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 bg-litmus-emerald hover:bg-litmus-teal text-white">Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-status-rejected border-status-rejected hover:bg-status-rejected-bg">Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              {laboratories.map((lab) => (
                <TableRow key={lab.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell>{lab.activeBookings}</TableCell>
                  <TableCell>3.5 days</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-flame-amber rounded-full" style={{ width: "96%" }} />
                      </div>
                      <span className="text-sm">96%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{(lab.revenue / 1000).toFixed(0)}K</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
