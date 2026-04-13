import { useState } from "react";
import { Package, Shield, Clock, ArrowRight, Activity, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WhyLitmusTests } from "./components/tests-listing/WhyLitmusTests";

const packages = [
  {
    id: "pkg-1",
    name: "Complete FSSAI Basic Shield",
    description: "Essential testing parameters for small-scale food manufacturers and home bakers.",
    testCount: 12,
    price: 4999,
    mrp: 8500,
    tat: "3-5 Days",
    category: "Compliance",
    tag: "Most Popular",
    features: ["Microbial Load Analysis", "Moisture & Ash Content", "Heavy Metal Screening", "Shelf Life Prediction"]
  },
  {
    id: "pkg-2",
    name: "Advanced Beverage Purity",
    description: "Comprehensive screening for water, soft drinks, and alcoholic beverages.",
    testCount: 24,
    price: 8999,
    mrp: 15600,
    tat: "4-6 Days",
    category: "Clinical",
    tag: "Comprehensive",
    features: ["Pathogen Detection", "Chemical Additive Test", "Pesticide Residue Analysis", "pH & Stability Test"]
  },
  {
    id: "pkg-3",
    name: "Nutritional Labeling Gold",
    description: "Complete nutrition panel for retail packaging and export compliance.",
    testCount: 8,
    price: 3499,
    mrp: 5200,
    tat: "3 Days",
    category: "Labeling",
    tag: "Fastest Delivery",
    features: ["Calorie Counter", "Fat Profile (Saturated/Trans)", "Sodium & Sugars", "Protein Content"]
  },
  {
    id: "pkg-4",
    name: "Exporter's Safety Panel",
    description: "Global standards compliance (EU/FDA) for international food shipments.",
    testCount: 45,
    price: 18999,
    mrp: 28000,
    tat: "7-10 Days",
    category: "Compliance",
    tag: "Premium",
    features: ["Aflatoxin Screening", "Multi-Residual Pesticides", "Antibiotic Screening", "Genetically Modified Organisms (GMO)"]
  }
];

export default function PackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(2);
  const categories = ["All", "Compliance", "Clinical", "Labeling"];

  const filteredPackages = selectedCategory === "All"
    ? packages
    : packages.filter(p => p.category === selectedCategory);

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="animate-fade-in font-manrope bg-white min-h-screen">
      {/* 1. VIBRANT PANORAMIC HERO */}
      <section className="relative py-24 overflow-hidden bg-white min-h-[85vh] flex flex-col items-center justify-center">
        {/* Cinematic Background Transitions */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.4em] mb-8">
               <Shield className="h-4 w-4" /> Curated Diagnostic Bundles
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight mb-8">
               Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Clinical Packages</span> <br />
               for Modern Safe Brands.
            </h1>
            <p className="text-slate-500 text-lg  font-medium max-w-3xl mx-auto mb-12 leading-relaxed opacity-80">
               Direct access to NABL-accredited diagnostic panels designed for end-to-end food safety, quality verification, and export compliance.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm",
                    selectedCategory === cat 
                      ? "bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white" 
                      : "bg-white text-slate-400 hover:text-slate-800 border border-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>
      </section>

      {/* 2. PACKAGES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPackages.slice(0, visibleCount).map((pkg) => (
            <div key={pkg.id} className="group bg-white rounded-[3rem] p-8 border-2 border-slate-50 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-[#D32F2F]/20 transition-all duration-500 flex flex-col items-start lg:flex-row lg:items-stretch gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{pkg.category}</span>
                  {pkg.tag && (
                    <span className="bg-red-50 text-[#D32F2F] text-[10px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{pkg.tag}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors">{pkg.name}</h3>
                  <p className="text-slate-500 mt-2 font-medium text-sm leading-relaxed">{pkg.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-[#F06C00]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Parameters</p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{pkg.testCount}+ Items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                    <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#D32F2F]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase leading-none">Reports</p>
                      <p className="text-sm font-semibold text-slate-800 mt-1">{pkg.tat}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-slate-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-48 bg-slate-50 rounded-[2rem] p-6 flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <span className="text-xs text-slate-400 line-through font-semibold block">₹{pkg.mrp.toLocaleString()}</span>
                  <span className="text-3xl font-semibold text-slate-800 block mt-1 tracking-tighter">₹{pkg.price.toLocaleString()}</span>
                  <span className="inline-block mt-3 bg-emerald-100 text-emerald-600 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
                    {discountPct(pkg.price, pkg.mrp)}% SAVING
                  </span>
                </div>
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm shadow-[0_12px_24px_rgba(211,47,47,0.3)] hover:shadow-[0_16px_32px_rgba(211,47,47,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all">
                  Book Panel
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length > visibleCount && (
           <div className="mt-20 flex justify-center">
              <Button 
                onClick={() => setVisibleCount(prev => prev + 2)}
                variant="outline" 
                className="h-12 px-10 rounded-xl border-slate-200 text-slate-500 hover:text-[#D32F2F] hover:border-[#D32F2F]/20 font-semibold text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-3 bg-white shadow-sm hover:shadow-md"
              >
                Discover More Packages <ArrowRight className="h-4 w-4" />
              </Button>
           </div>
        )}
      </div>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 pt-12 ">
        <div className="relative rounded-[1rem] bg-gradient-to-br from-[#D32F2F] to-[#F06C00] p-12  overflow-hidden ">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-white/10 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-4xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
              Not sure which package fits your needs?
            </h2>
            <p className="text-white/80 text-md font-medium leading-relaxed">
              Connect with our clinical experts for a personalized diagnostic roadmap tailored to your industry and requirements.
            </p>
            <Button size="lg" className="h-12 px-8 bg-white text-red-600 hover:bg-slate-50 font-black uppercase text-xs tracking-widest rounded-xl flex items-center gap-4 transition-all hover:scale-[1.02] shadow-xl">
              Get Expert Advice <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
