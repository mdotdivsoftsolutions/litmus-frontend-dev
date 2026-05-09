import { Link } from "react-router-dom";
import { LifeBuoy, FlaskConical, Package, MapPin, FileText, Headphones, ArrowRight } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
const tiles = [
  {
    title: "Browse tests",
    description: "Search parameters, methods, and pricing across accredited partner labs.",
    href: "/tests",
    icon: FlaskConical,
  },
  {
    title: "Health packages",
    description: "Bundle popular assays for compliance checks and routine monitoring.",
    href: "/packages",
    icon: Package,
  },
  {
    title: "Sample collection",
    description: "How home visits work, fasting rules, and container guidelines.",
    href: "/support",
    icon: MapPin,
  },
  {
    title: "Reports & billing",
    description: "Download PDF reports, GST invoices, and understand turnaround times.",
    href: "/reports",
    icon: FileText,
  },
];

export default function HelpCenterPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={LifeBuoy}
        eyebrow="Resources · Help center"
        title={
          <>
            How can we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              help you?
            </span>
          </>
        }
        subtitle="Quick paths to booking, samples, reports, and live support. Demo content for your Help hub — replace with real articles and links when ready."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.href}
                  to={tile.href}
                  className="group rounded-2xl border border-slate-100 bg-slate-50/40 p-6 hover:border-[#D32F2F]/20 hover:bg-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div className="h-11 w-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 group-hover:border-[#D32F2F]/15">
                    <Icon className="h-5 w-5 text-[#D32F2F]" aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-2">{tile.title}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{tile.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D32F2F]">
                    Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Headphones className="h-6 w-6 text-[#feba50]" aria-hidden />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 mb-2">Still stuck?</p>
                <h3 className="text-xl font-semibold tracking-tight mb-2">Talk to the Litmus support desk</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Share your order ID or mobile number and we will coordinate with the performing lab on status updates and report delivery.
                </p>
              </div>
            </div>
            <Link
              to="/support"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white text-sm font-semibold shrink-0 hover:opacity-95 transition-opacity"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
