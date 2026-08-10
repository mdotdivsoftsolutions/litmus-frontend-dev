import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/axios";
import { ScrollArea } from "@/components/ui/scroll-area";

const employeeApi = {
  createEmployee: async (data: any) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },
  updateEmployee: async (data: any) => {
    const response = await apiClient.put(`/employees/${data.id}`, data);
    return response.data;
  }
};

const PERMISSIONS = [
  { id: "MANAGE_EMPLOYEES", label: "Manage Employees", desc: "Allows creating, editing, and deleting employee accounts." },
  { id: "MANAGE_LABS", label: "Manage Laboratories", desc: "Allows onboarding and managing partner labs." },
  { id: "MANAGE_USERS", label: "Manage Users", desc: "Allows viewing and managing end-user accounts." },
  { id: "VIEW_BOOKINGS", label: "View Bookings", desc: "Allows viewing all test bookings and reports." },
  { id: "MANAGE_BOOKINGS", label: "Manage Bookings", desc: "Allows modifying bookings and assigning them to labs." },
  { id: "VIEW_PRICING", label: "View Pricing", desc: "Allows viewing pricing details and financial records." },
  { id: "VIEW_LEADS", label: "View Leads Only", desc: "Restricts access to only viewing customer leads." },
];

interface CreateEmployeeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: any; // If provided, edit mode
}

export function CreateEmployeeDrawer({ open, onOpenChange, employee }: CreateEmployeeDrawerProps) {
  const queryClient = useQueryClient();
  const isEdit = !!employee;
  const [isUploading, setIsUploading] = useState(false);

  const { data: departmentsResponse } = useQuery({
    queryKey: ["options", "DEPARTMENT"],
    queryFn: async () => {
      const res = await apiClient.get('/options?category=DEPARTMENT');
      return res.data;
    }
  });

  const { data: designationsResponse } = useQuery({
    queryKey: ["options", "DESIGNATION"],
    queryFn: async () => {
      const res = await apiClient.get('/options?category=DESIGNATION');
      return res.data;
    }
  });

  const departments = departmentsResponse?.data || [];
  const designations = designationsResponse?.data || [];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    profilePic: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    if (open && employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        designation: employee.designation || "",
        department: employee.department || "",
        profilePic: employee.profilePic || "",
        permissions: employee.permissions || [],
      });
    } else if (open && !employee) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        profilePic: "",
        permissions: [],
      });
    }
  }, [open, employee]);

  const mutation = useMutation({
    mutationFn: isEdit ? employeeApi.updateEmployee : employeeApi.createEmployee,
    onSuccess: (data) => {
      toast.success(data.message || (isEdit ? "Employee updated successfully" : "Employee created successfully"));
      queryClient.invalidateQueries({ queryKey: ["adminEmployees"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save employee");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      mutation.mutate({ id: employee._id, ...formData });
    } else {
      mutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);

    setIsUploading(true);
    try {
      const res = await apiClient.post("/upload", formDataToUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(prev => ({ ...prev, profilePic: res.data.data?.url || "" }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: perms };
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] w-full p-0 flex flex-col h-full bg-white">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{isEdit ? "Edit Employee" : "Add New Employee"}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <form id="employee-form" onSubmit={handleSubmit} className="space-y-5 py-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="profilePic">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {isUploading ? (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border text-primary">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  ) : formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile preview" className="w-12 h-12 rounded-full object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border text-xs text-slate-400">No Img</div>
                  )}
                  <Input 
                    id="profilePic" 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    required 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              {!isEdit && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Select value={formData.designation} onValueChange={(val) => setFormData(prev => ({ ...prev, designation: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((d: any) => (
                        <SelectItem key={d._id} value={d.value}>{d.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(val) => setFormData(prev => ({ ...prev, department: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d: any) => (
                        <SelectItem key={d._id} value={d.value}>{d.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Access Permissions</h3>
              <TooltipProvider>
                <div className="grid grid-cols-1 gap-3 bg-muted/20 p-4 rounded-lg border">
                  {PERMISSIONS.map(p => (
                    <div key={p.id} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`perm-${p.id}`} 
                        checked={formData.permissions.includes(p.id)}
                        onCheckedChange={() => handlePermissionToggle(p.id)}
                      />
                      <label 
                        htmlFor={`perm-${p.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {p.label}
                      </label>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <HelpCircle className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{p.desc}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
            
          </form>
        </ScrollArea>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="employee-form"
            className="bg-primary hover:bg-primary/90 text-white min-w-[120px]" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Employee"}
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
