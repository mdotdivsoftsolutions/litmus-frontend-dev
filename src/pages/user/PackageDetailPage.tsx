import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Shield, 
  Lock, 
  MessageCircle, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  FlaskConical,
  Award,
  ShoppingCart,
  Loader2,
  Check
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/package";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { WHATSAPP_URL } from "@/lib/constants";

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openCart } = useCartDrawer();
  const queryClient = useQueryClient();

  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const user = userResponse?.data;

  const { data: cartResponse } = useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart });
  const cartItems = cartResponse?.data?.items || [];
  
  const isInCart = cartItems.some((item: any) => 
    item.itemType === 'PACKAGE' && item.packageId?._id === id
  );

  const { data: packageResponse, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => packageApi.getPackage(id!),
    enabled: !!id,
  });

  const pkg = packageResponse?.data;

  const discountPct = (price: number, mrp: number) => {
    if (!mrp || !price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleBookNow = () => {
    if (!user) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    if (!pkg) return;
    navigate(`/bookings/new?packageId=${pkg._id}`);
  };

  const addMutation = useMutation({
    mutationFn: (data: any) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Package added to cart!");
      openCart();
    },
    onError: () => {
      toast.error("Failed to add to cart");
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    if (!pkg || isInCart || addMutation.isPending) return;
    addMutation.mutate({
      itemType: 'PACKAGE',
      packageId: pkg._id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8">
         <Skeleton className="h-12 w-64 mb-8" />
         <div className="flex gap-8 w-full max-w-7xl">
            <Skeleton className="h-[400px] flex-1 rounded-xl" />
            <Skeleton className="h-[400px] w-[350px] rounded-xl" />
         </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Package Not Found</h2>
          <p className="text-slate-500 mt-2">The package you are looking for does not exist.</p>
          <Button className="mt-6" onClick={() => navigate("/packages")}>Back to Packages</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fade-in font-inter">
      {/* 1. Glassy Breadcrumb Section */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <Link to="/packages" className="hover:text-[#D32F2F] transition-colors">Packages</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">{pkg.name}</span>
          </nav>
          
          <Button 
            onClick={handleBookNow}
            className="hidden sm:flex h-9 px-5 rounded-lg bg-gradient-to-r from-brand-card-from to-brand-card-to text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            Book Panel Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 ">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Info Section - Left */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Title Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D32F2F]/5 to-[#F06C00]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {pkg.category}
                </span>
                {pkg.tag && (
                  <span className="bg-red-50 text-[#D32F2F] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-100/50">
                    {pkg.tag}
                  </span>
                )}
              </div>
              
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                {pkg.name}
              </h1>
              
              <p className="text-slate-500 mt-1 text-sm font-medium leading-relaxed max-w-3xl">
                {pkg.description}
              </p>

              {/* Lab Parameters Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Activity className="h-5 w-5 text-[#F06C00]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Parameters</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{pkg.testCount}+ Items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-[#D32F2F]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Reports TAT</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{pkg.tat}</p>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Accreditation</p>
                    <p className="text-sm font-black text-slate-800 mt-1">NABL / FSSAI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Parameters / What's Tested */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-[#D32F2F]" /> What&apos;s Included inside the Panel?
                </h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Critical testing parameters and analytes analyzed in this package</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {pkg.tests && pkg.tests.length > 0 ? (
                  pkg.tests.map((test: any, i: number) => (
                    <div key={test._id || i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-white hover:border-[#D32F2F]/20 border border-slate-100 transition-all duration-300 group">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-sm text-slate-700 font-bold block">{test.testName}</span>
                        <div className="mt-1">
                          {test.offerPrice && test.price > test.offerPrice ? (
                            <span className="text-[11px] text-slate-400 font-medium line-through mr-2">₹{test.price.toLocaleString()}</span>
                          ) : null}
                          <span className="text-[11px] text-[#D32F2F] font-bold">₹{(test.offerPrice || test.price || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  pkg.features?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-white hover:border-[#D32F2F]/20 border border-slate-100 transition-all duration-300 group">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-sm text-slate-700 font-bold block">{feature}</span>
                        <span className="text-[11px] text-slate-400 font-medium">Standard analytical testing method</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* General FAQs & Information */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-slate-700" /> Frequently Asked Questions
              </h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1" className="border-b border-slate-100 py-1">
                  <AccordionTrigger className="text-slate-800 font-bold hover:no-underline hover:text-[#D32F2F] text-left">
                    What is the sample size requirement for this package?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm font-medium">
                    Typically, we require a minimum of 200g to 500g of the packaged food or liquid sample in its original retail package. For custom container samples, please ensure it is tightly sealed in a sterile container.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-2" className="border-b border-slate-100 py-1">
                  <AccordionTrigger className="text-slate-800 font-bold hover:no-underline hover:text-[#D32F2F] text-left">
                    How is the sample collected?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm font-medium">
                    Once you finalize the booking, our specialized sample collection executives will pick up the sample from your facility in specialized cold-chain insulated bags to maintain temperature integrity during transit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border-0 py-1">
                  <AccordionTrigger className="text-slate-800 font-bold hover:no-underline hover:text-[#D32F2F] text-left">
                    Are the reports valid for FSSAI / legal compliance?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed text-sm font-medium">
                    Yes, all testing is conducted in NABL accredited and FSSAI notified laboratories. The reports generated will carry official NABL holograms and QR codes, which are 100% compliant for FSSAI submissions, audits, and certifications.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Sticky Booking Sidebar - Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-slate-800 tracking-tight">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">{pkg.category} Panel</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100/50">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Original Price</span>
                    <span className="text-sm text-slate-400 line-through font-bold">₹{pkg.mrp.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-slate-600 font-bold">Litmus Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-800 tracking-tighter">₹{pkg.price.toLocaleString()}</span>
                      <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200/50">
                        {discountPct(pkg.price, pkg.mrp)}% Off
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <Clock className="h-4 w-4 text-[#F06C00]" />
                    <span>Reports guaranteed in {pkg.tat}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>100% NABL Accredited Laboratory</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <Lock className="h-4 w-4 text-slate-600" />
                    <span>Secure Cold Chain Sample Logistics</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isInCart || addMutation.isPending}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 hover:text-primary font-extrabold text-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : isInCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />} 
                    {isInCart ? "In Cart" : "Add to Cart"}
                  </Button>

                  <Button 
                    onClick={handleBookNow}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-card-from to-brand-card-to hover:shadow-lg text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 group"
                  >
                    Book Panel Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <a 
                    href={WHATSAPP_URL} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-500 fill-emerald-500" /> WhatsApp Support
                  </a>
                </div>

                {/* Additional Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Award className="h-5 w-5 text-[#D32F2F] mb-1" />
                    <span className="text-[10px] text-slate-700 font-bold">FSSAI Approved</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center">
                    <Shield className="h-5 w-5 text-emerald-600 mb-1" />
                    <span className="text-[10px] text-slate-700 font-bold">ISO Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
