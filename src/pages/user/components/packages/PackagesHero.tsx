import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackagesHeroProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export function PackagesHero({ categories, selectedCategory, setSelectedCategory }: PackagesHeroProps) {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* Cinematic Background Transitions */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.4em] mb-6">
             <Shield className="h-4 w-4" /> Curated Diagnostic Bundles
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight mb-6">
             Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Clinical Packages</span> <br />
             for Modern Safe Brands.
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-3xl mx-auto mb-8 leading-relaxed opacity-80">
             Direct access to NABL-accredited diagnostic panels designed for end-to-end food safety, quality verification, and export compliance.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm",
                  selectedCategory === cat 
                    ? "bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white" 
                    : "bg-white text-slate-400 hover:text-slate-800 border border-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
      </div>
    </section>
  );
}
