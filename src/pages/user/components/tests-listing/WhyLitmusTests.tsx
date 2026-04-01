import { Shield, Clock, Zap, Smartphone, Star } from "lucide-react";
import excellenceImg from "@/assets/clinical-excellence.png";
import { cn } from "@/lib/utils";

interface WhyLitmusTestsProps {
  theme?: "light" | "dark";
}

export const WhyLitmusTests = ({ theme = "dark" }: WhyLitmusTestsProps) => {
  const isDark = theme === "dark";

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
    <section className={cn(
      "relative py-32 overflow-hidden transition-colors duration-1000",
      isDark ? "bg-[#0A0D14]" : "bg-white"
    )}>
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={excellenceImg} 
          alt="Clinical Excellence" 
          className={cn(
            "w-full h-full object-cover scale-110 blur-[2px] transition-opacity duration-1000",
            isDark ? "opacity-20 mix-blend-luminosity" : "opacity-5"
          )} 
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
          isDark 
            ? "from-[#0A0D14] via-[#0A0D14]/80 to-[#0A0D14]" 
            : "from-white/50 via-white/80 to-white"
        )} />
        
        {/* Animated Background Highlights */}
        <div className={cn(
          "absolute top-1/4 -left-20 w-[500px] h-[500px] blur-[150px] rounded-full animate-pulse",
          isDark ? "bg-red-600/10" : "bg-red-500/5"
        )} />
        <div className={cn(
          "absolute bottom-1/4 -right-20 w-[500px] h-[500px] blur-[150px] rounded-full animate-pulse delay-700",
          isDark ? "bg-orange-600/10" : "bg-orange-500/5"
        )} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className={cn(
                "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md",
                isDark 
                  ? "bg-white/[0.03] border-white/10 text-red-500" 
                  : "bg-slate-50 border-slate-100 text-[#D32F2F]"
              )}>
                <Star className="h-3.5 w-3.5 fill-current" /> The Litmus Standard
              </div>
              <h2 className={cn(
                "text-4xl md:text-5xl xl:text-6xl font-black tracking-[-0.04em] leading-[1.05]",
                isDark ? "text-white" : "text-slate-800"
              )}>
                Transparency, Compliance, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Clinical Precision.</span>
              </h2>
              <p className={cn(
                "text-lg md:text-xl font-medium leading-relaxed max-w-2xl",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                At Litmus, we don't just test; we validate. Our ecosystem is built on the foundational pillars of scientific integrity and digital transparency.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((item, idx) => (
                <div key={idx} className={cn(
                  "group p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2",
                  isDark 
                    ? "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10" 
                    : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-xl hover:shadow-slate-200/50"
                )}>
                  <div className={cn(
                    "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-2xl mb-7 group-hover:scale-110 transition-transform duration-500",
                    item.color
                  )}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className={cn(
                    "text-xl font-bold mb-3 tracking-tight",
                    isDark ? "text-white" : "text-slate-800"
                  )}>{item.title}</h3>
                  <p className={cn(
                    "text-[15px] leading-relaxed font-medium",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn(
                    "h-12 w-12 rounded-full border-[3px] overflow-hidden relative ring-2 shadow-xl",
                    isDark ? "border-[#0A0D14] bg-slate-800 ring-white/5" : "border-white bg-slate-200 ring-slate-100"
                  )}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    {i === 5 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center text-[10px] font-black text-white">
                        5K+
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={cn(
                "text-sm font-bold tracking-wide uppercase",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                Trusted by <span className={isDark ? "text-white" : "text-slate-800"}>5,000+</span> Food Producers across India.
              </div>
            </div>
          </div>

          {/* Panoramic Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className={cn(
              "relative aspect-[4/5] rounded-[4.5rem] overflow-hidden border-[16px] shadow-[0_64px_128px_rgba(0,0,0,0.5)]",
              isDark ? "border-white/5" : "border-white shadow-xl shadow-slate-200/50"
            )}>
               <img 
                 src="https://images.unsplash.com/photo-1579154235602-382b996311bd?auto=format&fit=crop&q=80&w=800" 
                 alt="Lab Equipment" 
                 className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
               />
               <div className={cn(
                 "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60",
                 isDark ? "from-[#0A0D14]" : "from-slate-900/40"
               )} />
               
               {/* Floating Batch Card */}
               <div className={cn(
                 "absolute bottom-10 left-10 right-10 p-8 rounded-[3rem] backdrop-blur-3xl border flex items-center gap-6 shadow-2xl transition-all duration-700",
                 isDark ? "bg-white/[0.03] border-white/10" : "bg-white/80 border-white"
               )}>
                  <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center shrink-0 shadow-lg ring-4 ring-red-500/10">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-1.5", isDark ? "text-white/40" : "text-slate-400")}>Live Certification</p>
                    <p className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-800")}>LT-8842-X Verified</p>
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
            <div className={cn(
              "absolute -top-20 -right-20 w-80 h-80 blur-[120px] rounded-full -z-10",
              isDark ? "bg-red-600/20" : "bg-red-100"
            )} />
            <div className={cn(
              "absolute -bottom-20 -left-20 w-80 h-80 blur-[120px] rounded-full -z-10",
              isDark ? "bg-orange-600/20" : "bg-orange-100"
            )} />
          </div>

        </div>
      </div>
    </section>
  );
};
