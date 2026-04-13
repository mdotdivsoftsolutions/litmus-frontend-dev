import { Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const reviews = [
   { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. Reports were detailed and FSSAI compliant. Highly recommend!", date: "2 weeks ago" },
   { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. WhatsApp updates kept me informed throughout the entire testing process. Will use again.", date: "1 month ago" },
   { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
   { name: "Kavya Singh", city: "Delhi", rating: 5, text: "The booking process was seamless, and the sample collection was done right on time. Very impressive.", date: "1 week ago" },
];

export function CustomerReviews() {
   return (
      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden min-h-full flex flex-col justify-center ">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F06C00]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

         <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
            <SectionHeader
              title={
                <>
                  Customer <span className="text-transparent bg-clip-text bg-gradient-brand">Reviews</span>
                </>
              }
              subtitle="See why thousands of businesses trust Litmus for their uncompromising food safety testing."
              action={{
                label: "Read All Stories",
                href: "#",
              }}
            />

            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-12 px-2 -mx-2">
               {reviews.map((r, i) => (
                  <div key={i} className="w-[420px] shrink-0 bg-white p-10 rounded-[1.5rem]  border border-slate-100 flex flex-col relative group hover:border-red-100 transition-all duration-500 hover:-translate-y-2">

                     <div className="flex items-center gap-1.5 mb-8 relative z-10">
                        {[1, 2, 3, 4, 5].map(s => (
                           <Star 
                              key={s} 
                              className={cn("h-5 w-5", s <= r.rating ? "fill-[#F06C00] text-[#F06C00]" : "text-slate-200")} 
                           />
                        ))}
                     </div>
                     <p className="text-md text-slate-500 leading-relaxed flex-1 relative z-10 ">"{r.text}"</p>

                     <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10 group-hover:border-red-100 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-gradient-brand text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {r.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-base font-bold text-slate-800">{r.name}</p>
                              <p className="text-sm font-medium text-[#D32F2F]">{r.city}</p>
                           </div>
                        </div>
                        <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{r.date}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
