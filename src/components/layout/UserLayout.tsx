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
  { label: "Tests", href: "/tests" },
  { label: "Labs", href: "/labs" },
  { label: "My Orders", href: "/orders" },
  { label: "Reports", href: "/reports" },
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
        <div className="bg-secondary text-secondary-foreground text-center py-2 px-4 text-xs sm:text-sm relative">
          <span>🔥 Book 3+ tests and get FREE report delivery | Use: </span>
          <span className="font-bold text-flame-amber">LITMUS10</span>
          <span className="mx-2">—</span>
          <Link to="/tests" className="font-semibold text-flame-amber hover:underline">Book Now</Link>
          <button onClick={() => setShowAnnouncement(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-foreground/60 hover:text-secondary-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className={cn(
        "sticky top-0 z-50 bg-card border-b border-border transition-shadow duration-200",
        scrolled && "shadow-md"
      )}>
        <div className="max-w-7xl mx-auto flex items-center h-16 px-4 gap-3">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <Flame className="h-6 w-6 text-primary" />
            <div className="leading-none hidden sm:block">
              <span className="text-sm font-bold text-secondary tracking-tight">litmus</span>
              <span className="block text-[8px] tracking-[0.15em] text-primary font-medium -mt-0.5">FOOD ANALYTICS</span>
            </div>
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
      <footer className="hidden lg:block bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-primary" />
                <div className="leading-none">
                  <span className="text-sm font-bold text-white">litmus</span>
                  <span className="block text-[8px] tracking-[0.15em] text-primary">FOOD ANALYTICS</span>
                </div>
              </div>
              <p className="text-sm text-secondary-foreground/60">India's trusted food testing platform. NABL accredited, FSSAI certified.</p>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-semibold text-flame-amber text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm text-secondary-foreground/60">
                <p className="hover:text-accent cursor-pointer">About Us</p>
                <p className="hover:text-accent cursor-pointer">Careers</p>
                <p className="hover:text-accent cursor-pointer">Blog</p>
                <p className="hover:text-accent cursor-pointer">Contact</p>
              </div>
            </div>
            {/* Services */}
            <div>
              <h4 className="font-semibold text-flame-amber text-sm mb-3">Services</h4>
              <div className="space-y-2 text-sm text-secondary-foreground/60">
                <p className="hover:text-accent cursor-pointer">Food Testing</p>
                <p className="hover:text-accent cursor-pointer">FSSAI Certification</p>
                <p className="hover:text-accent cursor-pointer">Lab Partners</p>
                <p className="hover:text-accent cursor-pointer">Bulk Testing</p>
              </div>
            </div>
            {/* Policy */}
            <div>
              <h4 className="font-semibold text-flame-amber text-sm mb-3">Policy</h4>
              <div className="space-y-2 text-sm text-secondary-foreground/60">
                <p className="hover:text-accent cursor-pointer">Terms of Service</p>
                <p className="hover:text-accent cursor-pointer">Privacy Policy</p>
                <p className="hover:text-accent cursor-pointer">Refund Policy</p>
                <p className="hover:text-accent cursor-pointer">FAQ</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-secondary-foreground/40">
            © 2026 Litmus Food Analytics. All rights reserved.
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
