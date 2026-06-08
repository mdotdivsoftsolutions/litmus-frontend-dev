import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { adminApi } from "@/lib/api/admin";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Filter, ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalendarIcon, Beaker } from "lucide-react";
import { bookings as dummyBookings } from "@/lib/placeholder-data";

const ITEMS_PER_PAGE = 10;

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: adminApi.getBookings,
  });

  const rawBookings = response?.data || [];

  // Map API data to our table format. Prioritize API data only.
  const mappedBookings = rawBookings.map((b: any) => ({
    id: b._id,
    displayId: `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`,
    user: `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim(),
    product: b.productId?.name || "Unknown Product",
    lab: b.labId?.labName || "Unknown Lab",
    testsCount: b.selectedTests?.length || 0,
    selectedTests: b.selectedTests || [],
    amount: b.selectedTests?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0,
    paymentStatus: b.paymentStatus || "Pending",
    status: b.status || "Pending",
    date: format(new Date(b.createdAt || new Date()), "MMM d, yyyy"),
    rawDate: new Date(b.createdAt || new Date()),
    isReportApprovedByAdmin: b.isReportApprovedByAdmin
  }));

  const filtered = mappedBookings.filter((b: any) => {
    const matchesSearch = !search || 
      b.displayId.toLowerCase().includes(search.toLowerCase()) || 
      b.user.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentStatusFilter === "all" || b.paymentStatus.toLowerCase() === paymentStatusFilter.toLowerCase();
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && !isBefore(b.rawDate, startOfDay(new Date(startDate)));
    }
    if (endDate) {
      matchesDate = matchesDate && !isAfter(b.rawDate, endOfDay(new Date(endDate)));
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedBookings = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  const timelineSteps = [
    { label: "Booking Placed", done: true },
    { label: "Payment Confirmed", done: selectedBooking?.paymentStatus === "Paid" },
    { label: "Admin Approved", done: selectedBooking?.status !== "Pending" },
    { label: "Lab Assigned", done: ["In Progress", "Completed"].includes(selectedBooking?.status || "") },
    { label: "Testing In Progress", done: selectedBooking?.status === "In Progress" || selectedBooking?.status === "Completed" },
    { label: "Report Uploaded", done: selectedBooking?.status === "Completed" },
    { label: "Complete", done: selectedBooking?.status === "Completed" },
  ];

  const renderTable = (items: any[]) => (
    <Card className="border border-border shadow-sm overflow-hidden">
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                   <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                   <span>No bookings found matching your criteria.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {items.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedBooking(b)}>
                  <TableCell className="font-medium font-mono text-sm">{b.displayId}</TableCell>
                  <TableCell>{b.user}</TableCell>
                  <TableCell>{b.product}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{b.lab}</TableCell>
                  <TableCell><StatusBadge status={b.paymentStatus === "Paid" ? "Approved" : b.paymentStatus === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); }}><Eye className="h-3.5 w-3.5" />View</Button></TableCell>
                </TableRow>
              ))}
              {!isLoading && items.length > 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="p-0">
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> bookings
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(1, p - 1)); }} disabled={currentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium px-2">Page {currentPage} of {Math.max(1, totalPages)}</div>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1)); }} disabled={currentPage >= totalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, User..." 
            className="pl-9 bg-background/50" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2 bg-background/50" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4" />Filters
            {(statusFilter !== 'all' || paymentStatusFilter !== 'all' || startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
          </Button>
          <SheetContent className="overflow-y-auto">
            <SheetHeader><SheetTitle>Filter Bookings</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Booking Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {["Pending", "Approved", "In Progress", "Completed", "Rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="All Payments" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    {["Paid", "Pending", "Refunded"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">From</span>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">To</span>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary-deep" onClick={() => { setShowFilters(false); setCurrentPage(1); }}>Apply Filters</Button>
                <Button variant="outline" className="flex-1" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all" value={statusFilter === "all" ? "all" : statusFilter.toLowerCase()} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="in progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          {renderTable(paginatedBookings)}
        </div>
      </Tabs>

      {/* Detailed View Sheet */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-[95vw]">
          {selectedBooking && (
            <>
              <SheetHeader><SheetTitle>Booking Details</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-5 pb-10">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 break-all"><p className="text-muted-foreground text-xs mb-1">Booking ID</p><p className="font-mono font-medium text-xs">{selectedBooking.displayId}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-medium text-xs">{selectedBooking.date}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">User</p><p className="font-medium text-sm">{selectedBooking.user}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Product</p><p className="font-medium text-sm">{selectedBooking.product}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Laboratory</p><p className="font-medium text-sm">{selectedBooking.lab}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Payment</p><StatusBadge status={selectedBooking.paymentStatus} /></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Status</p><StatusBadge status={selectedBooking.status} /></div>
                </div>

                {/* Selected Tests Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2"><Beaker className="h-4 w-4" /> Selected Tests</h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="py-2 h-auto text-xs">Test Name</TableHead>
                          <TableHead className="py-2 h-auto text-xs text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBooking.selectedTests.map((t: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="py-2 text-sm">{t.testName}</TableCell>
                            <TableCell className="py-2 text-sm text-right font-medium">₹{t.price?.toLocaleString() || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Booking Timeline</h4>
                  <div className="space-y-0 bg-muted/10 rounded-lg p-4 border border-border">
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

                {/* Admin Actions */}
                {selectedBooking.status === "Pending" && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <h4 className="text-sm font-semibold">Admin Actions</h4>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Reason (for rejection)</label>
                      <Textarea placeholder="Enter reason if rejecting..." className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Reassign Lab</label>
                      <Select>
                        <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select alternative lab..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lab1">Central Food Testing Lab</SelectItem>
                          <SelectItem value="lab2">Quality Analytical Lab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-sm">Approve Booking</Button>
                      <Button variant="destructive" className="flex-1 shadow-sm">Reject</Button>
                    </div>
                  </div>
                )}
                
                {selectedBooking.status === "Completed" && !selectedBooking.isReportApprovedByAdmin && (
                   <div className="space-y-3 border-t border-border pt-4">
                      <h4 className="text-sm font-semibold text-emerald-600">Report Ready for Review</h4>
                      <Button className="w-full bg-primary hover:bg-primary-deep shadow-sm">Approve Report & Release</Button>
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
