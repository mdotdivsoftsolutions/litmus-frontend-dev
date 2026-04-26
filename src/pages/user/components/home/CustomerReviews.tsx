import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const reviews = [
   { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. Reports were detailed and FSSAI compliant. Highly recommend!", date: "2 weeks ago" },
   { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. WhatsApp updates kept me informed throughout the entire testing process. Will use again.", date: "1 month ago" },
   { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
   { name: "Kavya Singh", city: "Delhi", rating: 5, text: "The booking process was seamless, and the sample collection was done right on time. Very impressive.", date: "1 week ago" },
   { name: "Rajesh Kumar", city: "Hyderabad", rating: 5, text: "Very helpful. Far easier than doing same things on computer. Already tracking my test history and checking booking. Even nutritional history of doctors visited.", date: "3 days ago" },
   { name: "Priya Sharma", city: "Pune", rating: 5, text: "Outstanding lab partner network. Reports are always delivered on time and the customer support is exceptional.", date: "5 days ago" },
];

// Duplicate for seamless infinite scroll
const marqueeItems = [...reviews, ...reviews];

function ReviewCard({ r }: { r: typeof reviews[number] }) {
   return (
      <div className="w-[420px] shrink-0 bg-white p-8 rounded-[1.5rem] border border-slate-100 flex flex-col relative group hover:border-red-100 transition-all duration-500">
         <div className="flex items-center gap-1.5 mb-6 relative z-10">
            {[1, 2, 3, 4, 5].map(s => (
               <Star
                  key={s}
                  className={cn("h-4 w-4", s <= r.rating ? "fill-[#F06C00] text-[#F06C00]" : "text-slate-200")}
               />
            ))}
         </div>
         <p className="text-sm text-slate-500 leading-relaxed flex-1 relative z-10">"{r.text}"</p>

         <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-gradient-brand text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {r.name.charAt(0)}
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-800">{r.name}</p>
                  <p className="text-xs font-medium text-[#D32F2F]">{r.city}</p>
               </div>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{r.date}</span>
         </div>
      </div>
   );
}

export function CustomerReviews() {
   return (
      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden min-h-full flex flex-col justify-center">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F06C00]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

         <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
            <SectionHeader
               title={
                  <>
                     Customer <span className="text-gradient-brand">Reviews</span>
                  </>
               }
               subtitle="See why thousands of businesses trust Litmus for their uncompromising food safety testing."
               action={{
                  label: "Read All Stories",
                  href: "#",
               }}
            />
         </div>

         {/* Marquee — infinite horizontal scroll */}
         <div className="relative w-full overflow-hidden">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />

            <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] px-4">
               {marqueeItems.map((r, i) => (
                  <ReviewCard key={`review-${i}`} r={r} />
               ))}
            </div>
         </div>
      </section>
   );
}
