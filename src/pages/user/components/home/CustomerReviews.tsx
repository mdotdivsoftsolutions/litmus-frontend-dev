import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api/review";
import { Skeleton } from "@/components/ui/skeleton";

function ReviewCard({ r }: { r: any }) {
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
            {r.dateText && <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{r.dateText}</span>}
         </div>
      </div>
   );
}

export function CustomerReviews() {
   const { data: response, isLoading } = useQuery({
      queryKey: ['publicReviews'],
      queryFn: () => reviewApi.getPublicReviews()
   });

   const reviews = response?.data || [];
   // Duplicate for seamless infinite scroll
   const marqueeItems = [...reviews, ...reviews];

   return (
      <section className="py-8 md:py-12 bg-[#F6FBFF] relative overflow-hidden min-h-full flex flex-col justify-center">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F06C00]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

         <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
            <SectionHeader
               title={
                  <>
                     Customer <span className="text-gradient-brand">Reviews</span>
                  </>
               }
               subtitle="See why thousands of businesses trust Litmus for their uncompromising food safety testing."
            />
         </div>

         {/* Marquee — infinite horizontal scroll */}
         <div className="relative w-full overflow-hidden mt-8">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />

            <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused] px-4">
               {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="w-[420px] shrink-0 bg-white p-8 rounded-[1.5rem] border border-slate-100 flex flex-col">
                        <Skeleton className="h-4 w-32 mb-6" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-8" />
                        <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-100">
                           <div className="flex gap-3 items-center">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                 <Skeleton className="h-4 w-24" />
                                 <Skeleton className="h-3 w-16" />
                              </div>
                           </div>
                           <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                     </div>
                  ))
               ) : reviews.length > 0 ? (
                  marqueeItems.map((r, i) => (
                     <ReviewCard key={`review-${i}`} r={r} />
                  ))
               ) : (
                  <div className="w-full text-center py-12 text-slate-500">
                     No reviews available yet.
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
