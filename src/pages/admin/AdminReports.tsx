import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Eye, CheckCircle2, XCircle, FileText, Search, Filter, CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function AdminReports() {
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Filters
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminReports"],
    queryFn: adminApi.getBookings,
  });

  // Extract bookings that have reports uploaded
  const rawBookings = response?.data || [];
  const reportsBookings = rawBookings.filter((b: any) => b.reportFiles && b.reportFiles.length > 0);

  const mappedReports = reportsBookings.map((b: any) => ({
    id: b._id,
    bookingId: `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`,
    user: `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim(),
    product: b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || b.items?.[0]?.testId?.name || "Service Item",
    lab: b.labId?.labName || "Unknown Lab",
    amount: b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0,
    tests: b.items?.flatMap((item: any) => item.samples?.[0]?.selectedParameters || [item.packageId?.name || item.testId?.name || "Service Item"]) || [],
    reportFiles: b.reportFiles || [],
    isReportApprovedByAdmin: b.isReportApprovedByAdmin,
    status: b.isReportApprovedByAdmin ? "Verified" : "Pending Verification",
    uploadDate: format(new Date(b.updatedAt || b.createdAt), "MMM d, yyyy"),
    rawDate: new Date(b.updatedAt || b.createdAt)
  }));

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

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveReport(id),
    onSuccess: () => {
      toast.success("Report verified and approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      setSelectedReport(null);
    },
    onError: () => toast.error("Failed to approve report")
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => adminApi.rejectReport(id, reason),
    onSuccess: () => {
      toast.success("Report rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      setSelectedReport(null);
      setRejectionReason("");
    },
    onError: () => toast.error("Failed to reject report")
  });

  const handleApprove = (id: string) => approveMutation.mutate(id);
  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    rejectMutation.mutate({ id, reason: rejectionReason });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-foreground">Report Verification</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-primary">{mappedReports.filter((r: any) => r.status === "Pending Verification").length}</p><p className="text-xs text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-litmus-emerald">{mappedReports.filter((r: any) => r.status === "Verified").length}</p><p className="text-xs text-muted-foreground">Verified</p></CardContent></Card>
        <Card className="border border-border shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-semibold text-foreground">{mappedReports.length}</p><p className="text-xs text-muted-foreground">Total Reports</p></CardContent></Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by ID, User, Lab, Product..." 
            className="pl-9 bg-background/50" 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
          />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2 bg-background/50" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4" />Filters
            {(statusFilter !== 'all' || startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
          </Button>
          <SheetContent className="overflow-y-auto">
            <SheetHeader><SheetTitle>Filter Reports</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
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

      <Card className="border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
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
                    <TableCell>
                      <Dialog open={selectedReport?.id === r.id} onOpenChange={(open) => !open && setSelectedReport(null)}>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedReport(r)}><Eye className="h-3.5 w-3.5" />Review</Button></DialogTrigger>
                        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Report Review — {r.bookingId}</DialogTitle></DialogHeader>
                          <div className="grid md:grid-cols-5 gap-6 mt-4">
                            {/* PDF Preview */}
                            <div className="md:col-span-3 rounded-lg border border-border bg-muted/30 p-8 flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px]">
                              {r.reportFiles.length > 0 && r.reportFiles[0].match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                <img src={r.reportFiles[0]} alt="Report" className="max-w-full max-h-[400px] object-contain mb-4 border border-border rounded shadow-sm" />
                              ) : (
                                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                              )}
                              <p className="text-sm font-medium text-foreground">Report Document</p>
                              <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open(r.reportFiles[0], '_blank')}>Open Document</Button>
                            </div>
                            {/* Report details */}
                            <div className="md:col-span-2 space-y-4">
                              <div className="space-y-2 text-sm grid grid-cols-2 gap-2">
                                <div className="rounded-lg border border-border bg-muted/20 p-3 break-all col-span-2 sm:col-span-1"><p className="text-muted-foreground text-xs mb-1">Booking</p><p className="font-mono font-medium text-xs">{r.bookingId}</p></div>
                                <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2 sm:col-span-1"><p className="text-muted-foreground text-xs mb-1">User</p><p className="font-medium text-sm">{r.user}</p></div>
                                <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Product</p><p className="font-medium text-sm">{r.product}</p></div>
                                <div className="rounded-lg border border-border bg-muted/20 p-3 col-span-2"><p className="text-muted-foreground text-xs mb-1">Lab</p><p className="font-medium text-sm">{r.lab}</p></div>
                                <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Amount</p><p className="font-medium text-sm">₹{r.amount.toLocaleString()}</p></div>
                                <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Uploaded</p><p className="font-medium text-sm">{r.uploadDate}</p></div>
                              </div>

                              <div className="rounded-lg border border-border p-4 bg-card shadow-sm">
                                <p className="text-sm font-semibold mb-3 border-b border-border pb-2">Tests Included ({r.tests.length})</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {r.tests.map((t: string, i: number) => <Badge key={i} variant="outline" className="text-xs bg-muted/50">{t}</Badge>)}
                                </div>
                              </div>

                              {!r.isReportApprovedByAdmin && (
                                <>
                                  <div className="space-y-2 pt-2">
                                    <p className="text-sm font-semibold">Rejection Reason</p>
                                    <Textarea placeholder="Enter reason if rejecting..." className="min-h-[80px]" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button onClick={() => handleApprove(r.id)} disabled={approveMutation.isPending} className="flex-1 gap-1 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-sm"><CheckCircle2 className="h-4 w-4" />{approveMutation.isPending ? "Verifying..." : "Verify"}</Button>
                                    <Button onClick={() => handleReject(r.id)} disabled={rejectMutation.isPending} variant="outline" className="flex-1 gap-1 text-status-rejected border-status-rejected/50 hover:bg-red-50"><XCircle className="h-4 w-4" />{rejectMutation.isPending ? "Rejecting..." : "Reject"}</Button>
                                  </div>
                                </>
                              )}
                              {r.isReportApprovedByAdmin && (
                                <div className="p-3 bg-litmus-emerald/10 border border-litmus-emerald/20 rounded-lg text-center">
                                  <p className="text-sm font-medium text-litmus-emerald">This report has been verified and published.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
    </div>
  );
}
