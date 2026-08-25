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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Eye, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  Beaker, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText,
  Building2,
  Phone,
  Mail,
  User as UserIcon,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Package,
  Layers,
  MapPin,
  ShieldCheck,
  CreditCard,
  Receipt,
  Truck,
  Copy,
  Check,
  ArrowRight,
  FlaskConical
} from "lucide-react";
import { InvoiceDialog } from "@/components/admin/InvoiceDialog";

const ITEMS_PER_PAGE = 10;

export default function AdminBookings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [invoiceBookingId, setInvoiceBookingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Assignment & Rejection State
  const [selectedLabId, setSelectedLabId] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Query params sent to backend
  const queryParams = {
    status: statusFilter === "all" ? undefined : statusFilter.toUpperCase(),
    paymentStatus: paymentStatusFilter === "all" ? undefined : paymentStatusFilter.toUpperCase(),
    search: search.trim() || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminBookings", queryParams],
    queryFn: () => adminApi.getBookings(queryParams),
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
      hasReportPendingApproval: Boolean((b.reportFiles?.length > 0 || b.reportUrl || b.metadata?.reportUrl) && !b.isReportApprovedByAdmin),
      reportFiles: b.reportFiles || [],
      rawItems: b.items || [],
      userEmail: b.userId?.email,
      userPhone: b.userId?.phone,
      collectionDetails: b.metadata?.collectionDetails || b.collectionDetails || {},
      totalSamples,
      itemTypes
    };
  });

  const totalBookings = response?.total ?? (response?.count ?? rawBookings.length);
  const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalBookings / ITEMS_PER_PAGE));

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setSearch("");
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

  const formatDateSafe = (dateVal: any, formatStr = "MMM d, yyyy • h:mm a") => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return null;
      return format(d, formatStr);
    } catch {
      return null;
    }
  };

  const bookingCreatedDate = formatDateSafe(selectedBooking?.createdAt) || formatDateSafe(selectedBooking?.bookingDate) || "Recorded";
  const paymentConfirmedDate = formatDateSafe(selectedBooking?.metadata?.paymentConfirmedAt) || (isSelectedPaymentPaid ? formatDateSafe(selectedBooking?.createdAt) : null);

  let selectedPaymentStep: {
    label: string;
    done: boolean;
    state: "completed" | "rejected" | "warning" | "failed" | "refunded" | "pending";
    sub?: string;
    message?: string;
  };

  if (isSelectedPaymentPaid) {
    selectedPaymentStep = { 
      label: "Payment Confirmed (Paid)", 
      done: true, 
      state: "completed",
      sub: paymentConfirmedDate || undefined
    };
  } else if (isSelectedPaymentRefunded) {
    selectedPaymentStep = { 
      label: "Payment Refunded", 
      done: true, 
      state: "refunded",
      sub: formatDateSafe(selectedBooking?.updatedAt) || undefined
    };
  } else if (isSelectedPaymentRefundInitiated) {
    selectedPaymentStep = { 
      label: "Refund Initiated", 
      done: true, 
      state: "warning",
      sub: formatDateSafe(selectedBooking?.updatedAt) || undefined
    };
  } else if (isSelectedPaymentFailed) {
    selectedPaymentStep = { 
      label: "Payment Failed", 
      done: false, 
      state: "failed", 
      message: "Transaction unverified" 
    };
  } else {
    selectedPaymentStep = { 
      label: "Payment Pending", 
      done: false, 
      state: "warning", 
      message: "Awaiting customer payment" 
    };
  }

  const isSelectedAdminApproved = ["approved", "in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "");
  const selectedAdminApprovedDate = formatDateSafe(selectedBooking?.metadata?.adminApprovedAt) || (isSelectedAdminApproved ? formatDateSafe(selectedBooking?.updatedAt) : null);

  const isSelectedLabAssigned = Boolean(selectedBooking?.lab && selectedBooking?.lab !== "Litmus Smart Allocation") || ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "");
  const selectedLabAssignedDate = formatDateSafe(selectedBooking?.metadata?.labAssignedAt) || (isSelectedLabAssigned ? formatDateSafe(selectedBooking?.updatedAt) : null);
  const selectedLabMsg = selectedBooking?.lab && selectedBooking?.lab !== "Litmus Smart Allocation" ? `Assigned to: ${selectedBooking.lab}` : undefined;

  const selectedCollDetails = selectedBooking?.metadata?.collectionDetails || selectedBooking?.collectionDetails || {};
  const isSelectedCourierMethod = selectedBooking?.collectionMethod === 'COURIER' || 
                                  selectedBooking?.metadata?.collectionMethod === 'COURIER' || 
                                  selectedCollDetails?.collectionMethod === 'COURIER' || 
                                  Boolean(selectedBooking?.courierDetails?.trackingId);

  const isSelectedCollectorAssigned = Boolean(
    selectedBooking?.assignedCollector?.name || 
    ['ASSIGNED', 'REACHED', 'COLLECTED', 'SHIPPED'].includes(selectedBooking?.collectionStatus?.toUpperCase() || '') || 
    selectedBooking?.courierDetails?.trackingId || 
    ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "")
  );
  const selectedCollectorDate = formatDateSafe(selectedBooking?.metadata?.collectorAssignedAt) || 
    formatDateSafe(selectedBooking?.courierDetails?.submittedAt) || 
    (isSelectedCollectorAssigned ? formatDateSafe(selectedBooking?.updatedAt) : null);
  const selectedCollectorMsg = selectedBooking?.assignedCollector?.name 
    ? `Collector: ${selectedBooking.assignedCollector.name}` 
    : selectedBooking?.courierDetails?.trackingId 
      ? `Courier: ${selectedBooking.courierDetails.courierName || 'Shipped'} (${selectedBooking.courierDetails.trackingId})` 
      : isSelectedCollectorAssigned 
        ? (isSelectedCourierMethod ? "Courier dispatch added" : "Pickup collector assigned") 
        : undefined;

  const isSelectedSampleCollected = Boolean(
    ['COLLECTED', 'REACHED', 'SHIPPED'].includes(selectedBooking?.collectionStatus?.toUpperCase() || '') || 
    ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "")
  );
  const selectedSampleCollectedDate = formatDateSafe(selectedBooking?.metadata?.sampleCollectedAt) || (isSelectedSampleCollected ? formatDateSafe(selectedBooking?.updatedAt) : null);
  const selectedSampleMsg = isSelectedSampleCollected 
    ? (isSelectedCourierMethod ? "Sample received & verified at lab" : "Sample collected from client") 
    : undefined;

  const isSelectedTestingInProgress = ["in_progress", "in progress", "completed"].includes(selectedBooking?.status?.toLowerCase() || "");
  const selectedTestingDate = formatDateSafe(selectedBooking?.metadata?.testingStartedAt) || (isSelectedTestingInProgress ? formatDateSafe(selectedBooking?.updatedAt) : null);

  const isSelectedReportUploaded = Boolean(selectedBooking?.isReportApprovedByAdmin) || Boolean(selectedBooking?.reportFiles?.length) || selectedBooking?.status?.toLowerCase() === "completed";
  const selectedReportDate = formatDateSafe(selectedBooking?.reportSummary?.updatedAt) || formatDateSafe(selectedBooking?.metadata?.reportUploadedAt) || (isSelectedReportUploaded ? formatDateSafe(selectedBooking?.updatedAt) : null);

  const isSelectedComplete = selectedBooking?.status?.toLowerCase() === "completed";
  const selectedCompletedDate = formatDateSafe(selectedBooking?.metadata?.completedAt) || (isSelectedComplete ? formatDateSafe(selectedBooking?.updatedAt) : null);

  const timelineSteps = isSelectedRejected ? [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: bookingCreatedDate },
    selectedPaymentStep,
    { label: "Booking Rejected by Admin", done: true, state: "rejected" as const, sub: formatDateSafe(selectedBooking?.updatedAt), message: selectedBooking?.metadata?.rejectionReason },
  ] : isSelectedCancelled ? [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: bookingCreatedDate },
    selectedPaymentStep,
    { label: "Booking Cancelled", done: true, state: "rejected" as const, sub: formatDateSafe(selectedBooking?.updatedAt) },
  ] : [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: bookingCreatedDate },
    selectedPaymentStep,
    { 
      label: "Admin Approved", 
      done: isSelectedAdminApproved, 
      state: isSelectedAdminApproved ? "completed" as const : "pending" as const,
      sub: selectedAdminApprovedDate || undefined
    },
    { 
      label: "Lab Assigned", 
      done: isSelectedLabAssigned, 
      state: isSelectedLabAssigned ? "completed" as const : "pending" as const,
      sub: selectedLabAssignedDate || undefined,
      message: selectedLabMsg
    },
    { 
      label: isSelectedCourierMethod ? "Courier Dispatched" : "Collector Assigned", 
      done: isSelectedCollectorAssigned, 
      state: isSelectedCollectorAssigned ? "completed" as const : "pending" as const,
      sub: selectedCollectorDate || undefined,
      message: selectedCollectorMsg
    },
    { 
      label: isSelectedCourierMethod ? "Sample Received at Lab" : "Sample Collected", 
      done: isSelectedSampleCollected, 
      state: isSelectedSampleCollected ? "completed" as const : "pending" as const,
      sub: selectedSampleCollectedDate || undefined,
      message: selectedSampleMsg
    },
    { 
      label: "Testing In Progress", 
      done: isSelectedTestingInProgress, 
      state: isSelectedTestingInProgress ? "completed" as const : "pending" as const,
      sub: selectedTestingDate || undefined
    },
    { 
      label: "Certified Report Uploaded", 
      done: isSelectedReportUploaded, 
      state: isSelectedReportUploaded ? "completed" as const : "pending" as const,
      sub: selectedReportDate || undefined
    },
    { 
      label: "Order Fulfilled & Complete", 
      done: isSelectedComplete, 
      state: isSelectedComplete ? "completed" as const : "pending" as const,
      sub: selectedCompletedDate || undefined
    },
  ];

  const renderTable = (items: any[]) => (
    <Card className="border border-border shadow-sm overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Booking ID</TableHead>
            <TableHead>User & Date</TableHead>
            <TableHead>Product & Tests</TableHead>
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
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                {canViewPricing && <TableCell><Skeleton className="h-5 w-16" /></TableCell>}
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canViewPricing ? 8 : 7} className="text-center py-10 text-muted-foreground">
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
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-xs text-slate-900 leading-snug">{b.user}</span>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{b.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[260px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-xs text-slate-900 line-clamp-1" title={b.product}>
                        {b.product}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {b.testsCount} {b.testsCount === 1 ? 'Test' : 'Tests'}
                        </Badge>
                        {b.totalSamples > 0 && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {b.totalSamples} {b.totalSamples === 1 ? 'Sample' : 'Samples'}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{b.lab}</TableCell>
                  {canViewPricing && <TableCell className="font-medium">₹{b.amount?.toLocaleString()}</TableCell>}
                  <TableCell><StatusBadge status={b.paymentStatus} /></TableCell>
                  <TableCell>
                    {b.hasReportPendingApproval ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        <FileText className="h-3.5 w-3.5 text-amber-700" />
                        Report Uploaded
                      </span>
                    ) : (
                      <StatusBadge status={b.status} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 text-xs" onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); }}>
                        <Eye className="h-3.5 w-3.5" />View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 h-8 px-2 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white" 
                        onClick={(e) => { e.stopPropagation(); setInvoiceBookingId(b.id); }}
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-600" /> Invoice
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 h-8 px-2 text-xs bg-white border border-slate-200" onClick={(e) => { e.stopPropagation(); navigate(`/admin/bookings/${b.id}`); }}>
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && items.length > 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={canViewPricing ? 8 : 7} className="p-0">
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{totalBookings === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, totalBookings)}</span> of <span className="font-medium text-foreground">{totalBookings}</span> bookings
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-white border border-slate-200 shadow-sm" 
                          onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.max(1, p - 1)); }} 
                          disabled={currentPage <= 1 || isLoading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium px-2">Page {currentPage} of {Math.max(1, totalPages)}</div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-white border border-slate-200 shadow-sm" 
                          onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1)); }} 
                          disabled={currentPage >= totalPages || isLoading}
                        >
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

      <Tabs defaultValue="all" value={statusFilter === "all" ? "all" : statusFilter.toLowerCase()} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
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
          {renderTable(mappedBookings)}
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
        <SheetContent side="right" className="w-full sm:max-w-[520px] p-0 flex flex-col h-full bg-white dark:bg-card border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
          {selectedBooking && (
            <>
              <SheetHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-card shrink-0 text-left">
                <div className="flex items-center justify-between gap-3 pr-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900 dark:text-white tracking-tight">
                        {selectedBooking.displayId}
                      </span>
                      <StatusBadge status={selectedBooking.status} />
                      <StatusBadge status={selectedBooking.paymentStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Placed on {selectedBooking.date} • {selectedBooking.testsCount} {selectedBooking.testsCount === 1 ? 'Test' : 'Tests'} • {selectedBooking.totalSamples || 1} {selectedBooking.totalSamples === 1 ? 'Sample' : 'Samples'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs px-2.5 gap-1 border-slate-200 text-slate-700 hover:text-primary hover:border-primary/40 shadow-2xs" 
                    onClick={() => navigate(`/admin/bookings/${selectedBooking.id}`)}
                  >
                    <span>Full View</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* 1. Quick Financial & Order Overview */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Amount</span>
                    <span className="text-xl font-black text-primary">₹{selectedBooking.amount?.toLocaleString()}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Payment Status</span>
                    <StatusBadge status={selectedBooking.paymentStatus} />
                  </div>
                </div>

                {/* 2. Customer & Contact Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5 text-primary" /> Customer Details
                  </h4>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {(selectedBooking.user || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedBooking.user}</p>
                          <p className="text-[11px] text-muted-foreground">Consumer Account</p>
                        </div>
                      </div>
                      {selectedBooking.userPhone && (
                        <a 
                          href={`tel:${selectedBooking.userPhone}`} 
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/5 px-2.5 py-1 rounded-md"
                        >
                          <Phone className="h-3 w-3" /> Call
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-muted-foreground">Email:</span>
                        <div className="flex items-center gap-1 font-medium">
                          <span className="truncate max-w-[150px]">{selectedBooking.collectionDetails?.email || selectedBooking.userEmail || "N/A"}</span>
                          {(selectedBooking.collectionDetails?.email || selectedBooking.userEmail) && (
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedBooking.collectionDetails?.email || selectedBooking.userEmail, 'email')}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy Email"
                            >
                              {copiedField === 'email' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-muted-foreground">Phone:</span>
                        <div className="flex items-center gap-1 font-medium">
                          <span>{selectedBooking.collectionDetails?.phone || selectedBooking.userPhone || "N/A"}</span>
                          {(selectedBooking.collectionDetails?.phone || selectedBooking.userPhone) && (
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedBooking.collectionDetails?.phone || selectedBooking.userPhone, 'phone')}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy Phone"
                            >
                              {copiedField === 'phone' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {selectedBooking.collectionDetails?.address && (
                        <div className="sm:col-span-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            {[
                              selectedBooking.collectionDetails.address,
                              selectedBooking.collectionDetails.city,
                              selectedBooking.collectionDetails.state,
                              selectedBooking.collectionDetails.pincode
                            ].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Laboratory Partner */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> Laboratory Partner
                  </h4>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-4 flex items-center justify-between shadow-xs">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedBooking.lab}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBooking.lab?.includes("Litmus") ? "Managed and allocated via Litmus Central Operations" : "Accredited partner diagnostic laboratory"}
                      </p>
                    </div>
                    {isSelectedLabAssigned ? (
                      <CheckCircle2 className="h-5 w-5 text-litmus-emerald shrink-0" />
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">
                        Allocation Needed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 4. Ordered Items & Scope */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <FlaskConical className="h-3.5 w-3.5 text-primary" /> Test Scope & Samples ({selectedBooking.rawItems?.length || 0})
                    </h4>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedBooking.itemTypes?.map((t: string) => (
                        <Badge key={t} className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border-primary/20">{t}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedBooking.rawItems?.map((item: any, i: number) => {
                      const itemName = item.packageId?.name || item.testId?.testName || item.testId?.name || item.name || "Custom Test Service";
                      return (
                        <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 shadow-xs overflow-hidden">
                          <div className="bg-slate-50 dark:bg-slate-900/60 px-4 py-2.5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
                                {item.itemType || "TEST"}
                              </span>
                            </div>
                            {canViewPricing && (
                              <span className="font-bold text-xs text-primary">₹{item.price?.toLocaleString() || 0}</span>
                            )}
                          </div>
                          
                          <div className="p-4 space-y-3">
                            {item.samples?.map((sample: any, j: number) => (
                              <div key={j} className="space-y-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0">
                                <div>
                                  <p className="text-sm font-bold text-foreground">
                                    {sample.productName || itemName}
                                  </p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-muted-foreground">
                                    {sample.quantity && <span>Quantity: <strong className="text-foreground">{sample.quantity}</strong></span>}
                                    {sample.batchNumber && <span>Batch: <strong className="text-foreground">{sample.batchNumber}</strong></span>}
                                    {sample.sku && <span>SKU: <strong className="text-foreground">{sample.sku}</strong></span>}
                                  </div>
                                </div>

                                {((sample.selectedParameters && sample.selectedParameters.length > 0) || (sample.selectedTests && sample.selectedTests.length > 0)) && (
                                  <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                                      {item.itemType === 'PACKAGE' ? 'Tests Included' : 'Parameters to Test'}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {((item.itemType === 'PACKAGE' && sample.selectedTests?.length > 0) ? sample.selectedTests : sample.selectedParameters).map((p: string, k: number) => (
                                        <Badge key={k} variant="secondary" className="font-normal text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-0">
                                          {p.startsWith("pkg-feat-") ? p.replace("pkg-feat-", "") : p}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {sample.specifics && (
                                  <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                                    <span className="font-semibold block text-[10px] uppercase">Special Instructions:</span>
                                    {sample.specifics}
                                  </div>
                                )}
                              </div>
                            ))}

                            {(!item.samples || item.samples.length === 0) && (
                              <p className="text-sm font-medium text-foreground">{itemName}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Fulfillment Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Fulfillment Progress
                  </h4>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-4 shadow-xs">
                    <div className="space-y-0">
                      {timelineSteps.map((step: any, i: number) => {
                        const isStepRejected = step.state === "rejected" || step.state === "failed";
                        const isStepWarning = step.state === "warning";
                        const isStepRefunded = step.state === "refunded";
                        const isStepCompleted = step.state === "completed" || step.done;

                        return (
                          <div key={i} className="flex gap-3.5 group">
                            <div className="flex flex-col items-center">
                              <div className={`h-4.5 w-4.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                                isStepRejected 
                                  ? "bg-red-600 border-red-600 text-white" 
                                  : isStepWarning
                                    ? "bg-amber-500 border-amber-500 text-white"
                                    : isStepRefunded
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : isStepCompleted 
                                        ? "bg-litmus-emerald border-litmus-emerald text-white shadow-2xs" 
                                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                              }`}>
                                {isStepRejected ? (
                                  <XCircle className="h-2.5 w-2.5" />
                                ) : isStepWarning ? (
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                ) : isStepRefunded ? (
                                  <RotateCcw className="h-2.5 w-2.5" />
                                ) : isStepCompleted ? (
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                ) : null}
                              </div>
                              {i < timelineSteps.length - 1 && (
                                <div className={`w-0.5 flex-1 min-h-[1.5rem] my-0.5 ${
                                  isStepRejected 
                                    ? "bg-red-200 dark:bg-red-900/40" 
                                    : isStepWarning
                                      ? "bg-amber-200 dark:bg-amber-900/40"
                                      : isStepCompleted 
                                        ? "bg-litmus-emerald/80" 
                                        : "bg-slate-200 dark:bg-slate-800"
                                }`} />
                              )}
                            </div>
                            <div className="pb-4 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className={`text-xs ${
                                  isStepRejected 
                                    ? "text-red-600 dark:text-red-400 font-bold" 
                                    : isStepWarning
                                      ? "text-amber-700 dark:text-amber-400 font-semibold"
                                      : isStepRefunded
                                        ? "text-blue-700 dark:text-blue-400 font-semibold"
                                        : isStepCompleted 
                                          ? "text-slate-900 dark:text-white font-semibold" 
                                          : "text-muted-foreground"
                                }`}>
                                  {step.label}
                                </p>
                                {step.sub && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                    {step.sub}
                                  </span>
                                )}
                              </div>
                              {step.message && (
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                                  {step.message}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 6. Admin Actions (Pending state assignment or rejection) */}
                {selectedBooking.status?.toLowerCase() === "pending" && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                      <h4 className="text-xs font-bold">Admin Allocation Required</h4>
                    </div>

                    {isRejecting ? (
                      <div className="space-y-3 bg-white dark:bg-background p-3 rounded-lg border border-red-200 dark:border-red-900">
                        <label className="text-xs font-semibold text-red-800 dark:text-red-300 block">Reason for Rejection</label>
                        <Textarea
                          placeholder="Please provide a clear reason to notify the client..."
                          className="border-red-200 focus-visible:ring-red-500 text-xs"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => rejectBookingMutation.mutate({ id: selectedBooking.id, reason: rejectReason })}
                            disabled={!rejectReason.trim() || rejectBookingMutation.isPending}
                          >
                            {rejectBookingMutation.isPending ? "Rejecting..." : "Submit Rejection"}
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assign Partner Laboratory</label>
                          <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                            <SelectTrigger className="bg-white dark:bg-card border-slate-200 dark:border-slate-700 h-9 text-xs">
                              <SelectValue placeholder="Select target laboratory..." />
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
                        <div className="flex gap-2 pt-1">
                          <Button
                            className="flex-1 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-xs h-8 text-xs font-semibold"
                            disabled={!selectedLabId || assignLabMutation.isPending}
                            onClick={() => assignLabMutation.mutate({ id: selectedBooking.id, labId: selectedLabId })}
                          >
                            {assignLabMutation.isPending ? "Assigning..." : "Approve & Forward"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="shadow-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs h-8" 
                            onClick={() => setIsRejecting(true)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <SheetFooter className="p-4 bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => setInvoiceBookingId(selectedBooking.id)}
                >
                  <FileText className="h-4 w-4 text-emerald-600" /> View Invoice
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs" 
                  onClick={() => navigate(`/admin/bookings/${selectedBooking.id}`)}
                >
                  <span>Open Full Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reusable Tax Invoice Dialog */}
      <InvoiceDialog
        bookingId={invoiceBookingId}
        open={!!invoiceBookingId}
        onOpenChange={(open) => !open && setInvoiceBookingId(null)}
      />
    </div>
  );
}
