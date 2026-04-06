import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, X, Lock, Shield, Tag, ChevronRight, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const initialCartItems = [
  { id: "1", product: "Full Cream Milk", tests: 3, lab: "Chennai Food Testing Laboratory", price: 3600, mrp: 6300 },
  { id: "2", product: "Basmati Rice", tests: 2, lab: null, price: 2400, mrp: 4200 },
];

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [items, setItems] = useState(initialCartItems);
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = items.reduce((a, b) => a + b.price, 0);
  const totalMrp = items.reduce((a, b) => a + b.mrp, 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 rounded-none border-none flex flex-col h-full bg-slate-50">
        <SheetHeader className="p-5 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <ShoppingCart className="h-5.5 w-5.5 text-slate-400" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-800 tracking-tight">Access Your Selection</SheetTitle>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.15em]">{items.length} Diagnostic Items Listed</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center opacity-50">
                <ShoppingCart className="h-8 w-8 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Discover our premium diagnostic packages to start your safety journey.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} asChild className="h-10 px-6 bg-[#D32F2F] text-white font-semibold text-xs rounded-lg">
                <Link to="/packages">Browse Packages</Link>
              </Button>
            </div>
          ) : (
            <div className="px-6 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl p-5 border border-slate-100 transition-all duration-300 relative overflow-hidden">
                   <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                         <div className="space-y-0.5">
                            <h4 className="font-semibold text-slate-800 tracking-tight leading-tight">{item.product} Panel</h4>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{item.tests} Clinical Tests</p>
                         </div>
                         <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-[#D32F2F] transition-colors p-1">
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.lab ? (
                           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                             <Shield className="h-3 w-3 text-emerald-500" />
                             <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[150px]">{item.lab}</span>
                           </div>
                        ) : (
                           <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                             Lab assigned next <ChevronRight className="h-3 w-3" />
                           </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 tracking-tight">₹{item.price.toLocaleString()}</span>
                            <span className="text-xs text-slate-300 line-through">₹{item.mrp.toLocaleString()}</span>
                         </div>
                         <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-tight">
                           {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% Off
                         </div>
                      </div>
                   </div>
                </div>
              ))}

              {/* Coupon Applied */}
              <div className="p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                       <Tag className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">Coupon Applied</p>
                       <p className="text-sm font-semibold text-slate-800">LITMUS10</p>
                    </div>
                 </div>
                 <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest">Saved ₹{Math.round(subtotal * 0.1).toLocaleString()}</div>
              </div>
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 space-y-5 shrink-0">
            <div className="space-y-2 text-sm font-medium">
               <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-widest font-semibold">Subtotal</span>
                  <span className="font-semibold text-slate-600">₹{subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-widest font-semibold">GST (18%)</span>
                  <span className="font-semibold text-slate-600">₹{gst.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pt-2 text-base font-semibold text-slate-800 border-t border-slate-50 mt-2">
                  <span>To Pay</span>
                  <span className="text-[#D32F2F]">₹{total.toLocaleString()}</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <Button asChild onClick={() => setIsOpen(false)} variant="outline" className="flex-1 h-11 border-slate-200 text-slate-500 hover:text-slate-800 font-semibold uppercase text-[10px] tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all">
                  <Link to="/home">Explore</Link>
               </Button>
               <Button asChild onClick={() => setIsOpen(false)} className="flex-[2] h-11 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2">
                  <Link to="/bookings/new">Checkout <ArrowRight className="h-4 w-4" /></Link>
               </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
