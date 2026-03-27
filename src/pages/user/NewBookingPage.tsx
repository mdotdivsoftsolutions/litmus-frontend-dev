import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, User, MapPin, CalendarDays, Plus, Tag, Flame } from "lucide-react";
import { tests as allTests, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const wizardSteps = [
  { icon: User, label: "Member Details" },
  { icon: MapPin, label: "Address" },
  { icon: CalendarDays, label: "Slot" },
];

const selectedTests = allTests.slice(0, 3);
const testPrice = 1200;
const totalMRP = selectedTests.length * 2100;
const totalPrice = selectedTests.length * testPrice;
const discount = totalMRP - totalPrice;

export default function NewBookingPage() {
  const [step, setStep] = useState(0);
  const [sampleMode, setSampleMode] = useState("dropoff");

  return (
    <div className="animate-fade-in">
      {/* Step indicator */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {wizardSteps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={cn("flex items-center gap-2 text-sm font-medium transition-colors",
                  i === step ? "text-primary" : i < step ? "text-litmus-teal" : "text-muted-foreground"
                )}>
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.label}</span>
                {i < wizardSteps.length - 1 && <span className="text-border ml-4 sm:ml-6">———</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {step === 0 && (
              <>
                <h2 className="text-xl font-bold text-foreground">Who is getting tested?</h2>

                {/* Member card */}
                <Card className="border border-border rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-6 w-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-foreground">Member 1</span>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Left - Form fields */}
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked className="data-[state=checked]:bg-litmus-teal data-[state=checked]:border-litmus-teal" />
                          <span className="text-foreground">Testing for myself</span>
                        </label>
                        <div className="space-y-2">
                          <Label className="text-foreground">Full name <span className="text-primary">*</span></Label>
                          <Input defaultValue="Rajesh Kumar" className="rounded-lg border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Batch Number <span className="text-primary">*</span></Label>
                          <Input placeholder="BATCH-2024-001" className="rounded-lg border-border" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="space-y-2 flex-1">
                            <Label className="text-foreground">Mfg Date</Label>
                            <Input type="date" className="rounded-lg border-border" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <Label className="text-foreground">Expiry Date</Label>
                            <Input type="date" className="rounded-lg border-border" />
                          </div>
                        </div>
                      </div>

                      {/* Right - Tests added */}
                      <div className="sm:border-l sm:border-border sm:pl-6">
                        <p className="text-sm text-muted-foreground font-medium mb-3">Tests / Products added</p>
                        <div className="space-y-3">
                          {selectedTests.map((t) => (
                            <div key={t.id} className="flex items-center gap-2">
                              <Flame className="h-4 w-4 text-accent shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate">{t.name}</p>
                                <p className="text-xs text-muted-foreground">₹ {testPrice.toLocaleString()}</p>
                              </div>
                              <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          ))}
                        </div>
                        <button className="mt-3 text-sm font-medium text-primary flex items-center gap-1 hover:underline">
                          <Plus className="h-4 w-4" /> Add test / checkup
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-flame-red-tint w-full sm:w-auto gap-2">
                  <Plus className="h-4 w-4" /> Add another product / member
                </Button>

                {/* Sample Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Sample & Shipment Details</h3>
                  <Card className="border border-border rounded-xl">
                    <CardContent className="p-5 space-y-4">
                      <RadioGroup value={sampleMode} onValueChange={setSampleMode}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="dropoff" id="dropoff" />
                          <Label htmlFor="dropoff" className="text-foreground cursor-pointer">Drop off at lab</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="text-primary cursor-pointer font-medium">+ Add pickup address</Label>
                        </div>
                      </RadioGroup>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Sample Quantity</Label>
                          <Input placeholder="500 grams" className="rounded-lg border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Brand Name</Label>
                          <Input placeholder="Kumar's Premium" className="rounded-lg border-border" />
                        </div>
                      </div>
                      {/* Upload */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Product Photo</Label>
                          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-accent/50 p-6 hover:border-accent transition-colors cursor-pointer">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Sample Label</Label>
                          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-accent/50 p-6 hover:border-accent transition-colors cursor-pointer">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Select Lab / Address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {laboratories.slice(0, 4).map((lab) => (
                    <Card key={lab.id} className="border border-border rounded-xl hover:border-accent cursor-pointer transition-colors">
                      <CardContent className="p-5 space-y-2">
                        <h3 className="font-semibold text-foreground">{lab.name}</h3>
                        <p className="text-sm text-muted-foreground">{lab.city}</p>
                        <div className="flex gap-1">
                          {lab.nabl && <Badge className="bg-litmus-dark text-primary-foreground border-0 text-xs">NABL</Badge>}
                          {lab.fssai && <Badge className="bg-litmus-teal text-primary-foreground border-0 text-xs">FSSAI</Badge>}
                        </div>
                        <p className="text-sm font-semibold text-primary">Starting ₹{lab.priceFrom}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Pick a Slot</h2>
                <Card className="border border-border rounded-xl">
                  <CardContent className="p-5 space-y-4">
                    <Label>Select Date</Label>
                    <Input type="date" className="rounded-lg border-border max-w-xs" />
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((slot, i) => (
                        <button key={slot}
                          className={cn("py-2 rounded-lg text-sm font-medium border transition-colors",
                            i === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-accent"
                          )}>{slot}</button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-lg">Back</Button>}
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-primary hover:bg-primary-deep rounded-lg">Next</Button>
              ) : (
                <Button className="bg-primary hover:bg-primary-deep rounded-lg" asChild>
                  <Link to="/orders">Pay ₹{(totalPrice + Math.round(totalPrice * 0.18)).toLocaleString()} with Razorpay</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column — Sticky Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20 space-y-4">
              <Card className="rounded-2xl shadow-md border-0">
                <CardContent className="p-5 space-y-4">
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{selectedTests.length} products added</span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground line-through mr-2">₹{totalMRP.toLocaleString()}</span>
                      <span className="text-lg font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-12 font-semibold text-base" onClick={() => step < 2 ? setStep(step + 1) : null}>
                    {step < 2 ? "Add Lab / Proceed →" : "Confirm & Pay →"}
                  </Button>

                  <div className="border-t border-border pt-4 space-y-3">
                    {/* Offers */}
                    <div>
                      <Badge className="bg-flame-amber-tint text-foreground border-0 text-[10px] mb-2">Best Coupon</Badge>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-litmus-teal" />
                          <span className="font-bold text-foreground text-sm">LITMUS10</span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full border-primary text-primary text-xs h-7 px-3">APPLY</Button>
                      </div>
                      <p className="text-xs text-litmus-teal mt-1">Save ₹{Math.round(totalPrice * 0.1).toLocaleString()} with this coupon</p>
                      <button className="text-xs text-muted-foreground mt-1">More Details ▾</button>
                    </div>

                    <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground py-2 border-t border-border">
                      <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> View all coupons</span>
                      <ChevronIcon />
                    </button>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">Payment Summary</h4>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total MRP</span><span className="text-foreground">₹{totalMRP.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-litmus-teal">Discount on MRP</span><span className="text-litmus-teal">- ₹{discount.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Platform Fee</span><span className="text-foreground"><span className="line-through text-muted-foreground mr-1">₹150</span><span className="text-litmus-teal font-medium">FREE</span></span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span></div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span className="text-foreground">To Pay</span>
                      <span className="text-foreground">₹{(totalPrice + Math.round(totalPrice * 0.18)).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Savings strip */}
                  <div className="bg-litmus-mint rounded-lg px-3 py-2 text-center">
                    <span className="text-xs text-litmus-dark font-medium">🏷 You will save ₹{(discount + 150).toLocaleString()} on this order.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
