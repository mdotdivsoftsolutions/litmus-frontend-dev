import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Shield, Building2, CreditCard, MapPin, FileText, MessageSquare, ArrowRight, Star, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: CheckCircle2, title: "Register", desc: "Create your business account in minutes" },
  { icon: Beaker, title: "Select Tests", desc: "Browse and choose from 500+ FSSAI tests" },
  { icon: Building2, title: "Choose Lab", desc: "Pick an accredited lab near you" },
  { icon: FileText, title: "Get Report", desc: "Download certified test reports online" },
];

const features = [
  { icon: Shield, title: "FSSAI Compliance", desc: "All tests aligned with FSSAI standards and IS methods" },
  { icon: Building2, title: "Accredited Labs", desc: "NABL accredited and FSSAI approved laboratories" },
  { icon: CreditCard, title: "Online Payment", desc: "Secure payments via Razorpay with instant receipts" },
  { icon: MapPin, title: "Real-time Tracking", desc: "Track your sample testing progress live" },
  { icon: FileText, title: "Downloadable Reports", desc: "Get certified PDF reports instantly" },
  { icon: MessageSquare, title: "WhatsApp Notifications", desc: "Status updates directly on WhatsApp" },
];

const testimonials = [
  { name: "Anita Desai", business: "Desai Dairy Products", text: "FoodLab made our FSSAI compliance testing so much easier. Reports are delivered fast and the platform is intuitive.", rating: 5 },
  { name: "Mohammed Farooq", business: "Farooq Spice Exports", text: "We've been using FoodLab for 6 months now. The lab network is excellent and pricing is very competitive.", rating: 5 },
  { name: "Lakshmi Iyer", business: "Iyer's Kitchen", text: "As a small business owner, FoodLab has been a game-changer. Easy to use and great customer support.", rating: 4 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Beaker className="h-7 w-7 text-secondary" />
            <span className="text-xl font-bold text-primary">FoodLab</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/register">Register</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground lg:text-6xl">
              Get Your Food Products Lab Tested — <span className="text-gradient">Fast, Transparent, Certified</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              India's leading platform connecting food businesses with NABL-accredited laboratories. 
              Book tests, track progress, and download certified reports — all online.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link to="/register">Book a Test <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/register">Register Your Business</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center justify-center gap-8 py-8 md:flex-row md:gap-16">
          {["500+ Tests Available", "50+ Accredited Labs", "10,000+ Reports Delivered"].map((stat) => (
            <div key={stat} className="text-center text-lg font-semibold">{stat}</div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <step.icon className="h-8 w-8 text-secondary" />
                </div>
                <div className="mb-1 text-sm font-semibold text-secondary">Step {i + 1}</div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Platform Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <f.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-status-pending text-status-pending" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Beaker className="h-6 w-6 text-secondary" />
                <span className="text-lg font-bold text-primary">FoodLab</span>
              </div>
              <p className="text-sm text-muted-foreground">India's trusted food testing platform for FSSAI compliance.</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><Link to="/register" className="hover:text-foreground">Register</Link></p>
                <p><Link to="/login" className="hover:text-foreground">Login</Link></p>
                <p><a href="#features" className="hover:text-foreground">Features</a></p>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="#" className="hover:text-foreground">FSSAI Guidelines</a></p>
                <p><a href="#" className="hover:text-foreground">Help Center</a></p>
                <p><a href="#" className="hover:text-foreground">API Docs</a></p>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-foreground">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="#" className="hover:text-foreground">Privacy Policy</a></p>
                <p><a href="#" className="hover:text-foreground">Terms of Service</a></p>
                <p><a href="#" className="hover:text-foreground">Refund Policy</a></p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2024 FoodLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
