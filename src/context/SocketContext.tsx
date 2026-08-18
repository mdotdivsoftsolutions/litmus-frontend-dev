import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
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
  const [presenceStatus, setPresenceStatusState] = useState<"ONLINE" | "BUSY" | "OFFLINE">("ONLINE");
  const [incomingRequests, setIncomingRequests] = useState<IncomingChatRequest[]>([]);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const socketRef = useRef<Socket | null>(null);

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
    if (!audioAlertsEnabled) return;

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
    } catch {
      // Audio playback suppressed
    }
  }, [audioAlertsEnabled]);

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
    } catch {}
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
      // Send initial heartbeat
      newSocket.emit("agent_heartbeat", { status: presenceStatus });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // ── Incoming Live Chat Alert ─────────────────────────────────────────────
    newSocket.on("new_chat_request", (req: IncomingChatRequest) => {
      setIncomingRequests((prev) => {
        if (prev.some((r) => r.sessionId === req.sessionId)) return prev;
        return [req, ...prev];
      });

      playNotificationChime();

      const customerName =
        req.guestInfo?.name ||
        (req.user ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() : "Guest User");

      toast.info(`🔔 New Live Support Request from ${customerName}`, {
        description: req.initialQuery || "User requested clinical assistance.",
        duration: 8000,
        action: {
          label: "View Request",
          onClick: () => {
            window.location.href = "/admin/live-support";
          },
        },
      });
    });

    // ── Request Claimed by Another Agent ────────────────────────────────────
    newSocket.on("chat_request_claimed", (data: { sessionId: string; claimedByAgentName?: string }) => {
      setIncomingRequests((prev) => prev.filter((r) => r.sessionId !== data.sessionId));
    });

    // ── Heartbeat Interval ──────────────────────────────────────────────────
    const heartbeatInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("agent_heartbeat", { status: presenceStatus });
      }
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      newSocket.disconnect();
    };
  }, [currentUser?._id, presenceStatus, playNotificationChime]);

  const setPresenceStatus = (status: "ONLINE" | "BUSY" | "OFFLINE") => {
    setPresenceStatusState(status);
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
