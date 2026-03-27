import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Clock, CheckCircle2, Shield, Star, ArrowRight, Package, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Cookie } from "lucide-react";
import { products, categories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const testTypes = ["Physical", "Chemical", "Microbiological"];
const categoryPills = ["All", "Dairy", "Beverages", "Grains & Cereals", "Spices", "Meat & Poultry", "Oils & Fats", "Processed Foods", "Snacks"];

const iconMap: Record<string, React.ElementType> = {
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame, drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

const featuredTests = [
  { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical" },
  { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical" },
  { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological" },
  { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical" },
];

export default function TestsListingPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const filters = [
    ...(selectedCategory && selectedCategory !== "All" ? [{ label: selectedCategory, clear: () => setSelectedCategory("All") }] : []),
    ...(selectedType ? [{ label: selectedType, clear: () => setSelectedType("") }] : []),
  ];

  const filtered = products.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="animate-fade-in">
      {/* Mini Hero Banner */}
      <div className="bg-flame-red-tint">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Book Food Product Tests</h1>
            <p className="text-sm text-muted-foreground">FSSAI certified, NABL accredited results</p>
            <p className="text-lg font-bold text-primary">Starting at ₹800</p>
            <Button className="bg-primary hover:bg-primary-deep rounded-lg font-semibold" asChild>
              <Link to="/tests/1">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 sm:gap-8 overflow-x-auto text-xs sm:text-sm text-muted-foreground">
          <span className="shrink-0 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-litmus-teal" />NABL Accredited</span>
          <span className="shrink-0 flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />3–5 Day Reports</span>
          <span className="shrink-0 flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" />FSSAI Certified</span>
          <span className="shrink-0 flex items-center gap-1.5"><Star className="h-4 w-4 text-flame-amber" />4.8 Rating</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryPills.map((pill) => (
            <button key={pill} onClick={() => setSelectedCategory(pill)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === pill
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border hover:border-accent"
              )}>
              {pill}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search for a product or test..." className="pl-10 h-11 rounded-full border-border text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40 rounded-full h-11 text-sm"><SelectValue placeholder="Test Type" /></SelectTrigger>
              <SelectContent>
                {testTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 rounded-full h-11 text-sm"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Booked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters */}
        {filters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <Badge key={f.label} className="bg-primary text-primary-foreground gap-1 px-3 py-1 rounded-full cursor-pointer" onClick={f.clear}>
                {f.label} <X className="h-3 w-3" />
              </Badge>
            ))}
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => { setSelectedCategory("All"); setSelectedType(""); }}>Clear All</button>
          </div>
        )}

        {/* Most Booked section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Most Booked Tests</h2>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-3">
              {featuredTests.map((t) => (
                <div key={t.id} className="bg-card rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-accent">
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.method}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-flame-red-tint text-primary border-0 text-[10px]">{t.type}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.tat}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground line-through">₹{t.mrp.toLocaleString()}</span>
                    <span className="ml-1.5 font-bold text-primary">₹{t.price.toLocaleString()}</span>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] ml-1">{discountPct(t.price, t.mrp)}% Off</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 rounded-lg border-primary text-primary hover:bg-flame-red-tint text-xs" asChild>
                    <Link to={`/tests/${t.id}`}>Add</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {categories.slice(0, 4).map((cat) => {
                const IconComp = iconMap[cat.icon] || Package;
                const bgColors = ["bg-flame-amber-tint", "bg-flame-red-tint", "bg-litmus-mint", "bg-flame-orange-tint"];
                const idx = categories.indexOf(cat);
                return (
                  <Link key={cat.id} to={`/tests?category=${cat.name}`}
                    className={cn("rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center hover:scale-[1.02] transition-transform", bgColors[idx % 4])}>
                    <IconComp className="h-8 w-8 text-foreground" />
                    <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Test Packages from ₹800</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const price = p.testCount * 150;
              const mrp = p.testCount * 260;
              return (
                <div key={p.id} className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 space-y-3">
                    <Badge className="bg-flame-amber-tint text-accent border-0 text-xs">{p.category}</Badge>
                    <h3 className="font-semibold text-foreground">{p.name} Test Panel</h3>
                    <p className="text-sm text-muted-foreground">{p.testCount} tests included</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{discountPct(price, mrp)}% Off</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Reports in 3 days</p>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold" size="sm" asChild>
                      <Link to={`/tests/${p.id}`}>Add to Cart</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Tests by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Package;
              return (
                <Link key={cat.id} to={`/tests?category=${cat.name}`}
                  className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:bg-flame-red-tint/30 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-flame-red-tint flex items-center justify-center shrink-0">
                    <IconComp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} products</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Why Litmus */}
        <div className="bg-card rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Why Litmus Food Analytics?</h2>
              {[
                "NABL accredited partner labs across India",
                "Reports delivered in 3–5 working days",
                "100% FSSAI compliant testing process",
                "Real-time WhatsApp tracking & updates",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="shrink-0 bg-flame-amber-tint rounded-xl px-6 py-3 text-center">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-2xl font-bold text-primary">₹800</p>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
