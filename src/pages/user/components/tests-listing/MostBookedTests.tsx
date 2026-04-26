import { Clock, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryStrip } from "./CategoryStrip";
import { SectionHeader } from "../home/SectionHeader";

interface FeaturedTest {
  id: string;
  name: string;
  method?: string;
  price: number;
  mrp: number;
  tat: string;
  type?: string;
  tests: number;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
}

interface MostBookedTestsProps {
  tests: FeaturedTest[];
  discountPct: (price: number, mrp: number) => number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: Category[];
  iconMap: Record<string, React.ElementType>;
  cn: (...args: (string | undefined | false | null)[]) => string;
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
    <div className="space-y-10 bg-slate-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
        <SectionHeader
          title={
            <>
              Most Booked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">
                Diagnostics
              </span>
            </>
          }
          subtitle="Clinically verified specialized tests across major industry verticals."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tests List (6 Rows x 2 Columns) */}
          {tests.map((t) => (
              <div key={t.id} className="group bg-white rounded-[1rem] p-6 shadow-sm border-2 border-slate-50 flex items-center gap-6 hover:border-[#D32F2F]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
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
      </div>
    </div>
  );
};
