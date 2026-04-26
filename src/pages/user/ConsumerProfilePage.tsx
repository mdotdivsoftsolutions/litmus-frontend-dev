import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Building2, Mail, Phone, ShieldCheck, 
  FileText, Settings, LogOut, CloudUpload, 
  CheckCircle2, Clock, Lock, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConsumerProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [notifications, setNotifications] = useState({ email: true, whatsapp: true, promo: false });

  const tabs = [
    { id: "info", label: "Profile Information", icon: User },
    { id: "documents", label: "Business Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:pb-20 animate-fade-in flex flex-col md:flex-row gap-6 ">
      
      {/* Sidebar: Profile Card & Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-4">
         {/* Identity Card */}
         <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20 mb-3">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">RK</AvatarFallback>
            </Avatar>
            <h1 className="text-base font-bold text-foreground">Kumar Dairy Foods</h1>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="h-3 w-3 text-litmus-teal" /> Verified
            </p>
         </div>

         {/* Navigation Menu */}
         <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-row md:flex-col">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium transition-colors border-b border-border last:border-0",
                  activeTab === tab.id 
                    ? "bg-primary/5 text-primary border-l-4 border-l-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-l-transparent"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
            
            <button className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 p-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border-l-4 border-l-transparent">
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
                  <Label className="text-xs font-semibold text-muted-foreground">Full Name</Label>
                  <Input defaultValue="Rajesh Kumar" className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                  <Input defaultValue="rajesh@dairyfoods.in" className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
                  <Input defaultValue="+91 98765 43210" className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
                  <Input defaultValue="Kumar Dairy Foods Pvt. Ltd." className="h-10 rounded-lg" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-muted-foreground">FSSAI License No.</Label>
                  <Input defaultValue="10012345000123" className="h-10 rounded-lg" />
                </div>
             </div>

             <div className="flex justify-end border-t border-border pt-4">
                <Button className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-10 px-6">
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
                <Button className="bg-primary hover:bg-primary-deep text-primary-foreground rounded-lg h-9 px-4 gap-2 text-sm">
                  <CloudUpload className="h-4 w-4" /> Upload
                </Button>
             </div>

             <div className="grid gap-3">
                {[
                  { name: "FSSAI_License_2023.pdf", type: "License", status: "Verified" },
                  { name: "GST_Certificate.pdf", type: "Certificate", status: "Verified" },
                  { name: "Business_PAN.jpg", type: "Identity", status: "Pending" },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-slate-50/50 hover:bg-muted transition-colors">
                     <FileText className="h-5 w-5 text-accent shrink-0" />
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{doc.type} • 4.2 MB</span>
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
                   <div className="bg-slate-50/50 rounded-xl p-4 border border-border flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button variant="outline" className="h-9 rounded-lg text-xs">Change</Button>
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
                             setNotifications(prev => ({...prev, [pref.id]: !isActive})) 
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
