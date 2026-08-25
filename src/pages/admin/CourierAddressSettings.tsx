import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Clock, Loader2, Save, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { settingsApi, ICourierAddress } from "@/lib/api/settings";

const defaultAddress: ICourierAddress = {
  facilityName: "Litmus Sample Central Intake & Diagnostics Hub",
  attention: "Sample Logistics & Ingestion Desk",
  street: "Tower B, Innovation Corridor, Old Mahabalipuram Road (OMR)",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600097",
  phone: "+91 98765 43210",
  email: "samples@litmustest.com",
  workingHours: "Mon – Sat · 08:00 AM – 08:00 PM IST",
};

export function CourierAddressSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ICourierAddress>(defaultAddress);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["adminPlatformSettings"],
    queryFn: settingsApi.getSettings,
  });

  useEffect(() => {
    if (settingsData?.data?.courierAddress) {
      setFormData({
        facilityName: settingsData.data.courierAddress.facilityName || defaultAddress.facilityName,
        attention: settingsData.data.courierAddress.attention || defaultAddress.attention,
        street: settingsData.data.courierAddress.street || defaultAddress.street,
        city: settingsData.data.courierAddress.city || defaultAddress.city,
        state: settingsData.data.courierAddress.state || defaultAddress.state,
        pincode: settingsData.data.courierAddress.pincode || defaultAddress.pincode,
        phone: settingsData.data.courierAddress.phone || defaultAddress.phone,
        email: settingsData.data.courierAddress.email || defaultAddress.email,
        workingHours: settingsData.data.courierAddress.workingHours || defaultAddress.workingHours,
      });
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: (courierAddress: ICourierAddress) => settingsApi.updateSettings({ courierAddress }),
    onSuccess: () => {
      toast.success("Litmus courier intake address updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update courier address");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.facilityName || !formData.street || !formData.city || !formData.pincode) {
      toast.error("Please fill in all mandatory address fields (Facility, Street, City, Pincode)");
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData(defaultAddress);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading courier settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Litmus Central Courier & Dispatch Hub
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure the common sample intake address displayed to customers during checkout and order tracking when shipping via courier.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={updateMutation.isPending}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shadow-sm"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Address
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Facility & Location Details</CardTitle>
              <CardDescription>Official physical destination for receiving parcels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="facilityName" className="text-xs font-semibold">
                  Facility / Hub Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="facilityName"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleChange}
                  placeholder="e.g. Litmus Sample Central Intake & Diagnostics Hub"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="attention" className="text-xs font-semibold">
                  Attention / Department Desk <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="attention"
                  name="attention"
                  value={formData.attention}
                  onChange={handleChange}
                  placeholder="e.g. Sample Logistics & Ingestion Desk"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="street" className="text-xs font-semibold">
                  Street Address / Building <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. Tower B, Innovation Corridor, Old Mahabalipuram Road (OMR)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Chennai"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Tamil Nadu"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pincode" className="text-xs font-semibold">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="600097"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Helpline & Operating Hours</CardTitle>
              <CardDescription>Contact info printed on shipping instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Facility Helpline Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Logistics Desk Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="samples@litmustest.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="workingHours" className="text-xs font-semibold">
                  Receiving / Intake Hours
                </Label>
                <Input
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  placeholder="Mon – Sat · 08:00 AM – 08:00 PM IST"
                />
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Live Customer Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-foreground">Live Customer Portal Preview</h4>
          </div>

          <div className="rounded-xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    Litmus Sample Dispatch Address
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Courier Destination
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-md"
              >
                Copy Address
              </button>
            </div>

            <div className="space-y-2 text-xs bg-white/90 p-3 rounded-lg border border-emerald-100/80 shadow-2xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                {formData.facilityName || "Litmus Sample Central Intake Hub"}
              </p>
              <p className="text-slate-800 font-semibold pl-5 text-[11px]">
                Attn: {formData.attention || "Sample Logistics Desk"}
              </p>
              <p className="text-slate-600 leading-relaxed pl-5 text-[11px]">
                {formData.street || "Innovation Corridor, OMR"}
              </p>
              <p className="font-bold text-slate-900 pl-5 text-[11px]">
                {formData.city || "Chennai"}, {formData.state || "Tamil Nadu"} —{" "}
                <span className="text-emerald-700">{formData.pincode || "600097"}</span>
              </p>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 bg-white/90 p-3 rounded-lg border border-emerald-100/80">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Phone: <strong className="text-slate-900">{formData.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Email: <strong className="text-slate-900">{formData.email}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Intake: <span className="font-medium text-slate-800">{formData.workingHours}</span></span>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/80 border border-amber-200/70 p-2.5 text-[11px] text-amber-900">
              <p className="font-bold flex items-center gap-1 text-amber-950">
                <ShieldAlert className="h-3 w-3 text-amber-600 shrink-0" />
                Packaging Reminder:
              </p>
              <p className="mt-0.5 text-amber-800 leading-normal">
                Customers will be instructed to label their package with their Order ID and provide the AWB tracking code after shipment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
