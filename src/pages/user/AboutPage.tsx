import {
  Building2,
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Users,
  Microscope,
  Truck,
  FileStack,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PolicyHero } from "./components/policies/PolicyHero";

const metrics = [
  { value: "60+", label: "Assay families", accent: false },
  { value: "25+", label: "Partner labs", accent: true },
  { value: "12", label: "Cities — collection", accent: false },
  { value: "4.8", label: "CSAT — support", accent: false },
  { value: "24/7", label: "Booking & tracking", accent: false },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity of measurement",
    copy: "We publish methods, scopes, and limitations clearly — no black-box “trust us” language.",
  },
  {
    icon: Zap,
    title: "Speed with rigour",
    copy: "Turnaround targets are set with labs upfront; escalations are visible in-product, not buried in email.",
  },
  {
    icon: Eye,
    title: "Transparency",
    copy: "Pricing, SLAs, and report histories are structured for auditors as well as everyday shoppers.",
  },
  {
    icon: Users,
    title: "Partnership",
    copy: "Labs remain the accredited authority; Litmus orchestrates scheduling, data hand-offs, and CX.",
  },
];

const pillars = [
  {
    icon: Microscope,
    title: "Accredited laboratory network",
    copy: "Curated partner labs with chemistry, microbiology, and labelling capabilities mapped to your SKU categories.",
  },
  {
    icon: Truck,
    title: "Collection & logistics",
    copy: "Home visits and hub drops coordinated with cold-chain awareness for sensitive matrices.",
  },
  {
    icon: FileStack,
    title: "Reports & enterprise workflows",
    copy: "PDF delivery, GST-ready artefacts, and hooks for procurement teams wiring diagnostics into QA programmes.",
  },
  {
    icon: Sparkles,
    title: "Consumer-grade experience",
    copy: "Searchable catalogues, cart/checkout, and order tracking — without diluting scientific accuracy.",
  },
];

const milestones = [
  { year: "2019", text: "Pilot marketplace linking Chennai brands with local ISO-ready labs." },
  { year: "2021", text: "Nationwide collection playbook and SLA dashboards for enterprise buyers." },
  { year: "2023", text: "Unified reporting vault with role-based access for QA and regulatory leads." },
  { year: "2026", text: "Expanded assay catalogue and deeper integrations with partner LIMS pipelines." },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        wide
        icon={Building2}
        eyebrow="Company · About Litmus"
        title={
          <>
            Diagnostics infrastructure{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              for safer food
            </span>
          </>
        }
        subtitle="We connect brands, accredited laboratories, and consumers through one trusted layer — booking, logistics orchestration, and clear reporting. Demo narrative below; replace with counsel- and brand-approved copy."
      />

      {/* Story */}
      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-5 text-[15px] md:text-base text-slate-600 leading-relaxed">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Who we are</h2>
            <p>
              Litmus began where many compliance programmes break down —{" "}
              <strong className="text-slate-800 font-semibold">between</strong> the brand owner who needs timely answers and the laboratory
              whose capacity, scope, and paperwork must stay immaculate. We are not a substitute for clinical judgment or statutory authority;
              we are the operational spine that makes accredited testing easier to buy, schedule, and audit.
            </p>
            <p>
              Today our network spans dozens of partner facilities and thousands of monthly bookings across FMCG, dairy, HoReCa suppliers,
              and emerging D2C brands. Product, science, and operations teams sit together so catalogue accuracy and rider coordination do not
              drift apart.
            </p>
            <p>
              Whether you are validating a label claim, clearing a shipment lot, or choosing a panel for routine surveillance, the same
              principles apply: specimen integrity first, honest timelines second, and reporting you can stand behind in front of customers or
              regulators.
            </p>
          </div>
          <aside className="lg:col-span-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-8 space-y-6">
            <p className="text-sm font-semibold text-slate-800 tracking-tight">At a glance</p>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                India-first marketplace with NABL-recognised partner labs as report issuers.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                Mix of self-serve booking and enterprise procurement-friendly workflows.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                Science-led support — not scripted call-centre deflection when samples or scopes get tricky.
              </li>
            </ul>
            <blockquote className="border-l-2 border-[#D32F2F]/40 pl-4 text-sm italic text-slate-500 leading-relaxed">
              “Measurement without traceability is opinion. We built Litmus so traceability is default.”
              <footer className="mt-2 not-italic text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                — Founding note (placeholder)
              </footer>
            </blockquote>
          </aside>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-slate-50 border-t border-slate-100 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center sm:text-left">
                <p className={`text-2xl md:text-3xl font-semibold tracking-tight ${m.accent ? "text-[#D32F2F]" : "text-slate-800"}`}>
                  {m.value}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-100 p-8 md:p-10 bg-gradient-to-br from-white to-slate-50/80">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D32F2F]/10 text-[#D32F2F] mb-6">
              <Eye className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-3">Vision</h2>
            <p className="text-[15px] md:text-base text-slate-600 leading-relaxed">
              A food economy where every consequential safety decision — from new product launch to import clearance — can be backed by
              timely, accredited measurement and plain-language evidence chains.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-8 md:p-10 bg-gradient-to-br from-white to-slate-50/80">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D32F2F]/10 text-[#D32F2F] mb-6">
              <Target className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-3">Mission</h2>
            <p className="text-[15px] md:text-base text-slate-600 leading-relaxed">
              Compress time-to-compliance for product teams while giving households confidence in what they eat. We obsess over specimen
              integrity, predictable turnaround communication, and reports that survive scrutiny from QA leads and auditors alike.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-8">Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[#D32F2F]" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-slate-800 tracking-tight mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">What we deliver</h2>
          <p className="text-[15px] md:text-base text-slate-600 max-w-3xl mb-10 leading-relaxed">
            One platform does not replace specialised instruments or bench scientists — it aligns everyone around the same facts before money
            moves or trucks roll.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-5 rounded-2xl border border-slate-100 p-6 hover:border-[#D32F2F]/15 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-[#D32F2F]" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 tracking-tight mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-slate-50 border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-8">Milestones</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((ms) => (
              <div key={ms.year} className="relative pl-6 border-l-2 border-[#D32F2F]/25">
                <p className="text-sm font-bold text-[#D32F2F] mb-2">{ms.year}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{ms.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality + governance */}
      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4 text-[15px] md:text-base text-slate-600 leading-relaxed">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Quality & governance</h2>
            <p>
              Official certificates and interpretations come from the <strong className="text-slate-800 font-semibold">performing laboratory</strong>,
              not from Litmus marketing pages. We publish accreditation references supplied by partners and keep escalation paths open when
              scopes change or assays need referral.
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
              <li>Structured metadata on orders for audit reconstruction (timestamps, parties, document IDs).</li>
              <li>Privacy posture described in our Privacy Policy; retention tuned for healthcare-adjacent records.</li>
              <li>
                Read how we talk about NABL data on the dedicated{" "}
                <Link to="/nabl" className="font-semibold text-[#D32F2F] hover:underline">
                  NABL statement
                </Link>
                .
              </li>
            </ul>
          </div>
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-8 flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">Join us</p>
            <p className="text-lg font-semibold tracking-tight mb-4">
              We hire scientists, engineers, and operators who care about trustworthy measurement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/careers"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white text-sm font-semibold"
              >
                View openings <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Read the blog
              </Link>
            </div>
            <Link to="/contact" className="mt-6 text-sm text-white/60 hover:text-white underline-offset-4 hover:underline">
              Corporate & media enquiries → Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
