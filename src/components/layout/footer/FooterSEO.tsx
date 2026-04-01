import { Link } from "react-router-dom";
import { Shield, Package, FileText, Zap, Stethoscope, Check, ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function FooterSEO() {
  return (
    <section className="bg-white border-t border-slate-100 pt-20 pb-16 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust & Diagnostic Centers Section */}
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
            {[
              { label: "Diagnostic Center for Dairy in Bangalore", areas: "Dairy farmers, Milk processing plants, Cheese manufacturers, Paneer & Ghee units, Retailers." },
              { label: "Food Safety Audit Center in Mumbai", areas: "Restaurants, cloud kitchens, hotels, catering services, and large-scale industrial canteens." },
              { label: "Spices Testing Lab in Guntur", areas: "Masala exporters, whole spice traders, powder manufacturers, and organic spice collectives." },
              { label: "Meat & Poultry Labs in Hyderabad", areas: "Fresh meat retailers, processing units, export houses, and seafood processing plants." },
              { label: "Bakery & Confectionery Labs in Delhi", areas: "Artisanal bakeries, pastry chains, chocolate manufacturers, and snack production units." },
            ].map((row, i) => (
              <div key={i} className={cn("grid grid-cols-12 text-sm p-4 items-center border-t border-slate-100", i % 2 === 0 ? "bg-white" : "bg-slate-50")}>
                <div className="col-span-4 pl-4 font-bold text-[#D32F2F]">{row.label}</div>
                <div className="col-span-8 pl-4 border-l border-slate-200 text-slate-600 leading-relaxed italic">{row.areas}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="mb-10 bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D32F2F]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
           <h2 className="text-2xl font-bold text-slate-800 mb-10">How to Book a Food Safety Test</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Book Online", desc: "Select your food category and specific tests from our intuitive marketplace." },
                { step: "02", title: "Schedule Pickup", desc: "Our trained collection agents will reach you within hours to collect samples safely." },
                { step: "03", title: "Lab Processing", desc: "Samples are analyzed in NABL-accredited labs using state-of-the-art diagnostic tools." },
                { step: "04", title: "Get Digital Report", desc: "Receive your FSSAI-compliant certified digital reports within 3-5 working days." },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <span className="text-5xl font-black text-slate-200/50 mb-4 block leading-none">{s.step}</span>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Why Choose Litmus Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Litmus Testing Over Direct Labs?</h2>
          <ul className="space-y-4">
            {[
              { title: "Fastest Turnaround", desc: "Digital reports delivered in as little as 3-5 working days, direct to your dashboard." },
              { title: "Premium Logistics", desc: "Skilled collection agents with specialized training, ensuring safe and cold-chain sample transport." },
              { title: "NABL Quality", desc: "Strictly partnered with ISO certified, FSSAI approved labs using advanced diagnostic technology." },
              { title: "Verified Trust", desc: "Recommended by 500+ industry experts and trusted by 50,000+ food businesses nationwide." },
              { title: "Transparent Billing", desc: "Unified pricing for all tests with no hidden sample collection or reporting charges." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
                <p className="text-slate-600"><strong className="text-slate-800 font-bold">{item.title}:</strong> {item.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="mb-10 border-t border-slate-100 pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8 max-w-4xl">
            {[
              { q: "In how many cities does Litmus provide food testing services?", a: "Litmus currently provides seamless sample collection and diagnostic services in all major metro cities including Chennai, Mumbai, Delhi, Bangalore, Hyderabad, and Kolkata." },
              { q: "Do I need to visit a physical laboratory for testing?", a: "No, Litmus is a digital-first platform. You can book every test online, and our team will handle the professional doorstep collection of your food samples." },
              { q: "What are the standard hours for sample collection?", a: "Our sample collection windows are flexible, typically operating from 8:00 AM to 6:00 PM. You can choose a specific time slot that fits your business operations." },
              { q: "Can I track the status of my food safety audit?", a: "Absolutely. Once your sample is collected, you can track it in real-time through your Litmus dashboard from 'Pickup' to 'In-Lab' to 'Report Generated'." },
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Q{i+1}</p>
                <h4 className="text-base font-bold text-slate-800">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Massive Link Grid */}
        <div className="grid grid-cols-6 gap-y-2 gap-x-4">
           <div className="col-span-6 border-b border-slate-100 pb-3 mb-2">
              <h3 className="text-lg font-bold text-slate-800">Popular Diagnostic Tests & Audits</h3>
           </div>
           {[
             "Dairy Purity Test Price", "Milk Adulteration Test", "Spice Microbial Analysis", "Aflatoxin Testing Price", "Heavy Metal Profile",
             "Meat DNA Testing", "FSSAI Compliance Audit", "Shelf Life Study Price", "Water Potability Test", "Residue Analysis Lab",
             "Nutritional Labeling Test", "Gluten Free Certification", "Organic Product Validity", "Honey Purity Analysis", "Oil Saponification Value",
             "Pesticide Residue Scan", "Salmonella Detection", "Listeria Mono Test", "Moisture Content Test", "Total Plate Count Lab",
             "Trans Fat Analysis", "Calories Testing", "Protein Content Profile", "Fatty Acid Analysis", "Acid Insoluble Ash",
             "Color Adulteration Test", "Starch Detection in Milk", "Brix Value Analysis", "Essential Oil Content", "Fiber Content Test"
           ].map((link, i) => (
             <div key={i} className="text-[12px] text-slate-500 hover:text-[#D32F2F] cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis px-1">
               {link}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
