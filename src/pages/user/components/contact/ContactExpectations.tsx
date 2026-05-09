import { Inbox, Clock, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Inbox,
    title: "We triage every enquiry",
    description:
      "Corporate partnerships, media, and procurement requests land with the right desk — not a generic inbox black hole.",
  },
  {
    icon: Clock,
    title: "Typical response window",
    description:
      "Most messages receive a substantive reply within two business days. Complex RFPs may take longer while we align lab SMEs.",
  },
  {
    icon: Headphones,
    title: "Specimens & bookings",
    description:
      "For urgent sample logistics, order changes, or report access, our clinical support desk is built for speed.",
    linkHref: "/support",
    linkLabel: "Open Support",
  },
];

export function ContactExpectations() {
  return (
    <section className="relative overflow-hidden bg-white border-t border-slate-100 py-14 md:py-20">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/40 blur-[100px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-12 md:mb-14 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D32F2F] mb-3">What to expect</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight leading-tight">
            The same clarity we bring to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">support</span>,
            applied to corporate contact.
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Tell us how we can help — we route thoughtfully and respect both regulatory sensitivity and your timeline.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-[#D32F2F]/15 transition-colors"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-100 text-[#D32F2F] shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 tracking-tight mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.description}</p>
                {"linkHref" in step && step.linkHref ? (
                  <Link
                    to={step.linkHref}
                    className="inline-flex text-xs font-bold uppercase tracking-widest text-[#D32F2F] hover:underline"
                  >
                    {step.linkLabel}
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
