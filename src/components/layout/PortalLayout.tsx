import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { TopNavbar } from "./TopNavbar";

interface PortalLayoutProps {
  portal: "user" | "admin" | "lab";
  userName?: string;
}

export function PortalLayout({ portal, userName }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <SidebarNav portal={portal} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} userName={userName} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
