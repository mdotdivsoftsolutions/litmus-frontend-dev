import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, CheckCircle2, MapPin, Beaker, Receipt } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { adminApi } from "@/lib/api/admin";

const stepLabels = ["Basic Info", "Location & Media", "Tests & Pricing"];

export default function LabFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    labName: "",
    contactEmail: "",
    contactPhone: "",
    nablAccreditationNumber: "",
    isNablAccredited: false,
    isFssaiApproved: false,
    location: {
      address: "",
      city: "",
      state: "",
      lat: "",
      lng: ""
    },
    metadata: {
      images: []
    }
  });

  const { data: labData, isLoading } = useQuery({
    queryKey: ["adminLab", id],
    queryFn: () => adminApi.getLabById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (labData?.data) {
      const lab = labData.data;
      setFormData({
        labName: lab.labName || "",
        contactEmail: lab.contactEmail || "",
        contactPhone: lab.contactPhone || "",
        nablAccreditationNumber: lab.nablAccreditationNumber || "",
        isNablAccredited: lab.isNablAccredited || false,
        isFssaiApproved: lab.isFssaiApproved || false,
        location: {
          address: lab.location?.address || "",
          city: lab.location?.city || "",
          state: lab.location?.state || "",
          lat: lab.location?.lat || lab.location?.latitude || "",
          lng: lab.location?.lng || lab.location?.longitude || ""
        },
        metadata: {
          images: lab.metadata?.images || []
        }
      });
    }
  }, [labData]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => isEditing ? adminApi.updateLab(id!, data) : adminApi.createLab(data),
    onSuccess: () => {
      toast.success(isEditing ? "Laboratory updated successfully!" : "Laboratory created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
      navigate("/admin/laboratories");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save laboratory");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      location: { ...formData.location, [e.target.name]: e.target.value }
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleMockImageUpload = () => {
    const mockImage = `https://picsum.photos/seed/${Math.random()}/400/300`;
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        images: [...(formData.metadata?.images || []), mockImage]
      }
    });
    toast.success("Image uploaded!");
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.metadata.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, images: newImages }
    });
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading laboratory details...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/laboratories"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Laboratory" : "Onboard New Laboratory"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update laboratory information and settings." : "Add a new FSSAI or NABL accredited laboratory to the network."}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between mb-8 px-4">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors shadow-sm",
                i < step ? "bg-litmus-emerald text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium",
                i <= step ? "text-foreground" : "text-muted-foreground"
              )}>{label}</span>
            </div>
            {i < stepLabels.length - 1 && <div className={cn("mx-4 h-1 flex-1 rounded-full transition-colors", i < step ? "bg-litmus-emerald" : "bg-muted")} />}
          </div>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            {step === 0 && <Beaker className="h-5 w-5 text-primary" />}
            {step === 1 && <MapPin className="h-5 w-5 text-primary" />}
            {step === 2 && <Receipt className="h-5 w-5 text-primary" />}
            {stepLabels[step]}
          </CardTitle>
          <CardDescription>
            {step === 0 && "Provide the fundamental details about the laboratory."}
            {step === 1 && "Specify the exact map location and upload photos of the facility."}
            {step === 2 && "Select the tests they provide and configure base pricing."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lab Name <span className="text-destructive">*</span></Label>
                  <Input name="labName" value={formData.labName} onChange={handleChange} placeholder="e.g. Chennai Food Testing Lab" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">NABL Accreditation Number</Label>
                  <Input name="nablAccreditationNumber" value={formData.nablAccreditationNumber} onChange={handleChange} placeholder="e.g. TC-XXXX" className="bg-background/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contact Email</Label>
                  <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="lab@email.com" type="email" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contact Phone</Label>
                  <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+91 44 2345 6789" className="bg-background/50" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
                  <div>
                    <Label className="text-base font-medium">NABL Accredited</Label>
                    <p className="text-sm text-muted-foreground mt-1">Has valid NABL certification.</p>
                  </div>
                  <Switch checked={formData.isNablAccredited} onCheckedChange={(c) => handleSwitchChange("isNablAccredited", c)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
                  <div>
                    <Label className="text-base font-medium">FSSAI Approved</Label>
                    <p className="text-sm text-muted-foreground mt-1">Is an approved FSSAI notified lab.</p>
                  </div>
                  <Switch checked={formData.isFssaiApproved} onCheckedChange={(c) => handleSwitchChange("isFssaiApproved", c)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Physical Location</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium">Full Address</Label>
                    <Input name="address" value={formData.location.address} onChange={handleLocationChange} placeholder="123, Lab Street, Industrial Area" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">City</Label>
                    <Input name="city" value={formData.location.city} onChange={handleLocationChange} placeholder="Chennai" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">State</Label>
                    <Input name="state" value={formData.location.state} onChange={handleLocationChange} placeholder="Tamil Nadu" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Latitude (Optional)</Label>
                    <Input name="lat" value={formData.location.lat} onChange={handleLocationChange} placeholder="13.0827" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Longitude (Optional)</Label>
                    <Input name="lng" value={formData.location.lng} onChange={handleLocationChange} placeholder="80.2707" className="bg-background/50" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Facility Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.metadata?.images?.map((img: string, i: number) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                      <img src={img} alt="Lab facility" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveImage(i)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={handleMockImageUpload}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors aspect-video text-primary cursor-pointer"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">Upload Image</span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Uploading high-quality images of the facility increases trust among food businesses.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in text-center py-12">
               <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-semibold">Test Configurations (Coming Soon)</h3>
               <p className="text-muted-foreground max-w-md mx-auto">
                 In a future update, you will be able to select standard tests and set base pricing directly during onboarding.
               </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="w-32">
          Back
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} className="w-32 bg-primary hover:bg-primary-deep shadow-md shadow-primary/20">
            Next Step
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-40 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            {saveMutation.isPending ? "Saving..." : (isEditing ? "Save Changes" : "Create Laboratory")}
          </Button>
        )}
      </div>
    </div>
  );
}
