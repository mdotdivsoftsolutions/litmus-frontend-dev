import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Lock, Shield } from "lucide-react";

const cartItems = [
  { id: "1", product: "Full Cream Milk", tests: 3, lab: "Chennai Food Testing Laboratory", price: 3600 },
  { id: "2", product: "Basmati Rice", tests: 2, lab: null, price: 2400 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const subtotal = items.reduce((a, b) => a + b.price, 0);
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
              <Card key={item.id} className="border border-border rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{item.product} Test Panel</h3>
                      <p className="text-sm text-muted-foreground">{item.tests} tests selected</p>
                      {item.lab ? (
                        <Badge variant="outline" className="text-xs">{item.lab}</Badge>
                      ) : (
                        <Link to="/labs" className="text-sm font-medium text-accent hover:underline">Select Lab →</Link>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-primary">₹{item.price.toLocaleString()}</p>
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
              <Card className="border border-border rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-bold text-foreground">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">₹{gst.toLocaleString()}</span></div>
                    <div className="flex justify-between pt-2 border-t border-border font-bold text-base"><span>Total</span><span className="text-primary">₹{total.toLocaleString()}</span></div>
                  </div>

                  {items.some((i) => !i.lab) && (
                    <p className="text-xs text-accent">⚠ Select a lab for all items before proceeding</p>
                  )}

                  <Button className="w-full bg-primary hover:bg-primary-deep rounded-xl h-11 font-semibold" 
                    disabled={items.some((i) => !i.lab)} asChild={!items.some((i) => !i.lab) ? true : undefined}>
                    {!items.some((i) => !i.lab) ? <Link to="/bookings/new">Proceed to Book</Link> : <span>Proceed to Book</span>}
                  </Button>

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
