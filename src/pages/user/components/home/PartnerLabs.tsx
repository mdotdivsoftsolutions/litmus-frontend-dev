import { SectionHeader } from "./SectionHeader";
import { FlaskConical, ShieldCheck, Award, Microscope, Beaker, ClipboardCheck } from "lucide-react";

const partnerLabs = [
  { name: "Global Biotec Labs", location: "Mumbai", accreditation: "NABL Accredited", icon: FlaskConical },
  { name: "Precision Diagnostics", location: "Chennai", accreditation: "ISO 17025", icon: ShieldCheck },
  { name: "Standard Food Research", location: "Delhi", accreditation: "FSSAI Empaneled", icon: Award },
  { name: "Nexus Analytical", location: "Bangalore", accreditation: "NABL Accredited", icon: Microscope },
  { name: "Summit Safety Labs", location: "Hyderabad", accreditation: "EIC Approved", icon: Beaker },
  { name: "Veritas Quality Labs", location: "Pune", accreditation: "NABL Accredited", icon: ClipboardCheck },
];

export function PartnerLabs() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <SectionHeader
          badge="Network of Trust"
          title={
            <>
              Our Trusted{" "}
              <span className="bg-clip-text text-transparent bg-gradient-brand">
                Partner Laboratories
              </span>
            </>
          }
          subtitle="We collaborate with India's leading NABL-accredited and FSSAI-notified facilities to ensure your samples are tested using state-of-the-art analytical instrumentation."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {partnerLabs.map((lab, i) => (
            <div 
              key={i} 
              className="group flex flex-col items-center justify-center p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 transition-all duration-300 hover:bg-white hover:border-brand-primary/20 hover:shadow-[0_20px_40px_-15px_rgba(211,47,47,0.1)]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gradient-brand group-hover:text-white text-slate-400">
                <lab.icon className="h-7 w-7" />
              </div>
              <p className="text-center text-sm font-bold text-slate-800 tracking-tight leading-snug">
                {lab.name}
              </p>
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-[#D32F2F]/70">
                {lab.accreditation}
              </p>
            </div>
          ))}
        </div>

        {/* Certification Badges Marquee (Optional/Decorative) */}
        <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/52/NABL_Logo.png/250px-NABL_Logo.png" className="h-12 object-contain" alt="NABL" />
           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png" className="h-12 object-contain" alt="FSSAI" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/ISO_logo.svg/1200px-ISO_logo.svg.png" className="h-12 object-contain" alt="ISO" />
        </div>
      </div>
    </section>
  );
}
