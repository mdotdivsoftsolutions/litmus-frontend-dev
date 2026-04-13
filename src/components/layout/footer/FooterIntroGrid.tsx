import { cn } from "@/lib/utils";

const EXPERTISE_DATA = [
  { label: "Diagnostic Center for Dairy in Bangalore", areas: "Dairy farmers, Milk processing plants, Cheese manufacturers, Paneer & Ghee units, Retailers." },
  { label: "Food Safety Audit Center in Mumbai", areas: "Restaurants, cloud kitchens, hotels, catering services, and large-scale industrial canteens." },
  { label: "Spices Testing Lab in Guntur", areas: "Masala exporters, whole spice traders, powder manufacturers, and organic spice collectives." },
  { label: "Meat & Poultry Labs in Hyderabad", areas: "Fresh meat retailers, processing units, export houses, and seafood processing plants." },
  { label: "Bakery & Confectionery Labs in Delhi", areas: "Artisanal bakeries, pastry chains, chocolate manufacturers, and snack production units." },
];

export function FooterIntroGrid() {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Litmus Food Analytics - Your Trusted Safety Partner</h2>
      <p className="text-slate-500 text-sm leading-relaxed max-w-5xl mb-8">
        Litmus brings the accuracy of world-class food diagnostic labs straight to your business. Whether you are a small cafe or a large food manufacturer, every test is delivered with absolute precision. From routine moisture tests to specialized pathogen panels, our mission is to make food safety premium, accessible, and simple. With over <strong>50,000+ tests completed</strong> across India, we are your speed, accuracy, and trust partner.
      </p>
      
      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider p-4">
          <div className="col-span-4 pl-4">Safety Audit Expertise</div>
          <div className="col-span-8 pl-4 border-l border-white/10">Industry Sectors We Serve</div>
        </div>
        {EXPERTISE_DATA.map((row, i) => (
          <div key={i} className={cn("grid grid-cols-12 text-sm p-4 items-center border-t border-slate-100", i % 2 === 0 ? "bg-white" : "bg-slate-50")}>
            <div className="col-span-4 pl-4 font-bold text-[#D32F2F]">{row.label}</div>
            <div className="col-span-8 pl-4 border-l border-slate-200 text-slate-600 leading-relaxed italic">{row.areas}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
