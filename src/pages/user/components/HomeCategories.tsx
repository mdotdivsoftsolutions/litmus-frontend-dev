import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Milk, Coffee, Wheat, Flame, Droplets, Drumstick, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const quickCategories = [
  { label: "Dairy", icon: Milk, color: "bg-orange-100 text-orange-600" },
  { label: "Spices", icon: Flame, color: "bg-red-100 text-red-600" },
  { label: "Oils", icon: Droplets, color: "bg-yellow-100 text-yellow-600" },
  { label: "Meat", icon: Drumstick, color: "bg-rose-100 text-rose-600" },
  { label: "Grains", icon: Wheat, color: "bg-green-100 text-green-600" },
  { label: "Snacks", icon: Cookie, color: "bg-amber-100 text-amber-600" },
];

const categoryGrid = [
  { name: "Dairy Products", count: 120, icon: Milk, color: "bg-[#FFF4E8] text-[#E67E22]", accent: "border-[#FFDAB9]" },
  { name: "Beverages", count: 85, icon: Coffee, color: "bg-[#EBF5FB] text-[#2980B9]", accent: "border-[#D4E6F1]" },
  { name: "Grains & Cereals", count: 210, icon: Wheat, color: "bg-[#E8F8F5] text-[#16A085]", accent: "border-[#D1F2EB]" },
  { name: "Spices", count: 145, icon: Flame, color: "bg-[#FDEBD0] text-[#D35400]", accent: "border-[#FAD7A0]" },
];

export function HomeCategories() {
  return (
    <>
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-medium text-slate-800 tracking-tight">Most Booked Packages</h2>
             <span className="text-[#F06C00] text-sm cursor-pointer hover:underline flex items-center gap-1 group">
               View All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryGrid.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/tests?category=${cat.name}`}
                className={cn(
                  "relative group h-[220px] rounded-[1.5rem] p-6 flex flex-col justify-between overflow-hidden border transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 bg-white",
                  cat.color,
                  cat.accent
                )}
              >
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm mb-4">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight leading-tight">{cat.name}</h3>
                  <p className="text-xs mt-1 opacity-75">{cat.count}+ Products</p>
                </div>
                <div className="relative z-10">
                   <div className="h-8 w-8 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white transition-colors text-slate-800 shadow-sm border border-white">
                      <ArrowRight className="h-4 w-4" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white/30 backdrop-blur-md border-y border-white/40">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-medium text-slate-800 tracking-tight">Tests By Food Category</h2>
          </div>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-2 -mx-2">
             {quickCategories.map((cat, idx) => {
               const colorName = cat.color.match(/bg-([a-z]+)-/)?.[1] || "slate";
               const textClass = `text-${colorName}-600`;
               
               return (
               <Link key={idx} to={`/tests?category=${cat.label}`} className="flex flex-col items-center gap-3 group min-w-[110px] shrink-0">
                  <div className="w-24 h-24 rounded-[1.5rem] flex flex-col items-center justify-center bg-white/70 backdrop-blur-lg shadow-sm border border-white hover:border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative overflow-hidden">
                     <div className={`absolute inset-0 bg-${colorName}-500/5`} />
                     <cat.icon className={cn("h-8 w-8 mb-1 relative z-10 transition-transform group-hover:scale-110", textClass)} />
                  </div>
                  <span className="text-sm text-slate-800">{cat.label}</span>
               </Link>
             )})}
          </div>
        </div>
      </section>
    </>
  );
}
