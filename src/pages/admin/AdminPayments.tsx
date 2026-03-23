import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DollarSign, Clock, Building2, Eye } from "lucide-react";
import { payments } from "@/lib/placeholder-data";

const summaryCards = [
  { label: "Total Collected", value: "₹36,200", icon: DollarSign },
  { label: "Platform Revenue", value: "₹5,430", icon: Building2 },
  { label: "Pending to Labs", value: "₹7,000", icon: Clock },
];

export default function AdminPayments() {
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);

  const renderPaymentTable = (items: typeof payments) => (
    <Card className="border border-border shadow-sm overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Transaction ID</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead className="hidden md:table-cell">Lab</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Platform Fee</TableHead>
            <TableHead className="hidden md:table-cell">Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.id} className="hover:bg-muted/30">
              <TableCell className="font-medium font-mono text-sm">{p.id}</TableCell>
              <TableCell>{p.bookingId}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.lab.split(" ").slice(0, 2).join(" ")}</TableCell>
              <TableCell className="font-medium">₹{p.amount.toLocaleString()}</TableCell>
              <TableCell className="hidden md:table-cell">₹{Math.round(p.amount * 0.15).toLocaleString()}</TableCell>
              <TableCell className="hidden md:table-cell">{p.gateway}</TableCell>
              <TableCell><StatusBadge status={p.status === "Paid" ? "Approved" : p.status === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
              <TableCell><Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedPayment(p)}><Eye className="h-3.5 w-3.5" />View</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Payment & Settlement</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border border-border shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="flex items-center gap-4 p-5 pl-5">
              <div className="h-10 w-10 rounded-full bg-flame-red-tint flex items-center justify-center"><c.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">{c.label}</p><p className="text-2xl font-semibold">{c.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending Settlement</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">{renderPaymentTable(payments)}</TabsContent>
        <TabsContent value="pending" className="mt-4">{renderPaymentTable(payments.filter(p => p.status === "Pending"))}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderPaymentTable(payments.filter(p => p.status === "Paid"))}</TabsContent>
        <TabsContent value="refunds" className="mt-4">{renderPaymentTable(payments.filter(p => p.status === "Refunded"))}</TabsContent>
      </Tabs>

      {/* Payment Detail Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedPayment && (
            <>
              <SheetHeader><SheetTitle>Transaction Details</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Transaction ID</p><p className="font-mono font-medium">{selectedPayment.id}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Booking ID</p><p className="font-mono font-medium">{selectedPayment.bookingId}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Lab</p><p className="font-medium text-xs">{selectedPayment.lab}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">{selectedPayment.date}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Gateway</p><p className="font-medium">{selectedPayment.gateway}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Status</p><StatusBadge status={selectedPayment.status === "Paid" ? "Approved" : selectedPayment.status === "Refunded" ? "Rejected" : "Pending"} /></div>
                </div>
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Amount Breakdown</h4>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Amount</span><span className="font-medium">₹{selectedPayment.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee (15%)</span><span className="font-medium">₹{Math.round(selectedPayment.amount * 0.15).toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span className="font-medium">₹{Math.round(selectedPayment.amount * 0.18).toLocaleString()}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold">Lab Payout</span><span className="font-semibold text-primary">₹{Math.round(selectedPayment.amount * 0.85).toLocaleString()}</span></div>
                </div>
                <Button variant="outline" className="w-full">Download Receipt</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
