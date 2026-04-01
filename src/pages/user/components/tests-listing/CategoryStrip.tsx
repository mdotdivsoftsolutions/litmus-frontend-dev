import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryStripProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryStrip = ({ selectedCategory, setSelectedCategory }: CategoryStripProps) => {
  const categories = [
    { name: "All", img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400" },
    { name: "Dairy", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400" },
    { name: "Beverages", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400" },
    { name: "Grains & Cereals", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400" },
    { name: "Spices", img: "https://images.unsplash.com/photo-1599481238640-4c1288720d7a?q=80&w=400" },
    { name: "Meat & Poultry", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=400" },
    { name: "Oils & Fats", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400" },
    { name: "Processed Foods", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400" },
    { name: "Snacks", img: "https://images.unsplash.com/photo-1541604193435-2258a91e1d68?q=80&w=400" },
  ];

  return (
    <div className="w-full  border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-6">
           {/* Horizontal Scroll Container */}
           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2 snap-x snap-mandatory">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "group relative min-w-[140px] h-[180px] rounded-[2.5rem] overflow-hidden flex flex-col justify-end p-5 transition-all duration-300 snap-start border-2",
                    selectedCategory === cat.name 
                      ? "border-[#D32F2F] shadow-[0_12px_30px_rgba(211,47,47,0.15)] ring-4 ring-[#D32F2F]/5" 
                      : "border-transparent hover:border-slate-200"
                  )}
                >
                  <img 
                    src={cat.img} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={cat.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="relative z-10">
                     <p className={cn(
                       "text-xs font-black uppercase tracking-widest leading-tight transition-colors",
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
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
