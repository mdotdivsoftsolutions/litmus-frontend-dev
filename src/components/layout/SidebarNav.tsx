import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Package, FlaskConical, BookOpen, CreditCard, FileText, FolderOpen, UserCircle,
  Users, Building2, ClipboardList, Grid3X3, ShoppingBag, TestTubes, BarChart3, FileCheck,
  Upload, DollarSign, CalendarDays, X, Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  portal: "user" | "admin" | "lab";
  open: boolean;
  onClose: () => void;
}

const userNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Products & Tests", icon: Package, href: "/dashboard/products" },
  { label: "Laboratories", icon: FlaskConical, href: "/dashboard/laboratories" },
  { label: "My Bookings", icon: BookOpen, href: "/dashboard/bookings" },
  { label: "Payments", icon: CreditCard, href: "/dashboard/payments" },
  { label: "Reports", icon: FileText, href: "/dashboard/reports" },
  { label: "Documents", icon: FolderOpen, href: "/dashboard/documents" },
  { label: "Profile", icon: UserCircle, href: "/dashboard/profile" },
];

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Laboratories", icon: Building2, href: "/admin/laboratories" },
  { label: "Bookings", icon: ClipboardList, href: "/admin/bookings" },
  { label: "Categories", icon: Grid3X3, href: "/admin/categories" },
  { label: "Products", icon: ShoppingBag, href: "/admin/products" },
  { label: "Tests", icon: TestTubes, href: "/admin/tests" },
  { label: "Payments", icon: DollarSign, href: "/admin/payments" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Reports", icon: FileCheck, href: "/admin/reports" },
];

const labNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/lab/dashboard" },
  { label: "Bookings", icon: ClipboardList, href: "/lab/bookings" },
  { label: "Upload Results", icon: Upload, href: "/lab/upload" },
  { label: "Pricing", icon: DollarSign, href: "/lab/pricing" },
  { label: "Schedule", icon: CalendarDays, href: "/lab/schedule" },
  { label: "Profile", icon: UserCircle, href: "/lab/profile" },
];

const navMap = { user: userNav, admin: adminNav, lab: labNav };
const titleMap = { user: "FoodLab", admin: "FoodLab Admin", lab: "FoodLab Lab" };

export function SidebarNav({ portal, open, onClose }: SidebarNavProps) {
  const location = useLocation();
  const navItems = navMap[portal];

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={onClose} />}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:relative lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold">{titleMap[portal]}</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && item.href !== "/lab/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-primary" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/50">© 2024 FoodLab Platform</p>
        </div>
      </aside>
    </>
  );
}
