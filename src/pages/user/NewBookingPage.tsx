import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  Plus as PlusIcon,
  ListChecks as ListChecksIcon,
  Loader2,
} from "lucide-react";
import { laboratories, tests as allTestsData } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { testApi } from "@/lib/api/test";
import { packageApi } from "@/lib/api/package";
import { labApi } from "@/lib/api/lab";
import { bookingApi } from "@/lib/api/booking";
import { authApi } from "@/lib/api/auth";

type SampleDetail = {
  id: string;
  productName: string;
  quantity: string;
  batchNumber: string;
  sku: string;
  specifics: string;
  selectedParameters: string[];
};

type CartLine = {
  id: string;
  product: string;
  category: string;
  samples: SampleDetail[];
  basePrice: number;
  fixedPrice?: number;
  availableParameters?: any[];
  testObj?: any;
};

const wizardSteps = [
  { icon: ClipboardListIcon, label: "Review Tests" },
  { icon: ListChecksIcon, label: "Samples & scope" },
  { icon: BuildingIcon, label: "Select Lab" },
  { icon: HomeIcon, label: "Collection" },
  { icon: CreditCardIcon, label: "Payment" },
  { icon: CheckCircleIcon, label: "Status" },
];


export default function NewBookingPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CartLine[]>([]);
  
  const [dataLoaded, setDataLoaded] = useState(false);

  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  const testParams = searchParams.get("params")?.split(",") || [];
  const packageId = searchParams.get("packageId");

  const { data: testResponse, isLoading: isTestLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => testApi.getTestById(testId!),
    enabled: !!testId,
  });

  const { data: packageResponse, isLoading: isPackageLoading } = useQuery({
    queryKey: ["package", packageId],
    queryFn: () => packageApi.getPackage(packageId!),
    enabled: !!packageId,
  });

  const { data: cartResponse, isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: !testId && !packageId,
  });

  // Fetch laboratories from the API
  const { data: labsResponse, isLoading: isLabsLoading } = useQuery({
    queryKey: ["publicLabs"],
    queryFn: () => labApi.getLabsPublic(),
  });

  // Filter laboratories that have the selected tests
  const eligibleLabs = useMemo(() => {
    if (!labsResponse?.data) return [];
    
    // Extract test IDs from cart items (ignoring packages for strict test matching for now)
    const requiredTestIds = items.map(item => item.id);
    
    if (requiredTestIds.length === 0) return labsResponse.data;

    return labsResponse.data.filter((lab: any) => {
      // lab.tests is an array of populated Test objects or ObjectIds
      const labTestIds = lab.tests?.map((t: any) => t._id || t) || [];
      // Check if lab has ALL the tests present in the cart
      return requiredTestIds.every(testId => labTestIds.includes(testId));
    });
  }, [labsResponse?.data, items]);

  // Calculate the total price for a specific lab
  const getLabPrice = (lab: any) => {
    let labTotal = 0;
    
    items.forEach(item => {
      const specificTestPricing = lab.pricing?.[item.id];

      item.samples.forEach(sample => {
        let samplePrice = 0;
        
        sample.selectedParameters.forEach(paramName => {
          // Find the default platform price for this parameter
          const platformParam = item.availableParameters?.find(p => p.name === paramName);
          const platformPrice = platformParam ? (Number(platformParam.price) || 0) : 0;
          
          // If the lab has a specific price for this parameter, use it. Otherwise use platform price.
          if (specificTestPricing && typeof specificTestPricing === 'object' && specificTestPricing[paramName] !== undefined) {
            samplePrice += specificTestPricing[paramName];
          } else {
            samplePrice += platformPrice;
          }
        });
        
        // Add sample price, but if it's 0 (meaning no parameter-level pricing available), fall back to base test price
        if (samplePrice === 0) {
           // Fallback to test's platform price or generic lab specific test price
           if (typeof specificTestPricing === 'number') {
             samplePrice = specificTestPricing; // Old format fallback
           } else {
             samplePrice = item.testObj?.price || 0;
           }
        }

        labTotal += samplePrice;
      });
      
      // Calculate discount for this item just like platform does, to keep it consistent
      // let discount = 0;
      if (item.testObj?.discountType === 'PERCENTAGE') {
         // This is a bit tricky, the discount is usually applied on the total platform amount, not lab amount.
         // Actually, let's keep it simple: the lab charges base fees, any platform discounts are platform's problem.
         // But the user requested "otherwise show platform amount", so if no lab pricing, it should match platform.
      }
    });

    return labTotal;
  };

  useEffect(() => {
    if (dataLoaded) return;

    if (testId && testResponse?.data) {
      const test = testResponse.data;
      
      setItems(prevItems => {
        if (prevItems.length > 0 && prevItems[0].id === test._id) {
          const updatedItems = [...prevItems];
          updatedItems[0].testObj = test;
          updatedItems[0].availableParameters = test.metadata?.parameters || [];
          return updatedItems;
        }

        const testParamsMetadata = test.metadata?.parameters || [];
        
        const initialSample: SampleDetail = {
          id: Math.random().toString(36).substr(2, 9),
          productName: test.testName,
          quantity: "",
          batchNumber: "",
          sku: "",
          specifics: "",
          selectedParameters: testParams.length > 0 ? testParams : testParamsMetadata.map((p: any) => p.name),
        };

        return [{
          id: test._id,
          product: test.testName,
          category: 'Test Panel',
          samples: [initialSample],
          basePrice: 500,
          fixedPrice: 0,
          availableParameters: testParamsMetadata,
          testObj: test,
        }];
      });
      setDataLoaded(true);
      return;
    }

    if (packageId && packageResponse?.data) {
      const pkg = packageResponse.data;
      const pkgTests = pkg.tests?.map((t: any) => t.testName);
      const pkgFeats = pkg.features?.map((f: string) => f);
      const testIds = (pkgTests?.length ? pkgTests : pkgFeats) || ["General Evaluation"];
      const availableParameters = testIds.map((tid: string) => ({ name: tid, price: 0 }));

      const initialSample: SampleDetail = {
        id: Math.random().toString(36).substr(2, 9),
        productName: pkg.name,
        quantity: "",
        batchNumber: "",
        sku: "",
        specifics: "",
        selectedParameters: testIds,
      };

      setItems([{
        id: pkg._id,
        product: pkg.name,
        category: pkg.category,
        samples: [initialSample],
        basePrice: 500,
        fixedPrice: pkg.price || 0,
        availableParameters,
        testObj: pkg,
      }]);
      setDataLoaded(true);
      return;
    }

    if (!testId && !packageId && cartResponse?.data?.items && !isCartLoading) {
      const serverItems = cartResponse.data.items.map((cartItem: any) => {
        const isTest = cartItem.itemType === 'TEST';
        const isPkg = cartItem.itemType === 'PACKAGE';
        const name = isTest ? cartItem.testId?.testName : cartItem.packageId?.name;
        
        let testIds: string[] = [];
        let basePrice = cartItem.price;

        if (isTest && cartItem.parameters?.length) {
          testIds = cartItem.parameters;
          basePrice = Math.round(cartItem.price / (cartItem.parameters.length || 1));
        } else if (isPkg) {
          const pkgTests = cartItem.packageId?.tests?.map((t: any) => t.testName);
          const pkgFeats = cartItem.packageId?.features?.map((f: string) => f);
          testIds = (pkgTests?.length ? pkgTests : pkgFeats) || ["General Evaluation"];
          basePrice = Math.round(cartItem.price / (testIds.length || 1));
        } else {
          testIds = ["General"];
        }

        const availableParameters = isTest 
          ? cartItem.testId?.metadata?.parameters || []
          : testIds.map((tid: string) => ({ name: tid, price: 0 }));

        const initialSample: SampleDetail = {
          id: Math.random().toString(36).substr(2, 9),
          productName: name || "",
          quantity: "",
          batchNumber: "",
          sku: "",
          specifics: "",
          selectedParameters: isTest && cartItem.parameters?.length ? cartItem.parameters : testIds,
        };

        return {
          id: cartItem._id,
          product: name || "Unknown Item",
          category: isTest ? 'Test Panel' : 'Package Panel',
          samples: [initialSample],
          basePrice: 500,
          fixedPrice: cartItem.price,
          availableParameters,
          testObj: isTest ? cartItem.testId : cartItem.packageId,
        };
      });
      setItems(serverItems);
      setDataLoaded(true);
    }
  }, [cartResponse, isCartLoading, dataLoaded, testId, packageId, testResponse, packageResponse]);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [customParamName, setCustomParamName] = useState("");
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [orderId, setOrderId] = useState(() => `#LTMS-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Calculate tomorrow's date for the date picker minimum value
  const minDateString = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const { data: userResponse } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pickupDate: "",
    pickupTime: ""
  });

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: prev.email || u.email || "",
        phone: prev.phone || u.phone || "",
        // Optionally pre-populate address if the user has one
        address: prev.address || (u.address?.street ? u.address.street : ""),
        city: prev.city || (u.address?.city ? u.address.city : ""),
        state: prev.state || (u.address?.state ? u.address.state : ""),
        pincode: prev.pincode || (u.address?.pincode ? u.address.pincode : "")
      }));
    }
  }, [userResponse]);
  const navigate = useNavigate();

  const selectedLabProfile = useMemo(() => {
    if (selectedLab === 'admin' || !selectedLab) return null;
    return eligibleLabs?.find((l: any) => l._id === selectedLab);
  }, [selectedLab, eligibleLabs]);

  const { data: availabilityResponse, isLoading: isAvailabilityLoading } = useQuery({
    queryKey: ['labAvailability', selectedLab, formData.pickupDate],
    queryFn: () => labApi.getLabAvailability(selectedLab!, formData.pickupDate),
    enabled: !!selectedLab && selectedLab !== 'admin' && !!formData.pickupDate,
    retry: false,
  });

  const dateError = useMemo(() => {
    if (!formData.pickupDate || !selectedLabProfile) return null;
    const dateObj = new Date(formData.pickupDate);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
    const availability = selectedLabProfile.availability;
    if (availability) {
      if (availability.workingDays && !availability.workingDays.includes(dayName)) {
        return `This lab is closed on ${dayName}s. Please select another day.`;
      }
      if (availability.blockedDates) {
        const blocked = availability.blockedDates.find((b: any) => b.date === formData.pickupDate);
        if (blocked) {
          return `This lab is closed on this date (${blocked.name}). Please select another date.`;
        }
      }
    }
    
    if (availabilityResponse?.data && !availabilityResponse.data.isAvailable) {
      return `This lab is fully booked on this date. Please select another date.`;
    }

    return null;
  }, [formData.pickupDate, selectedLabProfile, availabilityResponse]);

  const timeError = useMemo(() => {
    if (!formData.pickupTime || !selectedLabProfile || !selectedLabProfile.availability?.startTime || !selectedLabProfile.availability?.endTime) return null;
    
    const [time, period] = formData.pickupTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const selectedTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const startTime = selectedLabProfile.availability.startTime;
    const endTime = selectedLabProfile.availability.endTime;
    
    if (selectedTimeStr < startTime || selectedTimeStr > endTime) {
      return `Please select a time within the lab's working hours (${startTime} - ${endTime}).`;
    }
    
    return null;
  }, [formData.pickupTime, selectedLabProfile]);

  const isStep3Valid = formData.name && formData.phone && formData.address && formData.city && formData.pincode && formData.pickupDate && formData.pickupTime && !dateError && !timeError && !isAvailabilityLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const calculateItemPrice = (item: CartLine) => {
    if (item.testObj && item.availableParameters && item.availableParameters.length > 0 && item.category === 'Test Panel') {
      let totalBase = 0;
      item.samples.forEach(sample => {
        const samplePrice = item.availableParameters!.reduce((sum: number, p: any) => 
          sample.selectedParameters.includes(p.name) ? sum + (Number(p.price) || 0) : sum, 0);
        totalBase += samplePrice > 0 ? samplePrice : (item.testObj.price || 0);
      });
      
      let discount = 0;
      if (item.testObj.discountType === 'PERCENTAGE') {
        discount = totalBase * ((item.testObj.discountValue || 0) / 100);
      } else if (item.testObj.discountType === 'FLAT') {
        discount = item.testObj.discountValue || 0;
      }
      return Math.max(0, totalBase - discount);
    }
    return (item.fixedPrice ?? 0) * item.samples.length;
  };

  const calculateItemMrp = (item: CartLine) => {
    if (item.testObj && item.availableParameters && item.availableParameters.length > 0 && item.category === 'Test Panel') {
      let totalBase = 0;
      item.samples.forEach(sample => {
        const samplePrice = item.availableParameters!.reduce((sum: number, p: any) => 
          sample.selectedParameters.includes(p.name) ? sum + (Number(p.price) || 0) : sum, 0);
        totalBase += samplePrice > 0 ? samplePrice : (item.testObj.price || 0);
      });
      return totalBase;
    }
    if (item.testObj && item.testObj.mrp) {
      return item.testObj.mrp * item.samples.length;
    }
    return (item.fixedPrice ?? 0) * 1.75 * item.samples.length;
  };

  const subtotal = items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
  const totalMrp = items.reduce((acc, item) => acc + calculateItemMrp(item), 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const canProceedSampleDetails =
    items.length > 0 &&
    items.some((item) => {
      return item.samples.some((sample) => {
        return sample.productName.trim().length > 0 && sample.selectedParameters.length > 0;
      });
    });

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const addSample = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const defaultParams = item.availableParameters?.map(p => p.name) || [];
      const newSample: SampleDetail = {
        id: Math.random().toString(36).substr(2, 9),
        productName: "",
        quantity: "",
        batchNumber: "",
        sku: "",
        specifics: "",
        selectedParameters: defaultParams
      };
      return { ...item, samples: [...item.samples, newSample] };
    }));
  };

  const removeSample = (itemId: string, sampleId: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, samples: item.samples.filter(s => s.id !== sampleId) };
    }));
  };

  const toggleTestForSample = (itemId: string, sampleId: string, paramName: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const newSamples = item.samples.map(sample => {
        if (sample.id !== sampleId) return sample;
        const isSelected = sample.selectedParameters.includes(paramName);
        const newParams = isSelected 
          ? sample.selectedParameters.filter(p => p !== paramName)
          : [...sample.selectedParameters, paramName];
        return { ...sample, selectedParameters: newParams };
      });
      return { ...item, samples: newSamples };
    }));
  };

  const updateSampleField = (itemId: string, sampleId: string, field: keyof SampleDetail, value: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const newSamples = item.samples.map(sample => {
        if (sample.id !== sampleId) return sample;
        return { ...sample, [field]: value };
      });
      return { ...item, samples: newSamples };
    }));
  };

  const { mutate: createBooking, isPending: isCreatingBooking } = useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: async (res) => {
      setOrderId(res.data._id || `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setStep(5);
      try {
        await cartApi.clearCart();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } catch (e) {
        console.error("Failed to clear cart:", e);
      }
    },
    onError: (err: any) => {
      console.error("Failed to create booking:", err);
      alert(err.response?.data?.message || "Failed to create booking. Please try again.");
    }
  });

  const handleNext = () => {
    if (step === 4) {
      const payload = {
        labId: selectedLab,
        items: items.map(item => ({
          itemType: item.category === 'Test Panel' ? 'TEST' : 'PACKAGE',
          testId: item.category === 'Test Panel' ? (item.testObj?._id || item.id) : undefined,
          packageId: item.category !== 'Test Panel' ? (item.testObj?._id || item.id) : undefined,
          price: calculateItemPrice(item),
          mrp: calculateItemMrp(item),
          samples: item.samples.map(s => ({
            productName: s.productName,
            quantity: s.quantity,
            batchNumber: s.batchNumber,
            sku: s.sku,
            specifics: s.specifics,
            selectedParameters: item.category === 'Test Panel' ? s.selectedParameters : undefined,
            selectedTests: item.category !== 'Test Panel' ? s.selectedParameters : undefined
          }))
        })),
        bookingDate: new Date(),
        totalAmount: total,
        metadata: {
          collectionDetails: formData,
          paymentMethod: 'ONLINE_DIRECT'
        }
      };
      createBooking(payload as any);
    }
    else if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < 5) setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in font-inter">
      {/* ===== STEP INDICATOR ===== */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-start py-4 sm:py-6 overflow-x-auto scrollbar-hide">
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
            step === 5 ? "lg:col-span-12 max-w-4xl mx-auto w-full" : "lg:col-span-8"
          )}>
            
            {/* STEP 0: Review Tests */}
            {step === 0 && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900">Review Selected Tests</h1>
                  <p className="text-slate-500 text-sm font-medium">
                    Verify or edit parameters here; next you&apos;ll describe each sample and exactly what needs testing.
                  </p>
                </div>

                {!dataLoaded || isCartLoading || isTestLoading || isPackageLoading ? (
                  <Card className="rounded-lg border-2 border-slate-100 bg-white/50 p-12 text-center flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-slate-500 font-medium">Loading your selection...</p>
                  </Card>
                ) : items.length === 0 ? (
                  <Card className="rounded-lg border-dashed border-2 border-slate-200 bg-white/50 p-12 text-center">
                    <div className="bg-slate-100 h-20 w-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ClipboardListIcon className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Your selection is empty</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">Looks like you haven&apos;t added any tests yet.</p>
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
                                    <span className="flex items-center gap-1.5"><InfoIcon className="h-4 w-4 text-litmus-teal" /> {item.availableParameters?.length || 0} available parameters</span>
                                    <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-primary" /> {item.testObj?.turnAroundTime || '3-5 Days'} TAT</span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-2">Samples and testing parameters are configured in the next step.</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg h-9 w-9">
                                    <TrashIcon className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
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

            {/* STEP 1: Per-parameter sample & product specifics */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-slate-900">Samples & testing scope</h1>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
                    You may not know every catalogue SKU — that&apos;s fine. For each parameter below, spell out which real-world product or sample we should test and what you need from the lab. Specialists use this to assign the correct method before pickup.
                  </p>
                </div>

                {items.length === 0 ? (
                  <Card className="rounded-lg border-dashed border-2 border-slate-200 bg-white/50 p-10 text-center">
                    <p className="text-slate-600 text-sm mb-4">Add tests in the previous step first.</p>
                    <Button type="button" variant="outline" onClick={() => setStep(0)} className="font-bold rounded-lg">
                      Back to review
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {items.map((item) => (
                      <div key={item.id} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <div>
                            <h3 className="font-bold text-xl text-slate-900">{item.product}</h3>
                            <p className="text-sm text-slate-500 font-medium">{item.samples.length} Product{item.samples.length !== 1 ? 's' : ''} added to this Test Panel</p>
                          </div>
                        </div>

                        {item.samples.map((sample, index) => (
                          <Card key={sample.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
                            {item.samples.length > 1 && (
                              <button 
                                onClick={() => removeSample(item.id, sample.id)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors z-10"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                            <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-4">
                              <Badge className="bg-white border-slate-200 text-slate-600 mb-2 font-bold uppercase tracking-wider text-[10px]">
                                PRODUCT {index + 1}
                              </Badge>
                              
                              <p className="text-sm font-bold text-slate-700 mb-3 mt-1">
                                {item.category === 'Test Panel' ? 'Select parameters for this product:' : 'Tests included for this product:'}
                              </p>
                              
                              {/* Standard Tests Grid */}
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {item.availableParameters?.map((param) => (
                                  <div 
                                    key={param.name} 
                                    onClick={() => toggleTestForSample(item.id, sample.id, param.name)}
                                    className={cn(
                                      "flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer",
                                      sample.selectedParameters.includes(param.name) 
                                        ? "border-primary bg-primary/5 shadow-sm" 
                                        : "border-slate-100 hover:border-slate-200 bg-white"
                                    )}
                                  >
                                    <Checkbox checked={sample.selectedParameters.includes(param.name)} className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-900 truncate">{param.name}</p>
                                      <p className="text-[9px] text-slate-400 uppercase font-bold">
                                        {item.category === 'Test Panel' ? `₹${param.price}` : 'Included'}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <CardContent className="p-5 md:p-6 bg-white">
                              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1.5 md:col-span-2">
                                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Product / Sample Name / Identifier
                                  </Label>
                                  <Input
                                    value={sample.productName}
                                    onChange={(e) => updateSampleField(item.id, sample.id, 'productName', e.target.value)}
                                    placeholder="e.g., Full cream toned milk pouch 500ml"
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Quantity / Size / ML
                                  </Label>
                                  <Input
                                    value={sample.quantity}
                                    onChange={(e) => updateSampleField(item.id, sample.id, 'quantity', e.target.value)}
                                    placeholder="e.g., 500ml, 1kg, 2 pieces"
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Batch Number
                                  </Label>
                                  <Input
                                    value={sample.batchNumber}
                                    onChange={(e) => updateSampleField(item.id, sample.id, 'batchNumber', e.target.value)}
                                    placeholder="e.g., #APR-042"
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    SKU (If applicable)
                                  </Label>
                                  <Input
                                    value={sample.sku}
                                    onChange={(e) => updateSampleField(item.id, sample.id, 'sku', e.target.value)}
                                    placeholder="SKU as on invoice"
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    What exactly should we analyse on this sample?
                                  </Label>
                                  <Textarea
                                    value={sample.specifics}
                                    onChange={(e) => updateSampleField(item.id, sample.id, 'specifics', e.target.value)}
                                    placeholder="Material form (liquid / powder), packaging, suspicion (adulterant, legal limit check), regulator or customer mandate, sampling context…"
                                    className="min-h-[80px] rounded-lg border-slate-200 bg-slate-50/80 text-sm resize-y"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button 
                          onClick={() => addSample(item.id)}
                          variant="outline" 
                          className="w-full border-dashed border-2 border-slate-200 hover:border-primary hover:bg-primary/5 text-primary font-bold h-12 rounded-xl mt-2"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" /> Add Another Product for {item.product}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm flex gap-3 items-start">
                  <InfoIcon className="h-5 w-5 text-litmus-teal shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-slate-800">Not sure of the catalogue name?</span> Focus on truthful
                    labels and intent — coordinators confirm methods and quotations before pickup.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: Select Lab */}
            {step === 2 && (
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
                    {isLabsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : eligibleLabs.length === 0 ? (
                      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                         <p className="text-slate-600 font-medium">No single laboratory supports all your selected tests.</p>
                         <p className="text-sm text-slate-500 mt-1">Please select "Litmus Smart Allocation" and our team will route your samples to the optimal combination of labs.</p>
                      </div>
                    ) : (
                      eligibleLabs.map((lab: any) => (
                        <Card key={lab._id} onClick={() => setSelectedLab(lab._id)} className={cn("cursor-pointer transition-all rounded-lg border group shadow-sm", selectedLab === lab._id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 hover:bg-white")}>
                          <CardContent className="p-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                            <div className="flex gap-4 items-center">
                               <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold uppercase", selectedLab === lab._id ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>{lab.labName.charAt(0)}</div>
                               <div className="space-y-0.5">
                                 <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">{lab.labName}</h3>
                                 <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                   <span className="flex items-center gap-1"><MapPinIcon className="h-3 w-3"/> {lab.location?.city || 'India'}</span>
                                   <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3"/> {lab.availability?.turnaroundTime || '24-48 hrs'}</span>
                                 </div>
                               </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base Fee</p>
                               <p className="font-bold text-slate-900 text-xl">₹{getLabPrice(lab).toLocaleString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                </div>
              </div>
            )}

            {/* STEP 3: Collection Details */}
            {step === 3 && (
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
                        <p className="text-xs text-slate-600 font-medium bg-blue-50/50 p-3 rounded border border-blue-100">
                          <span className="font-bold text-blue-700">Note:</span> This is your preferred collection time. Our collection agent will try their best to meet this, but the actual time may vary slightly depending on agent availability.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Date</Label>
                            <Input name="pickupDate" min={minDateString} type="date" value={formData.pickupDate} onChange={handleInputChange} className={cn("h-10 bg-slate-50 border-slate-200 rounded-lg text-sm", dateError ? "border-red-500 focus-visible:ring-red-500" : "")} />
                            {isAvailabilityLoading && <p className="text-xs text-primary animate-pulse mt-1">Checking lab availability...</p>}
                            {dateError && <p className="text-xs text-red-500 font-bold mt-1">{dateError}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Time</Label>
                            <select 
                              name="pickupTime" 
                              value={formData.pickupTime} 
                              onChange={handleInputChange as any} 
                              className={cn("flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", timeError ? "border-red-500 focus-visible:ring-red-500" : "")}
                            >
                              <option value="" disabled>Select Time</option>
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                              <option value="06:00 PM">06:00 PM</option>
                            </select>
                            {timeError && <p className="text-xs text-red-500 font-bold mt-1">{timeError}</p>}
                          </div>
                        </div>
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

            {/* STEP 4: Payment Details */}
            {step === 4 && (
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
                               <div><p className="font-bold text-slate-900">{item.product} Panel</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.samples.reduce((acc, s) => acc + s.selectedParameters.length, 0)} Critical Parameters ({item.samples.length} Products)</p></div>
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

            {/* STEP 5: Status / Confirmation */}
            {step === 5 && (
              <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-8 py-4">
                 <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-lg bg-litmus-mint/30 text-litmus-teal mb-2 relative"><div className="absolute inset-0 rounded-lg animate-ping bg-litmus-teal/20"></div><CheckCircle2Icon className="h-10 w-10 relative z-10" /></div>
                    <div className="space-y-1"><h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1><p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">Thank you for choosing Litmus Food Analytics. Your order <span className="text-slate-900 font-bold font-mono">#{orderId.substring(orderId.length - 8).toUpperCase()}</span> has been received.</p></div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"><div className="bg-slate-900 p-4 text-white flex justify-between items-center"><span className="font-bold text-[10px] uppercase tracking-widest opacity-80">Order Details</span><Badge className="bg-white/20 text-white border-0 font-bold text-[10px]">Confirmed</Badge></div><CardContent className="p-5 space-y-5"><div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p><p className="font-bold text-slate-900 text-base font-mono">BKG-{orderId.substring(orderId.length - 8).toUpperCase()}</p></div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p><p className="font-bold text-slate-900 text-sm">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div></div><div className="pt-4 border-t border-slate-100"><h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide"><BuildingIcon className="h-4 w-4 text-primary" /> Fulfilment Partner</h4><div className="bg-slate-50 rounded-lg p-4 border border-slate-100">{selectedLab === "admin" ? <div className="space-y-1"><p className="font-bold text-slate-900 text-sm">Litmus Smart Allocation</p><p className="text-[11px] text-slate-600 font-medium leading-relaxed">Our team will assign the best lab within 2 hours.</p></div> : <div className="space-y-1"><p className="font-bold text-slate-900 text-sm">{eligibleLabs?.find((l: any) => l._id === selectedLab)?.labName || 'Selected Laboratory'}</p><p className="text-[11px] text-slate-600 font-medium">Lab has been notified.</p></div>}</div></div></CardContent></Card>
                    <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden h-fit"><div className="bg-slate-50 border-b border-slate-200 p-4"><h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Final Billing</h4></div><CardContent className="p-0"><div className="divide-y divide-slate-100 p-5 space-y-3">{items.map((item) => (<div key={item.id} className="flex justify-between items-start"><div><p className="font-bold text-slate-900 text-sm">{item.product} Panel</p><p className="text-[10px] font-bold text-slate-400 uppercase">{item.samples.reduce((acc, s) => acc + s.selectedParameters.length, 0)} Tests</p></div><p className="font-bold text-slate-900 text-sm">₹{calculateItemPrice(item).toLocaleString()}</p></div>))}</div><div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2"><div className="flex justify-between text-xs font-medium"><span className="text-slate-500">Subtotal</span><span className="text-slate-900">₹{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-xs font-medium"><span className="text-slate-500">GST (18%)</span><span className="text-slate-900">₹{gst.toLocaleString()}</span></div><div className="flex justify-between border-t border-slate-200 pt-3 mt-1"><span className="font-bold text-slate-900">Total Paid</span><span className="font-bold text-primary text-xl tracking-tight">₹{total.toLocaleString()}</span></div></div></CardContent></Card>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4 justify-center py-6">
                    <Button onClick={() => navigate("/orders")} className="w-full sm:w-auto h-12 px-10 rounded-lg bg-primary hover:bg-primary-deep text-white font-bold">Track My Order</Button>
                    <Button variant="outline" onClick={() => navigate("/home")} className="w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-slate-600 border-slate-200 hover:bg-slate-50">Return to Home</Button>
                 </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR: ORDER SUMMARY (Hidden on confirmation) ===== */}
          {step < 5 && (
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-4">
                <Card className="rounded-lg shadow-sm border border-slate-100 overflow-hidden bg-white">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 text-xl tracking-tight">Order Summary</h3><Badge className="bg-slate-100 text-slate-600 border-0 font-bold px-3 py-1">{items.length} Products</Badge></div>
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wide"><span className="text-slate-400">Total MRP</span><span className="text-slate-800">₹{totalMrp.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wide"><span className="text-litmus-teal">Litmus Discount</span><span className="text-litmus-teal">- ₹{discount.toLocaleString()}</span></div>
                      {step >= 4 && (<div className="flex justify-between text-xs font-bold uppercase tracking-wide pt-2 border-t border-dashed border-slate-200"><span className="text-slate-400">GST (18%)</span><span className="text-slate-800">+ ₹{gst.toLocaleString()}</span></div>)}
                      <div className="pt-4 mt-1 flex flex-col gap-0.5"><div className="flex justify-between items-baseline"><span className="text-slate-900 font-bold text-lg">Total Amount</span><span className="text-2xl font-bold text-primary tracking-tight">₹{step >= 4 ? total.toLocaleString() : subtotal.toLocaleString()}</span></div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Inc. of all taxes</p></div>
                    </div>
                    <div className="pt-3 space-y-2">
                       {step === 0 && (
                         <Button
                           disabled={
                             items.length === 0 ||
                             !items.every((item) => item.samples.length > 0)
                           }
                           onClick={handleNext}
                           className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all"
                         >
                           Describe samples &amp; scope{" "}
                           <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       )}
                       {step === 1 && (
                         <Button
                           disabled={!canProceedSampleDetails}
                           onClick={handleNext}
                           className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all"
                         >
                           Select lab partner{" "}
                           <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       )}
                       {step === 1 && !canProceedSampleDetails && items.length > 0 && (
                         <p className="text-[11px] text-center text-slate-500 px-1 leading-snug">
                           Please fill in at least one field to proceed.
                         </p>
                       )}
                       {step === 2 && (
                         <Button
                           disabled={!selectedLab}
                           onClick={handleNext}
                           className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all"
                         >
                           Enter collection details{" "}
                           <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       )}
                       {step === 3 && (
                         <Button
                           disabled={!isStep3Valid}
                           onClick={handleNext}
                           className="w-full bg-primary hover:bg-primary-deep text-white rounded-lg h-14 font-bold text-base group transition-all disabled:opacity-50"
                         >
                           Proceed to payment{" "}
                           <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                         </Button>
                       )}
                       {step === 4 && (
                         <Button
                           disabled={isCreatingBooking}
                           onClick={handleNext}
                           className="w-full bg-slate-900 hover:bg-black text-white rounded-lg h-14 font-bold text-base transition-all"
                         >
                           {isCreatingBooking ? "Processing..." : `Pay Now ₹${total.toLocaleString()}`}
                         </Button>
                       )}
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
