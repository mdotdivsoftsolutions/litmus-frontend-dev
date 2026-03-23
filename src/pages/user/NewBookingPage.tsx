import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, CheckCircle2 } from "lucide-react";
import { tests as allTests, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const wizardSteps = ["Review Tests", "Select Lab", "Sample Details", "Review & Pay"];

export default function NewBookingPage() {
  const [step, setStep] = useState(0);
  const selectedTests = allTests.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">New Booking</h1>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {wizardSteps.map((label, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", i < step ? "bg-status-approved text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{label}</span>
            </div>
            {i < wizardSteps.length - 1 && <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-status-approved" : "bg-muted")} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Selected Tests</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {selectedTests.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">FSSAI {t.method} · <Badge variant="outline" className="ml-1">{t.type}</Badge></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₹1,200</span>
                  <button><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Subtotal</span><span>₹3,600</span>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {laboratories.slice(0, 4).map((lab) => (
            <Card key={lab.id} className="border shadow-none hover:border-secondary cursor-pointer transition-colors">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold">{lab.name}</h3>
                <p className="text-sm text-muted-foreground">{lab.city}</p>
                <div className="flex gap-1">{lab.nabl && <Badge variant="approved">NABL</Badge>}{lab.fssai && <Badge variant="completed">FSSAI</Badge>}</div>
                <p className="text-sm font-semibold">Starting ₹{lab.priceFrom}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Sample Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Batch Number</Label><Input placeholder="BATCH-2024-001" /></div>
              <div className="space-y-2"><Label>Manufacturing Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Sample Quantity</Label><Input placeholder="500 grams" /></div>
              <div className="space-y-2"><Label>Brand Name</Label><Input placeholder="Kumar's Premium" /></div>
              <div className="space-y-2"><Label>MRP (₹)</Label><Input placeholder="250" /></div>
            </div>
            <div className="space-y-2"><Label>Place of Manufacture</Label><Input placeholder="Chennai, Tamil Nadu" /></div>
            <div className="space-y-2"><Label>Special Instructions</Label><Textarea placeholder="Any specific instructions for the lab..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Photo</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-6 hover:border-secondary transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sample Label</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-6 hover:border-secondary transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {selectedTests.map((t) => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.name}</span><span>₹1,200</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between text-sm"><span>Subtotal</span><span>₹3,600</span></div>
              <div className="flex justify-between text-sm"><span>GST (18%)</span><span>₹648</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹4,248</span></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm font-normal">I agree to the terms and conditions</Label>
            </div>
            <Button className="w-full" size="lg">Pay ₹4,248 with Razorpay</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
      </div>
    </div>
  );
}
