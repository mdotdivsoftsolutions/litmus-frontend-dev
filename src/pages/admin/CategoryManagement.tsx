import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, MoreVertical, Package, ImageIcon, ChevronLeft, ChevronRight, Eye, FileSpreadsheet, Tag } from "lucide-react";
import { categoryApi } from "@/lib/api/category";
import { toast } from "sonner";
import { BulkImportDrawer } from "@/components/admin/BulkImportDrawer";
import { SubcategoryDrawer } from "@/components/admin/SubcategoryDrawer";

const ITEMS_PER_PAGE = 10;

interface Category {
  _id: string;
  name: string;
  imageUrl?: string;
  productCount?: number;
  testCount?: number;
  subcategories?: { _id?: string; name: string; slug?: string; description?: string; imageUrl?: string }[];
}

function CategoryCardImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-100 relative overflow-hidden">
      {!isLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transform-gpu will-change-transform transition-all duration-200 ease-out group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function CategoryManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isSubcategoryDrawerOpen, setIsSubcategoryDrawerOpen] = useState(false);
  const [activeDrawerCategoryId, setActiveDrawerCategoryId] = useState<string | undefined>(undefined);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 60 * 1000,
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

  const rawCategories: Category[] = useMemo(() => {
    return categoriesData?.data?.data || [];
  }, [categoriesData]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return rawCategories;
    const query = search.toLowerCase().trim();
    return rawCategories.filter((c) => c.name.toLowerCase().includes(query));
  }, [rawCategories, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  return (
    <div className="space-y-6 pb-20 mx-auto">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage food & industrial diagnostic testing categories, subcategories, and imagery.
          </p>
        </div>
      </div>

      {/* Single-Line Controls: Search + Bulk Import + Add Subcategory + Add Category Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 sm:min-w-[260px] max-w-md">
          <Input 
            placeholder="Search categories..." 
            className="bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
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

          {/* Dedicated Add Subcategory Drawer Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActiveDrawerCategoryId(rawCategories[0]?._id);
              setIsSubcategoryDrawerOpen(true);
            }}
            className="bg-white border-primary/30 hover:bg-primary/5 text-primary font-semibold shadow-sm h-10 px-3.5 gap-2"
          >
            <Tag className="h-4 w-4 text-primary" />
            + Add Subcategory
          </Button>

          {/* Primary Styled Add Category Button */}
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2">
            <Link to="/admin/categories/new">
              <Plus className="h-4 w-4" /> Add Category
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Import Drawer */}
      <BulkImportDrawer
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        entityType="categories"
        title="Bulk Import Categories"
        description="Upload an Excel sheet to bulk create new categories or update existing categories with subcategories."
        templateFileName="1_Litmus_Categories_Bulk_Template.xlsx"
        templateDisplayName="1_Litmus_Categories_Bulk_Template.xlsx"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
        }}
      />

      {/* Dedicated Subcategory Management Drawer */}
      <SubcategoryDrawer
        open={isSubcategoryDrawerOpen}
        onOpenChange={setIsSubcategoryDrawerOpen}
        categories={rawCategories}
        initialCategoryId={activeDrawerCategoryId}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
          paginatedCategories.map((cat: Category) => {
            const count = cat.testCount ?? cat.productCount ?? 0;
            return (
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
                      <DropdownMenuItem onClick={() => {
                        setActiveDrawerCategoryId(cat._id);
                        setIsSubcategoryDrawerOpen(true);
                      }}>
                        <Tag className="mr-2 h-4 w-4 text-primary" />
                        <span>Manage Subcategories</span>
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
                  <CategoryCardImage src={cat.imageUrl} alt={cat.name} />
                </div>
                
                <CardContent className="p-4 text-center space-y-1.5 flex-1 flex flex-col justify-center">
                  <h3 className="font-semibold text-foreground line-clamp-1" title={cat.name}>{cat.name}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <span>{count} Tests</span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-primary font-semibold">{cat.subcategories.length} Subcategories</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
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
                    <img 
                      src={selectedCategory.imageUrl} 
                      alt={selectedCategory.name} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <h2 className="absolute bottom-4 left-4 text-white font-black text-2xl tracking-tight">{selectedCategory.name}</h2>
                </div>

                <div className="rounded-lg border border-border p-5 bg-background shadow-sm space-y-4">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5">Category Name</p>
                    <p className="font-bold text-lg text-slate-900">{selectedCategory.name}</p>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1.5">Platform Statistics</p>
                    <p className="font-medium text-slate-700 flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-primary" />
                      {selectedCategory.testCount ?? selectedCategory.productCount ?? 0} Connected Tests / Products
                    </p>
                  </div>

                  {/* Subcategories Section */}
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                        Subcategories ({selectedCategory.subcategories?.length || 0})
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const targetId = selectedCategory._id;
                          setSelectedCategory(null);
                          setActiveDrawerCategoryId(targetId);
                          setIsSubcategoryDrawerOpen(true);
                        }}
                        className="h-6 px-2 text-[11px] text-primary hover:text-primary-deep font-semibold"
                      >
                        + Add / Manage
                      </Button>
                    </div>
                    {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                      <div className="space-y-2">
                        {selectedCategory.subcategories.map((sub: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                          >
                            <div className="h-8 w-8 rounded-md bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {sub.imageUrl ? (
                                <img 
                                  src={sub.imageUrl} 
                                  alt={sub.name} 
                                  loading="lazy" 
                                  decoding="async" 
                                  className="h-full w-full object-cover" 
                                />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-800 truncate">{sub.name}</p>
                              {sub.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">{sub.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No subcategories defined for this category.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-auto shrink-0 bg-background flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/5 shadow-2xs font-semibold"
                  onClick={() => {
                    const targetId = selectedCategory._id;
                    setSelectedCategory(null);
                    setActiveDrawerCategoryId(targetId);
                    setIsSubcategoryDrawerOpen(true);
                  }}
                >
                  <Tag className="mr-2 h-4 w-4" /> Manage Subcategories
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 shadow-md font-semibold" onClick={() => {
                  navigate(`/admin/categories/${selectedCategory._id}/edit`);
                }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Category
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {!isLoading && filteredCategories.length > 0 && (
        <div className="flex items-center justify-between border border-border px-4 py-3 bg-muted/20 mt-6 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)}</span> of <span className="font-medium text-foreground">{filteredCategories.length}</span> categories
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
