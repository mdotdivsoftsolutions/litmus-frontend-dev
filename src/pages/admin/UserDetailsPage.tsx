import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShoppingCart,
  CreditCard,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MapPin,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Copy,
  Check,
  Building2,
  FileText,
  Edit3,
  TrendingUp,
  Headphones,
  Send,
  Filter,
  Ban,
  UserCheck2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

function TablePaginationBar({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (totalItems <= itemsPerPage) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-border/70 px-4 py-2.5 bg-slate-50/60 text-xs">
      <p className="text-muted-foreground text-[11px]">
        Showing <span className="font-semibold text-slate-900">{start}</span> to{" "}
        <span className="font-semibold text-slate-900">{end}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalItems}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white border-border/80 shadow-2xs hover:bg-slate-50"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-3.5 w-3.5 text-slate-700" />
        </Button>
        <span className="text-[11px] font-bold text-slate-700 px-1.5">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-white border-border/80 shadow-2xs hover:bg-slate-50"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
        </Button>
      </div>
    </div>
  );
}

export default function UserDetailsPage() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "COMPLETED" | "PENDING" | "UNPAID" | "CANCELLED">("ALL");
  const [bookingPage, setBookingPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [consultationPage, setConsultationPage] = useState(1);
  const [chatPage, setChatPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [newNote, setNewNote] = useState("");

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    alternatePhone: "",
    companyName: "",
    fssaiNumber: "",
    gstNumber: "",
    industryCategory: "General Food & Beverage",
    customerSegment: "INDIVIDUAL",
    kycStatus: "PENDING",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminUserDetailed", userId],
    queryFn: () => adminApi.getUserDetailedProfile(userId!),
    enabled: !!userId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.updateUserStatus({ userId, isActive }),
    onSuccess: (data: any) => {
      toast.success(data.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUserDetailed", userId] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setShowStatusConfirm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateUserProfile(userId!, data),
    onSuccess: () => {
      toast.success("User profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUserDetailed", userId] });
      setShowEditDrawer(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (noteText: string) => adminApi.addUserAdminNote(userId!, noteText),
    onSuccess: () => {
      toast.success("Staff note added");
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["adminUserDetailed", userId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add note");
    },
  });

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenEdit = (user: any) => {
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      alternatePhone: user.alternatePhone || "",
      companyName: user.companyName || "",
      fssaiNumber: user.fssaiNumber || "",
      gstNumber: user.gstNumber || "",
      industryCategory: user.industryCategory || "General Food & Beverage",
      customerSegment: user.customerSegment || "INDIVIDUAL",
      kycStatus: user.kycStatus || "PENDING",
      billingStreet: user.billingAddress?.street || "",
      billingCity: user.billingAddress?.city || "",
      billingState: user.billingAddress?.state || "",
      billingPincode: user.billingAddress?.pincode || "",
      shippingStreet: user.shippingAddress?.street || "",
      shippingCity: user.shippingAddress?.city || "",
      shippingState: user.shippingAddress?.state || "",
      shippingPincode: user.shippingAddress?.pincode || "",
    });
    setShowEditDrawer(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      alternatePhone: editForm.alternatePhone,
      companyName: editForm.companyName,
      fssaiNumber: editForm.fssaiNumber,
      gstNumber: editForm.gstNumber,
      industryCategory: editForm.industryCategory,
      customerSegment: editForm.customerSegment,
      kycStatus: editForm.kycStatus,
      billingAddress: {
        street: editForm.billingStreet,
        city: editForm.billingCity,
        state: editForm.billingState,
        pincode: editForm.billingPincode,
        country: "India",
      },
      shippingAddress: {
        street: editForm.shippingStreet,
        city: editForm.shippingCity,
        state: editForm.shippingState,
        pincode: editForm.shippingPincode,
        country: "India",
      },
    });
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote.trim());
  };

  const detailedData = response?.data;
  const user = detailedData?.user;
  const stats = detailedData?.stats;
  const bookings = detailedData?.bookings || [];
  const payments = detailedData?.payments || [];
  const cart = detailedData?.cart;
  const consultations = detailedData?.consultations || [];
  const chatSessions = detailedData?.chatSessions || [];
  const activities = detailedData?.activities || [];

  // Filtered Bookings for the Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b: any) => {
      if (bookingFilter === "ALL") return true;
      const statusUpper = String(b.status || "").toUpperCase();
      const isPaid = ["SUCCESS", "PAID"].includes(String(b.paymentStatus || "").toUpperCase()) || statusUpper === "COMPLETED";

      if (bookingFilter === "COMPLETED") return statusUpper === "COMPLETED";
      if (bookingFilter === "PENDING") return !["COMPLETED", "REJECTED", "CANCELLED"].includes(statusUpper);
      if (bookingFilter === "UNPAID") return !isPaid && !["CANCELLED", "REJECTED"].includes(statusUpper);
      if (bookingFilter === "CANCELLED") return ["CANCELLED", "REJECTED"].includes(statusUpper);
      return true;
    });
  }, [bookings, bookingFilter]);

  const paginatedBookings = useMemo(() => {
    const start = (bookingPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, bookingPage]);

  const paginatedPayments = useMemo(() => {
    const start = (paymentPage - 1) * ITEMS_PER_PAGE;
    return payments.slice(start, start + ITEMS_PER_PAGE);
  }, [payments, paymentPage]);

  const paginatedConsultations = useMemo(() => {
    const start = (consultationPage - 1) * ITEMS_PER_PAGE;
    return consultations.slice(start, start + ITEMS_PER_PAGE);
  }, [consultations, consultationPage]);

  const paginatedChats = useMemo(() => {
    const start = (chatPage - 1) * ITEMS_PER_PAGE;
    return chatSessions.slice(start, start + ITEMS_PER_PAGE);
  }, [chatSessions, chatPage]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in mx-auto pb-20 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl bg-white border border-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl bg-white border border-slate-200" />
          <Skeleton className="h-96 rounded-xl lg:col-span-2 bg-white border border-slate-200" />
        </div>
      </div>
    );
  }

  if (!detailedData || !user) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">The requested user profile does not exist or has been removed.</p>
        </div>
        <Button onClick={() => navigate("/admin/users")} className="bg-primary hover:bg-primary/90 text-white">
          Back to Users Directory
        </Button>
      </div>
    );
  }

  const initials = `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`.toUpperCase() || "U";

  return (
    <div className="space-y-6 animate-fade-in mx-auto pb-20 font-sans">
      {/* ── Top Header Toolbar (Matching Platform Design Flow) ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Back Button + User Badge + Identity */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/users")}
            className="h-11 w-11 rounded-lg bg-white border border-border/80 shadow-2xs shrink-0 hover:bg-slate-50 text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary text-white font-black flex items-center justify-center text-lg shadow-2xs shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                {user.companyName && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {user.companyName}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={
                    user.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs"
                      : "bg-rose-50 text-rose-700 border-rose-200 font-semibold text-xs"
                  }
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", user.isActive ? "bg-emerald-500" : "bg-rose-500")} />
                  {user.isActive ? "Active Account" : "Suspended"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user.kycStatus === "VERIFIED"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs"
                      : "bg-amber-50 text-amber-700 border-amber-200 font-semibold text-xs"
                  }
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {user.kycStatus === "VERIFIED" ? "KYC Verified" : "KYC Pending"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                User ID: {user._id} • Segment: <span className="font-semibold text-slate-700">{user.customerSegment || "INDIVIDUAL"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons (Following Standard Platform Flow) */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Edit Profile Button (Primary Action) */}
          <Button
            onClick={() => handleOpenEdit(user)}
            className="bg-primary hover:bg-primary/90 text-white shadow-2xs text-xs h-9 px-4 rounded-lg font-bold flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>

          {/* Suspend / Activate Account Button (Secondary Action) */}
          <Button
            variant="outline"
            onClick={() => setShowStatusConfirm(true)}
            className={cn(
              "text-xs h-9 px-4 rounded-lg font-bold border shadow-2xs flex items-center gap-1.5 transition-all",
              user.isActive
                ? "bg-white border-rose-200 text-rose-700 hover:bg-rose-50"
                : "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            )}
          >
            {user.isActive ? <Ban className="h-3.5 w-3.5" /> : <UserCheck2 className="h-3.5 w-3.5" />}
            <span>{user.isActive ? "Suspend Account" : "Activate Account"}</span>
          </Button>
        </div>
      </div>

      {/* ── 5 Key Performance Metrics Cards ──────────────────────────────────── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {/* 1. Total Bookings */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                Lifetime
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {(stats?.totalBookings ?? bookings.length).toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Total Orders Placed</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {stats?.firstBookingDate ? `First: ${format(new Date(stats.firstBookingDate), "MMM yyyy")}` : "No bookings yet"}
            </p>
          </CardContent>
        </Card>

        {/* 2. Completed Orders */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                Delivered
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">
              {(stats?.completedBookings ?? 0).toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Completed Bookings</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Signed NABL reports generated</p>
          </CardContent>
        </Card>

        {/* 3. Pending & Unpaid */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                Action Req.
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">
              {(stats?.pendingBookings ?? 0).toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Pending / In Testing</p>
            <p className="text-[11px] text-rose-600 font-medium mt-1 truncate">
              {stats?.unpaidBookings > 0
                ? `${stats.unpaidBookings} unpaid (${formatCurrency(stats?.totalUnpaidAmount || 0)})`
                : "All active paid"}
            </p>
          </CardContent>
        </Card>

        {/* 4. Lifetime Value (Total Spend) */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                Revenue
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {formatCurrency(stats?.totalAmountPaid ?? 0)}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Lifetime Purchase (LTV)</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Total verified receipts</p>
          </CardContent>
        </Card>

        {/* 5. Average Order Value & Inquiries */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                AOV
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {formatCurrency(stats?.averageOrderValue ?? 0)}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Average Order Value</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {consultations.length} Consultations • {chatSessions.length} Support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Layout: Profile Identity Details + Multi-Tab Activity Hub ──── */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* Left Column: Account, Contact, Business & Compliance ──────────────── */}
        <div className="w-full xl:w-[340px] shrink-0 space-y-4">
          {/* Contact Details Card */}
          <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700">
                <UserCheck className="h-4 w-4 text-primary" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              {/* Email */}
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-8 w-8 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Primary Email</p>
                    <p className="font-semibold text-xs text-slate-900 truncate" title={user.email}>
                      {user.email || "No email"}
                    </p>
                  </div>
                </div>
                {user.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-slate-400 hover:text-slate-700"
                    onClick={() => copyToClipboard(user.email, "Email")}
                  >
                    {copiedField === "Email" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Number</p>
                    <p className="font-semibold text-xs text-slate-900">{user.phone || "Not provided"}</p>
                  </div>
                </div>
                {user.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-slate-400 hover:text-slate-700"
                    onClick={() => copyToClipboard(user.phone, "Phone")}
                  >
                    {copiedField === "Phone" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                )}
              </div>

              {/* Alternate Phone */}
              {user.alternatePhone && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-muted-foreground">Alternate Phone</span>
                  <span className="font-semibold text-slate-900">{user.alternatePhone}</span>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Registered
                  </p>
                  <p className="font-semibold text-xs text-slate-800 mt-1">
                    {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last Active
                  </p>
                  <p className="font-semibold text-xs text-slate-800 mt-1">
                    {user.lastLoginAt ? format(new Date(user.lastLoginAt), "MMM d, HH:mm") : "Recent"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business & Regulatory Details Card */}
          <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700">
                <Building2 className="h-4 w-4 text-primary" /> Business & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">Company / Organization</span>
                <span className="font-bold text-slate-900">{user.companyName || "Individual Account"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">Industry Category</span>
                <span className="font-semibold text-slate-900">{user.industryCategory || "Food & Beverage"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">FSSAI License</span>
                <span className="font-mono font-bold text-slate-900">{user.fssaiNumber || "Not Provided"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">GSTIN Number</span>
                <span className="font-mono font-bold text-slate-900">{user.gstNumber || "Unregistered"}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Customer Segment</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-800 text-[10px] font-bold">
                  {user.customerSegment || "INDIVIDUAL"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing & Shipping Addresses Card */}
          {(user.billingAddress?.city || user.shippingAddress?.city || user.address) && (
            <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-primary" /> Registered Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                {user.billingAddress?.city && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Billing Address</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {user.billingAddress.street && `${user.billingAddress.street}, `}
                      {user.billingAddress.city}, {user.billingAddress.state} - {user.billingAddress.pincode}
                    </p>
                  </div>
                )}
                {user.shippingAddress?.city && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Sample Pickup Address</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {user.shippingAddress.street && `${user.shippingAddress.street}, `}
                      {user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.pincode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Complete Order History, Payments, Activities, Notes Hub ── */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="bg-white border border-border/80 shadow-2xs p-1 rounded-lg inline-flex w-full sm:w-auto h-auto flex-wrap gap-1">
              <TabsTrigger
                value="bookings"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Payments ({payments.length})
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Activity Timeline ({activities.length})
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Staff Notes ({user.adminNotes?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="consultations"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Consultations ({consultations.length})
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Support Chats ({chatSessions.length})
              </TabsTrigger>
              <TabsTrigger
                value="cart"
                className="text-xs px-3.5 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all"
              >
                Cart ({cart?.items?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Complete Booking History ────────────────────────────── */}
            <TabsContent value="bookings" className="mt-3 space-y-3">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap bg-slate-100/80 p-1.5 rounded-lg text-xs font-medium">
                <span className="text-slate-500 text-[11px] px-2 flex items-center gap-1 font-semibold">
                  <Filter className="h-3 w-3" /> Filter:
                </span>
                {(["ALL", "COMPLETED", "PENDING", "UNPAID", "CANCELLED"] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    type="button"
                    onClick={() => {
                      setBookingFilter(filterVal);
                      setBookingPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      bookingFilter === filterVal ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {filterVal === "ALL" && `All Orders (${bookings.length})`}
                    {filterVal === "COMPLETED" && `Completed (${stats?.completedBookings || 0})`}
                    {filterVal === "PENDING" && `In Progress (${stats?.pendingBookings || 0})`}
                    {filterVal === "UNPAID" && `Unpaid / Due (${stats?.unpaidBookings || 0})`}
                    {filterVal === "CANCELLED" && `Cancelled (${stats?.cancelledBookings || 0})`}
                  </button>
                ))}
              </div>

              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden min-h-[380px] flex flex-col justify-between">
                {filteredBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground flex-1">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-900">No orders found</p>
                    <p className="text-xs text-muted-foreground mt-1">No bookings match the selected status filter.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-[11px]">
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Booking ID</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Date Placed</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Test / Package Items</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap hidden md:table-cell">Laboratory</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Payment</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Status</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Amount Paid</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((b: any) => {
                          const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
                          const itemSummary =
                            b.items?.[0]?.packageId?.name ||
                            b.items?.[0]?.testId?.name ||
                            b.items?.[0]?.testId?.testName ||
                            (b.items?.length > 1 ? `${b.items.length} Test Items` : "Diagnostic Service");
                          const isPaid =
                            ["SUCCESS", "PAID"].includes(String(b.paymentStatus || "").toUpperCase()) ||
                            String(b.status).toUpperCase() === "COMPLETED";

                          return (
                            <TableRow
                              key={b._id}
                              className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                              onClick={() => navigate(`/admin/bookings/${b._id}`)}
                            >
                              <TableCell className="py-3 px-3 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                                {displayId}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">
                                {b.createdAt ? format(new Date(b.createdAt), "MMM d, yyyy • h:mm a") : "N/A"}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-xs font-semibold text-slate-800 max-w-[220px] truncate whitespace-nowrap" title={itemSummary}>
                                {itemSummary}
                              </TableCell>
                              <TableCell
                                className="py-3 px-3 text-xs text-muted-foreground hidden md:table-cell max-w-[160px] truncate whitespace-nowrap"
                                title={b.labId?.labName || "Litmus Smart Allocation"}
                              >
                                {b.labId?.labName || "Litmus Smart Allocation"}
                              </TableCell>
                              <TableCell className="py-3 px-3 whitespace-nowrap">
                                <StatusBadge status={isPaid ? "Paid" : b.paymentStatus || "Pending"} />
                              </TableCell>
                              <TableCell className="py-3 px-3 whitespace-nowrap">
                                <StatusBadge status={b.status || "Pending"} />
                              </TableCell>
                              <TableCell className="py-3 px-3 text-right text-xs font-black text-slate-900 whitespace-nowrap">
                                {formatCurrency(b.totalAmount || 0)}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-right whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs font-semibold hover:bg-slate-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/bookings/${b._id}`);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1 text-slate-600" /> View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <TablePaginationBar
                      currentPage={bookingPage}
                      totalItems={filteredBookings.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setBookingPage}
                      itemLabel="orders"
                    />
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 2: Payments & Invoices ──────────────────────────────────── */}
            <TabsContent value="payments" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden min-h-[380px] flex flex-col justify-between">
                {payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground flex-1">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <CreditCard className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-900">No payment records found</p>
                    <p className="text-xs text-muted-foreground mt-1">Payment transactions and receipts will appear here once processed.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-[11px]">
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Transaction ID</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Date & Time</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Linked Booking</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Method</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Status</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Amount Paid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPayments.map((p: any) => {
                          const txnId = p.transactionId || p.razorpayPaymentId || `TXN-${String(p._id).slice(-6).toUpperCase()}`;
                          const bkgId = p.bookingId?._id
                            ? `BKG-${String(p.bookingId._id).slice(-6).toUpperCase()}`
                            : p.bookingId
                            ? `BKG-${String(p.bookingId).slice(-6).toUpperCase()}`
                            : "N/A";
                          const isSuccess = ["SUCCESS", "PAID"].includes(String(p.status).toUpperCase());

                          return (
                            <TableRow key={p._id} className="hover:bg-slate-50/60 text-xs">
                              <TableCell className="font-mono font-bold text-slate-900 whitespace-nowrap">{txnId}</TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {p.createdAt ? format(new Date(p.createdAt), "MMM d, yyyy • h:mm a") : "N/A"}
                              </TableCell>
                              <TableCell className="font-mono text-primary font-bold whitespace-nowrap">{bkgId}</TableCell>
                              <TableCell className="text-slate-700 capitalize font-medium whitespace-nowrap">{p.method || "Online Gateway"}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <StatusBadge status={isSuccess ? "Paid" : p.status === "FAILED" ? "Rejected" : "Pending"} />
                              </TableCell>
                              <TableCell className="text-right font-black text-slate-900 whitespace-nowrap">
                                {formatCurrency(p.amount || 0)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <TablePaginationBar
                      currentPage={paymentPage}
                      totalItems={payments.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setPaymentPage}
                      itemLabel="transactions"
                    />
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 3: Unified Activity Timeline ───────────────────────────── */}
            <TabsContent value="activities" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden p-5">
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <Activity className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="font-bold text-slate-900">No recorded activities</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {activities.map((act: any) => (
                      <div key={act.id} className="relative flex items-start gap-3 text-xs">
                        <div
                          className={cn(
                            "absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center text-white shadow-2xs",
                            act.type === "BOOKING"
                              ? "bg-blue-600"
                              : act.type === "PAYMENT"
                              ? "bg-emerald-600"
                              : act.type === "CONSULTATION"
                              ? "bg-purple-600"
                              : act.type === "SUPPORT_CHAT"
                              ? "bg-teal-600"
                              : "bg-slate-700"
                          )}
                        >
                          {act.type === "BOOKING" && <Activity className="h-2.5 w-2.5" />}
                          {act.type === "PAYMENT" && <CreditCard className="h-2.5 w-2.5" />}
                          {act.type === "CONSULTATION" && <MessageSquare className="h-2.5 w-2.5" />}
                          {act.type === "SUPPORT_CHAT" && <Headphones className="h-2.5 w-2.5" />}
                          {act.type === "REGISTRATION" && <UserCheck className="h-2.5 w-2.5" />}
                          {act.type === "LOGIN" && <Clock className="h-2.5 w-2.5" />}
                        </div>
                        <div className="flex-1 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{act.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {act.date ? format(new Date(act.date), "MMM d, yyyy • h:mm a") : ""}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 4: Internal Staff Notes ───────────────────────────────── */}
            <TabsContent value="notes" className="mt-3 space-y-4">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden p-4">
                <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-slate-800">Add Staff / Specialist Note</span>
                  </div>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter private client details, testing preferences, special corporate terms, or compliance remarks..."
                    className="min-h-[80px] text-xs resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newNote.trim() || addNoteMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-white text-xs h-8 px-4 rounded-lg font-bold"
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      {addNoteMutation.isPending ? "Saving..." : "Save Staff Note"}
                    </Button>
                  </div>
                </form>
              </Card>

              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden p-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Previous Staff Notes</h3>
                {!user.adminNotes || user.adminNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">No internal notes added yet for this client.</p>
                ) : (
                  <div className="space-y-3">
                    {user.adminNotes.map((n: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-900">{n.authorName || "Litmus Specialist"}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {n.createdAt ? format(new Date(n.createdAt), "MMM d, yyyy • h:mm a") : ""}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 5: Consultations & Inquiries ───────────────────────────── */}
            <TabsContent value="consultations" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden min-h-[380px] flex flex-col justify-between">
                {consultations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground flex-1">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-900">No consultation requests</p>
                    <p className="text-xs text-muted-foreground mt-1">This user hasn't submitted any advisory inquiries.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-[11px]">
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Date</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Source / Topic</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Service of Interest</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Status</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedConsultations.map((c: any) => (
                          <TableRow key={c._id} className="hover:bg-slate-50/60 text-xs">
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell className="font-bold text-slate-900 whitespace-nowrap">{c.source || "Website Consultation"}</TableCell>
                            <TableCell className="text-slate-600 whitespace-nowrap">{c.service || c.topic || "Food Safety Analysis"}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={
                                  c.status === "Resolved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : c.status === "Contacted"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {c.status || "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-white border border-border/80 rounded-md shadow-2xs hover:bg-slate-50"
                                onClick={() => navigate("/admin/consultations")}
                              >
                                View Leads
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <TablePaginationBar
                      currentPage={consultationPage}
                      totalItems={consultations.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setConsultationPage}
                      itemLabel="consultations"
                    />
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 6: Support Chats ────────────────────────────────────────── */}
            <TabsContent value="support" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden min-h-[380px] flex flex-col justify-between">
                {chatSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground flex-1">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Headphones className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-900">No support chat sessions</p>
                    <p className="text-xs text-muted-foreground mt-1">Live customer support interactions will be recorded here.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-[11px]">
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Session ID</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Date</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Attending Specialist</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Initial Query</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Status</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedChats.map((s: any) => (
                          <TableRow key={s._id} className="hover:bg-slate-50/60 text-xs">
                            <TableCell className="font-mono font-bold text-slate-900 whitespace-nowrap">{s.sessionId}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {s.createdAt ? format(new Date(s.createdAt), "MMM d, yyyy • h:mm a") : "N/A"}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-800 whitespace-nowrap">
                              {s.assignedAgent ? `${s.assignedAgent.firstName || ""} ${s.assignedAgent.lastName || ""}` : "Unassigned"}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-slate-600 whitespace-nowrap" title={s.initialQuery}>
                              {s.initialQuery || "Live Support Consultation"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={
                                  s.status === "RESOLVED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : s.status === "ACTIVE"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {s.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-white border border-border/80 rounded-md shadow-2xs hover:bg-slate-50"
                                onClick={() => navigate(`/admin/live-support?openSessionId=${s.sessionId}`)}
                              >
                                Open in Desk
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <TablePaginationBar
                      currentPage={chatPage}
                      totalItems={chatSessions.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setChatPage}
                      itemLabel="chat sessions"
                    />
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* ── Tab 7: Cart & Abandoned Items ──────────────────────────────── */}
            <TabsContent value="cart" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden min-h-[380px]">
                {!cart || !cart.items || cart.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <ShoppingCart className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-bold text-slate-900">Cart is empty</p>
                    <p className="text-xs text-muted-foreground mt-1">This user does not currently have un-purchased tests in their active cart.</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50 text-[11px]">
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Test / Package Item</TableHead>
                          <TableHead className="py-3 px-3 text-xs whitespace-nowrap">Type</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right whitespace-nowrap">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.items.map((item: any, idx: number) => {
                          const itemName =
                            item.packageId?.name || item.testId?.name || item.testId?.testName || "Custom Test Service";

                          return (
                            <TableRow key={idx} className="hover:bg-slate-50/60 text-xs">
                              <TableCell className="font-bold text-slate-900 whitespace-nowrap">{itemName}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge variant="outline" className="text-[10px] bg-slate-50 uppercase font-semibold">
                                  {item.itemType || "Test"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-black text-slate-900 whitespace-nowrap">
                                {formatCurrency(item.price || item.packageId?.price || item.testId?.price || 0)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Slide-Over Side Drawer for Edit Profile & Business Details ──────── */}
      <Sheet open={showEditDrawer} onOpenChange={setShowEditDrawer}>
        <SheetContent side="right" className="sm:max-w-[540px] w-full p-0 flex flex-col h-full bg-white font-sans">
          <SheetHeader className="px-6 py-4 border-b shrink-0 bg-white">
            <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Edit User Profile & Business Details
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <form id="edit-user-form" onSubmit={handleSaveEdit} className="space-y-4 py-5 text-xs">
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1.5 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-primary" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700">First Name</label>
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="h-9 text-xs mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Last Name</label>
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700">Mobile Number</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="h-9 text-xs mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Alternate Phone</label>
                    <Input
                      value={editForm.alternatePhone}
                      onChange={(e) => setEditForm({ ...editForm, alternatePhone: e.target.value })}
                      className="h-9 text-xs mt-1"
                      placeholder="+91..."
                    />
                  </div>
                </div>
              </div>

              {/* Corporate & Business Credentials */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Business & Regulatory Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700">Company / Organization</label>
                    <Input
                      value={editForm.companyName}
                      onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                      className="h-9 text-xs mt-1"
                      placeholder="e.g. Acme Foods Ltd"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Industry Category</label>
                    <Input
                      value={editForm.industryCategory}
                      onChange={(e) => setEditForm({ ...editForm, industryCategory: e.target.value })}
                      className="h-9 text-xs mt-1"
                      placeholder="e.g. Dairy, Spices, Bakery"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700">FSSAI License Number</label>
                    <Input
                      value={editForm.fssaiNumber}
                      onChange={(e) => setEditForm({ ...editForm, fssaiNumber: e.target.value })}
                      className="h-9 text-xs mt-1"
                      placeholder="14-digit FSSAI"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">GSTIN Tax ID</label>
                    <Input
                      value={editForm.gstNumber}
                      onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                      className="h-9 text-xs mt-1"
                      placeholder="15-character GSTIN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700">Customer Segment</label>
                    <select
                      value={editForm.customerSegment}
                      onChange={(e) => setEditForm({ ...editForm, customerSegment: e.target.value })}
                      className="w-full h-9 mt-1 rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="FOOD_BUSINESS">Food Business</option>
                      <option value="ENTERPRISE">Enterprise</option>
                      <option value="LAB_PARTNER">Lab Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">KYC Status</label>
                    <select
                      value={editForm.kycStatus}
                      onChange={(e) => setEditForm({ ...editForm, kycStatus: e.target.value })}
                      className="w-full h-9 mt-1 rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="PENDING">Pending Verification</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Primary Billing Address
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Street / Facility Address"
                    value={editForm.billingStreet}
                    onChange={(e) => setEditForm({ ...editForm, billingStreet: e.target.value })}
                    className="col-span-2 h-9 text-xs"
                  />
                  <Input
                    placeholder="City"
                    value={editForm.billingCity}
                    onChange={(e) => setEditForm({ ...editForm, billingCity: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <Input
                    placeholder="State"
                    value={editForm.billingState}
                    onChange={(e) => setEditForm({ ...editForm, billingState: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <Input
                    placeholder="Pincode"
                    value={editForm.billingPincode}
                    onChange={(e) => setEditForm({ ...editForm, billingPincode: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Sample Pickup Address */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Sample Pickup Address
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Street / Lab Delivery Hub Address"
                    value={editForm.shippingStreet}
                    onChange={(e) => setEditForm({ ...editForm, shippingStreet: e.target.value })}
                    className="col-span-2 h-9 text-xs"
                  />
                  <Input
                    placeholder="City"
                    value={editForm.shippingCity}
                    onChange={(e) => setEditForm({ ...editForm, shippingCity: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <Input
                    placeholder="State"
                    value={editForm.shippingState}
                    onChange={(e) => setEditForm({ ...editForm, shippingState: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <Input
                    placeholder="Pincode"
                    value={editForm.shippingPincode}
                    onChange={(e) => setEditForm({ ...editForm, shippingPincode: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </form>
          </ScrollArea>

          {/* Side Drawer Footer */}
          <div className="p-4 border-t bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEditDrawer(false)}
              className="text-xs h-9 px-4 rounded-lg font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-user-form"
              size="sm"
              disabled={updateProfileMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-4 rounded-lg shadow-sm"
            >
              {updateProfileMutation.isPending ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Account Status Confirmation Dialog ─────────────────────────────────── */}
      <ConfirmDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        title={user.isActive ? "Suspend User Account" : "Re-activate User Account"}
        description={
          user.isActive
            ? `Are you sure you want to suspend access for ${user.firstName} ${user.lastName}? They will no longer be able to place bookings or log in.`
            : `Are you sure you want to activate ${user.firstName} ${user.lastName}'s account?`
        }
        confirmText={user.isActive ? "Suspend Account" : "Activate Account"}
        variant={user.isActive ? "destructive" : "default"}
        onConfirm={() => statusMutation.mutate({ userId: user._id, isActive: !user.isActive })}
      />
    </div>
  );
}
