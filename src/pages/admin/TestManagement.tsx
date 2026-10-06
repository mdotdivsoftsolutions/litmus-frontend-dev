import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TestDetailSheet } from "@/components/admin/catalog/TestDetailSheet";
import { AlphabetFilterBar } from "@/components/admin/catalog/AlphabetFilterBar";
import { DisplayOrderCell } from "@/components/admin/catalog/DisplayOrderCell";
import { DisplayOrderDrawer } from "@/components/admin/catalog/DisplayOrderDrawer";
import { useDebounce } from "@/hooks/use-debounce";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit, Trash2, Filter, AlertTriangle, MoreVertical, ChevronLeft, ChevronRight, Eye, Beaker, FileSpreadsheet, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { testApi } from "@/lib/api/test";
import { BulkImportDrawer } from "@/components/admin/BulkImportDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "priority", label: "Display priority" },
  { value: "name_asc", label: "Name (A → Z)" },
  { value: "name_desc", label: "Name (Z → A)" },
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price (low → high)" },
  { value: "price_desc", label: "Price (high → low)" },
];

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [sort, setSort] = useState("name_asc");
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search.trim(), 350);

  // Server-side filtering & pagination keeps the page fast for large catalogs.
  const filterParams = {
    search: debouncedSearch || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  };
  const listParams = { ...filterParams, startsWith: letter || undefined, sort, page: currentPage, limit: ITEMS_PER_PAGE };

  const { data: testsData, isLoading, isFetching } = useQuery({
    queryKey: ["adminTests", "list", listParams],
    queryFn: () => testApi.getTests(listParams),
    placeholderData: keepPreviousData,
  });

  const { data: letterCounts } = useQuery({
    queryKey: ["adminTests", "letters", filterParams],
    queryFn: async () => (await testApi.getLetterCounts(filterParams)).data as Record<string, number>,
    staleTime: 30 * 1000,
  });

  const resetPage = () => setCurrentPage(1);

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

  const bulkDeleteMutation = useMutation({
    mutationFn: testApi.bulkDeleteTests,
    onSuccess: () => {
      toast.success(`${selectedIds.length} test(s) deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["adminTests"] });
      setSelectedIds([]);
      setIsBulkDeleteConfirmOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete selected tests");
      setIsBulkDeleteConfirmOpen(false);
    }
  });

  const paginatedTests: any[] = testsData?.data || [];
  const totalTests: number = testsData?.total ?? 0;
  const totalPages: number = testsData?.pages ?? 1;

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage master food test catalog, methodologies, standard pricing, and parameter specifications.
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
                resetPage();
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
                  <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); resetPage(); }}>
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
                  <Button variant="outline" className="flex-1" onClick={() => { setTypeFilter("all"); resetPage(); setShowFilters(false); }}>Clear</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select value={sort} onValueChange={(v) => { setSort(v); resetPage(); }}>
            <SelectTrigger className="w-[170px] bg-white border border-slate-200 shadow-sm h-10 text-xs" aria-label="Sort tests">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          {/* Display Order (Excel) */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOrderDrawerOpen(true)}
            className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-sm h-10 px-3.5 gap-2"
          >
            <ListOrdered className="h-4 w-4 text-primary" />
            Display Order
          </Button>

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

      <DisplayOrderDrawer
        entity="tests"
        open={isOrderDrawerOpen}
        onOpenChange={setIsOrderDrawerOpen}
        invalidateKeys={["adminTests"]}
      />

      {/* A–Z quick filter */}
      <AlphabetFilterBar
        value={letter}
        counts={letterCounts}
        onChange={(next) => { setLetter(next); resetPage(); }}
      />

      <Card className={cn("border border-border shadow-sm overflow-hidden bg-white transition-opacity", isFetching && !isLoading && "opacity-70")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={
                      paginatedTests.length > 0 &&
                      paginatedTests.every((t: any) => selectedIds.includes(t._id))
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const pageIds = paginatedTests.map((t: any) => t._id);
                        setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
                      } else {
                        const pageIds = new Set(paginatedTests.map((t: any) => t._id));
                        setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
                      }
                    }}
                    aria-label="Select all tests on this page"
                  />
                </TableHead>
                <TableHead className="w-24" title="Storefront priority: 1 is shown first">Priority</TableHead>
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
                    <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto bg-muted/60" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 bg-muted/60" /></TableCell>
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
              ) : paginatedTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                       <span>No test protocols found matching your criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedTests.map((t: any) => (
                <TableRow key={t._id} className={cn("hover:bg-muted/30 transition-colors", selectedIds.includes(t._id) && "bg-primary/5")}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(t._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds((prev) => [...prev, t._id]);
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => id !== t._id));
                        }
                      }}
                      aria-label={`Select ${t.testName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <DisplayOrderCell entity="tests" id={t._id} value={t.displayOrder} invalidateKeys={["adminTests"]} />
                  </TableCell>
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

        {!isLoading && totalTests > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, totalTests)}</span> of <span className="font-medium text-foreground">{totalTests}</span> tests
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

      <TestDetailSheet test={selectedTest} onClose={() => setSelectedTest(null)} />

      <ConfirmDialog 
        open={!!testToDelete}
        onOpenChange={(open) => !open && setTestToDelete(null)}
        title="Delete Test Protocol"
        description="Are you sure you want to delete this test protocol? It will no longer appear in the catalog."
        onConfirm={() => {
          if (testToDelete) {
            deleteMutation.mutate(testToDelete);
            setTestToDelete(null);
          }
        }}
        confirmText="Delete"
        variant="destructive"
      />

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700 text-xs font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
              {selectedIds.length}
            </span>
            <span>selected</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds([])}
            className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Deselect All
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
            className="h-8 text-xs font-medium gap-1.5 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        open={isBulkDeleteConfirmOpen}
        onOpenChange={setIsBulkDeleteConfirmOpen}
        title={`Delete ${selectedIds.length} Tests?`}
        description={`Are you sure you want to delete these ${selectedIds.length} selected tests? They will no longer appear in the active catalog.`}
        confirmText="Delete Selected"
        variant="destructive"
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
      />
    </div>
  );
}
