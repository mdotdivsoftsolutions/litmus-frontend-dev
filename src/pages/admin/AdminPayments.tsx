import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { DollarSign, Clock, Building2 } from "lucide-react";
import { payments } from "@/lib/placeholder-data";

const summaryCards = [
  { label: "Total Collected", value: "₹36,200", icon: DollarSign },
  { label: "Platform Revenue", value: "₹5,430", icon: Building2 },
  { label: "Pending to Labs", value: "₹7,000", icon: Clock },
];

export default function AdminPayments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Payment & Settlement</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-2.5"><c.icon className="h-5 w-5 text-secondary" /></div>
              <div><p className="text-sm text-muted-foreground">{c.label}</p><p className="text-2xl font-bold">{c.value}</p></div>
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
        <TabsContent value="all" className="mt-4">
          <Card className="border-0 shadow-sm overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead className="hidden md:table-cell">Lab</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Platform Fee</TableHead>
                  <TableHead className="hidden md:table-cell">Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium font-mono text-sm">{p.id}</TableCell>
                    <TableCell>{p.bookingId}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.lab.split(" ").slice(0, 2).join(" ")}</TableCell>
                    <TableCell className="font-medium">₹{p.amount.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">₹{Math.round(p.amount * 0.15).toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.gateway}</TableCell>
                    <TableCell><StatusBadge status={p.status === "Paid" ? "Approved" : p.status === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="mt-4"><Card className="border-0 shadow-sm p-8 text-center text-muted-foreground">Pending settlements will appear here</Card></TabsContent>
        <TabsContent value="completed" className="mt-4"><Card className="border-0 shadow-sm p-8 text-center text-muted-foreground">Completed settlements will appear here</Card></TabsContent>
        <TabsContent value="refunds" className="mt-4"><Card className="border-0 shadow-sm p-8 text-center text-muted-foreground">Refunds will appear here</Card></TabsContent>
      </Tabs>
    </div>
  );
}
