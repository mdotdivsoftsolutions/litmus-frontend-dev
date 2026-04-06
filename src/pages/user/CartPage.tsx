import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Lock, Shield, Tag } from "lucide-react";

const cartItems = [
  { id: "1", product: "Full Cream Milk", tests: 3, lab: "Chennai Food Testing Laboratory", price: 3600, mrp: 6300 },
  { id: "2", product: "Basmati Rice", tests: 2, lab: null, price: 2400, mrp: 4200 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const subtotal = items.reduce((a, b) => a + b.price, 0);
  const totalMrp = items.reduce((a, b) => a + b.mrp, 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" /> Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button asChild className="bg-primary hover:bg-primary-deep rounded-full"><Link to="/tests">Browse Tests</Link></Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border border-border rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{item.product} Test Panel</h3>
                      <p className="text-sm text-muted-foreground">{item.tests} tests selected</p>
                      {item.lab ? (
                        <Badge variant="outline" className="text-xs">{item.lab}</Badge>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">Lab to be selected next</span>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground line-through">₹{item.mrp.toLocaleString()}</p>
                      <p className="font-bold text-primary text-lg">₹{item.price.toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <Card className="rounded-2xl shadow-md border-0">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{items.length} products added</span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground line-through mr-2">₹{totalMrp.toLocaleString()}</span>
                      <span className="text-lg font-bold text-primary">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-12 font-semibold text-base" asChild>
                    <Link to="/bookings/new">Proceed to Book</Link>
                  </Button>

                  {/* Coupon */}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-litmus-teal" />
                        <span className="font-bold text-foreground text-sm">LITMUS10</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full border-primary text-primary text-xs h-7 px-3">APPLY</Button>
                    </div>
                    <p className="text-xs text-litmus-teal mt-1">Save ₹{Math.round(subtotal * 0.1).toLocaleString()} with this coupon</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total MRP</span><span>₹{totalMrp.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-litmus-teal">Discount on MRP</span><span className="text-litmus-teal">- ₹{discount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee</span><span><span className="line-through text-muted-foreground mr-1">₹150</span><span className="text-litmus-teal font-medium">FREE</span></span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                      <span>To Pay</span><span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-litmus-mint rounded-lg px-3 py-2 text-center">
                    <span className="text-xs text-litmus-dark font-medium">🏷 You will save ₹{(discount + 150).toLocaleString()} on this order.</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure Payment</span>
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> FSSAI Compliant</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
