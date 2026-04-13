import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const PromoBanner = ({ className }: { className?: string }) => {
   const [current, setCurrent] = useState(0);
   const slides = [
      {
         title: <>Advanced <span className="text-[#F06C00]">Children's</span> <br/> Checkup</>,
         subtitle: "60+ Parameters Included",
         desc: "Immunity | Metabolism | Organ function & more",
         color: "#059669",
         img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop"
      },
      {
         title: <>Full Food <span className="text-[#D32F2F]">Industry Safety</span> <br/> Audit Panel</>,
         subtitle: "FSSAI Compliance Ready",
         desc: "Microbial Scan | Pathogen Panel | Heavy Metals",
         color: "#D32F2F",
         img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
      },
      {
         title: <>Premium <span className="text-[#F06C00]">Dairy & Purity</span> <br/> Verification</>,
         subtitle: "NABL Accredited Tests",
         desc: "Adulteration | Fat Content | SNF Analysis",
         color: "#004D62",
         img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
      }
   ];

   useEffect(() => {
      const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
      return () => clearInterval(timer);
   }, []);

   return (
      <section className={cn(className)}>
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative group rounded-[2rem] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 h-[620px] md:h-[320px]">
               <div className="h-full w-full flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${current * 100}%)` }}>
                  {slides.map((s, i) => (
                     <div key={i} className="min-w-full h-full flex flex-col lg:flex-row">
                        <div className="flex-[1] p-10 lg:pl-16 flex flex-col justify-center relative z-10 bg-white">
                           <div className="inline-flex items-center gap-2 mb-3" style={{ color: s.color }}>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.subtitle}</span>
                           </div>
                           <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tighter leading-[1.05] mb-4">
                              {s.title}
                           </h2>
                           <p className="text-slate-500 text-base font-medium mb-8 max-w-lg">
                              {s.desc}
                           </p>
                           <button className="self-start h-11 px-8 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group/btn bg-gradient-brand">
                              Book Now <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                        <div className="flex-1 relative h-32 lg:h-auto overflow-hidden">
                           <img src={s.img} className="w-full h-full object-cover" alt="Checkup" />
                           <div className="absolute inset-0 bg-black/5" />
                           <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden lg:block" />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="absolute bottom-6 left-16 flex gap-2 z-20">
                  {slides.map((_, i) => (
                     <div 
                        key={i} 
                        onClick={() => setCurrent(i)}
                        className={cn("h-1.5 transition-all duration-500 rounded-full cursor-pointer", i === current ? "w-8 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-400")} 
                     />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};
