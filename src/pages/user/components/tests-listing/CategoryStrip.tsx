import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface CategoryStripProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: any[];
  isLoading?: boolean;
}

export const CategoryStrip = ({ selectedCategory, setSelectedCategory, categories, isLoading }: CategoryStripProps) => {
  // If no categories from API, fallback to a single "All" category or just render what we have.
  const displayCategories = categories?.length > 0 
    ? [
        { name: "All", img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400", isLink: false },
        ...categories.map(c => ({
          name: c.name,
          img: c.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
          isLink: false,
        }))
      ]
    : [
        { name: "All", img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400", isLink: false }
      ];

  const location = useLocation();
  const path = location.pathname === "/packages" ? true : false;
  console.log(path);

  return (
    <div className="w-full py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {path && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">Expert Packages</div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 lg:text-3xl">
                Check Specific <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Food</span> Packages.
              </h2>
              <p className="mt-4 text-md font-medium text-slate-500 max-w-xl leading-relaxed">
                Here are some of our most frequently selected packages. If you don’t see what you need, <Link to="/contact" className="text-[#D32F2F] hover:underline font-bold">reach out</Link> for a custom solution.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Grid Container for 16 categories */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 pb-4">
            {isLoading ? (
              Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-[140px] md:h-[180px] w-full rounded-[2rem]" />
              ))
            ) : (
              displayCategories.map((cat) => {
                const innerContent = (
                <>
                  <img
                    src={cat.img}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={cat.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="relative z-10">
                    <p className={cn(
                      "text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight transition-colors",
                      selectedCategory === cat.name ? "text-white" : "text-white/90"
                    )}>
                      {cat.name}
                    </p>
                  </div>

                  {/* Active Indicator Pips */}
                  {selectedCategory === cat.name && (
                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#D32F2F] flex items-center justify-center shadow-lg border-2 border-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </>
              );

              const buttonClass = cn(
                "group relative h-[140px] md:h-[180px] rounded-[2rem] overflow-hidden flex flex-col justify-end p-4 transition-all duration-300 border-2 text-left",
                selectedCategory === cat.name
                  ? "border-[#D32F2F] ring-4 ring-[#D32F2F]/5"
                  : "border-transparent hover:border-slate-200 hover:-translate-y-1"
              );

              if (cat.isLink && cat.href) {
                return (
                  <Link key={cat.name} to={cat.href} className={buttonClass}>
                    {innerContent}
                  </Link>
                );
              }

              return (
                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={buttonClass}>
                  {innerContent}
                </button>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
