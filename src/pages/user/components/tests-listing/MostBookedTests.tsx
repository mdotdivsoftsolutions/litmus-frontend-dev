import { Clock, Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryStrip } from "./CategoryStrip";

interface MostBookedTestsProps {
  tests: any[];
  discountPct: (price: number, mrp: number) => number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: any[];
  iconMap: Record<string, React.ElementType>;
  cn: (...args: any[]) => string;
}

export const MostBookedTests = ({
  tests,
  discountPct,
  selectedCategory,
  setSelectedCategory,
  categories,
  iconMap,
  cn
}: MostBookedTestsProps) => {
  return (
    <div className="space-y-10 bg-slate-50 py-24">
      {/* 3. QUICK CATEGORY STRIP (Horizontal) */}
      <CategoryStrip
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-[-0.03em] leading-tight">
              Most Booked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Diagnostics</span>
            </h2>
            <p className="text-slate-500 mt-2 text-base">Clinically verified specialized tests across major industry verticals.</p>
          </div>
          <div className="hidden sm:flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 ">
            {["All", "Dairy", "Beverages", "Grains"].map((t) => (
              <button key={t}
                className={cn("px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  selectedCategory === t || (selectedCategory === "All" && t === "All")
                    ? "bg-slate-100 text-black " : "text-slate-400 hover:text-slate-600"
                )}
                onClick={() => setSelectedCategory(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Trending Tests List */}
          <div className="lg:col-span-7 space-y-4">
            {tests.map((t) => (
              <div key={t.id} className="group bg-white rounded-[2rem] p-6 shadow-sm border-2 border-slate-50 flex items-center gap-6 hover:border-[#D32F2F]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-[#D32F2F] transition-colors">{t.name}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-red-50 text-[#D32F2F] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-red-100">{t.tests} specialized tests</span>
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wide"><Clock className="h-4 w-4 text-[#F06C00]" />Reports in {t.tat}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end gap-2 text-slate-400 line-through text-xs font-medium">₹{t.mrp.toLocaleString()}</div>
                  <div className="font-black text-slate-800 text-2xl tracking-tighter">₹{t.price.toLocaleString()}</div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md mt-1 inline-block uppercase tracking-widest border border-emerald-100">{discountPct(t.price, t.mrp)}% Off</span>
                </div>
                <Button size="sm" className="hidden sm:flex shrink-0 h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-gradient-to-br hover:from-[#D32F2F] hover:to-[#F06C00] hover:text-white transition-all duration-500 p-0 shadow-sm border border-slate-100" asChild>
                  <Link to={`/tests/${t.id}`}><Plus className="h-6 w-6" /></Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Right Column: Panoramic Categories Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { name: "Dairy Products", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400" },
              { name: "Beverages", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400" },
              { name: "Grains & Cereals", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" },
              { name: "Spices & Herbs", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400" },
            ].map((cat, idx) => (
              <Link key={idx} to={`/tests?category=${cat.name}`}
                className="group relative rounded-[2rem] overflow-hidden flex flex-col justify-end p-6 border-2 border-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="relative z-10">
                  <h4 className="font-black text-white text-sm tracking-tight uppercase leading-tight group-hover:text-red-50 transition-colors">{cat.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] mt-2 group-hover:text-white transition-colors">
                    Explore <div className="h-4 w-4 rounded-full bg-[#D32F2F] flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform"><ArrowRight className="h-3 w-3 text-white" /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
