import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit, Trash2, Filter, AlertTriangle, MoreVertical, ChevronLeft, ChevronRight, Eye, Tag, Beaker, FileText, CheckCircle2, IndianRupee, FileSpreadsheet, Clock, Sparkles, Layers, FolderTree } from "lucide-react";
import { toast } from "sonner";
import { testApi } from "@/lib/api/test";
import { BulkImportDrawer } from "@/components/admin/BulkImportDrawer";

const ITEMS_PER_PAGE = 10;

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: testsData, isLoading } = useQuery({
    queryKey: ["adminTests"],
    queryFn: testApi.getTests,
  });

  const deleteMutation = useMutation({
    mutationFn: testApi.deleteTest,
    onSuccess: () => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminTests"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete test");
    }
  });

  const tests = (testsData?.data || []).slice().sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  
  const filtered = tests.filter((t: any) => {
    const matchesSearch = !search || t.testName?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.metadata?.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTests = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage master diagnostic test catalog, methodologies, standard pricing, and parameter specifications.
          </p>
        </div>
      </div>

      {/* Single-Line Controls: Search + Filters + Bulk Import + Add Test Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search tests by name, method..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }} 
            />
          </div>

          {/* Filters Sheet */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <Button variant="outline" className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4" />Filters
              {typeFilter !== 'all' && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
            </Button>
            <SheetContent>
              <SheetHeader><SheetTitle>Filter Tests</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Test Discipline / Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white border border-slate-200 shadow-sm"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="nutritional">Nutritional</SelectItem>
                      <SelectItem value="chemical">Chemical</SelectItem>
                      <SelectItem value="microbiological">Microbiological</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white" onClick={() => setShowFilters(false)}>Apply</Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setTypeFilter("all"); setShowFilters(false); }}>Clear</Button>
                </div>
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

          {/* Primary Styled Add Test Button */}
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2">
            <Link to="/admin/tests/new">
              <Plus className="h-4 w-4" /> Add Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Import Drawer */}
      <BulkImportDrawer
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        entityType="tests"
        title="Bulk Import Tests & Protocols"
        description="Upload an Excel sheet to bulk create new tests, configure parameter thresholds, and calculate pricing automatically."
        templateFileName="2_Litmus_Tests_Bulk_Template.xlsx"
        templateDisplayName="2_Litmus_Tests_Bulk_Template.xlsx"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["adminTests"] });
        }}
      />

      <Card className="border border-border shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Test Name</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Category / Subcategory</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Offer Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32 bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8 rounded-full bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-muted/60" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md bg-muted/60" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                       <span>No test protocols found matching your criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedTests.map((t: any) => (
                <TableRow key={t._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {t.imageUrl || t.icon ? (
                        <img
                          src={t.imageUrl || t.icon}
                          alt={t.testName}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                          <Beaker className="h-5 w-5" />
                        </div>
                      )}
                      <span className="font-semibold max-w-[190px] truncate text-slate-900" title={t.testName}>
                        {t.testName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={t.creatorType === 'LAB' ? "secondary" : "default"} className="w-fit text-[10px]">
                        {t.creatorType === 'LAB' ? "Personalized" : "Platform"}
                      </Badge>
                      {t.creatorType === 'LAB' && t.labId && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={t.labId.labName}>
                          {t.labId.labName}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Category & Subcategory Column */}
                  <TableCell>
                    <div className="flex flex-col gap-1 max-w-[180px]">
                      {t.isApplicableToAll ? (
                        <span className="inline-flex items-center text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-fit">
                          All Categories
                        </span>
                      ) : t.applicableCategories && t.applicableCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {t.applicableCategories.map((c: any, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded"
                            >
                              {typeof c === 'string' ? c : c.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">General</span>
                      )}

                      {/* Applicable Subcategories */}
                      {t.applicableSubcategories && t.applicableSubcategories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {t.applicableSubcategories.map((sub: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200"
                            >
                              ↳ {sub}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Test Discipline / Type */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize text-[11px] font-semibold px-2 py-0.5 shadow-2xs ${
                        t.metadata?.type?.toLowerCase() === "chemical"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : t.metadata?.type?.toLowerCase() === "microbiological"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : t.metadata?.type?.toLowerCase() === "nutritional"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {t.metadata?.type || 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[130px] truncate" title={t.metadata?.method}>
                    {t.metadata?.method || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {t.metadata?.parameters?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{t.price?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {t.offerPrice ? `₹${t.offerPrice.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTest(t)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/tests/${t._id}/edit`} className="w-full flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Test</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setTestToDelete(t._id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> tests
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {Math.max(1, totalPages)}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Redesigned Test Detail Sheet */}
      <Sheet open={!!selectedTest} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg w-full p-0 bg-white">
          {selectedTest && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border bg-slate-50/70">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl border border-slate-200/90 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {selectedTest.imageUrl || selectedTest.icon ? (
                      <img
                        src={selectedTest.imageUrl || selectedTest.icon}
                        alt={selectedTest.testName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Beaker className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={selectedTest.creatorType === 'LAB' ? "secondary" : "default"} className="text-[10px] h-5">
                        {selectedTest.creatorType === 'LAB' ? "Personalized (Lab)" : "Platform (Admin)"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`capitalize text-[10px] font-bold px-2 h-5 ${
                          selectedTest.metadata?.type?.toLowerCase() === "chemical"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : selectedTest.metadata?.type?.toLowerCase() === "microbiological"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : selectedTest.metadata?.type?.toLowerCase() === "nutritional"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {selectedTest.metadata?.type || 'Standard'}
                      </Badge>
                      {selectedTest.isPopular && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] h-5">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <SheetTitle className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                      {selectedTest.testName}
                    </SheetTitle>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 1. Category & Subcategory Card */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <FolderTree className="h-3.5 w-3.5 text-primary" />
                    <span>Category & Subcategory Mapping</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {selectedTest.isApplicableToAll ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        <Layers className="h-3.5 w-3.5 text-slate-500" />
                        Applicable to All Categories
                      </span>
                    ) : selectedTest.applicableCategories && selectedTest.applicableCategories.length > 0 ? (
                      selectedTest.applicableCategories.map((c: any, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          {typeof c === 'string' ? c : c.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">General Category</span>
                    )}

                    {selectedTest.applicableSubcategories && selectedTest.applicableSubcategories.length > 0 && (
                      selectedTest.applicableSubcategories.map((sub: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-xs font-medium text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          ↳ {sub}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Pricing Overview Card */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <p className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-slate-400" /> Base Price
                    </p>
                    <p className="font-extrabold text-xl text-slate-900">
                      ₹{selectedTest.price?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-2xs">
                    <p className="text-emerald-700 text-xs font-medium mb-1 flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-emerald-600" /> Offer Price
                    </p>
                    <p className="font-extrabold text-xl text-emerald-600">
                      {selectedTest.offerPrice ? `₹${selectedTest.offerPrice.toLocaleString()}` : "Standard Rate"}
                    </p>
                  </div>
                </div>

                {/* 3. Details & Metadata Specifications */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Test Specifications
                  </h4>
                  <div className="rounded-xl border border-slate-200/80 bg-white divide-y divide-slate-100 overflow-hidden shadow-2xs text-xs">
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-500 font-medium">Classification</span>
                      <span className="font-bold text-slate-900 capitalize">{selectedTest.metadata?.type || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-500 font-medium">FSSAI / Reference Method</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] max-w-[240px] truncate" title={selectedTest.metadata?.method}>
                        {selectedTest.metadata?.method || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-500 font-medium">Turn Around Time (TAT)</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {selectedTest.turnAroundTime || '24-48 Hours'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Description */}
                {selectedTest.description && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Description & Scope
                    </h4>
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {selectedTest.description}
                    </div>
                  </div>
                )}

                {/* 5. Parameters Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Beaker className="h-3.5 w-3.5 text-primary" />
                      Parameters ({selectedTest.metadata?.parameters?.length || 0})
                    </h4>
                  </div>

                  {selectedTest.metadata?.parameters?.length > 0 ? (
                    <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200/80">
                          <tr>
                            <th className="px-3.5 py-2.5">Parameter</th>
                            <th className="px-3.5 py-2.5">Unit</th>
                            <th className="px-3.5 py-2.5">Acceptable Limit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedTest.metadata.parameters.map((p: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-3.5 py-2.5 font-bold text-slate-800">{p.name}</td>
                              <td className="px-3.5 py-2.5 text-slate-600">{p.unit || '-'}</td>
                              <td className="px-3.5 py-2.5 font-mono text-slate-700">{p.acceptableLimit || p.maxLimit || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center rounded-xl border border-border border-dashed text-xs text-muted-foreground">
                      No parameters defined.
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 border-t border-border bg-white shadow-lg flex items-center justify-between gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedTest(null)}
                  className="border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs h-10 px-4"
                >
                  Close
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-10 text-xs sm:text-sm gap-2 shadow-sm" asChild>
                  <Link to={`/admin/tests/${selectedTest._id}/edit`}>
                    <Edit className="h-4 w-4" /> Edit Test Protocol
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog 
        open={!!testToDelete}
        onOpenChange={(open) => !open && setTestToDelete(null)}
        title="Delete Test Protocol"
        description="Are you sure you want to delete this test protocol? This action cannot be undone."
        onConfirm={() => {
          if (testToDelete) {
            deleteMutation.mutate(testToDelete);
            setTestToDelete(null);
          }
        }}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
