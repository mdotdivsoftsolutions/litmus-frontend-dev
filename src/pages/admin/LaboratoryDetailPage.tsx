import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { 
  ArrowLeft, Building2, MapPin, Phone, Mail, FileText, 
  CheckCircle2, ShieldCheck, Banknote, CreditCard, Activity, 
  Briefcase, Zap, ExternalLink, Edit, Search, AlertTriangle, 
  DollarSign, Check, Copy, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/currency";
import { toast } from "sonner";

export default function LaboratoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testSearch, setTestSearch] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: labData, isLoading: isLabLoading } = useQuery({
    queryKey: ["admin-lab", id],
    queryFn: () => adminApi.getLabById(id!),
    enabled: !!id,
  });

  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminApi.getBookings(),
  });

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLabLoading) {
    return (
      <div className="space-y-6 animate-fade-in mx-auto pb-20 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
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

        <Skeleton className="h-[450px] rounded-xl bg-white border border-slate-200" />
      </div>
    );
  }

  const lab = labData?.data;

  if (!lab) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4 text-center">
        <Building2 className="h-12 w-12 text-slate-400" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Laboratory Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">The requested diagnostic partner could not be located.</p>
        </div>
        <Button onClick={() => navigate("/admin/laboratories")} className="bg-primary hover:bg-primary/90 text-white">
          Back to Laboratory Directory
        </Button>
      </div>
    );
  }

  const allBookings = bookingsData?.data || [];
  const labBookings = allBookings.filter((b: any) => {
    const bLabId = b.labId?._id || b.labId || b.laboratory?._id || b.laboratory;
    return String(bLabId) === String(id);
  }).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  // Metrics
  const totalRevenue = labBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
  const labPayout = Math.round(totalRevenue * 0.85);
  const platformFee = Math.round(totalRevenue * 0.15);
  const activeBookingsCount = labBookings.filter((b: any) => !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(String(b.status).toUpperCase())).length;
  const completedBookingsCount = labBookings.filter((b: any) => String(b.status).toUpperCase() === 'COMPLETED').length;

  const rating = lab.reviews && lab.reviews.length > 0 
    ? (lab.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / lab.reviews.length).toFixed(1) 
    : "4.9";

  const filteredTests = (lab.tests || []).filter((t: any) => {
    const name = t.testName || t.name || "";
    return !testSearch || name.toLowerCase().includes(testSearch.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/admin/laboratories")}
            className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-deep text-white font-bold flex items-center justify-center text-lg shadow-sm shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {lab.labName}
                </h1>
                <Badge 
                  variant="outline" 
                  className={lab.isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold" 
                    : "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
                  }
                >
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${lab.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {lab.isActive ? "Operational" : "Inactive"}
                </Badge>
                {lab.isNablAccredited && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> NABL Accredited
                  </Badge>
                )}
                {lab.isFssaiApproved && (
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> FSSAI Approved
                  </Badge>
                )}
                {lab.isAutoBooking && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
                    <Zap className="h-3 w-3 mr-1" /> Auto Dispatch
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {lab.location?.city ? `${lab.location.city}, ${lab.location.state || "India"}` : "India"}
                <span className="text-slate-300">•</span>
                <span className="font-mono">ID: {lab._id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button 
            variant="outline" 
            asChild 
            className="bg-white border border-slate-200 shadow-sm text-xs h-9 gap-1.5"
          >
            <Link to={`/admin/laboratories/${lab._id}/edit`}>
              <Edit className="h-3.5 w-3.5" /> Edit Lab
            </Link>
          </Button>
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm text-xs h-9 gap-1.5"
          >
            <Link to={`/labs/${lab._id}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5" /> View Consumer Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
          <CardContent className="p-5 pl-5">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{labBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeBookingsCount} active in testing</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
          <CardContent className="p-5 pl-5">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Volume</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Est. Payout: {formatCurrency(labPayout)}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <CardContent className="p-5 pl-5">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Configured Tests</span>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{lab.tests?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Diagnostic catalog items</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
          <CardContent className="p-5 pl-5">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Quality Score</span>
              <Activity className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
              {rating} <span className="text-amber-400 text-lg">★</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{lab.reviews?.length || 0} customer reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-slate-200 shadow-sm p-1 inline-flex w-full sm:w-auto h-auto flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all">
            Overview & Details
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all">
            Available Tests ({lab.tests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all">
            Routed Bookings ({labBookings.length})
          </TabsTrigger>
          <TabsTrigger value="financials" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all">
            Settlement & Financials
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location & Contact */}
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <MapPin className="h-4 w-4 text-primary" /> Location & Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Facility Address</p>
                  <p className="font-semibold text-slate-900">{lab.location?.address || "Address not provided"}</p>
                  <p className="text-xs text-slate-600">
                    {lab.location?.city || "N/A"}, {lab.location?.state || "N/A"} - <span className="font-mono">{lab.location?.pincode || "N/A"}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </p>
                      {lab.contactEmail && (
                        <button onClick={() => copyToClipboard(lab.contactEmail, "Email")} className="text-slate-400 hover:text-slate-700">
                          {copiedField === "Email" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-900 mt-1 truncate" title={lab.contactEmail}>
                      {lab.contactEmail || "N/A"}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                      </p>
                      {lab.contactPhone && (
                        <button onClick={() => copyToClipboard(lab.contactPhone, "Phone")} className="text-slate-400 hover:text-slate-700">
                          {copiedField === "Phone" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-900 mt-1 truncate">
                      {lab.contactPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Business Details */}
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Compliance & Legal Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">GSTIN Number</p>
                    <p className="text-xs font-mono font-medium text-slate-900 mt-0.5">{lab.businessDetails?.gstNumber || "Not Provided"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">PAN Number</p>
                    <p className="text-xs font-mono font-medium text-slate-900 mt-0.5">{lab.businessDetails?.panNumber || "Not Provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">NABL Certificate</p>
                    <p className="text-xs font-mono font-medium text-slate-900 mt-0.5">{lab.licenses?.nablNumber || "Not Provided"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">FSSAI License</p>
                    <p className="text-xs font-mono font-medium text-slate-900 mt-0.5">{lab.licenses?.fssaiNumber || "Not Provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking & Settlement Card */}
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden md:col-span-2">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <Banknote className="h-4 w-4 text-primary" /> Banking & Payout Account
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Beneficiary Bank</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{lab.bankDetails?.bankName || "Not Provided"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Number</p>
                    <p className="text-sm font-mono font-semibold text-slate-900 mt-1">{lab.bankDetails?.accountNumber || "Not Provided"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">IFSC Code</p>
                    <p className="text-sm font-mono font-semibold text-slate-900 mt-1">{lab.bankDetails?.ifscCode || "Not Provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-4 mt-3">
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search available tests in this lab..." 
                  className="pl-9 bg-white border border-slate-200 shadow-sm h-9 text-xs" 
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                />
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white text-xs h-9 shadow-sm self-start sm:self-auto">
                <Link to={`/admin/laboratories/${lab._id}/edit`}>
                  <Edit className="h-3.5 w-3.5 mr-1" /> Configure Test Prices
                </Link>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Test Name</TableHead>
                    <TableHead>Category / Type</TableHead>
                    <TableHead>Standard Base Price</TableHead>
                    <TableHead>Lab Custom Override</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="h-8 w-8 text-slate-300" />
                          <span className="font-medium text-slate-800">No tests configured</span>
                          <span className="text-xs">Add tests to this laboratory to start receiving test bookings.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTests.map((test: any) => {
                      const standardPrice = test.offerPrice || test.price || 0;
                      const customPrice = lab.pricing?.testOverrides?.[test._id];

                      return (
                        <TableRow key={test._id} className="hover:bg-slate-50/60">
                          <TableCell className="font-semibold text-xs text-slate-900">
                            {test.testName || test.name}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            <Badge variant="outline" className="text-[10px] bg-slate-50">
                              {test.metadata?.type || test.category || "Standard"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">
                            {formatCurrency(standardPrice)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {customPrice !== undefined ? (
                              <span className="font-bold text-emerald-600">{formatCurrency(customPrice)}</span>
                            ) : (
                              <span className="text-slate-400">Default ({formatCurrency(standardPrice)})</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                              Active
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4 mt-3">
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product / Tests</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Briefcase className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-800">No bookings routed to this laboratory</span>
                          <span className="text-xs">When clients order tests assigned to this facility, they will appear here.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    labBookings.map((b: any) => {
                      const displayId = `BKG-${String(b._id).slice(-6).toUpperCase()}`;
                      const customerName = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.collectionDetails?.name || "Client";
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
                          <TableCell className="font-mono text-xs font-medium text-slate-900">{displayId}</TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {b.createdAt ? format(new Date(b.createdAt), "MMM d, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-800">{customerName}</TableCell>
                          <TableCell className="text-xs text-slate-700 max-w-[180px] truncate" title={itemSummary}>
                            {itemSummary}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={isPaid ? "Paid" : b.paymentStatus || "Pending"} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={b.status || "Pending"} />
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-slate-900">
                            {formatCurrency(b.totalAmount || 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 gap-1 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/bookings/${b._id}`);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" /> Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-slate-200 shadow-sm bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Bookings Volume</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-2">Cumulative value of all tests routed</p>
            </Card>

            <Card className="border border-slate-200 shadow-sm bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Litmus Platform Share (15%)</p>
              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(platformFee)}</p>
              <p className="text-xs text-muted-foreground mt-2">Platform curation & logistics commission</p>
            </Card>

            <Card className="border border-slate-200 shadow-sm bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Laboratory Payout (85%)</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(labPayout)}</p>
              <p className="text-xs text-muted-foreground mt-2">Estimated payable to diagnostic partner</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
