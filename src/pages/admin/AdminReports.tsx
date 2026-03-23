import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, CheckCircle2, XCircle, FileText } from "lucide-react";

const reports = [
  { bookingId: "BK-2024-001", user: "Rajesh Kumar", lab: "Chennai Food Testing Lab", uploadDate: "2024-03-18", status: "Pending Verification", product: "Full Cream Milk", tests: ["Fat Content Analysis", "Total Plate Count", "Moisture Content"], amount: 4500 },
  { bookingId: "BK-2024-006", user: "Rajesh Kumar", lab: "Hyderabad Food Safety Centre", uploadDate: "2024-03-15", status: "Verified", product: "Chicken Sausages", tests: ["Salmonella Detection", "Coliform Count", "Lead Content", "Protein Content"], amount: 8900 },
  { bookingId: "BK-2024-008", user: "Rahul Gupta", lab: "Delhi Food Research Institute", uploadDate: "2024-03-19", status: "Verified", product: "Potato Chips", tests: ["Moisture Content", "Fat Content Analysis", "Acid Value"], amount: 3500 },
  { bookingId: "BK-2024-002", user: "Priya Sharma", lab: "Delhi Food Research Institute", uploadDate: "2024-03-22", status: "Pending Verification", product: "Basmati Rice", tests: ["Moisture Content", "Aflatoxin B1", "Lead Content", "Protein Content", "Viscosity Test"], amount: 6200 },
];

export default function AdminReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Report Verification</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-primary">{reports.filter(r => r.status === "Pending Verification").length}</p><p className="text-xs text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-litmus-emerald">{reports.filter(r => r.status === "Verified").length}</p><p className="text-xs text-muted-foreground">Verified</p></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-foreground">{reports.length}</p><p className="text-xs text-muted-foreground">Total Reports</p></CardContent></Card>
      </div>

      <Card className="border border-border shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.bookingId} className="hover:bg-muted/30">
                <TableCell className="font-medium font-mono text-sm">{r.bookingId}</TableCell>
                <TableCell>{r.user}</TableCell>
                <TableCell>{r.product}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.lab}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.uploadDate}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" />Review</Button></DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader><DialogTitle>Report Review — {r.bookingId}</DialogTitle></DialogHeader>
                      <div className="grid grid-cols-5 gap-6">
                        {/* PDF Preview */}
                        <div className="col-span-3 rounded-lg border border-border bg-muted/30 p-8 flex flex-col items-center justify-center min-h-[400px]">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm font-medium text-foreground">PDF Report Preview</p>
                          <p className="text-xs text-muted-foreground mb-4">report_{r.bookingId}.pdf</p>
                          <Button variant="outline" size="sm">Download PDF</Button>
                        </div>
                        {/* Report details */}
                        <div className="col-span-2 space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Booking</p><p className="font-mono font-medium">{r.bookingId}</p></div>
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">User</p><p className="font-medium">{r.user}</p></div>
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Product</p><p className="font-medium">{r.product}</p></div>
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Lab</p><p className="font-medium text-xs">{r.lab}</p></div>
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Amount</p><p className="font-medium">₹{r.amount.toLocaleString()}</p></div>
                            <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Uploaded</p><p className="font-medium">{r.uploadDate}</p></div>
                          </div>

                          <div>
                            <p className="text-sm font-semibold mb-2">Tests Included ({r.tests.length})</p>
                            <div className="flex flex-wrap gap-1">
                              {r.tests.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Rejection Reason</p>
                            <Textarea placeholder="Enter reason if rejecting..." className="min-h-[80px]" />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 gap-1 bg-litmus-emerald hover:bg-litmus-teal text-white"><CheckCircle2 className="h-4 w-4" />Verify</Button>
                            <Button variant="outline" className="flex-1 gap-1 text-status-rejected border-status-rejected"><XCircle className="h-4 w-4" />Reject</Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
