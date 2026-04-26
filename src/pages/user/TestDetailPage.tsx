import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, Shield, Clock, Lock, MessageCircle, ChevronRight } from "lucide-react";
import { tests as allTests, products } from "@/lib/placeholder-data";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function TestDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tid: string) => setSelected((prev) => prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid]);

  const totalPrice = selected.length * 1200;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/tests" className="hover:text-foreground">Tests</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Test List - Left */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <Badge className="bg-flame-amber-tint text-accent border-0 text-xs mb-2">{product.category}</Badge>
            <h1 className="text-2xl font-bold text-foreground">{product.name} Test Panel</h1>
            <p className="text-muted-foreground mt-1">Select the tests you want to perform on this product.</p>
          </div>

          <div className="space-y-2">
            {allTests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors">
                <Checkbox checked={selected.includes(test.id)} onCheckedChange={() => toggle(test.id)} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{test.name}</p>
                  <p className="text-xs text-muted-foreground">Method: FSSAI {test.method}</p>
                </div>
                <Badge variant="outline" className="shrink-0">{test.type}</Badge>
                <span className="font-semibold text-primary text-sm shrink-0">₹1,200</span>
              </div>
            ))}
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="params" className="border rounded-xl px-4">
              <AccordionTrigger>Test Parameters Info</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Fat Content Analysis:</strong> Total fat, Saturated fat, Trans fat (% w/w)</p>
                  <p><strong>Total Plate Count:</strong> Colony forming units per gram (CFU/g)</p>
                  <p><strong>Moisture Content:</strong> Moisture percentage (% w/w)</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sticky Booking Panel - Right */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-foreground">{product.name}</h3>
                
                {selected.length > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{(totalPrice * 1.75).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selected.length} tests selected</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select tests to see pricing</p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-litmus-teal" />
                  Reports in 3–5 working days
                </div>

                <div className="flex gap-2">
                  <Badge className="bg-litmus-dark text-primary-foreground border-0">NABL</Badge>
                  <Badge className="bg-litmus-teal text-primary-foreground border-0">FSSAI</Badge>
                </div>

                {selected.length > 0 ? (
                  <CartDrawer>
                    <Button className="w-full bg-primary hover:bg-primary-deep rounded-lg gap-2">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </Button>
                  </CartDrawer>
                ) : (
                  <Button className="w-full bg-primary hover:bg-primary-deep rounded-lg gap-2" disabled>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                )}
                <Button variant="outline" className="w-full rounded-lg border-primary text-primary hover:bg-flame-red-tint" disabled={selected.length === 0} asChild={selected.length > 0 ? true : undefined}>
                  {selected.length > 0 ? (
                    <Link to="/bookings/new" className="flex items-center gap-2">Book Now</Link>
                  ) : (
                    <span>Book Now</span>
                  )}
                </Button>

                <a href="#" className="flex items-center justify-center gap-2 text-sm font-medium text-litmus-teal hover:underline">
                  <MessageCircle className="h-4 w-4" /> Need help? Chat on WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  {[
                    { icon: Shield, label: "100% Accurate" },
                    { icon: Shield, label: "NABL Certified" },
                    { icon: Lock, label: "Secure Payment" },
                    { icon: MessageCircle, label: "WhatsApp Reports" },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <b.icon className="h-3.5 w-3.5 text-accent" />
                      {b.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
