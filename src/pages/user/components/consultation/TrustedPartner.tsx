export function TrustedPartner() {
  return (
    <section className="pt-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-3">
             Litmus Food Analytics - Your Trusted Safety Partner
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Litmus brings the accuracy of world-class food diagnostic labs straight to your business. Whether you are a small cafe or a large food manufacturer, every test is delivered with absolute precision. From routine moisture tests to specialized pathogen panels, our mission is to make food safety premium, accessible, and simple. With over <strong className="text-slate-800 font-bold">50,000+ tests completed</strong> across India, we are your speed, accuracy, and trust partner.
          </p>
        </div>

        {/* Sectors Table */}
        <div className="mb-16 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
           <table className="w-full text-left text-sm md:text-base border-collapse">
             <thead>
                <tr className="bg-slate-900 text-white">
                   <th className="py-4 px-6 font-semibold w-1/3 text-xs tracking-wider uppercase">SAFETY AUDIT EXPERTISE</th>
                   <th className="py-4 px-6 font-semibold w-2/3 border-l border-slate-700 text-xs tracking-wider uppercase">INDUSTRY SECTORS WE SERVE</th>
                </tr>
             </thead>
             <tbody className="text-slate-600">
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                   <td className="py-4 px-6 font-semibold text-[#D32F2F]">Diagnostic Center for Dairy in Bangalore</td>
                   <td className="py-4 px-6 border-l border-slate-100">Dairy farmers, Milk processing plants, Cheese manufacturers, Paneer & Ghee units, Retailers.</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                   <td className="py-4 px-6 font-semibold text-[#D32F2F]">Food Safety Audit Center in Mumbai</td>
                   <td className="py-4 px-6 border-l border-slate-100">Restaurants, cloud kitchens, hotels, catering services, and large-scale industrial canteens.</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                   <td className="py-4 px-6 font-semibold text-[#D32F2F]">Spices Testing Lab in Guntur</td>
                   <td className="py-4 px-6 border-l border-slate-100">Masala exporters, whole spice traders, powder manufacturers, and organic spice collectives.</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                   <td className="py-4 px-6 font-semibold text-[#D32F2F]">Meat & Poultry Labs in Hyderabad</td>
                   <td className="py-4 px-6 border-l border-slate-100">Fresh meat retailers, processing units, export houses, and seafood processing plants.</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                   <td className="py-4 px-6 font-semibold text-[#D32F2F]">Bakery & Confectionery Labs in Delhi</td>
                   <td className="py-4 px-6 border-l border-slate-100">Artisanal bakeries, pastry chains, chocolate manufacturers, and snack production units.</td>
                </tr>
             </tbody>
           </table>
        </div>

        {/* Why Choose Litmus */}
        <div>
           <h3 className="text-xl font-bold text-slate-800 mb-6">
             Why Choose Litmus Testing Over Direct Labs?
           </h3>
           <ul className="space-y-4">
              <li className="flex items-start gap-3">
                 <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed"><strong className="text-slate-800">Fastest Turnaround:</strong> Digital reports delivered in as little as 3-5 working days, direct to your dashboard.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed"><strong className="text-slate-800">Premium Logistics:</strong> Skilled collection agents with specialized training, ensuring safe and cold-chain sample transport.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed"><strong className="text-slate-800">NABL Quality:</strong> Strictly partnered with ISO certified, FSSAI approved labs using advanced diagnostic technology.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed"><strong className="text-slate-800">Verified Trust:</strong> Recommended by 500+ industry experts and trusted by 50,000+ food businesses nationwide.</p>
              </li>
              <li className="flex items-start gap-3">
                 <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                 <p className="text-slate-600 text-sm md:text-base leading-relaxed"><strong className="text-slate-800">Transparent Billing:</strong> Unified pricing for all tests with no hidden sample collection or reporting charges.</p>
              </li>
           </ul>
        </div>

      </div>
    </section>
  );
}
