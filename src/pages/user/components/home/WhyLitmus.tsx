import { Shield, Package, FileText, Zap, Stethoscope, Check, ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const whyLitmusDetailed = [
   { title: "NABL Certified Labs", icon: Shield, desc: "We partner exclusively with rigorously audited, top-tier accredited laboratories to ensure every test meets the absolute highest national and global safety standards." },
   { title: "Seamless Collection", icon: Package, desc: "Skip the lab lines. Our skilled phlebotomists and collection agents handle secure doorstep sample pickups in optimal, temperature-controlled conditions." },
   { title: "FSSAI Validated", icon: FileText, desc: "Our standardized testing protocols guarantee analytical reports that are 100% reliable, legally valid, and strictly adhere to extensive FSSAI regulatory criteria." },
   { title: "Rapid Turnaround", icon: Zap, desc: "Time is critical in the food sector. We have optimized our logistics pipeline to securely deliver verified, digital reports within just 3 to 5 business days." },
   { title: "Expert Consultation", icon: Stethoscope, desc: "Don't just stare at raw data. Our dedicated network of certified food scientists are available around the clock to help interpret results and suggest corrective actions." },
   { title: "Absolute Transparency", icon: Check, desc: "No hidden logistics fees or surprise laboratory surcharges. The price you see on our platform upfront is exactly what you pay for the complete end-to-end service." },
];

export function WhyLitmus() {
   return (
      <section className="py-24 bg-white relative overflow-hidden min-h-[80vh] flex items-center ">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

         <div className="max-w-7xl mx-auto px-4 relative z-10 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* Storytelling Left Side */}
            <div className="lg:w-5/12 max-w-2xl text-left">
               <SectionHeader
                 badge="The Litmus Standard"
                 title={
                   <>
                     Why choose <br />
                     <span className="text-transparent bg-clip-text bg-gradient-brand">Litmus Testing?</span>
                   </>
                 }
                 subtitle="We believe food safety shouldn't be an opaque or complicated hurdle. Our platform was built on a foundation of absolute truth—connecting you instantly to world-class laboratory infrastructure."
                 className="mb-8"
               />
               
               <div className="text-lg text-slate-600 space-y-6 leading-relaxed mb-12">
                  <p>
                     By eliminating structural middlemen and digitizing the entire tracking lifecycle, we provide an unparalleled premium experience that guarantees <strong>accuracy, lightning speed, and total reliability</strong> from sample collection down to the final certified report.
                  </p>
               </div>

               <div className="flex items-center gap-4">
                  <button className="px-8 py-4 bg-gradient-brand text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(211,47,47,0.3)] hover:shadow-[0_8px_30px_rgba(211,47,47,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                     Start Testing Today
                     <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>

            {/* Interactive Right Side Grid */}
            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
               {whyLitmusDetailed.map((feature, idx) => (
                  <div key={idx} className="group p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-[#D32F2F]/20 hover:shadow-[0_24px_50px_rgba(211,47,47,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left cursor-default">
                     <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-100 group-hover:bg-gradient-brand group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <feature.icon className="h-8 w-8" />
                     </div>
                     <h3 className="text-xl text-slate-800 font-bold mb-3 group-hover:text-[#D32F2F] tracking-tight transition-colors">{feature.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{feature.desc}</p>
                  </div>
               ))}
            </div>

         </div>
      </section>
   );
}
