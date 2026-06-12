import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Edit, Trash2, MoreVertical, Package, ImageIcon, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { categoryApi } from "@/lib/api/category";
import { toast } from "sonner";

export default function CategoryManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryApi.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setCategoryToDelete(null);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data?.message || "Failed to delete category");
      setCategoryToDelete(null);
    }
  });

  interface Category {
    _id: string;
    name: string;
    imageUrl?: string;
    productCount?: number;
  }

  const categories: Category[] = categoriesData?.data?.data || [];
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage product categories and imagery.</p>
        </div>
        <Button asChild className="gap-2 bg-primary hover:bg-primary-deep shadow-sm">
          <Link to="/admin/categories/new">
            <Plus className="h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border border-border shadow-sm overflow-hidden">
              <Skeleton className="h-32 w-full rounded-none" />
              <CardContent className="p-4 text-center space-y-2">
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
            </Card>
          ))
        ) : paginatedCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          paginatedCategories.map((cat: Category) => (
            <Card key={cat._id} className="border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden relative flex flex-col">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedCategory(cat)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/categories/${cat._id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Category</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setCategoryToDelete(cat._id)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="h-32 w-full bg-muted flex items-center justify-center overflow-hidden border-b border-border">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                )}
              </div>
              
              <CardContent className="p-4 text-center space-y-2 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-foreground line-clamp-1" title={cat.name}>{cat.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {cat.productCount || 0} Products
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Category Detail Sheet */}
      <Sheet open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <SheetContent className="flex flex-col sm:max-w-md">
          {selectedCategory && (
            <>
              <SheetHeader className="shrink-0">
                <SheetTitle className="text-xl">Category Details</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative shadow-sm">
                  {selectedCategory.imageUrl ? (
                    <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <h2 className="absolute bottom-4 left-4 text-white font-black text-2xl tracking-tight">{selectedCategory.name}</h2>
                </div>

                <div className="rounded-lg border border-border p-5 bg-background shadow-sm space-y-5">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5">Category Name</p>
                    <p className="font-bold text-lg text-slate-900">{selectedCategory.name}</p>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Platform Statistics</p>
                    <p className="font-medium text-slate-700 flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      {selectedCategory.productCount || 0} Connected Products
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-auto shrink-0 bg-background">
                <Button className="w-full bg-primary hover:bg-primary-deep shadow-md" onClick={() => {
                  navigate(`/admin/categories/${selectedCategory._id}/edit`);
                }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Category
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {!isLoading && categories.length > 0 && (
        <div className="flex items-center justify-between border border-border px-4 py-3 bg-muted/20 mt-6 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, categories.length)}</span> of <span className="font-medium text-foreground">{categories.length}</span> categories
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

      <ConfirmDialog 
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This will permanently remove the category from the database."
        onConfirm={() => categoryToDelete && deleteMutation.mutate(categoryToDelete)}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
      />
    </div>
  );
}
