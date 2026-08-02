import { useState, useEffect } from"react";
import { useParams, useNavigate, Link } from"react-router-dom";
import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Switch } from"@/components/ui/switch";
import { ArrowLeft, Upload, CheckCircle2, MapPin, Beaker, Receipt, Shield, Star, Trash2, Edit2, User, Loader2 } from"lucide-react";
import { Skeleton } from"@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from"@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from"@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import { toast } from"sonner";
import { cn } from"@/lib/utils";
import { adminApi } from"@/lib/api/admin";
import { testApi } from"@/lib/api/test";
import { logisticsApi } from"@/lib/api/logistics";
import { infrastructureApi } from"@/lib/api/infrastructure";
import { activityStatusApi } from"@/lib/api/activityStatus";
import { Badge } from"@/components/ui/badge";

const stepLabels = ["Basic Info","Location & Media","Profile & Infrastructure","Reviews","Tests & Pricing"];

interface LabFormData {
 labName: string;
 contactEmail: string;
 contactPhone: string;
 password?: string;
 startingYear: string;
 additionalDetails: string;
 affiliationDocs: string[];
 nablAccreditationNumber: string;
 isNablAccredited: boolean;
 isFssaiApproved: boolean;
 isTrusted: boolean;
 isAutoBooking: boolean;
 location: {
 address: string;
 city: string;
 state: string;
 lat: string;
 lng: string;
 };
 overview: string;
 employeeCount: string;
 accuracyRate: string;
 testsConducted: string;
 activityStatus: string;
 serviceAreaLogistics: string[];
 infrastructure: { title: string; description: string; icon: string }[];
 expertiseArea: string[];
 reviews: { reviewerName: string; reviewerRole: string; userImage?: string; rating: number; comment: string; isVerified: boolean; date: string }[];
 metadata: {
 images: string[];
 };
 tests: string[];
 pricing: Record<string, any>;
}

