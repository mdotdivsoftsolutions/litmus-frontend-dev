import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Star, Clock, MessageCircle,
  Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Package, Cookie,
  ArrowRight, Plus, Minus, ChevronDown, Check, Zap, Shield, FileText
} from "lucide-react";
import { categories, products, laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import bannerHero1 from "@/assets/banner-hero-1.jpg";
import bannerHero2 from "@/assets/banner-hero-2.jpg";
import bannerHero3 from "@/assets/banner-hero-3.jpg";
import bannerPromo from "@/assets/banner-promo.jpg";

/* ─── Data ─── */
const heroSlides = [
  {
    tag: "Trusted by 10,000+ businesses across India",
    headline: "Full Product Testing",
    headlineAccent: "starts at ₹1,199",
    sub: "Reports in 3–5 days",
    cta: "Register in 60 seconds",
    link: "/tests",
    image: bannerHero1,
  },
  {
    tag: "50+ NABL Accredited Labs",
    headline: "FSSAI Compliant Testing",
    headlineAccent: "— Certified Labs",
    sub: "NABL & FSSAI certified processes",
    cta: "Find a Lab",
    link: "/labs",
    image: bannerHero2,
  },
  {
    tag: "Most Comprehensive Panel",
    headline: "ULTRA Food Safety",
    headlineAccent: "Checkup",
    sub: "28 parameters • All categories",
    cta: "Book Now",
    link: "/tests",
    image: bannerHero3,
  },
];

const quickStats = [
  { icon: Check, label: "NABL Accredited" },
  { icon: Zap, label: "3–5 Day Reports" },
  { icon: Shield, label: "FSSAI Certified" },
  { icon: Star, label: "4.8 Rating" },
];

const categoryPills = [
  { label: "All", value: null, emoji: "🧪" },
  { label: "Dairy", value: "Dairy", emoji: "🥛" },
  { label: "Beverages", value: "Beverages", emoji: "🧃" },
  { label: "Grains", value: "Grains & Cereals", emoji: "🌾" },
  { label: "Spices", value: "Spices", emoji: "🌶" },
  { label: "Meat", value: "Meat & Poultry", emoji: "🥩" },
  { label: "Oils", value: "Oils & Fats", emoji: "🫙" },
  { label: "Processed", value: "Processed Foods", emoji: "📦" },
  { label: "Snacks", value: "Snacks", emoji: "🍫" },
];

const featuredTests = [
  { id: "1", name: "Complete Dairy Panel", price: 1200, mrp: 2100, tat: "3 days", tests: 8, category: "Dairy" },
  { id: "2", name: "Protein & Nutrition Analysis", price: 1500, mrp: 2500, tat: "4 days", tests: 12, category: "Chemical" },
  { id: "3", name: "Microbial Safety Test", price: 850, mrp: 1400, tat: "5 days", tests: 6, category: "Micro" },
  { id: "4", name: "Heavy Metal Screening", price: 1800, mrp: 3000, tat: "5 days", tests: 3, category: "Chemical" },
];

const experienceItems = [
  { title: "Choose precision — On time, every time", bullets: ["98% on time report delivery", "Reports within 3–5 days guaranteed", "Digital reports via WhatsApp & email"], image: bannerHero1 },
  { title: "Expert certified analysts", bullets: ["NABL accredited lab partners", "Experienced food safety professionals", "ISO 17025 certified processes"], image: bannerHero2 },
  { title: "Painless sample submission", bullets: ["Easy online booking", "Doorstep pickup available", "Clear instructions for every test"], image: bannerPromo },
  { title: "Fully accredited laboratories", bullets: ["NABL & FSSAI certifications", "State-of-the-art equipment", "50+ labs across India"], image: bannerHero3 },
  { title: "Businesses love us", bullets: ["4.8/5 Google rating", "500+ verified reviews", "Trusted by 10,000+ businesses"], image: bannerHero1 },
];

const categoryGrid = [
  { name: "Dairy Products", icon: Milk, color: "from-[hsl(36,91%,57%,0.15)] to-[hsl(36,91%,57%,0.05)]" },
  { name: "Beverages", icon: Coffee, color: "from-[hsl(210,60%,50%,0.12)] to-[hsl(210,60%,50%,0.04)]" },
  { name: "Grains & Cereals", icon: Wheat, color: "from-[hsl(140,36%,50%,0.12)] to-[hsl(140,36%,50%,0.04)]" },
  { name: "Spices", icon: Flame, color: "from-[hsl(11,76%,49%,0.12)] to-[hsl(11,76%,49%,0.04)]" },
  { name: "Meat & Poultry", icon: Drumstick, color: "from-[hsl(22,90%,51%,0.12)] to-[hsl(22,90%,51%,0.04)]" },
  { name: "Oils & Fats", icon: Droplets, color: "from-[hsl(45,80%,50%,0.12)] to-[hsl(45,80%,50%,0.04)]" },
  { name: "Processed Foods", icon: Package, color: "from-[hsl(280,40%,50%,0.12)] to-[hsl(280,40%,50%,0.04)]" },
  { name: "Snacks", icon: Cookie, color: "from-[hsl(24,88%,53%,0.12)] to-[hsl(24,88%,53%,0.04)]" },
  { name: "Pet Food", icon: Package, color: "from-[hsl(163,60%,35%,0.12)] to-[hsl(163,60%,35%,0.04)]" },
];

const reviews = [
  { name: "Suresh Mehta", city: "Chennai", rating: 5, text: "Excellent service! Got my dairy product tested within 3 days. Reports were detailed and FSSAI compliant. Highly recommend!", date: "2 weeks ago" },
  { name: "Anita Joshi", city: "Mumbai", rating: 5, text: "Very professional team. WhatsApp updates kept me informed throughout the entire testing process.", date: "1 month ago" },
  { name: "Pradeep Rao", city: "Bangalore", rating: 4, text: "Good platform for food testing. Wide range of tests available. Pricing is competitive compared to direct lab bookings.", date: "3 weeks ago" },
];

const promoCards = [
  { title: "Get all your food products certified", desc: "Trusted by 500+ businesses", gradient: "from-flame-red-tint to-flame-orange-tint" },
  { title: "FSSAI compliance made easy", desc: "End-to-end support & guidance", gradient: "from-secondary to-[hsl(0,0%,16%)]", dark: true },
  { title: "Fast turnaround — 3 to 5 days", desc: "Guaranteed report delivery", gradient: "from-flame-amber-tint to-[hsl(45,85%,96%)]" },
  { title: "WhatsApp report delivery", desc: "Real-time status updates", gradient: "from-litmus-mint to-[hsl(140,36%,94%)]" },
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
  const [expandedExp, setExpandedExp] = useState(0);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 4500);
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

      {/* ═══════════ HERO CAROUSEL ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Full-width banner image */}
        <div className="absolute inset-0">
          <img
            src={heroSlides[activeSlide].image}
            alt="Banner"
            className="w-full h-full object-cover transition-opacity duration-700"
            width={1920}
            height={640}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/90 via-[#1C1C1E]/70 to-[#1C1C1E]/30" />
        </div>

        {/* Glassmorphism blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[hsl(var(--flame-orange))] opacity-[0.08] blur-[120px]" />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[hsl(var(--flame-amber))] opacity-[0.06] blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] flex items-center py-10 lg:py-14">
            <div className="space-y-4 max-w-xl z-10 relative">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-flame-amber px-4 py-1.5 rounded-full text-xs font-medium border border-white/10">
                <Flame className="h-3 w-3" />
                {heroSlides[activeSlide].tag}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-white leading-[1.1] tracking-tight">
                {heroSlides[activeSlide].headline}
                <br />
                <span className="text-flame-amber">{heroSlides[activeSlide].headlineAccent}</span>
              </h1>
              <p className="text-sm sm:text-base text-white/50 font-medium">{heroSlides[activeSlide].sub}</p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary-deep rounded-xl px-8 h-12 font-semibold text-base shadow-lg shadow-primary/30">
                <Link to={heroSlides[activeSlide].link}>
                  {heroSlides[activeSlide].cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)}
              className={cn("h-2 rounded-full transition-all duration-300", i === activeSlide ? "w-8 bg-primary" : "w-2 bg-white/25 hover:bg-white/40")} />
          ))}
        </div>
      </section>

      {/* ═══════════ QUICK STATS STRIP ═══════════ */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto scrollbar-hide">
          {quickStats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="h-7 w-7 rounded-full bg-flame-red-tint flex items-center justify-center">
                <s.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CATEGORY PILLS + FEATURED MINI CARDS ═══════════ */}
      <section className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
            {categoryPills.map((pill) => (
              <button key={pill.label} onClick={() => setActivePill(pill.value)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activePill === pill.value
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                )}>
                <span className="mr-1.5">{pill.emoji}</span>{pill.label}
              </button>
            ))}
          </div>

          {/* Mini product cards - horizontal scroll, no visible scrollbar */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {products.slice(0, 5).map((p) => {
              const price = p.testCount * 150;
              const mrp = p.testCount * 260;
              const qty = cartItems[p.id] || 0;
              return (
                <div key={p.id} className="shrink-0 w-[200px] rounded-2xl p-3.5 space-y-2 bg-card border border-border/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow">
                  <p className="font-semibold text-foreground text-[13px] leading-snug line-clamp-2">{p.name}</p>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>
                    <span className="font-bold text-primary text-sm">₹{price.toLocaleString()}</span>
                  </div>
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {discountPct(price, mrp)}% Off
                  </span>
                  <p className="text-[11px] text-muted-foreground">{p.testCount} tests • Reports in 3 days</p>
                  {qty === 0 ? (
                    <button onClick={() => addToCart(p.id)}
                      className="w-full h-9 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-all shadow-sm">
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-4 h-9 rounded-xl bg-accent">
                      <button onClick={() => removeFromCart(p.id)} className="text-accent-foreground"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-accent-foreground font-bold text-sm">{qty}</span>
                      <button onClick={() => addToCart(p.id)} className="text-accent-foreground"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
              );
            })}
            <Link to="/tests" className="shrink-0 w-[140px] rounded-2xl border border-border/50 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-accent" />
              </div>
              <span className="text-sm font-semibold text-accent">VIEW ALL</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ MOST BOOKED TESTS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Most Booked Tests</h2>
            <p className="text-sm text-muted-foreground mt-1">Popular tests booked by food businesses across India</p>
          </div>
          <div className="hidden sm:flex gap-2">
            {["All", "Dairy", "Chemical", "Micro"].map((t) => (
              <button key={t} className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all",
                t === "All" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — test cards */}
          <div className="lg:col-span-3 space-y-3">
            {featuredTests.map((t) => (
              <div key={t.id} className="bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center gap-4 border-l-[4px] border-accent hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all group">
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors">{t.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-flame-red-tint text-primary text-[11px] font-medium px-2.5 py-0.5 rounded-full">{t.tests} tests included</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Reports in {t.tat}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1.5">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-muted-foreground line-through">₹{t.mrp.toLocaleString()}</span>
                    <span className="font-bold text-primary text-lg">₹{t.price.toLocaleString()}</span>
                  </div>
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">{discountPct(t.price, t.mrp)}% Off</span>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs h-10 px-5 transition-all" asChild>
                  <Link to={`/tests/${t.id}`}>Add</Link>
                </Button>
              </div>
            ))}
            <Link to="/tests" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-2">
              View All Tests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — category grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat, idx) => {
              const icons = [Milk, Coffee, Wheat, Flame];
              const IconComp = icons[idx % 4];
              const bgColors = ["bg-flame-amber-tint", "bg-[hsl(210,40%,94%)]", "bg-litmus-mint", "bg-flame-red-tint"];
              return (
                <Link key={cat.id} to={`/tests?category=${cat.name}`}
                  className={cn(
                    "rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:scale-[1.03] transition-all min-h-[130px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
                    bgColors[idx % 4]
                  )}>
                  <div className="h-14 w-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <IconComp className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} products</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ PROMO BANNER — Full-width card ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]" style={{ background: "linear-gradient(135deg, #FEF0E7 0%, #FFFFFF 50%, #FDF4D8 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(var(--flame-orange))] opacity-[0.06] blur-[80px]" />
          </div>
          <div className="flex items-center relative">
            <div className="flex-1 p-6 sm:p-10 space-y-3">
              <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold">Recommended</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Complete Food Safety Panel</h3>
              <p className="text-sm text-muted-foreground max-w-md">Comprehensive testing covering Chemical, Microbiological & Physical parameters for complete compliance</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-sm text-muted-foreground line-through">₹4,500</span>
                <span className="text-2xl font-bold text-primary">₹2,999</span>
                <span className="bg-primary text-primary-foreground text-[11px] px-2 py-0.5 rounded-full font-semibold">33% Off</span>
              </div>
              <Button className="bg-primary hover:bg-primary-deep rounded-xl font-semibold mt-1 shadow-md shadow-primary/20" asChild>
                <Link to="/tests">Book Now <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="hidden sm:block w-[220px] h-[180px] shrink-0 mr-8 rounded-2xl overflow-hidden">
              <img src={bannerPromo} alt="Food products" className="w-full h-full object-cover" loading="lazy" width={220} height={180} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ULTRA BANNER ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)]" style={{ background: "linear-gradient(135deg, hsl(22,90%,51%) 0%, hsl(11,76%,49%) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-white opacity-[0.08] blur-[80px]" />
          </div>
          <div className="flex items-center px-6 sm:px-10 py-8 relative">
            <div className="flex-1 space-y-3">
              <span className="inline-block bg-white/15 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">Most Comprehensive</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">ULTRA Full Product Checkup</h3>
              <p className="text-sm text-white/60">28 parameters • All categories covered</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-sm text-white/40 line-through">₹8,500</span>
                <span className="text-2xl font-bold text-white">₹5,999</span>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold shadow-lg mt-1" asChild>
                <Link to="/tests">Book Now <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="hidden sm:block w-[200px] h-[180px] shrink-0 rounded-2xl overflow-hidden">
              <img src={bannerHero1} alt="Lab testing" className="w-full h-full object-cover" loading="lazy" width={200} height={180} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROMO HORIZONTAL CARDS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {promoCards.map((card, i) => (
            <div key={i} className={cn(
              "shrink-0 w-[280px] h-[160px] rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow",
              card.gradient
            )}>
              <div>
                <h3 className={cn("font-bold text-[15px] leading-snug", card.dark ? "text-white" : "text-foreground")}>{card.title}</h3>
                <p className={cn("text-xs mt-1.5", card.dark ? "text-white/50" : "text-muted-foreground")}>{card.desc}</p>
              </div>
              <p className={cn("text-xs font-semibold", card.dark ? "text-flame-amber" : "text-primary")}>Learn more →</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ THE LITMUS EXPERIENCE (dark section) ═══════════ */}
      <section className="bg-secondary relative overflow-hidden">
        {/* Glassmorphism blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-[hsl(var(--flame-orange))] opacity-[0.04] blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-[hsl(var(--litmus-teal))] opacity-[0.06] blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">The Litmus Experience</h2>
          <p className="text-sm text-white/40 mb-10">Why thousands of food businesses trust us</p>
          
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left — image with glassmorphism overlay */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] aspect-[4/3] flex items-end justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <img
                src={experienceItems[expandedExp].image}
                alt="Experience"
                className="h-[85%] w-auto object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 z-20">
                <span className="text-white text-xs font-medium">Step {expandedExp + 1} of {experienceItems.length}</span>
              </div>
            </div>

            {/* Right — accordion items */}
            <div className="space-y-2">
              {experienceItems.map((item, i) => (
                <div key={i}
                  className={cn(
                    "rounded-2xl px-5 py-4 cursor-pointer transition-all duration-300",
                    expandedExp === i
                      ? "bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                      : "border border-transparent hover:bg-white/[0.04]"
                  )}
                  onClick={() => setExpandedExp(i)}>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                      expandedExp === i ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : "bg-white/10 text-white/40"
                    )}>
                      {i + 1}
                    </span>
                    <h3 className={cn("font-semibold text-sm transition-colors", expandedExp === i ? "text-white" : "text-white/50")}>
                      {item.title}
                    </h3>
                    <ChevronDown className={cn("h-4 w-4 ml-auto shrink-0 transition-transform duration-300", expandedExp === i ? "text-white rotate-180" : "text-white/20")} />
                  </div>
                  {expandedExp === i && (
                    <ul className="mt-4 ml-11 space-y-2.5 animate-fade-in">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="text-sm text-white/60 flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-flame-amber mt-1.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                      <button className="text-xs text-flame-amber font-semibold mt-1 hover:underline">Read more →</button>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TEST BY CATEGORY GRID ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Test by Category</h2>
          <p className="text-sm text-muted-foreground mt-1">Browse tests designed for specific food product types</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {categoryGrid.map((cat) => (
            <Link key={cat.name} to={`/tests?category=${cat.name}`}
              className={cn(
                "rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all min-h-[110px] bg-gradient-to-br shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:scale-[1.03]",
                cat.color
              )}>
              <div className="h-12 w-12 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <cat.icon className="h-6 w-6 text-foreground" />
              </div>
              <span className="font-semibold text-foreground text-xs leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ WHATSAPP SUPPORT BANNER ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="relative bg-secondary rounded-3xl p-8 sm:p-10 flex items-center justify-between gap-6 flex-wrap overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-[250px] h-[250px] rounded-full bg-[hsl(142,70%,45%)] opacity-[0.06] blur-[80px]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white">Can't find what you're looking for?</h3>
            <p className="text-sm text-white/40 mt-1.5">Talk to our food safety expert on WhatsApp</p>
          </div>
          <Button className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white rounded-xl gap-2 font-semibold shadow-lg shadow-[hsl(142,70%,45%)]/20 relative z-10">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </Button>
        </div>
      </section>

      {/* ═══════════ NO BATCH TESTING + GOOGLE RATING ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left — NO badge with glassmorphism */}
          <div className="bg-card rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 sm:p-10 text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[hsl(var(--primary))] opacity-[0.04] blur-[60px]" />
            </div>
            <div className="inline-block relative z-10">
              <span className="text-6xl font-black text-primary">NO</span>
              <span className="block text-xl font-bold text-foreground mt-1">Batch Testing</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto relative z-10">
              Every sample is tested individually with dedicated attention for maximum accuracy
            </p>
            <div className="flex items-center justify-center gap-1 pt-3">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-flame-amber text-flame-amber" />)}
            </div>
            <div className="relative z-10">
              <span className="text-5xl font-bold text-foreground">4.8</span>
              <p className="text-sm text-muted-foreground font-semibold mt-1">Google Rating</p>
              <p className="text-xs text-muted-foreground">Based on 500+ reviews</p>
            </div>
          </div>

          {/* Right — review cards */}
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center text-xs font-bold shadow-md">
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
                <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                <button className="text-xs text-primary font-semibold mt-2 hover:underline">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(24,88%,97%) 0%, hsl(30,22%,96%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-foreground mb-10 text-center">How It Works</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1 relative">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-primary/20">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] border-t-2 border-dashed border-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PARTNER LABS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Our Partner Labs</h2>
          <Link to="/labs" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">View All <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {laboratories.map((lab) => (
            <div key={lab.id} className="shrink-0 w-[280px] bg-card rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] space-y-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-primary text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{lab.name}</h3>
                  <p className="text-xs text-muted-foreground">{lab.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {lab.nabl && <span className="bg-litmus-dark text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">NABL</span>}
                {lab.fssai && <span className="bg-litmus-teal text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">FSSAI</span>}
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />
                  <span className="text-sm font-semibold text-foreground">{lab.rating}</span>
                </div>
              </div>
              <Link to={`/labs/${lab.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View Lab <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
