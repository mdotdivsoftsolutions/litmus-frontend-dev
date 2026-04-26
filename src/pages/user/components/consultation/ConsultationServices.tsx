import { Shield, Target, Bookmark, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultationBookingModal } from "./ConsultationBookingModal";

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

export function ConsultationServices() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">Expert Domains</div>
             <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 lg:text-3xl">
               Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Advisory</span> for Every Dimension.
             </h2>
             <p className="mt-4 text-md font-medium text-slate-500 max-w-xl leading-relaxed">
                Deep-dive into specialized food analytics domains with our curated advisory frameworks.
             </p>
          </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
         {services.map((service, idx) => (
           <div key={idx} className={cn(
             "group p-8 lg:p-10 rounded-[1.5rem] border border-slate-100 bg-white transition-all duration-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] relative overflow-hidden flex flex-col justify-between",
             service.hover
           )}>
              {/* Subtle top-right gradient circle */}
              <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full translate-x-1/2 -translate-y-1/3 group-hover:scale-125 transition-transform duration-[2000ms] pointer-events-none", service.bg)} />
              
              <div className="relative z-10 space-y-6">
                <div className={cn(
                  "inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br",
                  service.color
                )}>
                   <service.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{service.title}</h3>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{service.tag}</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Protocol Design", "Risk Map", "Audit Chain"].map((tag, i) => (
                    <span key={i} className="text-[8px] font-extrabold uppercase text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8">
                <ConsultationBookingModal serviceName={service.title}>
                  <Button className="h-9 px-6 rounded-lg bg-primary hover:bg-primary-deep text-primary-foreground font-semibold text-xs shadow-sm transition-all outline-none">
                    Book Now <ArrowRight className="h-3 w-3 ml-1.5" />
                  </Button>
                </ConsultationBookingModal>
              </div>
           </div>
         ))}
      </div>
    </section>
  );
}
