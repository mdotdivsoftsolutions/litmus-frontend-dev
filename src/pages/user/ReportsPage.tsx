import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText } from "lucide-react";

const reports = [
  { id: "1", testName: "Fat Content Analysis", lab: "Chennai Food Testing Laboratory", date: "2024-03-19", status: "Verified" },
  { id: "2", testName: "Total Plate Count", lab: "Chennai Food Testing Laboratory", date: "2024-03-19", status: "Verified" },
  { id: "3", testName: "Moisture Content", lab: "Delhi Food Research Institute", date: "2024-03-20", status: "Verified" },
  { id: "4", testName: "Coliform Count", lab: "Hyderabad Food Safety Centre", date: "2024-03-15", status: "Verified" },
  { id: "5", testName: "Protein Content", lab: "Mumbai Analytical Sciences Lab", date: "2024-03-22", status: "Pending" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-muted p-2"><FileText className="h-5 w-5 text-primary" /></div>
                <Badge variant={r.status === "Verified" ? "approved" : "pending"}>{r.status}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{r.testName}</h3>
                <p className="text-xs text-muted-foreground">{r.lab}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1"><Eye className="h-3.5 w-3.5" />Preview</Button>
                <Button size="sm" className="flex-1 gap-1"><Download className="h-3.5 w-3.5" />Download</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
