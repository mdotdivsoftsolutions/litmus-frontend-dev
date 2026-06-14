import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartDrawer } from "./CartDrawerContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Shield, Tag, ChevronRight, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { open: isOpen, setOpen: setIsOpen } = useCartDrawer();
  const queryClient = useQueryClient();

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
  });

  const cartItems = cartResponse?.data?.items || [];

  const subtotal = cartItems.reduce((a: number, b: any) => a + b.price, 0);
  const totalMrp = cartItems.reduce((a: number, b: any) => a + b.mrp, 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeMutation = useMutation({
    mutationFn: (id: string) => cartApi.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeItem = (id: string) => {
    removeMutation.mutate(id);
  };

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
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.15em]">{cartItems.length} Analytical Items Listed</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-[#D32F2F]" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center space-y-4">
              <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center opacity-50">
                <ShoppingCart className="h-8 w-8 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">Discover our premium testing packages to start your food safety journey.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} asChild className="h-10 px-6 bg-[#D32F2F] text-white font-semibold text-xs rounded-lg">
                <Link to="/packages">Browse Packages</Link>
              </Button>
            </div>
          ) : (
            <div className="px-6 space-y-2 py-4">
              {cartItems.map((item: any) => (
                <div key={item._id} className="group bg-white rounded-xl p-5 border border-slate-100 transition-all duration-300 relative overflow-hidden">
                   <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                         <div className="space-y-0.5">
                            <h4 className="font-semibold text-slate-800 tracking-tight leading-tight">
                              {item.itemType === 'TEST' ? item.testId?.testName : item.packageId?.name} 
                              {item.itemType === 'PACKAGE' ? ' Panel' : ''}
                            </h4>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                              {item.itemType === 'TEST' 
                                ? `${item.parameters?.length || 0} Parameters` 
                                : 'Comprehensive Package'}
                            </p>
                         </div>
                         <button 
                           onClick={() => removeItem(item._id)} 
                           disabled={removeMutation.isPending}
                           className="text-slate-300 hover:text-[#D32F2F] transition-colors p-1 disabled:opacity-50"
                         >
                            {removeMutation.isPending && removeMutation.variables === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                         </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 tracking-tight">₹{item.price.toLocaleString()}</span>
                            {item.mrp > item.price && <span className="text-xs text-slate-300 line-through">₹{item.mrp.toLocaleString()}</span>}
                         </div>
                         {item.mrp > item.price && (
                           <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-tight">
                             {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% Off
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              ))}


            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
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
