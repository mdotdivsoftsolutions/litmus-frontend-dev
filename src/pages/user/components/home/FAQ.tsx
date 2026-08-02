import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

const faqs = [
  {
    id: 1,
    question: "What types of food safety tests does Litmus offer?",
    answer:
      "Litmus offers a comprehensive range of FSSAI-mandated food safety tests including microbiological testing, heavy metal analysis, pesticide residue testing, nutritional labeling, allergen testing, and adulteration detection. All tests are conducted in NABL-accredited laboratories.",
  },
  {
    id: 2,
    question: "How long does it take to receive my test report?",
    answer:
      "Standard reports are typically delivered within 5–7 business days after sample collection. For premium express testing, reports are available in 24–48 hours. You'll receive an email and SMS notification when your report is ready, and you can download it directly from your Litmus dashboard.",
  },
  {
    id: 3,
    question: "Are Litmus reports accepted by FSSAI and regulatory authorities?",
    answer:
      "Yes. All Litmus test reports are issued by NABL-accredited laboratories and are fully recognized by FSSAI (Food Safety and Standards Authority of India) and other statutory bodies. Our reports comply with IS/ISO/IEC 17025 standards, making them valid for licensing, audits, and regulatory submissions.",
  },
  {
    id: 4,
    question: "How is my food sample collected?",
    answer:
      "After booking, a trained Litmus sample collection specialist visits your premises at the scheduled time. Samples are collected using sterile, tamper-evident kits and transported in temperature-controlled conditions to maintain integrity. You receive a sample receipt with a unique tracking ID.",
  },
  {
    id: 5,
    question: "Can I track my sample in real time?",
    answer:
      "Absolutely. Every sample is assigned a unique tracking ID. You can monitor the complete chain of custody — from collection pickup, transit, lab receipt, analysis, and report generation — from your Litmus account dashboard at any time.",
  },
  {
    id: 6,
    question: "What is the refund or cancellation policy?",
    answer:
      "Orders can be cancelled for a full refund up to 12 hours before the scheduled sample collection time. Post-collection cancellations are not eligible for a refund, as lab analysis has already commenced. Please review our full policy at the Help Centre for edge cases.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "group border rounded-2xl overflow-hidden transition-all duration-300",
        isOpen
          ? "border-[#f06c00]/30 bg-white shadow-md shadow-orange-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "font-semibold text-sm leading-snug transition-colors duration-200 md:text-base",
            isOpen ? "text-[#f06c00]" : "text-slate-800 group-hover:text-slate-900"
          )}
        >
          {faq.question}
        </span>
        <span
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300",
            isOpen
              ? "bg-[#f06c00] text-white rotate-0"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}
        >
          {isOpen ? (
            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-5">
          <div className="h-px bg-gradient-to-r from-[#f06c00]/20 via-[#ff9a3c]/30 to-transparent mb-4" />
          <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="relative overflow-hidden bg-[#F6FBFF] py-10 md:py-16">
      {/* Background blobs */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-50/60 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-amber-50/60 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:sticky lg:top-0">
            <SectionHeader
              badge="Got Questions?"
              title={
                <>
                  Frequently Asked{" "}
                  <span className="text-gradient-brand">Questions</span>
                </>
              }
              subtitle="Everything you need to know about Litmus food safety testing — from booking to receiving your FSSAI-verified report."
              className="mb-0 md:flex-col md:items-start"
            />

            {/* Decorative stat card */}
            <div className="mt-10 rounded-2xl border border-orange-100 bg-gradient-to-br from-[#fff7f0] to-[#fff3e6] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f06c00] mb-4">
                Still have questions?
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Our support team is available Monday–Saturday, 9 AM – 7 PM. We
                typically respond within 2 hours.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#f06c00] to-[#ff9a3c] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* WhatsApp icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with us on WhatsApp
              </a>
            </div>

            {/* Mini stats row */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { value: "500+", label: "Tests" },
                { value: "NABL", label: "Accredited" },
                { value: "FSSAI", label: "Approved" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-center"
                >
                  <p className="text-base font-black text-gradient-brand">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Accordion ── */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
