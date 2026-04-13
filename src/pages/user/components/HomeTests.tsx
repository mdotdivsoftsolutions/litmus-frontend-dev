import { useState, useEffect, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { products } from "@/lib/placeholder-data";
import { Activity, FileText, Plus, Minus, ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = (typeof products)[number];

export type TestCardProps = {
  p: Product;
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

export const TestCard = ({ p, cartItems, addToCart, removeFromCart }: TestCardProps) => {
  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
  const price = p.testCount * 150 + 999;
  const mrp = p.testCount * 260 + 1500;
  const qty = cartItems[p.id] || 0;
  const discount = discountPct(price, mrp);

  return (
    <Link
      to={`/tests/${p.id}`}
      className="group m-2 flex w-[385px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-brand-card-from/10 bg-white shadow-[0_2px_12px_-2px_rgb(var(--brand-card-rgb)/0.08)] transition-all hover:-translate-y-1 hover:border-brand-card-to/25 hover:shadow-[0_16px_40px_-12px_rgb(var(--brand-card-rgb)/0.22)]"
    >
      <div className="relative flex h-[120px] flex-col justify-end rounded-b-[1.25rem] bg-gradient-card p-5 pb-5 text-white shadow-[0_6px_24px_-4px_rgb(var(--brand-card-rgb)/0.45)] transition-colors">
        <div className="absolute right-4 top-0 rounded-b-md bg-gradient-card-badge px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_4px_12px_rgb(var(--brand-card-rgb)/0.35)]">
          Checkup
        </div>
        <div className="flex items-start justify-between">
          <h3 className="w-3/5 pr-2 text-lg font-semibold leading-tight tracking-tight">{p.name || "Food Safety Test"}</h3>
          <div className="flex flex-col items-end pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/70 line-through">₹{mrp}</span>
              <span className="text-[1.50rem] font-extrabold tracking-tight drop-shadow-sm">₹{price}</span>
            </div>
            <span className="mt-0.5 rounded bg-gradient-to-r from-brand-card-deep to-brand-card-to px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white shadow-[0_2px_8px_rgb(var(--brand-card-rgb)/0.35)]">
              {discount}% Off
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-gradient-to-b from-[#f4fafc] to-white p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex w-1/2 items-start gap-3">
            <div className="mt-0.5 text-brand-card-to/55">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] leading-none text-slate-800">{p.testCount} parameters</p>
              <p className="mt-1 text-[11px] text-brand-card-from/55">included</p>
            </div>
          </div>
          <div className="flex w-1/2 items-start gap-3 border-l border-brand-card-to/15 pl-4">
            <div className="mt-0.5 text-brand-card-to/55">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] leading-none text-brand-card-from/55">Reports within</p>
              <p className="mt-1 text-[13px] text-slate-800">Fri, 03 Apr</p>
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3">
          <button
            type="button"
            className="h-11 flex-1 rounded-xl border border-brand-card-from/35 bg-white/80 text-sm font-semibold text-brand-card-from transition-colors hover:border-brand-card-to hover:bg-brand-card-to/10 focus:outline-none"
          >
            View Details
          </button>
          {qty === 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(p.id, e);
              }}
              className="h-11 flex-1 rounded-xl bg-gradient-to-r from-brand-card-from to-brand-card-to text-sm font-medium text-white shadow-[0_4px_16px_-2px_rgb(var(--brand-card-rgb)/0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgb(var(--brand-card-rgb)/0.5)] focus:outline-none"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex h-11 flex-1 items-center justify-between rounded-xl border border-brand-card-to/25 bg-[#e8f6fa] px-3 shadow-[inset_0_1px_2px_rgb(var(--brand-card-rgb)/0.06)]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(p.id, e);
                }}
                className="rounded-full bg-white p-0.5 text-brand-card-from shadow-sm hover:text-brand-card-deep focus:outline-none"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-brand-card-from">{qty}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(p.id, e);
                }}
                className="rounded-full bg-white p-0.5 text-brand-card-from shadow-sm hover:text-brand-card-deep focus:outline-none"
              >
                <Plus className="h-4 w-4" />
              </button>
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

export type HomeTestsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

export const HomeTests = ({ activeTab, setActiveTab, cartItems, addToCart, removeFromCart }: HomeTestsProps) => {
  return (
    <>
      <section className="pt-20 pb-10  relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
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
