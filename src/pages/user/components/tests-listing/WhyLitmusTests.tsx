import { Shield, Clock, Zap, Smartphone, Star } from "lucide-react";
import excellenceImg from "@/assets/clinical-excellence.png";
import { cn } from "@/lib/utils";

export const WhyLitmusTests = () => {
  const reasons = [
    {
      icon: Shield,
      title: "NABL Calibration",
      description: "Nationally recognized accuracy standards with certified clinical precision.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Clock,
      title: "Swift TAT",
      description: "Reports delivered with clinically verified efficiency in just 3-5 days.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Full Compliance",
      description: "Adhering to FSSAI & ISO standards for end-to-end safety verification.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Smartphone,
      title: "Live Tracking",
      description: "Real-time updates via WhatsApp & verified QR-coded reports.",
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#0A0D14] ">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={excellenceImg} 
          alt="Clinical Excellence" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-110 blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D14] via-[#0A0D14]/80 to-[#0A0D14]" />
        
        {/* Animated Background Highlights */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-current" /> The Litmus Standard
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-[-0.04em] leading-[1.05]">
                Transparency, Compliance, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Clinical Precision.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                At Litmus, we don't just test; we validate. Our ecosystem is built on the foundational pillars of scientific integrity and digital transparency.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((item, idx) => (
                <div key={idx} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
                  <div className={cn(
                    "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-2xl mb-7 group-hover:scale-110 transition-transform duration-500",
                    item.color
                  )}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-[15px] text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 w-12 rounded-full border-[3px] border-[#0A0D14] bg-slate-800 overflow-hidden relative ring-2 ring-white/5 shadow-xl">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    {i === 5 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center text-[10px] font-black text-white">
                        5K+
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-slate-400 text-sm font-bold tracking-wide uppercase">
                Trusted by <span className="text-white">5,000+</span> Food Producers across India.
              </div>
            </div>
          </div>

          {/* Panoramic Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[4.5rem] overflow-hidden border-[16px] border-white/5 shadow-[0_64px_128px_rgba(0,0,0,0.5)]">
               <img 
                 src="https://images.unsplash.com/photo-1579154235602-382b996311bd?auto=format&fit=crop&q=80&w=800" 
                 alt="Lab Equipment" 
                 className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-60" />
               
               {/* Floating Batch Card */}
               <div className="absolute bottom-10 left-10 right-10 p-8 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex items-center gap-6 shadow-2xl">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center shrink-0 shadow-lg ring-4 ring-red-500/10">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1.5">Live Certification</p>
                    <p className="text-xl font-bold text-white tracking-tight">LT-8842-X Verified</p>
                    <div className="flex items-center gap-2.5 mt-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                       <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Clinical Validation Clear</span>
                    </div>
                  </div>
               </div>

               {/* Decorative Ring */}
               <div className="absolute -top-12 -right-12 w-48 h-48 border-[24px] border-[#D32F2F]/10 rounded-full" />
            </div>

            {/* Cinematic Background Glows */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-600/20 blur-[120px] rounded-full -z-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/20 blur-[120px] rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};
