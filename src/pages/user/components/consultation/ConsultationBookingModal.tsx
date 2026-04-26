import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Mail, Phone, Building2, CheckCircle2 } from "lucide-react";

interface ConsultationBookingModalProps {
  children: React.ReactNode;
  serviceName?: string;
}

export function ConsultationBookingModal({ children, serviceName = "Advisory Consultation" }: ConsultationBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Customization state
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    date: "",
    time: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulate API call with the formData
    console.log("Submitting booking:", formData);
    
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", business: "", email: "", phone: "", date: "", time: "" }); // Reset
      }, 500); 
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isSubmitted) return; // Prevent closing while success message shows
      setIsOpen(open);
      if (!open) setTimeout(() => setIsSubmitted(false), 500);
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-border shadow-lg">
         {isSubmitted ? (
           <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500 fill-mode-forwards">
              <div className="h-20 w-20 bg-litmus-mint/20 text-litmus-teal rounded-full flex items-center justify-center mb-2">
                 <CheckCircle2 className="h-10 w-10" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Booking Confirmed</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground">
                Your consultation request for <span className="font-bold text-foreground">{serviceName}</span> has been received. Our advisory team will contact you shortly to confirm the schedule.
              </DialogDescription>
           </div>
         ) : (
           <div className="animate-in fade-in duration-300">
              <div className="bg-card border-b border-border p-6 text-center sm:text-left">
                 <DialogTitle className="text-xl font-bold text-foreground tracking-tight mb-1">Book Consultation</DialogTitle>
                 <DialogDescription className="text-sm text-muted-foreground font-medium">
                   {serviceName}
                 </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-50/50">
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Full Name</Label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
                      <div className="relative">
                         <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="business" value={formData.business} onChange={handleChange} placeholder="Company Ltd." className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="john@example.com" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="phone" value={formData.phone} onChange={handleChange} required type="tel" placeholder="+91 98765 43210" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-5 mt-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Preferred Date</Label>
                      <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                         <Input name="date" value={formData.date} onChange={handleChange} required type="date" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Preferred Time</Label>
                      <div className="relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                         <Input name="time" value={formData.time} onChange={handleChange} required type="time" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                 </div>

                 <div className="pt-2">
                   <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary-deep text-primary-foreground font-semibold rounded-xl text-sm shadow-sm transition-all">
                      Confirm Booking Request
                   </Button>
                   <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium">
                     By booking, you agree to our Advisory Terms of Service.
                   </p>
                 </div>
              </form>
           </div>
         )}
      </DialogContent>
    </Dialog>
  );
}
