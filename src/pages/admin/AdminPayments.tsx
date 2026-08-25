import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore, startOfDay, endOfDay, subDays, startOfMonth } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Clock, 
  Building2, 
  Eye, 
  AlertTriangle, 
  Search, 
  Filter, 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  CreditCard,
  Receipt,
  Copy,
  Check,
  ArrowUpRight,
  ArrowRight,
  Wallet
} from "lucide-react";
import { InvoiceDialog } from "@/components/admin/InvoiceDialog";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminPayments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [invoiceBookingId, setInvoiceBookingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Active Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Draft Filters (Only applied upon clicking "Apply Filters")
  const [draftStatusFilter, setDraftStatusFilter] = useState("all");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");

  const handleOpenFilters = () => {
    setDraftStatusFilter(statusFilter);
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setShowFilters(true);
  };

  const handleApplyFilters = () => {
    setStatusFilter(draftStatusFilter);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setDraftStatusFilter("all");
    setDraftStartDate("");
    setDraftEndDate("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: adminApi.getPayments,
  });

  const rawPayments = response?.data || [];

  const mappedPayments = rawPayments.map((p: any) => ({
    id: p.transactionId || `TXN-${p._id ? p._id.substring(p._id.length - 6).toUpperCase() : 'UNKNOWN'}`,
    bookingId: p.bookingId?._id 
      ? `BKG-${p.bookingId._id.substring(p.bookingId._id.length - 6).toUpperCase()}` 
      : (p.bookingId ? `BKG-${String(p.bookingId).substring(String(p.bookingId).length - 6).toUpperCase()}` : "N/A"),
    rawBookingId: p.bookingId?._id || p.bookingId || null,
    lab: p.bookingId?.labId?.labName || "Unknown Lab",
    amount: p.amount || 0,
    gateway: p.method || "Razorpay",
    status: p.status === "SUCCESS" || p.status === "Paid" ? "Paid" : p.status === "FAILED" || p.status === "Refunded" ? "Refunded" : "Pending",
    date: format(new Date(p.createdAt || new Date()), "MMM d, yyyy, h:mm a"),
    rawDate: new Date(p.createdAt || new Date())
  }));

  const totalCollected = mappedPayments.filter((p: any) => p.status === "Paid").reduce((acc: number, p: any) => acc + p.amount, 0);
  const platformRevenue = Math.round(totalCollected * 0.15);
  const pendingToLabs = Math.round(totalCollected * 0.85);

  const summaryCards = [
    { label: "Total Collected", value: `₹${totalCollected.toLocaleString()}`, icon: DollarSign },
    { label: "Platform Revenue", value: `₹${platformRevenue.toLocaleString()}`, icon: Building2 },
    { label: "Pending to Labs", value: `₹${pendingToLabs.toLocaleString()}`, icon: Clock },
  ];

  const filtered = mappedPayments.filter((p: any) => {
    const matchesSearch = !search || 
      p.id.toLowerCase().includes(search.toLowerCase()) || 
      p.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      p.lab.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && !isBefore(p.rawDate, startOfDay(new Date(startDate)));
    if (endDate) matchesDate = matchesDate && !isAfter(p.rawDate, endOfDay(new Date(endDate)));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPayments = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderPaymentTable = (items: any[]) => (
    <Card className="border border-border shadow-sm overflow-hidden bg-white min-h-[360px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Transaction ID</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead className="hidden md:table-cell">Lab</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Platform Fee</TableHead>
            <TableHead className="hidden md:table-cell">Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                   <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                   <span>No payments found matching your criteria.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {items.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedPayment(p)}>
                  <TableCell className="font-medium font-mono text-sm">{p.id}</TableCell>
                  <TableCell className="font-mono text-sm">{p.bookingId}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-[150px]" title={p.lab}>{p.lab}</TableCell>
                  <TableCell className="font-medium">₹{p.amount.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">₹{Math.round(p.amount * 0.15).toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell capitalize">{p.gateway}</TableCell>
                  <TableCell><StatusBadge status={p.status === "Paid" ? "Approved" : p.status === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={(e) => { e.stopPropagation(); setSelectedPayment(p); }}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                      {p.rawBookingId && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs gap-1 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 text-emerald-700 shadow-2xs"
                          onClick={(e) => { e.stopPropagation(); setInvoiceBookingId(p.rawBookingId); }}
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-600" /> Invoice
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && items.length > 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={9} className="p-0">
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> payments
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
    <div className="space-y-6 animate-fade-in mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment & Settlement</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage customer transactions, gateway payment statuses, refunds, and lab commission payouts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow duration-150 relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                  <c.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                  Live
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{c.value}</p>
                <p className="text-xs font-medium text-slate-600">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" value={statusFilter === "all" ? "all" : statusFilter.toLowerCase()} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList className="bg-white border border-slate-200 shadow-sm p-1 self-start lg:self-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending Settlement</TabsTrigger>
            <TabsTrigger value="paid">Completed</TabsTrigger>
            <TabsTrigger value="refunded">Refunds</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by TXN, Booking ID..." 
                className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
                value={search} 
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
              />
            </div>
            <Sheet open={showFilters} onOpenChange={(open) => {
              if (open) handleOpenFilters();
              else setShowFilters(false);
            }}>
              <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={handleOpenFilters}>
                <Filter className="h-4 w-4 text-slate-500" />
                <span>Filters</span>
                {(statusFilter !== 'all' || startDate || endDate) && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white dark:bg-card border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
                <SheetHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-card shrink-0 text-left">
                  <div className="flex items-center justify-between pr-8">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      <span className="font-bold text-base text-slate-900 dark:text-white">Filter Transactions</span>
                      {(statusFilter !== 'all' || startDate || endDate) && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Active
                        </span>
                      )}
                    </div>
                    {(draftStatusFilter !== 'all' || draftStartDate || draftEndDate || statusFilter !== 'all' || startDate || endDate) && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-primary font-medium"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                  <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                    Filter records by payment settlement status or creation date range.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* 1. Payment Status Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Payment Settlement Status
                    </label>
                    <Select value={draftStatusFilter} onValueChange={setDraftStatusFilter}>
                      <SelectTrigger className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 h-10 text-xs shadow-2xs">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                        <SelectItem value="paid" className="text-xs">Paid / Completed</SelectItem>
                        <SelectItem value="pending" className="text-xs">Pending Settlement</SelectItem>
                        <SelectItem value="refunded" className="text-xs">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Date Range Filter */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Date Range
                    </label>

                    {/* Quick Date Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Today", getRange: () => ({ s: format(new Date(), 'yyyy-MM-dd'), e: format(new Date(), 'yyyy-MM-dd') }) },
                        { label: "Last 7 Days", getRange: () => ({ s: format(subDays(new Date(), 7), 'yyyy-MM-dd'), e: format(new Date(), 'yyyy-MM-dd') }) },
                        { label: "Last 30 Days", getRange: () => ({ s: format(subDays(new Date(), 30), 'yyyy-MM-dd'), e: format(new Date(), 'yyyy-MM-dd') }) },
                        { label: "This Month", getRange: () => ({ s: format(startOfMonth(new Date()), 'yyyy-MM-dd'), e: format(new Date(), 'yyyy-MM-dd') }) },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const { s, e } = preset.getRange();
                            setDraftStartDate(s);
                            setDraftEndDate(e);
                          }}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-3.5 space-y-3 shadow-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">From Date</span>
                        <Input 
                          type="date" 
                          value={draftStartDate} 
                          onChange={(e) => setDraftStartDate(e.target.value)} 
                          className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 h-9 text-xs" 
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">To Date</span>
                        <Input 
                          type="date" 
                          value={draftEndDate} 
                          onChange={(e) => setDraftEndDate(e.target.value)} 
                          className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 h-9 text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer */}
                <SheetFooter className="p-4 bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs font-semibold h-9 border-slate-200" 
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground h-9 shadow-xs" 
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="mt-4">
          {renderPaymentTable(paginatedPayments)}
        </div>
      </Tabs>

      {/* Payment Detail Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[480px] p-0 flex flex-col h-full bg-white dark:bg-card border-l border-slate-200 dark:border-slate-800 shadow-2xl font-sans">
          {selectedPayment && (
            <>
              <SheetHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-card shrink-0 text-left">
                <div className="flex items-center justify-between gap-3 pr-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-primary" />
                      <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                        Transaction Details
                      </span>
                      <StatusBadge status={selectedPayment.status === "Paid" ? "Approved" : selectedPayment.status === "Refunded" ? "Rejected" : "Pending"} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recorded on {selectedPayment.date}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* 1. Financial Hero Banner */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Transaction Amount</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Payment Gateway</span>
                    <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 inline-block">
                      {selectedPayment.gateway}
                    </span>
                  </div>
                </div>

                {/* 2. Identifiers & Metadata */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-primary" /> Transaction Identifiers
                  </h4>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-4 space-y-2.5 shadow-xs text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <div className="flex items-center gap-1 font-mono font-medium text-slate-900 dark:text-white">
                        <span>{selectedPayment.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedPayment.id, 'txId')}
                          className="text-muted-foreground hover:text-foreground p-0.5"
                          title="Copy Transaction ID"
                        >
                          {copiedField === 'txId' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-muted-foreground">Associated Booking:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-primary">{selectedPayment.bookingId}</span>
                        {selectedPayment.rawBookingId && (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/bookings/${selectedPayment.rawBookingId}`)}
                            className="text-primary hover:underline inline-flex items-center gap-0.5 text-[11px] font-medium"
                          >
                            <span>View</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-muted-foreground">Laboratory Partner:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedPayment.lab}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-muted-foreground">Processed Date & Time:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedPayment.date}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Settlement Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-primary" /> Settlement & Commission
                  </h4>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-4 space-y-2.5 shadow-xs text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Gross Order Amount</span>
                      <span className="font-semibold text-slate-900 dark:text-white">₹{selectedPayment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <span>Platform Commission</span>
                        <span className="text-[10px] text-muted-foreground">(15%)</span>
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">- ₹{Math.round(selectedPayment.amount * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Net Lab Payout</span>
                        <span className="text-[10px] text-muted-foreground">Payable to laboratory</span>
                      </div>
                      <span className="font-black text-base text-primary">₹{Math.round(selectedPayment.amount * 0.85).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer with Brand Aligned Buttons */}
              <SheetFooter className="p-4 bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
                {selectedPayment.rawBookingId ? (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 text-xs font-semibold border-slate-200 text-slate-700 hover:text-primary hover:border-primary/40 shadow-2xs h-9"
                    onClick={() => setInvoiceBookingId(selectedPayment.rawBookingId)}
                  >
                    <FileText className="h-4 w-4 text-primary" /> View Invoice
                  </Button>
                ) : (
                  <div />
                )}
                {selectedPayment.rawBookingId && (
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs h-9"
                    onClick={() => navigate(`/admin/bookings/${selectedPayment.rawBookingId}`)}
                  >
                    <span>Open Booking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
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
