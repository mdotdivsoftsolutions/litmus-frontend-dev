import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  ChevronLeft, 
  ChevronRight,
  Beaker, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Save, 
  CheckCheck, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Activity,
  Loader2, 
  Sparkles, 
  Package, 
  Truck, 
  Copy, 
  History, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertTriangle, 
  RotateCcw,
  Phone,
  Mail,
  Calendar,
  Layers,
  FlaskConical,
  Receipt,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceDialog } from "@/components/admin/InvoiceDialog";

export default function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState("smart_allocation");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Collection & Courier Editing state
  const [editingCollection, setEditingCollection] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [collectorContact, setCollectorContact] = useState("");
  const [notifyDelay, setNotifyDelay] = useState(false);
  const [courierTrackingId, setCourierTrackingId] = useState("");
  const [courierPartnerName, setCourierPartnerName] = useState("");
  const [courierNotes, setCourierNotes] = useState("");

  // Report state
  const [reportFiles, setReportFiles] = useState<string[]>([]);
  const [reportSummary, setReportSummary] = useState({
    summary: "",
    recommendations: "",
    tips: "",
    additionalNotes: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => adminApi.getBookings(),
  });

  const { data: labsResponse } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });
  const labs = labsResponse?.data || [];

  const rawBookings = response?.data || [];
  const rawBooking = rawBookings.find((b: any) => b._id === id);

  useEffect(() => {
    if (rawBooking) {
      const isDirect = rawBooking.metadata?.isLitmusDirect;
      const currentLabId = rawBooking.labId?._id 
        ? rawBooking.labId._id 
        : isDirect 
          ? "litmus_direct" 
          : "smart_allocation";

      setSelectedLabId(currentLabId);
      setSelectedStatus(rawBooking.status || "PENDING");
      setSelectedPaymentStatus(rawBooking.paymentStatus || "PENDING");
      setReportFiles(rawBooking.reportFiles || []);
      setReportSummary({
        summary: rawBooking.reportSummary?.summary || "",
        recommendations: rawBooking.reportSummary?.recommendations || "",
        tips: rawBooking.reportSummary?.tips || "",
        additionalNotes: rawBooking.reportSummary?.additionalNotes || "",
      });

      setCourierTrackingId(rawBooking.courierDetails?.trackingId || "");
      setCourierPartnerName(rawBooking.courierDetails?.courierName || "");
      setCourierNotes(rawBooking.courierDetails?.notes || "");
      setCollectionStatus(rawBooking.collectionStatus || "PENDING");
      setCollectorName(rawBooking.assignedCollector?.name || "");
      setCollectorContact(rawBooking.assignedCollector?.contact || "");
    }
  }, [rawBooking]);

  const updateBookingStatusMutation = useMutation({
    mutationFn: (data: { status?: string; paymentStatus?: string; labId?: string }) => 
      adminApi.updateBookingStatus(id as string, data),
    onSuccess: () => {
      toast.success("Booking status & process updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update booking status")
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) => adminApi.rejectBooking(bookingId, reason),
    onSuccess: () => {
      toast.success("Booking rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setIsRejecting(false);
      setRejectReason("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject booking")
  });

  const updateCollectionMutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: any }) => adminApi.updateCollectionDetails(bookingId, data),
    onSuccess: () => {
      toast.success("Sample collection & dispatch details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setEditingCollection(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update collection details")
  });

  const saveReportMutation = useMutation({
    mutationFn: (data: { reportFiles: string[]; summary?: string; recommendations?: string; tips?: string; additionalNotes?: string }) => 
      adminApi.updateBookingReport(id as string, data),
    onSuccess: () => {
      toast.success("Report and remarks saved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to save report")
  });

  const approveAndCompleteMutation = useMutation({
    mutationFn: (data: { reportFiles: string[]; summary?: string; recommendations?: string; tips?: string; additionalNotes?: string }) => 
      adminApi.approveReport(id as string, data),
    onSuccess: () => {
      toast.success("Report approved! Booking marked as COMPLETED and customer notified via email.");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setIsReportDrawerOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to approve report")
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await adminApi.uploadFile(file);
      const fileUrl = res.url || res.data?.url || res.fileUrl;
      if (fileUrl) {
        const updated = [...reportFiles, fileUrl];
        setReportFiles(updated);
        toast.success("File uploaded successfully. Click 'Save Remarks' or 'Approve' to persist.");
      } else {
        toast.error("Upload failed: No file URL returned");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setReportFiles(reportFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-20 pt-2 animate-pulse">
        <div className="h-20 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-100 rounded-lg" />
          <div className="h-28 bg-slate-100 rounded-lg" />
          <div className="h-28 bg-slate-100 rounded-lg" />
          <div className="h-28 bg-slate-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-lg" />
          <div className="h-96 bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!rawBooking) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto bg-white border border-slate-200 rounded-lg shadow-xs mt-10">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Beaker className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Booking Not Found</h3>
        <p className="text-xs text-muted-foreground">The requested booking record could not be found or may have been deleted.</p>
        <Button onClick={() => navigate("/admin/bookings")} className="bg-primary text-white text-xs">
          Back to Bookings
        </Button>
      </div>
    );
  }

  const b = rawBooking;
  const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
  const userFullName = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.collectionDetails?.name || "Customer";
  const userInitials = (userFullName.split(" ").map((n: string) => n[0]).join("") || "U").substring(0, 2).toUpperCase();
  
  // Lab display calculation
  const lab = b.labId?.labName 
    ? b.labId.labName 
    : b.metadata?.isLitmusDirect 
      ? "Litmus Central Partner Facility" 
      : "Litmus Smart Allocation Center";

  const amount = b.totalAmount || b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
  const status = b.status || "PENDING";
  const paymentStatus = b.paymentStatus || "PENDING";
  const date = format(new Date(b.createdAt || new Date()), "MMM d, yyyy · h:mm a");
  const rawItems = b.items || [];
  const collectionDetails = b.metadata?.collectionDetails || b.collectionDetails || {};
  const pickupDate = collectionDetails.pickupDate ? format(new Date(collectionDetails.pickupDate), "MMM d, yyyy") : "Not specified";
  const pickupTime = collectionDetails.pickupTime || "Not specified";

  // Dispatch / Collection Method detection
  const isCourierMethod = b.collectionMethod === 'COURIER' || 
                          b.metadata?.collectionMethod === 'COURIER' || 
                          collectionDetails.collectionMethod === 'COURIER' || 
                          Boolean(b.courierDetails?.trackingId);

  const courierInfo = b.courierDetails || {};
  const trackingHistory: any[] = b.metadata?.trackingHistory || [];

  const isRejected = status?.toUpperCase() === 'REJECTED';
  const isCancelled = status?.toUpperCase() === 'CANCELLED';

  const payStatusUpper = (paymentStatus || '').toUpperCase();
  const isPaymentPaid = ['SUCCESS', 'PAID'].includes(payStatusUpper) || ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(status?.toUpperCase() || '');
  const isPaymentFailed = payStatusUpper === 'FAILED';
  const isPaymentRefunded = payStatusUpper === 'REFUNDED';
  const isPaymentRefundInitiated = payStatusUpper === 'REFUND_INITIATED';

  let paymentTimelineStep: {
    label: string;
    done: boolean;
    state: "completed" | "rejected" | "warning" | "failed" | "refunded" | "pending";
    message?: string;
  };

  if (isPaymentPaid) {
    paymentTimelineStep = { label: "Payment Confirmed (Paid)", done: true, state: "completed" };
  } else if (isPaymentRefunded) {
    paymentTimelineStep = { label: "Payment Refunded", done: true, state: "refunded" };
  } else if (isPaymentRefundInitiated) {
    paymentTimelineStep = { label: "Refund Initiated", done: true, state: "warning" };
  } else if (isPaymentFailed) {
    paymentTimelineStep = { label: "Payment Failed", done: false, state: "failed", message: "Transaction unverified" };
  } else {
    paymentTimelineStep = { label: "Payment Pending", done: false, state: "warning", message: "Awaiting customer payment" };
  }

  const isAdminApproved = ['approved', 'in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isLabAssigned = Boolean(b.labId?._id || b.metadata?.isLitmusDirect) || ['in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isTestingInProgress = ['in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isReportUploaded = (reportFiles && reportFiles.length > 0) || Boolean(reportSummary?.summary) || (b.reportFiles && b.reportFiles.length > 0) || status?.toLowerCase() === 'completed';
  const isComplete = status?.toLowerCase() === 'completed';

  const timelineSteps = isRejected ? [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: format(new Date(b.createdAt), "MMM d") },
    paymentTimelineStep,
    { label: "Booking Rejected by Admin", done: true, state: "rejected" as const, message: b.metadata?.rejectionReason },
  ] : isCancelled ? [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: format(new Date(b.createdAt), "MMM d") },
    paymentTimelineStep,
    { label: "Booking Cancelled", done: true, state: "rejected" as const },
  ] : [
    { label: "Booking Placed", done: true, state: "completed" as const, sub: format(new Date(b.createdAt), "MMM d") },
    paymentTimelineStep,
    { label: "Admin Approved", done: isAdminApproved, state: isAdminApproved ? "completed" as const : "pending" as const },
    { label: "Lab Assigned", done: isLabAssigned, state: isLabAssigned ? "completed" as const : "pending" as const },
    { label: "Testing in Progress", done: isTestingInProgress, state: isTestingInProgress ? "completed" as const : "pending" as const },
    { label: "Certified Report Uploaded", done: isReportUploaded, state: isReportUploaded ? "completed" as const : "pending" as const },
    { label: "Order Fulfilled & Complete", done: isComplete, state: isComplete ? "completed" as const : "pending" as const },
  ];

  const totalSamplesCount = rawItems.reduce((acc: number, item: any) => acc + (item.samples?.length || 1), 0);

  return (
    <div className="space-y-5 animate-fade-in pb-20 mx-auto max-w-7xl">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link to="/admin/dashboard" className="hover:text-foreground transition-colors">Admin</Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link to="/admin/bookings" className="hover:text-foreground transition-colors">Bookings</Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-foreground font-mono font-semibold">{displayId}</span>
      </nav>

      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200/90 shadow-2xs rounded-lg p-5 sm:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Title & Status */}
          <div className="flex items-start sm:items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/bookings")}
              className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                  {displayId}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-slate-700"
                  onClick={() => copyToClipboard(b._id, "Full Booking ID")}
                  title="Copy full Booking ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                
                {b.isReportApprovedByAdmin && (
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-bold gap-1 py-1 px-2.5 text-xs shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Certified & Approved
                  </Badge>
                )}
                {isCourierMethod ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-[11px] font-semibold gap-1">
                    <Package className="h-3 w-3 text-blue-600" /> Courier Dispatch
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-semibold gap-1">
                    <Truck className="h-3 w-3 text-amber-600" /> Doorstep Pickup
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> Placed {date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" /> {userFullName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-slate-400" /> {rawItems.length} Test Item{rawItems.length > 1 ? 's' : ''} ({totalSamplesCount} Samples)
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-end lg:self-center">
            <Button 
              variant="outline"
              onClick={() => setIsInvoiceOpen(true)}
              className="h-10 px-4 rounded-lg border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 hover:text-emerald-900 gap-2 font-bold text-xs shadow-2xs transition-all"
            >
              <Receipt className="h-4 w-4 text-emerald-600" />
              Tax Invoice
            </Button>

            <Button 
              onClick={() => setIsReportDrawerOpen(true)}
              className="h-10 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white gap-2 font-bold text-xs shadow-xs transition-all"
            >
              <FileText className="h-4 w-4" />
              Report & Clinical Remarks
              {b.isReportApprovedByAdmin ? (
                <span className="bg-emerald-500 text-white text-[10px] font-black py-0.5 px-2 rounded-full ml-1">
                  Approved
                </span>
              ) : reportFiles.length > 0 ? (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black py-0.5 px-2 rounded-full ml-1">
                  {reportFiles.length} file{reportFiles.length > 1 ? 's' : ''}
                </span>
              ) : null}
            </Button>
          </div>

        </div>
      </div>

      {/* 4-Stat Metric Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Status */}
        <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Lifecycle Status</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <StatusBadge status={status} />
            <p className="text-[11px] text-muted-foreground mt-2 font-medium">
              {isComplete ? "Testing fulfilled and finalized" : "Active diagnostic pipeline"}
            </p>
          </div>
        </Card>

        {/* Card 2: Payment */}
        <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Payment Status</span>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={paymentStatus} />
              {isPaymentPaid && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Paid
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 font-medium">
              {b.paymentMethod || "Online Gateway Transaction"}
            </p>
          </div>
        </Card>

        {/* Card 3: Total Amount */}
        <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Order Value</span>
            <Receipt className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{amount.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              GST (18%) & Diagnostics Inclusive
            </p>
          </div>
        </Card>

        {/* Card 4: Assigned Facility */}
        <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Assigned Laboratory</span>
            <Building2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 line-clamp-1" title={lab}>
              {lab}
            </p>
            <p className="text-[11px] text-indigo-700 font-semibold mt-1">
              {b.labId?.location?.city ? `${b.labId.location.city} Facility` : "Network Accredited Facility"}
            </p>
          </div>
        </Card>
      </div>

      {/* Main 2-Column Grid (8 Cols Left / 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Customer & Billing Profile */}
          <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  <UserCheck className="h-4 w-4 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Client & Delivery Contact</CardTitle>
                  <p className="text-[11px] text-muted-foreground">Account ownership and sample handover details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Customer Name</span>
                  <p className="text-xs font-bold text-slate-900">{userFullName}</p>
                  {b.userId?.companyName && (
                    <p className="text-[11px] text-slate-600 font-medium">{b.userId.companyName}</p>
                  )}
                </div>
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone Contact</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 font-mono">
                      {collectionDetails?.phone || b.userId?.phone || "N/A"}
                    </p>
                    {b.userId?.phone && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-800" onClick={() => copyToClipboard(b.userId.phone, "Phone")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Address</span>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 truncate" title={collectionDetails?.email || b.userId?.email}>
                      {collectionDetails?.email || b.userId?.email || "N/A"}
                    </p>
                    {b.userId?.email && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-800" onClick={() => copyToClipboard(b.userId.email, "Email")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Box */}
              {collectionDetails?.address && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                        Sample Dispatch / Collection Location
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {collectionDetails.address}, {collectionDetails.city}, {collectionDetails.state} - {collectionDetails.pincode}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs px-2.5 shrink-0 bg-white border-slate-200"
                    onClick={() => copyToClipboard(`${collectionDetails.address}, ${collectionDetails.city}, ${collectionDetails.state} - ${collectionDetails.pincode}`, "Address")}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Courier Dispatch & Logistics */}
          <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isCourierMethod ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {isCourierMethod ? <Package className="h-4 w-4 text-blue-700" /> : <Truck className="h-4 w-4 text-amber-700" />}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {isCourierMethod ? "Sample Courier Dispatch" : "Sample Pickup Logistics"}
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {isCourierMethod ? "Customer self-shipment tracking and receipt" : "Doorstep collection schedule and partner notes"}
                  </p>
                </div>
              </div>

              {!editingCollection && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingCollection(true)}
                  className="h-8 text-xs font-semibold bg-white border-slate-200 shadow-2xs hover:bg-slate-50"
                >
                  {isCourierMethod ? "Update Tracking" : "Update Logistics"}
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {isCourierMethod ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                        Tracking / AWB Number
                      </span>
                      {courierInfo.trackingId ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-blue-950 break-all">{courierInfo.trackingId}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-900" onClick={() => copyToClipboard(courierInfo.trackingId, "Tracking ID")}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-amber-700 italic">Not updated yet by customer</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                        Courier Partner
                      </span>
                      <p className="text-xs font-bold text-blue-950">{courierInfo.courierName || "Unspecified"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                        Dispatched On
                      </span>
                      <p className="text-xs font-bold text-blue-950">
                        {courierInfo.submittedAt ? format(new Date(courierInfo.submittedAt), "MMM d, yyyy · hh:mm a") : "Pending dispatch"}
                      </p>
                    </div>
                  </div>

                  {courierInfo.notes && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Customer Dispatch Notes</span>
                      <p className="text-slate-800 italic">"{courierInfo.notes}"</p>
                    </div>
                  )}

                  {trackingHistory.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <History className="h-3.5 w-3.5 text-primary" /> Tracking Audit Logs ({trackingHistory.length})
                      </span>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {trackingHistory.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-800">{item.trackingId}</span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {item.updatedAt ? format(new Date(item.updatedAt), "MMM d, h:mm a") : "N/A"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">Carrier: {item.courierName || "N/A"} • Updated by {item.updatedBy === "USER" ? "Customer" : "Admin"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-amber-50/40 p-4 rounded-lg border border-amber-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Preferred Date</span>
                    <p className="text-xs font-bold text-amber-950">{pickupDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Preferred Slot</span>
                    <p className="text-xs font-bold text-amber-950">{pickupTime}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Assigned Collector</span>
                    <p className="text-xs font-bold text-amber-950">{b.assignedCollector?.name || "Not assigned yet"}</p>
                    {b.assignedCollector?.contact && <p className="text-[11px] text-amber-800 font-mono">{b.assignedCollector.contact}</p>}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Collection State</span>
                    <Badge variant="outline" className="bg-white text-amber-900 border-amber-300 text-xs font-bold">
                      {b.collectionStatus?.replace(/_/g, ' ') || "PENDING"}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Editing Form */}
              {editingCollection && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-3 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {isCourierMethod ? "Update Courier Tracking" : "Update Doorstep Collector & Status"}
                  </p>

                  {isCourierMethod ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">AWB / Tracking Number</label>
                        <Input placeholder="e.g. BLUEDART-12345" value={courierTrackingId} onChange={(e) => setCourierTrackingId(e.target.value)} className="bg-white text-xs h-9 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Courier Partner</label>
                        <Input placeholder="e.g. BlueDart / DTDC" value={courierPartnerName} onChange={(e) => setCourierPartnerName(e.target.value)} className="bg-white text-xs h-9" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Sample Receipt State</label>
                        <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                          <SelectTrigger className="bg-white text-xs h-9"><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING (Awaiting Dispatch)</SelectItem>
                            <SelectItem value="SHIPPED">SHIPPED (In Transit)</SelectItem>
                            <SelectItem value="COLLECTED">COLLECTED / RECEIVED AT LAB</SelectItem>
                            <SelectItem value="NOT_REQUIRED">NOT REQUIRED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Collector Name</label>
                        <Input placeholder="e.g. Ramesh Kumar" value={collectorName} onChange={(e) => setCollectorName(e.target.value)} className="bg-white text-xs h-9" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Collector Phone</label>
                        <Input placeholder="e.g. +91 9876543210" value={collectorContact} onChange={(e) => setCollectorContact(e.target.value)} className="bg-white text-xs h-9 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Collection Status</label>
                        <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                          <SelectTrigger className="bg-white text-xs h-9"><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="ASSIGNED">ASSIGNED</SelectItem>
                            <SelectItem value="REACHED">REACHED</SelectItem>
                            <SelectItem value="COLLECTED">COLLECTED</SelectItem>
                            <SelectItem value="NOT_REQUIRED">NOT REQUIRED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Logistics Remarks</label>
                    <Input placeholder="Add internal or dispatch notes..." value={courierNotes} onChange={(e) => setCourierNotes(e.target.value)} className="bg-white text-xs h-9" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifyDelayAdmin" checked={notifyDelay} onCheckedChange={(c) => setNotifyDelay(!!c)} />
                      <label htmlFor="notifyDelayAdmin" className="text-xs text-muted-foreground font-medium cursor-pointer">
                        Notify user via email
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCollection(false)} className="h-8 text-xs">
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 text-xs bg-primary text-white font-semibold"
                        onClick={() => updateCollectionMutation.mutate({
                          bookingId: id as string,
                          data: {
                            status: collectionStatus,
                            collectorName: isCourierMethod ? undefined : collectorName,
                            collectorContact: isCourierMethod ? undefined : collectorContact,
                            notifyDelay,
                            trackingId: isCourierMethod ? courierTrackingId : undefined,
                            courierName: isCourierMethod ? courierPartnerName : undefined,
                            notes: courierNotes,
                          }
                        })}
                        disabled={updateCollectionMutation.isPending}
                      >
                        {updateCollectionMutation.isPending ? "Saving..." : "Save Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ordered Diagnostic Items & Sample Breakdown */}
          <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                  <Beaker className="h-4 w-4 text-indigo-700" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Ordered Diagnostic Tests & Samples</CardTitle>
                  <p className="text-[11px] text-muted-foreground">Matrix analysis parameters, SKUs, and batch specifications</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 text-xs font-bold">
                {rawItems.length} Package / Test Line{rawItems.length > 1 ? 's' : ''}
              </Badge>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {rawItems.map((item: any, i: number) => {
                const itemTitle = item.packageId?.name || item.testId?.testName || item.testId?.name || "Diagnostic Service Item";
                return (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-50/90 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{itemTitle}</span>
                        <Badge className="text-[10px] uppercase tracking-wider py-0 px-1.5 bg-slate-100 text-slate-700 border-0 font-bold">
                          {item.itemType}
                        </Badge>
                      </div>
                      <span className="font-black text-sm text-slate-900">₹{item.price?.toLocaleString("en-IN") || 0}</span>
                    </div>

                    <div className="p-4 space-y-3">
                      {item.samples?.map((sample: any, j: number) => (
                        <div key={j} className="p-3.5 bg-slate-50/60 rounded-lg border border-slate-100 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900">{sample.productName || "Standard Sample"}</span>
                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium font-mono">
                              {sample.quantity && <span>Qty: <strong>{sample.quantity}</strong></span>}
                              {sample.batchNumber && <span>Batch: <strong>{sample.batchNumber}</strong></span>}
                              {sample.sku && <span>SKU: <strong>{sample.sku}</strong></span>}
                            </div>
                          </div>

                          {/* Parameters */}
                          {(() => {
                            let tags: string[] = [];
                            if (item.itemType === 'PACKAGE') {
                              if (sample.selectedTests?.length > 0) tags = sample.selectedTests;
                              else if (item.packageId?.tests?.length > 0) tags = item.packageId.tests.map((t: any) => t.testName || t.name);
                              else if (item.packageId?.features?.length > 0) tags = item.packageId.features;
                            } else {
                              if (sample.selectedParameters?.length > 0) tags = sample.selectedParameters;
                              else if (item.testId?.parameters?.length > 0) tags = item.testId.parameters;
                            }
                            if (!tags || tags.length === 0) return null;

                            return (
                              <div className="pt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                  Tested Parameters ({tags.length})
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {tags.map((tag: string, k: number) => (
                                    <span key={k} className="inline-block bg-white text-slate-700 border border-slate-200/80 rounded-md text-[10px] font-medium px-2 py-0.5 shadow-2xs">
                                      {tag.replace(/^pkg-feat-/, '')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {sample.specifics && (
                            <div className="pt-1 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                              <span className="font-bold text-[10px] uppercase text-slate-400 block">Specific Instructions:</span>
                              {sample.specifics}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 Cols): Stepper Timeline & Lifecycle Process Command Center */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Stepper Timeline */}
          <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg overflow-hidden p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-700" />
                Fulfillment Stepper
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                Live State
              </span>
            </div>

            <div className="space-y-0 relative pl-1">
              {timelineSteps.map((step: any, idx: number) => {
                const isCompleted = step.state === "completed" || step.done;
                const isCurrent = !isCompleted && (idx === 0 || timelineSteps[idx - 1]?.done);
                const isWarn = step.state === "warning";
                const isRej = step.state === "rejected" || step.state === "failed";

                return (
                  <div key={idx} className="flex items-start gap-3.5 relative">
                    
                    {/* Vertical Connector Line */}
                    {idx < timelineSteps.length - 1 && (
                      <div className={`absolute left-[11px] top-6 bottom-0 w-[2px] ${
                        isCompleted ? "bg-emerald-500" : "bg-slate-200"
                      }`} />
                    )}

                    {/* Step Node Icon */}
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                      isRej
                        ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                        : isWarn
                          ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                          : isCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                            : isCurrent
                              ? "bg-white border-primary text-primary animate-pulse shadow-xs"
                              : "bg-white border-slate-300 text-slate-400"
                    }`}>
                      {isRej ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="pb-6 pt-0.5">
                      <p className={`text-xs ${
                        isRej 
                          ? "font-bold text-rose-700" 
                          : isCompleted 
                            ? "font-bold text-slate-900" 
                            : isCurrent
                              ? "font-bold text-primary"
                              : "font-medium text-slate-400"
                      }`}>
                        {step.label}
                      </p>
                      {step.sub && (
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{step.sub}</p>
                      )}
                      {step.message && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 mt-1 font-medium">
                          {step.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Workflow & Process Command Center */}
          <Card className="bg-white border border-slate-200/80 shadow-2xs rounded-lg overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Workflow & Status Controls
              </h3>
            </div>

            {isRejecting ? (
              <div className="space-y-3 bg-rose-50/50 p-4 rounded-lg border border-rose-200">
                <label className="text-xs font-bold text-rose-900 block">Reason for Rejection</label>
                <Textarea
                  placeholder="Explain why this booking is rejected to notify customer..."
                  className="bg-white border-rose-200 text-xs min-h-[90px]"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 text-xs font-bold"
                    onClick={() => rejectBookingMutation.mutate({ bookingId: id as string, reason: rejectReason })}
                    disabled={!rejectReason.trim() || rejectBookingMutation.isPending}
                  >
                    {rejectBookingMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Lifecycle Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-white border-slate-200 h-9 text-xs font-medium"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Lab Assignment
                  </label>
                  <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                    <SelectTrigger className="bg-white border-slate-200 h-9 text-xs font-medium"><SelectValue placeholder="Assign Lab" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart_allocation">Litmus Smart Allocation (Auto)</SelectItem>
                      <SelectItem value="litmus_direct">⭐ Litmus Central Handling</SelectItem>
                      {labs.map((l: any) => {
                        const locStr = l.location?.city
                          ? [l.location.city, l.location.state].filter(Boolean).join(", ")
                          : typeof l.location === "string"
                          ? l.location
                          : "";
                        return (
                          <SelectItem key={l._id} value={l._id}>
                            {l.labName} {locStr ? `(${locStr})` : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Payment & Refund Status
                  </label>
                  <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                    <SelectTrigger className="bg-white border-slate-200 h-9 text-xs font-medium"><SelectValue placeholder="Payment State" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING (Payment Pending)</SelectItem>
                      <SelectItem value="SUCCESS">SUCCESS (Paid)</SelectItem>
                      <SelectItem value="FAILED">FAILED (Payment Failed)</SelectItem>
                      <SelectItem value="REFUND_INITIATED">REFUND_INITIATED (Initiate Refund)</SelectItem>
                      <SelectItem value="REFUNDED">REFUNDED (Refund Completed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 shadow-xs gap-1.5"
                    disabled={updateBookingStatusMutation.isPending}
                    onClick={() => updateBookingStatusMutation.mutate({
                      status: selectedStatus,
                      paymentStatus: selectedPaymentStatus,
                      labId: selectedLabId
                    })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {updateBookingStatusMutation.isPending ? "Updating Workflow..." : "Update Workflow & Lab"}
                  </Button>

                  {status?.toLowerCase() === "pending" && (
                    <Button
                      variant="outline"
                      className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 h-8 text-xs font-semibold"
                      onClick={() => setIsRejecting(true)}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject Booking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Slide-Over Side Drawer for Test Report & Clinical Remarks */}
      <Sheet open={isReportDrawerOpen} onOpenChange={setIsReportDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6 space-y-6">
          <SheetHeader className="pr-12 pb-4 border-b border-slate-100 text-left">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <FileText className="h-5 w-5 text-primary" /> Test Report & Clinical Remarks
                </SheetTitle>
                {b.isReportApprovedByAdmin ? (
                  <Badge className="bg-emerald-600 text-white text-xs font-bold">
                    <CheckCheck className="h-3.5 w-3.5 mr-1" /> Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-xs font-bold">
                    Pending Approval
                  </Badge>
                )}
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                Upload laboratory test reports and compose remarks for Booking {displayId}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Document Upload & List Section */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Attached Test Report Documents ({reportFiles.length})
            </label>

            {reportFiles.length > 0 ? (
              <div className="space-y-2.5">
                {reportFiles.map((url: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50/60 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          Certified Report Document {idx + 1}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-xs">{url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </a>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center bg-slate-50/50">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">No test reports attached yet</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Upload certified PDF reports provided by the analytical lab</p>
              </div>
            )}

            {/* Upload Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <input 
                type="file" 
                id="drawer-report-file-input" 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label 
                htmlFor="drawer-report-file-input"
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary" />}
                {isUploading ? "Uploading file..." : "Upload New Report Document"}
              </label>
              <span className="text-[11px] text-muted-foreground">PDF, DOC, PNG, JPG (Max 25MB)</span>
            </div>
          </div>

          {/* Clinical Remarks Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Executive Clinical Summary
              </label>
              <Textarea
                placeholder="Provide an executive summary of sample findings and key observations..."
                className="min-h-[90px] bg-white border-slate-200 resize-y text-xs leading-relaxed"
                value={reportSummary.summary}
                onChange={(e) => setReportSummary({ ...reportSummary, summary: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Corrective Recommendations
              </label>
              <Textarea
                placeholder="Key corrective measures or nutritional/safety recommendations..."
                className="min-h-[80px] bg-white border-emerald-200 resize-y text-xs"
                value={reportSummary.recommendations}
                onChange={(e) => setReportSummary({ ...reportSummary, recommendations: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Best Practices & Prevention Tips
              </label>
              <Textarea
                placeholder="Preventative tips, hygiene or storage guidelines..."
                className="min-h-[80px] bg-white border-amber-200 resize-y text-xs"
                value={reportSummary.tips}
                onChange={(e) => setReportSummary({ ...reportSummary, tips: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Additional Notes & Disclaimers
              </label>
              <Textarea
                placeholder="Testing methodologies, instrumentation, or legal disclaimer notes..."
                className="min-h-[70px] bg-white border-slate-200 resize-y text-xs"
                value={reportSummary.additionalNotes}
                onChange={(e) => setReportSummary({ ...reportSummary, additionalNotes: e.target.value })}
              />
            </div>

            {/* Action Buttons in Drawer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                className="gap-2 font-bold text-xs h-9"
                onClick={() => saveReportMutation.mutate({
                  reportFiles,
                  summary: reportSummary.summary,
                  recommendations: reportSummary.recommendations,
                  tips: reportSummary.tips,
                  additionalNotes: reportSummary.additionalNotes,
                })}
                disabled={saveReportMutation.isPending || approveAndCompleteMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {saveReportMutation.isPending ? "Saving..." : "Save Draft Remarks"}
              </Button>

              <Button
                className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-xs font-bold text-xs h-9"
                onClick={() => approveAndCompleteMutation.mutate({
                  reportFiles,
                  summary: reportSummary.summary,
                  recommendations: reportSummary.recommendations,
                  tips: reportSummary.tips,
                  additionalNotes: reportSummary.additionalNotes,
                })}
                disabled={approveAndCompleteMutation.isPending || saveReportMutation.isPending}
              >
                <ShieldCheck className="h-4 w-4" />
                {approveAndCompleteMutation.isPending ? "Approving & Completing..." : "Approve & Complete Booking"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reusable Tax Invoice Dialog */}
      <InvoiceDialog
        bookingId={b._id}
        open={isInvoiceOpen}
        onOpenChange={setIsInvoiceOpen}
      />
    </div>
  );
}
