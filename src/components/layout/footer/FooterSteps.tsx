const STEPS = [
  { step: "01", title: "Book Online", desc: "Select your food category and specific tests from our intuitive marketplace." },
  { step: "02", title: "Schedule Pickup", desc: "Our trained collection agents will reach you within hours to collect samples safely." },
  { step: "03", title: "Lab Processing", desc: "Samples are analyzed in NABL-accredited labs using state-of-the-art diagnostic tools." },
  { step: "04", title: "Get Digital Report", desc: "Receive your FSSAI-compliant certified digital reports within 3-5 working days." },
];

export function FooterSteps() {
  return (
    <div className="mb-10 bg-slate-50 rounded-2xl p-12 border border-slate-100 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D32F2F]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
       <h2 className="text-2xl font-bold text-slate-800 mb-10">How to Book a Food Safety Test</h2>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="relative">
              <span className="text-5xl font-black text-slate-200/50 mb-4 block leading-none">{s.step}</span>
              <h4 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
       </div>
    </div>
  );
}
