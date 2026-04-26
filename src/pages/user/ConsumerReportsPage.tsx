import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download, FileText, Calendar, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const reports = [
  { id: "1", testName: "Fat Content Analysis", lab: "Chennai Food Testing Laboratory", date: "2024-03-19", status: "Verified", product: "Full Cream Milk", tests: 3 },
  { id: "2", testName: "Total Plate Count", lab: "Chennai Food Testing Laboratory", date: "2024-03-19", status: "Verified", product: "Full Cream Milk", tests: 1 },
  { id: "3", testName: "Moisture Content", lab: "Delhi Food Research Institute", date: "2024-03-20", status: "Verified", product: "Basmati Rice", tests: 2 },
  { id: "4", testName: "Coliform Count", lab: "Hyderabad Food Safety Centre", date: "2024-03-15", status: "Verified", product: "Mango Juice", tests: 4 },
  { id: "5", testName: "Protein Content", lab: "Mumbai Analytical Sciences Lab", date: "2024-03-22", status: "Pending", product: "Paneer", tests: 3 },
  { id: "6", testName: "Lead Content", lab: "Kolkata Testing Services", date: "2024-03-25", status: "Verified", product: "Turmeric Powder", tests: 2 },
];

export default function ConsumerReportsPage() {
  const [search, setSearch] = useState("");
  const filtered = reports.filter((r) => !search || r.testName.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
         <div>
            <h1 className="text-2xl font-bold text-foreground">Diagnostic Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">View and download your certified test reports.</p>
         </div>
         <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reports or products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 rounded-lg bg-white" 
            />
         </div>
      </div>

      {/* Compact Report List */}
      <div className="grid gap-3">
         {filtered.map((r) => (
           <div key={r.id} className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-accent transition-colors">
              
              <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
                 <div className="shrink-0 flex items-center justify-center h-10 w-10 bg-primary/10 rounded-lg text-primary">
                    <FileText className="h-5 w-5" />
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="text-base font-semibold text-foreground truncate">{r.testName}</h3>
                       <div className={cn(
                         "px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                         r.status === "Verified" ? "bg-litmus-mint/30 text-litmus-dark" : "bg-flame-amber-tint/50 text-accent"
                       )}>
                         {r.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                         {r.status}
                       </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1 truncate"><span className="font-medium text-foreground">Product:</span> {r.product}</span>
                       <span className="flex items-center gap-1 truncate border-l border-border pl-3"><Calendar className="h-3.5 w-3.5" /> {r.date}</span>
                    </div>
                 </div>
                 
                 <div className="shrink-0 w-48 text-xs text-muted-foreground hidden lg:block">
                    {r.lab}
                 </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-border pt-3 md:pt-0">
                 <Button variant="outline" size="sm" className="flex-1 md:flex-none h-8 rounded-lg gap-1.5 text-xs text-foreground">
                   <Eye className="h-3.5 w-3.5" /> Preview
                 </Button>
                 <Button size="sm" className="flex-1 md:flex-none bg-primary hover:bg-primary-deep text-primary-foreground h-8 rounded-lg gap-1.5 text-xs">
                   <Download className="h-3.5 w-3.5" /> Download
                 </Button>
              </div>
           </div>
         ))}

         {filtered.length === 0 && (
           <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">No reports found matching your criteria.</p>
           </div>
         )}
      </div>

      {filtered.length > 4 && (
        <div className="text-center pt-4">
          <Button variant="outline" className="rounded-lg">Load More Reports</Button>
        </div>
      )}
    </div>
  );
}
