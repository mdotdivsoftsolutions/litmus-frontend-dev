import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { PolicyHero } from "./components/policies/PolicyHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I book a diagnostic test?",
    a: "Choose tests or a package, add them to your cart, pick home collection or lab visit, and complete checkout. You will receive an SMS and email with your order ID and next steps.",
  },
  {
    q: "How long do results take?",
    a: "Turnaround depends on the assay matrix and lab workload. Typical food chemistry panels complete within a few business days; microbiology cultures may take longer. Your order summary shows an estimate.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Open My Orders from your profile menu or use Track Order in the footer. Search by order ID or product name to see status updates until your report is ready.",
  },
  {
    q: "How do I prepare my sample?",
    a: "Follow the instructions in your booking confirmation. Some tests require fasting or sterile containers; our phlebotomy partner will confirm timing when they call to schedule collection.",
  },
  {
    q: "Where can I download my report?",
    a: "When status shows Reports Ready, open the order detail page or visit the Reports section to download your PDF. Reports are issued by the accredited performing laboratory.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major cards and UPI through our payment partners. GST-compliant invoices are available after payment succeeds.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Requests before sample collection may be eligible for cancellation per lab policy. After collection, cancellation may not be possible; contact support with your order ID for options.",
  },
  {
    q: "Is my health data secure?",
    a: "We apply administrative and technical safeguards aligned with healthcare expectations. Read our Privacy Policy for categories of data we collect and how we share them with partner labs.",
  },
];

export default function FaqsPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={CircleHelp}
        eyebrow="Answers · FAQs"
        title={
          <>
            Frequently asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              questions
            </span>
          </>
        }
        subtitle="Straightforward answers about booking, samples, tracking, and reports. Demo copy — refine with your operations team."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Accordion type="single" collapsible className="w-full border border-slate-100 rounded-2xl px-2 bg-slate-50/30">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-slate-100 px-4">
                <AccordionTrigger className="text-left text-base font-semibold text-slate-800 hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] md:text-base text-slate-600 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-10 text-center text-sm text-slate-500">
            Did not find what you need?{" "}
            <Link to="/support" className="font-semibold text-[#D32F2F] hover:underline">
              Visit Support
            </Link>{" "}
            or{" "}
            <Link to="/help" className="font-semibold text-[#D32F2F] hover:underline">
              Help Center
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
