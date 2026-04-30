import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const EXPERTISE_DATA = [
  { label: "Diagnostic Center for Dairy in Bangalore", areas: "Dairy farmers, Milk processing plants, Cheese manufacturers, Paneer & Ghee units, Retailers." },
  { label: "Food Safety Audit Center in Mumbai", areas: "Restaurants, cloud kitchens, hotels, catering services, and large-scale industrial canteens." },
  { label: "Spices Testing Lab in Guntur", areas: "Masala exporters, whole spice traders, powder manufacturers, and organic spice collectives." },
  { label: "Meat & Poultry Labs in Hyderabad", areas: "Fresh meat retailers, processing units, export houses, and seafood processing plants." },
  { label: "Bakery & Confectionery Labs in Delhi", areas: "Artisanal bakeries, pastry chains, chocolate manufacturers, and snack production units." },
];

export function FooterIntroGrid() {
  const [selectedCert, setSelectedCert] = useState<null | typeof EXPERTISE_DATA[0]>(null);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Litmus Food Analytics - Your Trusted Safety Partner</h2>
      <p className="text-slate-500 text-sm leading-relaxed max-w-5xl mb-8">
        Litmus brings the accuracy of world-class food diagnostic labs straight to your business. Whether you are a small cafe or a large food manufacturer, every test is delivered with absolute precision. From routine moisture tests to specialized pathogen panels, our mission is to make food safety premium, accessible, and simple. With over <strong>50,000+ tests completed</strong> across India, we are your speed, accuracy, and trust partner.
      </p>
      
      {/* Simplified Portrait Certificate Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
        {EXPERTISE_DATA.map((row, i) => (
          <div
            key={i}
            onClick={() => setSelectedCert(row)}
            className="group relative aspect-[3/4] w-full overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
          >
            {/* Background Portrait Certificate Image */}
            <div className="absolute inset-0 z-0 border">
                <img 
                    src="/images/certificate.jpg" 
                    alt="Certificate background" 
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </div>

            {/* Document Layout Content (Minimal) */}
            <div className="relative z-10 flex flex-col h-full pointer-events-none">
                {/* Footer Section with Seal */}
                <div className="mt-auto p-3 flex justify-end items-end">
                    {/* Floating Seal */}
                    <div className="w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500 rounded-full shadow-sm">
                        <img 
                            src="/images/certification-seal.png" 
                            alt="Seal" 
                            className="w-full h-full object-contain rounded-full" 
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Dialog for Certificate View */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl rounded-xl">
           {selectedCert && (
             <div className="relative aspect-[3/4] w-full p-8 flex flex-col bg-white">
                <img 
                    src="/images/fssai-bg.png" 
                    alt="Certificate background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="h-14 flex items-center justify-between border-b border-slate-100 mb-8">
                        <div className="w-10 h-10 bg-slate-100 rounded-full" />
                        <div className="flex-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest leading-tight">
                            Department of Food Safety & Standards<br />
                            <span className="text-[8px] opacity-70">Government of Haryana / FSSAI</span>
                        </div>
                        <div className="w-10 h-10 bg-orange-50 rounded-sm" />
                    </div>

                    <div className="mt-auto pt-8 flex justify-between items-end border-t border-slate-100">
                         <img 
                             src="/images/certification-seal.png" 
                             alt="Seal" 
                             className="w-14 h-14 object-contain shadow-md rounded-full p-2 border-4 border-slate-50 rotate-[-10deg]" 
                         />
                    </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-gradient-brand hover:border-none hover:text-white transition-all z-20 group"
                >
                    <span className="text-xl font-light">×</span>
                </button>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}




