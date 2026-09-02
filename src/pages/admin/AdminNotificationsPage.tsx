import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Search, 
  CheckCheck, 
  Trash2, 
  ClipboardList, 
  Building2, 
  FlaskConical, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationApi, InAppNotificationItem } from "@/lib/api/notification";
import { cn } from "@/lib/utils";

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
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

function getNotificationBadge(type: string) {
  switch (type) {
    case "NEW_BOOKING":
      return { label: "Booking", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ClipboardList };
    case "NEW_LAB_ONBOARDING":
      return { label: "Onboarding", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Building2 };
    case "REPORT_UPLOADED":
      return { label: "Report", color: "bg-purple-50 text-purple-700 border-purple-200", icon: FlaskConical };
    case "LAB_UPDATE":
      return { label: "Lab Status", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: FlaskConical };
    case "SUPPORT_REQUEST":
      return { label: "Support", color: "bg-amber-50 text-amber-700 border-amber-200", icon: MessageSquare };
    default:
      return { label: "System", color: "bg-slate-50 text-slate-700 border-slate-200", icon: Bell };
  }
}

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD" | "NEW_BOOKING" | "NEW_LAB_ONBOARDING" | "REPORT_UPLOADED">("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminNotificationsList", page, activeTab],
    queryFn: () => notificationApi.getNotifications({
      page,
      limit: 15,
      unreadOnly: activeTab === "UNREAD",
      type: activeTab !== "ALL" && activeTab !== "UNREAD" ? activeTab : undefined,
    }),
  });

  const notifications = data?.notifications || [];
  const totalPages = data?.totalPages || 1;
  const unreadCount = data?.unreadCount || 0;

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminRecentNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsList"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminRecentNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsList"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminRecentNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsList"] });
    },
  });

  const filteredNotifications = notifications.filter(n => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
  });

  const handleRowClick = (n: InAppNotificationItem) => {
    if (!n.isRead) {
      markAsReadMutation.mutate(n._id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="text-xs font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time feed of new laboratory onboardings, customer orders, report uploads, and audit milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="text-xs font-semibold gap-1.5 bg-white border-slate-200 hover:bg-slate-50"
            >
              <CheckCheck className="h-4 w-4 text-primary" />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
          {[
            { id: "ALL", label: "All" },
            { id: "UNREAD", label: "Unread" },
            { id: "NEW_BOOKING", label: "Bookings" },
            { id: "NEW_LAB_ONBOARDING", label: "Lab Onboarding" },
            { id: "REPORT_UPLOADED", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Notifications List */}
      <Card className="border border-slate-200/80 shadow-2xs overflow-hidden bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-sm text-slate-700">No notifications found</p>
              <p className="text-xs text-slate-400 mt-1">There are no notifications matching your current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((n) => {
                const badge = getNotificationBadge(n.type);
                const Icon = badge.icon;

                return (
                  <div
                    key={n._id}
                    onClick={() => handleRowClick(n)}
                    className={cn(
                      "flex items-start gap-4 p-4 sm:p-5 transition-colors cursor-pointer group",
                      n.isRead ? "bg-white hover:bg-slate-50/70" : "bg-primary/[0.03] hover:bg-primary/[0.07]"
                    )}
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0 group-hover:border-primary/40 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", badge.color)}>
                          {badge.label}
                        </span>
                        <h4 className={cn("text-xs sm:text-sm text-slate-900 truncate", !n.isRead && "font-bold")}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-medium">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {n.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotificationMutation.mutate(n._id);
                        }}
                        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 text-xs gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
