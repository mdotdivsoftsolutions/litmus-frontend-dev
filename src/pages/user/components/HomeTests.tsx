import { Link } from "react-router-dom";
import { Activity, FileText, Plus, Minus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/lib/placeholder-data";

export const TestCard = ({ p, cartItems, addToCart, removeFromCart }: any) => {
  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
  const price = p.testCount * 150 + 999;
  const mrp = p.testCount * 260 + 1500;
  const qty = cartItems[p.id] || 0;
  const discount = discountPct(price, mrp);

  return (
    <Link to={`/tests/${p.id}`} className="w-[340px] shrink-0 rounded-[1.25rem] bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden m-2 border border-slate-100 group">
      <div className="bg-gradient-to-r from-[#245D51] to-[#2A6559] p-5 text-white relative h-[120px] flex flex-col justify-end pb-5 transition-colors">
        <div className="absolute top-0 right-4 bg-[#1e4e43] text-white/90 text-[10px] font-medium px-4 py-1.5 rounded-b-lg tracking-wide">
          Checkup
        </div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium leading-tight w-3/5 pr-2 tracking-tight">{p.name || "Food Safety Test"}</h3>
          <div className="flex flex-col items-end pt-1">
             <div className="flex items-center gap-1.5">
               <span className="text-[11px] text-white/60 line-through">₹{mrp}</span>
               <span className="text-[1.15rem] font-medium tracking-tight drop-shadow-sm">₹{price}</span>
             </div>
             <span className="bg-[#00D084] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-0.5 tracking-wider">
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
           <button className="flex-1 h-11 rounded-xl border border-[#245D51] text-[#245D51] font-medium text-sm bg-transparent hover:bg-[#245D51]/5 transition-colors focus:outline-none">
              View Details
           </button>
           {qty === 0 ? (
             <button onClick={(e) => { e.preventDefault(); addToCart(p.id, e); }} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#feba50] to-[#f49b26] text-white font-medium text-sm shadow-[0_4px_14px_rgba(244,155,38,0.4)] hover:shadow-[0_6px_20px_rgba(244,155,38,0.6)] hover:-translate-y-0.5 transition-all focus:outline-none">
                Add to Cart
             </button>
           ) : (
             <div className="flex-1 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between px-3 shadow-inner">
               <button onClick={(e) => { e.preventDefault(); removeFromCart(p.id, e); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm focus:outline-none"><Minus className="h-4 w-4" /></button>
               <span className="text-[#f49b26] font-medium text-sm">{qty}</span>
               <button onClick={(e) => { e.preventDefault(); addToCart(p.id, e); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm focus:outline-none"><Plus className="h-4 w-4" /></button>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
};

export const HomeTests = ({ activeTab, setActiveTab, cartItems, addToCart, removeFromCart }: any) => {
  return (
    <>
      <section className="py-10 relative">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden relative z-10">
          <div className="flex items-center gap-8 border-b border-slate-200/60 mb-8 max-w-max mx-auto md:mx-0">
             <button 
                className={cn("text-[1.1rem] pb-3 px-2 transition-all relative", activeTab === "tests" ? "text-slate-800 font-medium" : "text-slate-500 hover:text-slate-700")}
                onClick={() => setActiveTab("tests")}
             >
                Tests
                {activeTab === "tests" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F06C00] rounded-t-full shadow-sm"></div>}
             </button>
             <button 
                className={cn("text-[1.1rem] pb-3 px-2 transition-all relative", activeTab === "packages" ? "text-slate-800 font-medium" : "text-slate-500 hover:text-slate-700")}
                onClick={() => setActiveTab("packages")}
             >
                Packages
                {activeTab === "packages" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F06C00] rounded-t-full shadow-sm"></div>}
             </button>
          </div>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 px-2 -mx-2">
            {products.map((p) => (
              <TestCard key={p.id} p={p} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden relative z-10">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-medium text-slate-800 tracking-tight">Popular Tests Near You</h2>
             <span className="text-[#F06C00] text-sm cursor-pointer hover:underline flex items-center gap-1 group">
               View All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </span>
          </div>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 pt-2 px-2 -mx-2">
               {[...products].reverse().map((p, i) => (
                 <TestCard key={`popular-${p.id}-${i}`} p={p} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />
               ))}
          </div>
        </div>
      </section>
    </>
  );
}
