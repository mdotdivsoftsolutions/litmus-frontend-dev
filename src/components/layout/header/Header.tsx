import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, MapPin, ChevronDown, Phone, Menu, X, Home, FlaskConical, Package, Building2, Stethoscope, Headphones, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CartDrawer } from "../../cart/CartDrawer";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

const navLinks = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Tests", href: "/tests", icon: FlaskConical },
  { label: "Packages", href: "/packages", icon: Package },
  { label: "Labs", href: "/labs", icon: Building2 },
  { label: "Consultation", href: "/consultation", icon: Stethoscope },
  { label: "Support", href: "/support", icon: Headphones },
];

interface HeaderProps {
  scrolled: boolean;
  city: string;
  setCity: (city: string) => void;
  cartCount: number;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLoginClick: () => void;
  onLogoutClick?: () => void;
  user?: any;
}

export function Header({ 
  scrolled, city, setCity, cartCount, showSearch, setShowSearch, 
  mobileMenuOpen, setMobileMenuOpen, onLoginClick, onLogoutClick, user
}: HeaderProps) {
  const location = useLocation();

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 bg-card border-b border-border transition-shadow duration-200",
        scrolled && "shadow-md"
      )}>
        <div className="max-w-7xl mx-auto flex items-center h-16 px-4 gap-3">
          {/* Logo */}
          <Link to="/home" className="flex items-center shrink-0">
             <img src="/logo.png" alt="Litmus Food Analytics" className="h-9 sm:h-10 object-contain" />
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
            <SearchAutocomplete 
              placeholder="Search for tests, products..."
              className="w-full"
              inputClassName="h-10 rounded-full border-border focus:border-accent bg-background text-sm"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
              return (
                <Link key={link.href} to={link.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-semibold transition-colors",
                    isActive ? "text-gradient-brand" : "text-slate-900 hover:text-gradient-brand"
                  )}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 lg:hidden" />

          {/* Right side icons */}
          <div className="flex items-center gap-0.5">
            {/* Mobile search icon */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden hover:bg-transparent active:bg-transparent focus:bg-transparent"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4.5 w-4.5 text-foreground" />
            </Button>

            {/* Phone — hidden on mobile */}
            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex group/phone hover:bg-transparent" asChild>
              <a href="#"><Phone className="h-4 w-4 text-foreground group-hover/phone:text-brand-primary" /></a>
            </Button>

            {/* Cart — HIDDEN on mobile */}
            <CartDrawer>
              <Button
                variant="ghost"
                size="icon"
                className="pr-2 h-9 w-9 relative hover:bg-transparent active:bg-transparent focus:bg-transparent group/cart transition-all duration-300 hidden sm:flex"
              >
                <ShoppingCart className="h-4.5 w-4.5 text-foreground group-hover/cart:text-brand-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* Avatar — hidden on mobile */}
            {!user ? (
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex hover:bg-transparent" onClick={onLoginClick}>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-muted text-muted-foreground"><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex hover:bg-transparent">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-transparent text-slate-800 border border-slate-200 text-xs font-bold">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild><Link to="/admin/dashboard">Admin Dashboard</Link></DropdownMenuItem>
                  )}
                  {user.role === "LAB" && (
                    <DropdownMenuItem asChild><Link to="/lab/dashboard">Lab Dashboard</Link></DropdownMenuItem>
                  )}
                  {(!user.role || user.role === "USER") && (
                    <>
                      <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/reports">Reports</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger — mobile only, no bg flash */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen
                ? <X className="h-5 w-5 text-foreground" />
                : <Menu className="h-5 w-5 text-foreground" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="lg:hidden px-4 pb-3 animate-fade-in">
            <SearchAutocomplete 
              placeholder="Search for tests, products..." 
              className="w-full"
              inputClassName="h-10 rounded-full border-border bg-background text-sm" 
            />
          </div>
        )}
      </header>

      {/* ═══════════ MOBILE DRAWER ═══════════ */}
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-in drawer from right */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <img src="/logo.png" alt="Litmus" className="h-8 object-contain" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer — Login CTA or User Info */}
        {!user ? (
          <div className="px-4 py-5 border-t border-border mb-14">
            <button
              onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </button>
          </div>
        ) : (
          <div className="px-4 py-5 border-t border-border mb-14 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-10 w-10 ring-2 ring-slate-100 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email || user.phone}</p>
                {user.role !== "USER" && (
                  <p className="text-[10px] text-brand-primary font-bold mt-0.5">{user.role} ACCOUNT</p>
                )}
              </div>
            </div>
            {user.role === "ADMIN" && (
              <Link to="/admin/dashboard" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-sm font-semibold hover:bg-brand-primary/10 transition-colors mb-2">
                Go to Admin Dashboard
              </Link>
            )}
            {user.role === "LAB" && (
              <Link to="/lab/dashboard" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-sm font-semibold hover:bg-brand-primary/10 transition-colors mb-2">
                Go to Lab Dashboard
              </Link>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); if (onLogoutClick) onLogoutClick(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
