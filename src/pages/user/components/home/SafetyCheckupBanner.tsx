import { Check, ArrowRight } from "lucide-react";

export function SafetyCheckupBanner() {
   return (
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative h-[380px] lg:h-[400px] w-full rounded-[1.5rem] overflow-hidden flex flex-col lg:flex-row bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 group">
               {/* Left Content Area */}
               <div className="flex-[1] p-10 lg:p-14 flex flex-col justify-center relative z-10">
                  <div className="inline-flex items-center gap-2 text-[#059669] text-xs font-black uppercase tracking-[0.2em] mb-4">
                     <Check className="h-4 w-4" /> Comprehensive Safety
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-[1.8] mb-6">
                     Advanced <span className="text-[#F06C00]">Food Industry</span> <br />
                     Safety Checkup
                  </h2>
                  <p className="text-slate-500 text-md font-medium mb-8 leading-relaxed max-w-lg">
                     60+ Parameters including Standardization, Microbial Scan, and Adulteration Check.
                  </p>
                  <button className="self-start h-14 px-10 bg-gradient-brand text-white font-semibold rounded-xl shadow-[0_12px_30px_rgba(5,150,105,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                     Book Now <ArrowRight className="h-5 w-5" />
                  </button>
               </div>
               {/* Right Image Composition */}
               <div className="flex-1 relative h-64 lg:h-auto bg-[#FEBA50]">
                  <img
                     src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
                     className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000"
                     alt="Food Safety"
                  />
                  <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent hidden lg:block" />
               </div>
            </div>
         </div>
      </section>
   );
}
