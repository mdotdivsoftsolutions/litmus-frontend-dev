import { ArrowRight } from "lucide-react";

export function WhatsAppBanner() {
   return (
      <section className="pt-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1D7A5D] via-[#24A680] to-[#1D7A5D] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_32px_80px_rgba(18,140,126,0.15)]">
               {/* Glassmorphism Background Decoration */}
               <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none" />

               <div className="relative z-10 text-center lg:text-left max-w-2xl">
                  <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                     Can't find what you <br className="hidden lg:block" />
                     are looking for?
                  </h2>
                  <p className="text-emerald-50 text-xl font-medium flex items-center justify-center lg:justify-start gap-4">
                     We are here to help. <span className="underline underline-offset-8 decoration-white/30">Say 'Hi' on WhatsApp</span>
                     <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform duration-500" />
                  </p>
               </div>

               {/* High-Fidelity WhatsApp Circular Button */}
               <div className="relative z-10">
                  <div className="h-32 w-32 lg:h-40 lg:w-40 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-700 cursor-pointer">
                     <div className="h-[80%] w-[80%] bg-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden transform active:scale-95 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-emerald-50" />
                        <img
                           src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                           className="h-16 w-16 lg:h-18 lg:w-18 relative z-10"
                           alt="WhatsApp"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
