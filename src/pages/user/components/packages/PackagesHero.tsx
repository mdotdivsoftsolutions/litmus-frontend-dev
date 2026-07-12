import { Shield, Search, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PackagesHeroProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  search: string;
  setSearch: (val: string) => void;
  packages?: any[];
  onSearch?: () => void;
}

export function PackagesHero({ categories, selectedCategory, setSelectedCategory, search, setSearch, packages = [], onSearch }: PackagesHeroProps) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (packageId: string) => {
    setShowSuggestions(false);
    navigate(`/packages/${packageId}`);
  };

  const handleExploreClick = () => {
    setShowSuggestions(false);
    if (onSearch) onSearch();
  };

  const filteredSuggestions = search.trim() === "" 
    ? [] 
    : packages.filter(p => p.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  return (
    <div className="relative bg-white py-6 md:py-10 flex flex-col justify-center border-b border-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cinematic Background Elements */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Soft Grid Blueprint Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full ">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Information Control Center */}
          <div className="flex-1 text-center lg:text-left space-y-6 py-8 lg:py-0 group">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
              <Shield className="h-4 w-4" /> Curated Diagnostic Bundles
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight animate-slide-up">
                Recommended. {" "}
                 <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Food Testing Packages</span>
              </h1>
              <p className="text-slate-500 text-base lg:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Simplify your testing journey with ready-to-book packages developed by food safety experts. Whether you're launching a new product, meeting regulatory requirements, or conducting routine quality checks, we've got the right testing panel for you.
              </p>
            </div>

            {/* Panoramic Search Bar */}
            <div ref={wrapperRef} className="relative z-50">
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-xl mx-auto lg:mx-0 ring-4 ring-slate-400/5 hover:ring-slate-400/10 transition-all">
                <div className="relative flex-1 w-full pl-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-[#D32F2F] transition-colors" />
                  <Input
                    placeholder="Search diagnostic packages..."
                    className="h-10 sm:h-10 pl-12 pr-6 border-none bg-transparent text-slate-800 placeholder:text-slate-300 text-base sm:text-lg focus-visible:ring-0 shadow-none font-medium"
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExploreClick();
                    }}
                  />
                </div>
                <Button onClick={handleExploreClick} className="w-full sm:w-auto h-10 sm:h-10 px-6  bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-bold rounded-2xl text-base shadow-[0_12px_24px_rgba(211,47,47,0.25)] transition-all flex items-center gap-3 group/btn hover:scale-[1.02] active:scale-95">
                  Explore <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && search.trim() !== "" && (
                <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  {filteredSuggestions.length > 0 ? (
                    <div className="py-2">
                      {filteredSuggestions.map((pkg) => (
                        <div 
                          key={pkg._id}
                          onClick={() => handleSuggestionClick(pkg._id)}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#D32F2F]/10 transition-colors">
                              <Search className="h-4 w-4 text-slate-400 group-hover:text-[#D32F2F]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{pkg.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D32F2F]">{pkg.category?.name || "PACKAGE"}</span>
                                {pkg.tat && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> {pkg.tat}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {pkg.mrp && pkg.mrp > pkg.price && (
                              <span className="text-[10px] text-slate-400 line-through mr-2">₹{pkg.mrp}</span>
                            )}
                            <span className="text-sm font-black text-slate-800">₹{pkg.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-medium text-slate-500">
                      No packages found matching "{search}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category selection buttons in the hero section */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                        "px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm border",
                        selectedCategory === cat 
                            ? "bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white border-transparent" 
                            : "bg-white text-slate-400 hover:text-slate-800 border-slate-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Quick Trust Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-2">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">150+</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">Parameters</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">₹2400</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">Starts from</span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-emerald-500 tracking-tighter flex items-center gap-1.5 ">
                  Live <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-100" />
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1 font-semibold">Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Lab Visual / Video */}
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] pointer-events-none z-0">
                 <iframe 
                   className="w-full h-full pointer-events-none"
                   src="https://www.youtube.com/embed/6k2Pq-dV_gI?si=s5H0X70H1Q_32j2B&controls=0&rel=0&modestbranding=1&showinfo=0&autoplay=1&mute=1&start=4&end=30&iv_load_policy=3" 
                   title="Litmus Diagnostics Tour"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   style={{ border: 'none' }}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

