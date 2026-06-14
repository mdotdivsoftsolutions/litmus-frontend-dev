import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Building2, Mail, Phone, ShieldCheck, 
  FileText, Settings, LogOut, CloudUpload, 
  CheckCircle2, Clock, Lock, Bell, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { uploadApi } from "@/lib/api/uploadApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function ConsumerProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [notifications, setNotifications] = useState({ email: true, whatsapp: true, promo: false });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    fssaiNo: ""
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        businessName: u.companyName || "",
        fssaiNo: u.fssaiNumber || ""
      });
      if (u.notifications) {
        setNotifications(u.notifications);
      } else if (u.metadata?.notifications) {
        setNotifications(u.metadata.notifications);
      }
    }
  }, [userResponse]);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  });

  const { mutate: uploadDocument, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadApi.uploadFile(file);
      const url = res.data.url;
      const doc = {
        name: file.name,
        url: url,
        docType: "Document",
        status: "Pending",
        size: (file.size / 1024 / 1024).toFixed(1) + " MB"
      };
      
      const updatedDocs = [...(userResponse?.data?.documents || []), doc];
      await authApi.updateProfile({ documents: updatedDocs });
      return doc;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to upload document");
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadDocument(e.target.files[0]);
    }
  };

  const handleToggleNotification = (id: string, value: boolean) => {
    const newNotifs = { ...notifications, [id]: value };
    setNotifications(newNotifs);
    updateProfile({
      notifications: newNotifs
    } as any);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      companyName: formData.businessName,
      fssaiNumber: formData.fssaiNo
    } as any);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/');
    } catch (e) {
      console.error(e);
      navigate('/');
    }
  };

  const tabs = [
    { id: "info", label: "Profile Information", icon: User },
    { id: "documents", label: "Business Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const u = userResponse?.data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 animate-fade-in flex flex-col md:flex-row gap-6 ">
      
      {/* Sidebar: Profile Card & Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-4">
         {/* Identity Card */}
         <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20 mb-3">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{u.firstName?.charAt(0) || "U"}{u.lastName?.charAt(0) || ""}</AvatarFallback>
            </Avatar>
            <h1 className="text-base font-bold text-foreground">{u.companyName || `${u.firstName} ${u.lastName}`}</h1>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              {u.isVerified ? <><ShieldCheck className="h-3 w-3 text-litmus-teal" /> Verified</> : "Unverified"}
            </p>
         </div>

         {/* Navigation Menu */}
         <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-row md:flex-col">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium transition-colors border-b-2 md:border-b-0 md:border-l-4",
                  activeTab === tab.id 
                    ? "bg-primary/5 text-primary border-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
            
            <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border-b-2 md:border-b-0 md:border-l-4 border-transparent">
               <LogOut className="h-4 w-4 shrink-0" />
               <span className="hidden md:inline">Sign Out</span>
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "info" && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
             <div className="mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Manage your personal and business details.</p>
             </div>

             <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">First Name</Label>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Last Name</Label>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                  <Input name="email" value={formData.email} onChange={handleInputChange} className="h-10 rounded-lg" disabled />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
                  <Input name="businessName" value={formData.businessName} onChange={handleInputChange} className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-muted-foreground">FSSAI License No.</Label>
                  <Input name="fssaiNo" value={formData.fssaiNo} onChange={handleInputChange} className="h-10 rounded-lg" />
                </div>
             </div>

             <div className="flex justify-end border-t border-border pt-4">
                <Button disabled={isUpdating} onClick={handleSave} className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-10 px-6">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
             </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-6">
             <div className="pb-4 border-b border-border flex justify-between items-end">
                 <div>
                  <h2 className="text-lg font-bold text-foreground">Business Documents</h2>
                  <p className="text-sm text-muted-foreground">Upload and manage certifications.</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <Button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-9 px-4 gap-2 text-sm">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />} Upload
                </Button>
             </div>

             <div className="grid gap-3">
                {(!u.documents || u.documents.length === 0) && (
                   <p className="text-sm text-muted-foreground text-center py-6">No documents uploaded yet.</p>
                )}
                {u.documents?.map((doc: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-slate-50/50 hover:bg-muted transition-colors">
                     <FileText className="h-5 w-5 text-accent shrink-0" />
                     <div className="flex-1 min-w-0">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-foreground hover:text-primary hover:underline truncate block">{doc.name}</a>
                        <span className="text-[10px] text-muted-foreground font-mono">{doc.docType || 'Document'} • {doc.size || 'Unknown Size'}</span>
                     </div>
                     <div className={cn(
                       "px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shrink-0",
                       doc.status === "Verified" ? "text-litmus-teal bg-litmus-teal/10" : "text-flame-orange bg-flame-orange/10"
                     )}>
                       {doc.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                       {doc.status}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
             <div className="mb-6 pb-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Account Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your security and preferences.</p>
             </div>

             <div className="space-y-6">
                <div>
                   <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                     <Lock className="h-4 w-4 text-muted-foreground" /> Security
                   </h3>
                   <div className="bg-slate-50/50 rounded-xl p-4 border border-border flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Password</p>
                          <p className="text-xs text-muted-foreground">Manage your login credentials</p>
                        </div>
                        <Button onClick={() => setShowPasswordForm(!showPasswordForm)} variant="outline" className="h-9 rounded-lg text-xs">
                          {showPasswordForm ? "Cancel" : "Change"}
                        </Button>
                      </div>
                      
                      {showPasswordForm && (
                        <div className="pt-4 border-t border-border grid gap-4 animate-fade-in">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Current Password</Label>
                            <Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(p => ({...p, currentPassword: e.target.value}))} className="h-10 rounded-lg" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">New Password</Label>
                            <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData(p => ({...p, newPassword: e.target.value}))} className="h-10 rounded-lg" />
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword} onClick={() => changePassword(passwordData)} className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-9 px-6 text-xs">
                              {isChangingPassword ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                              Update Password
                            </Button>
                          </div>
                        </div>
                      )}
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                     <Bell className="h-4 w-4 text-muted-foreground" /> Notifications
                   </h3>
                   <div className="grid gap-2">
                      {[
                        { id: "email", title: "Email Notifications", desc: "Receive updates via email" },
                        { id: "whatsapp", title: "WhatsApp Alerts", desc: "Instant messages for critical updates" },
                        { id: "promo", title: "Promotional Offers", desc: "Receive discounts and premium details" }
                      ].map((pref) => {
                         const isActive = notifications[pref.id as keyof typeof notifications];
                         return (
                         <label key={pref.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-slate-50/50 cursor-pointer transition-colors"
                           onClick={(e) => { 
                             e.preventDefault(); 
                             handleToggleNotification(pref.id, !isActive);
                           }}
                         >
                            <div>
                               <p className="text-sm font-semibold text-foreground">{pref.title}</p>
                               <p className="text-xs text-muted-foreground">{pref.desc}</p>
                            </div>
                            <div className={cn(
                               "w-9 h-5 rounded-full p-0.5 transition-colors duration-200",
                               isActive ? "bg-primary" : "bg-muted-foreground/30"
                            )}>
                               <div className={cn(
                                  "h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                                  isActive ? "translate-x-4" : "translate-x-0"
                               )} />
                            </div>
                         </label>
                      )})}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
