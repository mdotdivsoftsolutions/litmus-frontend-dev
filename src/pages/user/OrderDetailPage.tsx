import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, MapPin, CreditCard, Download, FileText, ChevronRight, FlaskConical, Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/booking";

const timelineSteps = ["Booked", "Payment", "Approved", "Lab Testing", "Report Ready"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getBookingById(id as string),
    enabled: !!id,
  });

  const apiBooking = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (!apiBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground font-medium">Booking not found.</p>
        <Link to="/orders"><Button>Back to Orders</Button></Link>
      </div>
    );
  }

  const statusToStep: Record<string, number> = {
    "PENDING": 0, "APPROVED": 2, "IN_PROGRESS": 3, "COMPLETED": 4, "REJECTED": -1,
  };
  const currentStep = apiBooking.paymentStatus === "COMPLETED" ? Math.max(statusToStep[apiBooking.status] ?? 0, 1) : 0;

  // Calculate total samples and names for header
  let totalSamples = 0;
  const products = new Set<string>();
  apiBooking.items?.forEach((item: any) => {
    if (item.testId?.testName) products.add(item.testId.testName);
    else if (item.packageId?.name) products.add(item.packageId.name);
    else if (item.samples?.[0]?.productName) products.add(item.samples[0].productName);
    totalSamples += item.samples?.length || 0;
  });

  const productNames = Array.from(products);
  const mainProduct = productNames.length > 0 ? productNames[0] + (productNames.length > 1 ? ` + ${productNames.length - 1} more` : '') : 'Custom Testing';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6">
      
      {/* Header */}
      <div>
         <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
           <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
           <ChevronRight className="h-3.5 w-3.5" />
           <span className="text-foreground font-mono font-medium">{apiBooking._id}</span>
         </nav>
         
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
            <div>
               <h1 className="text-2xl font-bold text-foreground">{mainProduct}</h1>
               <p className="text-sm text-muted-foreground mt-0.5">Placed on {new Date(apiBooking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <StatusBadge status={apiBooking.status.charAt(0) + apiBooking.status.slice(1).toLowerCase()} />
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
              <FlaskConical className="h-4 w-4 text-accent" /> Order Summary
            </h3>
            <p className="font-semibold text-foreground text-sm">{mainProduct}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalSamples} Samples Total</p>
         </div>

         <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> Laboratory
            </h3>
            <p className="font-semibold text-foreground text-sm">{apiBooking.labId?.labName}</p>
            <p className="text-xs text-muted-foreground mt-1">{apiBooking.labId?.location?.city || 'Partner Lab'}</p>
         </div>

         <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-accent" /> Payment
            </h3>
            <p className="font-bold text-foreground text-xl mb-1">₹{(apiBooking.totalAmount || 0).toLocaleString()}</p>
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase",
              apiBooking.paymentStatus === "COMPLETED" ? "bg-litmus-mint text-litmus-dark" : "bg-flame-red-tint text-primary"
            )}>
              {apiBooking.paymentStatus === "COMPLETED" && <Check className="h-3 w-3" />}
              {apiBooking.paymentStatus === "COMPLETED" ? "Paid" : "Pending"}
            </div>
         </div>
      </div>

      {/* Item & Sample Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">Sample Breakdown</h2>
        <div className="grid gap-4">
          {apiBooking.items?.map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
               <div className="bg-slate-50 border-b border-border p-4 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <Package className="h-4 w-4 text-muted-foreground" />
                   <h3 className="font-bold text-slate-900 text-sm">{item.testId?.testName || item.packageId?.name}</h3>
                 </div>
                 <span className="font-bold text-slate-900 text-sm">₹{(item.price || 0).toLocaleString()}</span>
               </div>
               <div className="p-4 space-y-4">
                 {item.samples?.map((sample: any, sIdx: number) => (
                   <div key={sIdx} className="border border-border/50 rounded-lg p-4 bg-slate-50/50 text-sm">
                     <div className="flex justify-between items-start mb-3 border-b border-border/50 pb-2">
                       <div>
                         <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Sample {sIdx + 1}</span>
                         <span className="font-bold text-slate-900">{sample.productName || "Unnamed Product"}</span>
                       </div>
                       <div className="text-right">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Quantity</span>
                         <span className="font-medium text-slate-700">{sample.quantity || "N/A"}</span>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Batch</span>
                          <span className="text-xs font-mono">{sample.batchNumber || "-"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">SKU</span>
                          <span className="text-xs font-mono">{sample.sku || "-"}</span>
                        </div>
                        <div className="col-span-2 md:col-span-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Specifics</span>
                          <span className="text-xs text-slate-600 line-clamp-1" title={sample.specifics}>{sample.specifics || "-"}</span>
                        </div>
                     </div>
                     <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Parameters to Test</span>
                        <div className="flex flex-wrap gap-1.5">
                           {sample.selectedParameters?.map((param: string, pIdx: number) => (
                             <span key={pIdx} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded-full font-medium text-slate-700">
                               {param}
                             </span>
                           ))}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Area */}
      {/* Action Area */}
      {apiBooking.status === "COMPLETED" && (
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
           {apiBooking.reportFiles && apiBooking.reportFiles.length > 0 ? (
             <Button asChild className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg gap-2 text-sm shadow-sm">
               <a href={apiBooking.reportFiles[0]} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /> Download PDF</a>
             </Button>
           ) : (
             <Button disabled className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg gap-2 text-sm shadow-sm">
               No File Attached
             </Button>
           )}
        </div>
      )}
    </div>
  );
}
