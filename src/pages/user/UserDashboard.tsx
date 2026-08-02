import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, CheckCircle2, Clock, FileText, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

const kpis = [
  { label: "Total Bookings", value: "12", icon: BookOpen, trend: "+3 this month" },
  { label: "Pending", value: "3", icon: Clock, trend: "2 awaiting approval" },
  { label: "Completed", value: "7", icon: CheckCircle2, trend: "+2 this week" },
  { label: "Reports Ready", value: "5", icon: FileText, trend: "2 new" },
];

export default function UserDashboard() {
  const userBookings = bookings.filter((b) => b.user === "Rajesh Kumar").slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Rajesh ðŸ‘‹</h1>
          <p className="text-muted-foreground">Here's what's happening with your tests today.</p>
        </div>
        <Button asChild className="gap-2 bg-primary hover:bg-primary-deep"><Link to="/dashboard/bookings/new"><Plus className="h-4 w-4" />New Booking</Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="flex items-center gap-4 p-5 pl-5">
              <div className="h-10 w-10 rounded-full bg-flame-red-tint flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3" />{kpi.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-border shadow-sm lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/dashboard/bookings">View All</Link></Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow className="bg-muted/50"><TableHead>Booking ID</TableHead><TableHead>Product</TableHead><TableHead className="hidden sm:table-cell">Lab</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {userBookings.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium font-mono text-sm">{b.id}</TableCell>
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

        <div className="space-y-4">
          <Card className="border border-border shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><AlertCircle className="h-4 w-4 text-primary" />Pending Actions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">2 documents missing</span><Button variant="outline" size="sm">Upload</Button></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">1 payment pending</span><Button variant="outline" size="sm">Pay Now</Button></div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm bg-gradient-to-br from-flame-red-tint to-flame-amber-tint">
            <CardContent className="p-5 text-center space-y-3">
              <BookOpen className="mx-auto h-10 w-10 text-primary" />
              <h3 className="font-semibold text-foreground">Quick Book a Test</h3>
              <p className="text-sm text-muted-foreground">Start a new food testing booking in minutes</p>
              <Button asChild className="bg-primary hover:bg-primary-deep"><Link to="/dashboard/bookings/new">Book Now</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
