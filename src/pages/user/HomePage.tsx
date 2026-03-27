import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, Shield, Clock, Lock, MessageCircle, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Package, Cookie, ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { categories, products, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const heroSlides = [
  { tag: "Prevention is better than cure", headline: "Food Product Testing", headlineAccent: "starts at ₹1,199", sub: "Reports in 3–5 days", cta: "Register in 60 seconds", link: "/tests" },
  { tag: "50+ Labs across India", headline: "FSSAI Compliant Testing", headlineAccent: "— Accredited Labs", sub: "NABL & FSSAI certified", cta: "Find a Lab", link: "/labs" },
  { tag: "Complete Analysis", headline: "ULTRA Food Safety", headlineAccent: "Checkup", sub: "Comprehensive testing panel", cta: "Book Now", link: "/tests" },
];

const categoryPills = [
  { label: "All", value: null },
  { label: "Dairy", value: "Dairy" },
  { label: "Beverages", value: "Beverages" },
  { label: "Grains", value: "Grains & Cereals" },
  { label: "Spices", value: "Spices" },
  { label: "Meat", value: "Meat & Poultry" },
  { label: "Oils", value: "Oils & Fats" },
  { label: "Processed", value: "Processed Foods" },
  { label: "Snacks", value: "Snacks" },
];

const iconMap: Record<string, React.ElementType> = {
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame, drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

const featuredTests = [
  { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical" },
  { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical" },
  { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological" },
  { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical" },
  { id: "5", name: "Lead Content", method: "FSSAI IS:5451", price: 1800, mrp: 3000, tat: "5 days", type: "Chemical" },
];

const promoCards = [
  { title: "Get all your food products certified", desc: "Trusted by 500+ businesses", bg: "bg-flame-red-tint" },
  { title: "FSSAI compliance made easy", desc: "End-to-end support", bg: "bg-secondary text-secondary-foreground" },
  { title: "Fast turnaround — 3 to 5 days", desc: "Guaranteed delivery", bg: "bg-flame-amber-tint" },
  { title: "WhatsApp report delivery", desc: "Real-time updates", bg: "bg-litmus-mint" },
];

const experienceItems = [
  { title: "Choose precision — On time, every time", bullets: ["98% on time report delivery", "Report within 3–5 days guaranteed", "Digital reports via WhatsApp & email"] },
  { title: "Expert certified analysts", bullets: ["NABL accredited lab partners", "Experienced food safety professionals", "ISO 17025 certified processes"] },
  { title: "Painless sample submission", bullets: ["Easy online booking process", "Doorstep sample pickup available", "Clear instructions for every test"] },
  { title: "Fully accredited labs", bullets: ["NABL & FSSAI certifications", "State-of-the-art equipment", "Pan-India network of 50+ labs"] },
];

const reviews = [
  { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. The reports were detailed and FSSAI compliant.", date: "2 weeks ago" },
  { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. The WhatsApp updates kept me informed throughout. Highly recommend for food businesses.", date: "1 month ago" },
  { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
];

const steps = [
  { step: 1, title: "Register", desc: "Create your account" },
  { step: 2, title: "Select Tests", desc: "Browse products & tests" },
  { step: 3, title: "Book a Lab", desc: "Choose accredited lab" },
  { step: 4, title: "Get Report", desc: "Download certified results" },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePill, setActivePill] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string | null>(null);
  const [expandedExp, setExpandedExp] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="animate-fade-in">
      {/* Section 1 — Hero Carousel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[hsl(24,30%,12%)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative h-[200px] sm:h-[280px] lg:h-[340px] flex items-center">
            <div className="space-y-3 sm:space-y-4 max-w-xl">
              <Badge className="bg-flame-amber/20 text-flame-amber border-0 text-xs">{heroSlides[activeSlide].tag}</Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {heroSlides[activeSlide].headline}<br />
                <span className="text-flame-amber">{heroSlides[activeSlide].headlineAccent}</span>
              </h1>
              <p className="text-sm text-flame-amber font-medium">{heroSlides[activeSlide].sub}</p>
              <Button asChild className="bg-primary hover:bg-primary-deep rounded-lg px-6 h-11 font-semibold">
                <Link to={heroSlides[activeSlide].link}>{heroSlides[activeSlide].cta}</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)}
              className={`h-2 rounded-full transition-all ${i === activeSlide ? "w-6 bg-primary" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
          <span className="shrink-0 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-litmus-teal" />NABL Accredited</span>
          <span className="shrink-0 text-border">|</span>
          <span className="shrink-0 flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />3–5 Day Reports</span>
          <span className="shrink-0 text-border">|</span>
          <span className="shrink-0 flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" />FSSAI Certified</span>
          <span className="shrink-0 text-border">|</span>
          <span className="shrink-0 flex items-center gap-1.5"><Star className="h-4 w-4 text-flame-amber" />4.8 Google Rating</span>
        </div>
      </div>

      {/* Section 2 — Category Pills + Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {categoryPills.map((pill) => (
            <button key={pill.label} onClick={() => setActivePill(pill.value)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activePill === pill.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border hover:border-accent"
              )}>
              {pill.label}
            </button>
          ))}
        </div>

        {/* Featured mini cards row */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-3">
          {products.slice(0, 5).map((p) => {
            const price = p.testCount * 150;
            const mrp = p.testCount * 260;
            return (
              <div key={p.id} className="shrink-0 w-56 bg-card rounded-xl p-3 shadow-sm space-y-2">
                <p className="font-semibold text-foreground text-sm leading-snug">{p.name} Test Panel</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>
                  <span className="font-bold text-primary text-sm">₹{price.toLocaleString()}</span>
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">{discountPct(price, mrp)}% Off</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{p.testCount} tests • Reports in 3 days</p>
                <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg h-8 text-xs font-semibold" asChild>
                  <Link to={`/tests/${p.id}`}>Add to Cart</Link>
                </Button>
              </div>
            );
          })}
          <Link to="/tests" className="shrink-0 w-40 bg-muted rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-colors">
            <ArrowRight className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-accent">VIEW ALL →</span>
          </Link>
        </div>
      </div>

      {/* Section 3 — Most Booked Tests */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Most Booked Tests</h2>
          <div className="hidden sm:flex gap-2">
            {["All", "Dairy", "Beverages", "Grains"].map((t) => (
              <button key={t} onClick={() => setActiveCategoryTab(t === "All" ? null : t)}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  (activeCategoryTab === null && t === "All") || activeCategoryTab === t
                    ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — test cards */}
          <div className="lg:col-span-3 space-y-3">
            {featuredTests.slice(0, 4).map((t) => (
              <div key={t.id} className="bg-card rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-accent">
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.method}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-flame-red-tint text-primary border-0 text-[10px]">{t.type}</Badge>
                    <span className="text-xs text-muted-foreground">Reports in {t.tat}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-muted-foreground line-through">₹{t.mrp.toLocaleString()}</span>
                    <span className="font-bold text-primary">₹{t.price.toLocaleString()}</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{discountPct(t.price, t.mrp)}% Off</Badge>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 rounded-lg border-primary text-primary hover:bg-flame-red-tint text-xs" asChild>
                  <Link to={`/tests/${t.id}`}>Add to Cart</Link>
                </Button>
              </div>
            ))}
            <Link to="/tests" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-2">
              View All Tests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — category grid */}
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
                  <span className="text-xs text-muted-foreground">{cat.count} products</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 4 — Promo Banner Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {promoCards.map((card, i) => (
            <div key={i} className={cn("shrink-0 w-[280px] h-[140px] rounded-2xl p-5 flex flex-col justify-between", card.bg)}>
              <h3 className={cn("font-bold text-base leading-snug", card.bg.includes("secondary") ? "text-white" : "text-foreground")}>{card.title}</h3>
              <p className={cn("text-xs", card.bg.includes("secondary") ? "text-white/60" : "text-muted-foreground")}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 — The Litmus Experience (dark section) */}
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">The Litmus Experience</h2>
          <div className="space-y-3">
            {experienceItems.map((item, i) => (
              <div key={i}
                className={cn("rounded-xl p-5 cursor-pointer transition-all", expandedExp === i ? "bg-white/10" : "bg-white/5 hover:bg-white/8")}
                onClick={() => setExpandedExp(i)}>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {item.title}
                </h3>
                {expandedExp === i && (
                  <ul className="mt-3 ml-8 space-y-1.5">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="text-sm text-white/70 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-flame-amber mt-1.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6 — Test by Category */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Test by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Package;
            return (
              <Link key={cat.id} to={`/tests?category=${cat.name}`}
                className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-accent transition-all border border-transparent group">
                <div className="h-12 w-12 rounded-xl bg-flame-red-tint flex items-center justify-center shrink-0 group-hover:bg-flame-orange-tint transition-colors">
                  <IconComp className="h-6 w-6 text-primary" />
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

      {/* Section 7 — WhatsApp Support Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-secondary rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-white">Can't find what you're looking for?</h3>
            <p className="text-sm text-white/60 mt-1">Talk to our food safety expert on WhatsApp</p>
          </div>
          <Button className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white rounded-lg gap-2 font-semibold">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </Button>
        </div>
      </div>

      {/* Section 8 — Google Rating + Reviews */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Rating card */}
          <div className="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-5xl font-bold text-foreground">4.8</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-flame-amber text-flame-amber" />)}
            </div>
            <p className="text-sm text-muted-foreground font-medium">Google Rating</p>
            <p className="text-xs text-muted-foreground">Based on 500+ reviews</p>
          </div>

          {/* Review cards */}
          <div className="lg:col-span-2 space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {r.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city} • {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.text}</p>
                <button className="text-xs text-primary font-medium mt-1">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-flame-red-tint">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-foreground mb-8 text-center">How It Works</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1 relative">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] border-t-2 border-dashed border-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Labs */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Our Partner Labs</h2>
          <Link to="/labs" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">View All <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {laboratories.map((lab) => (
            <div key={lab.id} className="shrink-0 w-72 bg-card rounded-xl p-4 shadow-sm space-y-3 border border-transparent hover:border-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{lab.name}</h3>
                  <p className="text-xs text-muted-foreground">{lab.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {lab.nabl && <Badge className="bg-litmus-dark text-primary-foreground border-0 text-xs">NABL</Badge>}
                {lab.fssai && <Badge className="bg-litmus-teal text-primary-foreground border-0 text-xs">FSSAI</Badge>}
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />
                  <span className="text-sm font-medium">{lab.rating}</span>
                </div>
              </div>
              <Link to={`/labs/${lab.id}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View Lab <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
