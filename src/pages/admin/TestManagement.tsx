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
import { Plus, Search, Edit, Trash2, Filter, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { testApi } from "@/lib/api/test";

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this test protocol? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const tests = testsData?.data || [];
  
  const filtered = tests.filter((t: any) => {
    const matchesSearch = !search || t.testName?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.metadata?.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
          <Input placeholder="Search tests..." className="pl-9 bg-background/50" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <label className="text-sm font-medium">Test Category</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
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
                <TableHead>Category</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                       <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                       <span>Loading tests...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                       <span>No test protocols found matching your criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.map((t: any) => (
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
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                        <Link to={`/admin/tests/${t._id}/edit`}><Edit className="h-3.5 w-3.5" />Edit</Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => handleDelete(t._id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
