import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Filter, X } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const timelineSteps = [
    { label: "Booking Placed", done: true },
    { label: "Payment Confirmed", done: true },
    { label: "Admin Approved", done: selectedBooking?.status !== "Pending" },
    { label: "Lab Assigned", done: ["In Progress", "Completed"].includes(selectedBooking?.status || "") },
    { label: "Testing In Progress", done: selectedBooking?.status === "In Progress" || selectedBooking?.status === "Completed" },
    { label: "Report Uploaded", done: selectedBooking?.status === "Completed" },
    { label: "Complete", done: selectedBooking?.status === "Completed" },
  ];

  const renderTable = (items: typeof bookings) => (
    <Card className="border border-border shadow-sm overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Booking ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Tests</TableHead>
            <TableHead className="hidden md:table-cell">Lab</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.filter((b) => !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.user.toLowerCase().includes(search.toLowerCase())).map((b) => (
            <TableRow key={b.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedBooking(b)}>
              <TableCell className="font-medium font-mono text-sm">{b.id}</TableCell>
              <TableCell>{b.user}</TableCell>
              <TableCell>{b.product}</TableCell>
              <TableCell className="hidden md:table-cell"><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{b.lab.split(" ").slice(0, 2).join(" ")}</TableCell>
              <TableCell><StatusBadge status={b.paymentStatus === "Paid" ? "Approved" : b.paymentStatus === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
              <TableCell><StatusBadge status={b.status} /></TableCell>
              <TableCell><Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); }}><Eye className="h-3.5 w-3.5" />View</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}><Filter className="h-4 w-4" />Filters</Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Bookings</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select><SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>{["Pending", "Approved", "In Progress", "Completed", "Rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Payment Status</label>
                <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>{["Paid", "Pending", "Refunded"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Date Range</label><div className="grid grid-cols-2 gap-2"><Input type="date" /><Input type="date" /></div></div>
              <div className="space-y-2"><label className="text-sm font-medium">Lab</label><Input placeholder="Search lab name..." /></div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary-deep">Apply Filters</Button>
                <Button variant="outline" className="flex-1">Clear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">{renderTable(bookings)}</TabsContent>
        <TabsContent value="pending" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Pending"))}</TabsContent>
        <TabsContent value="approved" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Approved"))}</TabsContent>
        <TabsContent value="inprogress" className="mt-4">{renderTable(bookings.filter((b) => b.status === "In Progress"))}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Completed"))}</TabsContent>
        <TabsContent value="rejected" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Rejected"))}</TabsContent>
      </Tabs>

      {/* Booking Detail Sheet */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {selectedBooking.id}
                  <StatusBadge status={selectedBooking.status} />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Booking Timeline</h4>
                  <div className="space-y-0">
                    {timelineSteps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${step.done ? "bg-litmus-emerald border-litmus-emerald" : "bg-card border-border"}`} />
                          {i < timelineSteps.length - 1 && <div className={`w-0.5 flex-1 min-h-[1.5rem] ${step.done ? "bg-litmus-emerald" : "bg-border"}`} />}
                        </div>
                        <p className={`text-sm pb-4 ${step.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">User</p><p className="font-medium">{selectedBooking.user}</p></div>
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Product</p><p className="font-medium">{selectedBooking.product}</p></div>
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Lab</p><p className="font-medium text-xs">{selectedBooking.lab}</p></div>
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Amount</p><p className="font-medium">₹{selectedBooking.amount.toLocaleString()}</p></div>
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Tests</p><p className="font-medium">{selectedBooking.testsCount} tests</p></div>
                    <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">{selectedBooking.date}</p></div>
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedBooking.status === "Pending" && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <h4 className="text-sm font-semibold">Admin Actions</h4>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Reason (for rejection)</label>
                      <Textarea placeholder="Enter reason if rejecting..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Reassign Lab</label>
                      <Select><SelectTrigger><SelectValue placeholder="Select Lab" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chennai">Chennai Food Testing Lab</SelectItem>
                          <SelectItem value="mumbai">Mumbai Analytical Sciences</SelectItem>
                          <SelectItem value="delhi">Delhi Food Research Institute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-litmus-emerald hover:bg-litmus-teal text-white">Approve</Button>
                      <Button variant="outline" className="flex-1 text-status-rejected border-status-rejected">Reject</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
