import { useState, useEffect, useRef } from"react";
import { useParams, useNavigate, Link } from"react-router-dom";
import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Textarea } from"@/components/ui/textarea";
import { Switch } from"@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from"@/components/ui/select";
import { ArrowLeft, Upload, ImageIcon, Loader2 } from"lucide-react";
import { Skeleton } from"@/components/ui/skeleton";
import { toast } from"sonner";
import { productApi } from"@/lib/api/product";
import { categoryApi } from"@/lib/api/category";
import { adminApi } from"@/lib/api/admin";

interface ProductFormData {
 name: string;
 categoryId: string;
 description: string;
 fssaiReference: string;
 imageUrl: string;
 isActive: boolean;
}

interface Category {
 _id: string;
 name: string;
}

export default function ProductFormPage() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const isEditing = !!id;

 const [formData, setFormData] = useState<ProductFormData>({
 name:"",
 categoryId:"",
 description:"",
 fssaiReference:"",
 imageUrl:"",
 isActive: true,
 });
 const [isUploading, setIsUploading] = useState(false);

 const { data: categoriesData } = useQuery({
 queryKey: ["adminCategories"],
 queryFn: () => categoryApi.getCategories(),
 });

 const categories = categoriesData?.data?.data || [];

 const { data: productData, isLoading } = useQuery({
 queryKey: ["product", id],
 queryFn: () => productApi.getProduct(id!),
 enabled: isEditing,
 });

 useEffect(() => {
 if (productData?.data?.data) {
 const product = productData.data.data;
 setFormData({
 name: product.name ||"",
 categoryId: product.categoryId?._id || product.categoryId ||"",
 description: product.description ||"",
 fssaiReference: product.fssaiReference ||"",
 imageUrl: product.imageUrl ||"",
 isActive: product.isActive !== undefined ? product.isActive : true,
 });
 }
 }, [productData]);

 const saveMutation = useMutation({
 mutationFn: (data: ProductFormData) => isEditing ? productApi.updateProduct(id!, data as Record<string, unknown>) : productApi.createProduct(data as Record<string, unknown>),
 onSuccess: () => {
 toast.success(isEditing ?"Product updated successfully!":"Product created successfully!");
 queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
 navigate("/admin/products");
 },
 onError: (error: Error | any) => {
 toast.error(error?.response?.data?.message ||"Failed to save product");
 }
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSelectChange = (value: string) => {
 setFormData({ ...formData, categoryId: value });
 };

 const handleSwitchChange = (checked: boolean) => {
 setFormData({ ...formData, isActive: checked });
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
 const res = await adminApi.uploadFile(file);
 if (res.data?.url) {
 setFormData({ ...formData, imageUrl: res.data.url });
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
 toast.error("Product name is required");
 return;
 }
 if (!formData.categoryId) {
 toast.error("Category is required");
 return;
 }
 saveMutation.mutate(formData);
 };

 if (isLoading) {
 return (
 <div className="space-y-6 mx-auto pb-20 animate-pulse">
 <div className="flex items-center gap-4">
 <Skeleton className="h-10 w-10 rounded-md"/>
 <div className="space-y-2">
 <Skeleton className="h-6 w-48"/>
 <Skeleton className="h-4 w-64"/>
 </div>
 </div>
 <Skeleton className="h-[500px] w-full rounded-xl"/>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fade-in pb-20 mx-auto">
 <div className="flex items-center gap-4">
 <Button variant="ghost"size="icon"asChild>
 <Link to="/admin/products"><ArrowLeft className="h-5 w-5"/></Link>
 </Button>
 <div>
 <h1 className="text-2xl font-bold text-foreground">
 {isEditing ?"Edit Product":"Add New Product"}
 </h1>
 <p className="text-sm text-muted-foreground">
 {isEditing ?"Update product details and imagery.":"Create a new food product for testing."}
 </p>
 </div>
 </div>

 <Card className="border-0 shadow-md">
 <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
 <CardTitle className="text-xl">Product Details</CardTitle>
 <CardDescription>
 Provide the necessary information for this product.
 </CardDescription>
 </CardHeader>
 <CardContent className="pt-6 space-y-6">
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Product Name <span className="text-destructive">*</span></Label>
 <Input name="name"value={formData.name} onChange={handleChange} placeholder="e.g. Full Cream Milk"className="bg-background/50"/>
 </div>
 
 <div className="space-y-2">
 <Label className="text-sm font-medium">Category <span className="text-destructive">*</span></Label>
 <Select value={formData.categoryId || undefined} onValueChange={handleSelectChange}>
 <SelectTrigger className="bg-background/50">
 <SelectValue placeholder="Select Category"/>
 </SelectTrigger>
 <SelectContent>
 {categories.map((cat: Category) => (
 <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="space-y-2">
 <Label className="text-sm font-medium">FSSAI Standard Reference</Label>
 <Input name="fssaiReference"value={formData.fssaiReference} onChange={handleChange} placeholder="e.g. IS:1479"className="bg-background/50"/>
 </div>

 <div className="space-y-2">
 <Label className="text-sm font-medium">Description</Label>
 <Textarea name="description"value={formData.description} onChange={handleChange} placeholder="Describe the product..."className="min-h-[100px] bg-background/50"/>
 </div>

 <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
 <div>
 <Label className="text-base font-medium">Active Status</Label>
 <p className="text-sm text-muted-foreground mt-1">If inactive, this product won't appear for booking.</p>
 </div>
 <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
 </div>

 <div className="space-y-2 pt-2">
 <Label className="text-sm font-medium">Product Image</Label>
 <div className="flex flex-col sm:flex-row gap-6 items-start">
 {/* Image Preview */}
 <div className="h-40 w-40 shrink-0 rounded-xl border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden relative">
 {formData.imageUrl ? (
 <img src={formData.imageUrl} alt="Product Preview"className="h-full w-full object-cover"/>
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
 Upload an image that visually represents this product. This will be shown on the home page and product listings.
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
 </CardContent>
 </Card>

 <div className="flex justify-end items-center mt-6">
 <Button onClick={handleSave} disabled={saveMutation.isPending || isUploading} className="w-40 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
 {saveMutation.isPending ?"Saving...": (isEditing ?"Save Changes":"Create Product")}
 </Button>
 </div>
 </div>
 );
}
