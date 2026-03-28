import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, Star, Shield, Clock, Lock, MessageCircle,
  Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Package, Cookie,
  ArrowRight, CheckCircle2, Plus, Minus, ChevronDown
} from "lucide-react";
import { categories, products, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import heroPerson from "@/assets/hero-person.png";
import heroScientist from "@/assets/hero-scientist.png";

const heroSlides = [
  {
    tag: "Prevention is better than cure",
    headline: "Full Product Testing",
    headlineAccent: "starts at ₹1,199",
    sub: "Reports in 3–5 days",
    cta: "Register in 60 seconds",
    link: "/tests",
    image: heroPerson,
  },
  {
    tag: "50+ Labs across India",
    headline: "FSSAI Compliant Testing",
    headlineAccent: "— Accredited Labs",
    sub: "NABL & FSSAI certified",
    cta: "Find a Lab",
    link: "/labs",
    image: heroScientist,
  },
  {
    tag: "Complete Analysis",
    headline: "ULTRA Food Safety",
    headlineAccent: "Checkup",
    sub: "Comprehensive testing panel",
    cta: "Book Now",
    link: "/tests",
    image: heroPerson,
  },
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
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame,
  drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

const featuredTests = [
  { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical", tests: 8 },
  { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical", tests: 12 },
  { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological", tests: 6 },
  { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical", tests: 4 },
  { id: "5", name: "Lead Content", method: "FSSAI IS:5451", price: 1800, mrp: 3000, tat: "5 days", type: "Chemical", tests: 3 },
];

const promoCards = [
  { title: "Sexual Health Monitoring", desc: "Complete panel for reproductive health testing", bg: "bg-card", hasImage: true },
];

const experienceItems = [
  { title: "Choose precision — On time, every time", bullets: ["98% on time report delivery", "Report within 3–5 days guaranteed", "Digital reports via WhatsApp & email"], image: heroPerson },
  { title: "Expert certified analysts", bullets: ["NABL accredited lab partners", "Experienced food safety professionals", "ISO 17025 certified processes"], image: heroScientist },
  { title: "Painless sample submission", bullets: ["Easy online booking process", "Doorstep sample pickup available", "Clear instructions for every test"], image: heroPerson },
  { title: "Fully accredited labs", bullets: ["NABL & FSSAI certifications", "State-of-the-art equipment", "Pan-India network of 50+ labs"], image: heroScientist },
  { title: "Businesses love us", bullets: ["4.8/5 Google rating", "500+ verified reviews", "Trusted by 10,000+ businesses"], image: heroPerson },
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

const categoryGrid = [
  { name: "Dairy Products", icon: Milk, color: "bg-flame-amber-tint" },
  { name: "Beverages", icon: Coffee, color: "bg-[hsl(210,40%,94%)]" },
  { name: "Grains & Cereals", icon: Wheat, color: "bg-litmus-mint" },
  { name: "Spices", icon: Flame, color: "bg-flame-red-tint" },
  { name: "Meat & Poultry", icon: Drumstick, color: "bg-flame-orange-tint" },
  { name: "Oils & Fats", icon: Droplets, color: "bg-[hsl(45,80%,92%)]" },
  { name: "Processed Foods", icon: Package, color: "bg-[hsl(280,30%,94%)]" },
  { name: "Snacks", icon: Cookie, color: "bg-flame-amber-tint" },
  { name: "Pet Food", icon: Package, color: "bg-litmus-mint" },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePill, setActivePill] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string | null>(null);
  const [expandedExp, setExpandedExp] = useState(0);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);

  const addToCart = (id: string) => setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCartItems(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  return (
    <div className="animate-fade-in">
      {/* ===== HERO CAROUSEL ===== */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(0,0%,11%) 0%, hsl(24,30%,12%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative h-[220px] sm:h-[300px] lg:h-[360px] flex items-center">
            {/* Left text */}
            <div className="space-y-3 sm:space-y-4 max-w-lg z-10 relative">
              <span className="inline-block bg-flame-amber/20 text-flame-amber px-3 py-1 rounded-full text-xs font-medium">
                {heroSlides[activeSlide].tag}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                {heroSlides[activeSlide].headline}
                <br />
                <span className="text-flame-amber">{heroSlides[activeSlide].headlineAccent}</span>
              </h1>
              <p className="text-sm text-flame-amber font-medium">{heroSlides[activeSlide].sub}</p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary-deep rounded-lg px-8 h-12 font-semibold text-base">
                <Link to={heroSlides[activeSlide].link}>{heroSlides[activeSlide].cta}</Link>
              </Button>
            </div>
            {/* Right image */}
            <div className="absolute right-0 bottom-0 h-full w-1/3 lg:w-2/5 hidden sm:flex items-end justify-center">
              <img
                src={heroSlides[activeSlide].image}
                alt="Lab professional"
                className="h-[90%] w-auto object-contain drop-shadow-2xl"
                width={400}
                height={500}
              />
            </div>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)}
              className={cn("h-2.5 rounded-full transition-all", i === activeSlide ? "w-7 bg-primary" : "w-2.5 bg-white/30")} />
          ))}
        </div>
      </div>

      {/* ===== CATEGORY PILLS + FEATURED MINI CARDS STRIP ===== */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {categoryPills.map((pill) => (
              <button key={pill.label} onClick={() => setActivePill(pill.value)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  activePill === pill.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border hover:border-accent"
                )}>
                {pill.label}
              </button>
            ))}
          </div>
          {/* Mini cards */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {products.slice(0, 5).map((p) => {
              const price = p.testCount * 150;
              const mrp = p.testCount * 260;
              const qty = cartItems[p.id] || 0;
              return (
                <div key={p.id} className="shrink-0 w-52 rounded-xl p-3 space-y-1.5 border border-border bg-card">
                  <p className="font-semibold text-foreground text-[13px] leading-snug line-clamp-2">{p.name} Test Panel</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>
                    <span className="font-bold text-primary text-sm">₹{price.toLocaleString()}</span>
                    <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      {discountPct(price, mrp)}% Off
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{p.testCount} tests • Reports in 3 days</p>
                  {qty === 0 ? (
                    <button onClick={() => addToCart(p.id)}
                      className="w-full h-8 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-colors">
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-3 h-8 rounded-lg bg-accent">
                      <button onClick={() => removeFromCart(p.id)} className="text-accent-foreground px-2"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-accent-foreground font-bold text-sm">{qty}</span>
                      <button onClick={() => addToCart(p.id)} className="text-accent-foreground px-2"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
              );
            })}
            <Link to="/tests" className="shrink-0 w-36 rounded-xl border border-border flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
              <ArrowRight className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent">VIEW ALL</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== MOST BOOKED TESTS ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Most Booked Tests</h2>
            <p className="text-sm text-muted-foreground mt-1">Popular tests booked by food businesses</p>
          </div>
          <div className="hidden sm:flex gap-2">
            {["All", "Dairy", "Beverages", "Grains"].map((t) => (
              <button key={t} onClick={() => setActiveCategoryTab(t === "All" ? null : t)}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  (activeCategoryTab === null && t === "All") || activeCategoryTab === t
                    ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — test cards */}
          <div className="lg:col-span-3 space-y-3">
            {featuredTests.slice(0, 4).map((t) => (
              <div key={t.id} className="bg-card rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex items-center gap-4 border-l-[3px] border-accent hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="font-semibold text-foreground text-[15px]">{t.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-flame-red-tint text-primary text-[10px] font-medium px-2 py-0.5 rounded-full">{t.tests} tests included</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Reports in {t.tat}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-muted-foreground line-through">₹{t.mrp.toLocaleString()}</span>
                    <span className="font-bold text-primary text-lg">₹{t.price.toLocaleString()}</span>
                  </div>
                  <span className="bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded">{discountPct(t.price, t.mrp)}% Off</span>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 rounded-lg border-primary text-primary hover:bg-flame-red-tint text-xs h-9 px-4" asChild>
                  <Link to={`/tests/${t.id}`}>Add</Link>
                </Button>
              </div>
            ))}
            <Link to="/tests" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-2">
              View All Tests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — category grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat, idx) => {
              const IconComp = iconMap[cat.icon] || Package;
              const bgColors = ["bg-flame-amber-tint", "bg-flame-red-tint", "bg-litmus-mint", "bg-flame-orange-tint"];
              return (
                <Link key={cat.id} to={`/tests?category=${cat.name}`}
                  className={cn("rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:scale-[1.02] transition-transform min-h-[120px]", bgColors[idx % 4])}>
                  <IconComp className="h-10 w-10 text-foreground" />
                  <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} products</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== PROMO BANNER — Wide Card ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden">
          <div className="flex items-center">
            <div className="flex-1 p-6 sm:p-8 space-y-2">
              <span className="text-xs font-medium text-accent">Recommended</span>
              <h3 className="text-xl font-bold text-foreground">Complete Food Safety Panel</h3>
              <p className="text-sm text-muted-foreground">Comprehensive testing covering Chemical, Microbiological & Physical parameters</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xs text-muted-foreground line-through">₹4,500</span>
                <span className="text-lg font-bold text-primary">₹2,999</span>
                <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold">33% Off</span>
              </div>
            </div>
            <div className="hidden sm:block w-48 h-full shrink-0">
              <img src={heroScientist} alt="Scientist" className="h-40 w-auto object-contain mx-auto" loading="lazy" width={192} height={160} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== ULTRA BANNER ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(24,91%,53%) 0%, hsl(11,76%,49%) 100%)" }}>
          <div className="flex items-center px-6 sm:px-8 py-6">
            <div className="flex-1 space-y-2">
              <span className="text-xs font-medium text-white/80">Most Comprehensive</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">ULTRA Full Product Checkup</h3>
              <p className="text-sm text-white/70">28 parameters • All categories covered</p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-white/60 line-through">₹8,500</span>
                <span className="text-lg font-bold text-white">₹5,999</span>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-lg font-semibold mt-2" asChild>
                <Link to="/tests">Book Now</Link>
              </Button>
            </div>
            <div className="hidden sm:block w-48 shrink-0">
              <img src={heroPerson} alt="Lab tech" className="h-40 w-auto object-contain mx-auto" loading="lazy" width={192} height={160} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROMO HORIZONTAL CARDS ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { title: "Get all your food products certified", desc: "Trusted by 500+ businesses", bg: "bg-flame-red-tint", textColor: "text-foreground" },
            { title: "FSSAI compliance made easy", desc: "End-to-end support", bg: "bg-secondary", textColor: "text-white" },
            { title: "Fast turnaround — 3 to 5 days", desc: "Guaranteed delivery", bg: "bg-flame-amber-tint", textColor: "text-foreground" },
            { title: "WhatsApp report delivery", desc: "Real-time updates", bg: "bg-litmus-mint", textColor: "text-foreground" },
          ].map((card, i) => (
            <div key={i} className={cn("shrink-0 w-[280px] h-[150px] rounded-2xl p-5 flex flex-col justify-between", card.bg)}>
              <div>
                <h3 className={cn("font-bold text-[15px] leading-snug", card.textColor)}>{card.title}</h3>
                <p className={cn("text-xs mt-1", card.textColor === "text-white" ? "text-white/60" : "text-muted-foreground")}>{card.desc}</p>
              </div>
              <p className={cn("text-xs font-medium", card.textColor === "text-white" ? "text-flame-amber" : "text-primary")}>Learn more →</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== THE LITMUS EXPERIENCE (dark section) ===== */}
      <div className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-white mb-2">The Litmus Experience</h2>
          <p className="text-sm text-white/50 mb-8">Why thousands of food businesses trust us</p>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left — image */}
            <div className="relative rounded-2xl overflow-hidden bg-white/5 aspect-[4/3] flex items-end justify-center">
              <img
                src={experienceItems[expandedExp].image}
                alt="Experience"
                className="h-[85%] w-auto object-contain"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <span className="text-white text-xs font-medium">Step {expandedExp + 1} of {experienceItems.length}</span>
              </div>
            </div>

            {/* Right — accordion items */}
            <div className="space-y-2">
              {experienceItems.map((item, i) => (
                <div key={i}
                  className={cn(
                    "rounded-xl px-5 py-4 cursor-pointer transition-all border",
                    expandedExp === i
                      ? "bg-white/10 border-white/20"
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                  onClick={() => setExpandedExp(i)}>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      expandedExp === i ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/50"
                    )}>
                      {i + 1}
                    </span>
                    <h3 className={cn("font-semibold text-sm", expandedExp === i ? "text-white" : "text-white/60")}>
                      {item.title}
                    </h3>
                    <ChevronDown className={cn("h-4 w-4 ml-auto shrink-0 transition-transform", expandedExp === i ? "text-white rotate-180" : "text-white/30")} />
                  </div>
                  {expandedExp === i && (
                    <ul className="mt-3 ml-10 space-y-2 animate-fade-in">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-flame-amber mt-1.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                      <button className="text-xs text-flame-amber font-medium mt-1">Read more →</button>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TEST BY CATEGORY GRID ===== */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">For Vital Food Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">Browse tests designed for specific food product types</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {categoryGrid.map((cat) => (
            <Link key={cat.name} to={`/tests?category=${cat.name}`}
              className={cn("rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center hover:shadow-md transition-shadow min-h-[100px]", cat.color)}>
              <cat.icon className="h-8 w-8 text-foreground" />
              <span className="font-medium text-foreground text-xs leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== WHATSAPP SUPPORT BANNER ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-secondary rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-white">Can't find what you're looking for?</h3>
            <p className="text-sm text-white/50 mt-1">Talk to our food safety expert on WhatsApp</p>
          </div>
          <Button className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white rounded-lg gap-2 font-semibold">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </Button>
        </div>
      </div>

      {/* ===== NO BATCH TESTING + GOOGLE RATING ===== */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left — NO badge */}
          <div className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-8 text-center space-y-3">
            <div className="inline-block">
              <span className="text-5xl font-black text-primary">NO</span>
              <span className="block text-lg font-bold text-foreground mt-1">Batch Testing</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Every sample is tested individually with dedicated attention for maximum accuracy
            </p>
            <div className="flex items-center justify-center gap-1 pt-2">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-flame-amber text-flame-amber" />)}
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">4.8</span>
              <p className="text-sm text-muted-foreground font-medium">Google Rating</p>
              <p className="text-xs text-muted-foreground">Based on 500+ reviews</p>
            </div>
          </div>

          {/* Right — review cards */}
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {r.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city} • {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.text}</p>
                <button className="text-xs text-primary font-medium mt-1.5">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="bg-flame-red-tint">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-foreground mb-8 text-center">How It Works</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1 relative">
                <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
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

      {/* ===== PARTNER LABS ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Our Partner Labs</h2>
          <Link to="/labs" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">View All <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {laboratories.map((lab) => (
            <div key={lab.id} className="shrink-0 w-72 bg-card rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] space-y-3 hover:shadow-md transition-shadow">
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
                {lab.nabl && <span className="bg-litmus-dark text-white text-[10px] font-semibold px-2 py-0.5 rounded">NABL</span>}
                {lab.fssai && <span className="bg-litmus-teal text-white text-[10px] font-semibold px-2 py-0.5 rounded">FSSAI</span>}
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />
                  <span className="text-sm font-medium text-foreground">{lab.rating}</span>
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
