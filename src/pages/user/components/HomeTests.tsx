import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { products } from "@/lib/placeholder-data";
import { Activity, FileText, Check, Loader2, CheckCircle2, Beaker } from "lucide-react";
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
  className?: string;
};

export const TestCard = ({ p, t, className }: TestCardProps) => {
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
  const itemType = isTest ? 'TEST' : 'PACKAGE';

  const name = t?.testName || t?.name || p?.name || "Food Safety Test";
  const parametersCount = t?.metadata?.parameters?.length || t?.testCount || p?.testCount || 0;

  // For tests offerPrice is the selling price, price is MRP. For packages, price is selling price, mrp is MRP.
  const price = t?.offerPrice ? t.offerPrice : (t?.price || (p?.testCount ? p.testCount * 150 + 999 : 999));
  const mrp = isTest ? t?.price : (t?.mrp || (p?.testCount ? p.testCount * 260 + 1500 : 1500));

  const discount = discountPct(price, mrp);
  const turnAroundTime = t?.turnAroundTime || t?.tat || "2-3 Days";

  const topBadgeLeft = t?.category || "COMPLIANCE";
  const topBadgeRight = t?.isPopular ? "MOST POPULAR" : (t?.tag || (p as any)?.badge);

  const description = t?.description || "Essential testing parameters for small-scale food manufacturers and businesses.";
  const features = t?.metadata?.parameters?.slice(0, 4) || t?.features?.slice(0, 4) || [
    "Microbial Load Analysis",
    "Moisture & Ash Content",
    "Heavy Metal Screening",
    "Shelf Life Prediction"
  ];

  // Support for custom icons/images
  const iconUrl = t?.image || t?.imageUrl || t?.icon;

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
      className={cn("group m-2 flex w-[385px] shrink-0 flex-col overflow-hidden bg-white rounded-[1rem] p-5 md:p-6 border-2 border-slate-50 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-[#D32F2F]/20 transition-all duration-500 gap-5 cursor-pointer decoration-transparent", className)}
    >
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest line-clamp-1 max-w-[50%]">
            {topBadgeLeft}
          </span>
          {topBadgeRight && (
            <span className="bg-red-50 text-[#D32F2F] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {topBadgeRight}
            </span>
          )}
        </div>

        {/* Title, Icon & Description */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors line-clamp-2">
              {name}
            </h3>
            <p className="text-slate-500 mt-1 font-medium text-[11px] leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          {/* Custom Icon / Image slot */}
          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100/50 overflow-hidden shadow-sm">
            {iconUrl ? (
              <img src={iconUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <Beaker className="h-6 w-6 text-[#007b8a]/40" />
            )}
          </div>
        </div>

        {/* Parameters & Reports Box */}
        <div className="flex gap-4 py-4 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Activity className="h-4 w-4 text-[#F06C00]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Parameters</p>
              <p className="text-xs font-bold text-slate-800 mt-1">{parametersCount}+ Items</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#D32F2F]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Reports</p>
              <p className="text-xs font-bold text-slate-800 mt-1">{turnAroundTime}</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-2">
          {features.map((feature: any, idx: number) => (
            <div key={idx} className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[10px] text-slate-600 font-medium leading-tight line-clamp-2">
                {typeof feature === 'string' ? feature : feature.name || "Test parameter"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-auto bg-slate-50 rounded-xl p-4 flex items-center justify-between">
        <div>
          {discount > 0 ? (
            <span className="text-[10px] text-slate-400 line-through font-bold block">₹{mrp?.toLocaleString()}</span>
          ) : (
            <span className="text-[10px] text-transparent block">No MRP</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-800 tracking-tighter">₹{price?.toLocaleString()}</span>
            {discount > 0 && (
              <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-200">
                {discount}% Off
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isInCart || addMutation.isPending}
          className={cn(
            "inline-flex items-center justify-center h-10 px-5 rounded-lg text-white font-bold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all gap-1.5",
            isInCart
              ? "bg-[#e8f6fa] text-brand-card-from border border-brand-card-to/25 cursor-not-allowed shadow-none hover:shadow-none hover:translate-y-0 text-brand-card-to"
              : "bg-brand-action hover:bg-brand-action-hover"
          )}
        >
          {addMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
          {!addMutation.isPending && isInCart && <Check className="h-3 w-3" />}
          {isInCart ? "In Cart" : (itemType === 'PACKAGE' ? "Book Panel" : "Book")}
        </button>
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
      <section className="pt-8 lg:pt-16 pb-10 relative overflow-hidden bg-slate-50">
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
