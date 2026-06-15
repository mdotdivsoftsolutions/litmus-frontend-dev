import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";

const slides = [
   {
      badge: "90+Parameters",
      badgeColor: "text-[#004e64]",
      descInline: "Vitamin D, B12, HbA1c & more",
      title: <>Full Body Checkup <span className="text-[#F06C00]">Essential at ₹1599</span></>,
      titleText: "Full Body Checkup Essential at ₹1599",
      img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "60+Parameters",
      badgeColor: "text-[#004e64]",
      descInline: "Microbial Scan, Adulteration Check",
      title: <>Advanced Food <span className="text-[#F06C00]">Safety Checkup</span></>,
      titleText: "Advanced Food Safety Checkup",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "NABL Certified",
      badgeColor: "text-[#004e64]",
      descInline: "Adulteration, Fat Content, SNF analysis",
      title: <>Premium Dairy <span className="text-[#F06C00]">Purity Panel</span></>,
      titleText: "Premium Dairy Purity Panel",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "FSSAI Standard",
      badgeColor: "text-[#004e64]",
      descInline: "Heavy metals, Pesticide residues",
      title: <>Complete Spice <span className="text-[#F06C00]">Purity Audit</span></>,
      titleText: "Complete Spice Purity Audit",
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
      <section className="py-12 md:py-20 bg-white">
         <div className="max-w-6xl mx-auto px-4 relative flex flex-col items-center">
            
            {/* Arrows Outside */}
            <button
               onClick={prev}
               className="absolute left-0 md:left-4 top-[100px] -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
            >
               <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </button>
            <button
               onClick={next}
               className="absolute right-0 md:right-4 top-[100px] -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
            >
               <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </button>

            {/* Banner Track */}
            <div className="w-full max-w-5xl px-8 md:px-14">
               <div className="relative overflow-hidden rounded-[2rem] bg-[#F1F3F5] h-[200px] shadow-sm">
                  <div
                     className="h-full w-full flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                     style={{ transform: `translateX(-${current * 100}%)` }}
                  >
                     {slides.map((s, i) => (
                        <div key={i} className="min-w-full h-full flex flex-row">
                           {/* Left Content */}
                           <div className="flex-[1.3] px-8 md:px-12 py-5 flex flex-col justify-center bg-[#F1F3F5]">
                              <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
                                 {s.title}
                              </h3>
                              <p className="text-slate-800 text-sm font-semibold mb-5 flex items-center gap-1.5 flex-wrap">
                                 <span className={s.badgeColor}>{s.badge}</span> {s.descInline}
                              </p>
                              <ConsultationBookingModal serviceName={s.titleText} source="Home Banner">
                                 <button type="button" className="self-start h-10 px-8 bg-gradient-brand text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
                                    Book Now
                                 </button>
                              </ConsultationBookingModal>
                           </div>
                           {/* Right Image */}
                           <div className="flex-[0.7] relative h-full hidden sm:block">
                              <img src={s.img} className="w-full h-full object-cover" alt="Checkup" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Dots Below with Pill style */}
            <div className="flex items-center justify-center gap-2 mt-8">
               {slides.map((_, i) => {
                  if (i === current) {
                     return (
                        <div key={i} className="bg-gray-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                           {current + 1}/{slides.length}
                        </div>
                     );
                  }
                  return (
                     <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="h-1.5 w-1.5 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors"
                     />
                  );
               })}
            </div>
            
         </div>
      </section>
   );
}
