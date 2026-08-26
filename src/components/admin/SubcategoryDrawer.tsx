import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Layers,
  AlertCircle,
  Upload,
  ImageIcon,
  X,
  Check,
} from "lucide-react";
import { categoryApi } from "@/lib/api/category";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SubcategoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  initialCategoryId?: string;
}

export function SubcategoryDrawer({
  open,
  onOpenChange,
  categories = [],
  initialCategoryId,
}: SubcategoryDrawerProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategoryId || (categories.length > 0 ? categories[0]._id : "")
  );

  // Form state
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subToDelete, setSubToDelete] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const currentCategory =
    categories.find((c) => c._id === (selectedCategoryId || categories[0]?._id)) ||
    categories[0];
  const activeCategoryId = currentCategory?._id || "";
  const subcategories = currentCategory?.subcategories || [];

  const resetForm = () => {
    setEditingSubId(null);
    setName("");
    setDescription("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (sub: any) => {
    setEditingSubId(sub._id || sub.name);
    setName(sub.name || "");
    setDescription(sub.description || "");
    setImageUrl(sub.imageUrl || "");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setIsUploading(true);
      const res = await categoryApi.uploadImage(file);
      if (res.data?.data?.url || res.data?.url) {
        const uploadedUrl = res.data?.data?.url || res.data?.url;
        setImageUrl(uploadedUrl);
        toast.success("Subcategory image uploaded!");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const addMutation = useMutation({
    mutationFn: ({ catId, data }: { catId: string; data: any }) =>
      categoryApi.addSubcategory(catId, data),
    onSuccess: () => {
      toast.success("Subcategory added successfully!");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add subcategory");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ catId, subId, data }: { catId: string; subId: string; data: any }) =>
      categoryApi.updateSubcategory(catId, subId, data),
    onSuccess: () => {
      toast.success("Subcategory updated successfully!");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update subcategory");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ catId, subId }: { catId: string; subId: string }) =>
      categoryApi.deleteSubcategory(catId, subId),
    onSuccess: () => {
      toast.success("Subcategory removed successfully!");
      if (editingSubId) resetForm();
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to remove subcategory");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please enter a subcategory name");
      return;
    }
    if (!activeCategoryId) {
      toast.error("Please select a main category first");
      return;
    }

    const payload = {
      name: trimmed,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    };

    if (editingSubId) {
      updateMutation.mutate({
        catId: activeCategoryId,
        subId: editingSubId,
        data: payload,
      });
    } else {
      if (
        subcategories.some(
          (s: any) => s.name.toLowerCase() === trimmed.toLowerCase()
        )
      ) {
        toast.error("This subcategory already exists under the selected category");
        return;
      }
      addMutation.mutate({ catId: activeCategoryId, data: payload });
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-xl w-full p-0">
        {/* Header */}
        <div className="p-6 border-b border-border bg-slate-50/70">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="h-4 w-4" />
            <span>Category Hierarchy</span>
          </div>
          <SheetTitle className="text-xl font-bold text-slate-900">
            Manage Subcategories
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Create, edit, and organize subcategories with custom descriptions and imagery.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Select Category */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 flex items-center justify-between">
              <span>1. Choose Main Category</span>
              <span className="text-xs font-normal text-muted-foreground">
                {categories.length} Categories Available
              </span>
            </Label>

            {categories.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/50 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>No main categories found. Create a category first before adding subcategories.</span>
              </div>
            ) : (
              <Select
                value={activeCategoryId}
                onValueChange={(val) => {
                  setSelectedCategoryId(val);
                  resetForm();
                }}
              >
                <SelectTrigger className="h-11 bg-white border-slate-200 shadow-2xs font-medium text-slate-900">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat._id} value={cat._id} className="py-2.5">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({cat.subcategories?.length || 0} Subcategories)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Step 2: Existing Subcategories with Image & Description details */}
          {currentCategory && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>Subcategories under <span className="text-primary font-bold">"{currentCategory.name}"</span></span>
                </Label>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 font-semibold text-xs border-slate-200">
                  {subcategories.length} Total
                </Badge>
              </div>

              {subcategories.length > 0 ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {subcategories.map((sub: any, idx: number) => {
                    const subIdentifier = sub._id || sub.name;
                    const isDeleting =
                      deleteMutation.isPending &&
                      (deleteMutation.variables as any)?.subId === subIdentifier;
                    const isBeingEdited = editingSubId === subIdentifier;

                    return (
                      <div
                        key={subIdentifier || idx}
                        className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                          isBeingEdited
                            ? "bg-primary/5 border-primary shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Image Thumbnail */}
                          <div className="h-11 w-11 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                            {sub.imageUrl ? (
                              <img
                                src={sub.imageUrl}
                                alt={sub.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-slate-300" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900 text-sm truncate">
                                {sub.name}
                              </h4>
                              {isBeingEdited && (
                                <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 h-4">
                                  Editing
                                </Badge>
                              )}
                            </div>
                            {sub.description ? (
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                {sub.description}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic mt-0.5">
                                No description provided.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(sub)}
                            className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            onClick={() => setSubToDelete({ id: subIdentifier, name: sub.name })}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Subcategory"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-500 text-xs space-y-1">
                  <p className="font-medium">No subcategories created yet.</p>
                  <p className="text-slate-400">Fill the form below to create your first subcategory.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Add / Edit Subcategory Form */}
          {currentCategory && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{editingSubId ? "Edit Subcategory" : "2. Add New Subcategory"}</span>
                </Label>
                {editingSubId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="h-7 text-xs text-muted-foreground hover:text-slate-900 gap-1"
                  >
                    <X className="h-3 w-3" /> Cancel Edit
                  </Button>
                )}
              </div>

              {/* Subcategory Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Subcategory Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raw Milk, Cheese & Paneer..."
                  className="h-10 text-xs sm:text-sm bg-white border-slate-200 shadow-2xs"
                  disabled={isSaving}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Description (Optional)
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe scope, product matrices, or safety testing scope..."
                  className="min-h-[70px] text-xs sm:text-sm bg-white border-slate-200 shadow-2xs"
                  disabled={isSaving}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Subcategory Icon / Image (Optional)
                </Label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isSaving}
                        className="h-8 text-xs font-semibold bg-white border-slate-200 gap-1.5"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {isUploading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
                      </Button>
                      {imageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageUrl("")}
                          className="h-8 text-xs text-destructive hover:bg-rose-50 px-2"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      PNG, JPG, or WEBP (square aspect recommended).
                    </p>
                  </div>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Sticky Bottom Footer with Action Buttons */}
        <div className="p-4 border-t border-border bg-white shadow-lg flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (editingSubId) {
                resetForm();
              } else {
                onOpenChange(false);
              }
            }}
            className="border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs h-10 px-4"
          >
            {editingSubId ? "Cancel Edit" : "Close"}
          </Button>

          {currentCategory && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || !name.trim() || categories.length === 0}
              className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shadow-sm text-xs sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : editingSubId ? (
                <>
                  <Check className="h-4 w-4" /> Save Subcategory Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add Subcategory
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>

      {/* Delete Confirmation Warning Modal */}
      <ConfirmDialog
        open={!!subToDelete}
        onOpenChange={(open) => !open && setSubToDelete(null)}
        title="Delete Subcategory"
        description={`Are you sure you want to delete "${subToDelete?.name}" from "${currentCategory?.name}"? Tests mapped specifically to this subcategory will no longer be linked to it.`}
        onConfirm={() => {
          if (subToDelete && activeCategoryId) {
            deleteMutation.mutate({
              catId: activeCategoryId,
              subId: subToDelete.id,
            });
            setSubToDelete(null);
          }
        }}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete Subcategory"}
        variant="destructive"
      />
    </Sheet>
  );
}
