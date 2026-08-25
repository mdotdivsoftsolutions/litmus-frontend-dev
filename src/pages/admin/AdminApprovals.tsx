import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, FileText, TestTubes, Package, Eye, ExternalLink, Download, Clock, ShieldCheck, User, Building2, AlertCircle, Sparkles } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AdminApprovals() {
  const [rejectingItem, setRejectingItem] = useState<{ id: string, type: 'test' | 'package' | 'report', title?: string } | null>(null);
  const [reviewingReport, setReviewingReport] = useState<any | null>(null);

  // Reviewing report edit state
  const [reportSummary, setReportSummary] = useState("");
  const [reportRecommendations, setReportRecommendations] = useState("");
  const [reportTips, setReportTips] = useState("");
  const [reportNotes, setReportNotes] = useState("");

  const queryClient = useQueryClient();

  const { data: approvalsData, isLoading } = useQuery({
    queryKey: ["adminApprovals"],
    queryFn: adminApi.getPendingApprovals,
  });

  const pendingTests = approvalsData?.data?.tests || [];
  const pendingPackages = approvalsData?.data?.packages || [];
  const pendingReports = approvalsData?.data?.reports || [];

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["adminApprovals"] });
    queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
  };

  // Test Mutations
  const approveTestMutation = useMutation({
    mutationFn: adminApi.approveTest,
    onSuccess: () => {
      toast.success("Test approved successfully");
      invalidateAll();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to approve test")
  });

  const rejectTestMutation = useMutation({
    mutationFn: (data: { id: string, reason: string }) => adminApi.rejectTest(data.id, data.reason),
    onSuccess: () => {
      toast.success("Test rejected");
      invalidateAll();
      setRejectingItem(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to reject test")
  });

  // Package Mutations
  const approvePackageMutation = useMutation({
    mutationFn: adminApi.approvePackage,
    onSuccess: () => {
      toast.success("Package approved successfully");
      invalidateAll();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to approve package")
  });

  const rejectPackageMutation = useMutation({
    mutationFn: (data: { id: string, reason: string }) => adminApi.rejectPackage(data.id, data.reason),
    onSuccess: () => {
      toast.success("Package rejected");
      invalidateAll();
      setRejectingItem(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to reject package")
  });

  // Report Mutations
  const approveReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => adminApi.approveReport(id, data),
    onSuccess: () => {
      toast.success("Test report approved, verified, and published to customer!");
      invalidateAll();
      setReviewingReport(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to approve report")
  });

  const rejectReportMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectReport(id, reason),
    onSuccess: () => {
      toast.success("Report rejected and returned to laboratory");
      invalidateAll();
      setRejectingItem(null);
      setReviewingReport(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to reject report")
  });

  const handleOpenReview = (report: any) => {
    setReviewingReport(report);
    setReportSummary(report.reportSummary?.summary || "");
    setReportRecommendations(report.reportSummary?.recommendations || "");
    setReportTips(report.reportSummary?.tips || "");
    setReportNotes(report.reportSummary?.additionalNotes || "");
  };

  const handleApproveWithRemarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingReport) return;
    approveReportMutation.mutate({
      id: reviewingReport._id,
      data: {
        summary: reportSummary,
        recommendations: reportRecommendations,
        tips: reportTips,
        additionalNotes: reportNotes,
      }
    });
  };

  const handleReject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;

    if (!rejectingItem) return;

    if (rejectingItem.type === 'test') {
      rejectTestMutation.mutate({ id: rejectingItem.id, reason });
    } else if (rejectingItem.type === 'package') {
      rejectPackageMutation.mutate({ id: rejectingItem.id, reason });
    } else if (rejectingItem.type === 'report') {
      rejectReportMutation.mutate({ id: rejectingItem.id, reason });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review and authorize laboratory-submitted test reports, custom tests, and bundled health packages.
          </p>
        </div>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="bg-white border border-slate-200 shadow-sm p-1 inline-flex w-full sm:w-auto h-auto flex-wrap gap-1 mb-4">
          <TabsTrigger value="reports" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all gap-2">
            <FileText className="h-4 w-4" /> Test Reports ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all gap-2">
            <TestTubes className="h-4 w-4" /> Tests ({pendingTests.length})
          </TabsTrigger>
          <TabsTrigger value="packages" className="text-xs px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-md transition-all gap-2">
            <Package className="h-4 w-4" /> Packages ({pendingPackages.length})
          </TabsTrigger>
        </TabsList>

        {/* ---------------- REPORTS TAB ---------------- */}
        <TabsContent value="reports">
          <Card className="border border-border shadow-sm overflow-hidden bg-white min-h-[300px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product / Test</TableHead>
                    <TableHead>Laboratory</TableHead>
                    <TableHead>Report File(s)</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : pendingReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle className="h-10 w-10 text-emerald-500/50" />
                          <span className="font-semibold text-slate-800">All caught up!</span>
                          <span className="text-xs text-slate-500">No lab test reports currently pending admin approval.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pendingReports.map((r: any) => {
                    const displayId = `BKG-${r._id.substring(r._id.length - 6).toUpperCase()}`;
                    const customerName = `${r.userId?.firstName || ''} ${r.userId?.lastName || ''}`.trim() || 'Unknown User';
                    const productName = r.items?.[0]?.samples?.[0]?.productName || r.items?.[0]?.packageId?.name || r.items?.[0]?.testId?.name || "Service Item";
                    const labName = r.labId?.labName || "Partner Laboratory";
                    const files: string[] = Array.isArray(r.reportFiles) && r.reportFiles.length > 0 
                      ? r.reportFiles 
                      : r.reportUrl ? [r.reportUrl] : [];
                    const submittedDate = r.metadata?.reportSubmittedAt || r.updatedAt || r.createdAt;

                    return (
                      <TableRow key={r._id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-mono font-semibold text-xs text-slate-900">
                          {displayId}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-slate-900">{customerName}</span>
                            <span className="text-[11px] text-muted-foreground">{r.userId?.email || r.userId?.phone || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-xs text-slate-800 line-clamp-1 max-w-[200px]" title={productName}>
                            {productName}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">
                          {labName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {files.length > 0 ? (
                              files.map((fileUrl, idx) => (
                                <a 
                                  key={idx} 
                                  href={fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  <FileText className="h-3 w-3" />
                                  Doc {idx + 1}
                                  <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                                </a>
                              ))
                            ) : (
                              <span className="text-[11px] text-amber-600 font-medium">Text remarks only</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {format(new Date(submittedDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 gap-1"
                              onClick={() => handleOpenReview(r)}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              Review
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2 text-xs font-semibold text-destructive border-red-200 hover:bg-red-50 hover:text-destructive"
                              onClick={() => setRejectingItem({ id: r._id, type: 'report', title: `${displayId} - ${productName}` })}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 px-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                              onClick={() => approveReportMutation.mutate({ id: r._id })}
                              disabled={approveReportMutation.isPending}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- TESTS TAB ---------------- */}
        <TabsContent value="tests">
          <Card className="border border-border shadow-sm overflow-hidden bg-white min-h-[300px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Test Name</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Offer Price (₹)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : pendingTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle className="h-10 w-10 text-emerald-500/50" />
                          <span className="font-semibold text-slate-800">All caught up!</span>
                          <span className="text-xs text-slate-500">No pending tests to review.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pendingTests.map((t: any) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium text-xs">{t.testName}</TableCell>
                      <TableCell className="text-xs">{t.labId?.labName || 'Unknown Lab'}</TableCell>
                      <TableCell className="font-medium text-xs">₹{t.price?.toLocaleString() || 0}</TableCell>
                      <TableCell className="font-medium text-xs text-emerald-600">
                        {t.offerPrice ? `₹${t.offerPrice.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:bg-destructive/10"
                                  onClick={() => setRejectingItem({ id: t._id, type: 'test', title: t.testName })}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => approveTestMutation.mutate(t._id)}
                                  disabled={approveTestMutation.isPending}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- PACKAGES TAB ---------------- */}
        <TabsContent value="packages">
          <Card className="border border-border shadow-sm overflow-hidden bg-white min-h-[300px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Package Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Original (₹)</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : pendingPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle className="h-10 w-10 text-emerald-500/50" />
                          <span className="font-semibold text-slate-800">All caught up!</span>
                          <span className="text-xs text-slate-500">No pending packages to review.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pendingPackages.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-medium text-xs">{p.name}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize text-[11px]">{p.category}</Badge></TableCell>
                      <TableCell className="font-medium text-xs text-slate-400 line-through">₹{p.mrp?.toLocaleString() || 0}</TableCell>
                      <TableCell className="font-medium text-xs text-emerald-600">₹{p.price?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:bg-destructive/10"
                                  onClick={() => setRejectingItem({ id: p._id, type: 'package', title: p.name })}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={() => approvePackageMutation.mutate(p._id)}
                                  disabled={approvePackageMutation.isPending}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---------------- REPORT REVIEW & APPROVE DRAWER (SHEET) ---------------- */}
      <Sheet open={!!reviewingReport} onOpenChange={(open) => !open && setReviewingReport(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-xl p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <SheetTitle className="text-base font-bold text-slate-900">
                  Review & Authorize Report
                </SheetTitle>
                <SheetDescription className="text-xs mt-0.5">
                  BKG-{reviewingReport?._id?.substring(reviewingReport._id.length - 6).toUpperCase()} · {reviewingReport?.userId?.firstName} {reviewingReport?.userId?.lastName}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {reviewingReport && (
            <form onSubmit={handleApproveWithRemarks} className="space-y-4 mt-4 pb-12">
              {/* Report Summary Info */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 block text-[11px]">Product / Test</span>
                  <span className="font-semibold text-slate-900 line-clamp-1">
                    {reviewingReport.items?.[0]?.samples?.[0]?.productName || reviewingReport.items?.[0]?.packageId?.name || reviewingReport.items?.[0]?.testId?.name || "Diagnostic Service"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Laboratory</span>
                  <span className="font-semibold text-slate-900 line-clamp-1">
                    {reviewingReport.labId?.labName || "Partner Lab"}
                  </span>
                </div>
              </div>

              {/* Document Download / View section */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-lg">
                <p className="text-xs font-bold text-blue-950 mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-700" />
                  Attached Laboratory Document(s):
                </p>
                <div className="flex flex-wrap gap-2">
                  {(reviewingReport.reportFiles || (reviewingReport.reportUrl ? [reviewingReport.reportUrl] : [])).map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-blue-200 text-xs font-bold text-blue-900 hover:bg-blue-100 hover:border-blue-300 shadow-2xs transition-all"
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      Open Document {idx + 1}
                      <ExternalLink className="h-3 w-3 text-blue-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Remarks Form */}
              <div className="space-y-3.5">
                <div>
                  <Label htmlFor="repSummary" className="text-xs font-semibold text-slate-800">
                    Clinical / Diagnostic Summary
                  </Label>
                  <Textarea
                    id="repSummary"
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    placeholder="High level overview of laboratory results for the customer..."
                    rows={3}
                    className="text-xs mt-1 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="repRecs" className="text-xs font-semibold text-slate-800">
                    Recommendations & Next Steps
                  </Label>
                  <Textarea
                    id="repRecs"
                    value={reportRecommendations}
                    onChange={(e) => setReportRecommendations(e.target.value)}
                    placeholder="Doctor recommendations or dietary guidance..."
                    rows={2}
                    className="text-xs mt-1 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="repTips" className="text-xs font-semibold text-slate-800">
                    Wellness Tips
                  </Label>
                  <Textarea
                    id="repTips"
                    value={reportTips}
                    onChange={(e) => setReportTips(e.target.value)}
                    placeholder="Lifestyle / hydration tips..."
                    rows={2}
                    className="text-xs mt-1 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="repNotes" className="text-xs font-semibold text-slate-800">
                    Internal Admin Notes
                  </Label>
                  <Textarea
                    id="repNotes"
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Notes for internal medical team..."
                    rows={2}
                    className="text-xs mt-1 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto text-destructive hover:bg-red-50 text-xs border-red-200 h-9 font-semibold"
                  onClick={() => {
                    setRejectingItem({
                      id: reviewingReport._id,
                      type: 'report',
                      title: `BKG-${reviewingReport._id.substring(reviewingReport._id.length - 6).toUpperCase()}`
                    });
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1 text-destructive" />
                  Reject Report
                </Button>

                <div className="flex w-full sm:w-auto gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setReviewingReport(null)} className="flex-1 sm:flex-initial text-xs h-9">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 h-9 px-4 shadow-sm"
                    disabled={approveReportMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Verify & Publish
                  </Button>
                </div>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* ---------------- REJECT DIALOG ---------------- */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejectingItem?.type === 'test' ? 'Test' : rejectingItem?.type === 'package' ? 'Package' : 'Test Report'}
            </DialogTitle>
            {rejectingItem?.title && (
              <DialogDescription className="text-xs font-medium text-slate-600">
                {rejectingItem.title}
              </DialogDescription>
            )}
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-semibold">Reason for Rejection</Label>
              <Textarea 
                id="reason" 
                name="reason" 
                placeholder="Please provide the specific reason so the laboratory can rectify and re-submit..." 
                rows={4} 
                className="text-xs"
                required 
              />
            </div>
            <div className="pt-4 border-t border-border mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectingItem(null)} className="text-xs">Cancel</Button>
              <Button 
                type="submit" 
                variant="destructive" 
                size="sm"
                className="text-xs"
                disabled={rejectTestMutation.isPending || rejectPackageMutation.isPending || rejectReportMutation.isPending}
              >
                Reject & Send Back
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
