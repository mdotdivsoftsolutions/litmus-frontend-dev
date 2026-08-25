import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Search, 
  Filter, 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Upload, 
  Edit3, 
  ShieldCheck, 
  Lightbulb, 
  HelpCircle, 
  Loader2, 
  PlusCircle, 
  ExternalLink 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { uploadApi } from "@/lib/api/uploadApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminReports() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newReportFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Edit / Remarks state in Review Dialog
  const [editSummary, setEditSummary] = useState("");
  const [editRecs, setEditRecs] = useState("");
  const [editTips, setEditTips] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editFiles, setEditFiles] = useState<string[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Manual Upload Report for Any Booking Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetBookingId, setTargetBookingId] = useState("");
  const [newUploadedFileUrl, setNewUploadedFileUrl] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newRecs, setNewRecs] = useState("");
  const [newTips, setNewTips] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newIsUploading, setNewIsUploading] = useState(false);
  const [newUploadProgress, setNewUploadProgress] = useState(0);
  const [autoApprove, setAutoApprove] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminReports"],
    queryFn: () => adminApi.getBookings(),
  });

  const rawBookings = response?.data || [];
  
  const hasReport = (b: any) => 
    (Array.isArray(b.reportFiles) && b.reportFiles.length > 0) || 
    Boolean(b.reportUrl) || 
    Boolean(b.metadata?.reportUrl) ||
    Boolean(b.reportSummary?.summary);

  // Bookings with reports
  const reportsBookings = rawBookings.filter(hasReport);

  // Bookings without reports (eligible for manual admin report upload)
  const bookingsWithoutReports = rawBookings.filter((b: any) => !hasReport(b));

  const mappedReports = reportsBookings.map((b: any) => {
    const files = Array.isArray(b.reportFiles) && b.reportFiles.length > 0
      ? b.reportFiles
      : b.reportUrl
        ? [b.reportUrl]
        : b.metadata?.reportUrl
          ? [b.metadata.reportUrl]
          : [];

    return {
      id: b._id,
      bookingId: `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`,
      user: `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || 'Unknown User',
      product: b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || b.items?.[0]?.testId?.name || "Service Item",
      lab: b.labId?.labName || "Litmus Assigned Lab",
      amount: b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0,
      tests: b.items?.flatMap((item: any) => item.samples?.[0]?.selectedParameters || [item.packageId?.name || item.testId?.name || "Service Item"]) || [],
      reportFiles: files,
      reportSummary: b.reportSummary || {},
      isReportApprovedByAdmin: b.isReportApprovedByAdmin,
      status: b.isReportApprovedByAdmin ? "Verified" : "Pending Verification",
      uploadDate: format(new Date(b.metadata?.reportSubmittedAt || b.updatedAt || b.createdAt), "MMM d, yyyy"),
      rawDate: new Date(b.metadata?.reportSubmittedAt || b.updatedAt || b.createdAt),
      rawBooking: b,
    };
  }).sort((a: any, b: any) => b.rawDate.getTime() - a.rawDate.getTime());

  // Sync edit state when a report is selected
  useEffect(() => {
    if (selectedReport) {
      setEditSummary(selectedReport.reportSummary?.summary || "");
      setEditRecs(selectedReport.reportSummary?.recommendations || "");
      setEditTips(selectedReport.reportSummary?.tips || "");
      setEditNotes(selectedReport.reportSummary?.additionalNotes || "");
      setEditFiles(selectedReport.reportFiles || []);
      setRejectionReason("");
    }
  }, [selectedReport]);

  const filteredReports = mappedReports.filter((r: any) => {
    const matchesSearch = !search || 
      r.bookingId.toLowerCase().includes(search.toLowerCase()) || 
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.lab.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && !isBefore(r.rawDate, startOfDay(new Date(startDate)));
    if (endDate) matchesDate = matchesDate && !isAfter(r.rawDate, endOfDay(new Date(endDate)));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Mutations
  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => adminApi.approveReport(id, data),
    onSuccess: () => {
      toast.success("Report verified, updated, and published successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedReport(null);
    },
    onError: () => toast.error("Failed to approve report")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateBookingReport(id, data),
    onSuccess: () => {
      toast.success("Report and remarks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedReport(null);
    },
    onError: () => toast.error("Failed to update report")
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectReport(id, reason),
    onSuccess: () => {
      toast.success("Report rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedReport(null);
      setRejectionReason("");
    },
    onError: () => toast.error("Failed to reject report")
  });

  const createReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateBookingReport(id, data),
    onSuccess: () => {
      toast.success("New report successfully attached to booking!");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setIsUploadModalOpen(false);
      // Reset form
      setTargetBookingId("");
      setNewUploadedFileUrl("");
      setNewSummary("");
      setNewRecs("");
      setNewTips("");
      setNewNotes("");
      setAutoApprove(true);
    },
    onError: () => toast.error("Failed to upload report")
  });

  // File Upload in Edit/Review Dialog
  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingFile(true);
      setUploadProgress(0);
      try {
        const res = await uploadApi.uploadFile(file, (p: any) => {
          if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total));
        });
        const url = res.data?.url || res.url || res.data || res;
        setEditFiles([url]);
        setIsUploadingFile(false);
        toast.success("New report document uploaded successfully");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to upload document");
        setIsUploadingFile(false);
      }
    }
  };

  // File Upload in Manual Upload Modal
  const handleNewFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewIsUploading(true);
      setNewUploadProgress(0);
      try {
        const res = await uploadApi.uploadFile(file, (p: any) => {
          if (p.total) setNewUploadProgress(Math.round((p.loaded * 100) / p.total));
        });
        const url = res.data?.url || res.url || res.data || res;
        setNewUploadedFileUrl(url);
        setNewIsUploading(false);
        toast.success("Document uploaded successfully");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to upload document");
        setNewIsUploading(false);
      }
    }
  };

  // Action Handlers
  const handleReject = () => {
    if (!selectedReport) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate({ id: selectedReport.id, reason: rejectionReason.trim() });
  };

  const handleSaveRemarksOnly = () => {
    if (!selectedReport) return;
    updateMutation.mutate({
      id: selectedReport.id,
      data: {
        reportFiles: editFiles,
        summary: editSummary,
        recommendations: editRecs,
        tips: editTips,
        additionalNotes: editNotes,
      },
    });
  };

  const handleSaveAndApprove = () => {
    if (!selectedReport) return;
    approveMutation.mutate({
      id: selectedReport.id,
      data: {
        reportFiles: editFiles,
        summary: editSummary,
        recommendations: editRecs,
        tips: editTips,
        additionalNotes: editNotes,
      },
    });
  };

  const handleCreateReportSubmit = () => {
    if (!targetBookingId) {
      toast.error("Please select a target booking");
      return;
    }
    if (!newUploadedFileUrl) {
      toast.error("Please upload a report document");
      return;
    }

    createReportMutation.mutate({
      id: targetBookingId,
      data: {
        reportFiles: [newUploadedFileUrl],
        summary: newSummary,
        recommendations: newRecs,
        tips: newTips,
        additionalNotes: newNotes,
        isReportApprovedByAdmin: autoApprove,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Report Verification & Management</h1>
          <p className="text-sm text-muted-foreground">Review, edit, upload, and publish certified diagnostic reports with full technical remarks.</p>
        </div>
        <Button 
          onClick={() => setIsUploadModalOpen(true)} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Upload Report for Booking
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm bg-white"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-primary">{mappedReports.filter((r: any) => r.status === "Pending Verification").length}</p><p className="text-xs text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card className="border border-border shadow-sm bg-white"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-litmus-emerald">{mappedReports.filter((r: any) => r.status === "Verified").length}</p><p className="text-xs text-muted-foreground">Verified & Published</p></CardContent></Card>
        <Card className="border border-border shadow-sm bg-white"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-foreground">{mappedReports.length}</p><p className="text-xs text-muted-foreground">Total Reports</p></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, User, Lab, Product..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-44 h-10 bg-white border border-slate-200 shadow-sm text-xs sm:text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending verification">Pending Verification</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4" />Filters
              {(statusFilter !== 'all' || startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
            </Button>
            <SheetContent className="overflow-y-auto">
              <SheetHeader><SheetTitle>Filter Reports</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending verification">Pending Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Upload Date</label>
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

      <Card className="border border-border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                     <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                     <span>No reports found matching your criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {paginatedReports.map((r: any) => (
                  <TableRow key={r.bookingId} className="hover:bg-muted/30">
                    <TableCell className="font-medium font-mono text-sm">{r.bookingId}</TableCell>
                    <TableCell>{r.user}</TableCell>
                    <TableCell>{r.product}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">{r.lab}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.uploadDate}</TableCell>
                    <TableCell><StatusBadge status={r.status === "Verified" ? "Approved" : "Pending"} /></TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-primary hover:text-primary hover:bg-primary/10" 
                        onClick={() => setSelectedReport(r)}
                      >
                        {r.isReportApprovedByAdmin ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {r.isReportApprovedByAdmin ? "Edit Report" : "Review & Edit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && filteredReports.length > 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="p-0">
                      <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                          Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)}</span> of <span className="font-medium text-foreground">{filteredReports.length}</span> reports
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <div className="text-sm font-medium px-2">Page {currentPage} of {Math.max(1, totalPages)}</div>
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-background" onClick={() => setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1))} disabled={currentPage >= totalPages}>
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

      {/* Review & Edit Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2 pr-6">
              <span>Report Review & Edit — {selectedReport?.bookingId}</span>
              <StatusBadge status={selectedReport?.status === "Verified" ? "Approved" : "Pending"} />
            </DialogTitle>
            <DialogDescription>
              Review the uploaded test certificate and edit Summary, Recommendations, Tips, and Additional Notes before or after verification.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="grid md:grid-cols-5 gap-6 mt-2">
              {/* Left Column: Document Preview & File Replacement */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4 flex flex-col items-center justify-center min-h-[260px] text-center">
                  {editFiles.length > 0 && editFiles[0].match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                    <img src={editFiles[0]} alt="Report" className="max-w-full max-h-[240px] object-contain mb-3 border border-border rounded shadow-sm" />
                  ) : (
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      <FileText className="h-8 w-8" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-foreground">Attached Report File</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                    {editFiles.length > 0 ? editFiles[0] : "No document attached"}
                  </p>

                  <div className="flex gap-2 mt-4 w-full justify-center">
                    {editFiles.length > 0 && (
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.open(editFiles[0], '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5" /> View Document
                      </Button>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleEditFileUpload} 
                      className="hidden" 
                      accept="application/pdf,image/*" 
                      disabled={isUploadingFile}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="gap-1.5 text-xs"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingFile}
                    >
                      <Upload className="h-3.5 w-3.5" /> {isUploadingFile ? "Uploading..." : "Replace File"}
                    </Button>
                  </div>

                  {isUploadingFile && (
                    <div className="w-full mt-3 space-y-1.5">
                      <Progress value={uploadProgress} className="h-1.5 w-full" />
                      <p className="text-[11px] text-muted-foreground">Uploading {uploadProgress}%</p>
                    </div>
                  )}
                </div>

                {/* Booking mini details */}
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span className="text-muted-foreground">User:</span>
                    <span className="font-medium text-foreground">{selectedReport.user}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-medium text-foreground">{selectedReport.product}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1.5">
                    <span className="text-muted-foreground">Assigned Lab:</span>
                    <span className="font-medium text-foreground">{selectedReport.lab}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold text-primary">₹{selectedReport.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rejection block if pending */}
                {!selectedReport.isReportApprovedByAdmin && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label className="text-xs font-semibold text-status-rejected flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Rejection (Send back to Lab)
                    </Label>
                    <Textarea 
                      placeholder="Reason for rejecting this report..." 
                      className="text-xs min-h-[60px]" 
                      value={rejectionReason} 
                      onChange={(e) => setRejectionReason(e.target.value)} 
                    />
                    <Button 
                      onClick={handleReject} 
                      disabled={rejectMutation.isPending} 
                      variant="outline" 
                      size="sm"
                      className="w-full gap-1.5 text-xs text-status-rejected border-status-rejected/40 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {rejectMutation.isPending ? "Rejecting..." : "Reject Report"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column: Editable Summary & Remarks */}
              <div className="md:col-span-3 space-y-4">
                <div className="space-y-3">
                  {/* 1. Summary */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" /> 1. Executive Summary
                    </Label>
                    <Textarea
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      placeholder="Summary of findings, key parameters, and safety profile..."
                      className="text-xs min-h-[75px]"
                    />
                  </div>

                  {/* 2. Recommendations */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 2. Actionable Recommendations
                    </Label>
                    <Textarea
                      value={editRecs}
                      onChange={(e) => setEditRecs(e.target.value)}
                      placeholder="Safety advice, manufacturing/packaging corrections..."
                      className="text-xs min-h-[75px]"
                    />
                  </div>

                  {/* 3. Tips */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-600" /> 3. Tips & Best Practices
                    </Label>
                    <Textarea
                      value={editTips}
                      onChange={(e) => setEditTips(e.target.value)}
                      placeholder="Storage guidelines, temperature control, shelf-life advice..."
                      className="text-xs min-h-[75px]"
                    />
                  </div>

                  {/* 4. Additional Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500" /> 4. Additional Notes & Disclaimers
                    </Label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Standard test methods (FSSAI/NABL), disclaimers..."
                      className="text-xs min-h-[70px]"
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                    Cancel
                  </Button>

                  {!selectedReport.isReportApprovedByAdmin ? (
                    <>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleSaveRemarksOnly} 
                        disabled={updateMutation.isPending || approveMutation.isPending}
                        className="text-xs"
                      >
                        {updateMutation.isPending ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveAndApprove} 
                        disabled={approveMutation.isPending || updateMutation.isPending}
                        className="bg-litmus-emerald hover:bg-emerald-600 text-white gap-1.5 text-xs shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {approveMutation.isPending ? "Verifying & Publishing..." : "Save & Approve Report"}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={handleSaveRemarksOnly} 
                      disabled={updateMutation.isPending}
                      className="bg-primary hover:bg-primary-deep text-white gap-1.5 text-xs shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {updateMutation.isPending ? "Updating..." : "Update Report & Remarks"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual Upload Report for Any Booking Side Drawer */}
      <Sheet open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[540px] p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl">
          <SheetHeader className="px-5 py-4 border-b border-border bg-muted/10 shrink-0 text-left">
            <SheetTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Upload className="h-4 w-4 text-primary" /> Upload Report on Behalf of Lab / Admin
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-0.5">
              Directly attach a test report document and add Summary, Recommendations, Tips, and Notes to any active order.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Booking Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Target Booking</Label>
              <Select value={targetBookingId} onValueChange={setTargetBookingId}>
                <SelectTrigger className="h-9 bg-background border-border text-xs">
                  <SelectValue placeholder="Choose a booking..." />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {bookingsWithoutReports.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground text-center">No bookings waiting for report upload</div>
                  ) : (
                    bookingsWithoutReports.map((b: any) => {
                      const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
                      const userName = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || 'User';
                      const product = b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || b.items?.[0]?.testId?.name || "Order";
                      return (
                        <SelectItem key={b._id} value={b._id} className="text-xs">
                          <span className="font-semibold text-primary">{displayId}</span> · {product} <span className="text-muted-foreground">({userName})</span>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Report Document (PDF or Image)</Label>
              <input 
                type="file" 
                ref={newReportFileInputRef} 
                onChange={handleNewFileUpload} 
                className="hidden" 
                accept="application/pdf,image/*" 
                disabled={newIsUploading}
              />
              <div 
                onClick={() => newReportFileInputRef.current?.click()}
                className={cn("border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200",
                  newUploadedFileUrl 
                    ? "border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10" 
                    : "border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/40"
                )}
              >
                {newIsUploading ? (
                  <div className="space-y-2 py-2">
                    <Loader2 className="h-7 w-7 animate-spin text-primary mx-auto" />
                    <p className="text-xs font-medium text-foreground">Uploading document...</p>
                    <p className="text-[11px] text-muted-foreground">{newUploadProgress}% completed</p>
                  </div>
                ) : newUploadedFileUrl ? (
                  <div className="space-y-1.5 py-1">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" />
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Report Document Attached</p>
                    <p className="text-xs text-muted-foreground truncate max-w-sm mx-auto">{newUploadedFileUrl}</p>
                    <p className="text-[11px] text-primary hover:underline pt-1">Click to replace file</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Click to upload report document (PDF/Image)</p>
                    <p className="text-xs text-muted-foreground">Supported: PDF, PNG, JPG (Max 50MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" /> 1. Executive Summary
              </Label>
              <Textarea 
                value={newSummary} 
                onChange={(e) => setNewSummary(e.target.value)} 
                placeholder="Key findings, overall safety observations, sample suitability..." 
                className="text-xs min-h-[75px] resize-y" 
              />
            </div>

            {/* Recommendations */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 2. Actionable Recommendations
              </Label>
              <Textarea 
                value={newRecs} 
                onChange={(e) => setNewRecs(e.target.value)} 
                placeholder="Actionable steps, storage or recipe suggestions, preventive measures..." 
                className="text-xs min-h-[75px] resize-y" 
              />
            </div>

            {/* Tips */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" /> 3. Tips & Best Practices
              </Label>
              <Textarea 
                value={newTips} 
                onChange={(e) => setNewTips(e.target.value)} 
                placeholder="Practical food handling, shelf-life, or consumption tips..." 
                className="text-xs min-h-[75px] resize-y" 
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <HelpCircle className="h-3.5 w-3.5 text-slate-500" /> 4. Additional Notes & Disclaimers
              </Label>
              <Textarea 
                value={newNotes} 
                onChange={(e) => setNewNotes(e.target.value)} 
                placeholder="Compliance references (FSSAI/NABL), test standard methods, legal disclaimers..." 
                className="text-xs min-h-[70px] resize-y" 
              />
            </div>

            {/* Auto-approve checkbox */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 flex items-start gap-2.5">
              <input 
                type="checkbox" 
                id="auto-approve-chk" 
                checked={autoApprove} 
                onChange={(e) => setAutoApprove(e.target.checked)} 
                className="rounded border-border mt-0.5 h-4 w-4 text-primary focus:ring-primary"
              />
              <Label htmlFor="auto-approve-chk" className="text-xs cursor-pointer font-medium leading-relaxed text-foreground">
                Publish and mark as Verified immediately (notifies user via email and updates order status to Completed)
              </Label>
            </div>
          </div>

          <SheetFooter className="p-4 bg-muted/30 border-t border-border flex items-center justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleCreateReportSubmit} 
              disabled={createReportMutation.isPending || newIsUploading || !targetBookingId || !newUploadedFileUrl}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" /> Upload & Save Report
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
