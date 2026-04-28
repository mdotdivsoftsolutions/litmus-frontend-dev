import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ClipboardList as ClipboardListIcon, 
  Building2 as BuildingIcon, 
  CreditCard as CreditCardIcon, 
  CheckCircle as CheckCircleIcon, 
  Trash2 as TrashIcon, 
  Shield as ShieldIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronLeft as ChevronLeftIcon,
  ArrowRight as ArrowRightIcon,
  Info as InfoIcon,
  CheckCircle2 as CheckCircle2Icon,
  Lock as LockIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  Settings2 as EditIcon,
  Plus as PlusIcon
} from "lucide-react";
import { laboratories, tests as allTestsData } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const wizardSteps = [
  { icon: ClipboardListIcon, label: "Review Tests" },
  { icon: BuildingIcon, label: "Select Lab" },
  { icon: HomeIcon, label: "Collection" },
  { icon: CreditCardIcon, label: "Payment" },
  { icon: CheckCircleIcon, label: "Status" },
];

const initialCart = [
  { 
    id: "1", 
    product: "Full Cream Milk", 
    category: "Dairy", 
    selectedTests: ["1", "2", "3"], // IDs from tests data
    customTests: [] as string[],
    basePrice: 1200 // Price per test
  },
  { 
    id: "2", 
    product: "Basmati Rice", 
    category: "Grains", 
    selectedTests: ["4", "5"],
    customTests: [] as string[],
    basePrice: 1200
  },
];

