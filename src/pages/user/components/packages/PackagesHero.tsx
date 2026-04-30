import { Shield, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PackagesHeroProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  search: string;
  setSearch: (val: string) => void;
}

export function PackagesHero({ categories, selectedCategory, setSelectedCategory, search, setSearch }: PackagesHeroProps) {
  return (
    <div className="relative bg-white py-6 md:py-10 flex flex-col justify-center overflow-hidden border-b border-white">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
      <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Soft Grid Blueprint Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full ">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Information Control Center */}
          <div className="flex-1 text-center lg:text-left space-y-6 py-8 lg:py-0 group">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
              <Shield className="h-4 w-4" /> Curated Diagnostic Bundles
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight animate-slide-up">
                Precision {" "}
                 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Clinical Packages.</span>
              </h1>
              <p className="text-slate-500 text-base lg:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Direct access to NABL-accredited diagnostic panels designed for end-to-end food safety, quality verification, and export compliance.
              </p>
            </div>

            {/* Panoramic Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-xl mx-auto lg:mx-0 ring-4 ring-slate-400/5 hover:ring-slate-400/10 transition-all">
              <div className="relative flex-1 w-full pl-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-[#D32F2F] transition-colors" />
                <Input
                  placeholder="Search diagnostic packages..."
                  className="h-10 sm:h-10 pl-12 pr-6 border-none bg-transparent text-slate-800 placeholder:text-slate-300 text-base sm:text-lg focus-visible:ring-0 shadow-none font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="w-full sm:w-auto h-10 sm:h-10 px-6  bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-bold rounded-2xl text-base shadow-[0_12px_24px_rgba(211,47,47,0.25)] transition-all flex items-center gap-3 group/btn hover:scale-[1.02] active:scale-95">
                Explore <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Category selection buttons in the hero section */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                        "px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm border",
                        selectedCategory === cat 
                            ? "bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white border-transparent" 
                            : "bg-white text-slate-400 hover:text-slate-800 border-slate-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Quick Trust Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-2">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">150+</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">Parameters</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">₹2400</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">Starts from</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-emerald-500 tracking-tighter flex items-center gap-1.5 ">
                  Live <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-100" />
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1 font-semibold">Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Lab Visual / Video */}
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] pointer-events-none z-0">
                 <iframe 
                   className="w-full h-full pointer-events-none"
                   src="https://www.youtube.com/embed/6k2Pq-dV_gI?si=s5H0X70H1Q_32j2B&controls=0&rel=0&modestbranding=1&showinfo=0&autoplay=1&mute=1&start=4&end=30&iv_load_policy=3" 
                   title="Litmus Diagnostics Tour"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   style={{ border: 'none' }}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

