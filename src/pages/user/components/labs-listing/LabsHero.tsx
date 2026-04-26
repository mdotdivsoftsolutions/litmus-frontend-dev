import { Search, Microscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface LabsHeroProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
}

export function LabsHero({ search, setSearch, selectedCity, setSelectedCity }: LabsHeroProps) {
  return (
    <section className="relative pt-12 pb-12 overflow-hidden bg-white">
      {/* Panoramic Background Texture */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">
            <Microscope className="h-4 w-4" /> Accredited Facilities
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
             Discover Your Trusted <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Diagnostic Partner.</span>
          </h1>
          <p className="text-slate-500 text-base font-medium max-w-xl leading-relaxed opacity-80">
             Direct access to NABL-accredited laboratories specialized in food safety, beverage analysis, and regulatory quality control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32F2F] transition-colors" />
              <Input 
                 placeholder="Search labs or cities..." 
                 className="pl-10 h-10 rounded-xl text-sm border-slate-100 bg-white shadow-sm focus:border-[#D32F2F]/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all" 
                 value={search} 
                 onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-52 h-10 rounded-xl border-slate-100 bg-white shadow-sm font-semibold text-xs tracking-widest text-slate-600 uppercase focus:ring-0 focus:ring-offset-0 focus:outline-none">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c} value={c} className="text-xs font-semibold uppercase tracking-widest">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden lg:flex lg:justify-center relative">
           <div className="aspect-square w-[380px] md:h-[280px] rounded-[1rem] bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-2xl relative overflow-hidden group">
              <img 
                 src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400" 
                 alt="Modern Lab" 
                 className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform duration-[8000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 space-y-2">
                 <p className="text-[9px] font-black text-[#D32F2F] uppercase tracking-[0.2em]">Institutional Standard</p>
                 <p className="text-[11px] font-medium text-slate-800 leading-tight">All listed facilities undergo strict FSSAI & NABL compliance verification.</p>
              </div>
           </div>
           {/* Decorative Elements */}
           <div className="absolute -top-6 -right-6 h-24 w-24 bg-red-100 blur-[60px] rounded-full -z-10" />
           <div className="absolute -bottom-12 -left-12 h-36 w-36 bg-orange-100 blur-[80px] rounded-full -z-10" />
        </div>
      </div>
    </section>
  );
}
