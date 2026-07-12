import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { products } from "@/lib/placeholder-data";
import { Activity, FileText,  Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./home/SectionHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/package";
import { cartApi } from "@/lib/api/cart";
import { authApi } from "@/lib/api/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCartDrawer } from "@/components/cart/CartDrawerContext";

type Product = (typeof products)[number];

export type TestCardProps = {
  p?: Product;
  t?: any;
  cartItems?: Record<string, number>;
  addToCart?: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart?: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

export const TestCard = ({ p, t }: TestCardProps) => {
  const queryClient = useQueryClient();
  const { openCart } = useCartDrawer();

  const discountPct = (price: number, mrp: number) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };
  
  const id = t?._id || p?.id || "unknown";
  
  // Determine if this is a package or a test
  const isPackage = t && (t.name !== undefined || t.category !== undefined);
  const isTest = t && t.testName !== undefined;
  const itemType = isTest ? 'TEST' : 'PACKAGE'; // Default mock products to PACKAGE

  const name = t?.testName || t?.name || p?.name || "Food Safety Test";
  const parametersCount = t?.metadata?.parameters?.length || t?.testCount || p?.testCount || 0;
  
  // For tests offerPrice is the selling price, price is MRP. For packages, price is selling price, mrp is MRP.
  const price = t?.offerPrice ? t.offerPrice : (t?.price || (p?.testCount ? p.testCount * 150 + 999 : 999));
  const mrp = isTest ? t?.price : (t?.mrp || (p?.testCount ? p.testCount * 260 + 1500 : 1500));
  
  const discount = discountPct(price, mrp);
  const turnAroundTime = t?.turnAroundTime || t?.tat || "2-3 Days";
  const badgeText = t?.tag || (p as any)?.badge || (t?.isPopular ? "Popular" : null);

  const { data: cartResponse } = useQuery({ queryKey: ['cart'], queryFn: cartApi.getCart });
  const cartItems = cartResponse?.data?.items || [];
  
  // Determine if this item is in the cart
  const isInCart = cartItems.some((item: any) => 
    (item.itemType === 'TEST' && item.testId?._id === id) || 
    (item.itemType === 'PACKAGE' && item.packageId?._id === id)
  );

  const addMutation = useMutation({
    mutationFn: (data: any) => cartApi.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart!");
      openCart();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  });

  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const user = userResponse?.data;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    if (isInCart || addMutation.isPending) return;
    addMutation.mutate({
      itemType,
      ...(itemType === 'TEST' ? { testId: id } : { packageId: id }),
      parameters: []
    });
  };

  return (
    <Link
      to={itemType === 'TEST' ? `/tests/${id}` : `/packages/${id}`}
      className="group m-2 flex w-[385px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-brand-card-from/10 bg-white shadow-[0_2px_12px_-2px_rgb(var(--brand-card-rgb)/0.08)] transition-all hover:-translate-y-1 hover:border-brand-card-to/25 hover:shadow-[0_16px_40px_-12px_rgb(var(--brand-card-rgb)/0.22)]"
    >
      <div className="relative flex h-[120px] flex-col justify-end rounded-b-[1.25rem] bg-gradient-card p-5 pb-5 text-white shadow-[0_6px_24px_-4px_rgb(var(--brand-card-rgb)/0.45)] transition-colors">
        {badgeText && (
          <div className="absolute right-4 top-0 rounded-b-md bg-gradient-card-badge px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_12px_rgb(var(--brand-card-rgb)/0.35)]">
            {badgeText}
          </div>
        )}
        <div className="flex items-start justify-between">
          <h3 className="w-3/5 pr-2 text-lg font-semibold leading-tight tracking-tight">{name}</h3>
          <div className="flex flex-col items-end pt-1">
            <div className="flex items-center gap-1.5">
              {discount > 0 && <span className="text-[11px] text-white/70 line-through">₹{mrp?.toLocaleString()}</span>}
              <span className="text-[1.50rem] font-extrabold tracking-tight drop-shadow-sm">₹{price?.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <span className="mt-0.5 rounded bg-gradient-brand px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white shadow-[0_2px_8px_rgb(var(--brand-card-rgb)/0.35)]">
                {discount}% Off
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-gradient-to-b from-[#f4fafc] to-white p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex w-1/2 items-start gap-3">
            <div className="mt-0.5 text-brand-card-to/55">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] leading-none text-slate-800">{parametersCount} parameters</p>
              <p className="mt-1 text-[11px] text-brand-card-from/55">included</p>
            </div>
          </div>
          <div className="flex w-1/2 items-start gap-3 border-l border-brand-card-to/15 pl-4">
            <div className="mt-0.5 text-brand-card-to/55">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] leading-none text-brand-card-from/55">Reports within</p>
              <p className="mt-1 text-[13px] text-slate-800">{turnAroundTime}</p>
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3">
          <button
            type="button"
            className="h-11 flex-1 rounded-xl border border-brand-card-from/35 bg-white/80 text-sm font-semibold text-brand-card-from transition-colors hover:border-brand-card-to hover:bg-brand-card-to/10 focus:outline-none"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isInCart || addMutation.isPending}
            className={cn(
              "h-11 flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all focus:outline-none",
              isInCart 
                ? "bg-[#e8f6fa] text-brand-card-from border border-brand-card-to/25 cursor-not-allowed" 
                : "bg-gradient-to-r from-brand-card-from to-brand-card-to text-white shadow-[0_4px_16px_-2px_rgb(var(--brand-card-rgb)/0.45)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgb(var(--brand-card-rgb)/0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            )}
          >
            {addMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {!addMutation.isPending && isInCart && <Check className="h-4 w-4" />}
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
};


export type HomeTestsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

export const HomeTests = ({ activeTab, setActiveTab, cartItems, addToCart, removeFromCart }: HomeTestsProps) => {
  const { data: popularPackagesData, isLoading } = useQuery({
    queryKey: ['popularPackages'],
    queryFn: () => packageApi.getAllPackages()
  });

  const popularPackages = popularPackagesData?.data || [];
  // Take first 3 for UI, ideally should have isPopular param
  const displayPackages = popularPackages.slice(0, 3);

  return (
    <>
      <section className="pt-16 pb-10  relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <SectionHeader
            title={
              <>
                Popular Food Testing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Packages</span>
              </>
            }
            subtitle="Our curated packages simplify food testing with pre-designed testing packages tailored to different product categories and help you save time, reduce costs, and ensure that critical parameters are not overlooked."
            action={{
              label: "View All Packages",
              href: "/packages",
            }}
          />

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-5 pt-2 -mx-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="m-2 flex w-[385px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-brand-card-from/10 bg-white">
                  <div className="h-[120px] bg-slate-100 rounded-b-[1.25rem] p-5 flex flex-col justify-end">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col bg-gradient-to-b from-[#f4fafc] to-white">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="w-1/2">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <div className="w-1/2 pl-4 border-l border-slate-100">
                        <Skeleton className="h-3 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <Skeleton className="h-11 flex-1 rounded-xl" />
                      <Skeleton className="h-11 flex-1 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))
            ) : displayPackages.length > 0 ? (
              displayPackages.map((t: any) => (
                <TestCard key={`popular-pkg-${t._id}`} t={t} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />
              ))
            ) : (
              <div className="w-full text-center py-10 text-muted-foreground">
                No popular packages found.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
