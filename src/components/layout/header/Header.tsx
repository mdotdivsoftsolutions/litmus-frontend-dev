import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, MapPin, ChevronDown, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CartDrawer } from "../../cart/CartDrawer";

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface HeaderProps {
  scrolled: boolean;
  city: string;
  setCity: (city: string) => void;
  cartCount: number;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  showAnnouncement: boolean;
  onLoginClick: () => void;
}

export function Header({ 
  scrolled, city, setCity, cartCount, showSearch, setShowSearch, 
  mobileMenuOpen, setMobileMenuOpen, showAnnouncement, onLoginClick
}: HeaderProps) {
  const location = useLocation();

  const desktopLinks = [
    { label: "Home", href: "/home" },
    { label: "Tests", href: "/tests" },
    { label: "Packages", href: "/packages" },
    { label: "Labs", href: "/labs" },
    { label: "Consultation", href: "/consultation" },
    { label: "Support", href: "/support" },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-card border-b border-border transition-shadow duration-200",
      scrolled && "shadow-md"
    )}>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-gradient-brand text-white text-xs py-2 px-4 text-center tracking-wide font-medium">
          Book a Food Safety Test Now and Get Up to 20% Off your first order!
        </div>
      )}

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
                  isActive ? "text-gradient-brand" : "text-muted-foreground hover:text-gradient-brand"
                )}>
                {link.label}
              </Link>
            );
          })}
          {/* Login Button instead of Link */}
          <button
            onClick={onLoginClick}
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-gradient-brand transition-colors"
          >
            Login
          </button>
        </nav>

        <div className="flex-1 lg:hidden" />

        {/* Right side icons */}
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-4.5 w-4.5 text-foreground" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex group/phone hover:bg-transparent" asChild>
            <a href="#"><Phone className="h-4 w-4 text-foreground group-hover/phone:text-brand-primary" /></a>
          </Button>

          <CartDrawer>
            <Button variant="ghost" size="icon" className="pr-2 h-9 w-9 relative hover:bg-transparent group/cart transition-all duration-300">
              <ShoppingCart className="h-4.5 w-4.5 text-foreground group-hover/cart:text-brand-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex hover:bg-transparent">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-brand text-primary-foreground text-xs font-bold">RK</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/reports">Reports</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Change Logout to Login Trigger if not logged in, or just keep as is for demo */}
              <DropdownMenuItem onClick={onLoginClick}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          {[
            { label: "Home", href: "/home" },
            { label: "Tests", href: "/tests" },
            { label: "Packages", href: "/packages" },
            { label: "Labs", href: "/labs" },
            { label: "Consultation", href: "/consultation" },
            { label: "Support", href: "/support" }
          ].map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium",
                  isActive ? "text-primary bg-muted" : "text-foreground hover:bg-muted"
                )}>
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={onLoginClick}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
