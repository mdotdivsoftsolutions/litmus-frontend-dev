import { Search, Shield, FileText, Package, Clock, Star } from "lucide-react";
import heroScientist from "@/assets/banner-hero-1.jpg";

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeHero({ searchQuery, setSearchQuery }: HomeHeroProps) {
  return (
    <>
      <section className="relative pt-8 pb-16 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F06C00]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm overflow-hidden mt-4">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100 mb-6 w-max">
                  <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                  <span className="text-xs font-medium text-slate-700">NABL & FSSAI Accredited Labs</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-medium text-slate-800 leading-[1.15] mb-6 tracking-tight">
                  Advanced Food Safety<br />
                  Testing For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Business</span>
                </h1>
                <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
                  Safe, Smart and Compliant Food Solutions. India's leading platform for certified food analysis and label validation.
                </p>
                <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center max-w-md w-full focus-within:ring-2 focus-within:ring-[#E53935]/20 transition-all focus-within:shadow-md">
                  <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search tests (e.g. Dairy, Spices)..." 
                    className="flex-1 bg-transparent px-4 py-2.5 outline-none text-sm w-full min-w-0" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="bg-gradient-to-r from-[#D32F2F] to-[#F4511E] text-white px-7 py-3 rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all shrink-0">
                    Search
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative bg-gradient-to-br from-red-50/50 to-orange-50/50 p-8 flex items-center justify-center border-l border-white/40">
                 <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                 <img 
                   src={heroScientist} 
                   alt="Food Safety Specialist" 
                   className="relative z-10 w-full max-w-[420px] aspect-[4/3] object-cover rounded-[2rem] shadow-lg border-[6px] border-white hover:scale-105 transition-transform duration-700" 
                 />
                 <div className="absolute top-12 right-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white flex items-center gap-3 z-20 animate-[bounce_3s_infinite]">
                   <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                     <Shield className="h-5 w-5 text-orange-600" />
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-800">100% Reliable</p>
                     <p className="text-[10px] text-slate-500">Certified Results</p>
                   </div>
                 </div>
                 <div className="absolute bottom-12 left-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white flex items-center gap-3 z-20 animate-[bounce_4s_infinite_reverse]">
                   <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                     <FileText className="h-5 w-5 text-[#E53935]" />
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-800">FSSAI Ready</p>
                     <p className="text-[10px] text-slate-500">Auto-generated</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 mb-4 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center px-4 md:px-12 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-100">
             <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-white flex items-center justify-center shrink-0">
                   <Package className="h-6 w-6 text-[#F06C00]" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-800">Easy Sampling</p>
                   <p className="text-[11px] text-slate-500 mt-0.5">Doorstep Collection</p>
                </div>
             </div>
             <div className="w-px h-12 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-white flex items-center justify-center shrink-0">
                   <Clock className="h-6 w-6 text-[#F06C00]" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-800">3-5 Days</p>
                   <p className="text-[11px] text-slate-500 mt-0.5">Fast Digital Reports</p>
                </div>
             </div>
             <div className="w-px h-12 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-white flex items-center justify-center shrink-0">
                   <Star className="h-6 w-6 text-[#F06C00]" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-800">4.9/5 Rating</p>
                   <p className="text-[11px] text-slate-500 mt-0.5">Verified by businesses</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
