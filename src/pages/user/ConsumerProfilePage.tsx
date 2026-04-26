import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, Building2, Mail, Phone, ShieldCheck, 
  FileText, Settings, LogOut, CloudUpload, 
  CheckCircle2, Clock, ChevronRight, Lock, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConsumerProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Profile Information", icon: User },
    { id: "documents", label: "Business Documents", icon: FileText },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Decorative Header Background */}
      <div className="h-64 bg-slate-900 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
         <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#D32F2F]/20 blur-[120px] rounded-full pointer-events-none" />
         <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#F06C00]/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Card & Navigation */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
             {/* Identity Card */}
             <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                <div className="h-24 w-full bg-gradient-to-br from-slate-100 to-slate-50 absolute top-0 left-0" />
                <Avatar className="h-28 w-28 ring-4 ring-white shadow-xl relative z-10 mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-[#D32F2F] to-[#F06C00] text-white text-3xl font-bold">RK</AvatarFallback>
                </Avatar>
                <div className="relative z-10 w-full space-y-1 mb-6">
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">Kumar Dairy Foods Pvt. Ltd.</h1>
                  <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Business
                  </p>
                </div>

                <div className="w-full pt-6 border-t border-slate-100 flex justify-between items-center px-2">
                   <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Orders</p>
                      <p className="text-lg font-bold text-slate-800">124</p>
                   </div>
                   <div className="w-px h-8 bg-slate-100" />
                   <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reports</p>
                      <p className="text-lg font-bold text-slate-800">45</p>
                   </div>
                </div>
             </div>

             {/* Navigation Menu */}
             <div className="bg-white rounded-xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-1">
                {tabs.map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                      activeTab === tab.id 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "bg-transparent text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3 font-semibold text-sm">
                       <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-[#feba50]" : "text-slate-400 group-hover:text-slate-600")} />
                       {tab.label}
                    </div>
                    <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", activeTab === tab.id ? "translate-x-1 text-white/50" : "text-slate-300")} />
                  </button>
                ))}
                
                <div className="pt-2 mt-2 border-t border-slate-100">
                   <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-transparent text-red-500 hover:bg-red-50 transition-all duration-300">
                     <div className="flex items-center gap-3 font-semibold text-sm">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                     </div>
                   </button>
                </div>
             </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="flex-1">
            
            {activeTab === "info" && (
              <div className="bg-white rounded-xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 animate-fade-in">
                 <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Profile Information</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage your personal and business details.</p>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input defaultValue="Rajesh Kumar" className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all font-medium text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input defaultValue="rajesh@dairyfoods.in" className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all font-medium text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input defaultValue="+91 98765 43210" className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all font-medium text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input defaultValue="Kumar Dairy Foods Pvt. Ltd." className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all font-medium text-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-3 sm:col-span-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">FSSAI License No.</Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input defaultValue="10012345000123" className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-all font-medium text-slate-800" />
                      </div>
                    </div>
                 </div>

                 <div className="flex justify-end">
                    <Button className="h-12 px-8 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl transition-all">
                      Save Changes
                    </Button>
                 </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white rounded-xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 animate-fade-in space-y-10">
                 <div className="border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Business Documents</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Upload and manage your compliance certifications.</p>
                 </div>

                 {/* Upload Area */}
                 <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/5 to-[#F06C00]/5 rounded-[2rem] transform scale-[0.98] group-hover:scale-100 transition-all duration-500" />
                    <div className="border-2 border-dashed border-[#D32F2F]/20 rounded-[2rem] p-12 text-center relative z-10 bg-white/50 backdrop-blur-sm group-hover:bg-white/80 group-hover:border-[#D32F2F]/50 transition-all duration-500 flex flex-col items-center justify-center">
                       <div className="h-16 w-16 bg-[#D32F2F]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                          <CloudUpload className="h-8 w-8 text-[#D32F2F]" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">Upload New Document</h3>
                       <p className="text-sm font-medium text-slate-500 mb-6 max-w-[250px]">Drag and drop your files here, or click to browse (PDF, JPG, PNG)</p>
                       <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 text-slate-600 font-semibold text-xs group-hover:border-[#D32F2F] group-hover:text-[#D32F2F]">
                         Select Files
                       </Button>
                    </div>
                 </div>

                 {/* Document List */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Uploaded Documents</h4>
                    <div className="space-y-3">
                      {[
                        { name: "FSSAI License_2023.pdf", type: "License", status: "Verified" },
                        { name: "GST_Certificate.pdf", type: "Certificate", status: "Verified" },
                        { name: "Business_PAN.jpg", type: "Identity", status: "Pending" },
                      ].map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                           <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                              <FileText className="h-6 w-6 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate mb-1">{doc.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{doc.type}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-500">4.2 MB</span>
                              </div>
                           </div>
                           <div className={cn(
                             "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0",
                             doc.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                           )}>
                             {doc.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                             {doc.status}
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 animate-fade-in space-y-10">
                 <div className="border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage your security and notification preferences.</p>
                 </div>

                 <div className="space-y-8">
                    {/* Password Section */}
                    <div>
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Lock className="h-4 w-4 text-slate-400" /> Security
                       </h3>
                       <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Password</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Last changed 3 months ago</p>
                          </div>
                          <Button variant="outline" className="h-10 rounded-xl text-xs font-semibold">Change Password</Button>
                       </div>
                    </div>

                    {/* Notifications Section */}
                    <div>
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Bell className="h-4 w-4 text-slate-400" /> Notifications
                       </h3>
                       <div className="space-y-3">
                          {[
                            { title: "Email Notifications", desc: "Receive updates about your reports via email", active: true },
                            { title: "WhatsApp Alerts", desc: "Instant messages for critical diagnostic updates", active: true },
                            { title: "Promotional Offers", desc: "Receive discounts and premium package details", active: false }
                          ].map((pref, idx) => (
                             <label key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                                <div>
                                   <p className="text-sm font-bold text-slate-800">{pref.title}</p>
                                   <p className="text-xs font-medium text-slate-500 mt-1">{pref.desc}</p>
                                </div>
                                <div className={cn(
                                   "w-10 h-6 rounded-full p-1 transition-colors duration-300",
                                   pref.active ? "bg-emerald-500" : "bg-slate-200"
                                )}>
                                   <div className={cn(
                                      "h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                                      pref.active ? "translate-x-4" : "translate-x-0"
                                   )} />
                                </div>
                             </label>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end pt-4">
                    <Button className="h-12 px-8 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl shadow-md hover:scale-105  active:scale-95 transition-all">
                      Save Preferences
                    </Button>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
