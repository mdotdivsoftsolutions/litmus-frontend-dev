import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { consultationApi } from "@/lib/api/consultation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Loader2, 
  CheckCircle, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  User, 
  MessageSquare, 
  Eye, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Building,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function AdminConsultations() {
  const queryClient = useQueryClient();
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminConsultations", statusFilter, sourceFilter, search, startDate, endDate, currentPage],
    queryFn: () => consultationApi.getConsultations({
      status: statusFilter === "all" ? undefined : statusFilter,
      source: sourceFilter === "all" ? undefined : sourceFilter,
      search: search.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
  });

  const consultations = response?.data?.data || [];
  const totalCount = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const availableSources: string[] = response?.data?.sources || ["General", "Home Hero"];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => consultationApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Consultation status updated.");
      queryClient.invalidateQueries({ queryKey: ["adminConsultations"] });
      if (selectedConsultation) {
        setSelectedConsultation((prev: any) => prev ? { ...prev, status: selectedConsultation.status } : null);
      }
    },
    onError: () => {
      toast.error("Failed to update status.");
    },
  });

  const clearFilters = () => {
    setStatusFilter("all");
    setSourceFilter("all");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  const hasActiveFilters = statusFilter !== "all" || sourceFilter !== "all" || Boolean(startDate) || Boolean(endDate) || Boolean(search);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 font-medium">
            Pending
          </Badge>
        );
      case "Contacted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 font-medium">
            Contacted
          </Badge>
        );
      case "Resolved":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 font-medium">
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceBadge = (source: string) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        {source || "General"}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Consultation Requests</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage incoming advisory requests, schedule meetings, and update lead outreach status.
          </p>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground gap-1 self-start sm:self-auto">
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </Button>
        )}
      </div>

      {/* Top Filter Bar in a clean single line */}
      <Tabs 
        value={statusFilter} 
        onValueChange={(val) => { 
          setStatusFilter(val); 
          setCurrentPage(1); 
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <TabsList className="bg-white border border-slate-200 shadow-sm p-1 self-start lg:self-auto">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="Contacted">Contacted</TabsTrigger>
            <TabsTrigger value="Resolved">Resolved</TabsTrigger>
          </TabsList>

          {/* Controls: Source Select + Search Input + Filters Button */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Source Filter Dropdown */}
            <div className="w-36 sm:w-44">
              <Select 
                value={sourceFilter} 
                onValueChange={(val) => { 
                  setSourceFilter(val); 
                  setCurrentPage(1); 
                }}
              >
                <SelectTrigger className="h-10 bg-white border border-slate-200 shadow-sm text-xs">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {availableSources.map((src) => (
                    <SelectItem key={src} value={src}>{src}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Name, Email, Phone, Service..."
                className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Date Range & Detailed Filter Sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <Button 
                variant="outline" 
                className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" 
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" /> Date & Filters
                {(startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
              </Button>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-lg">Filter Consultations</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Status Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Consultation Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Source Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Request Source</label>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {availableSources.map((src) => (
                          <SelectItem key={src} value={src}>{src}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" /> Submitted Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">From</span>
                        <Input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)} 
                          className="bg-white border border-slate-200 shadow-sm text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">To</span>
                        <Input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)} 
                          className="bg-white border border-slate-200 shadow-sm text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90" 
                      onClick={() => { 
                        setShowFilters(false); 
                        setCurrentPage(1); 
                      }}
                    >
                      Apply Filters
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Tabs>

      {/* Consultations Table */}
      <Card className="border border-border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 bg-muted/60" />
                      <Skeleton className="h-3 w-16 bg-muted/60" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 bg-muted/60" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-24 bg-muted/60" />
                        <Skeleton className="h-3 w-20 bg-muted/60" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-40 bg-muted/60" />
                      <Skeleton className="h-3 w-32 bg-muted/60" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full bg-muted/60" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full bg-muted/60" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md bg-muted/60" /></TableCell>
                </TableRow>
              ))
            ) : consultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                    <span className="font-medium">No consultation requests found.</span>
                    {hasActiveFilters && (
                      <Button variant="link" size="sm" onClick={clearFilters} className="text-xs text-primary">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              consultations.map((consultation: any) => (
                <TableRow 
                  key={consultation._id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  {/* Date Column */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {consultation.createdAt ? format(new Date(consultation.createdAt), "MMM d, yyyy") : "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {consultation.createdAt ? format(new Date(consultation.createdAt), "h:mm a") : ""}
                      </span>
                    </div>
                  </TableCell>

                  {/* Contact Column */}
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{consultation.name}</span>
                        {consultation.business && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            {consultation.business}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <a 
                          href={`mailto:${consultation.email}`} 
                          onClick={(e) => e.stopPropagation()} 
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Mail className="h-3 w-3" /> {consultation.email}
                        </a>
                        <a 
                          href={`tel:${consultation.phone}`} 
                          onClick={(e) => e.stopPropagation()} 
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Phone className="h-3 w-3" /> {consultation.phone}
                        </a>
                      </div>
                    </div>
                  </TableCell>

                  {/* Service Column */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">{consultation.serviceName}</span>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>Requested for: {consultation.date} at {consultation.time}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Source Column */}
                  <TableCell>
                    {getSourceBadge(consultation.source)}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    {getStatusBadge(consultation.status)}
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedConsultation(consultation)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Pending" })}>
                          <MessageSquare className="mr-2 h-4 w-4 text-amber-500" /> Mark Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Contacted" })}>
                          <Phone className="mr-2 h-4 w-4 text-blue-500" /> Mark Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Resolved" })}>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Mark Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {!isLoading && consultations.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
              <span className="font-medium text-foreground">{totalCount}</span> consultation requests
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-background" 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-xs sm:text-sm font-medium px-2">
                Page {currentPage} of {Math.max(1, totalPages)}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-background" 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Consultation Details Sheet / Drawer */}
      <Sheet open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto p-6 flex flex-col justify-between bg-white">
          {selectedConsultation && (
            <div className="flex flex-col h-full space-y-6">
              {/* Drawer Top Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <User className="h-4 w-4 text-primary" />
                  <span>Consultation Details</span>
                </div>

                <div className="flex items-start justify-between gap-2 pt-1 border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-bold text-foreground">{selectedConsultation.name}</h2>
                    <p className="text-xs text-muted-foreground">{selectedConsultation.business || "General Consultation"}</p>
                  </div>
                  {getStatusBadge(selectedConsultation.status)}
                </div>
              </div>

              {/* Drawer Key-Value Details */}
              <div className="space-y-4 text-xs flex-1">
                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Service</span>
                  <span className="col-span-2 font-semibold text-foreground">{selectedConsultation.serviceName}</span>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Requested For</span>
                  <span className="col-span-2 text-slate-800 flex items-center gap-1.5 font-medium">
                    <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {selectedConsultation.date} at {selectedConsultation.time}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Email</span>
                  <a 
                    href={`mailto:${selectedConsultation.email}`} 
                    className="col-span-2 text-primary flex items-center gap-1.5 hover:underline truncate"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{selectedConsultation.email}</span>
                  </a>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Phone</span>
                  <a 
                    href={`tel:${selectedConsultation.phone}`} 
                    className="col-span-2 text-slate-800 flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{selectedConsultation.phone}</span>
                  </a>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Source</span>
                  <div className="col-span-2">
                    {getSourceBadge(selectedConsultation.source)}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground font-medium">Submitted On</span>
                  <span className="col-span-2 text-slate-600">
                    {selectedConsultation.createdAt ? format(new Date(selectedConsultation.createdAt), "MMM d, yyyy · h:mm a") : "N/A"}
                  </span>
                </div>

                {/* Customer Remarks Box */}
                <div className="pt-2">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                      Customer Message / Notes
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {selectedConsultation.message || "No notes provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions & Status Changer */}
              <div className="pt-4 border-t border-slate-100 space-y-3 mt-auto">
                {/* Communication Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    className="gap-2 h-9 text-xs border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs font-medium"
                    onClick={() => window.open(`mailto:${selectedConsultation.email}`, "_blank")}
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-500" /> Email Client
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2 h-9 text-xs border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs font-medium"
                    onClick={() => window.open(`tel:${selectedConsultation.phone}`, "_self")}
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-500" /> Call Client
                  </Button>
                </div>

                {/* Status Switcher Button Group */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Update Lead Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 text-xs font-semibold transition-all",
                        selectedConsultation.status === "Pending"
                          ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-2xs"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      )}
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Pending" })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Pending
                    </Button>
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 text-xs font-semibold transition-all",
                        selectedConsultation.status === "Contacted"
                          ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-2xs"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      )}
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Contacted" })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Contacted
                    </Button>
                    <Button 
                      type="button"
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 text-xs font-semibold transition-all",
                        selectedConsultation.status === "Resolved"
                          ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-2xs"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      )}
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Resolved" })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Resolved
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
