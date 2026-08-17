import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Clock, Building2, Eye, AlertTriangle, Search, Filter, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: adminApi.getPayments,
  });

  const rawPayments = response?.data || [];

  const mappedPayments = rawPayments.map((p: any) => ({
    id: p.transactionId || `TXN-${p._id.substring(p._id.length - 6).toUpperCase()}`,
    bookingId: p.bookingId?._id ? `BKG-${p.bookingId._id.substring(p.bookingId._id.length - 6).toUpperCase()}` : "N/A",
    lab: p.bookingId?.labId?.labName || "Unknown Lab",
    amount: p.amount || 0,
    gateway: p.method || "Razorpay",
    status: p.status === "SUCCESS" ? "Paid" : p.status === "FAILED" ? "Refunded" : "Pending",
    date: format(new Date(p.createdAt || new Date()), "MMM d, yyyy, h:mm a"),
    rawDate: new Date(p.createdAt || new Date())
  })).sort((a: any, b: any) => b.rawDate.getTime() - a.rawDate.getTime());

  const totalCollected = mappedPayments.filter((p: any) => p.status === "Paid").reduce((acc: number, p: any) => acc + p.amount, 0);
  const platformRevenue = Math.round(totalCollected * 0.15); // Assume 15% platform fee
  const pendingToLabs = Math.round(totalCollected * 0.85); // Pending payout roughly

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

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  const renderPaymentTable = (items: any[]) => (
    <Card className="border border-border shadow-sm overflow-hidden bg-white">
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
                  <TableCell><Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); setSelectedPayment(p); }}><Eye className="h-3.5 w-3.5" />View</Button></TableCell>
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

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border border-border shadow-sm relative overflow-hidden bg-white">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="flex items-center gap-4 p-5 pl-5">
              <div className="h-10 w-10 rounded-full bg-flame-red-tint flex items-center justify-center"><c.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">{c.label}</p><p className="text-2xl font-semibold">{c.value}</p></div>
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
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={() => setShowFilters(true)}>
                <Filter className="h-4 w-4" />Filters
                {(statusFilter !== 'all' || startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
              </Button>
              <SheetContent className="overflow-y-auto">
                <SheetHeader><SheetTitle>Filter Payments</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
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
          {renderPaymentTable(paginatedPayments)}
        </div>
      </Tabs>

      {/* Payment Detail Sheet */}
      <Sheet open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-[90vw]">
          {selectedPayment && (
            <>
              <SheetHeader><SheetTitle>Transaction Details</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 pb-10">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 break-all"><p className="text-muted-foreground text-xs mb-1">Transaction ID</p><p className="font-mono font-medium text-xs">{selectedPayment.id}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 break-all"><p className="text-muted-foreground text-xs mb-1">Booking ID</p><p className="font-mono font-medium text-xs">{selectedPayment.bookingId}</p></div>
                  <div className="col-span-2 rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Lab</p><p className="font-medium text-sm">{selectedPayment.lab}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-medium text-xs">{selectedPayment.date}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Gateway</p><p className="font-medium capitalize">{selectedPayment.gateway}</p></div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-muted-foreground text-xs mb-1">Status</p><StatusBadge status={selectedPayment.status === "Paid" ? "Approved" : selectedPayment.status === "Refunded" ? "Rejected" : "Pending"} /></div>
                </div>
                <div className="rounded-lg border border-border p-5 space-y-4 mt-2 bg-card shadow-sm">
                  <h4 className="font-semibold text-sm">Amount Breakdown</h4>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Amount</span><span className="font-medium">₹{selectedPayment.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee (15%)</span><span className="font-medium text-destructive">- ₹{Math.round(selectedPayment.amount * 0.15).toLocaleString()}</span></div>
                  <div className="border-t border-border pt-3 mt-2 flex justify-between text-base"><span className="font-semibold">Lab Payout</span><span className="font-bold text-primary">₹{Math.round(selectedPayment.amount * 0.85).toLocaleString()}</span></div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-background shadow-sm">Download Receipt</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
