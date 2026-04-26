import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryStripProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryStrip = ({ selectedCategory, setSelectedCategory }: CategoryStripProps) => {
  const categories = [
    { name: "General", img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400", isLink: true, href: "/packages" },
    { name: "Dairy", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400", isLink: true, href: "/tests?category=Dairy" },
    { name: "Beverages", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400", isLink: true, href: "/tests?category=Beverages" },
    { name: "Grains & Cereals", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400", isLink: true, href: "/tests?category=Grains%20%26%20Cereals" },
    { name: "Spices", img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400", isLink: true, href: "/tests?category=Spices" },
    { name: "Meat & Poultry", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=400", isLink: true, href: "/tests?category=Meat%20%26%20Poultry" },
    { name: "Oils & Fats", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400", isLink: true, href: "/tests?category=Oils%20%26%20Fats" },
    { name: "Processed Foods", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400", isLink: true, href: "/tests?category=Processed%20Foods" },
    { name: "Snacks", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400", isLink: true, href: "/tests?category=Snacks" },
    { name: "Fruits", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400", isLink: true, href: "/tests?category=Fruits" },
    { name: "Vegetables", img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=400", isLink: true, href: "/tests?category=Vegetables" },
    { name: "Confectionery", img: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400", isLink: true, href: "/tests?category=Confectionery" },
    { name: "Bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400", isLink: true, href: "/tests?category=Bakery" },
    { name: "Seafood", img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=400", isLink: true, href: "/tests?category=Seafood" },
    { name: "Nuts & Seeds", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400", isLink: true, href: "/tests?category=Nuts%20%26%20Seeds" },
    { name: "Supplements", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400", isLink: true, href: "/tests?category=Supplements" },
  ];

  return (
    <div className="w-full py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Grid Container for 16 categories */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 pb-4">
            {categories.map((cat) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
