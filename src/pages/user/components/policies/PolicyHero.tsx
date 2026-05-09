import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  /** Use full content width inside max-w-7xl (e.g. About). Default keeps intro at max-w-3xl. */
  wide?: boolean;
}

export function PolicyHero({ icon: Icon, eyebrow, title, subtitle, wide }: PolicyHeroProps) {
  return (
    <section className="relative flex flex-col justify-center min-h-[30vh] overflow-hidden bg-white border-b border-slate-100">
      <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100/80" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
      <div className="absolute -top-[20%] -left-[8%] w-[420px] h-[420px] bg-red-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-5%] w-[380px] h-[380px] bg-orange-50/40 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1e293b 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-10 md:py-14">
        <div className={cn("space-y-5", wide ? "max-w-7xl" : "max-w-3xl")}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.35em]">
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {eyebrow}
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-800 tracking-tight leading-[1.15]">
              {title}
            </h1>
            <p
              className={cn(
                "text-slate-500 text-base md:text-lg font-medium leading-relaxed",
                wide ? "max-w-4xl lg:max-w-5xl" : "max-w-2xl",
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}