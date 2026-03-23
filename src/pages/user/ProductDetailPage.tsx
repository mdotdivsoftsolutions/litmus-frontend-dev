import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { tests as allTests } from "@/lib/placeholder-data";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const productName = ["Full Cream Milk", "Refined Sunflower Oil", "Basmati Rice"][Number(id || 1) - 1] || "Full Cream Milk";

  const toggle = (tid: string) => setSelected((prev) => prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{productName}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tests list */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{productName}</h1>
          <p className="text-muted-foreground">Select the tests you want to perform on this product.</p>
          
          <div className="space-y-2">
            {allTests.map((test) => (
              <Card key={test.id} className="border shadow-none">
                <CardContent className="flex items-center gap-4 p-4">
                  <Checkbox checked={selected.includes(test.id)} onCheckedChange={() => toggle(test.id)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{test.name}</p>
                    <p className="text-xs text-muted-foreground">Method: FSSAI {test.method}</p>
                  </div>
                  <Badge variant="outline">{test.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="params">
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

        {/* Cart panel */}
        <div className="lg:sticky lg:top-20">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-4 w-4" />Booking Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tests selected yet</p>
              ) : (
                <>
                  {selected.map((sid) => {
                    const t = allTests.find((x) => x.id === sid)!;
                    return (
                      <div key={sid} className="flex items-center justify-between text-sm">
                        <span>{t.name}</span>
                        <button onClick={() => toggle(sid)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
                      </div>
                    );
                  })}
                  <div className="border-t pt-3 flex items-center justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>₹{(selected.length * 1200).toLocaleString()}</span>
                  </div>
                  <Button className="w-full" asChild><Link to="/dashboard/laboratories">Proceed to Select Lab</Link></Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
