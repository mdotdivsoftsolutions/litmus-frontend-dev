import { Search, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SupportHero() {
  return (
      <section className="relative pt-20 pb-8 md:pb-20 overflow-hidden bg-white">
        {/* Cinematic Accents */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none transition-transform duration-[3000ms]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#D32F2F]/5 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* Left Column: Text & Search */}
            <div className="flex-1 text-center lg:text-left space-y-6 py-2 lg:py-0">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.4em] shadow-sm">
                    <Headset className="h-4 w-4" /> 24/7 Clinical Helpdesk
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                     Need Assistance?  <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]"> Our Support Team Is Ready to Help</span>
                  </h1>
                  <p className="text-slate-500 text-base font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-80">
                     From placing your first order to understanding your test reports, our dedicated support team is available to answer your questions and resolve issues quickly. We believe great service extends beyond testing, ensuring you have the support you need at every stage.
                  </p>
                </div>

                <div className="relative max-w-xl mx-auto lg:mx-0 group">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#D32F2F] transition-colors" />
                   <Input 
                     placeholder="Search diagnostics, sample collection..." 
                     className="h-14 pl-14 pr-36 bg-white border border-slate-100 rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.03)] text-base placeholder:text-slate-300 text-slate-800 transition-all focus:border-[#D32F2F]/20 focus:ring-0" 
                   />
                   <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-xs rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                     Search
                   </Button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-10 pt-2">
                   <div>
                      <p className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tighter leading-none">Instant</p>
                      <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">Response Time</p>
                   </div>
                   <div className="w-px h-8 bg-slate-100" />
                   <div>
                      <p className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tighter leading-none">15k+</p>
                      <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">Resolved</p>
                   </div>
                   <div className="w-px h-8 bg-slate-100" />
                   <div>
                      <p className="text-2xl sm:text-3xl font-semibold text-emerald-500 tracking-tighter leading-none">98.4%</p>
                      <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">CSAT Score</p>
                   </div>
                </div>
            </div>

            {/* Right Column: Video */}
            <div className="flex-1 relative w-full lg:w-auto">
                <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1.5rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] pointer-events-none z-0">
                     <iframe 
                       className="w-full h-full pointer-events-none"
                       src="https://www.youtube.com/embed/6k2Pq-dV_gI?si=s5H0X70H1Q_32j2B&controls=0&rel=0&modestbranding=1&showinfo=0&autoplay=1&mute=1&start=4&end=30&iv_load_policy=3" 
                       title="Litmus Support Tour"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                       allowFullScreen
                       style={{ border: 'none' }}
                     />
                   </div>
                </div>
            </div>

          </div>
        </div>
      </section>
  );
}
