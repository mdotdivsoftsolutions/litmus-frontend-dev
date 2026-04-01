import { Link, useLocation } from "react-router-dom";
import { Home, FlaskConical, ShoppingCart, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTabNavigationProps {
  cartCount: number;
}

export function MobileTabNavigation({ cartCount }: MobileTabNavigationProps) {
  const location = useLocation();

  const bottomTabs = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Tests", href: "/tests", icon: FlaskConical },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Orders", href: "/orders", icon: ClipboardList },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
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
  );
}
