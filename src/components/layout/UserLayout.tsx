import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Flame, Search, ShoppingCart, MapPin, ChevronDown, Home, FlaskConical, ClipboardList, User, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Tests", href: "/tests", icon: FlaskConical },
  { label: "Labs", href: "/labs", icon: FlaskConical },
  { label: "My Orders", href: "/orders", icon: ClipboardList },
  { label: "Reports", href: "/reports", icon: ClipboardList },
];

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

export function UserLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState("Chennai");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const bottomTabs = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Tests", href: "/tests", icon: FlaskConical },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Orders", href: "/orders", icon: ClipboardList },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Top Navbar */}
      <header className={cn(
        "sticky top-0 z-50 bg-card border-b transition-shadow duration-200",
        scrolled ? "shadow-md border-border" : "border-border"
      )}>
        <div className="max-w-7xl mx-auto flex items-center h-14 px-4 gap-3">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <Flame className="h-6 w-6 text-primary" />
            <div className="leading-none hidden sm:block">
              <span className="text-sm font-bold text-secondary tracking-tight">LITMUS</span>
              <span className="block text-[8px] tracking-[0.15em] text-primary font-medium -mt-0.5">FOOD ANALYTICS</span>
            </div>
          </Link>

          {/* City Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-medium text-foreground hover:bg-muted rounded-full px-3">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {city}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {cities.map((c) => (
                <DropdownMenuItem key={c} onClick={() => setCity(c)} className={cn(c === city && "bg-muted font-medium")}>{c}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/home" && location.pathname.startsWith(link.href));
              return (
                <Link key={link.href} to={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    isActive ? "text-primary bg-flame-red-tint" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Right side icons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link to="/tests"><Search className="h-4.5 w-4.5 text-foreground" /></Link>
            </Button>
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
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">RK</AvatarFallback>
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

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/home" && location.pathname.startsWith(link.href));
              return (
                <Link key={link.href} to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive ? "text-primary bg-flame-red-tint" : "text-foreground hover:bg-muted"
                  )}>
                  <link.icon className="h-4 w-4" />
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
