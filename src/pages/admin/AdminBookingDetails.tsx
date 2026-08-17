import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  ChevronLeft, 
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
  AlertCircle,
  RotateCcw
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
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading booking details...</div>;
  }

  if (!rawBooking) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button onClick={() => navigate("/admin/bookings")}>Back to Bookings</Button>
      </div>
    );
  }

  const b = rawBooking;
  const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
  const user = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.collectionDetails?.name || "Unknown User";
  
  // Lab display calculation
  const lab = b.labId?.labName 
    ? b.labId.labName 
    : b.metadata?.isLitmusDirect 
      ? "Litmus (End-to-End Direct)" 
      : "Litmus Smart Allocation";

  const amount = b.totalAmount || b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
  const status = b.status || "PENDING";
  const paymentStatus = b.paymentStatus || "PENDING";
  const date = format(new Date(b.createdAt || new Date()), "MMM d, yyyy");
  const rawItems = b.items || [];
  const collectionDetails = b.metadata?.collectionDetails || {};
  const pickupDate = collectionDetails.pickupDate ? format(new Date(collectionDetails.pickupDate), "MMM d, yyyy") : "Not specified";
  const pickupTime = collectionDetails.pickupTime || "Not specified";

  // Dispatch / Collection Method detection
  const isCourierMethod = b.collectionMethod === 'COURIER' || 
                          b.metadata?.collectionMethod === 'COURIER' || 
                          collectionDetails.collectionMethod === 'COURIER' || 
                          Boolean(b.courierDetails?.trackingId);

  const courierInfo = b.courierDetails || {};
  const trackingHistory: any[] = b.metadata?.trackingHistory || [];

  // Reactive and accurate timeline step calculation
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
    paymentTimelineStep = { label: "Payment Failed", done: false, state: "failed", message: "Transaction failed or unverified" };
  } else {
    // Payment Pending
    paymentTimelineStep = { label: "Payment Pending", done: false, state: "warning", message: "Awaiting customer payment" };
  }

  const isAdminApproved = ['approved', 'in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isLabAssigned = Boolean(b.labId?._id || b.metadata?.isLitmusDirect) || ['in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isTestingInProgress = ['in_progress', 'completed'].includes(status?.toLowerCase() || '');
  const isReportUploaded = (reportFiles && reportFiles.length > 0) || Boolean(reportSummary?.summary) || (b.reportFiles && b.reportFiles.length > 0) || status?.toLowerCase() === 'completed';
  const isComplete = status?.toLowerCase() === 'completed';

  const timelineSteps = isRejected ? [
    { label: "Booking Placed", done: true, state: "completed" as const },
    paymentTimelineStep,
    { label: "Booking Rejected by Admin", done: true, state: "rejected" as const, message: b.metadata?.rejectionReason },
  ] : isCancelled ? [
    { label: "Booking Placed", done: true, state: "completed" as const },
    paymentTimelineStep,
    { label: "Booking Cancelled", done: true, state: "rejected" as const },
  ] : [
    { label: "Booking Placed", done: true, state: "completed" as const },
    paymentTimelineStep,
    { label: "Admin Approved", done: isAdminApproved, state: isAdminApproved ? "completed" as const : "pending" as const },
    { label: "Lab Assigned", done: isLabAssigned, state: isLabAssigned ? "completed" as const : "pending" as const },
    { label: "Testing In Progress", done: isTestingInProgress, state: isTestingInProgress ? "completed" as const : "pending" as const },
    { label: "Report Uploaded", done: isReportUploaded, state: isReportUploaded ? "completed" as const : "pending" as const },
    { label: "Complete", done: isComplete, state: isComplete ? "completed" as const : "pending" as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Top Header Bar with Report Drawer Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/bookings")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground">Booking {displayId}</h1>
              {b.isReportApprovedByAdmin && (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 py-0.5 px-2.5 text-xs font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Report Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Placed on {date}</p>
          </div>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline"
            onClick={() => setIsInvoiceOpen(true)}
            className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 gap-2 font-semibold shadow-2xs"
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            Tax Invoice
          </Button>

          <Button 
            onClick={() => setIsReportDrawerOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold shadow-sm px-4 py-2"
          >
            <FileText className="h-4 w-4" />
            Test Report & Clinical Remarks
            {b.isReportApprovedByAdmin ? (
              <Badge className="bg-emerald-500 text-white text-[10px] py-0 px-1.5 ml-1">
                Approved
              </Badge>
            ) : reportFiles.length > 0 ? (
              <Badge className="bg-amber-500 text-white text-[10px] py-0 px-1.5 ml-1">
                {reportFiles.length} file{reportFiles.length > 1 ? 's' : ''}
              </Badge>
            ) : null}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Column Details | Right Column Timeline & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Overview, Samples, Dispatch & Collection, Contacts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Status</p>
                <StatusBadge status={status} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Payment</p>
                <StatusBadge status={paymentStatus} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Total Amount</p>
                <p className="font-semibold text-lg">₹{amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Assigned Lab</p>
                <p className="font-semibold text-sm truncate text-foreground">{lab}</p>
              </div>
            </div>
          </Card>

          {/* Attached Reports Preview (if already uploaded) */}
          {reportFiles.length > 0 && (
            <Card className="p-6 border border-border shadow-sm bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Attached Test Reports ({reportFiles.length})</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsReportDrawerOpen(true)} className="gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Manage in Drawer
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportFiles.map((url, idx) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary transition-all text-xs font-medium"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">Report Document {idx + 1}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Contact Information Card */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Name</p>
                <p className="font-medium text-foreground">{collectionDetails?.name || user}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Phone</p>
                <p className="font-medium text-foreground">{collectionDetails?.phone || b.userId?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Email</p>
                <p className="font-medium text-foreground">{collectionDetails?.email || b.userId?.email || "N/A"}</p>
              </div>
            </div>
            {collectionDetails?.address && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Collection Address
                </p>
                <p className="text-sm mt-1 text-foreground">
                  {collectionDetails.address}, {collectionDetails.city}, {collectionDetails.state} - {collectionDetails.pincode}
                </p>
              </div>
            )}
          </Card>

          {/* Sample Dispatch & Collection Arrangement Card */}
          <Card className="p-6 border border-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                {isCourierMethod ? (
                  <Package className="h-5 w-5 text-blue-600" />
                ) : (
                  <Truck className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {isCourierMethod ? "Sample Courier Dispatch" : "Sample Pickup Arrangement"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isCourierMethod ? "Customer self-shipment tracking and receipt" : "Doorstep sample collection by assigned collector"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCourierMethod ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 gap-1.5 py-1 hover:bg-blue-100/60 dark:hover:bg-blue-950/60 hover:text-blue-800 transition-colors pointer-events-none">
                    <Package className="h-3.5 w-3.5" /> Customer Courier Dispatch
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 gap-1.5 py-1 hover:bg-amber-100/60 dark:hover:bg-amber-950/60 hover:text-amber-800 transition-colors pointer-events-none">
                    <Truck className="h-3.5 w-3.5" /> Doorstep Sample Pickup
                  </Badge>
                )}
                {!editingCollection && (
                  <Button variant="outline" size="sm" onClick={() => setEditingCollection(true)} className="h-8 text-xs">
                    {isCourierMethod ? "Update Tracking" : "Update Collector"}
                  </Button>
                )}
              </div>
            </div>

            {/* Courier Dispatch View */}
            {isCourierMethod ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">
                      Tracking / AWB Number
                    </p>
                    {courierInfo.trackingId ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-foreground break-all">
                          {courierInfo.trackingId}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(courierInfo.trackingId, "Tracking ID")}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400 italic">
                        Not updated yet by customer
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">
                      Courier Partner
                    </p>
                    <p className="font-semibold text-sm text-foreground">
                      {courierInfo.courierName || "Unspecified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">
                      Dispatch Date
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {courierInfo.submittedAt 
                        ? format(new Date(courierInfo.submittedAt), "MMM d, yyyy · hh:mm a") 
                        : "Pending dispatch"}
                    </p>
                  </div>
                </div>

                {courierInfo.notes && (
                  <div className="p-3.5 rounded-lg bg-muted/20 border border-border text-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Customer Dispatch Notes
                    </p>
                    <p className="text-foreground/90 italic">"{courierInfo.notes}"</p>
                  </div>
                )}

                {/* Customer Tracking Update Logs */}
                {trackingHistory.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <History className="h-3.5 w-3.5 text-primary" /> Tracking Update History Log ({trackingHistory.length})
                      </p>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {trackingHistory.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between font-medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono font-bold text-xs bg-muted/40">
                                {item.trackingId}
                              </Badge>
                              {item.courierName && (
                                <span className="text-foreground font-semibold">({item.courierName})</span>
                              )}
                            </div>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.updatedAt ? format(new Date(item.updatedAt), "MMM d, yyyy · hh:mm a") : 'Date N/A'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <span>
                              Updated by: <span className="font-semibold text-foreground">{item.updatedBy === 'USER' ? 'Customer' : 'Admin'}</span>
                            </span>
                            {item.previousTrackingId && (
                              <span>Previous ID: <span className="font-mono">{item.previousTrackingId}</span></span>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-muted-foreground italic bg-muted/30 p-1.5 rounded">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Doorstep Pickup View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Preferred Pickup Date</p>
                  <p className="font-medium">{pickupDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Preferred Pickup Time</p>
                  <p className="font-medium">{pickupTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Collector Assigned</p>
                  {b.assignedCollector?.name ? (
                    <div>
                      <p className="font-medium text-sm">{b.assignedCollector.name}</p>
                      <p className="text-xs text-muted-foreground">{b.assignedCollector.contact}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-sm">Not assigned yet</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Collection Status</p>
                  <Badge variant={
                    b.collectionStatus === "COLLECTED" ? "default" :
                      b.collectionStatus === "ASSIGNED" || b.collectionStatus === "REACHED" ? "secondary" :
                        "outline"
                  }>
                    {b.collectionStatus?.replace(/_/g, ' ') || "PENDING"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Editing Form for Admin: Separated based on isCourierMethod */}
            {editingCollection && (
              <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {isCourierMethod ? "Update Courier Tracking" : "Update Doorstep Collector & Status"}
                </p>

                {isCourierMethod ? (
                  /* Courier Update Fields ONLY */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Tracking ID / AWB Number</label>
                        <Input
                          placeholder="e.g. BLUEDART-12345"
                          value={courierTrackingId}
                          onChange={(e) => setCourierTrackingId(e.target.value)}
                          className="bg-background font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Courier Partner Name</label>
                        <Input
                          placeholder="e.g. BlueDart / DTDC / Speed Post"
                          value={courierPartnerName}
                          onChange={(e) => setCourierPartnerName(e.target.value)}
                          className="bg-background text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Sample Receipt Status</label>
                        <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING (Awaiting Dispatch)</SelectItem>
                            <SelectItem value="SHIPPED">SHIPPED (In Transit)</SelectItem>
                            <SelectItem value="COLLECTED">COLLECTED / RECEIVED AT LAB</SelectItem>
                            <SelectItem value="NOT_REQUIRED">NOT REQUIRED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Logistics Remarks / Notes</label>
                      <Input
                        placeholder="Add any tracking or sample receipt notes..."
                        value={courierNotes}
                        onChange={(e) => setCourierNotes(e.target.value)}
                        className="bg-background text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  /* Doorstep Pickup Fields ONLY */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Assigned Collector Name</label>
                        <Input
                          placeholder="e.g. Ramesh Kumar"
                          value={collectorName}
                          onChange={(e) => setCollectorName(e.target.value)}
                          className="bg-background text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Collector Phone Contact</label>
                        <Input
                          placeholder="e.g. +91 9876543210"
                          value={collectorContact}
                          onChange={(e) => setCollectorContact(e.target.value)}
                          className="bg-background text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Collection Status</label>
                        <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status..." />
                          </SelectTrigger>
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Pickup Remarks</label>
                      <Input
                        placeholder="Add any collector or schedule remarks..."
                        value={courierNotes}
                        onChange={(e) => setCourierNotes(e.target.value)}
                        className="bg-background text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox id="notifyDelayAdmin" checked={notifyDelay} onCheckedChange={(c) => setNotifyDelay(!!c)} />
                  <label htmlFor="notifyDelayAdmin" className="text-xs font-medium text-muted-foreground leading-none cursor-pointer">
                    Notify user of {isCourierMethod ? "transit / processing" : "pickup"} delay via email
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingCollection(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
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
                    {updateCollectionMutation.isPending ? "Saving..." : isCourierMethod ? "Save Tracking Info" : "Save Collector Info"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Booking Items & Samples */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" /> Booking Items & Samples
            </h3>
            <div className="space-y-4">
              {rawItems.map((item: any, i: number) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden bg-muted/10">
                  <div className="bg-muted px-4 py-3 flex justify-between items-center border-b border-border">
                    <span className="font-semibold text-sm">Item {i + 1}: {item.itemType} - {item.packageId?.name || item.testId?.testName || item.testId?.name || "Custom"}</span>
                    <span className="font-medium text-sm">₹{item.price?.toLocaleString() || 0}</span>
                  </div>
                  <div className="p-4 space-y-4 bg-card">
                    {item.samples?.map((sample: any, j: number) => (
                      <div key={j} className="text-sm space-y-4 border-b border-border pb-4 last:border-0 last:pb-0">
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Product Info</span>
                          <p className="font-semibold text-base text-foreground">{sample.productName || "Unknown Product"}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs text-muted-foreground">
                            {sample.quantity && <span>Qty: <span className="font-medium text-slate-700 dark:text-slate-300">{sample.quantity}</span></span>}
                            {sample.batchNumber && <span>Batch: <span className="font-medium text-slate-700 dark:text-slate-300">{sample.batchNumber}</span></span>}
                            {sample.sku && <span>SKU: <span className="font-medium text-slate-700 dark:text-slate-300">{sample.sku}</span></span>}
                          </div>
                        </div>
                        {(() => {
                          let tags: string[] = [];
                          let label = "Testing Requirements";

                          if (item.itemType === 'PACKAGE') {
                            label = "Tests Included in Package";
                            if (sample.selectedTests && sample.selectedTests.length > 0) {
                              tags = sample.selectedTests;
                            } else if (item.packageId?.tests?.length > 0) {
                              tags = item.packageId.tests.map((t: any) => {
                                const params = t.metadata?.parameters?.map((p: any) => p.name).filter(Boolean);
                                if (params && params.length > 0) {
                                  return `${t.testName} (${params.join(', ')})`;
                                }
                                return t.testName || "Unknown Test";
                              });
                            } else if (item.packageId?.features?.length > 0) {
                              tags = item.packageId.features;
                            }
                          } else {
                            label = "Parameters to Test";
                            if (sample.selectedParameters && sample.selectedParameters.length > 0) {
                              tags = sample.selectedParameters;
                            } else if (item.testId?.parameters?.length > 0) {
                              tags = item.testId.parameters;
                            }
                          }

                          if (tags.length === 0) return null;

                          return (
                            <div className="mb-2">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                                {label}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {tags.map((p: string, k: number) => (
                                  <Badge key={k} variant="secondary" className="font-normal text-[10px] px-1.5 py-0 whitespace-normal text-left">
                                    {p.startsWith("pkg-feat-") ? p.replace("pkg-feat-", "") : p}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        {sample.specifics && (
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Specifics</span>
                            <p className="text-sm mt-1 bg-muted/30 p-3 rounded-md leading-relaxed">{sample.specifics}</p>
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
          </Card>
        </div>

        {/* Right Column: 1. Booking Timeline FIRST, 2. Process Controls SECOND */}
        <div className="space-y-6">
          {/* 1. Booking Timeline Card (AT TOP OF RIGHT COLUMN) */}
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Booking Timeline</h3>
            <div className="space-y-0">
              {timelineSteps.map((step: any, i: number) => {
                const isStepRejected = step.state === "rejected" || step.state === "failed";
                const isStepWarning = step.state === "warning";
                const isStepRefunded = step.state === "refunded";
                const isStepCompleted = step.state === "completed" || step.done;

                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isStepRejected 
                          ? "bg-red-600 border-red-600 text-white shadow-sm" 
                          : isStepWarning
                            ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                            : isStepRefunded
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : isStepCompleted
                                ? "bg-litmus-emerald border-litmus-emerald text-white shadow-sm" 
                                : "bg-card border-border"
                      }`}>
                        {isStepRejected ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : isStepWarning ? (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        ) : isStepRefunded ? (
                          <RotateCcw className="h-3.5 w-3.5" />
                        ) : isStepCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : null}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[2.5rem] my-1 ${
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
                    <div className="pt-0.5 pb-6">
                      <p className={`text-sm ${
                        isStepRejected
                          ? "text-red-600 dark:text-red-400 font-bold"
                          : isStepWarning
                            ? "text-amber-700 dark:text-amber-400 font-semibold"
                            : isStepRefunded
                              ? "text-blue-700 dark:text-blue-400 font-semibold"
                              : isStepCompleted 
                                ? "text-foreground font-semibold" 
                                : "text-muted-foreground"
                      }`}>
                        {step.label}
                      </p>
                      {step.message && (
                        <p className={`text-xs mt-1 font-medium px-2 py-0.5 rounded border inline-block ${
                          isStepRejected
                            ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900"
                            : isStepWarning
                              ? "text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900"
                              : "text-muted-foreground bg-muted/40 border-border"
                        }`}>
                          {step.state === 'rejected' ? `Reason: ${step.message}` : step.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 2. Process & Status Controls Card (BELOW TIMELINE) */}
          <Card className="p-6 border border-border shadow-sm space-y-5">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-primary" /> Process & Status Controls
            </h3>

            {isRejecting ? (
              <div className="space-y-4 bg-background p-4 rounded-lg border border-red-200 shadow-sm">
                <label className="text-sm font-semibold text-red-800 dark:text-red-300">Reason for Rejection</label>
                <Textarea
                  placeholder="Provide a reason to the user..."
                  className="bg-background border-red-200 focus-visible:ring-red-500 min-h-[100px]"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectBookingMutation.mutate({ bookingId: id as string, reason: rejectReason })}
                    disabled={!rejectReason.trim() || rejectBookingMutation.isPending}
                  >
                    {rejectBookingMutation.isPending ? "Rejecting..." : "Submit Rejection"}
                  </Button>
                  <Button variant="outline" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Booking Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Booking Status
                  </label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select booking status" />
                    </SelectTrigger>
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

                {/* Assigned Laboratory Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> Assigned Laboratory
                  </label>
                  <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select lab to assign..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart_allocation" className="font-medium text-slate-700 dark:text-slate-300">
                        Litmus Smart Allocation (Default / Auto)
                      </SelectItem>
                      <SelectItem value="litmus_direct" className="font-semibold text-emerald-700 dark:text-emerald-400">
                        ⭐ Litmus (End-to-End Direct Handling)
                      </SelectItem>
                      {labs.map((l: any) => (
                        <SelectItem key={l._id} value={l._id}>
                          {l.labName} {l.location ? `(${l.location})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment & Refund Status Selection */}
                <div className="space-y-1.5 pt-1 border-t border-border">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Payment Status
                  </label>
                  <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING (Payment Pending)</SelectItem>
                      <SelectItem value="SUCCESS">SUCCESS (Paid)</SelectItem>
                      <SelectItem value="FAILED">FAILED (Payment Failed)</SelectItem>
                      <SelectItem value="REFUND_INITIATED">REFUND_INITIATED (Initiate Refund)</SelectItem>
                      <SelectItem value="REFUNDED">REFUNDED (Refund Completed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Save Status & Lab Updates */}
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full bg-primary text-primary-foreground shadow-sm gap-2 font-medium"
                    disabled={updateBookingStatusMutation.isPending}
                    onClick={() => updateBookingStatusMutation.mutate({
                      status: selectedStatus,
                      paymentStatus: selectedPaymentStatus,
                      labId: selectedLabId
                    })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {updateBookingStatusMutation.isPending ? "Updating Process..." : "Update Status & Lab"}
                  </Button>

                  {status?.toLowerCase() === "pending" && (
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 text-xs"
                      onClick={() => setIsRejecting(true)}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject Booking Entirely
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Booking Rejection Card (if rejected) */}
          {isRejected && (
            <Card className="p-5 border border-red-200 shadow-sm bg-red-50/60 dark:bg-red-950/30 space-y-2">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
                <XCircle className="h-5 w-5" /> Booking Rejected by Admin
              </div>
              <p className="text-xs font-semibold text-red-900 dark:text-red-200 pt-1">
                Reason for Rejection:
              </p>
              <p className="text-xs text-red-800 dark:text-red-300 bg-white dark:bg-black/40 p-2.5 rounded-md border border-red-100 dark:border-red-900/50">
                {b.metadata?.rejectionReason || "No reason specified."}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Slide-Over Side Drawer (Sheet) for Test Report & Clinical Remarks */}
      <Sheet open={isReportDrawerOpen} onOpenChange={setIsReportDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6 space-y-6">
          {/* Header with pr-12 to prevent overlap with Sheet close 'X' button */}
          <SheetHeader className="pr-12 pb-4 border-b border-border text-left">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Test Report & Clinical Remarks
                </SheetTitle>
                {b.isReportApprovedByAdmin ? (
                  <Badge variant="default" className="bg-emerald-600 text-white gap-1 text-[11px] py-0 px-2">
                    <CheckCheck className="h-3 w-3" /> Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-[11px] py-0 px-2">
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Attached Test Report Documents ({reportFiles.length})
              </label>
            </div>

            {reportFiles.length > 0 ? (
              <div className="space-y-2.5">
                {reportFiles.map((url: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/10 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 p-2 rounded-md shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-foreground truncate">
                          Test Report Document {idx + 1}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline px-2.5 py-1.5 rounded-md bg-primary/5 border border-primary/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </a>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/10">
                <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No test reports attached yet</p>
                <p className="text-xs text-muted-foreground mt-1">Upload PDF or image test reports generated by the laboratory</p>
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
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted/50 cursor-pointer shadow-sm transition-colors ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary" />}
                {isUploading ? "Uploading file..." : "Upload New Report Document"}
              </label>
              <span className="text-xs text-muted-foreground">PDF, DOC, DOCX, PNG, JPG (Max 25MB)</span>
            </div>
          </div>

          {/* Clinical Remarks Editor */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Executive Summary
              </label>
              <Textarea
                placeholder="Provide an executive summary of sample findings and key observations..."
                className="min-h-[100px] bg-background resize-y text-sm leading-relaxed"
                value={reportSummary.summary}
                onChange={(e) => setReportSummary({ ...reportSummary, summary: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Recommendations
              </label>
              <Textarea
                placeholder="Key corrective measures or nutritional/safety recommendations..."
                className="min-h-[85px] bg-background border-emerald-200 dark:border-emerald-900/50 resize-y text-sm"
                value={reportSummary.recommendations}
                onChange={(e) => setReportSummary({ ...reportSummary, recommendations: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Tips & Best Practices
              </label>
              <Textarea
                placeholder="Preventative tips, hygiene or handling guidelines..."
                className="min-h-[85px] bg-background border-amber-200 dark:border-amber-900/50 resize-y text-sm"
                value={reportSummary.tips}
                onChange={(e) => setReportSummary({ ...reportSummary, tips: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Additional Notes / Lab Disclaimers
              </label>
              <Textarea
                placeholder="Testing methodologies, instrumentation, or legal disclaimer notes..."
                className="min-h-[75px] bg-background resize-y text-sm"
                value={reportSummary.additionalNotes}
                onChange={(e) => setReportSummary({ ...reportSummary, additionalNotes: e.target.value })}
              />
            </div>

            {/* Action Buttons in Drawer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-border">
              <Button
                variant="outline"
                className="gap-2 font-medium"
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm font-semibold"
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
