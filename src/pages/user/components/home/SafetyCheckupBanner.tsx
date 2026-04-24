import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
   {
      badge: "Comprehensive Safety",
      title: <>Advanced <span className="text-[#F06C00]">Food Industry</span><br />Safety Checkup</>,
      desc: "60+ Parameters including Standardization, Microbial Scan, and Adulteration Check.",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "FSSAI Compliance",
      title: <>Full Body Checkup <span className="text-[#D32F2F]">Essential</span> at ₹1599</>,
      desc: "50 Parameters: CBC, LFT, KFT, HbA1c, Multi Organ + more.",
      img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "Quality Assurance",
      title: <>Premium <span className="text-[#F06C00]">Dairy Purity</span><br />Verification Panel</>,
      desc: "Adulteration detection, Fat Content, SNF analysis & shelf-life testing.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "Lab Certified",
      title: <>Complete <span className="text-[#D32F2F]">Spice Testing</span><br />& Purity Audit</>,
      desc: "Aflatoxin, Heavy metals, Pesticide residues & Microbial analysis.",
      img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop",
   },
];

export function SafetyCheckupBanner() {
   const [current, setCurrent] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 4500);
      return () => clearInterval(timer);
   }, []);

   const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
   const next = () => setCurrent(p => (p + 1) % slides.length);

   return (
      <section className="py-8 md:py-12 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative group rounded-2xl overflow-hidden bg-white shadow-[0_8px_40px_rgba(0,0,0,0.05)] border border-slate-100 h-[200px] md:h-[180px]">
               {/* Slides */}
               <div
                  className="h-full w-full flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ transform: `translateX(-${current * 100}%)` }}
               >
                  {slides.map((s, i) => (
                     <div key={i} className="min-w-full h-full flex flex-row">
                        {/* Left Content */}
                        <div className="flex-[1.2] px-8 py-5 flex flex-col justify-center bg-white">
                           <div className="inline-flex items-center gap-1.5 text-[#059669] text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                              ✓ {s.badge}
                           </div>
                           <h3 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight leading-snug mb-2">
                              {s.title}
                           </h3>
                           <p className="text-slate-500 text-xs font-medium mb-3 max-w-sm leading-relaxed">
                              {s.desc}
                           </p>
                           <button className="self-start h-9 px-6 bg-gradient-brand text-white text-xs font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                              Book Now <ArrowRight className="h-3.5 w-3.5" />
                           </button>
                        </div>
                        {/* Right Image */}
                        <div className="flex-[0.8] relative h-full overflow-hidden hidden sm:block">
                           <img src={s.img} className="w-full h-full object-cover" alt="Checkup" />
                           <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
                        </div>
                     </div>
                  ))}
               </div>

               {/* Navigation arrows */}
               <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#D32F2F] hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
               >
                  <ChevronLeft className="h-4 w-4" />
               </button>
               <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#D32F2F] hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
               >
                  <ChevronRight className="h-4 w-4" />
               </button>

               {/* Dots */}
               <div className="absolute bottom-3 left-8 flex gap-1.5 z-20">
                  {slides.map((_, i) => (
                     <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={cn(
                           "h-1.5 transition-all duration-500 rounded-full cursor-pointer",
                           i === current ? "w-6 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        )}
                     />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
