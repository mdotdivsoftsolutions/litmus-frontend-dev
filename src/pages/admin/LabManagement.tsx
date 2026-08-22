import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, Edit, Eye, Filter, MoreVertical, Trash2, ChevronLeft, ChevronRight, Building2, MapPin, Phone, Mail, Star, ShieldCheck, CheckCircle2, DollarSign, ExternalLink, Copy, Check, Briefcase, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/currency";

const ITEMS_PER_PAGE = 10;
import { adminApi } from "@/lib/api/admin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkImportDrawer } from "@/components/admin/BulkImportDrawer";

export default function LabManagement() {
  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);
  const [labToToggle, setLabToToggle] = useState<{lab: any, targetState: boolean} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const queryClient = useQueryClient();

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteLab(id),
    onSuccess: () => {
      toast.success("Laboratory deleted successfully");
      setLabToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
    },
    onError: () => {
      toast.error("Failed to delete laboratory");
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updateLab(id, { isActive }),
    onSuccess: () => {
      toast.success("Laboratory visibility updated");
      setLabToToggle(null);
      queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
    },
    onError: () => {
      toast.error("Failed to update laboratory visibility");
    }
  });
  
  const { data: labsData, isLoading } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => adminApi.getBookings(),
  });

  const labs = (labsData?.data || []).slice().sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  const allBookings = bookingsData?.data || [];
  const filtered = labs.filter((l: any) => !search || l.labName?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedLabs = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laboratory Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage partner diagnostic facilities, accreditations, catalog testing capabilities, and facility visibility.
          </p>
        </div>
      </div>

      {/* Single-Line Top Controls: Search + Filters + Bulk Import + Add New Lab */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search labs by name, city..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }} 
            />
          </div>

          {/* Filter Drawer */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4" />Filters
            </Button>
            <SheetContent>
              <SheetHeader><SheetTitle>Filter Laboratories</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">City</label><Input placeholder="Filter by city..." className="bg-white border border-slate-200 shadow-sm" /></div>
                <div className="space-y-2 flex items-center justify-between"><label className="text-sm font-medium">NABL Accredited Only</label><Switch /></div>
                <div className="space-y-2 flex items-center justify-between"><label className="text-sm font-medium">FSSAI Approved Only</label><Switch /></div>
                <div className="flex gap-2 pt-4"><Button className="flex-1 bg-primary hover:bg-primary/90 text-white">Apply</Button><Button variant="outline" className="flex-1">Clear</Button></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Bulk Import Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsBulkImportOpen(true)}
            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-sm h-10 px-3.5 gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Bulk Import (Excel)
          </Button>

          {/* Primary Styled Add New Lab Button */}
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2">
            <Link to="/admin/laboratories/new">
              <Plus className="h-4 w-4" /> Add New Lab
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Import Drawer */}
      <BulkImportDrawer
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        entityType="laboratories"
        title="Bulk Import Laboratories"
        description="Upload an Excel sheet to bulk register partner laboratories, set credentials, accreditations, and facility details."
        templateFileName="4_Litmus_Laboratories_Bulk_Template.xlsx"
        templateDisplayName="4_Litmus_Laboratories_Bulk_Template.xlsx"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
        }}
      />

      <Card className="border border-border shadow-sm overflow-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Lab Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Accreditation</TableHead>
              <TableHead>Tests</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-12 rounded-full" /><Skeleton className="h-5 w-12 rounded-full" /></div></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No laboratories found.</TableCell></TableRow>
            ) : paginatedLabs.map((lab: any) => {
              const labBookings = allBookings.filter((b: any) => b.labId?._id === lab._id || b.labId === lab._id || b.laboratory?._id === lab._id || b.laboratory === lab._id);
              const totalRevenue = labBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
              
              return (
              <TableRow key={lab._id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{lab.labName}</TableCell>
                <TableCell>{lab.location?.city || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {lab.isNablAccredited ? <Badge variant="nabl" className="bg-green-700 hover:bg-green-800 text-white border-transparent">NABL</Badge> : "—"}
                    {lab.isFssaiApproved ? <Badge variant="fssai" className="bg-emerald-700 hover:bg-emerald-800 text-white border-transparent">FSSAI</Badge> : null}
                  </div>
                </TableCell>
                <TableCell>{lab.tests?.length || "—"}</TableCell>
                <TableCell>{labBookings.length > 0 ? labBookings.length : "—"}</TableCell>
                <TableCell>{totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : "—"}</TableCell>
                <TableCell>
                  <Switch 
                    checked={lab.isActive} 
                    onCheckedChange={(checked) => setLabToToggle({ lab, targetState: checked })} 
                    disabled={toggleStatusMutation.isPending} 
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLab(lab)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/laboratories/${lab._id}/edit`} className="w-full flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Lab</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setLabToDelete(lab._id)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </Card>

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between border border-border px-4 py-3 bg-muted/20 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> laboratories
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2">
              Page {currentPage} of {Math.max(1, totalPages)}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lab Detail Sheet */}
      <Sheet open={!!selectedLab} onOpenChange={(open) => !open && setSelectedLab(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg w-full p-0 bg-white overflow-hidden">
          {selectedLab && (
            <>
              {/* Sheet Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/70 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary-deep text-white font-bold flex items-center justify-center shadow-sm shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {selectedLab.labName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {selectedLab.location?.city ? `${selectedLab.location.city}, ${selectedLab.location.state || "India"}` : "Location not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className={selectedLab.isActive 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold" 
                      : "bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-semibold"
                    }
                  >
                    <span className={`h-1.5 w-1.5 rounded-full mr-1 ${selectedLab.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {selectedLab.isActive ? "Operational" : "Disabled"}
                  </Badge>
                  {selectedLab.isNablAccredited && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> NABL
                    </Badge>
                  )}
                  {selectedLab.isFssaiApproved && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-medium">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> FSSAI
                    </Badge>
                  )}
                </div>
              </div>

              {/* Sheet Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Quality Rating</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      {selectedLab.reviews && selectedLab.reviews.length > 0 
                        ? (selectedLab.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / selectedLab.reviews.length).toFixed(1) 
                        : "4.9"}
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Available Tests</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedLab.tests?.length || 0} configured</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Conducted</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedLab.testsConducted !== undefined ? `${selectedLab.testsConducted}+` : "0+"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Starting Price</p>
                    <p className="text-lg font-bold text-emerald-600 mt-0.5">
                      {selectedLab.tests && selectedLab.tests.length > 0 
                        ? formatCurrency(Math.min(...selectedLab.tests.map((t: any) => t.offerPrice || t.price || 0)))
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Available Tests List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Configured Catalog Tests</h4>
                    <span className="text-[10px] text-muted-foreground">{selectedLab.tests?.length || 0} items</span>
                  </div>

                  {selectedLab.tests && selectedLab.tests.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/40 max-h-48 overflow-y-auto">
                      {selectedLab.tests.map((test: any) => {
                        const price = test.offerPrice || test.price || 0;
                        const customOverride = selectedLab.pricing?.testOverrides?.[test._id];

                        return (
                          <div key={test._id} className="flex items-center justify-between px-3.5 py-2.5 text-xs bg-white hover:bg-slate-50 transition-colors">
                            <span className="font-medium text-slate-800 truncate max-w-[220px]" title={test.testName || test.name}>
                              {test.testName || test.name}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {customOverride !== undefined ? (
                                <span className="font-bold text-emerald-600">{formatCurrency(customOverride)}</span>
                              ) : (
                                <span className="font-semibold text-slate-700">{formatCurrency(price)}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground border border-dashed rounded-xl bg-slate-50">
                      No tests attached to this laboratory yet.
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Contact & Address</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-slate-800 font-medium truncate">{selectedLab.contactEmail || "No email"}</span>
                      </div>
                      {selectedLab.contactEmail && (
                        <button onClick={() => copyToClipboard(selectedLab.contactEmail, "Email")} className="text-slate-400 hover:text-slate-700 shrink-0">
                          {copiedField === "Email" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-800 font-medium">{selectedLab.contactPhone || "No phone"}</span>
                      </div>
                      {selectedLab.contactPhone && (
                        <button onClick={() => copyToClipboard(selectedLab.contactPhone, "Phone")} className="text-slate-400 hover:text-slate-700 shrink-0">
                          {copiedField === "Phone" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>

                    {selectedLab.location?.address && (
                      <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Address</p>
                        <p className="mt-0.5 font-medium">{selectedLab.location.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sheet Footer Action */}
              <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white border border-slate-200 shadow-sm text-xs h-10"
                  asChild
                >
                  <Link to={`/admin/laboratories/${selectedLab._id}/edit`}>
                    <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Lab
                  </Link>
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm text-xs h-10"
                  asChild
                >
                  <Link to={`/admin/laboratories/${selectedLab._id}`}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Full Profile
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog 
        open={!!labToDelete}
        onOpenChange={(open) => !open && setLabToDelete(null)}
        title="Delete Laboratory"
        description="Are you sure you want to delete this laboratory? Past bookings will still retain the lab details (soft delete)."
        onConfirm={() => labToDelete && deleteMutation.mutate(labToDelete)}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog 
        open={!!labToToggle}
        onOpenChange={(open) => !open && setLabToToggle(null)}
        title={labToToggle?.targetState ? "Enable Public Visibility" : "Disable Public Visibility"}
        description={labToToggle?.targetState 
          ? `Are you sure you want to make ${labToToggle?.lab.labName} visible to the public? Users will be able to search and book tests for this laboratory.`
          : `Are you sure you want to hide ${labToToggle?.lab.labName} from the public? Users will no longer be able to find or book new tests for this laboratory.`
        }
        onConfirm={() => labToToggle && toggleStatusMutation.mutate({ id: labToToggle.lab._id, isActive: labToToggle.targetState })}
        confirmText={labToToggle?.targetState ? "Make Visible" : "Hide Laboratory"}
        variant={labToToggle?.targetState ? "default" : "destructive"}
      />
    </div>
  );
}
