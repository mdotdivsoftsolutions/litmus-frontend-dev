import { Star, Shield, Package, FileText, Zap, Stethoscope, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
   { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. Reports were detailed and FSSAI compliant. Highly recommend!", date: "2 weeks ago" },
   { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. WhatsApp updates kept me informed throughout the entire testing process. Will use again.", date: "1 month ago" },
   { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
   { name: "Kavya Singh", city: "Delhi", rating: 5, text: "The booking process was seamless, and the sample collection was done right on time. Very impressive.", date: "1 week ago" },
];

import { ArrowRight, Flame } from "lucide-react";

const whyLitmusDetailed = [
   { title: "NABL Certified Labs", icon: Shield, desc: "We partner exclusively with rigorously audited, top-tier accredited laboratories to ensure every test meets the absolute highest national and global safety standards." },
   { title: "Seamless Collection", icon: Package, desc: "Skip the lab lines. Our skilled phlebotomists and collection agents handle secure doorstep sample pickups in optimal, temperature-controlled conditions." },
   { title: "FSSAI Validated", icon: FileText, desc: "Our standardized testing protocols guarantee analytical reports that are 100% reliable, legally valid, and strictly adhere to extensive FSSAI regulatory criteria." },
   { title: "Rapid Turnaround", icon: Zap, desc: "Time is critical in the food sector. We have optimized our logistics pipeline to securely deliver verified, digital reports within just 3 to 5 business days." },
   { title: "Expert Consultation", icon: Stethoscope, desc: "Don't just stare at raw data. Our dedicated network of certified food scientists are available around the clock to help interpret results and suggest corrective actions." },
   { title: "Absolute Transparency", icon: Check, desc: "No hidden logistics fees or surprise laboratory surcharges. The price you see on our platform upfront is exactly what you pay for the complete end-to-end service." },
];

export function HomeReviewsAndInfo() {
   return (
      <>
         <section className="py-24 bg-white relative overflow-hidden min-h-[80vh] flex items-center ">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

               {/* Storytelling Left Side */}
               <div className="lg:w-5/12 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#D32F2F] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                     <Flame className="h-4 w-4" /> The Litmus Standard
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
                     Why choose <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Litmus Testing?</span>
                  </h2>
                  <div className="text-lg text-slate-600 space-y-6 leading-relaxed">
                     <p>
                        We believe food safety shouldn't be an opaque or complicated hurdle. Our platform was built on a foundation of absolute truth—connecting you instantly to world-class laboratory infrastructure.
                     </p>
                     <p>
                        By eliminating structural middlemen and digitizing the entire tracking lifecycle, we provide an unparalleled premium experience that guarantees <strong>accuracy, lightning speed, and total reliability</strong> from sample collection down to the final certified report.
                     </p>
                  </div>

                  <div className="mt-12 flex items-center gap-4">
                     <button className="px-8 py-4 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(211,47,47,0.3)] hover:shadow-[0_8px_30px_rgba(211,47,47,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                        Start Testing Today
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>

               {/* Interactive Right Side Grid */}
               <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  {whyLitmusDetailed.map((feature, idx) => (
                     <div key={idx} className="group p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-[#D32F2F]/20 hover:shadow-[0_24px_50px_rgba(211,47,47,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left cursor-default">
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-100 group-hover:bg-gradient-to-br group-hover:from-[#D32F2F] group-hover:to-[#F06C00] group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                           <feature.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl text-slate-800 font-bold mb-3 group-hover:text-[#D32F2F] tracking-tight transition-colors">{feature.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{feature.desc}</p>
                     </div>
                  ))}
               </div>

            </div>
         </section>

         <section className="py-24 bg-slate-50 relative overflow-hidden min-h-[70vh] flex flex-col justify-center ">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F06C00]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                  <div>
                     <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
                        Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Reviews</span>
                     </h2>
                     <p className="text-slate-500 mt-3 text-lg">See why thousands of businesses trust Litmus for their uncompromising food safety testing.</p>
                  </div>
                  <span className="text-[#D32F2F] font-medium text-sm cursor-pointer hover:underline flex items-center gap-1 group whitespace-nowrap bg-red-50 px-6 py-2.5 rounded-full border border-red-100 shadow-sm transition-all hover:bg-[#D32F2F] hover:text-white">
                     Read All Stories <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </div>

               <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-12 px-2 -mx-2">
                  {reviews.map((r, i) => (
                     <div key={i} className="w-[420px] shrink-0 bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative group hover:shadow-[0_24px_50px_rgba(211,47,47,0.08)] hover:border-red-100 transition-all duration-500 hover:-translate-y-2">
                        {/* Watermark Quote */}
                        <span className="absolute top-0 right-8 text-[140px] font-serif text-slate-50 leading-none group-hover:text-red-50 transition-colors duration-500 select-none pointer-events-none">
                           "
                        </span>

                        <div className="flex items-center gap-1.5 mb-8 relative z-10">
                           {[1, 2, 3, 4, 5].map(s => <Star key={s} className={cn("h-5 w-5", s <= r.rating ? "fill-[#F06C00] text-[#F06C00]" : "text-slate-200")} />)}
                        </div>
                        <p className="text-lg text-slate-700 leading-relaxed flex-1 relative z-10 font-medium">"{r.text}"</p>

                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10 group-hover:border-red-100 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-gradient-to-br from-[#D32F2F] to-[#F06C00] text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-[0_4px_14px_rgba(211,47,47,0.3)]">
                                 {r.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-base font-bold text-slate-800">{r.name}</p>
                                 <p className="text-sm font-medium text-[#D32F2F]">{r.city}</p>
                              </div>
                           </div>
                           <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{r.date}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>         {/* ═══════════ PROMOTIONAL CHECKUP BANNER ═══════════ */}
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
               <div className="relative h-[380px] lg:h-[420px] w-full rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 group">
                  {/* Left Content Area */}
                  <div className="flex-[1.2] p-10 lg:p-14 flex flex-col justify-center relative z-10">
                     <div className="inline-flex items-center gap-2 text-[#059669] text-xs font-black uppercase tracking-[0.2em] mb-4">
                        <Check className="h-4 w-4" /> Comprehensive Safety
                     </div>
                     <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-[1.8] mb-6">
                        Advanced <span className="text-[#F06C00]">Food Industry</span> <br />
                        Safety Checkup
                     </h2>
                     <p className="text-slate-500 text-lg lg:text-lg font-medium mb-8 leading-relaxed max-w-lg">
                        60+ Parameters including Standardization, Microbial Scan, and Adulteration Check.
                     </p>
                     <button className="self-start h-14 px-10 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl shadow-[0_12px_30px_rgba(5,150,105,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                        Book Now <ArrowRight className="h-5 w-5" />
                     </button>
                  </div>
                  {/* Right Image Composition */}
                  <div className="flex-1 relative h-64 lg:h-auto bg-[#FEBA50]">
                     <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-1000"
                        alt="Food Safety"
                     />
                     <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent hidden lg:block" />
                  </div>
               </div>
            </div>
         </section>

         {/* ═══════════ WHATSAPP SUPPORT BANNER ═══════════ */}
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
      </>
   );
}

