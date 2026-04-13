const TRUST_POINTS = [
  { title: "Fastest Turnaround", desc: "Digital reports delivered in as little as 3-5 working days, direct to your dashboard." },
  { title: "Premium Logistics", desc: "Skilled collection agents with specialized training, ensuring safe and cold-chain sample transport." },
  { title: "NABL Quality", desc: "Strictly partnered with ISO certified, FSSAI approved labs using advanced diagnostic technology." },
  { title: "Verified Trust", desc: "Recommended by 500+ industry experts and trusted by 50,000+ food businesses nationwide." },
  { title: "Transparent Billing", desc: "Unified pricing for all tests with no hidden sample collection or reporting charges." },
];

export function FooterTrustPoints() {
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Litmus Testing Over Direct Labs?</h2>
      <ul className="space-y-4">
        {TRUST_POINTS.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
            <p className="text-slate-600">
              <strong className="text-slate-800 font-bold">{item.title}:</strong> {item.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
