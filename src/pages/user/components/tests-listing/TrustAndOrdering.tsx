import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export const TrustAndOrdering = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ═══════════ LEFT: WHY LITMUS? (THE GREEN CARD) ═══════════ */}
          <div className="lg:col-span-6 rounded-[2.5rem] bg-[#1a4332] text-white p-8 md:p-12 relative flex flex-col justify-between overflow-hidden group min-h-[600px] lg:min-h-[660px] shadow-2xl">
            {/* Background Orange Accent (Mirroring the original) */}
            <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-orange-400 rounded-full opacity-30 blur-[60px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-5%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-[#feba50] rounded-full opacity-40 pointer-events-none transform rotate-12 flex items-center justify-center overflow-hidden">
               {/* Stylized Litmus "L" or Leaf accent */}
               <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] border-[12px] md:border-[15px] border-white/20 rounded-full" />
            </div>

            <div className="relative z-10 space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#feba50]">Why Litmus?</h2>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Fast, Safe and</p>
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Accurate</p>
              </div>

              <div className="flex items-center gap-4 md:gap-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 w-fit border border-white/10 mt-8 shadow-xl">
                 <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl bg-[#feba50] flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8 text-[#1a4332]" />
                 </div>
                 <div className="text-base md:text-lg font-bold leading-tight pr-4">
                    <p>100% on time</p>
                    <p className="opacity-90 font-medium">sample collection</p>
                 </div>
              </div>
            </div>

            {/* Collection Agent Image (Filled with styled placeholder) */}
            <div className="absolute bottom-0 right-0 w-[90%] md:w-[80%] h-[70%] z-0 pointer-events-none overflow-hidden rounded-br-[2.5rem]">
              <img 
                src="https://images.unsplash.com/photo-1582713184650-8b90ed9d22fa?w=800&q=80" 
                className="w-full h-full object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity" 
                alt="Litmus Collection Agent"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a4332] via-[#1a4332]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a4332]/20 to-[#1a4332]" />
            </div>

            {/* Navigation Arrows (Visual only, as per image) */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 md:px-6 pointer-events-none z-10">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer bg-black/10 backdrop-blur-sm">
                    <ChevronLeft className="h-6 w-6" />
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer bg-black/10 backdrop-blur-sm">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </div>

            <div className="relative z-10 mt-24">
              <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed max-w-md drop-shadow-md">
                Each sample collected undergoes rigorous temperature mapping and real-time monitoring to ensure 100% clinical accuracy.
              </p>
              {/* Manual Indicators */}
              <div className="flex gap-2.5 mt-8 md:mt-10">
                 <div className="h-1.5 w-10 bg-slate-100 rounded-full" />
                 <div className="h-1.5 w-16 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                 <div className="h-1.5 w-10 bg-slate-100/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT: ORDERING & VIDEO ═══════════ */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* TOP CARD: 3 STEPS (THE WHITE CARD) */}
            <div className="flex-1 rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-10 relative flex flex-col justify-between overflow-hidden shadow-xl shadow-slate-200/50">
              
              <div className="relative z-10 space-y-6 md:space-y-8">
                 <div>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-500 mb-2">Easy ordering in</h4>
                    <h3 className="text-5xl md:text-6xl font-black text-[#10B981] tracking-tighter uppercase leading-none drop-shadow-sm">3 STEPS</h3>
                 </div>

                 <div className="space-y-5">
                    {[
                      { step: "Select tests" },
                      { step: "Add your details" },
                      { step: "Book your slot" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 md:gap-5">
                         <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#10B981] flex items-center justify-center text-white p-0.5 shrink-0 shadow-md">
                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                         </div>
                         <span className="text-slate-700 font-bold text-xl md:text-2xl">{item.step}</span>
                      </div>
                    ))}
                 </div>

                 <button className="h-14 md:h-16 mt-2 px-10 md:px-14 bg-gradient-to-r from-orange-400 to-[#F06C00] text-white font-black text-xl rounded-2xl shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all z-10 relative">
                    Order Now
                 </button>
              </div>

              {/* Ambassador Image (Filled with styled placeholder) */}
              <div className="absolute right-0 bottom-0 w-[60%] lg:w-[65%] h-full z-0 pointer-events-none overflow-hidden rounded-br-[2.5rem]">
                 <img 
                   src="https://images.unsplash.com/photo-1651008376811-b9dd05c85058?w=800&q=80" 
                   className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply" 
                   alt="Ambassador" 
                 />
                 {/* Gradients to fade perfectly into white */}
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white" />
                 <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Gradient Borders (Mirroring the original) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-5 blur-[60px]" />
              <div className="absolute inset-[2px] rounded-[2.5rem] border-[1.5px] border-transparent bg-gradient-to-br from-orange-100 to-emerald-100 opacity-30 pointer-events-none z-0" />
            </div>

            {/* Video section removed as requested */}

          </div>

        </div>
      </div>
    </section>
  );
};

