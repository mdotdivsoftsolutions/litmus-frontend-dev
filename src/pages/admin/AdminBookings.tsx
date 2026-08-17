import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { authApi } from "@/lib/api/auth";
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
import { Search, Eye, Filter, ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalendarIcon, Beaker, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AdminBookings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Assignment & Rejection State
  const [selectedLabId, setSelectedLabId] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => adminApi.getBookings(),
  });

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
  });
  const user = userResponse?.data;
  const canViewPricing = user?.role === "ADMIN" || (user?.role === "EMPLOYEE" && user?.permissions?.includes("VIEW_PRICING"));

  const { data: labsResponse } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });
  const labs = labsResponse?.data || [];

  const rawBookings = response?.data || [];

  const assignLabMutation = useMutation({
    mutationFn: ({ id, labId }: { id: string, labId: string }) => adminApi.assignLab(id, labId),
    onSuccess: () => {
      toast.success("Laboratory assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedBooking(null);
      setSelectedLabId("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to assign lab")
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => adminApi.rejectBooking(id, reason),
    onSuccess: () => {
      toast.success("Booking rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedBooking(null);
      setIsRejecting(false);
      setRejectReason("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject booking")
  });

  // Map API data to our table format. Prioritize API data only.
  const mappedBookings = rawBookings.map((b: any) => {
    const productNames = b.items?.map((i: any) => i.samples?.[0]?.productName || i.packageId?.name || i.testId?.testName || i.testId?.name).filter(Boolean);
    const product = productNames?.length > 0 ? productNames.join(", ") : "Unknown Product";
    const testsCount = b.items?.reduce((count: number, i: any) => count + (i.samples?.reduce((sc: number, s: any) => sc + (s.selectedParameters?.length || 1), 0) || 1), 0) || 0;
    const totalSamples = b.items?.reduce((count: number, i: any) => count + (i.samples?.length || 0), 0) || 0;
    const itemTypes = Array.from(new Set(b.items?.map((i: any) => i.itemType))).filter(Boolean);

    const rawPay = String(b.paymentStatus || "").toUpperCase();
    const isPaid = rawPay === "SUCCESS" || rawPay === "PAID" || ["APPROVED", "IN_PROGRESS", "COMPLETED"].includes(String(b.status || "").toUpperCase());
    const paymentStatus = isPaid ? "Paid" : rawPay === "REFUNDED" ? "Refunded" : rawPay === "FAILED" ? "Failed" : "Pending";

    return {
      id: b._id,
      displayId: `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`,
      user: `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.collectionDetails?.name || "Unknown User",
      product,
      lab: b.labId?.labName 
        ? b.labId.labName 
        : b.metadata?.isLitmusDirect 
          ? "Litmus (End-to-End Direct)" 
          : "Litmus Smart Allocation",
      testsCount,
      amount: b.totalAmount || b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0,
      paymentStatus,
      status: b.status || "PENDING",
      date: format(new Date(b.createdAt || new Date()), "MMM d, yyyy"),
      rawDate: new Date(b.createdAt || new Date()),
      isReportApprovedByAdmin: b.isReportApprovedByAdmin,
      rawItems: b.items || [],
      userEmail: b.userId?.email,
      userPhone: b.userId?.phone,
      collectionDetails: b.metadata?.collectionDetails || b.collectionDetails || {},
      totalSamples,
      itemTypes
    };
  }).sort((a: any, b: any) => b.rawDate.getTime() - a.rawDate.getTime());

  const normStatus = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '_');

  const filtered = mappedBookings.filter((b: any) => {
    const matchesSearch = !search ||
      b.displayId.toLowerCase().includes(search.toLowerCase()) ||
      b.user.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || normStatus(b.status) === normStatus(statusFilter);
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

  const isSelectedRejected = selectedBooking?.status?.toUpperCase() === 'REJECTED';
  const isSelectedCancelled = selectedBooking?.status?.toUpperCase() === 'CANCELLED';

  const payStatusUpper = (selectedBooking?.paymentStatus || '').toUpperCase();
  const isSelectedPaymentPaid = ['SUCCESS', 'PAID'].includes(payStatusUpper) || ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(selectedBooking?.status?.toUpperCase() || '');
  const isSelectedPaymentFailed = payStatusUpper === 'FAILED';
  const isSelectedPaymentRefunded = payStatusUpper === 'REFUNDED';
  const isSelectedPaymentRefundInitiated = payStatusUpper === 'REFUND_INITIATED';

  let selectedPaymentStep: {
    label: string;
    done: boolean;
    state: "completed" | "rejected" | "warning" | "failed" | "refunded" | "pending";
  };

  if (isSelectedPaymentPaid) {
    selectedPaymentStep = { label: "Payment Confirmed (Paid)", done: true, state: "completed" };
  } else if (isSelectedPaymentRefunded) {
    selectedPaymentStep = { label: "Payment Refunded", done: true, state: "refunded" };
  } else if (isSelectedPaymentRefundInitiated) {
    selectedPaymentStep = { label: "Refund Initiated", done: true, state: "warning" };
  } else if (isSelectedPaymentFailed) {
    selectedPaymentStep = { label: "Payment Failed", done: false, state: "failed" };
  } else {
    selectedPaymentStep = { label: "Payment Pending", done: false, state: "warning" };
  }

  const timelineSteps = isSelectedRejected ? [
    { label: "Booking Placed", done: true, state: "completed" as const },
    selectedPaymentStep,
    { label: "Booking Rejected by Admin", done: true, state: "rejected" as const },
  ] : isSelectedCancelled ? [
    { label: "Booking Placed", done: true, state: "completed" as const },
    selectedPaymentStep,
    { label: "Booking Cancelled", done: true, state: "rejected" as const },
  ] : [
    { label: "Booking Placed", done: true, state: "completed" as const },
    selectedPaymentStep,
    { label: "Admin Approved", done: ["approved", "in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || ""), state: ["approved", "in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "") ? "completed" as const : "pending" as const },
    { label: "Lab Assigned", done: Boolean(selectedBooking?.lab && selectedBooking?.lab !== "Litmus Smart Allocation") || ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || ""), state: Boolean(selectedBooking?.lab && selectedBooking?.lab !== "Litmus Smart Allocation") || ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "") ? "completed" as const : "pending" as const },
    { label: "Testing In Progress", done: ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || ""), state: ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "") ? "completed" as const : "pending" as const },
    { label: "Report Uploaded", done: Boolean(selectedBooking?.isReportApprovedByAdmin) || selectedBooking?.status?.toLowerCase() === "completed", state: Boolean(selectedBooking?.isReportApprovedByAdmin) || selectedBooking?.status?.toLowerCase() === "completed" ? "completed" as const : "pending" as const },
    { label: "Complete", done: selectedBooking?.status?.toLowerCase() === "completed", state: selectedBooking?.status?.toLowerCase() === "completed" ? "completed" as const : "pending" as const },
  ];

  const renderTable = (items: any[]) => (
    <Card className="border border-border shadow-sm overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Booking ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Tests</TableHead>
            <TableHead className="hidden md:table-cell">Lab</TableHead>
            {canViewPricing && <TableHead>Amount</TableHead>}
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                {canViewPricing && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                  <span className="font-medium">No bookings found matching your criteria.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {items.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedBooking(b)}>
                  <TableCell className="font-medium font-mono text-sm">{b.displayId}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-medium">{b.date}</TableCell>
                  <TableCell>{b.user}</TableCell>
                  <TableCell>{b.product}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{b.lab}</TableCell>
                  {canViewPricing && <TableCell className="font-medium">₹{b.amount?.toLocaleString()}</TableCell>}
                  <TableCell><StatusBadge status={b.paymentStatus} /></TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); }}>
                        <Eye className="h-3.5 w-3.5" />View
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 h-8 bg-white border border-slate-200" onClick={(e) => { e.stopPropagation(); navigate(`/admin/bookings/${b.id}`); }}>
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && items.length > 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={10} className="p-0">
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> bookings
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-white border border-slate-200 shadow-sm" onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(1, p - 1)); }} disabled={currentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium px-2">Page {currentPage} of {Math.max(1, totalPages)}</div>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-white border border-slate-200 shadow-sm" onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1)); }} disabled={currentPage >= totalPages}>
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
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Track diagnostic test orders, sample logistics, lab assignments, and live fulfillment statuses.
        </p>
      </div>

      <Tabs defaultValue="all" value={statusFilter === "all" ? "all" : normStatus(statusFilter)} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList className="bg-white border border-slate-200 shadow-sm p-1 self-start lg:self-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, User..."
                className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={() => setShowFilters(true)}>
                <Filter className="h-4 w-4" />Filters
                {(statusFilter !== 'all' || paymentStatusFilter !== 'all' || startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
              </Button>
              <SheetContent className="overflow-y-auto">
                <SheetHeader><SheetTitle>Filter Bookings</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Booking Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {["Pending", "Approved", "In Progress", "Completed", "Rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Status</label>
                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                      <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                        <SelectValue placeholder="All Payments" />
                      </SelectTrigger>
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
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border border-slate-200 shadow-sm text-xs" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">To</span>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border border-slate-200 shadow-sm text-xs" />
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
        </div>

        <div className="mt-4">
          {renderTable(paginatedBookings)}
        </div>
      </Tabs>

      {/* Detailed View Sheet */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => {
        if (!open) {
          setSelectedBooking(null);
          setIsRejecting(false);
          setRejectReason("");
          setSelectedLabId("");
        }
      }}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-[95vw]">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center mr-4">
                  <span>Booking Details</span>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/bookings/${selectedBooking.id}`)}>View Full Page</Button>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5 pb-10">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 break-all"><p className="text-muted-foreground text-xs mb-1">Booking ID</p><p className="font-mono font-medium text-xs">{selectedBooking.displayId}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-medium text-xs">{selectedBooking.date}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">User</p><p className="font-medium text-sm">{selectedBooking.user}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-muted-foreground text-xs">Product</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedBooking.itemTypes?.map((t: string) => (
                          <Badge key={t} className="text-[9px] uppercase tracking-wider px-1.5 py-0 bg-primary/10 text-primary border-primary/20">{t}</Badge>
                        ))}
                        {selectedBooking.totalSamples > 0 && <Badge className="text-[9px] uppercase tracking-wider px-1.5 py-0 bg-slate-200 text-slate-700 border-0">{selectedBooking.totalSamples} Samples</Badge>}
                      </div>
                    </div>
                    <p className="font-medium text-sm">{selectedBooking.product}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Laboratory</p><p className="font-medium text-sm">{selectedBooking.lab}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Payment</p><StatusBadge status={selectedBooking.paymentStatus} /></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Status</p><StatusBadge status={selectedBooking.status} /></div>
                </div>

                {/* Collection Details */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">Contact Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Name</p><p className="font-medium text-xs">{selectedBooking.collectionDetails?.name || selectedBooking.user}</p></div>
                    <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Phone</p><p className="font-medium text-xs">{selectedBooking.collectionDetails?.phone || selectedBooking.userPhone || "N/A"}</p></div>
                    <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Email</p><p className="font-medium text-xs">{selectedBooking.collectionDetails?.email || selectedBooking.userEmail || "N/A"}</p></div>
                  </div>
                </div>

                {/* Selected Tests Breakdown */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2"><Beaker className="h-4 w-4" /> Booking Items & Samples</h4>
                  <div className="space-y-3">
                    {selectedBooking.rawItems.map((item: any, i: number) => (
                      <div key={i} className="rounded-lg border border-border overflow-hidden">
                        <div className="bg-muted/50 px-3 py-2 flex justify-between items-center border-b border-border">
                          <span className="font-semibold text-sm">Item {i + 1}: {item.itemType} - {item.packageId?.name || item.testId?.testName || item.testId?.name || "Custom"}</span>
                          {canViewPricing && <span className="font-medium text-sm">₹{item.price?.toLocaleString() || 0}</span>}
                        </div>
                        <div className="p-3 bg-card space-y-3">
                          {item.samples?.map((sample: any, j: number) => (
                            <div key={j} className="text-sm space-y-3 border-b border-border pb-3 last:border-0 last:pb-0">
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Product Info</span>
                                <p className="font-medium text-base text-foreground">{sample.productName || "Unknown Product"}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                                  {sample.quantity && <span>Qty: <span className="font-medium text-slate-700">{sample.quantity}</span></span>}
                                  {sample.batchNumber && <span>Batch: <span className="font-medium text-slate-700">{sample.batchNumber}</span></span>}
                                  {sample.sku && <span>SKU: <span className="font-medium text-slate-700">{sample.sku}</span></span>}
                                </div>
                              </div>
                              {((sample.selectedParameters && sample.selectedParameters.length > 0) || (sample.selectedTests && sample.selectedTests.length > 0)) && (
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1.5">
                                    {item.itemType === 'PACKAGE' ? 'Tests Included' : 'Parameters to Test'}
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {((item.itemType === 'PACKAGE' && sample.selectedTests?.length > 0) ? sample.selectedTests : sample.selectedParameters).map((p: string, k: number) => (
                                      <Badge key={k} variant="outline" className="font-normal text-xs bg-background text-foreground shadow-sm">
                                        {p.startsWith("pkg-feat-") ? p.replace("pkg-feat-", "") : p}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {sample.specifics && (
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Specifics</span>
                                  <p className="text-xs mt-0.5 bg-muted/30 p-2 rounded-md">{sample.specifics}</p>
                                </div>
                              )}
                            </div>
                          ))}
                          {(!item.samples || item.samples.length === 0) && (
                            <p className="text-sm font-medium">{item.packageId?.name || item.testId?.name || "Service Item"}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Booking Timeline</h4>
                  <div className="space-y-0 bg-muted/10 rounded-lg p-4 border border-border">
                    {timelineSteps.map((step: any, i: number) => {
                      const isStepRejected = step.state === "rejected" || step.state === "failed";
                      const isStepWarning = step.state === "warning";
                      const isStepRefunded = step.state === "refunded";
                      const isStepCompleted = step.state === "completed" || step.done;

                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                              isStepRejected 
                                ? "bg-red-600 border-red-600 text-white" 
                                : isStepWarning
                                  ? "bg-amber-500 border-amber-500 text-white"
                                  : isStepRefunded
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : isStepCompleted 
                                      ? "bg-litmus-emerald border-litmus-emerald text-white" 
                                      : "bg-card border-border"
                            }`}>
                              {isStepRejected ? (
                                <XCircle className="h-2.5 w-2.5" />
                              ) : isStepWarning ? (
                                <AlertTriangle className="h-2.5 w-2.5" />
                              ) : isStepRefunded ? (
                                <RotateCcw className="h-2.5 w-2.5" />
                              ) : isStepCompleted ? (
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              ) : null}
                            </div>
                            {i < timelineSteps.length - 1 && (
                              <div className={`w-0.5 flex-1 min-h-[1.5rem] my-0.5 ${
                                isStepRejected 
                                  ? "bg-red-300 dark:bg-red-900/60" 
                                  : isStepWarning
                                    ? "bg-amber-300 dark:bg-amber-900/60"
                                    : isStepCompleted 
                                      ? "bg-litmus-emerald" 
                                      : "bg-border"
                              }`} />
                            )}
                          </div>
                          <p className={`text-sm pb-4 ${
                            isStepRejected 
                              ? "text-red-600 dark:text-red-400 font-bold" 
                              : isStepWarning
                                ? "text-amber-700 dark:text-amber-400 font-semibold"
                                : isStepRefunded
                                  ? "text-blue-700 dark:text-blue-400 font-semibold"
                                  : isStepCompleted 
                                    ? "text-foreground font-medium" 
                                    : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedBooking.status?.toLowerCase() === "pending" && (
                  <div className="space-y-4 border-t border-border pt-4">
                    <h4 className="text-sm font-semibold">Admin Actions</h4>

                    {isRejecting ? (
                      <div className="space-y-3 bg-red-50/50 p-3 rounded-lg border border-red-100 dark:bg-red-950/20 dark:border-red-900">
                        <label className="text-sm font-medium text-red-800 dark:text-red-300">Reason for Rejection</label>
                        <Textarea
                          placeholder="Please provide a reason to the user..."
                          className="bg-background/50 border-red-200 focus-visible:ring-red-500"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => rejectBookingMutation.mutate({ id: selectedBooking.id, reason: rejectReason })}
                            disabled={!rejectReason.trim() || rejectBookingMutation.isPending}
                          >
                            {rejectBookingMutation.isPending ? "Rejecting..." : "Submit Rejection"}
                          </Button>
                          <Button variant="outline" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Assign Laboratory</label>
                          <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select lab to forward to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="litmus_direct" className="font-semibold text-emerald-700 dark:text-emerald-400">
                                Litmus (End-to-End Direct Handling)
                              </SelectItem>
                              {labs.map((lab: any) => (
                                <SelectItem key={lab._id} value={lab._id}>{lab.labName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-sm"
                            disabled={!selectedLabId || assignLabMutation.isPending}
                            onClick={() => assignLabMutation.mutate({ id: selectedBooking.id, labId: selectedLabId })}
                          >
                            {assignLabMutation.isPending ? "Assigning..." : "Approve & Assign Lab"}
                          </Button>
                          <Button variant="outline" className="flex-1 shadow-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setIsRejecting(true)}>Reject Booking</Button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {selectedBooking.status?.toLowerCase() === "completed" && !selectedBooking.isReportApprovedByAdmin && (
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
