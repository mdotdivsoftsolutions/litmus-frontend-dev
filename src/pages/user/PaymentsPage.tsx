import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Download, CreditCard, Clock, RefreshCw } from "lucide-react";
import { payments } from "@/lib/placeholder-data";

const summaryCards = [
  { label: "Total Paid", value: "₹29,800", icon: CreditCard, color: "text-status-approved" },
  { label: "Pending", value: "₹7,000", icon: Clock, color: "text-status-pending" },
  { label: "Refunds", value: "₹4,100", icon: RefreshCw, color: "text-status-rejected" },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Payments</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-2.5"><c.icon className={`h-5 w-5 ${c.color}`} /></div>
              <div><p className="text-sm text-muted-foreground">{c.label}</p><p className="text-2xl font-bold">{c.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead className="hidden md:table-cell">Lab</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
                <TableCell>{p.bookingId}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.lab.split(" ").slice(0, 2).join(" ")}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                <TableCell className="font-medium">₹{p.amount.toLocaleString()}</TableCell>
                <TableCell><StatusBadge status={p.status === "Paid" ? "Approved" : p.status === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-3.5 w-3.5" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
