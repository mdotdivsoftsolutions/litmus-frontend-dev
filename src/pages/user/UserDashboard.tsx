import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, CheckCircle2, Clock, FileText, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

const kpis = [
  { label: "Total Bookings", value: "12", icon: BookOpen, trend: "+3 this month", color: "text-primary" },
  { label: "Pending", value: "3", icon: Clock, trend: "2 awaiting approval", color: "text-status-pending" },
  { label: "Completed", value: "7", icon: CheckCircle2, trend: "+2 this week", color: "text-status-approved" },
  { label: "Reports Ready", value: "5", icon: FileText, trend: "2 new", color: "text-status-completed" },
];

export default function UserDashboard() {
  const userBookings = bookings.filter((b) => b.user === "Rajesh Kumar").slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Rajesh 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your tests today.</p>
        </div>
        <Button asChild className="gap-2"><Link to="/dashboard/bookings/new"><Plus className="h-4 w-4" />New Booking</Link></Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-2.5">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />{kpi.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/dashboard/bookings">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden sm:table-cell">Lab</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.id}</TableCell>
                    <TableCell>{b.product}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{b.lab.split(" ")[0]}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell><Button variant="ghost" size="sm" asChild><Link to={`/dashboard/bookings/${b.id}`}>View</Link></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar cards */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm border-l-4 border-l-status-pending">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><AlertCircle className="h-4 w-4 text-status-pending" />Pending Actions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">2 documents missing</span><Button variant="outline" size="sm">Upload</Button></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">1 payment pending</span><Button variant="outline" size="sm">Pay Now</Button></div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-secondary/10 to-primary/5">
            <CardContent className="p-5 text-center space-y-3">
              <BookOpen className="mx-auto h-10 w-10 text-secondary" />
              <h3 className="font-semibold text-foreground">Quick Book a Test</h3>
              <p className="text-sm text-muted-foreground">Start a new food testing booking in minutes</p>
              <Button asChild><Link to="/dashboard/bookings/new">Book Now</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
