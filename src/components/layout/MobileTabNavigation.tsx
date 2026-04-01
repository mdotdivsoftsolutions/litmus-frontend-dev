import { Link, useLocation } from "react-router-dom";
import { Home, FlaskConical, ShoppingCart, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "../cart/CartDrawer";

interface MobileTabNavigationProps {
  cartCount: number;
}

export function MobileTabNavigation({ cartCount }: MobileTabNavigationProps) {
  const location = useLocation();

  const bottomTabs = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Tests", href: "/tests", icon: FlaskConical },
    { label: "Cart", icon: ShoppingCart },
    { label: "Orders", href: "/orders", icon: ClipboardList },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14">
        {bottomTabs.map((tab) => {
          const isActive = tab.href && (location.pathname === tab.href || (tab.href !== "/home" && location.pathname.startsWith(tab.href)));
          const content = (
            <div className="flex flex-col items-center gap-0.5 py-1 px-3 relative cursor-pointer">
              <tab.icon className={cn("h-5 w-5", isActive ? "text-[#D32F2F]" : "text-muted-foreground")} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-[#D32F2F]" : "text-muted-foreground")}>
                {tab.label}
              </span>
              {isActive && <span className="absolute -bottom-0 w-5 h-0.5 rounded-full bg-[#D32F2F]" />}
              {tab.label === "Cart" && cartCount > 0 && (
                <span className="absolute -top-0.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D32F2F] text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
          );

          if (tab.label === "Cart") {
            return (
              <CartDrawer key={tab.label}>
                {content}
              </CartDrawer>
            );
          }

          return (
            <Link key={tab.label} to={tab.href as string}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
