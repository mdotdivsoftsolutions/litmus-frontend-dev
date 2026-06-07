import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";

export default function UserProfilePage() {
  const queryClient = useQueryClient();
  
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
  });

  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    fssaiNumber: "",
    gstNumber: ""
  });

  useEffect(() => {
    if (userResponse?.data) {
      const user = userResponse.data;
      setFormData({
        businessName: user.metadata?.businessName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pinCode: user.address?.pinCode || "",
        fssaiNumber: user.fssaiNumber || "",
        gstNumber: user.metadata?.gstNumber || ""
      });
    }
  }, [userResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateMutation = useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  });

  const handleSave = () => {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode
      },
      fssaiNumber: formData.fssaiNumber,
      metadata: {
        ...(userResponse?.data?.metadata || {}),
        businessName: formData.businessName,
        gstNumber: formData.gstNumber
      }
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>;
  }

  const initials = `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 mb-4"><Upload className="h-3.5 w-3.5" />Change Photo</Button>
            <h3 className="font-semibold text-foreground">{formData.businessName || `${formData.firstName} ${formData.lastName}`}</h3>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Business Name</Label><Input name="businessName" value={formData.businessName} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>First Name</Label><Input name="firstName" value={formData.firstName} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" value={formData.lastName} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Mobile</Label><Input name="phone" value={formData.phone} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={formData.email} disabled className="bg-muted" /></div>
              <div className="space-y-2 col-span-2"><Label>Address (Street)</Label><Input name="street" value={formData.street} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>City</Label><Input name="city" value={formData.city} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>State</Label><Input name="state" value={formData.state} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>PIN Code</Label><Input name="pinCode" value={formData.pinCode} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>FSSAI Number</Label><Input name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>GST Number</Label><Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} /></div>
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
