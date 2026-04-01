import { Star, Shield, Package, FileText, Zap, Stethoscope, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. Reports were detailed and FSSAI compliant. Highly recommend!", date: "2 weeks ago" },
  { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. WhatsApp updates kept me informed throughout the entire testing process. Will use again.", date: "1 month ago" },
  { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
  { name: "Kavya Singh", city: "Delhi", rating: 5, text: "The booking process was seamless, and the sample collection was done right on time. Very impressive.", date: "1 week ago" },
];

const whyLitmus = [
  { title: "NABL Certified Labs", icon: Shield, desc: "Partnered with strictly accredited labs" },
  { title: "Easy Sample Collection", icon: Package, desc: "Doorstep pickup available" },
  { title: "Accurate Reports", icon: FileText, desc: "100% reliable and FSSAI compliant" },
  { title: "Fast Turnaround", icon: Zap, desc: "Reports delivered in 3-5 days" },
  { title: "Expert Support", icon: Stethoscope, desc: "Consultation available anytime" },
  { title: "Transparent Pricing", icon: Check, desc: "No hidden fees or extra charges" },
];

export function HomeReviewsAndInfo() {
  return (
    <>
      <section className="py-16 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-medium text-slate-800 text-center mb-12 tracking-tight">Why Litmus?</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
               {whyLitmus.map((feature, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm transition-all group">
                     <div className="h-14 w-14 bg-red-50 rounded-xl flex items-center justify-center text-[#E53935] mb-2 group-hover:scale-110 group-hover:bg-[#E53935] group-hover:text-white transition-all">
                        <feature.icon className="h-7 w-7" />
                     </div>
                     <h3 className="text-base text-slate-800 font-medium">{feature.title}</h3>
                     <p className="text-xs text-slate-500 hidden sm:block">{feature.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <section className="py-16 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 overflow-hidden">
            <h2 className="text-3xl font-medium text-slate-800 mb-8 tracking-tight">Customer Reviews & Ratings</h2>

            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-1">
               {reviews.map((r, i) => (
                  <div key={i} className="w-[340px] shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                     <div className="flex items-center gap-1 mt-1 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-4 w-4", s <= r.rating ? "fill-[#F06C00] text-[#F06C00]" : "text-slate-200")} />)}
                     </div>
                     <p className="text-sm text-slate-700 leading-relaxed flex-1">"{r.text}"</p>
                     
                     <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-[#E53935] text-white rounded-full flex items-center justify-center">
                              {r.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-medium text-slate-800">{r.name}</p>
                              <p className="text-[11px] text-slate-500">{r.city}</p>
                           </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{r.date}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </>
  );
}
