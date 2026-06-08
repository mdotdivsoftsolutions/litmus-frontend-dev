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
import { Plus, Search, Edit, Trash2, Filter, AlertTriangle, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { testApi } from "@/lib/api/test";

const ITEMS_PER_PAGE = 10;

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const tests = testsData?.data || [];
  
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
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
        <Button className="gap-2 bg-primary hover:bg-primary-deep shadow-md shadow-primary/20" asChild>
          <Link to="/admin/tests/new"><Plus className="h-4 w-4" />Add Test</Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tests..." 
            className="pl-9 bg-background/50" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2 bg-background/50" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4" />Filters
            {typeFilter !== 'all' && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
          </Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Tests</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="chemical">Chemical</SelectItem>
                    <SelectItem value="microbiological">Microbiological</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary-deep" onClick={() => setShowFilters(false)}>Apply</Button>
                <Button variant="outline" className="flex-1" onClick={() => { setTypeFilter('all'); setShowFilters(false); }}>Clear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Test Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                       <span>No test protocols found matching your criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedTests.map((t: any) => (
                <TableRow key={t._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium max-w-[200px] truncate" title={t.testName}>{t.testName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.metadata?.method || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={t.metadata?.type === "chemical" ? "pending" : t.metadata?.type === "microbiological" ? "inprogress" : "outline"} className="capitalize shadow-sm">
                      {t.metadata?.type || 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {t.metadata?.parameters?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                    ₹{t.price?.toLocaleString() || 0}
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
