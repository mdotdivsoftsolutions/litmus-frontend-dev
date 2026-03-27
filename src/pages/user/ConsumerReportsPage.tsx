import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search reports..." className="pl-10 h-11 rounded-full border-border text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-accent" />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{r.testName}</h3>
                  <p className="text-xs text-muted-foreground">{r.lab}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
                <Badge className={r.status === "Verified" ? "bg-litmus-mint text-litmus-dark border-0" : "bg-flame-amber-tint text-accent border-0"}>
                  {r.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{r.product}</Badge>
                <Badge variant="outline" className="text-xs">{r.tests} tests</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-1 text-xs"><Eye className="h-3.5 w-3.5" />Preview</Button>
                <Button size="sm" className="flex-1 rounded-lg gap-1 bg-primary hover:bg-primary-deep text-xs"><Download className="h-3.5 w-3.5" />Download</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 4 && (
        <div className="text-center">
          <Button variant="outline" className="rounded-full">Load More</Button>
        </div>
      )}
    </div>
  );
}
