import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";

const slides = [
   {
      badge: "FoSTaC Certified",
      badgeColor: "text-[#004e64]",
      descInline: "Empower your workforce with FSSAI-approved FoSTaC training programs.",
      title: <>Train Your Team. <span className="text-[#F06C00]">Strengthen Food Safety.</span></>,
      titleText: "Train Your Team. Strengthen Food Safety.",
      img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "Professional Audits",
      badgeColor: "text-[#004e64]",
      descInline: "Identify gaps, reduce risks, and prepare confidently for customer through professional third-party audits.",
      title: <>Independent Audits. <span className="text-[#F06C00]">Actionable Insights.</span></>,
      titleText: "Independent Audits. Actionable Insights.",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "Regulatory Compliance",
      badgeColor: "text-[#004e64]",
      descInline: "Ensure your packaging materials meet regulatory requirements and food contact safety standards.",
      title: <>Safe Packaging Starts <span className="text-[#F06C00]">with Compliance.</span></>,
      titleText: "Safe Packaging Starts with Compliance.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
   },
   {
      badge: "Expert Assistance",
      badgeColor: "text-[#004e64]",
      descInline: "Take experts help to develop innovative, compliant, and consumer-focused food products tailored to your business goals.",
      title: <>Transform Ideas into <span className="text-[#F06C00]">Market-Ready Products.</span></>,
      titleText: "Transform Ideas into Market-Ready Products.",
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
