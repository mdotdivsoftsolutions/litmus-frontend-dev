import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";

export interface IncomingChatRequest {
  sessionId: string;
  userType: "REGISTERED" | "GUEST";
  user?: any;
  guestInfo?: { name?: string; phone?: string; email?: string };
  queuedAt: string | Date;
  initialQuery?: string;
  transcriptPreview?: Array<{ senderType: string; text: string }>;
}

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  presenceStatus: "ONLINE" | "BUSY" | "OFFLINE";
  setPresenceStatus: (status: "ONLINE" | "BUSY" | "OFFLINE") => void;
  incomingRequests: IncomingChatRequest[];
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  isAudioUnlocked: boolean;
  unlockAudioContext: () => void;
  acceptChat: (sessionId: string) => Promise<{ success: boolean; session?: any; code?: string; message?: string }>;
  dismissRequest: (sessionId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_SERVER_URL =
  (import.meta as any).env?.VITE_API_URL
    ? (import.meta as any).env.VITE_API_URL.replace(/\/api\/v1\/?$/, "")
    : "http://localhost:5000";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [presenceStatus, setPresenceStatusState] = useState<"ONLINE" | "BUSY" | "OFFLINE">(() => {
    const saved = localStorage.getItem("admin_presence_status");
    return (saved as "ONLINE" | "BUSY" | "OFFLINE") || "ONLINE";
  });
  const [incomingRequests, setIncomingRequests] = useState<IncomingChatRequest[]>([]);
  const [audioAlertsEnabled, setAudioAlertsEnabledState] = useState(() => {
    const saved = localStorage.getItem("admin_audio_alerts_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => {
    const saved = localStorage.getItem("admin_support_notifications_enabled");
    return saved !== null ? saved === "true" : true;
  });
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const setAudioAlertsEnabled = (enabled: boolean) => {
    setAudioAlertsEnabledState(enabled);
    localStorage.setItem("admin_audio_alerts_enabled", String(enabled));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem("admin_support_notifications_enabled", String(enabled));
  };

  // Fetch authenticated admin/employee profile
  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const currentUser = userResponse?.data;

  // ── Web Audio Chime Synthesizer ──────────────────────────────────────────
  const playNotificationChime = useCallback(() => {
    if (!audioAlertsEnabled || !notificationsEnabled || presenceStatus === "OFFLINE") return;

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary oscillator: 587.33 Hz (D5) -> 880 Hz (A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);

      // Secondary pleasant harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1174.66, now + 0.1);
      gain2.gain.setValueAtTime(0.001, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } catch (error) {
      console.warn("Failed to play notification chime:", error);
    }
  }, [audioAlertsEnabled, notificationsEnabled, presenceStatus]);

  // ── Unlock Audio Context on User Gesture ──────────────────────────────────
  const unlockAudioContext = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }
      }
      setIsAudioUnlocked(true);
      playNotificationChime();
      toast.success("Sound alerts enabled for incoming chat requests.");
    } catch (error) {
      console.warn("Failed to initialize or resume AudioContext:", error);
    }
  }, [playNotificationChime]);

  // ── Socket Connection & Presence Lifecycle ────────────────────────────────
  useEffect(() => {
    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "EMPLOYEE")) {
      return;
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      const agentPayload = {
        agentId: currentUser._id || currentUser.id,
        name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Admin Staff",
        role: currentUser.role,
        status: presenceStatus,
      };
      newSocket.emit("register_agent", agentPayload);
      newSocket.emit("agent_heartbeat", agentPayload);
    });

    // Fetch Initial Queued Requests via REST fallback
    apiClient
      .get("/chat/sessions?status=QUEUED&limit=10")
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setIncomingRequests(
            res.data.data.map((s: any) => ({
              sessionId: s.sessionId,
              userType: s.userType,
              user: s.userId,
              guestInfo: s.guestInfo,
              queuedAt: s.queuedAt || s.createdAt,
              initialQuery: s.guestInfo?.phone || s.sessionId,
            }))
          );
        }
      })
      .catch(() => {});

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // ── Incoming Live Chat Alert ─────────────────────────────────────────────
    newSocket.on("new_chat_request", (req: IncomingChatRequest) => {
      setIncomingRequests((prev) => {
        if (prev.some((r) => r.sessionId === req.sessionId)) return prev;
        return [req, ...prev];
      });

      // Suppress notification popup and audio if Offline or DND
      if (presenceStatus === "OFFLINE" || !notificationsEnabled) {
        return;
      }

      playNotificationChime();

      const customerName =
        req.guestInfo?.name ||
        (req.user ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() : "Guest User");
      const userTypeLabel = req.userType === "REGISTERED" ? "Client" : "Guest";
      const phone = req.guestInfo?.phone || req.user?.phone;

      toast.custom(
        (id) => (
          <div className="w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 font-sans ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-slate-900 truncate">{customerName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  {userTypeLabel}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Just now</span>
            </div>

            {phone && (
              <p className="text-[11px] text-slate-500 font-medium -mt-1">📞 {phone}</p>
            )}

            {req.initialQuery && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2 italic">
                "{req.initialQuery}"
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(id);
                  setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== req.sessionId));
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={async () => {
                  toast.dismiss(id);
                  if (socketRef.current) {
                    socketRef.current.emit("accept_chat_request", { sessionId: req.sessionId }, (res: any) => {
                      if (res?.success) {
                        setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== req.sessionId));
                        if (window.location.pathname !== "/admin/live-support") {
                          window.location.href = "/admin/live-support";
                        }
                      } else {
                        toast.error(res?.message || "Failed to claim chat session");
                      }
                    });
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Accept & Assist
              </button>
            </div>
          </div>
        ),
        { duration: 12000, position: "top-right" }
      );
    });

    // ── Request Claimed by Another Agent ────────────────────────────────────
    newSocket.on("chat_request_claimed", (data: { sessionId: string; claimedByAgentName?: string }) => {
      setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== data.sessionId));
    });

    // ── Heartbeat Interval ──────────────────────────────────────────────────
    const heartbeatInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("agent_heartbeat", {
          agentId: currentUser._id || currentUser.id,
          name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Admin Staff",
          role: currentUser.role,
          status: presenceStatus,
        });
      }
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      newSocket.disconnect();
    };
  }, [currentUser?._id, presenceStatus, notificationsEnabled, playNotificationChime]);

  const setPresenceStatus = (status: "ONLINE" | "BUSY" | "OFFLINE") => {
    setPresenceStatusState(status);
    localStorage.setItem("admin_presence_status", status);
    if (socket && socket.connected) {
      socket.emit("set_agent_status", { status });
    }
  };

  const acceptChat = useCallback(
    (sessionId: string): Promise<{ success: boolean; session?: any; code?: string; message?: string }> => {
      return new Promise((resolve) => {
        if (!socket || !socket.connected) {
          resolve({ success: false, message: "Socket disconnected" });
          return;
        }

        socket.emit("accept_chat_request", { sessionId }, (res: any) => {
          if (res?.success) {
            setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== sessionId));
            resolve({ success: true, session: res.session });
          } else {
            setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== sessionId));
            resolve({
              success: false,
              code: res?.code || "CLAIM_FAILED",
              message: res?.message || "Chat already claimed by another specialist.",
            });
          }
        });
      });
    },
    [socket]
  );

  const dismissRequest = (sessionId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== sessionId));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        presenceStatus,
        setPresenceStatus,
        incomingRequests,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        notificationsEnabled,
        setNotificationsEnabled,
        isAudioUnlocked,
        unlockAudioContext,
        acceptChat,
        dismissRequest,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useAdminSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useAdminSocket must be used within a SocketProvider");
  }
  return context;
};
