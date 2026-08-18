import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Headphones, User, Phone, Clock, Check, X, MessageSquare } from "lucide-react";
import { useAdminSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LiveSupportToaster() {
  const { incomingRequests, acceptChat, dismissRequest, notificationsEnabled } = useAdminSocket();
  const navigate = useNavigate();
  const location = useLocation();

  // If notifications are disabled in settings or there are no incoming requests, don't show
  if (!notificationsEnabled || incomingRequests.length === 0) {
    return null;
  }

  // We can show up to 3 stacked toasts if multiple visitors arrive simultaneously
  const visibleRequests = incomingRequests.slice(0, 3);

  const handleAccept = async (sessionId: string) => {
    const result = await acceptChat(sessionId);
    if (result.success) {
      if (!location.pathname.includes("/admin/live-support")) {
        navigate("/admin/live-support");
      }
    }
  };

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-[390px] w-[calc(100vw-2.5rem)] pointer-events-auto"
      aria-live="polite"
      aria-label="Incoming Live Support Notifications"
    >
      {visibleRequests.map((req) => {
        const clientName = req.guestInfo?.name || req.user?.firstName || "Guest Client";
        const phone = req.guestInfo?.phone || req.user?.phone;

        return (
          <div
            key={req.sessionId}
            className="bg-white/95 backdrop-blur-md border border-primary/25 rounded-2xl p-4 shadow-2xl ring-1 ring-slate-900/5 animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all hover:shadow-primary/10"
          >
            {/* Header / Live Indicator */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  <span>Incoming Live Request</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] uppercase font-extrabold px-1.5 py-0.5">
                  Live
                </Badge>
                <button
                  type="button"
                  onClick={() => dismissRequest(req.sessionId)}
                  className="h-6 w-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors outline-none focus:outline-none"
                  title="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                {clientName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {clientName}
                </p>
                {phone && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{phone}</span>
                  </p>
                )}
                {req.initialQuery && (
                  <p className="mt-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-100 p-2 rounded-xl italic line-clamp-2">
                    "{req.initialQuery}"
                  </p>
                )}
              </div>
            </div>

            {/* Timestamp and Action Buttons */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3" />
                <span>{new Date(req.queuedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => dismissRequest(req.sessionId)}
                  className="h-8 px-3 rounded-xl border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-bold transition-colors"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Decline
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAccept(req.sessionId)}
                  className="h-8 px-3.5 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-bold shadow-xs gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
