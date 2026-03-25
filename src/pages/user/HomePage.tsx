import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Star, Shield, Clock, Lock, MessageCircle, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Package, Cookie, ArrowRight } from "lucide-react";
import { categories, products, laboratories, tests } from "@/lib/placeholder-data";

const heroSlides = [
  { headline: "Get Your Food Products FSSAI Certified", cta: "Start Testing", link: "/tests" },
  { headline: "50+ Accredited Labs Across India", cta: "Find a Lab", link: "/labs" },
  { headline: "Reports in 3–5 Working Days", cta: "Book Now", link: "/tests" },
];

const quickPills = [
  { label: "🧪 All Tests", category: null },
  { label: "🥛 Dairy", category: "Dairy" },
  { label: "🧃 Beverages", category: "Beverages" },
  { label: "🌾 Grains", category: "Grains & Cereals" },
  { label: "🌶 Spices", category: "Spices" },
  { label: "🥩 Meat", category: "Meat & Poultry" },
  { label: "🫙 Processed", category: "Processed Foods" },
  { label: "🍫 Snacks", category: "Snacks" },
];

const iconMap: Record<string, React.ElementType> = {
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame, drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

const trustItems = [
  { icon: Shield, title: "NABL Accredited Labs", desc: "All partner labs meet national standards" },
  { icon: Clock, title: "Reports in 3–5 Days", desc: "Fast turnaround on all tests" },
  { icon: Lock, title: "FSSAI Certified Process", desc: "Compliant with food safety regulations" },
  { icon: MessageCircle, title: "WhatsApp Updates", desc: "Real-time tracking on your phone" },
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

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl sm:mx-4 lg:mx-auto lg:max-w-7xl sm:mt-4">
        <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-secondary via-secondary to-[hsl(24,30%,12%)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground max-w-2xl leading-tight">
              {heroSlides[activeSlide].headline}
            </h1>
            <Button asChild className="mt-5 bg-primary hover:bg-primary-deep rounded-full px-6 gap-2">
              <Link to={heroSlides[activeSlide].link}>
                {heroSlides[activeSlide].cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {/* Dots */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${i === activeSlide ? "w-6 bg-primary" : "w-2 bg-primary-foreground/40"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Quick Action Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {quickPills.map((pill) => (
            <button key={pill.label} onClick={() => setActivePill(pill.category)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activePill === pill.category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-accent"
              }`}>
              {pill.label}
            </button>
          ))}
        </div>

        {/* Featured Test Packages */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Popular Tests</h2>
            <Link to="/tests" className="text-sm font-medium text-accent flex items-center gap-1 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {products.slice(0, 6).map((p) => (
              <Card key={p.id} className="shrink-0 w-64 border border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <Badge className="bg-flame-amber-tint text-accent border-0 text-xs">{p.category}</Badge>
                  <h3 className="font-semibold text-foreground leading-snug">{p.name} Test Panel</h3>
                  <p className="text-xs text-muted-foreground">{p.testCount} tests included</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">₹{(p.testCount * 150).toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{(p.testCount * 260).toLocaleString()}</span>
                  </div>
                  <Badge variant="outline" className="text-litmus-teal border-litmus-teal/30 bg-litmus-mint/30 text-xs">Reports in 3 days</Badge>
                  <Button asChild className="w-full bg-primary hover:bg-primary-deep rounded-lg text-sm" size="sm">
                    <Link to={`/tests/${p.id}`}>Add to Cart</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Grid */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Test by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Package;
              return (
                <Link key={cat.id} to={`/tests?category=${cat.name}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent hover:shadow-md transition-all group">
                  <div className="h-10 w-10 rounded-full bg-flame-red-tint flex items-center justify-center shrink-0">
                    <IconComp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} products</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why Choose Litmus */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Why Choose Litmus</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {trustItems.map((item) => (
              <Card key={item.title} className="border border-border shadow-none rounded-xl">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="mx-auto h-11 w-11 rounded-full bg-flame-orange-tint flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Most Booked Tests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Most Booked Tests</h2>
            <Link to="/tests" className="text-sm font-medium text-accent flex items-center gap-1 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[
              { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical" },
              { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical" },
              { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological" },
              { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical" },
              { id: "5", name: "Lead Content", method: "FSSAI IS:5451", price: 1800, mrp: 3000, tat: "5 days", type: "Chemical" },
            ].map((t) => (
              <Card key={t.id} className="shrink-0 w-60 border border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <Badge variant="outline" className="text-xs">{t.type}</Badge>
                  <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.method}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-primary">₹{t.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{t.mrp.toLocaleString()}</span>
                  </div>
                  <Badge variant="outline" className="text-litmus-teal border-litmus-teal/30 bg-litmus-mint/30 text-xs">Reports in {t.tat}</Badge>
                  <Button asChild className="w-full bg-primary hover:bg-primary-deep rounded-lg text-sm mt-1" size="sm">
                    <Link to={`/tests/${t.id}`}>Add to Cart</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-flame-red-tint rounded-2xl p-6 lg:p-8">
          <h2 className="text-lg font-bold text-foreground mb-6 text-center">How It Works</h2>
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
        </section>

        {/* Accredited Lab Spotlight */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Our Partner Labs</h2>
            <Link to="/labs" className="text-sm font-medium text-accent flex items-center gap-1 hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {laboratories.map((lab) => (
              <Card key={lab.id} className="shrink-0 w-72 border border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-3">
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
                      <span className="text-sm font-medium text-foreground">{lab.rating}</span>
                    </div>
                  </div>
                  <Link to={`/labs/${lab.id}`} className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
                    View Lab <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
