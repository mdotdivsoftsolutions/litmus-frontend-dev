import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Milk, Coffee, Wheat, Flame, Droplets, Drumstick, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

const quickCategories = [
  { 
    label: "Dairy & Products", 
    desc: "Comprehensive safety checks for milk, cheese, and butter.",
    tests: 12,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Spices & Condiments", 
    desc: "Adulteration and purity testing for masala, herbs, and whole spices.",
    tests: 24,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Edible Oils & Fats", 
    desc: "Quality analysis and shelf-life testing for cooking oils and ghee.",
    tests: 8,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Meat & Poultry", 
    desc: "Pathogen detection and freshness verification for meat products.",
    tests: 16,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Grains & Cereals", 
    desc: "Pesticide residue and nutritional profiling for staples.",
    tests: 18,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Snacks & Sweets", 
    desc: "Preservative and trans-fat analysis for packaged goods.",
    tests: 10,
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=600&auto=format&fit=crop" 
  },
];

const categoryGrid = [
  { name: "Dairy Products", count: 120, icon: Milk, gradient: "from-[#D32F2F] to-[#E53935]" },
  { name: "Beverages", count: 85, icon: Coffee, gradient: "from-[#F06C00] to-[#E53935]" },
  { name: "Grains & Cereals", count: 210, icon: Wheat, gradient: "from-[#E53935] to-[#D32F2F]" },
  { name: "Spices", count: 145, icon: Flame, gradient: "from-[#F06C00] to-[#FF8F00]" },
];

export function HomeCategories() {
  return (
    <>
      <section className="py-24 pb-32 relative overflow-hidden min-h-[80vh] flex flex-col justify-center bg-white border-slate-100">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-red-50/50 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
             <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
                  Most Booked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Packages</span>
                </h2>
                <p className="text-slate-500 mt-3 text-lg">Explore our highly certified, industry-standard testing categories.</p>
             </div>
             <span className="text-[#D32F2F] font-medium text-sm cursor-pointer hover:underline flex items-center gap-1 group whitespace-nowrap bg-red-50 px-4 py-2 rounded-full border border-red-100">
               Explore All Categories <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categoryGrid.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/tests?category=${cat.name}`}
                className="group relative h-[320px] rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden bg-white border-2 border-slate-100 transition-all duration-500 hover:border-[#D32F2F]/30 hover:shadow-[0_20px_60px_rgba(211,47,47,0.1)] hover:-translate-y-2"
              >
                <div className="relative z-10">
                  <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg text-white mb-6 bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", cat.gradient)}>
                    <cat.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-800 leading-tight mb-2 group-hover:text-[#D32F2F] transition-colors">{cat.name}</h3>
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-xs font-semibold text-slate-600">{cat.count}+ Verified Tests</p>
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto flex items-center justify-between border-t border-slate-100 pt-5 group-hover:border-[#D32F2F]/10 transition-colors">
                   <span className="text-sm font-semibold text-slate-500 group-hover:text-[#D32F2F] transition-colors">View Details</span>
                   <div className="h-10 w-10 text-[#D32F2F] bg-red-50 rounded-full flex items-center justify-center group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                      <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 min-h-screen flex flex-col justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50/30 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#D32F2F] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  Clinical Specialities
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                  Tests By Food <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">Category</span>
                </h2>
                <p className="text-slate-500 mt-4 text-lg max-w-xl">Architected for precision. Explore our expansive catalogue of specialized diagnostic tests across every food industry vertical.</p>
             </div>
             <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                   <span className="text-2xl font-bold text-slate-800">150+</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Verified Tests</span>
                </div>
                <span className="text-[#D32F2F] font-medium text-sm cursor-pointer hover:underline flex items-center gap-1 group whitespace-nowrap bg-red-50 px-6 py-3 rounded-full border border-red-100 shadow-sm transition-all">
                  Explore Full Catalogue <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
             {/* Left Column: Featured Large Card */}
             <div className="lg:col-span-5">
                <Link to={`/tests?category=${quickCategories[0].label}`} className="group relative h-full min-h-[500px] lg:min-h-full rounded-[2.5rem] overflow-hidden flex flex-col bg-slate-900 shadow-2xl transition-all duration-700 hover:-translate-y-2">
                   <img src={quickCategories[0].image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                   
                   <div className="mt-auto relative z-10 p-10 lg:p-12">
                      <div className="flex items-center gap-3 mb-6">
                         <span className="h-px w-12 bg-[#D32F2F]" />
                         <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">Featured Speciality</span>
                      </div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 group-hover:text-red-50 transition-colors">{quickCategories[0].label}</h3>
                      <p className="text-lg text-slate-300 leading-relaxed max-w-sm mb-8">{quickCategories[0].desc}</p>
                      <div className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs group-hover:gap-5 transition-all">
                         Discover {quickCategories[0].tests} Specialized Tests <ArrowRight className="h-5 w-5 text-[#D32F2F]" />
                      </div>
                   </div>
                </Link>
             </div>

             {/* Right Column: Grid of Small Cards */}
             <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {quickCategories.slice(1).map((cat, idx) => (
                  <Link key={idx} to={`/tests?category=${cat.label}`} className="group relative h-[320px] rounded-[2rem] bg-white border border-slate-100 overflow-hidden flex flex-col shadow-sm hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500">
                     <div className="h-[45%] w-full relative overflow-hidden">
                        <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-4 left-4 h-9 px-3 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-sm">
                           <span className="text-[10px] font-black text-slate-800 tracking-tight">{cat.tests} Tests</span>
                        </div>
                     </div>
                     <div className="p-8 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#D32F2F] transition-colors">{cat.label}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed flex-1">{cat.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-[#D32F2F] transition-colors">Specialized Analysis</span>
                           <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#D32F2F] group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
