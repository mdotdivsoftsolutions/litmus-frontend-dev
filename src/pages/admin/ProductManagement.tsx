import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Settings2, Edit, Trash2, Filter, MoreVertical, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { productApi } from "@/lib/api/product";
import { toast } from "sonner";
import { tests } from "@/lib/placeholder-data";

const ITEMS_PER_PAGE = 10;

interface Product {
  _id: string;
  name: string;
  imageUrl?: string;
  categoryId?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  availableTests: any[];
}

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [testsProduct, setTestsProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => productApi.getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setProductToDelete(null);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data?.message || "Failed to delete product");
      setProductToDelete(null);
    }
  });

  const productsList: Product[] = productsData?.data?.data || [];
  
  const filtered = productsList.filter((p) => 
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
        <Button className="gap-2 bg-primary hover:bg-primary-deep" asChild>
          <Link to="/admin/products/new"><Plus className="h-4 w-4" />Add Product</Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 bg-background" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2 bg-background" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4" />Filters
          </Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Products</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              {/* Category Filter would go here using the real categories API */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary-deep">Apply</Button>
                <Button variant="outline" className="flex-1">Clear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((p) => (
                  <TableRow key={p._id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-md object-cover border border-border" />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border">
                            <ImageIcon className="h-5 w-5 text-muted-foreground opacity-50" />
                          </div>
                        )}
                        <span className="font-medium text-foreground">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                        {p.categoryId?.name || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.availableTests?.length || 0} tests
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.isActive ? "Active" : "Inactive"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/${p._id}/edit`} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Product</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTestsProduct(p)} className="cursor-pointer">
                            <Settings2 className="mr-2 h-4 w-4" />
                            <span>Manage Tests</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setProductToDelete(p._id)}
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> products
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
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Sheet open={!!testsProduct} onOpenChange={(open) => !open && setTestsProduct(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>Manage Tests — {testsProduct?.name}</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-2">
            {tests.map((t) => (
              <label key={t.id} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <input type="checkbox" defaultChecked={Math.random() > 0.5} className="rounded accent-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">FSSAI {t.method} · {t.type}</p>
                </div>
              </label>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog 
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
      />
    </div>
  );
}
