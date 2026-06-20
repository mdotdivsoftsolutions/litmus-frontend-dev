import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { MapPin, Download, Search, FlaskConical, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/booking";

const tabs = ["All Orders", "Active", "Completed", "Reports Ready"];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: bookingApi.getMyBookings,
  });

  const apiBookings = data?.data || [];

  const formattedBookings = apiBookings.map((b: any) => {
    // Collect all products and tests
    const products = new Set<string>();
    let totalSamples = 0;
    
    b.items?.forEach((item: any) => {
      if (item.testId?.testName) products.add(item.testId.testName);
      else if (item.packageId?.name) products.add(item.packageId.name);
      else if (item.samples?.[0]?.productName) products.add(item.samples[0].productName);
      totalSamples += item.samples?.length || 0;
    });

    const productNames = Array.from(products);
    const mainProduct = productNames.length > 0 ? productNames[0] + (productNames.length > 1 ? ` + ${productNames.length - 1} more` : '') : 'Custom Testing';

    return {
      id: `#LTMS-${b._id.slice(-6).toUpperCase()}`,
      originalId: b._id,
      date: new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      product: mainProduct,
      testsCount: totalSamples,
      lab: b.labId?.labName || 'Litmus Partner Lab',
      status: b.status.charAt(0) + b.status.slice(1).toLowerCase(),
      amount: b.totalAmount || b.items?.reduce((acc: number, item: any) => acc + item.price, 0) || 0,
      reportUrl: b.reportFiles?.[0],
    };
  });

  const filtered = formattedBookings.filter((b: any) => {
    if (searchQuery && !b.id.toLowerCase().includes(searchQuery.toLowerCase()) && !b.product.toLowerCase().includes(searchQuery.toLowerCase())) {
       return false;
    }
    if (activeTab === "All Orders") return true;
    if (activeTab === "Active") return ["Pending", "Approved", "In progress"].includes(b.status);
    if (activeTab === "Completed") return b.status === "Completed";
    if (activeTab === "Reports Ready") return b.status === "Completed" && b.reportUrl;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-foreground">Order History</h1>
            <p className="text-sm text-muted-foreground">
              Track progress, view lab assignment, and open reports — search by order ID or test name.
            </p>
         </div>
         <div className="relative w-full md:w-64 bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search ID or Test..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 rounded-lg bg-white" 
            />
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 px-4 py-2 text-sm font-semibold transition-colors border-b-2",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            {tab}
          </button>
        ))}
      </div>

      {/* Compact Order List */}
      <div className="grid gap-3">
         {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="block bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
                   <div className="shrink-0 space-y-2 w-24">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                   </div>
                   <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <div className="flex items-center gap-3">
                         <Skeleton className="h-3 w-16" />
                         <Skeleton className="h-3 w-32" />
                      </div>
                   </div>
                   <div className="shrink-0 w-32">
                      <Skeleton className="h-6 w-20 rounded-full" />
                   </div>
                </div>
                <div className="shrink-0 flex items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 border-border pt-3 md:pt-0">
                   <Skeleton className="h-6 w-16" />
                   <Skeleton className="h-5 w-5 rounded-md hidden md:block" />
                </div>
              </div>
            ))
         ) : (
           <>
             {filtered.map((b: any) => (
           <Link to={`/orders/${b.originalId}`} key={b.id} className="block bg-card rounded-xl border border-border shadow-sm hover:border-accent transition-colors p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              
              <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
                 <div className="shrink-0 space-y-1 w-24">
                    <p className="text-xs font-mono font-medium text-muted-foreground">{b.id}</p>
                    <p className="text-xs text-muted-foreground">{b.date}</p>
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground truncate">{b.product}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1"><FlaskConical className="h-3.5 w-3.5" /> {b.testsCount} Tests</span>
                       <span className="flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5" /> {b.lab}</span>
                    </div>
                 </div>
                 
                 <div className="shrink-0 w-32">
                    <StatusBadge status={b.status} />
                 </div>
              </div>

              <div className="shrink-0 flex items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 border-border pt-3 md:pt-0">
                 <span className="font-bold text-foreground text-lg w-20 md:text-right">₹{b.amount.toLocaleString()}</span>
                 
                 {b.status === "Completed" ? (
                   <Button size="sm" onClick={(e) => e.preventDefault()} className="bg-litmus-teal hover:bg-litmus-dark text-primary-foreground h-8 rounded-lg gap-1.5 text-xs">
                     <Download className="h-3.5 w-3.5" /> Report
                   </Button>
                 ) : (
                   <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                 )}
              </div>
           </Link>
         ))}

         {filtered.length === 0 && !isLoading && (
           <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">No orders found matching your criteria.</p>
           </div>
         )}
         </>
         )}
      </div>
    </div>
  );
}
