import { useState, useEffect, useRef } from"react";
import { useParams, useNavigate, Link } from"react-router-dom";
import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { ArrowLeft, Upload, ImageIcon, Loader2, Plus, X, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from"@/components/ui/skeleton";
import { toast } from"sonner";
import { categoryApi } from"@/lib/api/category";

interface SubcategoryItem {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  subcategories: SubcategoryItem[];
}

export default function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!id;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    imageUrl: "",
    subcategories: [],
  });
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getCategory(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (categoryData?.data?.data) {
      const category = categoryData.data.data;
      setFormData({
        name: category.name || "",
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
      });
    }
  }, [categoryData]);

  const handleAddSubcategory = () => {
    const trimmed = newSubcategoryName.trim();
    if (!trimmed) return;
    if (formData.subcategories.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Subcategory with this name already exists");
      return;
    }
    setFormData({
      ...formData,
      subcategories: [
        ...formData.subcategories,
        { name: trimmed, slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ]
    });
    setNewSubcategoryName("");
  };

  const handleRemoveSubcategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index)
    });
  };

  const saveMutation = useMutation({
    mutationFn: (data: CategoryFormData) => isEditing ? categoryApi.updateCategory(id!, data) : categoryApi.createCategory(data),
    onSuccess: () => {
      toast.success(isEditing ? "Category updated successfully!" : "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      navigate("/admin/categories");
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data?.message || "Failed to save category");
    }
  });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 if (!file.type.startsWith("image/")) {
 toast.error("Please select an image file");
 return;
 }

 try {
 setIsUploading(true);
 const res = await categoryApi.uploadImage(file);
 if (res.data?.data?.url) {
 setFormData({ ...formData, imageUrl: res.data.data.url });
 toast.success("Image uploaded successfully");
 }
 } catch (error) {
 toast.error("Failed to upload image");
 } finally {
 setIsUploading(false);
 if (fileInputRef.current) {
 fileInputRef.current.value ="";
 }
 }
 };

 const handleSave = () => {
 if (!formData.name) {
 toast.error("Category name is required");
 return;
 }
 saveMutation.mutate(formData);
 };

 if (isLoading) {
 return (
 <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-pulse">
 <div className="flex items-center gap-4">
 <Skeleton className="h-10 w-10 rounded-md"/>
 <div className="space-y-2">
 <Skeleton className="h-6 w-48"/>
 <Skeleton className="h-4 w-64"/>
 </div>
 </div>
 <Skeleton className="h-[400px] w-full rounded-xl"/>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fade-in pb-20 mx-auto">
 <div className="flex items-center gap-4">
 <Button variant="ghost"size="icon"asChild>
 <Link to="/admin/categories"><ArrowLeft className="h-5 w-5"/></Link>
 </Button>
 <div>
 <h1 className="text-2xl font-bold text-foreground">
 {isEditing ?"Edit Category":"Add New Category"}
 </h1>
 <p className="text-sm text-muted-foreground">
 {isEditing ?"Update category details and imagery.":"Create a new product category."}
 </p>
 </div>
 </div>

 <Card className="border-0 shadow-md">
 <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
 <CardTitle className="text-xl">Category Details</CardTitle>
 <CardDescription>
 Provide the necessary information for this category.
 </CardDescription>
 </CardHeader>
 <CardContent className="pt-6 space-y-6">
 <div className="space-y-4">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Category Name <span className="text-destructive">*</span></Label>
 <Input name="name"value={formData.name} onChange={handleChange} placeholder="e.g. Dairy Products"className="bg-background/50"/>
 </div>

  <div className="space-y-2">
    <Label className="text-sm font-medium">Description</Label>
    <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the items in this category..." className="min-h-[100px] bg-background/50"/>
  </div>

  {/* Subcategories Management */}
  <div className="space-y-3 pt-3 border-t border-border/60">
    <div>
      <Label className="text-sm font-medium flex items-center gap-1.5">
        <Tag className="h-4 w-4 text-primary" />
        Product Subcategories (Optional)
      </Label>
      <p className="text-xs text-muted-foreground mt-0.5">
        Add specific subcategories under this main category (e.g. Raw Milk, Cheese & Paneer, Butter & Ghee).
      </p>
    </div>

    <div className="flex gap-2">
      <Input
        value={newSubcategoryName}
        onChange={(e) => setNewSubcategoryName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddSubcategory();
          }
        }}
        placeholder="Enter subcategory name..."
        className="bg-background/50 text-xs sm:text-sm"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleAddSubcategory}
        disabled={!newSubcategoryName.trim()}
        className="gap-1.5 text-xs font-semibold bg-white border-slate-200 hover:bg-slate-50 shrink-0"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Subcategory
      </Button>
    </div>

    {formData.subcategories.length > 0 ? (
      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 min-h-[50px] items-center">
        {formData.subcategories.map((sub, index) => (
          <Badge
            key={index}
            variant="outline"
            className="pl-2.5 pr-1.5 py-1 bg-white border-slate-200 text-slate-800 font-medium text-xs rounded-lg gap-1.5 shadow-2xs group"
          >
            <span>{sub.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveSubcategory(index)}
              className="h-4 w-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title={`Remove ${sub.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    ) : (
      <div className="p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
        No subcategories added yet. Type a name and click Add.
      </div>
    )}
  </div>

 <div className="space-y-2">
 <Label className="text-sm font-medium">Category Image</Label>
 <div className="flex flex-col sm:flex-row gap-6 items-start">
 {/* Image Preview */}
 <div className="h-40 w-40 shrink-0 rounded-xl border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden relative">
 {formData.imageUrl ? (
 <img src={formData.imageUrl} alt="Category Preview"className="h-full w-full object-cover"/>
 ) : (
 <>
 <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 opacity-50"/>
 <span className="text-xs text-muted-foreground font-medium">No image</span>
 </>
 )}
 {isUploading && (
 <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
 <Loader2 className="h-6 w-6 text-primary animate-spin"/>
 </div>
 )}
 </div>
 
 {/* Upload Controls */}
 <div className="space-y-3 flex-1">
 <p className="text-sm text-muted-foreground">
 Upload an image that visually represents this category. This will be shown on the home page and category listings.
 </p>
 <input
 type="file"
 accept="image/*"
 className="hidden"
 ref={fileInputRef}
 onChange={handleFileChange}
 />
 <div className="flex gap-2">
 <Button 
 variant="outline"
 onClick={() => fileInputRef.current?.click()}
 disabled={isUploading}
 className="gap-2"
 >
 <Upload className="h-4 w-4"/>
 {isUploading ?"Uploading...": formData.imageUrl ?"Change Image":"Upload Image"}
 </Button>
 {formData.imageUrl && (
 <Button variant="ghost"onClick={() => setFormData({ ...formData, imageUrl:""})} className="text-destructive hover:text-destructive">
 Remove
 </Button>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 <div className="flex justify-end items-center mt-6">
 <Button onClick={handleSave} disabled={saveMutation.isPending || isUploading} className="w-40 bg-primary hover:bg-primary-deep text-white shadow-md shadow-primary/20 font-bold">
 {saveMutation.isPending ?"Saving...": (isEditing ?"Save Changes":"Create Category")}
 </Button>
 </div>
 </div>
 );
}
