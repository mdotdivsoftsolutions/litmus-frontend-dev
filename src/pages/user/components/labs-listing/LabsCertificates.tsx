import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockCertificates = [
  {
    id: 1,
    title: "EEG Test",
    subtitle: "Starting @ ₹3400 ₹1260",
    description: "An EEG test or electroencephalogram is a painless and non-invasive diagnostic test that is performed to evaluate the electrical activity of the brain. The brain functions on electrical ...",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
    features: ["100% non-invasive", "Quick procedure with same day reports"]
  },
  {
    id: 2,
    title: "Echo Test",
    subtitle: "Starting @ ₹4000 ₹1350",
    description: "An echocardiogram (ECHO) is a type of ultrasound scan that is conducted to evaluate the heart and the nearby blood vessels. This test aims to monitor and assess the functioning of the heart a...",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    features: ["High-resolution image quality for accurate diagnosis", "100% non-invasive"]
  },
  {
    id: 3,
    title: "TMT Test",
    subtitle: "Starting @ ₹3500 ₹1109",
    description: "A TMT test, also known as the treadmill test is an important health test conducted to evaluate heart function and assess your risk of developing heart disease. It does that by evaluating how your hear...",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400",
    features: ["High-performance treadmill machines", "Read-to-assist support staff"]
  }
];

export function LabsCertificates() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
      <div className="relative px-2 sm:px-12">
        <div className="grid md:grid-cols-3 gap-6">
          {mockCertificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              {/* Top Image Section */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
              </div>
              
              {/* Text Section */}
              <div className="p-6 pb-12 text-center relative z-10 flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-slate-800">{cert.title}</h3>
                <p className="text-[#10b981] font-bold text-sm mt-1.5">{cert.subtitle}</p>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed px-2 text-justify">
                  {cert.description.length > 100 ? cert.description.slice(0, 100) + "..." : cert.description}
                </p>
              </div>

              {/* Bottom Section with Salient Features */}
              <div className="bg-white p-6 pt-10 relative border-t border-brand">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-xs font-bold px-6 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm border border-white/20">
                  Salient Features
                </div>
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
