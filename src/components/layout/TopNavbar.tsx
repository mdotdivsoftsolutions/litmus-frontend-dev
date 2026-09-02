import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  ChevronRight, 
  Menu, 
  Headphones, 
  ClipboardList, 
  Building2, 
  FlaskConical, 
  CheckCheck,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAdminSocket } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import { notificationApi, InAppNotificationItem } from "@/lib/api/notification";

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "NEW_BOOKING":
      return <ClipboardList className="h-4 w-4 text-emerald-600" />;
    case "NEW_LAB_ONBOARDING":
      return <Building2 className="h-4 w-4 text-blue-600" />;
    case "REPORT_UPLOADED":
    case "LAB_UPDATE":
      return <FlaskConical className="h-4 w-4 text-purple-600" />;
    case "SUPPORT_REQUEST":
      return <MessageSquare className="h-4 w-4 text-amber-600" />;
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
}

interface TopNavbarProps {
  onMenuClick: () => void;
  user?: any;
  onLogoutClick?: () => void;
  portal?: string;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const { incomingRequests, presenceStatus } = useAdminSocket();

  // 1. Fetch live unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["adminNotificationsUnreadCount"],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 15000,
    staleTime: 10000,
  });

  // 2. Fetch recent notifications
  const { data: notificationData } = useQuery({
    queryKey: ["adminRecentNotifications"],
    queryFn: () => notificationApi.getNotifications({ limit: 8 }),
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const notifications = notificationData?.notifications || [];

  // 3. Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminRecentNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsList"] });
    },
  });

  // 4. Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminRecentNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsList"] });
    },
  });

  const handleNotificationClick = (n: InAppNotificationItem) => {
    if (!n.isRead) {
      markAsReadMutation.mutate(n._id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <button 
        type="button" 
        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 outline-none focus:outline-none" 
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            <span className={i === pathParts.length - 1 ? "font-medium text-foreground capitalize" : "capitalize"}>
              {part.replace(/-/g, " ")}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* Live Support Link with live incoming count */}
        <Link
          to="/admin/live-support"
          className={cn(
            "relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors outline-none",
            presenceStatus === "ONLINE" ? "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100/50" : 
            presenceStatus === "BUSY" ? "bg-amber-50/50 border-amber-200 hover:bg-amber-100/50" :
            "bg-slate-50 border-slate-200 hover:bg-slate-100"
          )}
          title="Live Support Desk"
          aria-label="Live Support"
        >
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-2 w-2 rounded-full ring-2 ring-white shadow-sm",
                presenceStatus === "ONLINE" && "bg-emerald-500 animate-pulse",
                presenceStatus === "BUSY" && "bg-amber-500",
                presenceStatus === "OFFLINE" && "bg-slate-400"
              )}
            />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block",
              presenceStatus === "ONLINE" ? "text-emerald-700" :
              presenceStatus === "BUSY" ? "text-amber-700" :
              "text-slate-500"
            )}>
              {presenceStatus}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />
          <Headphones className="h-4 w-4 text-slate-600" />
          
          {incomingRequests.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-xs pointer-events-none ring-2 ring-white animate-pulse">
              {incomingRequests.length}
            </span>
          )}
        </Link>

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 border-0"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="h-5 w-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs pointer-events-none ring-2 ring-white animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            sideOffset={8}
            className="w-[380px] sm:w-[420px] p-0 shadow-2xl border border-slate-200/90 bg-white rounded-2xl outline-none focus:outline-none overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 ? (
                  <span className="text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    All caught up
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="text-[11px] text-primary hover:text-primary-deep font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-primary/5"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
            
            {/* List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-bold text-xs text-slate-800">No new notifications</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    You're all caught up! New bookings, onboarding requests, and lab updates will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                      "flex items-start gap-3.5 p-3.5 cursor-pointer transition-colors outline-none focus:outline-none rounded-none border-b border-slate-50 last:border-0",
                      n.isRead ? "bg-white hover:bg-slate-50/80 opacity-80" : "bg-primary/[0.03] hover:bg-primary/[0.07]"
                    )}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs shrink-0 mt-0.5">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-xs truncate", n.isRead ? "font-semibold text-slate-700" : "font-bold text-slate-950")}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-slate-50/80 border-t border-slate-100">
              <Link
                to="/admin/notifications"
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-primary hover:text-primary-deep text-center w-full transition-colors rounded-xl hover:bg-white hover:shadow-2xs"
              >
                <span>View all notifications</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


