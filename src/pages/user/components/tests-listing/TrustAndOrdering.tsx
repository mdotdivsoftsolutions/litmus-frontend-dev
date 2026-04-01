import { CheckCircle2, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TrustAndOrdering = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ═══════════ LEFT: WHY LITMUS? (THE GREEN CARD) ═══════════ */}
          <div className="lg:col-span-6 rounded-[2.5rem] bg-[#1a4332] text-white p-12 relative flex flex-col justify-between overflow-hidden group min-h-[660px]">
            {/* Background Orange Accent (Mirroring the original) */}
            <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] bg-orange-400 rounded-full opacity-30 blur-[60px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] bg-[#feba50] rounded-full opacity-40 pointer-events-none transform rotate-12 flex items-center justify-center overflow-hidden">
               {/* Stylized Litmus "L" or Leaf accent */}
               <div className="w-[120px] h-[120px] border-[15px] border-white/20 rounded-full" />
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#feba50]">Why Litmus?</h2>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">Fast, Safe and</p>
                <p className="text-3xl font-bold tracking-tight">Accurate</p>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 w-fit border border-white/10 mt-8 shadow-xl">
                 <div className="h-10 w-10 rounded-lg bg-[#feba50] flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-[#1a4332]" />
                 </div>
                 <div className="text-sm font-bold leading-tight">
                    <p>100% on time</p>
                    <p className="opacity-80 font-medium">sample collection</p>
                 </div>
              </div>
            </div>

            {/* Collection Agent Image (From scooter.png) */}
            <div className="absolute bottom-0 right-0 w-[80%] h-[70%] z-0 pointer-events-none">
              <img 
                src="/images/trust/scooter.png" 
                className="w-full h-full object-contain object-right-bottom group-hover:scale-105 transition-transform duration-700" 
                alt="Litmus Collection Agent"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a4332] via-transparent to-transparent opacity-80" />
            </div>

            {/* Navigation Arrows (Visual only, as per image) */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-6 pointer-events-none">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer">
                    <ChevronLeft className="h-6 w-6" />
                </div>
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </div>

            <div className="relative z-10 mt-24">
              <p className="text-white/80 text-lg font-medium leading-relaxed max-w-sm">
                Each sample collected undergoes rigorous temperature mapping and real-time monitoring to ensure clinical 100% accuracy.
              </p>
              {/* Manual Indicators */}
              <div className="flex gap-2 mt-8">
                 <div className="h-1 w-8 bg-slate-100 rounded-full" />
                 <div className="h-1 w-12 bg-orange-400 rounded-full" />
                 <div className="h-1 w-8 bg-slate-100/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT: ORDERING & VIDEO ═══════════ */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* TOP CARD: 3 STEPS (THE WHITE CARD) */}
            <div className="flex-1 rounded-[2.5rem] bg-white border border-slate-100 p-10 relative flex flex-col justify-between overflow-hidden shadow-sm shadow-[#feba50]/5">
              
              <div className="relative z-10 space-y-6">
                 <div>
                    <h4 className="text-xl font-bold text-slate-500 mb-1">Easy ordering in</h4>
                    <h3 className="text-5xl font-black text-[#10B981] tracking-tighter uppercase leading-none">3 STEPS</h3>
                 </div>

                 <div className="space-y-4">
                    {[
                      { step: "Select tests", color: "#10B981" },
                      { step: "Add your details", color: "#10B981" },
                      { step: "Book your slot", color: "#10B981" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                         <div className="h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center text-white p-0.5">
                            <CheckCircle2 className="h-4 w-4" />
                         </div>
                         <span className="text-slate-600 font-bold text-lg">{item.step}</span>
                      </div>
                    ))}
                 </div>

                 <button className="h-14 px-12 bg-gradient-to-r from-orange-400 to-[#F06C00] text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all">
                    Order Now
                 </button>
              </div>

              {/* Ambassador Image (From ambassador.png) */}
              <div className="absolute right-0 bottom-0 w-[55%] h-full z-0 pointer-events-none">
                 <img 
                   src="/images/trust/ambassador.png" 
                   className="w-full h-full object-contain object-bottom" 
                   alt="Ambassador" 
                 />
                 {/* Radial fade to white */}
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
              </div>

              {/* Gradient Borders (Mirroring the image) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-5 blur-[60px]" />
              <div className="absolute inset-[2px] rounded-[2.5rem] border-[1.5px] border-transparent bg-gradient-to-br from-orange-100 to-emerald-100 opacity-20 pointer-events-none -z-0" />
            </div>

            {/* BOTTOM CARD: VIDEO TESTIMONIAL */}
            <div className="h-[280px] rounded-[2.5rem] relative overflow-hidden group cursor-pointer group">
              <img 
                src="/images/trust/testimonial.png" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                alt="Testimonial Video" 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-20 w-20 rounded-full bg-[#D32F2F] flex items-center justify-center shadow-2xl text-white group-hover:scale-110 transition-transform">
                    <Play className="h-10 w-10 fill-current ml-1" />
                 </div>
              </div>

              {/* Umbrella/Staff Icon Suggestion or Branded overlay if needed */}
              <div className="absolute top-6 right-8 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white border border-white/10 tracking-widest">
                 Live Lab Tour
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
