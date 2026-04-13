const POPULAR_LINKS = [
  "Dairy Purity Test Price", "Milk Adulteration Test", "Spice Microbial Analysis", "Aflatoxin Testing Price", "Heavy Metal Profile",
  "Meat DNA Testing", "FSSAI Compliance Audit", "Shelf Life Study Price", "Water Potability Test", "Residue Analysis Lab",
  "Nutritional Labeling Test", "Gluten Free Certification", "Organic Product Validity", "Honey Purity Analysis", "Oil Saponification Value",
  "Pesticide Residue Scan", "Salmonella Detection", "Listeria Mono Test", "Moisture Content Test", "Total Plate Count Lab",
  "Trans Fat Analysis", "Calories Testing", "Protein Content Profile", "Fatty Acid Analysis", "Acid Insoluble Ash",
  "Color Adulteration Test", "Starch Detection in Milk", "Brix Value Analysis", "Essential Oil Content", "Fiber Content Test"
];

export function FooterSearchLinks() {
  return (
    <section className="bg-white  border-slate-100  py-12 md:py-16 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="grid grid-cols-6 gap-y-2 gap-x-4">
          <div className="col-span-6 border-b border-slate-100 pb-3 mb-2">
            <h3 className="text-lg font-bold text-slate-800">Popular Diagnostic Tests & Audits</h3>
          </div>
          {POPULAR_LINKS.map((link, i) => (
            <div key={i} className="text-[12px] text-slate-500 hover:text-[#D32F2F] cursor-pointer transition-colors whitespace-nowrap overflow-hidden text-ellipsis px-1">
              {link}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
