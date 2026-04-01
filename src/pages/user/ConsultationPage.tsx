import { MessageCircle, Shield, ArrowRight, Zap, Target, Bookmark, Activity, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import excellenceImg from "@/assets/clinical-excellence.png";
import { WhyLitmusTests } from "./components/tests-listing/WhyLitmusTests";

const services = [
  {
    icon: Shield,
    title: "FSSAI Compliance Strategy",
    description: "Navigate the complex landscape of FSSAI regulations with our certified compliance officers. From licensing to internal audits.",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50/50",
    hover: "hover:border-emerald-200",
    tag: "Regulatory"
  },
  {
    icon: Target,
    title: "Clinical Lab Integration",
    description: "Expert guidance for large-scale manufacturers looking to modernize their in-house diagnostic capabilities and automation.",
    color: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50/50",
    hover: "hover:border-blue-200",
    tag: "Infrastructure"
  },
  {
    icon: Bookmark,
    title: "Label Validation & Audit",
    description: "Ensure your product labels are accurate, compliant, and transparent. We audit nutritional panels and claim verifications.",
    color: "from-orange-400 to-[#F06C00]",
    bg: "bg-orange-50/50",
    hover: "hover:border-orange-200",
    tag: "Validation"
  },
  {
    icon: Activity,
    title: "Shelf Life Verification",
    description: "Scientific acceleration of product stability studies to determine optimal storage life and safety margins.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50/50",
    hover: "hover:border-rose-200",
    tag: "Research"
  }
];

export default function ConsultationPage() {
  return (
    <div className="animate-fade-in font-manrope min-h-screen bg-slate-50">
      {/* 1. CINEMATIC CONSULTATION HERO */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-white group/hero">
        {/* Animated Background Textures */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[45%] h-full bg-slate-900 overflow-hidden hidden lg:block">
           <img 
              src="https://images.unsplash.com/photo-1579154235602-382b996311bd?auto=format&fit=crop&q=80&w=1200" 
              alt="Scientific Advisory" 
              className="w-full h-full object-cover opacity-60 scale-105 group-hover/hero:scale-110 transition-transform duration-[10000ms]"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-slate-900/40 via-slate-900/80 to-slate-900" />
           
           {/* Floating Certification Tag */}
           <div className="absolute top-1/2 left-12 -translate-y-1/2 p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-4 max-w-xs animate-slide-up">
              <div className="h-12 w-12 rounded-2xl bg-[#D32F2F] flex items-center justify-center shadow-lg">
                 <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-white text-lg font-semibold tracking-tight">Accredited Strategic Guidance</p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Direct access to scientists specializing in FSSAI, ISO, and international export certifications.</p>
           </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center min-h-[600px] gap-20">
          <div className="space-y-12 animate-slide-up">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">
                <Star className="h-4 w-4 fill-current" /> Expert Advisory
              </div>
              <h1 className="text-5xl lg:text-4xl font-semibold text-slate-800 tracking-tight leading-[1.1]">
                 Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Clinical Strategy</span> <br />
                 for Enterprise Brands.
              </h1>
              <p className="text-slate-500 text-lg  font-medium max-w-xl leading-relaxed opacity-80">
                 Partner with our elite team of scientists to optimize your diagnostic roadmap and global safety certifications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Button size="lg" className="h-14 px-10 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl flex items-center gap-4 transition-all hover:scale-[1.02] shadow-[0_24px_48px_rgba(211,47,47,0.3)]">
                Request Strategy Brief <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[21, 22, 23, 24].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="h-12 w-12 rounded-full border-4 border-white shadow-xl ring-1 ring-slate-100" />
                  ))}
                </div>
                <div>
                   <p className="text-sm font-black text-slate-800 mb-0.5">24 Scientists</p>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Advisory
                   </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-10 pt-4 border-t border-slate-100">
               <div>
                  <p className="text-2xl font-semibold text-slate-800 tracking-tighter">180+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Specialists</p>
               </div>
               <div>
                  <p className="text-2xl font-semibold text-[#D32F2F] tracking-tighter">12k+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Advisory Hours</p>
               </div>
               <div>
                  <p className="text-2xl font-semibold text-slate-800 tracking-tighter">98%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Compliance</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ADVISORY SERVICES GRID (Interactive Cards) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">Expert Domains</div>
               <h2 className="text-4xl lg:text-4xl font-semibold text-slate-800 tracking-tight leading-tight max-w-2xl">
                 Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Advisory</span> for Every Dimension.
               </h2>
               <p className="text-slate-500 text-lg font-medium max-w-xl opacity-80 leading-relaxed">
                  Deep-dive into specialized food analytics domains with our curated advisory frameworks.
               </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-16">
           {services.map((service, idx) => (
             <div key={idx} className={cn(
               "group p-12 rounded-[1.5rem] border-2 border-slate-50 transition-all duration-1000 shadow-[0_64px_96px_rgba(0,0,0,0.06)] relative overflow-hidden",
               service.bg, service.hover
             )}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-[2000ms]" />
                
                <div className="relative z-10 space-y-10">
                  <div className={cn(
                    "inline-flex h-20 w-20 items-center justify-center rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-700 bg-gradient-to-br",
                    service.color
                  )}>
                     <service.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">{service.title}</h3>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-slate-500 transition-colors">{service.tag}</span>
                    </div>
                    <p className="text-slate-500 text-lg leading-relaxed font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {["Protocol Design", "Risk Map", "Audit Chain"].map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase text-slate-400 bg-white/50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors">{tag}</span>
                    ))}
                  </div>

                  <Button className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm shadow-[0_4px_14px_rgba(211,47,47,0.3)] hover:shadow-[0_6px_20px_rgba(211,47,47,0.4)] hover:-translate-y-0.5 transition-all outline-none">
                    Book Now <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 4. LIGHT THEME WHY LITMUS STORYTELLING */}
      {/* <WhyLitmusTests theme="dark" /> */}
    </div>
  );
}
