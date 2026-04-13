const FAQS = [
  { q: "In how many cities does Litmus provide food testing services?", a: "Litmus currently provides seamless sample collection and diagnostic services in all major metro cities including Chennai, Mumbai, Delhi, Bangalore, Hyderabad, and Kolkata." },
  { q: "Do I need to visit a physical laboratory for testing?", a: "No, Litmus is a digital-first platform. You can book every test online, and our team will handle the professional doorstep collection of your food samples." },
  { q: "What are the standard hours for sample collection?", a: "Our sample collection windows are flexible, typically operating from 8:00 AM to 6:00 PM. You can choose a specific time slot that fits your business operations." },
  { q: "Can I track the status of my food safety audit?", a: "Absolutely. Once your sample is collected, you can track it in real-time through your Litmus dashboard from 'Pickup' to 'In-Lab' to 'Report Generated'." },
];

export function FooterFAQGrid() {
  return (
    <div className="mb-10 border-t border-slate-100 pt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-8 max-w-4xl">
        {FAQS.map((faq, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Q{i+1}</p>
            <h4 className="text-base font-bold text-slate-800">{faq.q}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
