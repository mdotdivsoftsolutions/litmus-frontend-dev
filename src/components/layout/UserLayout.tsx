import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Flame, Search, ShoppingCart, MapPin, ChevronDown, Home, FlaskConical, ClipboardList, User, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

const desktopLinks = [
  { label: "Homepage", href: "/home" },
  { label: "Tests", href: "/tests" },
  { label: "Packages", href: "/packages" },
  { label: "Labs", href: "/labs" },
  { label: "Book consultation", href: "/consultation" },
  { label: "Support", href: "/support" },
  { label: "Login", href: "/login" },
];

export function UserLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState("Chennai");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [cartCount] = useState(2);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); setShowSearch(false); }, [location.pathname]);

  const bottomTabs = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Tests", href: "/tests", icon: FlaskConical },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Orders", href: "/orders", icon: ClipboardList },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#D32F2F] text-white text-xs py-2 px-4 text-center tracking-wide font-medium">
          Book a Food Safety Test Now and Get Up to 20% Off your first order!
        </div>
      )}

      {/* Main Navbar */}
      <header className={cn(
        "sticky top-0 z-50 bg-card border-b border-border transition-shadow duration-200",
        scrolled && "shadow-md"
      )}>
        <div className="max-w-7xl mx-auto flex items-center h-16 px-4 gap-3">
          {/* Logo */}
          <Link to="/home" className="flex items-center shrink-0">
             <img src="/litmus-logo.png" alt="Litmus Food Analytics" className="h-9 sm:h-10 object-contain" />
          </Link>

          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs hover:bg-transparent px-2 ml-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <div className="text-left hidden sm:block">
                  <span className="block text-[10px] text-muted-foreground leading-none">MY LOCATION</span>
                  <span className="block text-sm font-semibold text-foreground leading-tight">{city}</span>
                </div>
                <span className="sm:hidden text-sm font-semibold text-foreground">{city}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {cities.map((c) => (
                <DropdownMenuItem key={c} onClick={() => setCity(c)} className={cn(c === city && "bg-muted font-medium")}>{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for tests, products..."
              className="pl-9 h-10 rounded-full border-border focus:border-accent bg-background text-sm"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            {desktopLinks.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
              return (
                <Link key={link.href} to={link.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 lg:hidden" />

          {/* Right side icons */}
          <div className="flex items-center gap-0.5">
            {/* Mobile search toggle */}
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-4.5 w-4.5 text-foreground" />
            </Button>

            {/* Support */}
            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex" asChild>
              <a href="#"><Phone className="h-4 w-4 text-foreground" /></a>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-4.5 w-4.5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Profile Dropdown - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">RK</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/reports">Reports</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/login">Logout</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="lg:hidden px-4 pb-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for tests, products..." className="pl-9 h-10 rounded-full border-border bg-background text-sm" autoFocus />
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-fade-in">
            {[{ label: "Home", href: "/home" }, ...desktopLinks].map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.href} to={link.href}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive ? "text-primary bg-flame-red-tint" : "text-foreground hover:bg-muted"
                  )}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Footer - Desktop only */}
      <footer className="hidden lg:block bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-start">
                <img src="/litmus-logo.png" alt="Litmus Food Analytics" className="h-10 sm:h-12 object-contain" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed pr-4">
                India's most trusted platform for food testing and certification. NABL accredited & FSSAI certified lab network.
              </p>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-5 uppercase tracking-wider">Company</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <Link to="/about" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">About Us</Link>
                <Link to="/careers" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Careers</Link>
                <Link to="/blogs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Blogs</Link>
                <Link to="/contact" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Contact Us</Link>
              </div>
            </div>
            {/* Services (From Header) */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-5 uppercase tracking-wider">Services</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <Link to="/tests" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Tests</Link>
                <Link to="/packages" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Packages</Link>
                <Link to="/labs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Labs</Link>
                <Link to="/consultation" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Book Consultation</Link>
                <Link to="/support" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Support</Link>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <Link to="/cart" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Cart</Link>
                <Link to="/help" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Help Center</Link>
                <Link to="/faqs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">FAQs</Link>
                <Link to="/track-order" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Track Order</Link>
              </div>
            </div>
            {/* Policies */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-5 uppercase tracking-wider">Policies</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <Link to="/terms" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Terms &amp; Condition</Link>
                <Link to="/privacy" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Privacy Policy</Link>
                <Link to="/nabl" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">NABL Data</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex items-center justify-between">
            <div className="text-[13px] text-slate-400 font-medium">
              © {new Date().getFullYear()} Litmus Food Analytics. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-slate-400">
               <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">Twitter</span>
               <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">LinkedIn</span>
               <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">Instagram</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around h-14">
          {bottomTabs.map((tab) => {
            const isActive = location.pathname === tab.href || (tab.href !== "/home" && location.pathname.startsWith(tab.href));
            return (
              <Link key={tab.href} to={tab.href}
                className="flex flex-col items-center gap-0.5 py-1 px-3 relative">
                <tab.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {tab.label}
                </span>
                {isActive && <span className="absolute -bottom-0 w-5 h-0.5 rounded-full bg-primary" />}
                {tab.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-0.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
