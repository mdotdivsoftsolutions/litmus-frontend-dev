import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";

const mockCertificates = [
  {
    id: 1,
    title: "Food Label Review",
    subtitle: "Starting @ ₹1000",
    description: "Ensure your product labels comply with the latest food regulations and industry standards. Our experts review every aspect of your label to help you avoid non-compliance and build consumer trust.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400",
    features: ["FSSAI label compliance review", "Claims and declaration verification", "Regulatory gap assessment & recommendations"]
  },
  {
    id: 2,
    title: "FSSAI Licensing & Documentation Support",
    subtitle: "Starting @ ₹1500 (Excl. Govt charges)",
    description: "Simplify the licensing process with expert guidance for obtaining, renewing, or modifying FSSAI registrations and License",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    features: ["New license and renewal support", "Documentation preparation", "Regulatory liaison and guidance"]
  },
  {
    id: 3,
    title: "Food Safety Audits & Gap Assessments",
    subtitle: "Starting @ ₹3000",
    description: "Evaluate your facility, processes, and food safety systems to identify risks and improve compliance before regulatory or customer audits.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400",
    features: ["GMP, GHP & HACCP assessments", "Compliance gap analysis", "Corrective action recommendations"]
  },
  {
    id: 4,
    title: "HACCP, GMP & FOSTAC Training",
    subtitle: "Customized Pricing",
    description: "Equip your team with practical food safety knowledge through customized training programs designed for manufacturing, processing, and hospitality businesses.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    features: ["Employee and management training", "Practical food safety workshops", "Training certificates and assessment"]
  }
];

export function LabsCertificates() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
      <div className="relative px-2 sm:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCertificates.map((cert) => (
            <ConsultationBookingModal key={cert.id} serviceName={cert.title}>
              <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-[#D32F2F]/20 hover:scale-[1.01] transition-all cursor-pointer">
                {/* Top Image Section */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Text Section */}
                <div className="p-6 pb-12 text-center relative z-10 flex-1 flex flex-col justify-start text-start">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{cert.title}</h3>
                  <p className="text-[#10b981] font-bold text-sm mt-1.5">{cert.subtitle}</p>
                  <p className="text-sm text-slate-500 mt-4 leading-relaxed ">
                    {cert.description.length > 100 ? cert.description.slice(0, 100) + "..." : cert.description}
                  </p>
                </div>

                {/* Bottom Section with Salient Features */}
                <div className="bg-white p-6 pt-10 relative border-t border-brand">
                  <button type="button" className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-xs font-bold px-6 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm border border-white/20 hover:scale-105 transition-transform duration-200 focus:outline-none">
                    Book Now
                  </button>
                  <ul className="space-y-3">
                    {cert.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start text-left font-medium truncate ">
                        <span className="text-[#D32F2F] mr-3 mt-0.5">•</span>
                        {feature}
                      </li>   
                    ))}
                  </ul>
                </div>
              </div>
            </ConsultationBookingModal>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="hidden lg:flex absolute top-1/2 left-0 -translate-y-1/2 h-10 w-10 bg-[#ea580c] text-white shadow-lg rounded-full items-center justify-center hover:bg-[#c2410c] transition-colors z-10">
          <ChevronLeft className="h-5 w-5 -ml-0.5" />
        </button>
        <button className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 h-10 w-10 bg-[#ea580c] text-white shadow-lg rounded-full items-center justify-center hover:bg-[#c2410c] transition-colors z-10">
          <ChevronRight className="h-5 w-5 -mr-0.5" />
        </button>
      </div>
    </div>
  );
}
