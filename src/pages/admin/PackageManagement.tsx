import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Edit, Trash2, AlertTriangle, MoreVertical, ChevronLeft, ChevronRight, Package as PackageIcon, Eye, IndianRupee, Tag, Info, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { packageApi } from "@/lib/api/package";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

export default function PackageManagement() {
  const [search, setSearch] = useState("");
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: packagesData, isLoading } = useQuery({
    queryKey: ["adminPackages"],
    queryFn: packageApi.getAllPackages,
  });

  const deleteMutation = useMutation({
    mutationFn: packageApi.deletePackage,
    onSuccess: () => {
      toast.success("Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminPackages"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete package");
    }
  });

  const packages = packagesData?.data || [];

  const filtered = packages.filter((p: any) => {
    const matchesSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPackages = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <PackageIcon className="h-6 w-6 text-primary" /> Package Management
        </h1>
        <Button className="gap-2 bg-primary hover:bg-primary-deep shadow-md shadow-primary/20" asChild>
          <Link to="/admin/packages/new"><Plus className="h-4 w-4" />Add Package</Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            className="pl-9 bg-background/50"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <Card className="border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Package Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tests Included</TableHead>
                <TableHead>TAT</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Litmus Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
                      <span>No packages found matching your criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedPackages.map((p: any) => (
                <TableRow key={p._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium max-w-[200px] truncate" title={p.name}>
                    {p.name}
                    {p.tag && <Badge variant="outline" className="ml-2 text-[9px] uppercase tracking-wider">{p.tag}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize shadow-sm">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {p.testCount}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {p.tat}
                  </TableCell>
                  <TableCell className="font-medium text-slate-500 line-through">
                    ₹{p.mrp?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                    ₹{p.price?.toLocaleString() || 0}
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
                        <DropdownMenuItem onClick={() => setSelectedPackage(p)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/packages/${p._id}/edit`} className="w-full flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Package</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPackageToDelete(p._id)}
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
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> packages
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

      <Sheet open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          {selectedPackage && (
            <>
              <SheetHeader className="shrink-0">
                <SheetTitle className="text-xl flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-primary" /> {selectedPackage.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6 flex-1 overflow-y-auto pr-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize">{selectedPackage.category}</Badge>
                  {selectedPackage.tag && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider">{selectedPackage.tag}</Badge>}
                  {selectedPackage.tat && <Badge variant="outline" className="bg-slate-100">{selectedPackage.tat} TAT</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Original Price</p>
                    <p className="font-bold text-lg text-slate-500 line-through">₹{selectedPackage.mrp?.toLocaleString() || 0}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><Tag className="h-3 w-3" /> Litmus Price</p>
                    <p className="font-bold text-lg text-emerald-600">₹{selectedPackage.price?.toLocaleString() || 0}</p>
                  </div>
                </div>

                {selectedPackage.description && (
                  <div className="rounded-lg bg-muted/30 p-4 border border-border text-sm">
                    <h4 className="font-bold mb-2 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Info className="h-3 w-3" /> Description</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedPackage.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-3"><CheckSquare className="h-4 w-4 text-primary" /> Included Tests ({selectedPackage.testCount})</h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted text-muted-foreground uppercase font-semibold">
                        <tr><th className="px-3 py-2">Test Name</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {selectedPackage.tests && selectedPackage.tests.length > 0 ? (
                          selectedPackage.tests.map((test: any, i: number) => (
                            <tr key={test._id || i} className="hover:bg-muted/30">
                              <td className="px-3 py-3 font-medium text-slate-700">{test.testName}</td>
                            </tr>
                          ))
                        ) : (
                          Array.from({ length: selectedPackage.testCount || 0 }).map((_, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-3 py-3 font-medium text-slate-400 italic">Unassigned Test Slot #{i + 1}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-auto shrink-0 bg-background">
                <Button className="w-full bg-primary hover:bg-primary-deep shadow-md" asChild>
                  <Link to={`/admin/packages/${selectedPackage._id}/edit`}>Edit Package</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!packageToDelete}
        onOpenChange={(open) => !open && setPackageToDelete(null)}
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone."
        onConfirm={() => {
          if (packageToDelete) {
            deleteMutation.mutate(packageToDelete);
            setPackageToDelete(null);
          }
        }}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
