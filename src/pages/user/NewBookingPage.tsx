import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Building2, CreditCard, CheckCircle, Trash2, Tag, Shield, Clock, MapPin, Search } from "lucide-react";
import { tests as allTests, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const wizardSteps = [
  { icon: ClipboardList, label: "Review Tests" },
  { icon: Building2, label: "Select Lab" },
  { icon: CreditCard, label: "Payment Details" },
  { icon: CheckCircle, label: "Status" },
];

const initialCart = [
  { id: "1", product: "Full Cream Milk", tests: 3, price: 3600, mrp: 6300 },
  { id: "2", product: "Basmati Rice", tests: 2, price: 2400, mrp: 4200 },
];

export default function NewBookingPage() {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(initialCart);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed" | "rejected">("pending");
  const navigate = useNavigate();

  const subtotal = items.reduce((a, b) => a + b.price, 0);
  const totalMrp = items.reduce((a, b) => a + b.mrp, 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleNext = () => {
    if (step === 2) {
      // Simulate payment and result
      setOrderStatus("confirmed");
      setStep(3);
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0 && step < 3) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Step indicator */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 ">
          <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-10">
            {wizardSteps.map((s, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => i < step && step < 3 ? setStep(i) : null}
                  disabled={i > step || step === 3}
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-2 text-sm font-medium transition-colors",
                    i === step ? "text-primary" : i < step ? "text-litmus-teal" : "text-slate-300",
                    i <= step && step < 3 ? "cursor-pointer" : "cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full border-2",
                    i === step ? "border-primary bg-primary/10 text-primary" : i < step ? "border-litmus-teal bg-litmus-teal text-white" : "border-slate-200 bg-slate-50"
                  )}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className={cn("hidden sm:inline", i <= step ? "text-slate-800 font-semibold" : "text-slate-400 font-normal")}>{s.label}</span>
                  <span className={cn("sm:hidden text-[10px] mt-1 break-words text-center leading-tight tracking-tight", i <= step ? "text-slate-800 font-semibold" : "text-slate-400")}>{s.label.split(' ').join('\n')}</span>
                </button>
                {i < wizardSteps.length - 1 && (
                  <div className={cn("h-0.5 w-8 sm:w-16 mx-2 sm:mx-6", i < step ? "bg-litmus-teal" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main Content Area */}
          <div className={cn("lg:col-span-3 space-y-6", step === 3 ? "lg:col-span-5 w-full" : "")}>
            
            {/* STEP 0: Review Tests */}
            {step === 0 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Review Selected Tests</h2>
                  <p className="text-slate-500 mt-1">Review the test parameters before proceeding to select a laboratory.</p>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-border">
                    <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p className="text-slate-500">Your list is empty.</p>
                    <Button asChild className="mt-4"><Link to="/tests">Browse Tests</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id} className="border border-slate-200 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg text-slate-800">{item.product} Panel</h3>
                            <p className="text-sm text-slate-500">{item.tests} parameters included</p>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-slate-400 line-through">₹{item.mrp.toLocaleString()}</p>
                              <p className="font-bold text-slate-800 text-lg">₹{item.price.toLocaleString()}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Select Lab */}
            {step === 1 && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Select Laboratory</h2>
                    <p className="text-slate-500 mt-1">Choose an accredited laboratory or let us decide.</p>
                  </div>
                </div>

                {/* Litmus Admin Option (Preferred) */}
                <Card 
                  onClick={() => setSelectedLab("admin")}
                  className={cn(
                    "cursor-pointer transition-all border-2 rounded-xl relative overflow-hidden",
                    selectedLab === "admin" ? "border-primary bg-primary/5 shadow-md" : "border-slate-200 hover:border-primary/50"
                  )}
                >
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Recommended
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <Shield className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                         <h3 className="font-bold text-lg text-slate-800">Assign to Litmus System Admin</h3>
                         <p className="text-sm text-slate-600 mt-1">
                           Can't find a lab or some selected tests are missing? Choose this option and our team will manually review your order and allocate the most optimal verified laboratories for your requirements.
                         </p>
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-4 py-2">
                   <div className="h-px bg-slate-200 flex-1"></div>
                   <span className="text-sm text-slate-400 font-medium">OR CHOOSE MANUALLY</span>
                   <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                {/* List of Labs */}
                <div className="space-y-4">
                  {laboratories.slice(0, 3).map((lab) => (
                    <Card 
                      key={lab.id} 
                      onClick={() => setSelectedLab(lab.id)}
                      className={cn(
                        "cursor-pointer transition-all rounded-xl",
                        selectedLab === lab.id ? "border-2 border-primary bg-primary/5 shadow-md" : "border border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <CardContent className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{lab.name}</h3>
                          <div className="flex items-center gap-3">
                             <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5"/> {lab.city}</span>
                             <span className="flex items-center gap-1 text-sm text-slate-500"><Clock className="h-3.5 w-3.5"/> 24-48 hrs</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            {lab.nabl && <Badge className="bg-slate-800 text-white font-medium text-[10px] px-2 uppercase hover:bg-slate-700">NABL</Badge>}
                            {lab.fssai && <Badge className="bg-litmus-teal text-white font-medium text-[10px] px-2 uppercase hover:bg-litmus-teal-deep">FSSAI</Badge>}
                          </div>
                        </div>
                        <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto">
                           <p className="text-sm text-slate-500">Processing Fee</p>
                           <p className="font-bold text-slate-800 text-lg">₹{lab.priceFrom}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Payment Details */}
            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Secure Payment</h2>
                  <p className="text-slate-500 mt-1">Review your order details and complete the payment.</p>
                </div>
                
                <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-700">Order Booking summary</span>
                      <Badge variant="outline" className="bg-white">{items.length} items</Badge>
                   </div>
                   <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                         {items.map((item) => (
                            <div key={item.id} className="p-4 flex justify-between items-center">
                               <div>
                                  <p className="font-medium text-slate-800">{item.product}</p>
                                  <p className="text-sm text-slate-500">{item.tests} tests</p>
                               </div>
                               <p className="font-semibold text-slate-800">₹{item.price.toLocaleString()}</p>
                            </div>
                         ))}
                      </div>
                      <div className="bg-blue-50/50 p-4 flex gap-3 text-sm text-blue-800 border-t border-slate-100">
                         <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                         <p>Your payment is processed securely. We use industry-standard encryption to protect your financial details.</p>
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3: Status / Confirmation */}
            {step === 3 && (
              <div className="animate-fade-in space-y-6 w-full">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Booking Confirmed</h2>
                    <p className="text-slate-500 mt-1">We have successfully received your booking request.</p>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    {/* Left details */}
                    <div className="space-y-6">
                       <Card className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm">
                          <CardContent className="p-6">
                             <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                   <CheckCircle className="h-6 w-6" />
                                </div>
                                <div>
                                   <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest">Order Status</p>
                                   <h3 className="text-xl font-bold text-emerald-900">Confirmed & Processed</h3>
                                </div>
                             </div>
                             <div className="pt-4 border-t border-emerald-200/60 grid grid-cols-2 gap-4">
                                <div>
                                   <p className="text-xs text-emerald-600/80 uppercase font-medium">Order ID</p>
                                   <p className="font-semibold text-emerald-900">#LTMS-{Math.floor(100000 + Math.random() * 900000)}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-emerald-600/80 uppercase font-medium">Date & Time</p>
                                   <p className="font-semibold text-emerald-900">{new Date().toLocaleString()}</p>
                                </div>
                             </div>
                          </CardContent>
                       </Card>

                       <Card className="rounded-xl border border-slate-200">
                          <CardContent className="p-6 space-y-4">
                             <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" /> Fulfilment Partner
                             </h4>
                             <div className="bg-slate-50 rounded-lg p-4">
                                {selectedLab === "admin" ? (
                                   <>
                                      <p className="font-semibold text-slate-800">Litmus System Admin Allocation</p>
                                      <p className="text-sm text-slate-600 mt-1">Our team is reviewing your requirements and will manually assign the most suitable laboratories. You will receive an update shortly.</p>
                                   </>
                                ) : (
                                   <>
                                      <p className="font-semibold text-slate-800">{laboratories.find(l => l.id === selectedLab)?.name || 'Central Lab'}</p>
                                      <p className="text-sm text-slate-600 mt-1">The chosen laboratory has been notified and expects your sample shortly.</p>
                                   </>
                                )}
                             </div>
                          </CardContent>
                       </Card>
                    </div>

                    {/* Right summary block */}
                    <div className="space-y-6">
                       <Card className="rounded-xl border border-slate-200 h-full">
                          <div className="bg-slate-50 border-b border-slate-200 p-4">
                             <h4 className="font-bold text-slate-800">Order Summary</h4>
                          </div>
                          <CardContent className="p-0">
                             <div className="divide-y divide-slate-100 p-4">
                                {items.map((item) => (
                                   <div key={item.id} className="py-2 flex justify-between items-start">
                                      <div>
                                         <p className="font-medium text-slate-800">{item.product}</p>
                                         <p className="text-xs text-slate-500">{item.tests} tests included</p>
                                      </div>
                                      <p className="font-semibold text-slate-800">₹{item.price.toLocaleString()}</p>
                                   </div>
                                ))}
                             </div>
                             
                             <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-600">Subtotal</span>
                                   <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                   <span className="text-slate-600">GST (18%)</span>
                                   <span className="font-medium text-slate-800">₹{gst.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3">
                                   <span className="font-bold text-slate-800">Total Paid</span>
                                   <span className="font-extrabold text-primary text-lg">₹{total.toLocaleString()}</span>
                                </div>
                             </div>
                          </CardContent>
                       </Card>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 py-4">
                    <Button onClick={() => navigate("/orders")} className="h-12 px-6 rounded-lg bg-primary hover:bg-primary-deep text-white font-medium">
                       Tracking & Order History
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/home")} className="h-12 px-6 rounded-lg font-medium text-slate-600">
                       Return to Home
                    </Button>
                 </div>
              </div>
            )}

          </div>

          {/* Right Column — Sticky Order Summary (Hidden on confirmation step) */}
          {step < 3 && (
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-4">
                <Card className="rounded-2xl shadow-lg border border-slate-100">
                  <CardContent className="p-6 space-y-5">
                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-lg">Summary</span>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{items.length} products</Badge>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      {/* Payment Breakdown */}
                      <div className="flex justify-between text-sm"><span className="text-slate-500">Total MRP</span><span className="text-slate-800 font-medium">₹{totalMrp.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-litmus-teal font-medium">Discount on MRP</span><span className="text-litmus-teal font-medium">- ₹{discount.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-500">Platform Fee</span><span className="text-slate-800"><span className="line-through text-slate-400 mr-2">₹150</span><span className="text-litmus-teal font-bold uppercase">Free</span></span></div>
                      
                      {step > 1 && (
                         <div className="flex justify-between text-sm border-t border-dashed border-slate-200 pt-3 mt-1">
                            <span className="text-slate-500">GST (18%)</span><span className="text-slate-800 font-medium">+ ₹{gst.toLocaleString()}</span>
                         </div>
                      )}
                      
                      <div className="border-t border-slate-200 pt-3 mt-1 pb-1 flex justify-between items-center">
                        <span className="text-slate-800 font-bold">Total Amount</span>
                        <span className="text-2xl font-extrabold text-primary">₹{step > 1 ? total.toLocaleString() : subtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                       {step === 0 && (
                          <Button 
                             disabled={items.length === 0}
                             onClick={handleNext} 
                             className="w-full bg-primary hover:bg-primary-deep text-white rounded-xl h-14 font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                          >
                            Proceed to Select Lab
                          </Button>
                       )}
                       {step === 1 && (
                          <Button 
                             disabled={!selectedLab}
                             onClick={handleNext} 
                             className="w-full bg-primary hover:bg-primary-deep text-white rounded-xl h-14 font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                          >
                            Proceed to Payment
                          </Button>
                       )}
                       {step === 2 && (
                          <Button 
                             onClick={handleNext} 
                             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 font-bold text-base shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                          >
                            Pay ₹{total.toLocaleString()} securely
                          </Button>
                       )}
                      
                       {step > 0 && (
                          <Button variant="ghost" onClick={handleBack} className="w-full mt-3 h-12 rounded-xl text-slate-500 hover:text-slate-800 font-medium">
                             Back to previous step
                          </Button>
                       )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center flex items-center justify-center gap-2 text-blue-700 mx-1">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Litmus Buyer Protection</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
