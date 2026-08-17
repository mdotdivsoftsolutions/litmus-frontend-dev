import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  ArrowLeft, Mail, Phone, Calendar, Clock, ShoppingCart, 
  CreditCard, Activity, CheckCircle2, AlertTriangle, Eye, 
  MapPin, ShieldCheck, UserCheck, MessageSquare, Copy, Check
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function UserDetailsPage() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

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

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in mx-auto pb-20 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  const detailedData = response?.data;

  if (!detailedData || !detailedData.user) {
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

  const { user, stats, bookings = [], payments = [], cart, consultations = [] } = detailedData;

  const initials = `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`.toUpperCase() || "U";

  return (
    <div className="space-y-6 animate-fade-in mx-auto pb-20">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="h-11 w-11 rounded-lg bg-primary text-white font-bold flex items-center justify-center text-base shadow-2xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge 
                  variant="outline" 
                  className={user.isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs" 
                    : "bg-rose-50 text-rose-700 border-rose-200 font-medium text-xs"
                  }
                >
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {user.isActive ? "Active Account" : "Suspended"}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs border border-slate-200/80">
                  {user.role === "ADMIN" ? "Administrator" : "Customer / Client"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                User ID: {user._id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-border/80 shadow-2xs text-xs h-8 rounded-md"
            onClick={() => setShowStatusConfirm(true)}
          >
            {user.isActive ? "Suspend Account" : "Activate Account"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - Clean, Unified, Subtle Radius matching Dashboard */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Bookings",
            value: (stats?.totalBookings ?? bookings.length).toLocaleString(),
            subtitle: "Lifetime diagnostic orders",
            icon: Activity,
            badgeText: "Total",
          },
          {
            title: "Completed Tests",
            value: (stats?.completedBookings ?? 0).toLocaleString(),
            subtitle: "Reports generated & delivered",
            icon: CheckCircle2,
            badgeText: "Delivered",
          },
          {
            title: "Pending / Active",
            value: (stats?.pendingBookings ?? 0).toLocaleString(),
            subtitle: "In transit or at lab",
            icon: Clock,
            badgeText: "In Progress",
          },
          {
            title: "Total Spend",
            value: formatCurrency(stats?.totalAmountPaid ?? 0),
            subtitle: "Total revenue collected",
            icon: CreditCard,
            badgeText: "Paid",
          },
        ].map((kpi) => (
          <Card 
            key={kpi.title} 
            className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow duration-150 relative"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                  <kpi.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                  {kpi.badgeText}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                <p className="text-xs font-medium text-slate-600">{kpi.title}</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Layout: Profile Sidebar + Activity Hub */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* Left Column: Contact & Profile Details */}
        <div className="w-full xl:w-[320px] shrink-0 space-y-4">
          <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/40 border-b border-slate-100 py-3 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-slate-700">
                <UserCheck className="h-4 w-4 text-slate-600" /> Contact & Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              {/* Email */}
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-md bg-slate-50/60 border border-slate-100">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-8 w-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</p>
                    <p className="font-medium text-xs text-slate-900 truncate" title={user.email}>{user.email || "No email"}</p>
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
              <div className="flex items-start justify-between gap-2 p-2.5 rounded-md bg-slate-50/60 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</p>
                    <p className="font-medium text-xs text-slate-900">{user.phone || "Not provided"}</p>
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

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="p-2.5 rounded-md bg-slate-50/60 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Registered
                  </p>
                  <p className="font-medium text-xs text-slate-800 mt-1">
                    {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                  </p>
                </div>
                <div className="p-2.5 rounded-md bg-slate-50/60 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last Active
                  </p>
                  <p className="font-medium text-xs text-slate-800 mt-1">
                    {user.lastLoginAt ? format(new Date(user.lastLoginAt), "MMM d, HH:mm") : "Recent"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary Card */}
          <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/40 border-b border-slate-100 py-3 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-700">Account Health & Risk</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">Account Verification</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-[10px]">
                  Verified
                </Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-muted-foreground">Inquiries / Consultations</span>
                <span className="font-semibold text-slate-900">{consultations.length}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Abandoned Cart Items</span>
                <span className="font-semibold text-slate-900">{cart?.items?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Multi-Tab Detailed Activity Hub */}
        <div className="flex-1 min-w-0 w-full space-y-3">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="bg-white border border-border/80 shadow-2xs p-1 rounded-lg inline-flex w-full sm:w-auto h-auto flex-wrap gap-1">
              <TabsTrigger value="bookings" className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all">
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all">
                Payments ({payments.length})
              </TabsTrigger>
              <TabsTrigger value="cart" className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all">
                Cart Items ({cart?.items?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="consultations" className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white font-medium rounded-md transition-all">
                Consultations ({consultations.length})
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-900">No bookings placed yet</p>
                    <p className="text-xs text-muted-foreground mt-1">When this client orders lab testing or packages, they will show up here.</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="py-3 px-3 text-xs">Booking ID</TableHead>
                          <TableHead className="py-3 px-3 text-xs">Date</TableHead>
                          <TableHead className="py-3 px-3 text-xs">Product / Package</TableHead>
                          <TableHead className="py-3 px-3 text-xs hidden md:table-cell">Laboratory</TableHead>
                          <TableHead className="py-3 px-3 text-xs">Payment</TableHead>
                          <TableHead className="py-3 px-3 text-xs">Status</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right">Total</TableHead>
                          <TableHead className="py-3 px-3 text-xs text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((b: any) => {
                          const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
                          const itemSummary = b.items?.[0]?.packageId?.name 
                            || b.items?.[0]?.testId?.name 
                            || b.items?.[0]?.testId?.testName 
                            || (b.items?.length > 1 ? `${b.items.length} Test Items` : "Diagnostic Service");
                          const isPaid = ['SUCCESS', 'PAID'].includes(String(b.paymentStatus || '').toUpperCase()) || String(b.status).toUpperCase() === 'COMPLETED';

                          return (
                            <TableRow 
                              key={b._id} 
                              className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                              onClick={() => navigate(`/admin/bookings/${b._id}`)}
                            >
                              <TableCell className="py-3 px-3 font-mono text-xs font-semibold text-slate-900">{displayId}</TableCell>
                              <TableCell className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">
                                {b.createdAt ? format(new Date(b.createdAt), "MMM d, yyyy") : "N/A"}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-xs font-medium text-slate-800 max-w-[200px] truncate" title={itemSummary}>
                                {itemSummary}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-xs text-muted-foreground hidden md:table-cell max-w-[140px] truncate" title={b.labId?.labName || "Litmus Smart Allocation"}>
                                {b.labId?.labName || "Litmus Smart Allocation"}
                              </TableCell>
                              <TableCell className="py-3 px-3">
                                <StatusBadge status={isPaid ? "Paid" : b.paymentStatus || "Pending"} />
                              </TableCell>
                              <TableCell className="py-3 px-3">
                                <StatusBadge status={b.status || "Pending"} />
                              </TableCell>
                              <TableCell className="py-3 px-3 text-right text-xs font-bold text-slate-900 whitespace-nowrap">
                                {formatCurrency(b.totalAmount || 0)}
                              </TableCell>
                              <TableCell className="py-3 px-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/bookings/${b._id}`);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                                </Button>
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

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
                {payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <CreditCard className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-900">No payment records found</p>
                    <p className="text-xs text-muted-foreground mt-1">Payment transactions and gateway receipts will appear here once processed.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Linked Booking</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p: any) => {
                          const txnId = p.transactionId || p.razorpayPaymentId || `TXN-${String(p._id).slice(-6).toUpperCase()}`;
                          const bkgId = p.bookingId?._id 
                            ? `BKG-${String(p.bookingId._id).slice(-6).toUpperCase()}` 
                            : p.bookingId 
                              ? `BKG-${String(p.bookingId).slice(-6).toUpperCase()}` 
                              : "N/A";
                          const isSuccess = ['SUCCESS', 'PAID'].includes(String(p.status).toUpperCase());

                          return (
                            <TableRow key={p._id} className="hover:bg-slate-50/60">
                              <TableCell className="font-mono text-xs font-medium text-slate-900">{txnId}</TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {p.createdAt ? format(new Date(p.createdAt), "MMM d, yyyy, h:mm a") : "N/A"}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-primary font-medium">{bkgId}</TableCell>
                              <TableCell className="text-xs text-slate-600 capitalize">{p.method || "Razorpay / Gateway"}</TableCell>
                              <TableCell>
                                <StatusBadge status={isSuccess ? "Paid" : p.status === "FAILED" ? "Rejected" : "Pending"} />
                              </TableCell>
                              <TableCell className="text-right text-xs font-bold text-slate-900">
                                {formatCurrency(p.amount || 0)}
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

            {/* Cart Tab */}
            <TabsContent value="cart" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
                {!cart || !cart.items || cart.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <ShoppingCart className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-900">Cart is empty</p>
                    <p className="text-xs text-muted-foreground mt-1">This user does not currently have un-purchased tests in their active cart.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>Test / Package Item</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.items.map((item: any, idx: number) => {
                          const itemName = item.packageId?.name 
                            || item.testId?.name 
                            || item.testId?.testName 
                            || "Custom Test Service";

                          return (
                            <TableRow key={idx} className="hover:bg-slate-50/60">
                              <TableCell className="text-xs font-semibold text-slate-900">{itemName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] bg-slate-50 uppercase font-semibold">
                                  {item.itemType || "Test"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs font-bold text-slate-900">
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

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="mt-3">
              <Card className="border border-border/80 rounded-lg shadow-2xs bg-white overflow-hidden">
                {consultations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-900">No consultation requests</p>
                    <p className="text-xs text-muted-foreground mt-1">This user hasn't submitted any advisory or outreach inquiries.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>Date</TableHead>
                          <TableHead>Source / Topic</TableHead>
                          <TableHead>Service of Interest</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {consultations.map((c: any) => (
                          <TableRow key={c._id} className="hover:bg-slate-50/60">
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-slate-900">{c.source || "Website Advisory"}</TableCell>
                            <TableCell className="text-xs text-slate-600">{c.service || c.topic || "General Inquiry"}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={c.status === "Resolved" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : c.status === "Contacted" 
                                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {c.status || "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
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
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Account Status Confirmation Dialog */}
      <ConfirmDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        title={user.isActive ? "Suspend User Account" : "Re-activate User Account"}
        description={user.isActive 
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
