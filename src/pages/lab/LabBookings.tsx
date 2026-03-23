import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Upload } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

export default function LabBookings() {
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="new">New</TabsTrigger><TabsTrigger value="inprogress">In Progress</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger><TabsTrigger value="all">All</TabsTrigger></TabsList>
        {["all", "new", "inprogress", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="border border-border shadow-sm overflow-auto">
              <Table>
                <TableHeader><TableRow className="bg-muted/50"><TableHead>Booking ID</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Tests</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {bookings.filter((b) => tab === "all" || (tab === "new" && b.status === "Pending") || (tab === "inprogress" && b.status === "In Progress") || (tab === "completed" && b.status === "Completed")).map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium font-mono text-sm">{b.id}</TableCell>
                      <TableCell>{b.user}</TableCell>
                      <TableCell>{b.product}</TableCell>
                      <TableCell><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{b.date}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedBooking(b)}><Eye className="h-3.5 w-3.5" />View</Button>
                          <Button variant="ghost" size="sm" className="gap-1" asChild><Link to={`/lab/bookings/${b.id}/upload`}><Upload className="h-3.5 w-3.5" />Upload</Link></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Booking Detail Sheet */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedBooking && (
            <>
              <SheetHeader><SheetTitle className="flex items-center gap-3">{selectedBooking.id}<StatusBadge status={selectedBooking.status} /></SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">User</p><p className="font-medium">{selectedBooking.user}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Product</p><p className="font-medium">{selectedBooking.product}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Tests</p><p className="font-medium">{selectedBooking.testsCount} tests</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">{selectedBooking.date}</p></div>
                  <div className="rounded-lg border border-border p-3 col-span-2"><p className="text-muted-foreground text-xs">Amount</p><p className="font-medium text-primary">₹{selectedBooking.amount.toLocaleString()}</p></div>
                </div>

                {/* Sample Details */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold mb-3">Sample Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Batch Number</span><span>BTH-2024-0315</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Mfg Date</span><span>2024-02-28</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Expiry Date</span><span>2024-08-28</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Sample Qty</span><span>500 gm</span></div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold mb-3">Update Status</h4>
                  <Select defaultValue={selectedBooking.status.toLowerCase().replace(" ", "-")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full mt-3 bg-primary hover:bg-primary-deep">Update Status</Button>
                </div>

                <Button className="w-full gap-2" variant="outline" asChild>
                  <Link to={`/lab/bookings/${selectedBooking.id}/upload`}><Upload className="h-4 w-4" />Upload Results</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
