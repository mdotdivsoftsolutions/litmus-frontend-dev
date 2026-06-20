import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, Building2, CheckCircle2, X, Loader2, MessageSquare } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { consultationApi } from "@/lib/api/consultation";
import { toast } from "sonner";

interface ConsultationBookingModalProps {
  children: React.ReactNode;
  serviceName?: string;
  source?: string;
}

export function ConsultationBookingModal({ children, serviceName = "Advisory Consultation", source = "General" }: ConsultationBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Customization state
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const consultationMutation = useMutation({
    mutationFn: consultationApi.createConsultation,
    onSuccess: () => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", business: "", email: "", phone: "", date: "", time: "", message: "" }); // Reset
        }, 500); 
      }, 3000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit request.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    consultationMutation.mutate({
      ...formData,
      serviceName,
      source
    });
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-border shadow-lg [&>button]:hidden">
         {isSubmitted ? (
           <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500 fill-mode-forwards relative">
              <DialogClose asChild>
                <button className="absolute right-6 top-6 h-8 w-8 rounded-full border-2 border-red-200 bg-white text-red-500 hover:text-red-700 hover:border-red-400 hover:bg-red-50/50 flex items-center justify-center transition-all shadow-sm focus:outline-none">
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </DialogClose>
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
              <div className="bg-card border-b border-border p-6 relative text-center sm:text-left">
                 <DialogTitle className="text-xl font-bold text-foreground tracking-tight mb-1">Book Consultation</DialogTitle>
                 <DialogDescription className="text-sm text-muted-foreground font-medium">
                   {serviceName}
                 </DialogDescription>
                 
                 <DialogClose asChild>
                   <button className="absolute right-6 top-6 h-8 w-8 rounded-full border-2 border-red-200 bg-white text-red-500 hover:text-red-700 hover:border-red-400 hover:bg-red-50/50 flex items-center justify-center transition-all shadow-sm focus:outline-none">
                     <X className="h-4 w-4 stroke-[3]" />
                   </button>
                 </DialogClose>
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
                         <Input min={new Date().toISOString().split('T')[0]} name="date" value={formData.date} onChange={handleChange} required type="date" className="pl-9 h-10 rounded-lg bg-card" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">Preferred Time</Label>
                      <div className="relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                         <select 
                           name="time" 
                           value={formData.time} 
                           onChange={(e: any) => handleChange(e)} 
                           required 
                           className="flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                         >
                           <option value="" disabled>Select a time</option>
                           <option value="09:00 AM">09:00 AM</option>
                           <option value="09:30 AM">09:30 AM</option>
                           <option value="10:00 AM">10:00 AM</option>
                           <option value="10:30 AM">10:30 AM</option>
                           <option value="11:00 AM">11:00 AM</option>
                           <option value="11:30 AM">11:30 AM</option>
                           <option value="12:00 PM">12:00 PM</option>
                           <option value="12:30 PM">12:30 PM</option>
                           <option value="01:00 PM">01:00 PM</option>
                           <option value="01:30 PM">01:30 PM</option>
                           <option value="02:00 PM">02:00 PM</option>
                           <option value="02:30 PM">02:30 PM</option>
                           <option value="03:00 PM">03:00 PM</option>
                           <option value="03:30 PM">03:30 PM</option>
                           <option value="04:00 PM">04:00 PM</option>
                           <option value="04:30 PM">04:30 PM</option>
                           <option value="05:00 PM">05:00 PM</option>
                         </select>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-1.5 pt-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Additional Notes (Optional)</Label>
                    <div className="relative">
                       <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Textarea name="message" value={formData.message} onChange={(e: any) => handleChange(e)} placeholder="How can we help you?" className="pl-9 min-h-[80px] rounded-lg bg-card resize-none" />
                    </div>
                 </div>

                 <div className="pt-2">
                   <Button disabled={consultationMutation.isPending} type="submit" className="w-full h-11 bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold rounded-xl text-sm shadow-sm transition-all duration-300">
                      {consultationMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Confirm Booking Request"}
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
