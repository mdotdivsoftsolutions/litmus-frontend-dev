import { useState, useRef, useEffect } from "react";
import { Search, Microscope, FlaskConical, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface LabsHeroProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  labs?: any[];
  onSearch?: () => void;
}

export function LabsHero({ search, setSearch, selectedCity, setSelectedCity, labs = [], onSearch }: LabsHeroProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = search.trim() === "" 
    ? [] 
    : labs.filter(l => 
        l.name?.toLowerCase().includes(search.toLowerCase()) || 
        l.city?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/labs/${id}`);
    setShowSuggestions(false);
  };

  const handleExploreClick = () => {
    setShowSuggestions(false);
    if (onSearch) onSearch();
  };

  return (
    <section className="relative pt-12 pb-12 bg-white">
      {/* Background Elements Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Panoramic Background Texture */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.4em]">
            <Microscope className="h-4 w-4" /> Accredited Facilities
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
             Discover our Trusted <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Laboratory Partner</span>
          </h1>
          <p className="text-slate-500 text-base font-medium max-w-xl leading-relaxed opacity-80">
             Discover our network of trusted laboratory partners certified to national and international standards, including NABL, FSSAI, ISO/IEC 17025, BIS, APEDA, EIC, and other industry-specific accreditations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div ref={wrapperRef} className="relative flex-1 group z-50">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32F2F] transition-colors" />
              <Input 
                 placeholder="Search labs or cities..." 
                 className="pl-10 h-10 rounded-xl text-sm border-slate-100 bg-white shadow-sm focus:border-[#D32F2F]/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all" 
                 value={search} 
                 onChange={handleSearchChange} 
                 onFocus={() => setShowSuggestions(true)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') handleExploreClick();
                 }}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && search.trim() !== "" && (
                <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  {filteredSuggestions.length > 0 ? (
                    <div className="py-2">
                      {filteredSuggestions.map((lab) => (
                        <div 
                          key={lab.id}
                          onClick={() => handleSuggestionClick(lab.id)}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#D32F2F]/10 transition-colors">
                              <FlaskConical className="h-4 w-4 text-slate-400 group-hover:text-[#D32F2F]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{lab.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {lab.city}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-medium text-slate-500">
                      No labs found matching "{search}"
                    </div>
                  )}
                </div>
              )}
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-40 lg:w-44 h-10 rounded-xl border-slate-100 bg-white shadow-sm font-semibold text-xs tracking-widest text-slate-600 uppercase focus:ring-0 focus:ring-offset-0 focus:outline-none">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c} value={c} className="text-xs font-semibold uppercase tracking-widest">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleExploreClick} className="w-full sm:w-auto h-10 px-5 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 group/btn hover:scale-[1.02] active:scale-95">
              Explore <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
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
