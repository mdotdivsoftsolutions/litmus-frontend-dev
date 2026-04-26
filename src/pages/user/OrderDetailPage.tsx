import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, MapPin, CreditCard, Download, FileText, ChevronRight, FlaskConical } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6">
      
      {/* Header */}
      <div>
         <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
           <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
           <ChevronRight className="h-3.5 w-3.5" />
           <span className="text-foreground font-mono font-medium">{booking.id}</span>
         </nav>
         
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
            <div>
               <h1 className="text-2xl font-bold text-foreground">{booking.product}</h1>
               <p className="text-sm text-muted-foreground mt-0.5">Placed on {booking.date}</p>
            </div>
            <StatusBadge status={booking.status} />
         </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
         <div className="relative">
            <div className="absolute top-4 left-0 w-full h-1 bg-muted rounded-full" />
            <div 
              className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${(currentStep / (timelineSteps.length - 1)) * 100}%` }}
            />

            <div className="flex items-start justify-between relative z-10">
              {timelineSteps.map((step, i) => {
                 const isCompleted = i <= currentStep;
                 return (
                   <div key={step} className="flex flex-col items-center flex-1">
                     <div className={cn(
                       "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm border-2",
                       isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-card border-muted text-muted-foreground"
                     )}>
                       {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                     </div>
                     <span className={cn(
                        "text-[10px] sm:text-xs mt-2 text-center font-semibold max-w-[80px]",
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                     )}>
                       {step}
                     </span>
                   </div>
                 );
              })}
            </div>
         </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-3 gap-4">
         <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4 text-accent" /> Test Details
            </h3>
            <p className="font-semibold text-foreground text-sm">{booking.product}</p>
            <p className="text-xs text-muted-foreground mt-1">{booking.testsCount} Parameters</p>
            <p className="text-xs text-muted-foreground font-mono mt-1 border-t border-border pt-2">Batch: BT-2024-{id?.split("-")[2] || "X"}</p>
         </div>

         <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> Laboratory
            </h3>
            <p className="font-semibold text-foreground text-sm">{booking.lab}</p>
            <p className="text-xs text-muted-foreground mt-1">Chennai, TN</p>
            <Button variant="outline" size="sm" className="w-full h-8 mt-3 rounded-lg text-xs">Contact Lab</Button>
         </div>

         <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-accent" /> Payment
            </h3>
            <p className="font-bold text-foreground text-xl mb-1">₹{booking.amount.toLocaleString()}</p>
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase",
              booking.paymentStatus === "Paid" ? "bg-litmus-mint text-litmus-dark" : "bg-flame-red-tint text-primary"
            )}>
              {booking.paymentStatus === "Paid" && <Check className="h-3 w-3" />}
              {booking.paymentStatus}
            </div>
         </div>
      </div>

      {/* Action Area */}
      {booking.status === "Completed" && (
        <div className="bg-litmus-mint/20 border border-litmus-teal/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 text-litmus-teal shadow-sm border border-litmus-teal/20">
                 <FileText className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="text-base font-bold text-litmus-dark">Report Ready</h3>
                 <p className="text-sm text-litmus-teal font-medium">Your certified report is available for download.</p>
              </div>
           </div>
           <Button className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg gap-2 text-sm shadow-sm">
             <Download className="h-4 w-4" /> Download PDF
           </Button>
        </div>
      )}
    </div>
  );
}
