import { ChevronRight, Phone, MessageSquare, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupportContact() {
  return (
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
         <div className="rounded-[2rem] bg-slate-950 p-8 lg:p-12 relative overflow-hidden group shadow-[0_32px_64px_rgba(0,0,0,0.1)]">
            {/* Cinematic Gradiant Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/10 via-transparent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 relative z-10 items-center">
               <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Connect Directly</div>
                    <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
                     How Can We Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">You Today?</span>
                  </h1>
                  <p className="text-slate-400 text-base font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-80">
                     Questions? Need help with your order? Looking for technical guidance? Our experienced support team is here to ensure your testing process is smooth, transparent, and efficient.
                     <br/><br/>
                     Fast responses. Expert guidance. Reliable support.
                  </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                     <div className="space-y-3 group/item cursor-pointer">
                        <div className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-lg">
                           <Phone className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Phone Support</p>
                           <p className="text-xs font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors">+91 1800 248 8342</p>
                        </div>
                     </div>
                     <div className="space-y-3 group/item cursor-pointer">
                        <div className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-lg">
                           <Mail className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Inquiry</p>
                           <p className="text-xs font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors">support@litmus.ai</p>
                        </div>
                     </div>
                     <div className="space-y-3 group/item cursor-pointer ">
                        <div className="h-12 w-12 rounded-[1rem] bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover/item:bg-[#25D366] group-hover/item:text-white transition-all duration-500 shadow-lg">
                           <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> WhatsApp Support
                           </p>
                           <p className="text-xs font-semibold text-white tracking-tight">Message Our Scientists Live</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="relative">
                  {/* Glassy Callback Card */}
                  <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-center gap-8 relative overflow-hidden backdrop-blur-3xl shadow-xl transition-transform duration-700 group-hover:scale-[1.02]">
                     <div className="absolute top-10 right-10 w-32 h-32 bg-[#D32F2F]/30 blur-[100px] rounded-full pointer-events-none" />
                     
                     <div className="space-y-2 relative z-10">
                        <h4 className="text-xl font-semibold text-white tracking-tight">Request a Callback</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Leave your contact details and a clinical expert will reach out within <span className="text-white font-bold">15 minutes.</span></p>
                     </div>

                     <div className="space-y-5 relative z-10">
                        <div className="space-y-3">
                           <Input 
                             placeholder="Full Name" 
                             className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-500 text-sm" 
                           />
                           <Input 
                             placeholder="Contact Number" 
                             className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-500 text-sm" 
                           />
                        </div>
                        <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-xs active:scale-95 transition-all">
                          Submit Brief <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                     </div>
                     
                     <div className="pt-2 flex items-center justify-center gap-2 opacity-40">
                        <Shield className="h-3 w-3 text-white" />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Secure Clinical Link</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
  );
}
