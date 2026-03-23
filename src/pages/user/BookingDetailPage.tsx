import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, Circle, Download } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const timelineSteps = [
  { label: "Booking Placed", time: "Mar 15, 2024 10:30 AM", actor: "Rajesh Kumar" },
  { label: "Payment Confirmed", time: "Mar 15, 2024 10:35 AM", actor: "Razorpay" },
  { label: "Admin Approved", time: "Mar 15, 2024 02:00 PM", actor: "Admin" },
  { label: "Lab Assigned", time: "Mar 15, 2024 02:15 PM", actor: "Admin" },
  { label: "Testing In Progress", time: "Mar 16, 2024 09:00 AM", actor: "Chennai Lab" },
  { label: "Report Uploaded", time: "Mar 18, 2024 04:30 PM", actor: "Chennai Lab" },
  { label: "Report Verified", time: "Mar 19, 2024 10:00 AM", actor: "Admin" },
  { label: "Complete", time: "Mar 19, 2024 10:00 AM", actor: "System" },
];

export default function BookingDetailPage() {
  const { id } = useParams();
  const booking = bookings.find((b) => b.id === id) || bookings[0];
  const completedSteps = booking.status === "Completed" ? 8 : booking.status === "In Progress" ? 5 : booking.status === "Approved" ? 4 : 2;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/bookings" className="hover:text-foreground">Bookings</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{booking.id}</span>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">{booking.id}</h1>
        <StatusBadge status={booking.status} />
        <span className="text-sm text-muted-foreground">Created {booking.date}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Booking Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {i < completedSteps ? (
                      <CheckCircle2 className="h-5 w-5 text-status-approved shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                    )}
                    {i < timelineSteps.length - 1 && <div className={cn("w-0.5 flex-1 min-h-[2rem]", i < completedSteps - 1 ? "bg-status-approved" : "bg-muted")} />}
                  </div>
                  <div className="pb-6">
                    <p className={cn("font-medium text-sm", i < completedSteps ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                    {i < completedSteps && <p className="text-xs text-muted-foreground">{step.time} · {step.actor}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-sm">Product & Tests</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Product:</span> {booking.product}</p>
              <p><span className="text-muted-foreground">Tests:</span> {booking.testsCount} tests selected</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-sm">Lab Info</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{booking.lab}</p>
              <p className="text-muted-foreground">NABL Accredited · FSSAI Approved</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-sm">Payment Summary</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>₹{booking.amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={booking.paymentStatus === "Paid" ? "Approved" : "Pending"} /></div>
            </CardContent>
          </Card>
          {booking.status === "Completed" && (
            <Button className="w-full gap-2" size="lg"><Download className="h-4 w-4" />Download Report</Button>
          )}
        </div>
      </div>
    </div>
  );
}
