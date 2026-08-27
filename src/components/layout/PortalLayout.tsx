import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { SidebarNav } from "./SidebarNav";
import { TopNavbar } from "./TopNavbar";
import { LiveSupportToaster } from "./LiveSupportToaster";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  portal: "user" | "admin" | "lab";
}

export function PortalLayout({ portal }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const isLiveSupport = location.pathname.includes("/live-support");
  const isSettings = location.pathname.includes("/settings");

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });

  const user = userResponse?.data;

  const handleLogout = async () => {
    try {
      await authApi.logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(portal === "admin" ? "/admin/login" : "/laboratory/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarNav portal={portal} open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onLogoutClick={handleLogout} />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} user={user} onLogoutClick={handleLogout} portal={portal} />
        <main className={cn(
          "flex-1 min-w-0 min-h-0",
          isLiveSupport
            ? "p-0 overflow-hidden flex flex-col"
            : isSettings
            ? "p-4 lg:p-6 overflow-hidden flex flex-col"
            : "overflow-y-auto p-4 lg:p-6"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
