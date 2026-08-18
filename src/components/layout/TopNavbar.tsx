import { useLocation, Link, useNavigate } from "react-router-dom";
import { Bell, ChevronRight, Menu, Headphones, UserCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, title: "New Booking", message: "A new booking has been placed.", time: "2m ago", read: false },
];

interface TopNavbarProps {
  onMenuClick: () => void;
  user?: any;
  onLogoutClick?: () => void;
  portal?: string;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const { incomingRequests, acceptChat } = useAdminSocket();
  const latestIncoming = incomingRequests[0];

  const handleQuickAccept = async (sessionId: string) => {
    const result = await acceptChat(sessionId);
    if (result.success) {
      navigate("/admin/live-support");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <button 
        type="button" 
        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 outline-none focus:outline-none" 
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            <span className={i === pathParts.length - 1 ? "font-medium text-foreground capitalize" : "capitalize"}>
              {part.replace(/-/g, " ")}
            </span>
          </span>
        ))}
      </nav>

      {/* Incoming Live Support Alert Banner in TopNav */}
      {latestIncoming && (
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 animate-pulse ml-4">
          <div className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-xs font-bold">
            Live Chat Request: {latestIncoming.guestInfo?.name || "Client"}
          </span>
          <Button
            size="sm"
            onClick={() => handleQuickAccept(latestIncoming.sessionId)}
            className="h-6 px-2 text-[11px] rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold border-0 shadow-xs"
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Accept
          </Button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs pointer-events-none ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 shadow-xl border border-slate-200 bg-white rounded-xl outline-none focus:outline-none">
            <div className="px-3 py-1.5 font-semibold text-xs text-slate-900 flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <DropdownMenuSeparator className="my-1" />
            {notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 outline-none focus:outline-none focus:bg-slate-50"
              >
                <div className="flex items-center gap-2 w-full">
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{n.time}</span>
                </div>
                <span className="text-xs text-slate-600">{n.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
