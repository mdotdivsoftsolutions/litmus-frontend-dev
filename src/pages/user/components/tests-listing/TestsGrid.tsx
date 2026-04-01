import { Activity, FileText, Plus, Minus, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export const TestsGrid = ({ 
  products, 
  cartItems, 
  addToCart, 
  removeFromCart, 
  handleSeeMore,
  hasMore
}: any) => {
  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
         <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
              Test Packages <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">for You</span>
            </h2>
            <p className="text-slate-500 mt-3 text-lg">Industry-compliant multi-parameter testing panels for complete safety verification.</p>
         </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center lg:justify-start -mx-2">
        {products.map((p: any) => {
          const price = p.testCount * 150 + 999;
          const mrp = p.testCount * 260 + 1500;
          const qty = cartItems[p.id] || 0;
          const discount = discountPct(price, mrp);

          return (
            <Link key={p.id} to={`/tests/${p.id}`} className="w-full sm:w-[385px] shrink-0 rounded-[1.25rem] bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden m-2 border border-slate-100 group">
              <div className="bg-gradient-to-r from-[#D32F2F] to-[#feba50] p-5 text-white rounded-b-[1.25rem] shadow-[0_4px_14px_rgba(244,155,38,0.4)] relative h-[120px] flex flex-col justify-end pb-5 transition-colors">
                <div className="absolute top-0 right-4 bg-gradient-to-b from-[#D32F2F] to-[#feba50] text-white text-[10px] font-extrabold px-3 py-1 rounded-b-md tracking-wider shadow-sm uppercase">Checkup</div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold leading-tight w-3/5 pr-2 tracking-tight">{p.name || "Food Safety Test"}</h3>
                  <div className="flex flex-col items-end pt-1">
                     <div className="flex items-center gap-1.5">
                       <span className="text-[11px] text-white/70 line-through">₹{mrp}</span>
                       <span className="text-[1.50rem] font-extrabold tracking-tight drop-shadow-sm">₹{price}</span>
                     </div>
                     <span className="bg-gradient-to-r from-[#D32F2F] to-[#f49b26] text-white text-[8px] uppercase font-bold px-2 py-1 rounded mt-0.5 tracking-wider shadow-sm">{discount}% Off</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-start gap-3 w-1/2">
                     <div className="mt-0.5 text-slate-400"><Activity className="w-5 h-5" /></div>
                     <div>
                        <p className="text-[13px] text-slate-800 leading-none">{p.testCount} parameters</p>
                        <p className="text-[11px] text-slate-500 mt-1">included</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3 w-1/2 border-l border-slate-100 pl-4">
                     <div className="mt-0.5 text-slate-400"><FileText className="w-5 h-5" /></div>
                     <div>
                        <p className="text-[11px] text-slate-500 leading-none">Reports in</p>
                        <p className="text-[13px] text-slate-800 mt-1">3 Days</p>
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                   <button className="flex-1 h-11 rounded-xl border border-[#F06C00] text-[#F06C00] font-semibold text-sm bg-transparent hover:bg-orange-50 transition-colors">View Details</button>
                   {qty === 0 ? (
                     <button onClick={(e) => { e.preventDefault(); addToCart(p.id); }} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#feba50] to-[#f49b26] text-white font-medium text-sm shadow-[0_4px_14px_rgba(244,155,38,0.4)] hover:shadow-[0_6px_20px_rgba(244,155,38,0.6)] hover:-translate-y-0.5 transition-all">Add to Cart</button>
                   ) : (
                     <div className="flex-1 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between px-3 shadow-inner">
                       <button onClick={(e) => { e.preventDefault(); removeFromCart(p.id); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm"><Minus className="h-4 w-4" /></button>
                       <span className="text-[#f49b26] font-semibold text-sm">{qty}</span>
                       <button onClick={(e) => { e.preventDefault(); addToCart(p.id); }} className="text-[#f49b26] hover:text-[#e0891d] bg-white rounded-full p-0.5 shadow-sm"><Plus className="h-4 w-4" /></button>
                     </div>
                   )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modern See More Button Section */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center py-5 gap-4">
          <button 
            onClick={handleSeeMore}
            className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-800 font-bold tracking-tight hover:border-[#D32F2F]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative text-sm z-10">Show More Packages</span>
            <div className="relative z-10 h-8 w-8 rounded-xl bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
               <ArrowDown className="h-4 w-4 text-white" />
            </div>
            
            {/* Subtle light background on hover */}
            <div className="absolute inset-0 bg-slate-50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 origin-center -z-0" />
          </button>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Discover more diagnostic capabilities</p>
        </div>
      )}
    </div>
  );
};


