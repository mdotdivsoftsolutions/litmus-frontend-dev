import { Activity, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/package";
import { Skeleton } from "@/components/ui/skeleton";

interface PackagesGridProps {
  search: string;
  selectedCategory: string;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

export function PackagesGrid({ search, selectedCategory, visibleCount, setVisibleCount }: PackagesGridProps) {
  const { data: packagesResponse, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: packageApi.getAllPackages,
  });

  const packagesData = packagesResponse?.data || [];

  const filteredPackages = packagesData.filter((p: any) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 py-12 md:py-20 relative z-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-white rounded-[1rem] p-5 md:p-6 border-2 border-slate-50 flex flex-col gap-5">
               <Skeleton className="h-6 w-1/3 rounded-full" />
               <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-20 w-full" />
               <Skeleton className="h-12 w-full mt-auto" />
             </div>
           ))
        ) : filteredPackages.slice(0, visibleCount).map((pkg: any) => (
          <Link key={pkg._id} to={`/packages/${pkg._id}`} className="group bg-white rounded-[1rem] p-5 md:p-6 border-2 border-slate-50 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-[#D32F2F]/20 transition-all duration-500 flex flex-col gap-5 cursor-pointer decoration-transparent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{pkg.category}</span>
                {pkg.tag && (
                  <span className="bg-red-50 text-[#D32F2F] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{pkg.tag}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors">{pkg.name}</h3>
                <p className="text-slate-500 mt-1 font-medium text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
              </div>

              <div className="flex gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-[#F06C00]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Parameters</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{pkg.testCount}+ Items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                  <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#D32F2F]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Reports</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{pkg.tat}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {pkg.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-600 text-nowrap font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 line-through font-bold block">₹{pkg.mrp.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-800 tracking-tighter">₹{pkg.price.toLocaleString()}</span>
                  <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-200">
                    {discountPct(pkg.price, pkg.mrp)}% Off
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-gradient-to-r from-brand-card-from to-brand-card-to text-white font-bold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                Book Panel
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPackages.length > visibleCount && (
         <div className="mt-12 flex justify-center">
            <Button 
              onClick={() => setVisibleCount(prev => prev + 2)}
              variant="outline" 
              className="h-12 px-10 rounded-xl border-slate-200 text-slate-500 hover:text-[#D32F2F] hover:border-[#D32F2F]/20 font-semibold text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-3 bg-white shadow-sm hover:shadow-md"
            >
              Discover More Packages <ArrowRight className="h-4 w-4" />
            </Button>
         </div>
      )}
    </div>
  );
}
