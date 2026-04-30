import { Activity, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const packagesData = [
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
  },
  {
    id: "pkg-5",
    name: "Dairy Adulteration Check",
    description: "Rapid screening for common dairy adulterants and synthetic milk indicators.",
    testCount: 15,
    price: 2499,
    mrp: 4000,
    tat: "2-3 Days",
    category: "Clinical",
    tag: "Essential",
    features: ["Urea & Detergent Test", "Starch & Melamine Check", "Fat & SNF Ratio", "Antibiotic Residue"]
  },
  {
    id: "pkg-6",
    name: "Organic Certification Panel",
    description: "Rigorous testing to validate organic claims for premium retail products.",
    testCount: 60,
    price: 24999,
    mrp: 35000,
    tat: "10-14 Days",
    category: "Compliance",
    tag: "Specialized",
    features: ["Zero Pesticide Validation", "Heavy Metal Screen", "Synthetic Fertilizer Check", "Non-GMO Verification"]
  },
  {
    id: "pkg-7",
    name: "Shelf Life Stability Test",
    description: "Accelerated testing to accurately predict and print product expiry dates.",
    testCount: 10,
    price: 7999,
    mrp: 12000,
    tat: "21 Days",
    category: "Labeling",
    tag: "Crucial",
    features: ["Rancidity Analysis", "Microbial Spoilage", "Organoleptic Evaluation", "Moisture Migration"]
  },
  {
    id: "pkg-8",
    name: "Allergen Identification",
    description: "Screening for major food allergens (nuts, gluten, soy, dairy).",
    testCount: 8,
    price: 5499,
    mrp: 8000,
    tat: "5 Days",
    category: "Clinical",
    tag: "Safety",
    features: ["Gluten Detection", "Peanut/Tree Nut Screen", "Soy Protein Check", "Dairy Allergen Test"]
  },
  {
    id: "pkg-9",
    name: "Water Quality & Potability",
    description: "Comprehensive testing of water used in food processing and manufacturing.",
    testCount: 30,
    price: 3999,
    mrp: 6000,
    tat: "4 Days",
    category: "Compliance",
    tag: "Basic Needs",
    features: ["E. Coli & Coliforms", "pH & TDS levels", "Hardness & Alkalinity", "Heavy Metal Traces"]
  },
  {
    id: "pkg-10",
    name: "Spices & Condiments Purity",
    description: "Targeted analysis for artificial colors, bulk adulterants, and purity.",
    testCount: 18,
    price: 4500,
    mrp: 7000,
    tat: "5-7 Days",
    category: "Clinical",
    tag: "Popular",
    features: ["Sudan Dye Test", "Ash Content", "Volatile Oil Content", "Extraneous Matter"]
  },
  {
    id: "pkg-11",
    name: "Vegan Product Validation",
    description: "Testing to ensure zero animal derivatives in plant-based food products.",
    testCount: 12,
    price: 8500,
    mrp: 13000,
    tat: "7 Days",
    category: "Labeling",
    tag: "Trending",
    features: ["Animal DNA Screening", "Dairy Trace Detection", "Egg Protein Check", "Honey/Beeswax Screen"]
  },
  {
    id: "pkg-12",
    name: "Meat & Poultry Safety",
    description: "Microbial and residue testing for fresh and processed meat products.",
    testCount: 22,
    price: 11999,
    mrp: 18000,
    tat: "6 Days",
    category: "Clinical",
    tag: "High Priority",
    features: ["Salmonella & Listeria", "Veterinary Drug Residues", "Hormone Traces", "Bone & Cartilage Content"]
  }
];

interface PackagesGridProps {
  search: string;
  selectedCategory: string;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}

export function PackagesGrid({ search, selectedCategory, visibleCount, setVisibleCount }: PackagesGridProps) {
  const filteredPackages = packagesData.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.slice(0, visibleCount).map((pkg) => (
          <div key={pkg.id} className="group bg-white rounded-[1rem] p-5 md:p-6 border-2 border-slate-50 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-[#D32F2F]/20 transition-all duration-500 flex flex-col gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{pkg.category}</span>
                {pkg.tag && (
                  <span className="bg-red-50 text-[#D32F2F] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{pkg.tag}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors">{pkg.name}</h3>
                <p className="text-slate-500 mt-1 font-medium text-xs leading-relaxed line-clamp-2">{pkg.description}</p>
              </div>

              <div className="flex gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-[#F06C00]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Parameters</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{pkg.testCount}+ Items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                  <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#D32F2F]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Reports</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{pkg.tat}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-600 text-nowrap font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 line-through font-bold block">₹{pkg.mrp.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-800 tracking-tighter">₹{pkg.price.toLocaleString()}</span>
                  <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-200">
                    {discountPct(pkg.price, pkg.mrp)}% Off
                  </span>
                </div>
              </div>
              <Button className="h-10 px-6 rounded-lg bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-bold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                Book Panel
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length > visibleCount && (
         <div className="mt-12 flex justify-center">
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
  );
}
