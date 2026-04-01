import { Search, ChevronRight, HelpCircle, Phone, MessageSquare, Mail, Globe, Clock, Shield, Star, Zap, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const helpCategories = [
  { 
    icon: Shield, 
    title: "Account & Privacy", 
    count: "12 Articles",
    color: "bg-blue-50 text-blue-500",
    hover: "hover:border-blue-100"
  },
  { 
    icon: HelpCircle, 
    title: "Booking & Payments", 
    count: "24 Articles",
    color: "bg-emerald-50 text-emerald-500",
    hover: "hover:border-emerald-100"
  },
  { 
    icon: Clock, 
    title: "Sample Collection", 
    count: "18 Articles",
    color: "bg-orange-50 text-orange-500",
    hover: "hover:border-orange-100"
  },
  { 
    icon: Globe, 
    title: "Reports & Validation", 
    count: "32 Articles",
    color: "bg-purple-50 text-purple-500",
    hover: "hover:border-purple-100"
  },
];

export default function SupportPage() {
  return (
    <div className="animate-fade-in font-manrope bg-slate-50 min-h-screen">
      {/* 1. SUPPORT HERO SEARCH (Reduced height for efficiency) */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Cinematic Accents */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none transition-transform duration-[3000ms]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#D32F2F]/5 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.4em] shadow-sm">
                <Headset className="h-4 w-4" /> 24/7 Clinical Helpdesk
              </div>
              <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                 Premium Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Support.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed opacity-80">
                 How can we assist your clinical journey today? Search our comprehensive knowledge base or connect with a support specialist.
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#D32F2F] transition-colors" />
               <Input 
                 placeholder="Search diagnostics, sample collection, reports..." 
                 className="h-14 pl-16 pr-44 bg-white border border-slate-100 rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.03)] text-base placeholder:text-slate-300 text-slate-800 transition-all focus:border-[#D32F2F]/20 focus:ring-0" 
               />
               <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-xs rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                 Search Help
               </Button>
            </div>
            
            <div className="flex items-center justify-center gap-12 pt-4">
               <div>
                  <p className="text-3xl font-semibold text-slate-800 tracking-tighter leading-none">Instant</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">Response Time</p>
               </div>
               <div className="w-px h-10 bg-slate-100" />
               <div>
                  <p className="text-3xl font-semibold text-slate-800 tracking-tighter leading-none">15k+</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">Resolved</p>
               </div>
               <div className="w-px h-10 bg-slate-100" />
               <div>
                  <p className="text-3xl font-semibold text-emerald-500 tracking-tighter leading-none">98.4%</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-3">CSAT Score</p>
               </div>
            </div>
        </div>
      </section>

      {/* 2. HELP CATEGORIES (Refined & Professional) */}
      {/* <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((cat, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-[#D32F2F]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 cursor-pointer flex flex-col items-start">
                 <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110", cat.color)}>
                    <cat.icon className="h-6 w-6" />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-800 mb-1 tracking-tight">{cat.title}</h3>
                 <p className="text-[11px] text-slate-400 font-medium tracking-wide leading-relaxed mb-6">
                   {cat.count} curated articles
                 </p>
                 <div className="mt-auto flex items-center gap-2 text-[11px] font-bold uppercase text-[#D32F2F] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                   View Articles <ChevronRight className="h-3.5 w-3.5" />
                 </div>
              </div>
            ))}
         </div>
      </section> */}

      {/* 3. DIRECT CONTACT CHANNELS (Premium Hybrid Card) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="rounded-[2rem] bg-slate-950 p-12 lg:p-20 relative overflow-hidden group shadow-[0_64px_128px_rgba(0,0,0,0.1)]">
            {/* Cinematic Gradiant Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/10 via-transparent to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-24 relative z-10 items-center">
               <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Connect Directly</div>
                    <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">Need immediate <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Clinical Assistance?</span></h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md opacity-80">Our support specialists are standing by 24/7 to help you navigate your diagnostic processes and regulatory compliance.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8">
                     <div className="space-y-4 group/item cursor-pointer">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-xl">
                           <Phone className="h-7 w-7" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phone Support</p>
                           <p className="text-lg font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors">+91 1800 248 8342</p>
                        </div>
                     </div>
                     <div className="space-y-4 group/item cursor-pointer">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-xl">
                           <Mail className="h-7 w-7" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Inquiry</p>
                           <p className="text-lg font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors">support@litmus.ai</p>
                        </div>
                     </div>
                     <div className="space-y-4 group/item cursor-pointer sm:col-span-2">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover/item:bg-[#25D366] group-hover/item:text-white transition-all duration-500 shadow-xl">
                           <MessageSquare className="h-7 w-7" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> WhatsApp Support
                           </p>
                           <p className="text-lg font-semibold text-white tracking-tight">Message Our Scientists Live</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="relative">
                  {/* Glassy Callback Card */}
                  <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-12 flex flex-col justify-center gap-10 relative overflow-hidden backdrop-blur-3xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                     <div className="absolute top-10 right-10 w-32 h-32 bg-[#D32F2F]/30 blur-[100px] rounded-full pointer-events-none" />
                     
                     <div className="space-y-4 relative z-10">
                        <h4 className="text-2xl font-semibold text-white tracking-tight">Request a Callback</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Leave your contact details and a clinical expert will reach out within <span className="text-white font-bold">15 minutes.</span></p>
                     </div>

                     <div className="space-y-6 relative z-10">
                        <div className="space-y-4">
                           <Input 
                             placeholder="Full Name" 
                             className="h-16 bg-white/5 border-white/10 text-white rounded-2xl px-6 focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-500" 
                           />
                           <Input 
                             placeholder="Contact Number" 
                             className="h-16 bg-white/5 border-white/10 text-white rounded-2xl px-6 focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-500" 
                           />
                        </div>
                        <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm shadow-[0_24px_48px_rgba(211,47,47,0.3)] hover:shadow-[0_32px_64px_rgba(211,47,47,0.4)] active:scale-95 transition-all">
                          Submit Brief <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                     </div>
                     
                     <div className="pt-4 flex items-center justify-center gap-2.5 opacity-40">
                        <Shield className="h-4 w-4 text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Secure Clinical Link</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
