import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";

export function CreateUserDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Auto-generate default password based on first name and phone number if empty
  useEffect(() => {
    if (formData.firstName && formData.phone && !formData.password) {
      setFormData(prev => ({
        ...prev,
        password: `${prev.firstName.toLowerCase().replace(/\s+/g, '')}${prev.phone.slice(-4)}`
      }));
    }
  }, [formData.firstName, formData.phone, formData.password]);

  const mutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: (data) => {
      toast.success(data.message || "User created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      onOpenChange(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      setShowPassword(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
    setShowPassword(true);
    toast.success("Generated secure password");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto flex flex-col justify-between p-6">
        <div>
          <SheetHeader className="pb-4 border-b border-border text-left">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-slate-900">Create New Customer</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Manually onboard a customer into the Litmus platform
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4 py-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">First Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  placeholder="e.g. Rahul"
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  placeholder="e.g. Sharma"
                  value={formData.lastName} 
                  onChange={handleChange} 
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="customer@company.com"
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></Label>
              <Input 
                id="phone" 
                name="phone" 
                placeholder="10-digit mobile number"
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="h-10 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Temporary Password <span className="text-red-500">*</span></Label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Auto-Generate
                </button>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  minLength={6} 
                  placeholder="Min 6 characters"
                  className="h-10 text-sm pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-800 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">The customer can change this password upon logging in.</p>
            </div>
          </form>
        </div>

        <SheetFooter className="border-t border-border pt-4 flex flex-row items-center justify-end gap-2 bg-card">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
          <Button 
            form="create-user-form"
            type="submit" 
            disabled={mutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white font-semibold flex-1 sm:flex-initial"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Create Customer Account
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
