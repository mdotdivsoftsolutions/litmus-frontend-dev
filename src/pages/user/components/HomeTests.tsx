import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products } from "@/lib/placeholder-data";
import { Activity, FileText, Plus, Minus, ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const TestCard = ({ p, cartItems, addToCart, removeFromCart }: any) => {
  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
  const price = p.testCount * 150 + 999;
  const mrp = p.testCount * 260 + 1500;
  const qty = cartItems[p.id] || 0;
  const discount = discountPct(price, mrp);

  return (
    <Link to={`/tests/${p.id}`} className="w-[385px] shrink-0 rounded-[1.25rem] bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden m-2 border border-slate-100 group">
      <div className="bg-gradient-to-r from-[#D32F2F] to-[#feba50] p-5 text-white rounded-b-[1.25rem] shadow-[0_4px_14px_rgba(244,155,38,0.4)] relative h-[120px] flex flex-col justify-end pb-5 transition-colors">
        <div className="absolute top-0 right-4 bg-gradient-to-b from-[#D32F2F] to-[#feba50] text-white text-[10px] font-extrabold px-3 py-1 rounded-b-md tracking-wider shadow-sm uppercase">
          Checkup
        </div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold leading-tight w-3/5 pr-2 tracking-tight">{p.name || "Food Safety Test"}</h3>
          <div className="flex flex-col items-end pt-1">
             <div className="flex items-center gap-1.5">
               <span className="text-[11px] text-white/70 line-through">₹{mrp}</span>
               <span className="text-[1.50rem] font-extrabold tracking-tight drop-shadow-sm">₹{price}</span>
             </div>
             <span className=" bg-gradient-to-r from-[#D32F2F] to-[#f49b26] text-white text-[8px] uppercase font-bold px-2 py-1 rounded mt-0.5 tracking-wider shadow-sm">
               {discount}% Off
             </span>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-start gap-3 w-1/2">
             <div className="mt-0.5 text-slate-400">
                <Activity className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[13px] text-slate-800 leading-none">{p.testCount} parameters</p>
                <p className="text-[11px] text-slate-500 mt-1">included</p>
             </div>
           </div>
           <div className="flex items-start gap-3 w-1/2 border-l border-slate-100 pl-4">
             <div className="mt-0.5 text-slate-400">
                <FileText className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[11px] text-slate-500 leading-none">Reports within</p>
                <p className="text-[13px] text-slate-800 mt-1">Fri, 03 Apr</p>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-3 mt-auto">
           <button className="flex-1 h-11 rounded-xl border border-[#D32F2F] text-[#D32F2F] font-semibold text-sm bg-transparent hover:bg-[#D32F2F]/5 transition-colors focus:outline-none">
              View Details
           </button>
           {qty === 0 ? (
             <button onClick={(e) => { e.preventDefault(); addToCart(p.id, e); }} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#feba50] to-[#f49b26] text-white font-medium text-sm shadow-[0_4px_14px_rgba(244,155,38,0.4)] hover:shadow-[0_6px_20px_rgba(244,155,38,0.6)] hover:-translate-y-0.5 transition-all focus:outline-none">
                Add to Cart
             </button>
           ) : (
             <div className="flex-1 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between px-3 shadow-inner">
               <button onClick={(e) => { e.preventDefault(); removeFromCart(p.id, e); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm focus:outline-none"><Minus className="h-4 w-4" /></button>
               <span className="text-[#f49b26] font-semibold text-sm">{qty}</span>
               <button onClick={(e) => { e.preventDefault(); addToCart(p.id, e); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm focus:outline-none"><Plus className="h-4 w-4" /></button>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
};

export const PromoBanner = ({ className }: { className?: string }) => {
   const [current, setCurrent] = useState(0);
   const slides = [
      {
         title: <>Advanced <span className="text-[#F06C00]">Children's</span> <br/> Checkup</>,
         subtitle: "60+ Parameters Included",
         desc: "Immunity | Metabolism | Organ function & more",
         color: "#059669",
         img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop"
      },
      {
         title: <>Full Food <span className="text-[#D32F2F]">Industry Safety</span> <br/> Audit Panel</>,
         subtitle: "FSSAI Compliance Ready",
         desc: "Microbial Scan | Pathogen Panel | Heavy Metals",
         color: "#D32F2F",
         img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
      },
      {
         title: <>Premium <span className="text-[#F06C00]">Dairy & Purity</span> <br/> Verification</>,
         subtitle: "NABL Accredited Tests",
         desc: "Adulteration | Fat Content | SNF Analysis",
         color: "#004D62",
         img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
      }
   ];

   useEffect(() => {
      const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
      return () => clearInterval(timer);
   }, []);

   return (
      <section className={`${className} bg-slate-50`}>
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative group rounded-[2rem] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 h-[320px]">
               <div className="h-full w-full flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${current * 100}%)` }}>
                  {slides.map((s, i) => (
                     <div key={i} className="min-w-full h-full flex flex-col lg:flex-row">
                        <div className="flex-[1] p-10 lg:pl-16 flex flex-col justify-center relative z-10 bg-white">
                           <div className="inline-flex items-center gap-2 mb-3" style={{ color: s.color }}>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.subtitle}</span>
                           </div>
                           <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tighter leading-[1.05] mb-4">
                              {s.title}
                           </h2>
                           <p className="text-slate-500 text-base font-medium mb-8 max-w-lg">
                              {s.desc}
                           </p>
                           <button className="self-start h-11 px-8 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group/btn" style={{ backgroundColor: s.color }}>
                              Book Now <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                        <div className="flex-1 relative h-32 lg:h-auto overflow-hidden">
                           <img src={s.img} className="w-full h-full object-cover" alt="Checkup" />
                           <div className="absolute inset-0 bg-black/5" />
                           <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden lg:block" />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="absolute bottom-6 left-16 flex gap-2 z-20">
                  {slides.map((_, i) => (
                     <div 
                        key={i} 
                        onClick={() => setCurrent(i)}
                        className={cn("h-1.5 transition-all duration-500 rounded-full cursor-pointer", i === current ? "w-8 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-400")} 
                     />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};

export const HomeTests = ({ activeTab, setActiveTab, cartItems, addToCart, removeFromCart }: any) => {
  return (
    <>
      <section className="pt-20 pb-10  relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
             <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
                  Popular Tests <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Near You</span>
                </h2>
                <p className="text-slate-500 mt-3 text-lg">Discover the most frequently booked food safety and quality analysis tests in your region.</p>
             </div>
             <span className="text-[#D32F2F] font-medium text-sm cursor-pointer hover:underline flex items-center gap-1 group whitespace-nowrap bg-red-50 px-4 py-2 rounded-full border border-red-100">
               View All Tests <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </span>
          </div>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-5 pt-2 -mx-2">
               {[...products].reverse().map((p, i) => (
                 <TestCard key={`popular-${p.id}-${i}`} p={p} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />
               ))}
          </div>
        </div>
      </section>

      <PromoBanner className="pb-24" />
    </>
  );
}
