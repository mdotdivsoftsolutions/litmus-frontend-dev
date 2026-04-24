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
      
      {/* Certificate-style card grid: label + 2-line content below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {EXPERTISE_DATA.map((row, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#D32F2F]/20 transition-all duration-300"
          >
            {/* Certificate-style header with accent bar */}
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-1 h-8 w-1 rounded-full bg-gradient-brand shrink-0" />
              <h3 className="text-sm font-bold text-[#D32F2F] leading-snug">{row.label}</h3>
            </div>
            {/* 2-line content below */}
            <p className="text-sm text-slate-600 leading-relaxed pl-[19px] line-clamp-2">
              {row.areas}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
