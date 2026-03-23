import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const holidays = [
  { date: "2024-03-25", name: "Holi" },
  { date: "2024-04-14", name: "Ambedkar Jayanti" },
  { date: "2024-08-15", name: "Independence Day" },
];

export default function LabSchedulePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Working Hours */}
        <Card className="border border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Working Hours</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Start Time</Label><Input type="time" defaultValue="09:00" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">End Time</Label><Input type="time" defaultValue="18:00" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Working Days</Label>
              <div className="space-y-2">
                {fullDays.map((d, i) => (
                  <div key={d} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm">{d}</span>
                    <Switch defaultChecked={i < 5} />
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary-deep">Save Working Hours</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Booking Limits */}
          <Card className="border border-border shadow-sm">
            <CardHeader><CardTitle className="text-base">Booking Limits</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><Label className="text-sm font-medium">Daily Booking Limit</Label><Input type="number" defaultValue="15" /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Weekly Booking Limit</Label><Input type="number" defaultValue="60" /></div>
              <Button className="w-full bg-primary hover:bg-primary-deep" size="sm">Save Limits</Button>
            </CardContent>
          </Card>

          {/* Block Dates */}
          <Card className="border border-border shadow-sm">
            <CardHeader><CardTitle className="text-base">Block Dates / Holidays</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input type="date" className="flex-1" />
                <Button variant="outline" size="sm">Add</Button>
              </div>
              <div className="space-y-2">
                {holidays.map(h => (
                  <div key={h.date} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 bg-muted/30">
                    <div><p className="text-sm font-medium">{h.name}</p><p className="text-xs text-muted-foreground">{h.date}</p></div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
