import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Shield, Clock, Lock, MessageCircle, ChevronRight, Loader2, FlaskConical } from "lucide-react";
import { testApi } from "@/lib/api/test";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { toast } from "sonner";

export default function TestDetailPage() {
  const { id } = useParams();
  const [testObj, setTestObj] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const { openCart } = useCartDrawer();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const addMutation = useMutation({
    mutationFn: (data: any) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart!");
      openCart();
    },
    onError: () => {
      toast.error("Failed to add to cart");
    }
  });

  const handleAddToCart = () => {
    if (!testObj) return;
    addMutation.mutate({
      itemType: 'TEST',
      testId: testObj._id,
      parameters: selectedParams
    });
  };

  const handleBookNow = () => {
    if (!testObj) return;
    const searchParams = new URLSearchParams();
    searchParams.set("testId", testObj._id);
    if (selectedParams.length > 0) {
      searchParams.set("params", selectedParams.join(","));
    }
    navigate(`/bookings/new?${searchParams.toString()}`);
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await testApi.getTestById(id as string);
        if (response.data) {
          const fetchedTest = response.data;
          setTestObj(fetchedTest);
          
          // Auto-select all parameters initially
          const params = fetchedTest.metadata?.parameters?.map((p: any) => p.name) || [];
          setSelectedParams(params);
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTest();
  }, [id]);

  const toggleParameter = (paramName: string) => {
    setSelectedParams((prev) => 
      prev.includes(paramName) ? prev.filter((p) => p !== paramName) : [...prev, paramName]
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-9 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!testObj) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Test not found</div>;
  }

  const parameters = testObj.metadata?.parameters || [];
  const calculatedPrice = parameters.reduce((sum: number, param: any) => selectedParams.includes(param.name) ? sum + (Number(param.price) || 0) : sum, 0);
  
  const originalPrice = calculatedPrice > 0 ? calculatedPrice : (testObj.price || 0);
  
  let discountAmount = 0;
  if (testObj.discountType === 'PERCENTAGE') {
    discountAmount = originalPrice * ((testObj.discountValue || 0) / 100);
  } else if (testObj.discountType === 'FLAT') {
    discountAmount = testObj.discountValue || 0;
  }
  
  const price = Math.max(0, originalPrice - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/tests" className="hover:text-foreground">Tests</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{testObj.testName}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Test Details - Left */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex gap-2 mb-3">
              {testObj.applicableCategories?.map((c: any) => (
                <Badge key={c._id} className="bg-flame-amber-tint text-accent border-0 text-xs">{c.name}</Badge>
              ))}
              {testObj.isApplicableToAll && <Badge className="bg-flame-amber-tint text-accent border-0 text-xs">All Categories</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{testObj.testName}</h1>
            {testObj.description && <p className="text-muted-foreground mt-2">{testObj.description}</p>}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-xs text-muted-foreground mb-1">Testing Method</p>
                  <p className="font-medium text-foreground">{testObj.metadata?.method || 'Standard Method'}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1">Test Type</p>
                  {testObj.metadata?.type ? (
                    <Badge variant="outline" className="capitalize">{testObj.metadata.type}</Badge>
                  ) : (
                    <span className="font-medium text-foreground">Standard</span>
                  )}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                <FlaskConical className="h-5 w-5 text-primary" /> Test Parameters
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Select the specific parameters you want to test. All are selected by default.</p>
            </div>
            
            {parameters.length > 0 ? (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {parameters.map((param: any, idx: number) => (
                  <div key={param.name} className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${idx !== parameters.length - 1 ? 'border-b border-border' : ''}`}>
                    <Checkbox 
                      id={`param-${param.name}`}
                      checked={selectedParams.includes(param.name)}
                      onCheckedChange={() => toggleParameter(param.name)}
                      className="w-5 h-5 rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={`param-${param.name}`} 
                        className="font-medium text-foreground cursor-pointer select-none block"
                      >
                        {param.name}
                      </label>
                      <div className="flex gap-4 mt-1 items-center">
                        {param.price && (
                          <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                            ₹{param.price}
                          </span>
                        )}
                        {param.unit && <span className="text-xs text-muted-foreground">Unit: <strong className="font-medium">{param.unit}</strong></span>}
                        {(param.minLimit || param.maxLimit) && (
                          <span className="text-xs text-muted-foreground">
                            Limits: <strong className="font-medium">{param.minLimit || '0'} - {param.maxLimit || 'N/A'}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-muted/10 border border-border border-dashed rounded-xl text-muted-foreground">
                No specific parameters listed for this test.
              </div>
            )}
          </div>
        </div>

        {/* Sticky Booking Panel - Right */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28">
            <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <h3 className="font-bold text-lg text-foreground">{testObj.testName}</h3>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">₹{price.toLocaleString()}</span>
                    {originalPrice > price && (
                      <span className="text-sm text-muted-foreground line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {discountAmount > 0 && (
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md self-start border border-emerald-100">
                      {testObj.discountType === 'PERCENTAGE' ? `${testObj.discountValue}% OFF` : `₹${testObj.discountValue} OFF`} applied
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground font-medium">
                  {selectedParams.length} of {parameters.length || 1} parameters selected
                </p>

                <div className="flex items-center gap-2 text-sm text-litmus-teal bg-litmus-teal/10 p-3 rounded-lg font-medium">
                  <Clock className="h-5 w-5" />
                  Reports in {testObj.turnAroundTime || '3-5 working days'}
                </div>

                <div className="flex gap-2">
                  <Badge className="bg-litmus-dark text-primary-foreground border-0 hover:bg-litmus-dark/90">NABL</Badge>
                  <Badge className="bg-litmus-teal text-primary-foreground border-0 hover:bg-litmus-teal/90">FSSAI</Badge>
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={addMutation.isPending}
                    className="w-full bg-primary hover:bg-primary-deep rounded-lg gap-2 h-12 text-base shadow-sm">
                    {addMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />} 
                    {addMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                  
                  <Button 
                    onClick={handleBookNow}
                    disabled={addMutation.isPending}
                    variant="outline" 
                    className="w-full rounded-lg border-2 border-primary text-primary hover:bg-primary/5 hover:text-primary h-12 text-base font-semibold">
                    Book Now
                  </Button>
                </div>

                <a href="#" className="flex items-center justify-center gap-2 text-sm font-medium text-litmus-teal hover:underline pt-2">
                  <MessageCircle className="h-4 w-4" /> Need help? Chat on WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-5 border-t border-border">
                  {[
                    { icon: Shield, label: "100% Accurate" },
                    { icon: Shield, label: "NABL Certified" },
                    { icon: Lock, label: "Secure Payment" },
                    { icon: MessageCircle, label: "WhatsApp Reports" },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <b.icon className="h-4 w-4 text-accent" />
                      {b.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

