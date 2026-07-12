import { useState, useEffect } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultationBookingModal } from "./ConsultationBookingModal";

const consultationServices = [
  {
    title: "FSSAI Licensing",
    subtitle: "Starting @ ₹5000",
    description: "Complete guidance for obtaining and renewing FSSAI licenses. We handle paperwork, compliance checks, and regulatory communication.",
    image: "https://images.unsplash.com/photo-1579154204601-08ee9f5f0ca9?auto=format&fit=crop&q=80&w=400",
    features: ["End-to-end documentation", "Regulatory liaising"]
  },
  {
    title: "Lab Setup Advisory",
    subtitle: "Starting @ ₹15000",
    description: "Expert consultancy for establishing new food testing laboratories, including equipment selection, layout design, and ISO 17025 readiness.",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400",
    features: ["Equipment recommendations", "ISO 17025 preparation"]
  },
  {
    title: "Audit Preparation",
    subtitle: "Starting @ ₹8000",
    description: "Pre-audit assessments and mock audits to ensure your facility is fully prepared for official inspections and certifications.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400",
    features: ["Mock inspections", "Gap analysis reports"]
  }
];

export function ConsultationHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % consultationServices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white group/hero lg:h-[calc(100vh-80px)] lg:max-h-[850px] lg:min-h-[600px] flex items-center py-20 lg:py-0">
      {/* Animated Background Textures */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[45%] h-full bg-slate-900 overflow-hidden hidden lg:block">
         {/* Carousel sliding directly on the background */}
         {consultationServices.map((service, idx) => {
            const N = consultationServices.length;
            const isActive = idx === currentSlide;
            const isPrev = idx === (currentSlide === 0 ? N - 1 : currentSlide - 1);

            return (
               <div 
                  key={idx} 
                  className={cn(
                     "absolute inset-0 flex flex-col mb-10",
                     (isActive || isPrev) ? "transition-all duration-1000 ease-in-out" : "transition-none",
                     isActive ? "opacity-100 translate-x-0 z-20" : 
                     isPrev ? "opacity-0 -translate-x-full z-10 pointer-events-none" : 
                     "opacity-0 translate-x-full z-10 pointer-events-none"
                  )}
               >
                  {/* Top Half: Image */}
                  <div className="h-[40%] w-full relative shrink-0">
                     <img 
                       src={service.image} 
                       alt={service.title} 
                       className="w-full h-full object-cover" 
                       onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"; }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  </div>
                  
                  {/* Bottom Half: Content */}
                  <div className="flex-1 px-10 xl:px-14 pt-6 pb-24 flex flex-col justify-center text-white relative">
                     {/* Abstract pattern */}
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                     
                     <div className="relative z-10">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">{service.title}</h3>
                        <p className="text-[#10b981] font-semibold text-sm mb-4">{service.subtitle}</p>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-lg line-clamp-2">
                          {service.description}
                        </p>

                        <div>
                          {/* <div className="inline-block bg-[#D32F2F] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
                            Salient Features
                          </div> */}
                          <ul className="space-y-2.5">
                            {service.features.map((feature, i) => (
                              <li key={i} className="text-slate-200 flex items-start text-left font-medium text-[15px]">
                                <span className="text-[#D32F2F] mr-3 mt-1.5 text-lg leading-none">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8">
                            <ConsultationBookingModal serviceName={service.title}>
                              <Button className="h-11 px-6 bg-gradient-to-r from-[#D32F2F] to-[#feba50] hover:opacity-95 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md duration-300">
                                Book {service.title} <ArrowRight className="h-4 w-4" />
                              </Button>
                            </ConsultationBookingModal>
                          </div>
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}

         {/* Carousel Navigation Dots */}
         <div className="absolute bottom-12 left-14 flex gap-3 z-30">
            {consultationServices.map((_, idx) => (
               <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                     "h-1.5 rounded-full transition-all duration-500",
                     idx === currentSlide ? "w-10 bg-gradient-brand shadow-[0_0_10px_rgba(254,186,80,0.5)]" : "w-4 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
               />
            ))}
         </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center w-full gap-20 pointer-events-none">
        {/* Left side text content */}
        <div className="space-y-12 animate-slide-up pointer-events-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.4em] shadow-sm">
              <Star className="h-4 w-4 fill-current" /> Expert Advisory
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-[50px] ">
              More Than Testing. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Your Food Compliance Partner</span>
              
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed opacity-80">
              Food testing is just one part of building a safe and compliant food business. we offer end-to-end technical guidance and consulting to help businesses meet regulatory requirements, improve quality systems, and bring products to market with confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ConsultationBookingModal serviceName="FSSAI Compliance Strategy">
              <Button size="lg" className="h-14 px-10 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl flex items-center gap-4 transition-all">
                Request Strategy Brief <ArrowRight className="h-5 w-5" />
              </Button>
            </ConsultationBookingModal>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[21, 22, 23, 24].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="h-12 w-12 rounded-full border-4 border-white shadow-xl ring-1 ring-slate-100" />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">24 Scientists</p>
                <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Advisory
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 pt-4 border-t border-slate-100">
            <div>
              <p className="text-2xl font-semibold text-slate-800 tracking-tighter">180+</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">Specialists</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#D32F2F] tracking-tighter">12k+</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">Advisory Hours</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-800 tracking-tighter">98%</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
