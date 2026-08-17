import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Package, FileText, UserCircle,
  Users, Building2, ClipboardList, Grid3X3, TestTubes, FileCheck,
  DollarSign, X, Flame, ChevronLeft, ChevronRight, MessageSquareQuote, CheckSquare,
  Settings, LogOut, ChevronUp
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { adminApi } from "@/lib/api/admin";

interface SidebarNavProps {
  portal: "admin" | "user" | "lab";
  open: boolean;
  onClose: () => void;
  user?: any;
  onLogoutClick?: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Employees", icon: UserCircle, href: "/admin/employees", permission: "MANAGE_EMPLOYEES" },
  { label: "Consultations", icon: FileText, href: "/admin/consultations", permission: "VIEW_LEADS" },
  { label: "Users", icon: Users, href: "/admin/users", permission: "MANAGE_USERS" },
  { label: "Laboratories", icon: Building2, href: "/admin/laboratories", permission: "MANAGE_LABS" },
  { label: "Bookings", icon: ClipboardList, href: "/admin/bookings", permission: "VIEW_BOOKINGS" },
  { label: "Categories", icon: Grid3X3, href: "/admin/categories" },
  { label: "Tests", icon: TestTubes, href: "/admin/tests" },
  { label: "Packages", icon: Package, href: "/admin/packages" },
  { label: "Payments", icon: DollarSign, href: "/admin/payments" },
  { label: "Reviews", icon: MessageSquareQuote, href: "/admin/reviews" },
  { label: "Reports", icon: FileCheck, href: "/admin/reports" },
  { label: "Approvals", icon: CheckSquare, href: "/admin/approvals" },
  { label: "Settings", icon: Flame, href: "/admin/settings" },
];

export function SidebarNav({ portal: _portal, open, onClose, user, onLogoutClick }: SidebarNavProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Live sidebar metrics
  const { data: statsResponse } = useQuery({
    queryKey: ["adminStats"],
    queryFn: adminApi.getStats,
    refetchInterval: 30000,
  });
  const stats = statsResponse?.data || {};

  const getItemBadge = (label: string): number | null => {
    if (!statsResponse?.data) return null;
    switch (label) {
      case "Users":
        return stats.activeUsers ?? stats.totalUsers ?? 0;
      case "Employees":
        return stats.activeEmployees ?? stats.totalEmployees ?? 0;
      case "Consultations":
        return stats.pendingConsultations > 0 ? stats.pendingConsultations : (stats.totalConsultations ?? 0);
      case "Laboratories":
        return stats.activeLabs ?? stats.totalLabs ?? 0;
      case "Bookings":
        return stats.pendingBookings > 0 ? stats.pendingBookings : (stats.totalBookings ?? 0);
      case "Categories":
        return stats.totalCategories ?? 0;
      case "Tests":
        return stats.totalTests ?? 0;
      case "Packages":
        return stats.totalPackages ?? 0;
      case "Reviews":
        return stats.totalReviews ?? 0;
      case "Reports":
        return stats.pendingReports ?? 0;
      case "Approvals":
        return stats.pendingApprovals ?? 0;
      default:
        return null;
    }
  };
  
  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter((item: any) => {
    if (user?.role === "ADMIN") return true; 
    
    if (user?.role === "EMPLOYEE") {
      if (item.permission) {
        return user.permissions?.includes(item.permission);
      }
      const hasOnlyLeads = user.permissions?.length === 1 && user.permissions[0] === "VIEW_LEADS";
      if (hasOnlyLeads && !item.permission && item.label !== "Dashboard") return false;
      return true;
    }
    return true;
  });

  const getInitials = () => {
    if (!user) return "SA";
    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
    if (initials) return initials;
    if (user.name) return user.name.slice(0, 2).toUpperCase();
    return "SA";
  };

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || "System Admin"
    : "System Admin";

  const roleName = user?.role ? user.role.replace(/_/g, " ").toUpperCase() : "SUPER ADMIN";
  const userEmail = user?.email || "admin@litmus.com";

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 text-slate-600 transition-all duration-200 shrink-0 lg:static lg:h-screen lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-16" : "w-60"
      )}>
        {/* Header with Logo and Top Collapse Toggle */}
        <div className={cn(
          "flex h-16 shrink-0 items-center border-b border-slate-200 px-3.5",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed ? (
            <>
              <Link to="/" className="flex flex-col items-start outline-none focus:outline-none select-none">
                <img src="/logo.png" alt="Litmus Logo" className="h-9 object-contain" />
                <div className="leading-none mt-1">
                  <span className="block text-[9px] tracking-wider text-slate-500 font-bold uppercase">ADMIN PANEL</span>
                </div>
              </Link>
              <button
                type="button"
                className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none focus:outline-none"
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="hidden lg:flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors outline-none focus:outline-none"
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close toggle */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none focus:outline-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links — contained scroll within sidebar only */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/admin/dashboard" && location.pathname.startsWith(item.href));
            const badgeCount = getItemBadge(item.label);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                title={collapsed ? `${item.label}${badgeCount !== null && badgeCount !== undefined ? ` (${badgeCount})` : ''}` : undefined}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0 select-none group relative",
                  collapsed && "justify-center px-2",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 flex items-center justify-center">
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                  </div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && badgeCount !== null && badgeCount !== undefined && (
                  <span className={cn(
                    "min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors shrink-0 ml-1.5 tabular-nums",
                    isActive
                      ? "bg-primary text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-800"
                  )}>
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile with Interactive Popover */}
        <div className={cn("shrink-0 border-t border-slate-200", collapsed ? "p-2 flex justify-center" : "p-2.5")}>
          <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <PopoverTrigger asChild>
              {collapsed ? (
                <button
                  type="button"
                  title={fullName}
                  className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0"
                >
                  {getInitials()}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </button>
              ) : (
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between gap-2 p-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all text-left group shadow-xs outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0",
                    isUserMenuOpen && "bg-slate-50 border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-xs">
                        {getInitials()}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="leading-tight overflow-hidden min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {fullName}
                      </p>
                      <p className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5 truncate">
                        {roleName}
                      </p>
                    </div>
                  </div>
                  <ChevronUp className={cn("h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200", isUserMenuOpen ? "rotate-0 text-slate-700" : "rotate-180")} />
                </button>
              )}
            </PopoverTrigger>

            <PopoverContent
              side={collapsed ? "right" : "top"}
              align={collapsed ? "end" : "start"}
              sideOffset={10}
              className="w-56 p-2 rounded-xl shadow-xl border border-slate-200 bg-white z-50 outline-none focus:outline-none focus-visible:outline-none ring-0"
            >
              {/* User Header Details */}
              <div className="px-1.5 py-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-xs font-bold text-slate-900 truncate">{fullName}</p>
                  <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0 h-4 uppercase tracking-wider bg-slate-100 text-slate-700 border-slate-200 shrink-0">
                    {roleName}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
              </div>

              <div className="my-1.5 border-t border-slate-100" />

              {/* Menu Links */}
              <div className="space-y-0.5">
                <Link
                  to="/admin/settings"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none focus:outline-none focus:bg-slate-100"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-500" />
                  <span>Platform Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left outline-none focus:outline-none focus:bg-rose-50 focus:ring-0 border-0"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>

      {/* Confirmation modal before sign out */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out of the Admin Panel? You will need to log in again to access the dashboard."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => onLogoutClick?.()}
      />
    </>
  );
}
