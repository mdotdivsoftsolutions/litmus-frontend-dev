import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, MapPin, CreditCard, Download, FileText, ChevronRight } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const timelineSteps = ["Booked", "Payment", "Approved", "Lab Testing", "Report Ready"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const statusToStep: Record<string, number> = {
    "Pending": 0, "Approved": 2, "In Progress": 3, "Completed": 4, "Rejected": -1,
  };
  const currentStep = booking.paymentStatus === "Paid" ? Math.max(statusToStep[booking.status] ?? 0, 1) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/orders" className="hover:text-foreground">My Orders</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{booking.id}</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{booking.id}</h1>
          <p className="text-sm text-muted-foreground">{booking.date}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Timeline */}
      <Card className="border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            {timelineSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                    i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={cn("text-xs mt-1.5 text-center", i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {step}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-2 mt-[-16px]", i < currentStep ? "bg-primary" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /> Sample & Product</h3>
            <p className="text-sm text-foreground">{booking.product}</p>
            <p className="text-xs text-muted-foreground">{booking.testsCount} tests</p>
            <Badge variant="outline" className="text-xs">Batch: BT-2024-{id?.split("-")[2]}</Badge>
          </CardContent>
        </Card>
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Lab Information</h3>
            <p className="text-sm text-foreground">{booking.lab}</p>
            <Button variant="outline" size="sm" className="text-xs rounded-full">Contact Lab</Button>
          </CardContent>
        </Card>
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Payment</h3>
            <p className="text-lg font-bold text-primary">₹{booking.amount.toLocaleString()}</p>
            <Badge className={booking.paymentStatus === "Paid" ? "bg-litmus-mint text-litmus-dark border-0" : "bg-flame-red-tint text-primary border-0"}>
              {booking.paymentStatus}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Report Ready Card */}
      {booking.status === "Completed" && (
        <Card className="border-0 rounded-2xl bg-litmus-mint">
          <CardContent className="p-6 text-center space-y-3">
            <FileText className="mx-auto h-10 w-10 text-litmus-dark" />
            <h3 className="text-lg font-bold text-litmus-dark">📄 Your Report is Ready</h3>
            <p className="text-sm text-litmus-teal">Your certified test report has been generated and verified.</p>
            <Button className="bg-litmus-teal hover:bg-litmus-dark rounded-full gap-2">
              <Download className="h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
