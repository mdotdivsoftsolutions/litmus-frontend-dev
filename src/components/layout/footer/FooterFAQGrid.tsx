import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "In how many cities does Litmus provide food testing services?", a: "Litmus currently provides seamless sample collection and diagnostic services in all major metro cities including Chennai, Mumbai, Delhi, Bangalore, Hyderabad, and Kolkata." },
  { q: "Do I need to visit a physical laboratory for testing?", a: "No, Litmus is a digital-first platform. You can book every test online, and our team will handle the professional doorstep collection of your food samples." },
  { q: "What are the standard hours for sample collection?", a: "Our sample collection windows are flexible, typically operating from 8:00 AM to 6:00 PM. You can choose a specific time slot that fits your business operations." },
  { q: "Can I track the status of my food safety audit?", a: "Absolutely. Once your sample is collected, you can track it in real-time through your Litmus dashboard from 'Pickup' to 'In-Lab' to 'Report Generated'." },
];

export function FooterFAQGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="mb-10 border-t md:border-none border-slate-100 pt-8 md:pt-0">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 md:mb-0">Frequently Asked Questions</h2>
      <div className="max-w-4xl divide-y divide-slate-100">
        {FAQS.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-4 py-4 text-left group"
            >
              <span className="text-base font-semibold text-slate-800 group-hover:text-[#D32F2F] transition-colors">
                {faq.q}
              </span>
              <span className={cn(
                "shrink-0 h-7 w-7 rounded-full border flex items-center justify-center transition-all duration-300",
                openIndex === i
                  ? "bg-[#D32F2F] border-[#D32F2F] text-white rotate-0"
                  : "border-slate-200 text-slate-400 group-hover:border-[#D32F2F] group-hover:text-[#D32F2F]"
              )}>
                {openIndex === i
                  ? <Minus className="h-3.5 w-3.5" />
                  : <Plus className="h-3.5 w-3.5" />
                }
              </span>
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openIndex === i ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
            )}>
              <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
