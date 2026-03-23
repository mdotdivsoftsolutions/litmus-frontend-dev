import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from "recharts";

const bookingVolume = Array.from({ length: 14 }, (_, i) => ({
  day: `Mar ${i + 10}`,
  bookings: Math.floor(Math.random() * 20) + 5,
}));

const revenueByLab = laboratories.slice(0, 4).map(l => ({
  name: l.city,
  revenue: Math.floor(l.revenue / 1000),
  bookings: l.activeBookings,
}));

const userGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  users: Math.floor(Math.random() * 200) + 800 + i * 40,
}));

const topProducts = [
  { name: "Full Cream Milk", bookings: 145, revenue: "₹4.2L" },
  { name: "Basmati Rice", bookings: 132, revenue: "₹3.8L" },
  { name: "Refined Sunflower Oil", bookings: 118, revenue: "₹3.5L" },
  { name: "Turmeric Powder", bookings: 98, revenue: "₹2.9L" },
  { name: "Mango Juice", bookings: 87, revenue: "₹2.6L" },
  { name: "Chicken Sausages", bookings: 76, revenue: "₹2.3L" },
  { name: "Paneer", bookings: 65, revenue: "₹1.9L" },
  { name: "Green Tea", bookings: 54, revenue: "₹1.6L" },
  { name: "Potato Chips", bookings: 48, revenue: "₹1.4L" },
  { name: "Instant Noodles", bookings: 42, revenue: "₹1.2L" },
];

const testTypeData = [
  { name: "Chemical", value: 45, color: "#E03A18" },
  { name: "Microbiological", value: 30, color: "#F26419" },
  { name: "Physical", value: 25, color: "#F59E2B" },
];

const tooltipStyle = { background: "#1C1C1E", border: "none", borderRadius: 8, color: "#fff" };

export default function AdminAnalytics() {
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
                {topProducts.map((p, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.bookings}</TableCell>
                    <TableCell className="text-primary font-medium">{p.revenue}</TableCell>
                  </TableRow>
                ))}
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
              <BarChart data={laboratories.slice(0, 5).map((l) => ({ name: l.city, tat: +(3 + Math.random() * 2).toFixed(1), completion: +(90 + Math.random() * 10).toFixed(0) }))}>
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
