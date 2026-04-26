import { PhoneCall, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PackagesCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 ">
      <div className="relative rounded-[1rem] bg-gradient-to-br from-[#D32F2F] to-[#F06C00] p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/10 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
            Not sure which package fits your needs?
          </h2>
          <p className="text-white/80 text-base font-medium leading-relaxed">
            Connect with our clinical experts for a personalized diagnostic roadmap tailored to your industry and requirements.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="h-12 px-6 bg-white text-slate-800 hover:bg-slate-50 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl">
              <PhoneCall className="h-4 w-4 text-emerald-500" /> Book via Phone Call
            </Button>
            <Button size="lg" className="h-12 px-6 bg-white text-slate-800 hover:bg-slate-50 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl">
              <Package className="h-4 w-4 text-orange-500" /> Quick Order
            </Button>
            <Button size="lg" className="h-12 px-6 bg-white text-slate-800 hover:bg-slate-50 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl">
              <MessageCircle className="h-4 w-4 text-emerald-600" /> Book via Whatsapp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
