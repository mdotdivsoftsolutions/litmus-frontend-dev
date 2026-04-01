import { Shield, Search, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TestsHeroProps {
  search: string;
  setSearch: (val: string) => void;
}

export const TestsHero = ({ search, setSearch }: TestsHeroProps) => {
  return (
    <div className="relative bg-white min-h-[85vh] flex flex-col justify-center overflow-hidden border-b border-white">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
      <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Soft Grid Blueprint Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full ">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Information Control Center */}
          <div className="flex-1 text-center lg:text-left space-y-8 py-10 lg:py-0 group">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
              <Shield className="h-4 w-4" /> NABL Accredited · FSSAI Certified
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-600 tracking-[-0.04em] leading-[0.9] animate-slide-up">
                Advanced Food Safety {" "}
                 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Food Solutions.</span>
              </h1>
              <p className="text-slate-500 text-lg lg:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Safe, Smart and Compliant Food Solutions. India's leading platform for certified food analysis and label validation.
              </p>
            </div>

            {/* Panoramic Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-xl mx-auto lg:mx-0 ring-4 ring-slate-400/5 hover:ring-slate-400/10 transition-all">
              <div className="relative flex-1 w-full pl-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-[#D32F2F] transition-colors" />
                <Input
                  placeholder="Search 1000+ tests..."
                  className="h-12 pl-12 pr-6 border-none bg-transparent text-slate-800 placeholder:text-slate-300 text-lg focus-visible:ring-0 shadow-none font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-bold rounded-2xl text-lg shadow-[0_12px_24px_rgba(211,47,47,0.25)] transition-all flex items-center gap-3 group/btn hover:scale-[1.02] active:scale-95">
                Explore <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Quick Trust Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-800 tracking-tighter">60+</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Parameters</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-800 tracking-tighter">₹800</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Starts from</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-emerald-500 tracking-tighter flex items-center gap-1.5 ">
                  Live <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-100" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 font-black">Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Lab Visual */}
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative group/pano h-[450px]  w-full rounded-[4rem] overflow-hidden shadow-[0_48px_96px_rgba(0,0,0,0.1)] border-[12px] border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200"
                alt="Clinical Excellence"
                className="h-full w-full object-cover transition-transform duration-[3000ms] group-hover/pano:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent opacity-40 mix-blend-multiply" />
              <div className="absolute bottom-10 right-10 flex flex-col items-end">
                <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-2">Clinical Infrastructure</p>
                <div className="h-1 w-16 bg-[#D32F2F] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
