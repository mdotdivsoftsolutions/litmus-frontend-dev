import { useParams, Link, useNavigate } from"react-router-dom";
import { useQuery } from"@tanstack/react-query";
import { adminApi } from"@/lib/api/admin";
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, CheckCircle2, ShieldCheck, Banknote, CreditCard, Activity, Briefcase, Zap } from"lucide-react";
import { Button } from"@/components/ui/button";
import { Skeleton } from"@/components/ui/skeleton";
import { Badge } from"@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";
import { format } from"date-fns";

export default function LaboratoryDetailPage() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();

 const { data: labData, isLoading } = useQuery({
 queryKey: ["admin-lab", id],
 queryFn: () => adminApi.getLabById(id!),
 enabled: !!id,
 });

 const { data: bookingsData } = useQuery({
 queryKey: ["admin-bookings"],
 queryFn: () => adminApi.getBookings(),
 });

 if (isLoading) {
 return (
 <div className="p-6 space-y-6 animate-pulse">
 <div className="h-8 w-48 bg-slate-200 rounded-md"/>
 <div className="h-32 w-full bg-slate-100 rounded-xl"/>
 <div className="h-[400px] w-full bg-slate-50 rounded-xl"/>
 </div>
 );
 }

 const lab = labData?.data;
 
 if (!lab) {
 return (
 <div className="p-6 text-center text-slate-500 py-20">
 <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20"/>
 <p>Laboratory not found.</p>
 <Button variant="link"onClick={() => navigate("/admin/laboratories")}>Return to Laboratories</Button>
 </div>
 );
 }

 const allBookings = bookingsData?.data || [];
 const labBookings = allBookings.filter((b: any) => b.labId?._id === id || b.labId === id || b.laboratory?._id === id || b.laboratory === id);

 const rating = lab.reviews && lab.reviews.length > 0 
 ? (lab.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / lab.reviews.length).toFixed(1) 
 :"New";

 return (
 <div className="p-6 space-y-5 animate-fade-in mx-auto">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <Button variant="ghost"size="icon"onClick={() => navigate("/admin/laboratories")} className="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white shadow-sm">
 <ArrowLeft className="h-5 w-5 text-slate-600"/>
 </Button>
 <div>
 <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{lab.labName}</h1>
 <div className="flex items-center gap-2 mt-1.5 flex-wrap">
 <Badge variant={lab.isActive ?"default":"secondary"} className={lab.isActive ?"bg-emerald-500 hover:bg-emerald-600":""}>
 {lab.isActive ?"Active":"Inactive"}
 </Badge>
 {lab.isTrusted && <Badge variant="outline"className="bg-blue-50 text-blue-700 border-blue-200"><ShieldCheck className="h-3 w-3 mr-1"/>Trusted</Badge>}
 {lab.isNablAccredited && <Badge variant="outline"className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1"/>NABL</Badge>}
 {lab.isFssaiApproved && <Badge variant="outline"className="bg-teal-50 text-teal-700 border-teal-200"><CheckCircle2 className="h-3 w-3 mr-1"/>FSSAI</Badge>}
 {lab.isAutoBooking && <Badge variant="outline"className="bg-purple-50 text-purple-700 border-purple-200"><Zap className="h-3 w-3 mr-1"/>Auto Booking</Badge>}
 </div>
 </div>
 </div>
 <div className="flex gap-3">
 <Button variant="outline"asChild className="shadow-sm">
 <Link to={`/admin/laboratories/${lab._id}/edit`}>Edit Details</Link>
 </Button>
 <Button asChild className="bg-primary hover:bg-primary-deep shadow-md">
 <Link to={`/labs/${lab._id}`} target="_blank">View Consumer Page</Link>
 </Button>
 </div>
 </div>

 {/* Key Metrics */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <Card className="bg-white border-slate-100 shadow-sm">
 <CardContent className="p-6">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-sm font-semibold uppercase tracking-wider">Rating</span>
 <Activity className="h-4 w-4"/>
 </div>
 <div className="text-3xl font-black text-slate-900 flex items-center">
 {rating} <span className="text-yellow-500 ml-2 text-xl">★</span>
 </div>
 </CardContent>
 </Card>
 <Card className="bg-white border-slate-100 shadow-sm">
 <CardContent className="p-6">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-sm font-semibold uppercase tracking-wider">Tests Available</span>
 <FileText className="h-4 w-4"/>
 </div>
 <div className="text-3xl font-black text-slate-900">{lab.tests?.length || 0}</div>
 </CardContent>
 </Card>
 <Card className="bg-white border-slate-100 shadow-sm">
 <CardContent className="p-6">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-sm font-semibold uppercase tracking-wider">Tests Conducted</span>
 <Activity className="h-4 w-4"/>
 </div>
 <div className="text-3xl font-black text-slate-900">{lab.testsConducted !== undefined ? `${lab.testsConducted}+` :"0+"}</div>
 </CardContent>
 </Card>
 <Card className="bg-white border-slate-100 shadow-sm">
 <CardContent className="p-6">
 <div className="flex items-center justify-between text-slate-500 mb-2">
 <span className="text-sm font-semibold uppercase tracking-wider">Active Bookings</span>
 <Briefcase className="h-4 w-4"/>
 </div>
 <div className="text-3xl font-black text-slate-900">{labBookings.length}</div>
 </CardContent>
 </Card>
 </div>

 <Tabs defaultValue="overview"className="w-full">
 <TabsList className="bg-muted p-1 rounded-xl mb-3 inline-flex h-auto">
 <TabsTrigger value="overview"className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview</TabsTrigger>
 <TabsTrigger value="tests"className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Available Tests</TabsTrigger>
 <TabsTrigger value="bookings"className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Recent Bookings</TabsTrigger>
 </TabsList>

 <TabsContent value="overview"className="space-y-6">
 <div className="grid md:grid-cols-2 gap-6">
 <Card className="shadow-sm border-slate-100">
 <CardHeader className="bg-slate-50/50 border-b border-slate-100">
 <CardTitle className="text-base font-bold flex items-center gap-2">
 <MapPin className="h-4 w-4 text-primary"/> Location & Contact
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="space-y-1">
 <p className="text-sm font-medium text-slate-500">Address</p>
 <p className="font-semibold text-slate-900">{lab.location?.address ||"N/A"}</p>
 <p className="text-sm text-slate-600">{lab.location?.city}, {lab.location?.state} {lab.location?.pincode}</p>
 </div>
 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><Mail className="h-3 w-3"/> Email</p>
 <p className="text-sm font-medium break-all">{lab.contactEmail ||"N/A"}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><Phone className="h-3 w-3"/> Phone</p>
 <p className="text-sm font-medium">{lab.contactPhone ||"N/A"}</p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card className="shadow-sm border-slate-100">
 <CardHeader className="bg-slate-50/50 border-b border-slate-100">
 <CardTitle className="text-base font-bold flex items-center gap-2">
 <Banknote className="h-4 w-4 text-primary"/> Business & Banking
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase">GST Number</p>
 <p className="text-sm font-medium font-mono">{lab.businessDetails?.gstNumber ||"N/A"}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase">PAN Number</p>
 <p className="text-sm font-medium font-mono">{lab.businessDetails?.panNumber ||"N/A"}</p>
 </div>
 </div>
 <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1"><CreditCard className="h-3 w-3"/> Bank Name</p>
 <p className="text-sm font-medium">{lab.bankDetails?.bankName ||"N/A"}</p>
 </div>
 <div className="space-y-1">
 <p className="text-xs font-semibold text-slate-500 uppercase">IFSC Code</p>
 <p className="text-sm font-medium font-mono">{lab.bankDetails?.ifscCode ||"N/A"}</p>
 </div>
 <div className="space-y-1 col-span-2">
 <p className="text-xs font-semibold text-slate-500 uppercase">Account Number</p>
 <p className="text-sm font-medium font-mono">{lab.bankDetails?.accountNumber ||"N/A"}</p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card className="shadow-sm border-slate-100 md:col-span-2">
 <CardHeader className="bg-slate-50/50 border-b border-slate-100">
 <CardTitle className="text-base font-bold flex items-center gap-2">
 <ShieldCheck className="h-4 w-4 text-primary"/> Licenses & Certifications
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2 border border-slate-100 p-4 rounded-xl">
 <h4 className="font-bold text-slate-900">FSSAI License</h4>
 <p className="text-sm text-slate-500 font-mono">{lab.licenses?.fssaiNumber ||"Not Provided"}</p>
 </div>
 <div className="space-y-2 border border-slate-100 p-4 rounded-xl">
 <h4 className="font-bold text-slate-900">NABL Certificate</h4>
 <p className="text-sm text-slate-500 font-mono">{lab.licenses?.nablNumber ||"Not Provided"}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </TabsContent>

 <TabsContent value="tests">
 <Card className="shadow-sm border-slate-100">
 <CardHeader className="bg-slate-50/50 border-b border-slate-100">
 <CardTitle className="text-base font-bold">Available Tests & Pricing</CardTitle>
 </CardHeader>
 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-100">
 <tr>
 <th className="px-6 py-4">Test Name</th>
 <th className="px-6 py-4">Standard Price</th>
 <th className="px-6 py-4">Lab Custom Price</th>
 <th className="px-6 py-4">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {lab.tests && lab.tests.length > 0 ? (
 lab.tests.map((test: any) => {
 const standardPrice = test.offerPrice || test.price;
 const customPrice = lab.pricing?.testOverrides?.[test._id];
 return (
 <tr key={test._id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-900">{test.testName}</td>
 <td className="px-6 py-4 text-slate-500">₹{standardPrice?.toLocaleString('en-IN') ||"N/A"}</td>
 <td className="px-6 py-4">
 {customPrice !== undefined ? (
 <span className="font-bold text-emerald-600">₹{customPrice.toLocaleString('en-IN')}</span>
 ) : (
 <span className="text-slate-400">—</span>
 )}
 </td>
 <td className="px-6 py-4">
 <Badge variant="outline"className="bg-slate-50">Active</Badge>
 </td>
 </tr>
 );
 })
 ) : (
 <tr>
 <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No tests configured for this laboratory.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 <TabsContent value="bookings">
 <Card className="shadow-sm border-slate-100">
 <CardHeader className="bg-slate-50/50 border-b border-slate-100">
 <CardTitle className="text-base font-bold">Recent Bookings</CardTitle>
 </CardHeader>
 <CardContent className="p-0">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-100">
 <tr>
 <th className="px-6 py-4">Booking ID</th>
 <th className="px-6 py-4">Date</th>
 <th className="px-6 py-4">Status</th>
 <th className="px-6 py-4">Amount</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {labBookings.length > 0 ? (
 labBookings.map((booking: any) => (
 <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 font-mono text-xs text-slate-600">{booking.bookingId || booking._id.substring(0, 8).toUpperCase()}</td>
 <td className="px-6 py-4">{booking.createdAt ? format(new Date(booking.createdAt),"dd MMM yyyy") :"N/A"}</td>
 <td className="px-6 py-4">
 <Badge variant="outline"className="uppercase text-[10px] tracking-wider">{booking.status}</Badge>
 </td>
 <td className="px-6 py-4 font-medium">₹{booking.totalAmount?.toLocaleString('en-IN') ||"0"}</td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No bookings found for this laboratory.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}
