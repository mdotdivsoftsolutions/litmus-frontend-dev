import { CheckCircle2, ChevronLeft, ChevronRight, Activity, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const packageCards = [
  {
    tag1: "COMPLIANCE",
    tag2: "MOST POPULAR",
    title: "Complete FSSAI Basic Shield",
    desc: "Essential testing parameters for small-scale food manufacturers and home bakers.",
    parameters: "12+ Items",
    reports: "3-5 Days",
    features: [
      "Microbial Load Analysis",
      "Moisture & Ash Content",
      "Heavy Metal Screening",
      "Shelf Life Prediction"
    ],
    originalPrice: "₹8,500",
    price: "₹4,999",
    discount: "41% OFF"
  },
  {
    tag1: "HEALTH",
    tag2: "RECOMMENDED",
    title: "Advanced Full Body Check",
    desc: "Comprehensive health screening covering all major vital organs and health parameters.",
    parameters: "85+ Items",
    reports: "24 Hours",
    features: [
      "Thyroid Profile",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Panel"
    ],
    originalPrice: "₹4,000",
    price: "₹1,999",
    discount: "50% OFF"
  },
  {
    tag1: "WELLNESS",
    tag2: "BEST VALUE",
    title: "Women's Health Panel",
    desc: "Specialized preventive health package designed specifically for women's wellness.",
    parameters: "60+ Items",
    reports: "24-48 Hours",
    features: [
      "Iron Deficiency",
      "Bone Health",
      "Hormone Profile",
      "Vitamin D & B12"
    ],
    originalPrice: "₹5,500",
    price: "₹2,499",
    discount: "54% OFF"
  }
];

export const TrustAndOrdering = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % packageCards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % packageCards.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + packageCards.length) % packageCards.length);
  };

  const currentItem = packageCards[currentSlide];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ═══════════ LEFT: PACKAGE CAROUSEL ═══════════ */}
          <div 
            onClick={() => navigate('/packages')}
            className="lg:col-span-6 rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-10 pb-12 relative flex flex-col overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.05)] cursor-pointer hover:-translate-y-1 transition-all duration-300"
          >
            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-2 md:left-4 right-2 md:right-4 -translate-y-1/2 flex justify-between pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div 
                  onClick={prevSlide}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 hover:scale-105 transition-all pointer-events-auto cursor-pointer"
                >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div 
                  onClick={nextSlide}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 hover:scale-105 transition-all pointer-events-auto cursor-pointer"
                >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </div>
            </div>

            <div key={`content-${currentSlide}`} className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
              
              {/* Tags */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-widest">{currentItem.tag1}</span>
                <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-bold tracking-widest">{currentItem.tag2}</span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-slate-900 mb-3 tracking-tight leading-tight">{currentItem.title}</h2>
              <p className="text-slate-500 text-sm md:text-base mb-6 leading-relaxed pr-4">
                {currentItem.desc}
              </p>

              {/* Divider */}
              <div className="h-px w-full bg-slate-100 mb-6" />

              {/* Parameters & Reports */}
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                     <Activity className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Parameters</p>
                    <p className="text-base md:text-lg font-bold text-slate-900 leading-none">{currentItem.parameters}</p>
                  </div>
                </div>

                <div className="h-12 w-px bg-slate-100" />

                <div className="flex items-center gap-4 flex-1 pl-4">
                  <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                     <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reports</p>
                    <p className="text-base md:text-lg font-bold text-slate-900 leading-none">{currentItem.reports}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-100 mb-6" />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 mb-8">
                {currentItem.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-600 font-medium text-sm md:text-base truncate">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Price Section */}
              <div className="mt-auto bg-slate-50 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="w-full text-center sm:text-left">
                   <p className="text-slate-400 font-bold line-through text-xs md:text-sm mb-1">{currentItem.originalPrice}</p>
                   <div className="flex items-center justify-center sm:justify-start gap-3">
                     <p className="text-2xl md:text-[2rem] font-black text-slate-900 tracking-tight">{currentItem.price}</p>
                     <span className="px-2.5 py-1 rounded border border-emerald-200 bg-emerald-100/50 text-emerald-600 text-[10px] md:text-xs font-black tracking-wider uppercase">
                       {currentItem.discount}
                     </span>
                   </div>
                 </div>
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     navigate('/packages');
                   }}
                   className="w-full sm:w-auto px-6 py-3.5 bg-[#007f9c] hover:bg-[#006880] text-white font-bold tracking-wide rounded-xl transition-all shadow-md shadow-[#007f9c]/20 hover:-translate-y-0.5 whitespace-nowrap"
                 >
                   Book Panel
                 </button>
              </div>

            </div>

            {/* Manual Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
               {packageCards.map((_, idx) => (
                 <div 
                   key={idx}
                   onClick={(e) => {
                     e.stopPropagation();
                     setCurrentSlide(idx);
                   }}
                   className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                     currentSlide === idx 
                       ? "w-8 bg-[#007f9c]" 
                       : "w-4 bg-slate-200 hover:bg-slate-300"
                   }`} 
                 />
               ))}
            </div>
          </div>

          {/* ═══════════ RIGHT: ORDERING ═══════════ */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* TOP CARD: 3 STEPS */}
            <div className="flex-1 rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-10 relative flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)]">
              
              <div className="relative z-10 space-y-6 md:space-y-8">
                 <div>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-500 mb-2">Easy ordering in</h4>
                    <h3 className="text-5xl md:text-6xl font-black text-[#10B981] tracking-tighter uppercase leading-none drop-shadow-sm">3 STEPS</h3>
                 </div>

                 <div className="space-y-5">
                    {[
                      { step: "Select tests" },
                      { step: "Add your details" },
                      { step: "Book your slot" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 md:gap-5">
                         <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#10B981] flex items-center justify-center text-white p-0.5 shrink-0 shadow-md">
                            <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                         </div>
                         <span className="text-slate-700 font-bold text-xl md:text-2xl">{item.step}</span>
                      </div>
                    ))}
                 </div>

                 <button className="h-14 md:h-16 mt-2 px-10 md:px-14 bg-gradient-to-r from-orange-400 to-[#F06C00] text-white font-black text-xl rounded-2xl shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all z-10 relative">
                    Order Now
                 </button>
              </div>

              {/* Ambassador Image */}
              <div className="absolute right-0 bottom-0 w-[60%] lg:w-[65%] h-full z-0 pointer-events-none overflow-hidden rounded-br-[2.5rem]">
                 <img 
                   src="https://images.unsplash.com/photo-1651008376811-b9dd05c85058?w=800&q=80" 
                   className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply" 
                   alt="Ambassador" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white" />
                 <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-5 blur-[60px]" />
              <div className="absolute inset-[2px] rounded-[2.5rem] border-[1.5px] border-transparent bg-gradient-to-br from-orange-100 to-emerald-100 opacity-30 pointer-events-none z-0" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