export default function LabFormPage() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const isEditing = !!id;

 const [step, setStep] = useState(0);
 const [isUploading, setIsUploading] = useState(false);
 const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
 const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
 const [activeReview, setActiveReview] = useState<{
 reviewerName: string;
 reviewerRole: string;
 userImage?: string;
 rating: number;
 comment: string;
 isVerified: boolean;
 date: string;
 }>({
 reviewerName:"",
 reviewerRole:"",
 userImage:"",
 rating: 5,
 comment:"",
 isVerified: false,
 date: new Date().toISOString().split('T')[0]
 });
 
 const [formData, setFormData] = useState<LabFormData>({
 labName:"",
 contactEmail:"",
 contactPhone:"",
 password:"",
 startingYear:"",
 additionalDetails:"",
 affiliationDocs: [],
 nablAccreditationNumber:"",
 isNablAccredited: false,
 isFssaiApproved: false,
 isTrusted: false,
 isAutoBooking: false,
 location: {
 address:"",
 city:"",
 state:"",
 lat:"",
 lng:""
 },
 overview:"",
 employeeCount:"",
 accuracyRate:"",
 testsConducted:"",
 activityStatus:"Operational Now",
 serviceAreaLogistics: [],
 infrastructure: [],
 expertiseArea: [],
 reviews: [],
 metadata: {
 images: []
 },
 tests: [],
 pricing: {}
 });

 const { data: labData, isLoading } = useQuery({
 queryKey: ["adminLab", id],
 queryFn: () => adminApi.getLabById(id!),
 enabled: isEditing,
 });

 const { data: testsData, isLoading: testsLoading } = useQuery({
 queryKey: ["adminTests"],
 queryFn: () => testApi.getTests(),
 });

 const { data: logisticsData } = useQuery({
 queryKey: ["adminLogistics"],
 queryFn: () => logisticsApi.getLogisticsOptions(),
 });

 const { data: infrastructureData } = useQuery({
 queryKey: ["adminInfrastructure"],
 queryFn: () => infrastructureApi.getInfrastructureOptions(),
 });

 const { data: activityStatusData } = useQuery({
 queryKey: ["adminActivityStatus"],
 queryFn: () => activityStatusApi.getActivityStatuses()
 });

 const logisticsOptions = logisticsData?.data || [];
 const infrastructureOptions = infrastructureData?.data || [];
 const activityStatuses = activityStatusData?.data || [];

 useEffect(() => {
 if (labData?.data) {
 const lab = labData.data;
 setFormData({
 labName: lab.labName ||"",
 contactEmail: lab.contactEmail ||"",
 contactPhone: lab.contactPhone ||"",
 password:"",
 startingYear: lab.startingYear ||"",
 additionalDetails: lab.additionalDetails ||"",
 affiliationDocs: lab.affiliationDocs || [],
 nablAccreditationNumber: lab.nablAccreditationNumber ||"",
 isNablAccredited: lab.isNablAccredited || false,
 isFssaiApproved: lab.isFssaiApproved || false,
 isTrusted: lab.isTrusted || false,
 isAutoBooking: lab.isAutoBooking || false,
 location: {
 address: lab.location?.address ||"",
 city: lab.location?.city ||"",
 state: lab.location?.state ||"",
 lat: lab.location?.lat || lab.location?.latitude ||"",
 lng: lab.location?.lng || lab.location?.longitude ||""
 },
 overview: lab.overview ||"",
 employeeCount: lab.employeeCount?.toString() ||"",
 accuracyRate: lab.accuracyRate?.toString() ||"",
 testsConducted: lab.testsConducted?.toString() ||"",
 activityStatus: lab.activityStatus ||"Operational Now",
 serviceAreaLogistics: lab.serviceAreaLogistics || [],
 infrastructure: lab.infrastructure || [],
 expertiseArea: lab.expertiseArea || [],
 reviews: lab.reviews || [],
 metadata: {
 images: lab.metadata?.images || []
 },
 tests: lab.tests?.map((t: any) => typeof t === 'string' ? t : t._id) || [],
 pricing: lab.pricing || {}
 });
 }
 }, [labData]);

 const saveMutation = useMutation({
 mutationFn: (data: any) => {
 // transform numbers before sending
 const payload = {
 ...data,
 employeeCount: data.employeeCount ? Number(data.employeeCount) : 0,
 accuracyRate: data.accuracyRate ? Number(data.accuracyRate) : 0,
 testsConducted: data.testsConducted ? Number(data.testsConducted) : 0,
 };
 return isEditing ? adminApi.updateLab(id!, payload) : adminApi.createLab(payload);
 },
 onSuccess: (res: any) => {
 toast.success(isEditing ?"Laboratory updated successfully!":"Laboratory created successfully!");
 if (res.generatedPassword) {
 alert(`Lab created successfully!\n\nAuto-generated password for the lab account:\n${res.generatedPassword}\n\nPlease copy and share this securely with the lab.`);
 }
 queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
 navigate("/admin/laboratories");
 },
 onError: (error: any) => {
 toast.error(error.response?.data?.message ||"Failed to save laboratory");
 }
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setFormData({
 ...formData,
 location: { ...formData.location, [e.target.name]: e.target.value }
 });
 };

 const handleSwitchChange = (name: string, checked: boolean) => {
 setFormData({ ...formData, [name]: checked });
 };

 const handleTestToggle = (testId: string, checked: boolean) => {
 setFormData((prev) => {
 if (checked) {
 return { ...prev, tests: [...prev.tests, testId] };
 } else {
 const newPricing = { ...prev.pricing };
 delete newPricing[testId];
 return { 
 ...prev, 
 tests: prev.tests.filter(id => id !== testId),
 pricing: newPricing
 };
 }
 });
 };

 const handleParameterPriceChange = (testId: string, paramName: string, value: string) => {
 setFormData((prev) => {
 const currentPricing = prev.pricing[testId] || {};
 const newTestPricing = typeof currentPricing === 'object' ? { ...currentPricing } : {};
 
 if (value ==="") {
 delete newTestPricing[paramName];
 } else {
 newTestPricing[paramName] = Number(value);
 }
 
 return {
 ...prev,
 pricing: { ...prev.pricing, [testId]: newTestPricing }
 };
 });
 };

 const handleServiceLogisticsToggle = (item: string, checked: boolean) => {
 setFormData((prev) => {
 if (checked) {
 return { ...prev, serviceAreaLogistics: [...prev.serviceAreaLogistics, item] };
 } else {
 return { ...prev, serviceAreaLogistics: prev.serviceAreaLogistics.filter(i => i !== item) };
 }
 });
 };

 const handleInfrastructureToggle = (opt: any, checked: boolean) => {
 setFormData((prev) => {
 if (checked) {
 return { 
 ...prev, 
 infrastructure: [...prev.infrastructure, { title: opt.title, description: opt.description, icon: opt.icon }] 
 };
 } else {
 return { 
 ...prev, 
 infrastructure: prev.infrastructure.filter(i => i.title !== opt.title) 
 };
 }
 });
 };

 const handleOpenReviewDrawer = (index: number | null = null) => {
 if (index !== null) {
 setActiveReviewIndex(index);
 setActiveReview(formData.reviews[index]);
 } else {
 setActiveReviewIndex(null);
 setActiveReview({ reviewerName:"", reviewerRole:"", userImage:"", rating: 5, comment:"", isVerified: true, date: new Date().toISOString().split('T')[0] });
 }
 setIsReviewDrawerOpen(true);
 };

 const handleSaveReview = () => {
 setFormData(prev => {
 const newReviews = [...prev.reviews];
 if (activeReviewIndex !== null) {
 newReviews[activeReviewIndex] = activeReview;
 } else {
 newReviews.push(activeReview);
 }
 return { ...prev, reviews: newReviews };
 });
 setIsReviewDrawerOpen(false);
 };

 const handleRemoveReview = (index: number) => {
 setFormData(prev => {
 const newReviews = [...prev.reviews];
 newReviews.splice(index, 1);
 return { ...prev, reviews: newReviews };
 });
 };

 const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 try {
 setIsUploading(true);
 const res = await adminApi.uploadFile(file);
 if (res.success && res.data?.url) {
 setActiveReview(prev => ({ ...prev, userImage: res.data.url }));
 toast.success("Profile image uploaded!");
 } else {
 toast.error("Failed to upload image.");
 }
 } catch (error: any) {
 toast.error("Error uploading image");
 } finally {
 setIsUploading(false);
 e.target.value = '';
 }
 };

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'images' | 'affiliationDocs' = 'images') => {
 const targetElement = e.target;
 const file = targetElement.files?.[0];
 if (!file) return;

 try {
 setIsUploading(true);
 const res = await adminApi.uploadFile(file);
 if (res.success && res.data?.url) {
 if (target === 'images') {
 setFormData(prev => ({
 ...prev,
 metadata: {
 ...prev.metadata,
 images: [...(prev.metadata?.images || []), res.data.url]
 }
 }));
 } else {
 setFormData(prev => ({
 ...prev,
 affiliationDocs: [...(prev.affiliationDocs || []), res.data.url]
 }));
 }
 toast.success("File uploaded!");
 } else {
 toast.error("Failed to upload file.");
 }
 } catch (error: any) {
 toast.error(error.response?.data?.message ||"Error uploading file");
 } finally {
 setIsUploading(false);
 targetElement.value = '';
 }
 };

 const handleRemoveAffiliationDoc = (index: number) => {
 const newDocs = [...formData.affiliationDocs];
 newDocs.splice(index, 1);
 setFormData({
 ...formData,
 affiliationDocs: newDocs
 });
 };

 const handleRemoveImage = (index: number) => {
 const newImages = [...formData.metadata.images];
 newImages.splice(index, 1);
 setFormData({
 ...formData,
 metadata: { ...formData.metadata, images: newImages }
 });
 };

 const handleSave = () => {
 saveMutation.mutate(formData);
 };

 if (isLoading) {
 return (
 <div className="space-y-6 animate-pulse pb-20 mx-auto">
 <div className="flex items-center gap-4">
 <Skeleton className="h-10 w-10 rounded-md"/>
 <div className="space-y-2">
 <Skeleton className="h-6 w-48"/>
 <Skeleton className="h-4 w-64"/>
 </div>
 </div>
 
 <div className="flex w-full items-center mb-8 gap-4">
 <Skeleton className="h-12 flex-1"/>
 <Skeleton className="h-12 flex-1"/>
 <Skeleton className="h-12 flex-1"/>
 </div>

 <Skeleton className="h-[400px] w-full rounded-xl"/>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fade-in pb-20 mx-auto">
 <div className="flex items-center gap-4">
 <Button variant="ghost"size="icon"asChild>
 <Link to="/admin/laboratories"><ArrowLeft className="h-5 w-5"/></Link>
 </Button>
 <div>
 <h1 className="text-2xl font-bold text-foreground">
 {isEditing ?"Edit Laboratory":"Onboard New Laboratory"}
 </h1>
 <p className="text-sm text-muted-foreground">
 {isEditing ?"Update laboratory information and settings.":"Add a new FSSAI or NABL accredited laboratory to the network."}
 </p>
 </div>
 </div>

 <div className="flex w-full items-center mb-8 overflow-x-auto">
 {stepLabels.map((label, i) => {
 const isCompleted = i < step;
 const isActive = i === step;
 
 return (
 <div 
 key={i} 
 onClick={() => setStep(i)}
 className={cn(
"flex-1 flex items-center justify-between py-4 px-4 md:px-6 border-b-2 transition-all cursor-pointer hover:bg-muted/30",
 isCompleted ?"border-litmus-emerald": isActive ?"border-primary":"border-muted"
 )}
 >
 <div className="flex items-center gap-3">
 <span className={cn(
"text-2xl font-bold",
 isCompleted ?"text-litmus-emerald": isActive ?"text-primary":"text-muted-foreground/50"
 )}>
 {(i + 1).toString().padStart(2, '0')}
 </span>
 <span className={cn(
"text-sm font-semibold whitespace-nowrap",
 isCompleted ?"text-foreground": isActive ?"text-primary":"text-muted-foreground"
 )}>
 {label}
 </span>
 </div>
 {isCompleted && <CheckCircle2 className="h-5 w-5 text-litmus-emerald"/>}
 </div>
 );
 })}
 </div>

 <Card className="border-0 shadow-md">
 <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
 <CardTitle className="text-xl flex items-center gap-2">
 {step === 0 && <Beaker className="h-5 w-5 text-primary"/>}
 {step === 1 && <MapPin className="h-5 w-5 text-primary"/>}
 {step === 2 && <Shield className="h-5 w-5 text-primary"/>}
 {step === 3 && <Star className="h-5 w-5 text-primary"/>}
 {step === 4 && <Receipt className="h-5 w-5 text-primary"/>}
 {stepLabels[step]}
 </CardTitle>
 <CardDescription>
 {step === 0 &&"Provide the fundamental details about the laboratory."}
 {step === 1 &&"Specify the exact map location and upload photos of the facility."}
 {step === 2 &&"Detail the lab's infrastructure, analytical capabilities, and logistical support."}
 {step === 3 &&"Manage institutional and customer reviews."}
 {step === 4 &&"Select the tests they provide and configure base pricing."}
 </CardDescription>
 </CardHeader>
 <CardContent className="pt-6 space-y-6">
 {step === 0 && (
 <div className="space-y-6 animate-fade-in">
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Lab Name <span className="text-destructive">*</span></Label>
 <Input name="labName"value={formData.labName} onChange={handleChange} placeholder="e.g. Chennai Food Testing Lab"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">NABL Accreditation Number</Label>
 <Input name="nablAccreditationNumber"value={formData.nablAccreditationNumber} onChange={handleChange} placeholder="e.g. TC-XXXX"className="bg-background/50"/>
 </div>
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Contact Email</Label>
 <Input name="contactEmail"value={formData.contactEmail} onChange={handleChange} placeholder="lab@email.com"type="email"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Contact Phone <span className="text-destructive">*</span></Label>
 <Input name="contactPhone"value={formData.contactPhone} onChange={handleChange} placeholder="+91 44 2345 6789"className="bg-background/50"/>
 </div>
 </div>
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Password (Optional)</Label>
 <Input name="password"type="text"value={formData.password} onChange={handleChange} placeholder="Leave blank to auto-generate"className="bg-background/50"/>
 <p className="text-xs text-muted-foreground">If left blank, a password will be automatically generated.</p>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Starting Year</Label>
 <Input name="startingYear"type="number"value={formData.startingYear} onChange={handleChange} placeholder="e.g. 2015"className="bg-background/50"/>
 </div>
 </div>
 <div className="space-y-2 pt-2 border-t border-border/50">
 <Label className="text-sm font-medium">Additional Details</Label>
 <textarea 
 name="additionalDetails"
 value={formData.additionalDetails} 
 onChange={handleChange as any} 
 placeholder="Any other information or special requirements..."
 className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 />
 </div>
 <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
 <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
 <div>
 <Label className="text-base font-medium">NABL Accredited</Label>
 <p className="text-sm text-muted-foreground mt-1">Has valid NABL certification.</p>
 </div>
 <Switch checked={formData.isNablAccredited} onCheckedChange={(c) => handleSwitchChange("isNablAccredited", c)} />
 </div>
 <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
 <div>
 <Label className="text-base font-medium">FSSAI Approved</Label>
 <p className="text-sm text-muted-foreground mt-1">Is an approved FSSAI notified lab.</p>
 </div>
 <Switch checked={formData.isFssaiApproved} onCheckedChange={(c) => handleSwitchChange("isFssaiApproved", c)} />
 </div>
 </div>
 <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
 <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
 <div>
 <Label className="text-base font-medium text-primary">Trusted Partner</Label>
 <p className="text-sm text-muted-foreground mt-1">Mark this laboratory as a trusted partner.</p>
 </div>
 <Switch checked={formData.isTrusted} onCheckedChange={(c) => handleSwitchChange("isTrusted", c)} />
 </div>
 <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
 <div>
 <Label className="text-base font-medium">Auto Booking</Label>
 <p className="text-sm text-muted-foreground mt-1">Automatically approve user bookings for this lab.</p>
 </div>
 <Switch checked={formData.isAutoBooking} onCheckedChange={(c) => handleSwitchChange("isAutoBooking", c)} />
 </div>
 </div>
 </div>
 )}

 {step === 1 && (
 <div className="space-y-8 animate-fade-in">
 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Physical Location</h3>
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2 md:col-span-2">
 <Label className="text-sm font-medium">Full Address</Label>
 <Input name="address"value={formData.location.address} onChange={handleLocationChange} placeholder="123, Lab Street, Industrial Area"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">City</Label>
 <Input name="city"value={formData.location.city} onChange={handleLocationChange} placeholder="Chennai"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">State</Label>
 <Input name="state"value={formData.location.state} onChange={handleLocationChange} placeholder="Tamil Nadu"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Latitude (Optional)</Label>
 <Input name="lat"value={formData.location.lat} onChange={handleLocationChange} placeholder="13.0827"className="bg-background/50"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Longitude (Optional)</Label>
 <Input name="lng"value={formData.location.lng} onChange={handleLocationChange} placeholder="80.2707"className="bg-background/50"/>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Facility Images</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {formData.metadata?.images?.map((img: string, i: number) => (
 <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
 <img src={img} alt="Lab facility"className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
 <Button variant="destructive"size="sm"onClick={() => handleRemoveImage(i)}>Remove</Button>
 </div>
 </div>
 ))}
 <label 
 className={cn(
"flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors aspect-video text-primary cursor-pointer",
 isUploading &&"opacity-50 cursor-not-allowed"
 )}
 >
 <input 
 type="file"
 accept="image/*"
 className="hidden"
 onChange={(e) => handleFileUpload(e, 'images')} 
 disabled={isUploading} 
 />
 {isUploading ? (
 <span className="text-sm font-medium animate-pulse">Uploading...</span>
 ) : (
 <>
 <Upload className="h-6 w-6"/>
 <span className="text-sm font-medium">Upload Image</span>
 </>
 )}
 </label>
 </div>
 <p className="text-xs text-muted-foreground mt-2">Uploading high-quality images of the facility increases trust among food businesses.</p>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Affiliation Documents</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {formData.affiliationDocs?.map((doc: string, i: number) => (
 <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted flex flex-col items-center justify-center p-4">
 <div className="text-center truncate w-full text-xs break-all z-10 font-medium"title={doc}>{doc.split('/').pop()}</div>
 {doc.match(/\.(jpeg|jpg|gif|png)$/i) && <img src={doc} alt="Doc"className="absolute inset-0 w-full h-full object-cover opacity-20"/>}
 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
 <Button variant="destructive"size="sm"onClick={() => handleRemoveAffiliationDoc(i)}>Remove</Button>
 </div>
 </div>
 ))}
 <label 
 className={cn(
"flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors aspect-video text-primary cursor-pointer",
 isUploading &&"opacity-50 cursor-not-allowed"
 )}
 >
 <input 
 type="file"
 accept=".pdf,image/*"
 className="hidden"
 onChange={(e) => handleFileUpload(e, 'affiliationDocs')} 
 disabled={isUploading} 
 />
 {isUploading ? (
 <span className="text-sm font-medium animate-pulse">Uploading...</span>
 ) : (
 <>
 <Upload className="h-6 w-6"/>
 <span className="text-sm font-medium text-center">Upload Document<br/>(PDF/Image)</span>
 </>
 )}
 </label>
 </div>
 <p className="text-xs text-muted-foreground mt-2">Upload any certifications, affiliation documents, or licenses.</p>
 </div>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-8 animate-fade-in">
 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Overview & Analytics</h3>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Diagnostic Excellence Overview</Label>
 <textarea 
 name="overview"
 value={formData.overview} 
 onChange={handleChange as any} 
 placeholder="Describe the laboratory's legacy, precision, and excellence..."
 className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 />
 </div>
 <div className="grid md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium text-muted-foreground">Tests Conducted (Auto-generated)</Label>
 <Input name="testsConducted"type="number"value={formData.testsConducted} readOnly placeholder="Auto-calculated"className="bg-muted cursor-not-allowed opacity-70"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium text-muted-foreground">Accuracy Rate (%) (Auto-generated)</Label>
 <Input name="accuracyRate"type="number"step="0.01"value={formData.accuracyRate} readOnly placeholder="Auto-calculated"className="bg-muted cursor-not-allowed opacity-70"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium">Total Scientists</Label>
 <Input name="employeeCount"type="number"value={formData.employeeCount} onChange={handleChange} placeholder="e.g. 42"className="bg-background/50"/>
 </div>
 </div>
 <div className="grid md:grid-cols-2 gap-6 pt-2">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Activity Status</Label>
 <select
 name="activityStatus"
 value={formData.activityStatus}
 onChange={handleChange as any}
 className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <option value=""disabled>Select a status</option>
 {activityStatuses.map((status: any) => (
 <option key={status._id} value={status.name}>{status.name}</option>
 ))}
 </select>
 </div>
 </div>
 </div>

 <div className="space-y-4 pt-4 border-t border-border/50">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Expertise Areas</h3>
 <div className="space-y-2">
 <div className="flex gap-2">
 <Input 
 placeholder="e.g. Dairy, Water, Chemical (Press Enter to add)"
 className="bg-background/50 max-w-md"
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 const val = e.currentTarget.value.trim();
 if (val && formData.expertiseArea.length < 4 && !formData.expertiseArea.includes(val)) {
 setFormData(prev => ({ ...prev, expertiseArea: [...prev.expertiseArea, val] }));
 e.currentTarget.value = '';
 }
 }
 }}
 />
 <Button 
 type="button"
 variant="outline"
 onClick={(e) => {
 const input = e.currentTarget.previousElementSibling as HTMLInputElement;
 const val = input.value.trim();
 if (val && formData.expertiseArea.length < 4 && !formData.expertiseArea.includes(val)) {
 setFormData(prev => ({ ...prev, expertiseArea: [...prev.expertiseArea, val] }));
 input.value = '';
 }
 }}
 >
 Add
 </Button>
 </div>
 <p className="text-xs text-muted-foreground">Maximum 4 areas. These will be highlighted on the laboratory card.</p>
 <div className="flex flex-wrap gap-2 pt-2">
 {formData.expertiseArea.map((exp, i) => (
 <Badge key={i} variant="secondary"className="px-3 py-1 text-sm flex items-center gap-2">
 {exp}
 <button type="button"onClick={() => setFormData(prev => ({ ...prev, expertiseArea: prev.expertiseArea.filter((_, idx) => idx !== i) }))} className="hover:text-destructive">Ã—</button>
 </Badge>
 ))}
 {formData.expertiseArea.length === 0 && <span className="text-sm text-muted-foreground italic">No expertise areas added.</span>}
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Service Area & Logistics</h3>
 {logisticsOptions.length === 0 && (
 <p className="text-sm text-muted-foreground border-dashed border rounded-lg p-4 text-center">No logistics options available. Please add them in Settings.</p>
 )}
 <div className="grid sm:grid-cols-2 gap-4">
 {logisticsOptions.map((opt: any) => (
 <div key={opt._id} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/20">
 <Switch 
 checked={formData.serviceAreaLogistics?.includes(opt.name) || false} 
 onCheckedChange={(c) => handleServiceLogisticsToggle(opt.name, c)} 
 />
 <Label className="text-sm font-medium cursor-pointer leading-none">{opt.name}</Label>
 </div>
 ))}
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between border-b border-border/50 pb-2">
 <h3 className="text-lg font-semibold">Infrastructure & Equipment</h3>
 <Link to="/admin/settings"target="_blank"className="text-sm text-primary hover:underline">
 Manage Templates
 </Link>
 </div>
 {infrastructureOptions.length === 0 ? (
 <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">No infrastructure templates found. Please add them in Settings.</p>
 ) : (
 <div className="grid sm:grid-cols-2 gap-4">
 {infrastructureOptions.map((opt: any) => {
 const isSelected = formData.infrastructure?.some(i => i.title === opt.title) || false;
 return (
 <div key={opt._id} className={cn("flex items-start gap-3 p-4 border rounded-xl transition-all cursor-pointer hover:border-primary/50", isSelected ?"bg-primary/5 border-primary/50":"bg-muted/10")} onClick={() => handleInfrastructureToggle(opt, !isSelected)}>
 <div className="pt-1">
 <Switch 
 checked={isSelected} 
 onCheckedChange={(c) => handleInfrastructureToggle(opt, c)} 
 onClick={(e) => e.stopPropagation()}
 />
 </div>
 <div>
 <h4 className="font-semibold text-sm">{opt.title}</h4>
 <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 )}

 {step === 3 && (
 <div className="space-y-6 animate-fade-in">
 <div className="flex items-center justify-between border-b border-border/50 pb-4">
 <div>
 <h3 className="text-lg font-semibold">Institutional Reviews</h3>
 <p className="text-sm text-muted-foreground">Add and manage reviews that will be displayed on the laboratory's public profile.</p>
 </div>
 <Button type="button"onClick={() => handleOpenReviewDrawer()} className="bg-primary hover:bg-primary-deep text-white shadow-md">
 + Add Review
 </Button>
 </div>

 {(!formData.reviews || formData.reviews.length === 0) ? (
 <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
 No reviews added yet. Click"Add Review"to create one.
 </div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Reviewer</TableHead>
 <TableHead>Role</TableHead>
 <TableHead>Rating</TableHead>
 <TableHead>Verified</TableHead>
 <TableHead>Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {formData.reviews.map((review, index) => (
 <TableRow key={index}>
 <TableCell className="font-medium flex items-center gap-3">
 <Avatar className="h-8 w-8">
 <AvatarImage src={review.userImage ||""} />
 <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
 </Avatar>
 {review.reviewerName}
 </TableCell>
 <TableCell>{review.reviewerRole}</TableCell>
 <TableCell>
 <div className="flex items-center gap-1 text-yellow-500">
 {review.rating} <Star className="h-3 w-3 fill-current"/>
 </div>
 </TableCell>
 <TableCell>
 {review.isVerified ? (
 <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"><Shield className="h-3 w-3"/> Litmus Verified</span>
 ) : (
 <span className="text-xs text-muted-foreground">Unverified</span>
 )}
 </TableCell>
 <TableCell className="text-right">
 <Button variant="ghost"size="icon"onClick={() => handleOpenReviewDrawer(index)} className="text-primary hover:text-primary-deep hover:bg-primary/10">
 <Edit2 className="h-4 w-4"/>
 </Button>
 <Button variant="ghost"size="icon"onClick={() => handleRemoveReview(index)} className="text-destructive hover:bg-destructive/10">
 <Trash2 className="h-4 w-4"/>
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}

 <Sheet open={isReviewDrawerOpen} onOpenChange={setIsReviewDrawerOpen}>
 <SheetContent className="sm:max-w-[500px] overflow-y-auto">
 <SheetHeader className="mb-6">
 <SheetTitle>{activeReviewIndex !== null ?"Edit Review":"Add Review"}</SheetTitle>
 <SheetDescription>Fill out the reviewer's details and feedback.</SheetDescription>
 </SheetHeader>
 <div className="space-y-6">
 <div className="space-y-2">
 <Label className="text-sm font-medium">Reviewer Profile Image (Optional)</Label>
 <div className="flex items-center gap-4">
 <Avatar className="h-16 w-16 border">
 <AvatarImage src={activeReview.userImage ||""} />
 <AvatarFallback><User className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
 </Avatar>
 <div className="flex-1">
 <Label htmlFor="review-image-upload"className="cursor-pointer border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors w-full">
 {isUploading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Upload className="h-5 w-5 mb-2"/>}
 <span className="text-xs">Click to upload image</span>
 <Input id="review-image-upload"type="file"className="hidden"accept="image/*"onChange={handleReviewImageUpload} disabled={isUploading} />
 </Label>
 </div>
 </div>
 </div>
 
 <div className="space-y-2">
 <Label className="text-sm">Reviewer Name</Label>
 <Input value={activeReview.reviewerName} onChange={(e) => setActiveReview({ ...activeReview, reviewerName: e.target.value })} placeholder="e.g. Ananya Mehtre"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Reviewer Role</Label>
 <Input value={activeReview.reviewerRole} onChange={(e) => setActiveReview({ ...activeReview, reviewerRole: e.target.value })} placeholder="e.g. Organic Exports Lead"/>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label className="text-sm">Date Text</Label>
 <Input value={activeReview.date} onChange={(e) => setActiveReview({ ...activeReview, date: e.target.value })} placeholder="e.g. Just now"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Rating (1-5)</Label>
 <Input type="number"min="1"max="5"value={activeReview.rating} onChange={(e) => setActiveReview({ ...activeReview, rating: Number(e.target.value) })} />
 </div>
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Review Comment</Label>
 <textarea 
 value={activeReview.comment} 
 onChange={(e) => setActiveReview({ ...activeReview, comment: e.target.value })} 
 placeholder="e.g. The reports were automatically imported..."
 className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
 />
 </div>
 <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
 <div className="space-y-0.5">
 <Label className="text-sm font-medium">Litmus Verified Badge</Label>
 <p className="text-xs text-muted-foreground">Show official verified badge</p>
 </div>
 <Switch checked={activeReview.isVerified} onCheckedChange={(c) => setActiveReview({ ...activeReview, isVerified: c })} />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <Button variant="outline"onClick={() => setIsReviewDrawerOpen(false)}>Cancel</Button>
 <Button onClick={handleSaveReview} className="bg-primary hover:bg-primary-deep text-white">Save Review</Button>
 </div>
 </div>
 </SheetContent>
 </Sheet>
 </div>
 )}

 {step === 4 && (
 <div className="space-y-6 animate-fade-in">
 <div className="flex items-center justify-between border-b border-border/50 pb-4">
 <div>
 <h3 className="text-lg font-semibold">Available Tests</h3>
 <p className="text-sm text-muted-foreground">Select the tests this laboratory provides and set custom pricing if needed.</p>
 </div>
 </div>

 {testsLoading ? (
 <div className="space-y-4 animate-pulse">
 {Array.from({ length: 3 }).map((_, i) => (
 <Skeleton key={i} className="h-20 w-full rounded-xl"/>
 ))}
 </div>
 ) : (
 <div className="grid gap-4">
 {testsData?.data?.map((test: any) => {
 const isSelected = formData.tests.includes(test._id);
 const customPrice = formData.pricing[test._id];
 return (
 <div 
 key={test._id} 
 className={cn(
"flex flex-col gap-4 rounded-xl border p-4 transition-all",
 isSelected ?"border-primary bg-primary/5 shadow-sm":"border-border hover:border-primary/30"
 )}
 >
 <div className="flex items-start gap-3">
 <div className="pt-1">
 <Switch 
 checked={isSelected} 
 onCheckedChange={(c) => handleTestToggle(test._id, c)} 
 />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h4 className="font-semibold">{test.testName}</h4>
 <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground capitalize">
 {test.metadata?.type || 'Standard'}
 </span>
 </div>
 <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{test.description || 'No description available.'}</p>
 <div className="flex gap-4 mt-2 text-xs">
 <span className="text-muted-foreground">Platform Price: <span className="font-medium text-foreground">₹{test.price}</span></span>
 <span className="text-muted-foreground">Method: <span className="font-medium text-foreground">{test.metadata?.method || 'N/A'}</span></span>
 </div>
 </div>
 </div>

 {isSelected && (
 <div className="flex flex-col gap-3 mt-4 sm:w-full bg-background/50 p-4 rounded-lg border border-border/50">
 <Label className="text-sm font-bold">Parameter-wise Pricing (₹)</Label>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {test.metadata?.parameters?.map((param: any) => {
 const currentPricing = formData.pricing[test._id] || {};
 const paramPrice = typeof currentPricing === 'object' ? currentPricing[param.name] : '';
 
 return (
 <div key={param.name} className="flex items-center justify-between gap-3 border p-2 rounded bg-white shadow-sm">
 <span className="text-xs font-medium truncate"title={param.name}>{param.name}</span>
 <Input 
 type="number"
 placeholder={param.price?.toString() ||"0"}
 value={paramPrice !== undefined ? paramPrice :""}
 onChange={(e) => handleParameterPriceChange(test._id, param.name, e.target.value)}
 className="h-7 w-20 text-right text-xs"
 />
 </div>
 )
 })}
 </div>
 {(!test.metadata?.parameters || test.metadata.parameters.length === 0) && (
 <div className="text-sm text-muted-foreground italic">No parameters defined for this test.</div>
 )}
 </div>
 )}
 </div>
 );
 })}
 {(!testsData?.data || testsData.data.length === 0) && (
 <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
 No tests found in the platform. Please add tests in Test Management first.
 </div>
 )}
 </div>
 )}
 </div>
 )}
 </CardContent>
 </Card>

 <div className="flex justify-between items-center mt-6">
 <Button variant="outline"onClick={() => setStep(step - 1)} disabled={step === 0} className="w-32">
 Back
 </Button>
 {step < 4 ? (
 <Button onClick={() => setStep(step + 1)} className="w-32 bg-primary hover:bg-primary-deep shadow-md shadow-primary/20">
 Next Step
 </Button>
 ) : (
 <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-40 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
 {saveMutation.isPending ?"Saving...": (isEditing ?"Save Changes":"Create Laboratory")}
 </Button>
 )}
 </div>
 </div>
 );
}
