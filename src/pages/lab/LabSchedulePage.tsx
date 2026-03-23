import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const bookingBlocks = [
  { day: "Mon", bookings: [{ id: "BK-001", time: "09:00–12:00", color: "bg-secondary/20 text-secondary" }] },
  { day: "Tue", bookings: [{ id: "BK-002", time: "10:00–14:00", color: "bg-primary/20 text-primary" }, { id: "BK-003", time: "15:00–17:00", color: "bg-status-pending/20 text-status-pending" }] },
  { day: "Wed", bookings: [{ id: "BK-004", time: "09:00–11:00", color: "bg-secondary/20 text-secondary" }] },
  { day: "Thu", bookings: [] },
  { day: "Fri", bookings: [{ id: "BK-005", time: "10:00–16:00", color: "bg-primary/20 text-primary" }] },
  { day: "Sat", bookings: [] },
  { day: "Sun", bookings: [] },
];

export default function LabSchedulePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>

      {/* Weekly calendar */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">This Week</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {bookingBlocks.map((d) => (
              <div key={d.day} className="min-h-[120px]">
                <p className="text-xs font-medium text-center mb-2 text-muted-foreground">{d.day}</p>
                <div className="space-y-1">
                  {d.bookings.length > 0 ? d.bookings.map((b) => (
                    <div key={b.id} className={`rounded p-1.5 text-xs ${b.color}`}>
                      <p className="font-medium">{b.id}</p>
                      <p>{b.time}</p>
                    </div>
                  )) : (
                    <div className="rounded bg-muted p-2 text-xs text-center text-muted-foreground">Free</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Working Hours</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Start Time</Label><Input type="time" defaultValue="09:00" /></div>
              <div className="space-y-1"><Label className="text-xs">End Time</Label><Input type="time" defaultValue="18:00" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => (
                  <label key={d} className="flex items-center gap-1.5">
                    <Checkbox defaultChecked={!["Saturday", "Sunday"].includes(d)} />
                    <span className="text-xs">{d.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button size="sm">Save Hours</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Block Dates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input type="date" />
            <Button variant="outline" size="sm" className="w-full">Add Holiday</Button>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between items-center rounded bg-muted px-3 py-1.5"><span>2024-03-25 (Holi)</span><Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">Remove</Button></div>
              <div className="flex justify-between items-center rounded bg-muted px-3 py-1.5"><span>2024-04-14 (Ambedkar Jayanti)</span><Button variant="ghost" size="sm" className="h-6 text-xs text-destructive">Remove</Button></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Booking Limits</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Daily Booking Limit</Label><Input type="number" defaultValue="15" /></div>
            <Button size="sm">Save Limit</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
