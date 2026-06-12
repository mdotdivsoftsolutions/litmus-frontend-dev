import { Link } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, MapPin, ArrowRight, Activity } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";

interface LabItem {
  id: string;
  name: string;
  city: string;
  nabl: boolean;
  fssai: boolean;
  rating: number;
  reviewCount?: number;
  priceFrom: number;
  testsCount: number;
  expertiseArea?: string[];
  [key: string]: any; // Allow other properties
}

interface LabsGridProps {
  filtered: LabItem[];
  visibleCount: number;
  setVisibleCount: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
}

export function LabsGrid({ filtered, visibleCount, setVisibleCount, isLoading }: LabsGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="border-1 border-slate-50 shadow-sm rounded-[1rem] overflow-hidden bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <div className="flex gap-1"><Skeleton className="h-4 w-8" /><Skeleton className="h-4 w-8" /></div>
                  </div>
                  <div className="space-y-2 border-l border-slate-50 pl-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="space-y-2 border-l border-slate-50 pl-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered.slice(0, visibleCount).map((lab) => (
          <Card key={lab.id} className="group border-1 border-slate-50 shadow-sm hover:border-[#D32F2F]/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-[1rem] overflow-hidden bg-white">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 text-[#D32F2F] flex items-center justify-center font-bold text-sm shrink-0 shadow-sm transition-transform group-hover:-rotate-6">
                    {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-semibold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors">{lab.name}</h3>
                    <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-widest"><MapPin className="h-3 w-3 text-[#D32F2F]" />{lab.city}, India</p>
                  </div>
                </div>
                   <div className="flex flex-col items-end gap-1">
                   <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-700">{lab.rating?.toFixed(1) || '0.0'}</span>
                   </div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{lab.reviewCount || 0} Reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                   <div className="flex flex-wrap gap-1 mt-1">
                      {lab.nabl && <Badge className="bg-slate-900 border-0 text-[8px] px-1 py-0 h-4 tracking-tighter">NABL</Badge>}
                      {lab.fssai && <Badge className="bg-[#D32F2F] border-0 text-[8px] px-1 py-0 h-4 tracking-tighter">FSSAI</Badge>}
                   </div>
                </div>
                 <div className="space-y-1 border-l border-slate-50 pl-3">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Starting</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">₹{lab.priceFrom}</p>
                 </div>
                 <div className="space-y-1 border-l border-slate-50 pl-3">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Expertise</p>
                   <div className="flex items-center gap-1 mt-1">
                      <Activity className="h-2.5 w-2.5 text-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-600">
                        {lab.expertiseArea?.length > 0 ? (
                          <>
                            {lab.expertiseArea[0]} 
                            {lab.expertiseArea.length > 1 && <span className="text-slate-400"> +{lab.expertiseArea.length - 1}</span>}
                          </>
                        ) : "General"}
                      </span>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Now</span>
                 </div>
                 <Button variant="ghost" className="h-8 px-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-[#D32F2F] font-semibold text-[10px] transition-all gap-1.5 group/btn" asChild>
                   <Link to={`/labs/${lab.id}`}>Explore Laboratory <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" /></Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && filtered.length > visibleCount && (
         <div className="mt-12 flex justify-center">
            <Button 
              onClick={() => setVisibleCount(filtered.length)}
              variant="outline" 
              className="h-10 px-8 rounded-xl border-slate-200 text-slate-500 hover:text-[#D32F2F] hover:border-[#D32F2F]/20 font-semibold text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2 bg-white shadow-sm hover:shadow-md"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Button>
         </div>
      )}

      {!isLoading && filtered.length === 0 && (
         <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-fade-in">
            <div className="h-24 w-24 rounded-[3rem] bg-slate-100 flex items-center justify-center opacity-40">
               <Search className="h-10 w-10 text-slate-400" />
            </div>
            <div className="text-center space-y-2">
               <p className="text-xl font-semibold text-slate-800">No laboratories found</p>
               <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
            </div>
         </div>
      )}
    </div>
  );
}
