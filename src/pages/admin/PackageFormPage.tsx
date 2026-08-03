import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from"react-router-dom";
import { useForm, useFieldArray } from"react-hook-form";
import { zodResolver } from"@hookform/resolvers/zod";
import * as z from"zod";
import { useMutation, useQuery, useQueryClient } from"@tanstack/react-query";
import { Card, CardContent } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from"@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from"@/components/ui/select";
import { Checkbox } from"@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Package as PackageIcon, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { packageApi } from "@/lib/api/package";
import { categoryApi } from "@/lib/api/category";
import { testApi } from "@/lib/api/test";
import { tagApi } from "@/lib/api/tag";
import { uploadApi } from "@/lib/api/uploadApi";

const packageSchema = z.object({
 name: z.string().min(3,"Name must be at least 3 characters"),
 description: z.string().min(10,"Description must be at least 10 characters"),
 categoryId: z.string().min(1,"Category is required"),
 category: z.string().optional(),
 tests: z.array(z.string()).min(1,"At least one test must be selected"),
 testCount: z.coerce.number().min(1,"Test count must be at least 1"),
 mrp: z.coerce.number().min(0,"MRP must be positive"),
 discountType: z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
 discountValue: z.coerce.number().min(0,"Discount must be positive"),
 price: z.coerce.number().min(0,"Price must be positive"),
 tat: z.string().min(1,"Turn around time is required"),
 tag: z.string().optional(),
 features: z.array(z.object({
 value: z.string().min(1,"Feature cannot be empty")
 })).optional(),
 image: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

export default function PackageFormPage() {
 const { id } = useParams();
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isUploading, setIsUploading] = useState(false);
 const isEditing = !!id;

 const form = useForm<PackageFormValues>({
 resolver: zodResolver(packageSchema),
 defaultValues: {
 name:"",
 description:"",
 categoryId:"",
 category:"",
 tests: [],
 testCount: 0,
 mrp: 0,
 discountType:"PERCENTAGE",
 discountValue: 0,
 price: 0,
 tat:"",
 tag:"",
 features: [],
 image: "",
 },
 });

 const { fields, append, remove } = useFieldArray({
 name:"features",
 control: form.control,
 });

 const { data: packageData, isLoading: isLoadingPackage } = useQuery({
 queryKey: ["adminPackage", id],
 queryFn: () => packageApi.getPackage(id!),
 enabled: isEditing,
 });

 const { data: categoriesData } = useQuery({
 queryKey: ["categories"],
 queryFn: () => categoryApi.getCategories().then(res => res.data?.data),
 });

 const selectedCategoryId = form.watch("categoryId");

 const { data: testsData } = useQuery({
 queryKey: ["tests", selectedCategoryId],
 queryFn: () => testApi.getTests({ category: selectedCategoryId, limit: 500 }),
 enabled: !!selectedCategoryId,
 });

 const { data: tagsData } = useQuery({
 queryKey: ["adminTags"],
 queryFn: () => tagApi.getTags(),
 });

 useEffect(() => {
 if (packageData?.data) {
 const p = packageData.data;
 form.reset({
 name: p.name,
 description: p.description,
 categoryId: p.categoryId?._id || p.categoryId ||"",
 category: p.category ||"",
 tests: p.tests?.map((t: any) => t._id || t) || [],
 testCount: p.testCount,
 mrp: p.mrp,
 discountType: p.discountType ||"PERCENTAGE",
 discountValue: p.discountValue || 0,
 price: p.price,
 tat: p.tat,
 tag: p.tag ||"",
 features: p.features && p.features.length > 0 
 ? p.features.map((f: string) => ({ value: f })) 
 : [],
 image: p.image || p.imageUrl || "",
 });
 }
 }, [packageData, form]);

 const selectedTests = form.watch("tests");
 const discountType = form.watch("discountType");
 const discountValue = form.watch("discountValue");

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res?.data?.url) {
        form.setValue("image", res.data.url, { shouldValidate: true });
        toast.success("Image uploaded successfully");
      } else if (res?.url) {
        form.setValue("image", res.url, { shouldValidate: true });
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

 // Auto-calculate MRP and Test Count
 useEffect(() => {
 if (!testsData || !testsData.data) return;
 
 const testsList = testsData.data;
 let newMrp = 0;
 let newParameterCount = 0;
 
 selectedTests.forEach((testId: string) => {
 const test = testsList.find((t: any) => t._id === testId);
 if (test) {
 newMrp += test.offerPrice || test.price || 0;
 newParameterCount += (test.metadata?.parameters?.length || 0);
 }
 });

 form.setValue("mrp", newMrp, { shouldValidate: true });
 form.setValue("testCount", newParameterCount, { shouldValidate: true });
 }, [selectedTests, testsData, form]);

 const mrp = form.watch("mrp");
 
 // Auto-calculate Price
 useEffect(() => {
 let finalPrice = mrp;
 if (discountType === 'PERCENTAGE') {
 finalPrice = mrp - (mrp * ((discountValue || 0) / 100));
 } else if (discountType === 'FLAT') {
 finalPrice = mrp - (discountValue || 0);
 }
 finalPrice = Math.max(0, finalPrice);
 form.setValue("price", finalPrice, { shouldValidate: true });
 }, [mrp, discountType, discountValue, form]);

 const mutation = useMutation({
 mutationFn: (data: any) => isEditing ? packageApi.updatePackage(id!, data) : packageApi.createPackage(data),
 onSuccess: () => {
 toast.success(`Package ${isEditing ? 'updated' : 'created'} successfully`);
 queryClient.invalidateQueries({ queryKey: ["adminPackages"] });
 navigate("/admin/packages");
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} package`);
 }
 });

 const onSubmit = (data: PackageFormValues) => {
 let finalFeatures = data.features?.map(f => f.value).filter(Boolean) || [];
 
 if (finalFeatures.length === 0 && testsData?.data) {
 const selectedTestObjects = testsData.data.filter((t: any) => data.tests.includes(t._id));
 finalFeatures = selectedTestObjects.map((t: any) => t.testName);
 }

 const formattedData = {
 ...data,
 features: finalFeatures,
 tag: data.tag === 'none' ? '' : data.tag,
 };
 mutation.mutate(formattedData);
 };

 if (isEditing && isLoadingPackage) {
 return (
 <div className="flex items-center justify-center h-64">
 <Loader2 className="h-8 w-8 animate-spin text-primary"/>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fade-in pb-20 mx-auto">
 <div className="flex items-center gap-4">
 <Button variant="ghost"size="icon"asChild className="rounded-full">
 <Link to="/admin/packages"><ArrowLeft className="h-5 w-5"/></Link>
 </Button>
 <div className="flex items-center gap-2">
 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
 <PackageIcon className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h1 className="text-2xl font-bold text-foreground">
 {isEditing ?"Edit Package":"Create New Package"}
 </h1>
 <p className="text-sm text-muted-foreground mt-0.5">
 {isEditing ?"Update existing package details and features":"Add a new test package to the platform"}
 </p>
 </div>
 </div>
 </div>

 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
 <Card className="border border-border shadow-sm overflow-hidden">
 <CardContent className="p-6 md:p-8 space-y-8">
 
 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
 <div className="grid gap-6 md:grid-cols-2">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem className="md:col-span-2">
 <FormLabel>Package Name</FormLabel>
 <FormControl>
 <Input placeholder="e.g. Complete FSSAI Basic Shield"{...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="description"
 render={({ field }) => (
 <FormItem className="md:col-span-2">
 <FormLabel>Description</FormLabel>
 <FormControl>
 <Textarea placeholder="Brief description of the package..."className="resize-none"rows={3} {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="categoryId"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Category</FormLabel>
 <Select 
 onValueChange={(val) => {
 field.onChange(val);
 const cat = categoriesData?.find((c: any) => c._id === val);
 if (cat) form.setValue("category", cat.name);
 if (!isEditing || val !== packageData?.data?.categoryId?._id) {
 form.setValue("tests", []);
 }
 }} 
 value={field.value || undefined}
 >
 <FormControl>
 <SelectTrigger>
 <SelectValue placeholder="Select a category"/>
 </SelectTrigger>
 </FormControl>
 <SelectContent>
 {categoriesData?.map((cat: any) => (
 <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="tag"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Tag (Optional)</FormLabel>
 <Select onValueChange={field.onChange} value={field.value || undefined}>
 <FormControl>
 <SelectTrigger>
 <SelectValue placeholder="Select a tag"/>
 </SelectTrigger>
 </FormControl>
 <SelectContent>
 <SelectItem value="none">None</SelectItem>
 {tagsData?.data?.map((t: any) => (
 <SelectItem key={t._id} value={t.name}>{t.name}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Package Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col sm:flex-row gap-6 items-start mt-2">
                    <div className="h-40 w-40 shrink-0 rounded-xl border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden relative">
                      {field.value ? (
                        <img src={field.value} alt="Package Preview" className="h-full w-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                          <span className="text-xs text-muted-foreground font-medium">No image</span>
                        </>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <p className="text-sm text-muted-foreground">
                        Upload an image that visually represents this package.
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
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? "Uploading..." : field.value ? "Change Image" : "Upload Image"}
                        </Button>
                        {field.value && (
                          <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => form.setValue("image", "", { shouldValidate: true })} 
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

 {selectedCategoryId && testsData?.data && (
 <FormField
 control={form.control}
 name="tests"
 render={() => (
 <FormItem className="md:col-span-2">
 <div className="mb-4">
 <FormLabel className="text-base">Select Tests</FormLabel>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {testsData.data.map((item: any) => (
 <FormField
 key={item._id}
 control={form.control}
 name="tests"
 render={({ field }) => {
 return (
 <FormItem
 key={item._id}
 className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-card hover:bg-accent/50 transition-colors"
 >
 <FormControl>
 <Checkbox
 checked={field.value?.includes(item._id)}
 onCheckedChange={(checked) => {
 return checked
 ? field.onChange([...field.value, item._id])
 : field.onChange(
 field.value?.filter(
 (value) => value !== item._id
 )
 )
 }}
 />
 </FormControl>
 <div className="space-y-1 leading-none">
 <FormLabel className="font-normal cursor-pointer text-sm">
 {item.testName} <span className="text-muted-foreground ml-1">(₹{item.offerPrice || item.price})</span>
 </FormLabel>
 </div>
 </FormItem>
 )
 }}
 />
 ))}
 </div>
 <FormMessage />
 </FormItem>
 )}
 />
 )}
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b pb-2">Pricing & Logistics</h3>
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
 <FormField
 control={form.control}
 name="mrp"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Original Price (MRP) ₹</FormLabel>
 <FormControl>
 <Input type="number"{...field} readOnly className="bg-muted font-medium"/>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="discountType"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Discount Type</FormLabel>
 <Select onValueChange={field.onChange} value={field.value}>
 <FormControl>
 <SelectTrigger>
 <SelectValue placeholder="Select type"/>
 </SelectTrigger>
 </FormControl>
 <SelectContent>
 <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
 <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
 </SelectContent>
 </Select>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="discountValue"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Discount Value</FormLabel>
 <FormControl>
 <Input type="number"{...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="price"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Litmus Price ₹</FormLabel>
 <FormControl>
 <Input type="number"{...field} readOnly className="bg-muted font-bold text-primary"/>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="tat"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Turn Around Time</FormLabel>
 <FormControl>
 <Input placeholder="e.g. 3-5 Days"{...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 
 <FormField
 control={form.control}
 name="testCount"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Parameters Count</FormLabel>
 <FormControl>
 <Input type="number"{...field} readOnly className="bg-muted"/>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between border-b pb-2">
 <h3 className="text-lg font-semibold">Included Features / Parameters</h3>
 <Button 
 type="button"
 variant="outline"
 size="sm"
 className="gap-1 h-8"
 onClick={() => append({ value:""})}
 >
 <Plus className="h-3.5 w-3.5"/> Add Feature
 </Button>
 </div>
 
 {fields.length === 0 ? (
 <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md border border-dashed text-center">
 No manual features added. The selected tests will be automatically used as features.
 </div>
 ) : (
 <div className="space-y-3">
 {fields.map((field, index) => (
 <FormField
 key={field.id}
 control={form.control}
 name={`features.${index}.value`}
 render={({ field: formField }) => (
 <FormItem>
 <div className="flex items-center gap-2">
 <FormControl>
 <Input placeholder={`Feature ${index + 1} (e.g. Microbial Load Analysis)`} {...formField} />
 </FormControl>
 <Button 
 type="button"
 variant="ghost"
 size="icon"
 className="text-destructive hover:bg-destructive/10 shrink-0"
 onClick={() => remove(index)}
 >
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 <FormMessage />
 </FormItem>
 )}
 />
 ))}
 </div>
 )}
 </div>

 </CardContent>
 </Card>

 <div className="flex justify-end gap-4">
 <Button type="button"variant="outline"asChild>
 <Link to="/admin/packages">Cancel</Link>
 </Button>
 <Button type="submit"disabled={mutation.isPending} className="bg-primary hover:bg-primary-deep shadow-md gap-2">
 {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
 {isEditing ?"Update Package":"Save Package"}
 </Button>
 </div>
 </form>
 </Form>
 </div>
 );
}