export default function NewBookingPage() {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(initialCart);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [customParamName, setCustomParamName] = useState("");
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [orderId] = useState(() => `#LTMS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    address: "123, Green Park, Industrial Area Phase 2",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    pickupDate: "",
    pickupTime: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Calculate prices based on selected and custom tests
  const calculateItemPrice = (item: typeof initialCart[0]) => (item.selectedTests.length + item.customTests.length) * item.basePrice;
  const calculateItemMrp = (item: typeof initialCart[0]) => calculateItemPrice(item) * 1.75;

  const subtotal = items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  const totalMrp = items.reduce((acc, item) => acc + calculateItemMrp(item), 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const toggleTest = (itemId: string, testId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const isSelected = item.selectedTests.includes(testId);
        const newTests = isSelected 
          ? item.selectedTests.filter(id => id !== testId) 
          : [...item.selectedTests, testId];
        return { ...item, selectedTests: newTests };
      }
      return item;
    }));
  };

  const addCustomTest = (itemId: string) => {
    if (!customParamName.trim()) return;
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, customTests: [...item.customTests, customParamName.trim()] };
      }
      return item;
    }));
    setCustomParamName("");
  };

  const removeCustomTest = (itemId: string, testName: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, customTests: item.customTests.filter(t => t !== testName) };
      }
      return item;
    }));
  };

  const handleNext = () => {
    if (step === 3) {
      setStep(4);
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0 && step < 4) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in font-inter">
      {/* ===== STEP INDICATOR ===== */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-4 sm:py-6 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 sm:gap-4 min-w-max">
              {wizardSteps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                      i === step 
                        ? "bg-primary/5 text-primary" 
                        : i < step 
                          ? "text-litmus-teal" 
                          : "text-slate-400"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all",
                      i === step 
                        ? "bg-primary text-white" 
                        : i < step 
                          ? "bg-litmus-teal text-white" 
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                    )}>
                      {i < step ? <CheckCircle2Icon className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-xs sm:text-sm font-semibold whitespace-nowrap",
                      i === step ? "text-slate-900" : "text-slate-500"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < wizardSteps.length - 1 && (
                    <div className="mx-1 sm:mx-2">
                      <ChevronRightIcon className={cn(
                        "h-3 w-3",
                        i < step ? "text-litmus-teal" : "text-slate-300"
                      )} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          <div className={cn(
            "space-y-6 transition-all duration-500",
            step === 4 ? "lg:col-span-12 max-w-4xl mx-auto w-full" : "lg:col-span-8"
          )}>
            
            {/* STEP 0: Review Tests */}
            {step === 0 && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900">Review Selected Tests</h1>
                  <p className="text-slate-500 text-sm font-medium">Verify or edit the parameters for your selected food products.</p>
                </div>

                {items.length === 0 ? (
                  <Card className="rounded-lg border-dashed border-2 border-slate-200 bg-white/50 p-12 text-center">
                    <div className="bg-slate-100 h-20 w-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ClipboardListIcon className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Your selection is empty</h3>
                    <p className="text-slate-50 mt-2 max-w-xs mx-auto">Looks like you haven't added any tests yet.</p>
                    <Button asChild className="mt-6 bg-primary hover:bg-primary-deep rounded-lg px-8 h-12 font-bold">
                      <Link to="/tests">Browse All Tests</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <Card key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-accent/30 transition-all duration-300 shadow-sm">
                        <CardContent className="p-0">
                          <div className="flex flex-col">
                            <div className="p-5 space-y-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <Badge className="bg-flame-amber-tint text-accent border-0 mb-1 font-bold uppercase tracking-wider text-[10px]">
                                    {item.category}
                                  </Badge>
                                  <h3 className="font-bold text-lg text-slate-900">{item.product} Test Panel</h3>
                                  <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5"><InfoIcon className="h-4 w-4 text-litmus-teal" /> {item.selectedTests.length + item.customTests.length} parameters</span>
                                    <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-primary" /> 3-5 Days TAT</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                                    className={cn("rounded-lg border-slate-200 h-9 gap-2", editingItemId === item.id && "bg-slate-100 border-primary text-primary")}
                                  >
                                    <EditIcon className="h-4 w-4" /> 
                                    {editingItemId === item.id ? "Done" : "Edit Parameters"}
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg h-9 w-9">
                                    <TrashIcon className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>

                              {/* Editing Section */}
                              {editingItemId === item.id && (
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-700">Customize Test Parameters</p>
                                    <span className="text-xs text-slate-400">₹{item.basePrice} per test</span>
                                  </div>

                                  {/* Standard Tests Grid */}
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    {allTestsData.map((test) => (
                                      <div 
                                        key={test.id} 
                                        onClick={() => toggleTest(item.id, test.id)}
                                        className={cn(
                                          "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                                          item.selectedTests.includes(test.id) 
                                            ? "border-primary bg-primary/5 shadow-sm" 
                                            : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                                        )}
                                      >
                                        <Checkbox checked={item.selectedTests.includes(test.id)} />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-slate-900 truncate">{test.name}</p>
                                          <p className="text-[10px] text-slate-400 uppercase font-bold">{test.type}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Custom Parameter Input */}
                                  <div className="pt-2">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Add Custom Parameter</Label>
                                    <div className="flex gap-2">
                                      <Input 
                                        placeholder="Enter parameter name..." 
                                        value={customParamName}
                                        onChange={(e) => setCustomParamName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addCustomTest(item.id)}
                                        className="h-10 rounded-lg bg-white border-slate-200"
                                      />
                                      <Button 
                                        onClick={() => addCustomTest(item.id)}
                                        className="rounded-lg h-10 px-4 bg-slate-900 text-white hover:bg-black"
                                      >
                                        <PlusIcon className="h-4 w-4 mr-2" /> Add
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Custom Tests List */}
                                  {item.customTests.length > 0 && (
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Custom Added</Label>
                                      <div className="flex flex-wrap gap-2">
                                        {item.customTests.map((ct) => (
                                          <Badge key={ct} className="bg-primary/5 text-primary border border-primary/20 rounded-md py-1 px-2 gap-2 font-medium">
                                            {ct}
                                            <button onClick={() => removeCustomTest(item.id, ct)} className="hover:text-red-500 transition-colors">
                                              <TrashIcon className="h-3 w-3" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {!editingItemId && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.selectedTests.map(tid => {
                                    const test = allTestsData.find(t => t.id === tid);
                                    return (
                                      <Badge key={tid} variant="secondary" className="bg-slate-100 text-slate-600 border-0 rounded-md font-medium text-xs px-2 py-0.5">
                                        {test?.name}
                                      </Badge>
                                    );
                                  })}
                                  {item.customTests.map(ct => (
                                    <Badge key={ct} variant="secondary" className="bg-primary/5 text-primary border-primary/20 border rounded-md font-medium text-xs px-2 py-0.5">
                                      {ct}
                                    </Badge>
                                  ))}
                                  <button onClick={() => setEditingItemId(item.id)} className="inline-flex items-center text-xs font-bold text-primary hover:underline gap-1 ml-1">
                                    <PlusIcon className="h-3 w-3" /> Add More
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <div className="bg-slate-50 border-t border-slate-100 px-5 py-4 flex items-center justify-between">
                               <div className="flex items-baseline gap-2">
                                  <p className="font-bold text-slate-900 text-xl">₹{calculateItemPrice(item).toLocaleString()}</p>
                                  <span className="text-xs text-slate-400 line-through">₹{calculateItemMrp(item).toLocaleString()}</span>
                               </div>
                               <Badge className="bg-litmus-mint/30 text-litmus-teal border-0 font-bold text-[10px] uppercase">
                                 {Math.round(((calculateItemMrp(item) - calculateItemPrice(item)) / calculateItemMrp(item)) * 100)}% Discount Applied
                               </Badge>
                            </div>
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
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900">Choose Fulfilment Partner</h1>
                  <p className="text-slate-500 text-sm font-medium">Select an accredited laboratory or let Litmus experts decide.</p>
                </div>
                <div className="grid gap-4">
                  <Card onClick={() => setSelectedLab("admin")} className={cn("cursor-pointer transition-all border rounded-lg relative overflow-hidden group shadow-sm", selectedLab === "admin" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50")}>
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">Recommended</div>
                    <CardContent className="p-6 flex items-start gap-6">
                       <div className={cn("h-14 w-14 rounded-lg flex items-center justify-center shrink-0", selectedLab === "admin" ? "bg-primary text-white" : "bg-slate-100 text-primary")}>
                         <ShieldIcon className="h-7 w-7" />
                       </div>
                       <div className="space-y-1">
                         <h3 className="font-bold text-lg text-slate-900">Litmus Smart Allocation</h3>
                         <p className="text-sm text-slate-500 leading-relaxed font-medium">Our senior analysts will route samples to the most optimal labs based on current TAT and specialization.</p>
                       </div>
                    </CardContent>
                  </Card>
                  {laboratories.slice(0, 3).map((lab) => (
                    <Card key={lab.id} onClick={() => setSelectedLab(lab.id)} className={cn("cursor-pointer transition-all rounded-lg border group shadow-sm", selectedLab === lab.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 hover:bg-white")}>
                      <CardContent className="p-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                        <div className="flex gap-4 items-center">
                           <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold", selectedLab === lab.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>{lab.name.charAt(0)}</div>
                           <div className="space-y-0.5">
                             <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">{lab.name}</h3>
                             <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight"><span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3"/> {lab.city}</span><span className="flex items-center gap-1"><ClockIcon className="h-3 w-3"/> 24-48 hrs</span></div>
                           </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base Fee</p>
                           <p className="font-bold text-slate-900 text-xl">₹{lab.priceFrom}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Collection Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900">Collection Details</h1>
                  <p className="text-slate-500 text-sm font-medium">Where should we collect the samples from?</p>
                </div>
                
                <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                   <CardContent className="p-6 space-y-6">
                      {/* Personal Info */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
                          <UserIcon className="h-4 w-4 text-primary" /> Contact Information
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</Label>
                            <Input name="name" value={formData.name} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</Label>
                            <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div className="sm:col-span-2 space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</Label>
                            <Input name="email" value={formData.email} onChange={handleInputChange} type="email" className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Address Info */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
                          <HomeIcon className="h-4 w-4 text-primary" /> Pickup Address
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2 space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Complete Address</Label>
                            <Input name="address" value={formData.address} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City</Label>
                            <Input name="city" value={formData.city} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pincode</Label>
                            <Input name="pincode" value={formData.pincode} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Scheduling */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
                          <CalendarIcon className="h-4 w-4 text-primary" /> Preferred Schedule
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Date</Label>
                            <Input name="pickupDate" type="date" value={formData.pickupDate} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Time</Label>
                            <Input name="pickupTime" type="time" value={formData.pickupTime} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 3: Payment Details */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
                  <p className="text-slate-500 text-sm font-medium">Your transaction is encrypted and secured.</p>
                </div>
                <Card className="rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white">
                   <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center"><h4 className="font-bold text-slate-900 text-sm uppercase">Order Summary</h4><Badge className="bg-primary/10 text-primary border-0 font-bold">{items.length} Products</Badge></div>
                   <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                         {items.map((item) => (
                            <div key={item.id} className="px-5 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                               <div><p className="font-bold text-slate-900">{item.product} Panel</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.selectedTests.length} Critical Parameters</p></div>
                               <p className="font-bold text-slate-900">₹{calculateItemPrice(item).toLocaleString()}</p>
                            </div>
                         ))}
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-200">
                         <div className="flex items-start gap-4"><div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><LockIcon className="h-5 w-5" /></div><div className="space-y-1"><p className="text-sm font-bold text-slate-900">Encrypted Transaction</p><p className="text-xs text-slate-500 font-medium leading-relaxed">We use industry-standard 256-bit SSL encryption. We do not store your full card details.</p></div></div>
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 4: Status / Confirmation */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-8 py-4">
                 <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-lg bg-litmus-mint/30 text-litmus-teal mb-2 relative"><div className="absolute inset-0 rounded-lg animate-ping bg-litmus-teal/20"></div><CheckCircle2Icon className="h-10 w-10 relative z-10" /></div>
                    <div className="space-y-1"><h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1><p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">Thank you for choosing Litmus Food Analytics. Your order <span className="text-slate-900 font-bold">{orderId}</span> has been received.</p></div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"><div className="bg-slate-900 p-4 text-white flex justify-between items-center"><span className="font-bold text-[10px] uppercase tracking-widest opacity-80">Order Details</span><Badge className="bg-white/20 text-white border-0 font-bold text-[10px]">Confirmed</Badge></div><CardContent className="p-5 space-y-5"><div className="grid grid-cols-2 gap-6"><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p><p className="font-bold text-slate-900 text-base">{orderId}</p></div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p><p className="font-bold text-slate-900 text-sm">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div></div><div className="pt-4 border-t border-slate-100"><h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide"><BuildingIcon className="h-4 w-4 text-primary" /> Fulfilment Partner</h4><div className="bg-slate-50 rounded-lg p-4 border border-slate-100">{selectedLab === "admin" ? <div className="space-y-1"><p className="font-bold text-slate-900 text-sm">Litmus Smart Allocation</p><p className="text-[11px] text-slate-600 font-medium leading-relaxed">Our team will assign the best lab within 2 hours.</p></div> : <div className="space-y-1"><p className="font-bold text-slate-900 text-sm">{laboratories.find(l => l.id === selectedLab)?.name}</p><p className="text-[11px] text-slate-600 font-medium">Lab has been notified.</p></div>}</div></div></CardContent></Card>
                    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden h-fit"><div className="bg-slate-50 border-b border-slate-200 p-4"><h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Final Billing</h4></div><CardContent className="p-0"><div className="divide-y divide-slate-100 p-5 space-y-3">{items.map((item) => (<div key={item.id} className="flex justify-between items-start"><div><p className="font-bold text-slate-900 text-sm">{item.product} Panel</p><p className="text-[10px] font-bold text-slate-400 uppercase">{item.selectedTests.length} Tests</p></div><p className="font-bold text-slate-900 text-sm">₹{calculateItemPrice(item).toLocaleString()}</p></div>))}</div><div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2"><div className="flex justify-between text-xs font-medium"><span className="text-slate-500">Subtotal</span><span className="text-slate-900">₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-xs font-medium"><span className="text-slate-500">GST (18%)</span><span className="text-slate-900">₹{gst.toLocaleString()}</span></div><div className="flex justify-between border-t border-slate-200 pt-3 mt-1"><span className="font-bold text-slate-900">Total Paid</span><span className="font-bold text-primary text-xl tracking-tight">₹{total.toLocaleString()}</span></div></div></CardContent></Card>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4 justify-center py-6">
                    <Button onClick={() => navigate("/orders")} className="w-full sm:w-auto h-12 px-10 rounded-lg bg-primary hover:bg-primary-deep text-white font-bold">Track My Order</Button>
                    <Button variant="outline" onClick={() => navigate("/home")} className="w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-slate-600 border-slate-200 hover:bg-slate-50">Return to Home</Button>
                 </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR: ORDER SUMMARY (Hidden on Step 4) ===== */}
          {step < 4 && (
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-4">
                <Card className="rounded-lg shadow-sm border border-slate-100 overflow-hidden bg-white">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 text-xl tracking-tight">Order Summary</h3><Badge className="bg-slate-100 text-slate-600 border-0 font-bold px-3 py-1">{items.length} Products</Badge></div>
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wide"><span className="text-slate-400">Total MRP</span><span className="text-slate-800">₹{totalMrp.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wide"><span className="text-litmus-teal">Litmus Discount</span><span className="text-litmus-teal">- ₹{discount.toLocaleString()}</span></div>
                      {step >= 3 && (<div className="flex justify-between text-xs font-bold uppercase tracking-wide pt-2 border-t border-dashed border-slate-200"><span className="text-slate-400">GST (18%)</span><span className="text-slate-800">+ ₹{gst.toLocaleString()}</span></div>)}
                      <div className="pt-4 mt-1 flex flex-col gap-0.5"><div className="flex justify-between items-baseline"><span className="text-slate-900 font-bold text-lg">Total Amount</span><span className="text-2xl font-bold text-primary tracking-tight">₹{step >= 3 ? total.toLocaleString() : subtotal.toLocaleString()}</span></div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Inc. of all taxes</p></div>
                    </div>
                    <div className="pt-3 space-y-2">
                       {step === 0 && (<Button disabled={items.length === 0} onClick={handleNext} className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all">Select Lab Partner <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Button>)}
                       {step === 1 && (<Button disabled={!selectedLab} onClick={handleNext} className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all">Enter Collection Details <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Button>)}
                       {step === 2 && (<Button onClick={handleNext} className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all">Proceed to Payment <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Button>)}
                       {step === 3 && (<Button onClick={handleNext} className="w-full bg-slate-900 hover:bg-black text-white rounded-lg h-14 font-bold text-base transition-all">Pay ₹{total.toLocaleString()} Securely</Button>)}
                       {step > 0 && (<Button variant="ghost" onClick={handleBack} className="w-full h-10 rounded-lg text-slate-400 hover:text-slate-800 font-bold text-sm"><ChevronLeftIcon className="mr-1 h-4 w-4" /> Back</Button>)}
                    </div>
                  </CardContent>
                </Card>
                <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-lg bg-litmus-mint/30 text-litmus-teal flex items-center justify-center shrink-0"><ShieldIcon className="h-5 w-5" /></div><div><p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Litmus Protected</p><p className="text-[10px] text-slate-500 font-semibold uppercase">100% Secure Checkout</p></div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
