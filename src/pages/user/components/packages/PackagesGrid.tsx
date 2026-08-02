import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TestCard } from "../HomeTests";

interface PackagesGridProps {
  packages: any[];
  search: string;
  isLoading: boolean;
  selectedCategory: string;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

export function PackagesGrid({ packages, search, isLoading, selectedCategory, visibleCount, setVisibleCount }: PackagesGridProps) {
  const filteredPackages = packages.filter((p: any) => {
    return selectedCategory === "All" || p.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 py-12 md:py-20 relative z-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-white rounded-[1rem] p-5 md:p-6 border-2 border-slate-50 flex flex-col gap-5 w-full">
               <Skeleton className="h-6 w-1/3 rounded-full" />
               <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-20 w-full" />
               <Skeleton className="h-12 w-full mt-auto" />
             </div>
           ))
        ) : filteredPackages.slice(0, visibleCount).map((pkg: any) => (
          <TestCard key={pkg._id} t={pkg} className="m-0 w-full shrink h-full" />
        ))}

        {!isLoading && filteredPackages.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[1.5rem] border-2 border-slate-50 border-dashed">
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-5">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">No packages found</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mt-3 leading-relaxed">
              We couldn't find any packages matching "{search}". Try searching with different keywords or category.
            </p>
          </div>
        )}
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
