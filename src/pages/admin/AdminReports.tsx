import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, CheckCircle2, XCircle, FileText } from "lucide-react";

const reports = [
  { bookingId: "BK-2024-001", user: "Rajesh Kumar", lab: "Chennai Food Testing Lab", uploadDate: "2024-03-18", status: "Pending Verification" },
  { bookingId: "BK-2024-006", user: "Rajesh Kumar", lab: "Hyderabad Food Safety Centre", uploadDate: "2024-03-15", status: "Verified" },
  { bookingId: "BK-2024-008", user: "Rahul Gupta", lab: "Delhi Food Research Institute", uploadDate: "2024-03-19", status: "Verified" },
  { bookingId: "BK-2024-002", user: "Priya Sharma", lab: "Delhi Food Research Institute", uploadDate: "2024-03-22", status: "Pending Verification" },
];

export default function AdminReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Report Verification</h1>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.bookingId}>
                <TableCell className="font-medium">{r.bookingId}</TableCell>
                <TableCell>{r.user}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.lab}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.uploadDate}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" />Review</Button></DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader><DialogTitle>Report Review — {r.bookingId}</DialogTitle></DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border bg-muted/50 p-8 flex flex-col items-center justify-center min-h-[300px]">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground">PDF Report Preview</p>
                          <p className="text-xs text-muted-foreground">report_{r.bookingId}.pdf</p>
                        </div>
                        <div className="space-y-4">
                          <div className="text-sm space-y-2">
                            <p><span className="text-muted-foreground">Booking:</span> {r.bookingId}</p>
                            <p><span className="text-muted-foreground">User:</span> {r.user}</p>
                            <p><span className="text-muted-foreground">Lab:</span> {r.lab}</p>
                            <p><span className="text-muted-foreground">Uploaded:</span> {r.uploadDate}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Rejection Reason (if applicable)</p>
                            <Textarea placeholder="Enter reason for rejection..." />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 gap-1 bg-status-approved hover:bg-status-approved/90"><CheckCircle2 className="h-4 w-4" />Verify</Button>
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
