import { Search, X, SlidersHorizontal, ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterNavigationProps {
  categoryPills: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  search: string;
  setSearch: (val: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  testTypes: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  filters: any[];
  cn: (...args: any[]) => string;
}

export const FilterNavigation = ({
  categoryPills,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  selectedType,
  setSelectedType,
  testTypes,
  sortBy,
  setSortBy,
  filters,
  cn
}: FilterNavigationProps) => {
  return (
    <section className="space-y-8 ">
      {/* ===== PREMIUM SEARCH & FILTER HUB ===== */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-2.5 rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-5xl mx-auto lg:mx-0 transition-all hover:shadow-[0_48px_100px_rgba(0,0,0,0.08)]">
        <div className="relative flex-1 w-full pl-6">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 transition-colors group-hover:text-[#D32F2F]" />
          <Input 
            placeholder="Search our specialized diagnostic catalogue (1000+ tests)..." 
            className="h-16 pl-14 pr-6 border-none bg-transparent text-slate-800 placeholder:text-slate-300 text-lg focus-visible:ring-0 shadow-none font-medium"
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        
        <div className="flex items-center gap-3 pr-2">
           <Sheet>
              <SheetTrigger asChild>
                <Button className="h-14 px-8 bg-slate-50 text-slate-600 hover:text-[#D32F2F] hover:bg-red-50 font-black rounded-[1.5rem] flex items-center gap-3 transition-all border border-slate-100/50 shadow-sm group">
                  <SlidersHorizontal className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
                  <span className="hidden sm:inline uppercase tracking-widest text-[11px]">Filters</span>
                  {filters.length > 0 && <span className="h-5 w-5 rounded-full bg-[#D32F2F] text-white text-[10px] flex items-center justify-center border-2 border-white">{filters.length}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l border-slate-100 rounded-l-[3.5rem] p-10 font-manrope">
                <SheetHeader className="pb-10 pt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.2em] mb-4 w-max">
                    Diagnostic Hub
                  </div>
                  <SheetTitle className="text-4xl font-extrabold text-slate-800 tracking-tight">Refine <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Search</span></SheetTitle>
                  <SheetDescription className="text-slate-400 text-lg font-medium pt-2 uppercase tracking-wide text-xs">Architect your search with specialized precision.</SheetDescription>
                </SheetHeader>

                <div className="space-y-12">
                   {/* Categories Selection */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.25em] flex items-center gap-3">
                         Industry Vertical <span className="h-px w-10 bg-slate-100" />
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {categoryPills.map((pill) => (
                          <button key={pill} onClick={() => setSelectedCategory(pill)}
                            className={cn(
                              "px-6 py-3 rounded-2xl text-xs font-bold transition-all border shadow-sm",
                              selectedCategory === pill
                                ? "bg-gradient-to-br from-[#D32F2F] to-[#F06C00] text-white border-transparent shadow-[0_8px_20px_rgba(211,47,47,0.25)]"
                                : "bg-white text-slate-500 border-slate-100 hover:border-[#D32F2F]/20 hover:text-slate-800"
                            )}>
                            {pill}
                          </button>
                        ))}
                      </div>
                   </div>

                   {/* Test Types & Range Selection */}
                   <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-[0.25em]">Diagnostic Type</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 text-base font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#D32F2F]/10"><SelectValue placeholder="All Diagnostic Ranges" /></SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 overflow-hidden shadow-2xl">
                            {testTypes.map((t) => <SelectItem key={t} value={t} className="font-bold py-3 hover:bg-red-50 focus:bg-red-50 cursor-pointer">{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-[0.25em]">Sort Methodology</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 text-base font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#D32F2F]/10"><SelectValue placeholder="Sort Results" /></SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 overflow-hidden shadow-2xl">
                            <SelectItem value="relevance" className="font-bold py-3 hover:bg-red-50 focus:bg-red-50 cursor-pointer">Most Relevant</SelectItem>
                            <SelectItem value="price-low" className="font-bold py-3 hover:bg-red-50 focus:bg-red-50 cursor-pointer">Price: Low to High</SelectItem>
                            <SelectItem value="price-high" className="font-bold py-3 hover:bg-red-50 focus:bg-red-50 cursor-pointer">Price: High to Low</SelectItem>
                            <SelectItem value="popular" className="font-bold py-3 hover:bg-red-50 focus:bg-red-50 cursor-pointer">Popularity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                   <Button onClick={() => { setSelectedCategory("All"); setSelectedType(""); }} className="w-full h-16 rounded-[2rem] bg-slate-900 shadow-2xl text-white font-black uppercase tracking-[0.25em] text-xs hover:bg-[#D32F2F] transition-all flex items-center justify-center gap-3">
                      Reset All Filters <ArrowRight className="h-4 w-4" />
                   </Button>
                </div>
              </SheetContent>
           </Sheet>

           <Button className="h-14 px-10 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-black rounded-[1.5rem] text-lg shadow-[0_12px_30px_rgba(211,47,47,0.3)] transition-all flex items-center gap-3 group/btn hover:scale-[1.02] active:scale-95">
             Search <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
           </Button>
        </div>
      </div>

      {/* Active filters strip */}
      {filters.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap animate-fade-in px-2 pt-2 text-[#D32F2F]">
          {filters.map((f) => (
            <Badge key={f.label} className="bg-red-50/50 text-[#D32F2F] hover:bg-red-100/80 gap-2 px-5 py-2.5 rounded-2xl cursor-pointer font-bold border border-red-100/50 shadow-sm transition-all" onClick={f.clear}>
               <Check className="h-3.5 w-3.5" /> {f.label} <X className="h-4 w-4 opacity-40 hover:opacity-100" />
            </Badge>
          ))}
          <button className="text-[10px] font-black text-slate-400 hover:text-[#D32F2F] uppercase tracking-[0.25em] pl-2 transition-colors flex items-center gap-2" onClick={() => { setSelectedCategory("All"); setSelectedType(""); }}>
             <X className="h-3.5 w-3.5" /> Clear Everything
          </button>
        </div>
      )}
    </section>
  );
};
