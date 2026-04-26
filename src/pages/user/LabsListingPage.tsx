import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, ArrowRight, Shield, Activity, Microscope } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

export default function LabsListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [visibleCount, setVisibleCount] = useState(4);

  const filtered = laboratories.filter((l) => {
    if (selectedCity !== "All Cities" && l.city !== selectedCity) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      {/* 1. CLINICAL HERO */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-white">
        {/* Panoramic Background Texture */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-20">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">
              <Microscope className="h-4 w-4" /> Accredited Facilities
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
               Discover Your Trusted <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Diagnostic Partner.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed opacity-80">
               Direct access to NABL-accredited laboratories specialized in food safety, beverage analysis, and regulatory quality control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32F2F] transition-colors" />
                <Input 
                   placeholder="Search labs or cities..." 
                   className="pl-12 h-14 rounded-xl text-sm border-slate-100 bg-white shadow-sm focus:border-[#D32F2F]/20 transition-all" 
                   value={search} 
                   onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full sm:w-52 h-14 rounded-xl border-slate-100 bg-white shadow-sm font-semibold text-xs tracking-widest text-slate-600 uppercase">
                   <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => <SelectItem key={c} value={c} className="text-xs font-semibold uppercase tracking-widest">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden lg:block relative">
             <div className="aspect-square w-[400px] rounded-[3rem] bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-2xl relative overflow-hidden group">
                <img 
                   src="https://images.unsplash.com/photo-15791542389-341efef8f06f?auto=format&fit=crop&q=80&w=800 " 
                   alt="Modern Lab" 
                   className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform duration-[8000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 space-y-3">
                   <p className="text-[10px] font-black text-[#D32F2F] uppercase tracking-[0.3em]">Institutional Standard</p>
                   <p className="text-xs font-medium text-slate-800 leading-tight">All listed facilities undergo strict FSSAI & NABL compliance verification.</p>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 h-32 w-32 bg-red-100 blur-[80px] rounded-full -z-10" />
             <div className="absolute -bottom-20 -left-20 h-48 w-48 bg-orange-100 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* 2. LABS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24 ">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.slice(0, visibleCount).map((lab) => (
            <Card key={lab.id} className="group border-2 border-slate-50 shadow-sm hover:border-[#D32F2F]/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 text-[#D32F2F] flex items-center justify-center font-bold text-lg shrink-0 shadow-sm transition-transform group-hover:-rotate-6">
                      {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors">{lab.name}</h3>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest"><MapPin className="h-3.5 w-3.5 text-[#D32F2F]" />{lab.city}, India</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{lab.rating}</span>
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">42 Reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-y border-slate-50 py-6">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                     <div className="flex flex-wrap gap-1 mt-1.5">
                        {lab.nabl && <Badge className="bg-slate-900 border-0 text-[8px] h-4 tracking-tighter">NABL</Badge>}
                        {lab.fssai && <Badge className="bg-[#D32F2F] border-0 text-[8px] h-4 tracking-tighter">FSSAI</Badge>}
                     </div>
                  </div>
                  <div className="space-y-1 border-l border-slate-50 pl-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Starting</p>
                     <p className="text-sm font-bold text-slate-800 mt-1">₹{lab.priceFrom}</p>
                  </div>
                  <div className="space-y-1 border-l border-slate-50 pl-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Expertise</p>
                     <div className="flex items-center gap-1.5 mt-1.5">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-600">Dairy +</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Now</span>
                   </div>
                   <Button variant="ghost" className="h-12 px-6 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-[#D32F2F] font-semibold text-xs transition-all gap-2 group/btn" asChild>
                     <Link to={`/labs/${lab.id}`}>Explore Laboratory <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" /></Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length > visibleCount && (
           <div className="mt-20 flex justify-center">
              <Button 
                onClick={() => setVisibleCount(prev => prev + 4)}
                variant="outline" 
                className="h-12 px-10 rounded-xl border-slate-200 text-slate-500 hover:text-[#D32F2F] hover:border-[#D32F2F]/20 font-semibold text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-3 bg-white shadow-sm hover:shadow-md"
              >
                Discover More Laboratories <ArrowRight className="h-4 w-4" />
              </Button>
           </div>
        )}

        {filtered.length === 0 && (
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
    </div>
  );
}
