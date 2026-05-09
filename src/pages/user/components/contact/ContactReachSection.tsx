import { ChevronRight, Phone, Mail, MessageSquare, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Mirrors SupportContact — dark slate card, channels left, glass form right — tuned for corporate contact. */
export function ContactReachSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="rounded-[2rem] bg-slate-950 p-8 lg:p-12 relative overflow-hidden group shadow-[0_32px_64px_rgba(0,0,0,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/10 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 relative z-10 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">
                Reach Litmus
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
                Partnerships, press &amp; <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">
                  headquarters desks.
                </span>
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md opacity-90">
                Chennai HQ welcomes scheduled visits. Remote teams cover Mumbai and Bengaluru for enterprise workshops — note your city in the
                form and we will coordinate.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="space-y-3 group/item cursor-pointer">
                <div className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Switchboard</p>
                  <p className="text-xs font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors">
                    +91 1800 248 8342
                  </p>
                </div>
              </div>
              <div className="space-y-3 group/item cursor-pointer">
                <div className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-slate-950 transition-all duration-500 shadow-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Corporate email</p>
                  <p className="text-xs font-semibold text-white tracking-tight group-hover/item:text-[#F06C00] transition-colors break-all">
                    hello@litmus.ai
                  </p>
                </div>
              </div>
              <div className="space-y-3 group/item cursor-pointer col-span-2 sm:col-span-1">
                <div className="h-12 w-12 rounded-[1rem] bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover/item:bg-[#25D366] group-hover/item:text-white transition-all duration-500 shadow-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    WhatsApp
                  </p>
                  <p className="text-xs font-semibold text-white tracking-tight">Enterprise desk — weekdays</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-start pt-2 border-t border-white/10">
              <div className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Chennai HQ — visits by appointment</p>
                <p className="text-xs font-semibold text-white tracking-tight leading-relaxed max-w-md">
                  Tower B, Innovation Corridor, OMR — Tamil Nadu 600097 (demo address)
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Mon–Sat · 08:00–20:00 IST</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col gap-6 relative overflow-hidden backdrop-blur-3xl shadow-xl transition-transform duration-700 group-hover:scale-[1.01]">
              <div className="absolute top-10 right-10 w-32 h-32 bg-[#D32F2F]/30 blur-[100px] rounded-full pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <h4 className="text-xl font-semibold text-white tracking-tight">Send a message</h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  Share context on budgets, timelines, or regulatory geography — we reply within{" "}
                  <span className="text-white font-bold">two business days.</span>
                </p>
              </div>

              <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Full name"
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 placeholder:text-slate-500 text-sm"
                  />
                  <Input
                    type="email"
                    placeholder="Work email"
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 placeholder:text-slate-500 text-sm"
                  />
                </div>
                <Input
                  placeholder="Company / organisation"
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 placeholder:text-slate-500 text-sm"
                />
                <Input
                  placeholder="Subject"
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl px-5 focus:bg-white/10 focus:border-white/20 placeholder:text-slate-500 text-sm"
                />
                <Textarea
                  placeholder="How can we help?"
                  rows={4}
                  className="rounded-xl bg-white/5 border-white/10 text-white px-5 py-4 focus:bg-white/10 focus:border-white/20 placeholder:text-slate-500 text-sm resize-none min-h-[120px]"
                />
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-xs active:scale-95 transition-all"
                >
                  Submit enquiry <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="pt-1 flex items-center justify-center gap-2 opacity-40">
                <Shield className="h-3 w-3 text-white shrink-0" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Enterprise-grade transit · demo form</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
