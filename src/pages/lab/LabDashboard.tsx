import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClipboardList, FlaskConical, CheckCircle2, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "New Bookings", value: "8", icon: ClipboardList, color: "text-status-pending" },
  { label: "Tests In Progress", value: "12", icon: FlaskConical, color: "text-status-inprogress" },
  { label: "Completed Today", value: "5", icon: CheckCircle2, color: "text-status-approved" },
  { label: "Revenue This Month", value: "₹2.8L", icon: DollarSign, color: "text-secondary" },
];

const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({ day: d, bookings: Math.floor(Math.random() * 8) + 2 }));

const todaysBookings = [
  { id: "BK-2024-002", user: "Priya Sharma", tests: "5 tests", status: "In Progress" },
  { id: "BK-2024-004", user: "Sunita Reddy", tests: "6 tests", status: "Approved" },
  { id: "BK-2024-005", user: "Vikram Singh", tests: "3 tests", status: "Pending" },
];

const pendingUploads = [
  { id: "BK-2024-009", user: "Anita Desai", dueDate: "2024-03-21", overdue: true },
  { id: "BK-2024-010", user: "Karthik Rajan", dueDate: "2024-03-22", overdue: true },
];

export default function LabDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Lab Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-2.5"><k.icon className={`h-5 w-5 ${k.color}`} /></div>
              <div><p className="text-sm text-muted-foreground">{k.label}</p><p className="text-2xl font-bold">{k.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Today's Bookings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {todaysBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border p-3">
                <div><p className="font-medium text-sm">{b.id}</p><p className="text-xs text-muted-foreground">{b.user} · {b.tests}</p></div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  <Button size="sm" variant="outline">Upload</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-0 shadow-sm border-l-4 border-l-status-pending">
            <CardHeader><CardTitle className="text-base">Pending Uploads</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {pendingUploads.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div><span className="font-medium">{p.id}</span> · <span className="text-muted-foreground">{p.user}</span></div>
                  <span className="text-status-rejected text-xs font-medium">Overdue: {p.dueDate}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Weekly Load</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
                  <Tooltip /><Bar dataKey="bookings" fill="hsl(176, 78%, 25%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
