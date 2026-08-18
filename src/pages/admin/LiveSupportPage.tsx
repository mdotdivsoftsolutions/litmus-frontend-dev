import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  Headphones, MessageSquare, User, Clock, CheckCheck, Send, Search,
  Volume2, VolumeX, Sparkles, CheckCircle2, FileText, UserCheck, Lock, Star, Phone, Mail, Info,
  ChevronLeft, ChevronRight, Bell, BellOff, X, Users, UserPlus, ArrowRightLeft, Shield,
  Activity, Check, AlertCircle, RefreshCw, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useAdminSocket } from "@/context/SocketContext";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Animated Skeleton Components for Instant Feedback ───────────────────────────
function SessionCardSkeleton() {
  return (
    <div className="w-full p-2.5 rounded-xl border border-slate-200/80 bg-white space-y-2 animate-pulse shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200" />
          <Skeleton className="h-3 w-12 rounded-full bg-slate-100" />
        </div>
        <Skeleton className="h-3 w-10 rounded-md bg-slate-200" />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-slate-100/80">
        <Skeleton className="h-3 w-20 rounded-md bg-slate-100" />
        <Skeleton className="h-4 w-20 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

function IncomingCardSkeleton() {
  return (
    <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-2.5 animate-pulse ring-1 ring-rose-500/10 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full bg-rose-200" />
          <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200" />
        </div>
        <Skeleton className="h-4 w-16 rounded-full bg-rose-100" />
      </div>
      <Skeleton className="h-8 w-full rounded-lg bg-slate-100" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-14 rounded-md bg-slate-200" />
        <Skeleton className="h-7 w-24 rounded-lg bg-primary/20" />
      </div>
    </div>
  );
}

function TeamMemberSkeleton() {
  return (
    <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-2 animate-pulse shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-28 rounded-md bg-slate-200" />
            <Skeleton className="h-2.5 w-20 rounded-md bg-slate-100" />
          </div>
        </div>
        <Skeleton className="h-4 w-14 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

interface ChatMessage {
  _id?: string;
  clientMessageId?: string;
  sessionId: string;
  senderType: "USER" | "AGENT" | "BOT" | "SYSTEM";
  senderName?: string;
  text: string;
  isInternalNote?: boolean;
  readAt?: string;
  createdAt: string;
}

export default function LiveSupportPage() {
  const {
    socket,
    presenceStatus,
    setPresenceStatus,
    onlineAgents,
    incomingRequests,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    isAudioUnlocked,
    unlockAudioContext,
    acceptChat,
    transferChat,
  } = useAdminSocket();

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000,
  });
  const currentUser = userResponse?.data;
  const isAdmin = currentUser?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState<"incoming" | "my_chats" | "all_chats" | "staff" | "history">("incoming");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth >= 1280;
    return true;
  });
  const [showInfoSidebar, setShowInfoSidebar] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth >= 1280;
    return false;
  });

  // Transfer / Forward Chat State
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTargetEmployee, setTransferTargetEmployee] = useState<any | null>(null);
  const [transferHandoverNote, setTransferHandoverNote] = useState("");
  const [transferSearchQuery, setTransferSearchQuery] = useState("");
  const [transferStatusFilter, setTransferStatusFilter] = useState<"ALL" | "ONLINE" | "BUSY">("ALL");
  const [isTransferring, setIsTransferring] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserTyping]);

  // Handle external openChatSession events and URL query param
  useEffect(() => {
    const handleOpenSession = (sessionId: string) => {
      setSelectedSessionId(sessionId);
      setActiveTab("my_chats");
      if (socket && socket.connected) {
        socket.emit("join_session", { sessionId });
      }
      if (typeof window !== "undefined" && window.innerWidth < 1280) {
        setShowLeftSidebar(false);
      }
    };

    // 1. Check URL for openSessionId
    const params = new URLSearchParams(window.location.search);
    const openSessionId = params.get("openSessionId");
    if (openSessionId) {
      handleOpenSession(openSessionId);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Listen for CustomEvent from SocketContext toast
    const handleEvent = (e: CustomEvent<string>) => {
      handleOpenSession(e.detail);
    };

    window.addEventListener("openChatSession", handleEvent as EventListener);
    return () => window.removeEventListener("openChatSession", handleEvent as EventListener);
  }, [socket]);

  // Fetch Canned Responses
  useEffect(() => {
    apiClient.get("/chat/canned-responses").then((res) => {
      if (res.data?.data) setCannedResponses(res.data.data);
    }).catch(() => {});
  }, []);

  // Fetch All Registered Employees / Specialists
  const { data: employeesData, isLoading: isLoadingEmployees, refetch: refetchEmployees } = useQuery({
    queryKey: ["allEmployeesDirectory"],
    queryFn: async () => {
      const res = await apiClient.get("/employees");
      return res.data?.data || [];
    },
    staleTime: 30 * 1000,
  });

  const employees: any[] = employeesData || [];

  // Filtered employees for Team directory and for Transfer dialog
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: any) => {
      const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
      const designation = (emp.designation || emp.role || "").toLowerCase();
      const email = (emp.email || "").toLowerCase();
      const phone = (emp.phone || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return fullName.includes(q) || designation.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [employees, searchQuery]);

  // Helper: Get employee live presence
  const getEmployeePresence = useCallback(
    (empId: string) => {
      const live = onlineAgents.find((a) => a.agentId === empId);
      if (live) return live.status as "ONLINE" | "BUSY" | "OFFLINE";
      if (empId === currentUser?._id) return presenceStatus;
      return "OFFLINE";
    },
    [onlineAgents, currentUser?._id, presenceStatus]
  );

  const filteredTransferEmployees = employees.filter((emp: any) => {
    const empId = emp._id || emp.id;
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
    const designation = (emp.designation || emp.role || "").toLowerCase();
    const email = (emp.email || "").toLowerCase();
    const q = transferSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || fullName.includes(q) || designation.includes(q) || email.includes(q);

    const status = getEmployeePresence(empId);
    const matchesStatus =
      transferStatusFilter === "ALL"
        ? true
        : transferStatusFilter === "ONLINE"
        ? status === "ONLINE"
        : status === "BUSY";

    return matchesSearch && matchesStatus;
  });

  // Fetch Infinite Sessions Query (Scalable 20 per page Infinite Scroll)
  const {
    data: infiniteSessionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useInfiniteQuery({
    queryKey: ["chatSessionsInfinite", activeTab, searchQuery, currentUser?._id],
    queryFn: async ({ pageParam = 1 }) => {
      let statusParam: string | undefined = undefined;
      let agentIdParam: string | undefined = undefined;

      if (activeTab === "incoming") {
        statusParam = "QUEUED";
      } else if (activeTab === "my_chats") {
        agentIdParam = currentUser?._id;
      } else if (activeTab === "all_chats") {
        statusParam = "ALL";
      }

      const params: any = { page: pageParam, limit: 20 };
      if (statusParam && statusParam !== "ALL") params.status = statusParam;
      if (agentIdParam) params.agentId = agentIdParam;
      if (searchQuery) params.search = searchQuery;

      const res = await apiClient.get("/chat/sessions", { params });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage?.pagination || {};
      if (page && pages && page < pages) {
        return page + 1;
      }
      return undefined;
    },
    enabled: activeTab !== "staff" && Boolean(currentUser?._id || activeTab === "all_chats" || activeTab === "incoming"),
    refetchInterval: 15000,
  });

  const rawSessions = useMemo(() => {
    return (infiniteSessionsData?.pages.flatMap((p) => p?.data || []) || []) as any[];
  }, [infiniteSessionsData]);

  const totalSessionsCount = infiniteSessionsData?.pages[0]?.pagination?.total ?? rawSessions.length;

  // Merge real-time socket incoming requests with database queued sessions
  const incomingMergedSessions = useMemo(() => {
    if (activeTab !== "incoming") return [];

    const socketItems = incomingRequests.map((req) => ({
      sessionId: req.sessionId,
      userType: req.userType,
      userId: req.user,
      guestInfo: req.guestInfo,
      status: "QUEUED",
      startedAt: req.queuedAt,
      queuedAt: req.queuedAt,
      lastMessageAt: req.queuedAt,
      initialQuery: req.initialQuery,
      isDirectRoute: req.isDirectRoute,
    }));

    const seen = new Set<string>();
    const combined: any[] = [];

    for (const item of socketItems) {
      if (!seen.has(item.sessionId)) {
        seen.add(item.sessionId);
        combined.push(item);
      }
    }

    for (const item of rawSessions) {
      if (!seen.has(item.sessionId)) {
        seen.add(item.sessionId);
        combined.push(item);
      }
    }

    return combined;
  }, [activeTab, incomingRequests, rawSessions]);

  const displayedSessions = activeTab === "incoming" ? incomingMergedSessions : rawSessions;
  const sessions = displayedSessions;

  // Infinite Scroll Sentinel Intersection Observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || activeTab === "staff") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "150px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, activeTab]);

  // Fetch Selected Session Details
  const { data: selectedSessionData, refetch: refetchSelectedSession } = useQuery({
    queryKey: ["chatSessionDetails", selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return null;
      const res = await apiClient.get(`/chat/sessions/${selectedSessionId}`);
      return res.data?.data || null;
    },
    enabled: Boolean(selectedSessionId),
  });

  const selectedSession = selectedSessionData;

  // Handle Forward / Transfer Chat
  const handleExecuteTransfer = async () => {
    if (!selectedSessionId || !transferTargetEmployee) {
      toast.error("Please select a target specialist to forward the chat.");
      return;
    }

    const targetId = transferTargetEmployee._id || transferTargetEmployee.id;
    const targetName = `${transferTargetEmployee.firstName || ""} ${transferTargetEmployee.lastName || ""}`.trim() || "Specialist";

    setIsTransferring(true);
    const result = await transferChat(selectedSessionId, targetId, targetName, transferHandoverNote);
    setIsTransferring(false);

    if (result.success) {
      toast.success(`Chat successfully transferred to ${targetName}!`);
      setTransferModalOpen(false);
      setTransferTargetEmployee(null);
      setTransferHandoverNote("");
      refetchSessions();
      refetchSelectedSession();
    } else {
      toast.error(result.message || "Failed to transfer chat session.");
    }
  };

  // Fetch Messages for Selected Session
  const fetchMessages = useCallback(async (sessId: string) => {
    try {
      const res = await apiClient.get(`/chat/sessions/${sessId}/messages?includeInternalNotes=true`);
      if (res.data?.data) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages for session:", error);
    }
  }, []);

  useEffect(() => {
    setIsUserTyping(false);
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);

      const joinAndSync = () => {
        if (socket && socket.connected) {
          socket.emit("join_session", { sessionId: selectedSessionId });
          socket.emit("mark_read", { sessionId: selectedSessionId });
        }
      };

      joinAndSync();

      if (socket) {
        socket.on("connect", joinAndSync);
        return () => {
          socket.off("connect", joinAndSync);
        };
      }
    }
  }, [selectedSessionId, socket, fetchMessages]);

  // Socket Real-time Message Listeners
  useEffect(() => {
    if (!socket) return;

    let userTypingTimer: NodeJS.Timeout | null = null;

    const handleReceiveMessage = (msg: ChatMessage) => {
      if (msg.sessionId === selectedSessionId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id || (m.clientMessageId && m.clientMessageId === msg.clientMessageId))) {
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    const handleInternalNote = (msg: ChatMessage) => {
      if (msg.sessionId === selectedSessionId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserTyping = (data: { sessionId: string; isTyping: boolean; senderType?: string }) => {
      if (data.sessionId === selectedSessionId && (data.senderType === "USER" || !data.senderType)) {
        setIsUserTyping(Boolean(data.isTyping));
        if (data.isTyping) {
          if (userTypingTimer) clearTimeout(userTypingTimer);
          userTypingTimer = setTimeout(() => {
            setIsUserTyping(false);
          }, 4000);
        }
      }
    };

    const handleSessionUpdated = () => {
      refetchSessions();
      refetchSelectedSession();
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("receive_internal_note", handleInternalNote);
    socket.on("user_typing", handleUserTyping);
    socket.on("chat_session_updated", handleSessionUpdated);

    return () => {
      if (userTypingTimer) clearTimeout(userTypingTimer);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("receive_internal_note", handleInternalNote);
      socket.off("user_typing", handleUserTyping);
      socket.off("chat_session_updated", handleSessionUpdated);
    };
  }, [socket, selectedSessionId, refetchSessions, refetchSelectedSession]);

  // Handle Accept Incoming Chat
  const handleAcceptIncoming = async (sessionId: string) => {
    const result = await acceptChat(sessionId);
    if (result.success) {
      toast.success("Live chat connected successfully!");
      setSelectedSessionId(sessionId);
      if (socket && socket.connected) {
        socket.emit("join_session", { sessionId });
      }
      setActiveTab("my_chats");
      refetchSessions();
      if (typeof window !== "undefined" && window.innerWidth < 1280) {
        setShowLeftSidebar(false);
      }
    } else {
      toast.error(result.message || "Failed to claim chat session.");
      refetchSessions();
    }
  };

  // Handle Send Message / Internal Note
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedSessionId || !messageInput.trim()) return;

    const clientMessageId = `agent_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const text = messageInput.trim();

    socket.emit(
      "send_message",
      {
        sessionId: selectedSessionId,
        clientMessageId,
        text,
        isInternalNote,
      },
      (res: any) => {
        if (!res?.success) {
          toast.error("Failed to send message.");
        }
      }
    );

    setMessageInput("");
    setIsInternalNote(false);
  };

  // Handle Typing Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (!socket || !selectedSessionId) return;

    socket.emit("typing_indicator", { sessionId: selectedSessionId, isTyping: e.target.value.length > 0 });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing_indicator", { sessionId: selectedSessionId, isTyping: false });
    }, 2500);
  };

  // Resolve Chat Mutation
  const handleResolveChat = () => {
    if (!socket || !selectedSessionId) return;
    socket.emit("close_chat", { sessionId: selectedSessionId }, (res: any) => {
      if (res?.success) {
        toast.success("Chat marked as resolved.");
        refetchSessions();
        refetchSelectedSession();
      }
    });
  };

  // Add Internal Note Mutation
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !newNoteInput.trim()) return;

    try {
      await apiClient.post(`/chat/sessions/${selectedSessionId}/notes`, { note: newNoteInput.trim() });
      toast.success("Staff note added.");
      setNewNoteInput("");
      refetchSelectedSession();
    } catch {
      toast.error("Failed to add note.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white text-slate-900 font-sans">
      {/* ── Top Header Toolbar (Clean Dashboard Style) ───────────────────────── */}
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Live Support & Diagnostic Desk
          </h1>
          <p className="text-[11px] text-slate-500">Connect, assist, and track diagnostic inquiries</p>
        </div>

        {/* Presence & Notification Controls */}
        <div className="flex items-center gap-2">
          {/* Real-Time Live Status Badge */}
          <Badge className="hidden sm:inline-flex bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-semibold px-2.5 py-1 items-center gap-1.5 rounded-lg shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time</span>
          </Badge>

          {/* Notifications / DND Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={cn(
              "h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs",
              notificationsEnabled
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
            )}
            title={notificationsEnabled ? "Toasts Enabled" : "Toasts Muted"}
          >
            {notificationsEnabled ? <Bell className="h-3.5 w-3.5 text-slate-600" /> : <BellOff className="h-3.5 w-3.5 text-amber-600" />}
            <span className="hidden sm:inline">{notificationsEnabled ? "Alerts On" : "Muted"}</span>
          </Button>

          {/* Sound Alerts Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isAudioUnlocked) {
                unlockAudioContext();
              } else {
                setAudioAlertsEnabled(!audioAlertsEnabled);
              }
            }}
            className={cn(
              "h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs",
              audioAlertsEnabled
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}
            title={audioAlertsEnabled ? "Sound Active" : "Sound Muted"}
          >
            {audioAlertsEnabled ? <Volume2 className="h-3.5 w-3.5 text-slate-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{audioAlertsEnabled ? "Sound On" : "Muted"}</span>
          </Button>

          {/* Presence Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xs transition-all",
                  presenceStatus === "ONLINE"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : presenceStatus === "BUSY"
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-slate-100 border-slate-300 text-slate-700"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    presenceStatus === "ONLINE" ? "bg-emerald-500 animate-pulse" : presenceStatus === "BUSY" ? "bg-amber-500" : "bg-slate-400"
                  )}
                />
                <span className="capitalize">{presenceStatus}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-800 rounded-xl p-1 shadow-lg">
              <DropdownMenuItem
                onClick={() => setPresenceStatus("ONLINE")}
                className="text-xs font-semibold flex items-center gap-2 rounded-lg cursor-pointer hover:bg-slate-50 text-emerald-700"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Online (Accepting Chats)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPresenceStatus("BUSY")}
                className="text-xs font-semibold flex items-center gap-2 rounded-lg cursor-pointer hover:bg-slate-50 text-amber-700"
              >
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Busy (In Consultation)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPresenceStatus("OFFLINE")}
                className="text-xs font-semibold flex items-center gap-2 rounded-lg cursor-pointer hover:bg-slate-50 text-slate-600"
              >
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Offline (Do Not Disturb)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── 3-Column Workspace (Responsive Layout with Overlay Drawers on < xl) ── */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Backdrop for mobile / tablet (< xl) when Left Queue Sidebar is open */}
        {showLeftSidebar && (
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-30 xl:hidden animate-in fade-in duration-200"
            onClick={() => setShowLeftSidebar(false)}
          />
        )}

        {/* ── Column 1: Queue, Specialists Directory & Navigation ────────── */}
        {showLeftSidebar && (
          <div className="absolute inset-y-0 left-0 z-40 w-72 sm:w-84 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden shadow-2xl xl:shadow-none xl:static xl:z-auto xl:bg-slate-50/60 animate-in fade-in slide-in-from-left-2 duration-150">
            {/* Header & Tabs */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  <span>Support Center</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowLeftSidebar(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
                  title="Collapse Queue Sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("incoming")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 relative outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none border-0",
                    activeTab === "incoming" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                  title="Incoming Support Requests"
                >
                  <span>Incoming</span>
                  {(incomingRequests.length > 0 || (activeTab === "incoming" && totalSessionsCount > 0)) && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                      {incomingRequests.length > 0 ? incomingRequests.length : totalSessionsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("my_chats")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none border-0",
                    activeTab === "my_chats" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                  title="My Attended Chats"
                >
                  <span>Mine</span>
                  {activeTab === "my_chats" && totalSessionsCount > 0 && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center">
                      {totalSessionsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("all_chats")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none border-0",
                    activeTab === "all_chats" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                  title="All Active Staff Chats"
                >
                  <span>All Chats</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("staff")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 relative outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none border-0",
                    activeTab === "staff" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                  title="Team Specialists Directory"
                >
                  <Users className="h-3 w-3" />
                  <span>Team</span>
                </button>
              </div>
            </div>

            {/* Search Bar (Works for all conversation views and Team directory) */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "staff"
                      ? "Search specialists by name, role..."
                      : "Search name, phone, session ID..."
                  }
                  className="h-8 pl-8 pr-8 bg-slate-50 border-slate-200 text-xs rounded-xl text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content (Sessions List OR Staff Team Directory) */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
              {activeTab === "incoming" ? (
                isLoadingSessions && displayedSessions.length === 0 ? (
                  <div className="space-y-2">
                    <IncomingCardSkeleton />
                    <IncomingCardSkeleton />
                    <IncomingCardSkeleton />
                    <IncomingCardSkeleton />
                  </div>
                ) : displayedSessions.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Headphones className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                    <p className="text-xs font-semibold">No Incoming Requests</p>
                    <p className="text-[11px] text-slate-400">Incoming inquiries from website visitors will appear here live.</p>
                  </div>
                ) : (
                  <>
                    {displayedSessions.map((req: any) => (
                      <Card
                        key={req.sessionId}
                        className="p-3 bg-white border-slate-200 hover:border-slate-300 shadow-xs space-y-2 rounded-xl transition-all ring-1 ring-rose-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                            <User className="h-3.5 w-3.5 text-primary" />
                            <span className="truncate">{req.guestInfo?.name || req.userId?.firstName ? `${req.userId?.firstName || ""} ${req.userId?.lastName || ""}`.trim() : (req.user?.firstName ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() : "Guest Client")}</span>
                          </span>
                          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[9px] uppercase font-bold animate-pulse">
                            LIVE QUEUE
                          </Badge>
                        </div>

                        {(req.initialQuery || req.guestInfo?.phone) && (
                          <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                            {req.initialQuery ? `"${req.initialQuery}"` : `Phone: ${req.guestInfo?.phone || req.userId?.phone || "N/A"}`}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{req.queuedAt || req.createdAt ? new Date(req.queuedAt || req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}</span>
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAcceptIncoming(req.sessionId)}
                            className="h-7 px-3 bg-primary hover:bg-primary-deep text-white text-xs font-bold rounded-lg shadow-xs"
                          >
                            Accept & Assist
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {/* Infinite Scroll Sentinel & Loader */}
                    <div ref={loadMoreRef} className="h-2" />
                    {isFetchingNextPage && (
                      <div className="py-2 space-y-2">
                        <IncomingCardSkeleton />
                      </div>
                    )}
                    {!hasNextPage && displayedSessions.length >= 20 && (
                      <p className="text-[10px] text-center text-slate-400 py-2">
                        Loaded all {totalSessionsCount} incoming requests
                      </p>
                    )}
                  </>
                )
              ) : activeTab === "staff" ? (
                isLoadingEmployees ? (
                  <div className="space-y-2">
                    <TeamMemberSkeleton />
                    <TeamMemberSkeleton />
                    <TeamMemberSkeleton />
                    <TeamMemberSkeleton />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
                      <span>Specialists Directory</span>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {onlineAgents.filter((a) => a.status === "ONLINE").length} Online
                      </span>
                    </div>

                    {filteredEmployees.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 space-y-2">
                        <Users className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                        <p className="text-xs font-semibold">No Specialists Found</p>
                        <p className="text-[11px] text-slate-400">Try adjusting your search criteria.</p>
                      </div>
                    ) : (
                      filteredEmployees.map((emp: any) => {
                        const empId = emp._id || emp.id;
                        const status = getEmployeePresence(empId);
                        const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Specialist";
                        const isSelf = empId === currentUser?._id;

                        return (
                          <Card key={empId} className="p-2.5 bg-white border-slate-200 shadow-xs space-y-2 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative shrink-0">
                                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                                    {emp.firstName?.charAt(0) || "S"}
                                  </div>
                                  <div
                                    className={cn(
                                      "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                                      status === "ONLINE"
                                        ? "bg-emerald-500 animate-pulse"
                                        : status === "BUSY"
                                        ? "bg-amber-500"
                                        : "bg-slate-300"
                                    )}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {fullName} {isSelf && <span className="text-[10px] font-medium text-slate-400">(You)</span>}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">{emp.designation || emp.role || "Specialist"}</p>
                                </div>
                              </div>

                              <Badge
                                className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5",
                                  status === "ONLINE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : status === "BUSY"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                )}
                              >
                                {status}
                              </Badge>
                            </div>

                            {selectedSessionId && (
                              <div className="pt-1.5 border-t border-slate-100 flex justify-end">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setTransferTargetEmployee(emp);
                                    setTransferModalOpen(true);
                                  }}
                                  className="h-6 px-2 text-[10px] font-bold bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 rounded-md flex items-center gap-1 shadow-2xs"
                                >
                                  <ArrowRightLeft className="h-3 w-3" />
                                  <span>Forward Active Chat</span>
                                </Button>
                              </div>
                            )}
                          </Card>
                        );
                      })
                    )}
                  </div>
                )
              ) : isLoadingSessions && sessions.length === 0 ? (
                <div className="space-y-2">
                  <SessionCardSkeleton />
                  <SessionCardSkeleton />
                  <SessionCardSkeleton />
                  <SessionCardSkeleton />
                  <SessionCardSkeleton />
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <MessageSquare className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-semibold">No Conversations</p>
                  <p className="text-[11px] text-slate-400">No sessions match this view.</p>
                </div>
              ) : (
                <>
                  {sessions.map((sess: any) => {
                    const isSelected = sess.sessionId === selectedSessionId;
                    const assignedName = sess.assignedAgent
                      ? `${sess.assignedAgent.firstName || ""} ${sess.assignedAgent.lastName || ""}`.trim()
                      : null;

                    return (
                      <button
                        key={sess.sessionId}
                        type="button"
                        onClick={() => {
                          setSelectedSessionId(sess.sessionId);
                          if (typeof window !== "undefined" && window.innerWidth < 1280) {
                            setShowLeftSidebar(false);
                          }
                        }}
                        className={cn(
                          "w-full text-left p-2.5 rounded-xl transition-all border block space-y-1.5",
                          isSelected
                            ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {/* Customer Name & Timestamp */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                              {sess.guestInfo?.name || (sess.userId ? `${sess.userId.firstName || ""} ${sess.userId.lastName || ""}`.trim() : "Guest Client")}
                            </span>
                            {activeTab === "all_chats" && (
                              <Badge
                                className={cn(
                                  "text-[8px] font-extrabold px-1 py-0 uppercase leading-tight shrink-0",
                                  sess.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : sess.status === "QUEUED"
                                    ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                                    : sess.status === "BOT"
                                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                )}
                              >
                                {sess.status}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {sess.lastMessageAt ? new Date(sess.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          </span>
                        </div>

                        {/* Customer Phone & Attended Employee Badge */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                          <span className="truncate max-w-[100px] text-slate-400 font-medium">
                            {sess.guestInfo?.phone || sess.userId?.phone || sess.sessionId.slice(-8)}
                          </span>

                          {assignedName ? (
                            <span
                              className="inline-flex items-center gap-1 font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 truncate max-w-[130px]"
                              title={`Attended by ${assignedName}`}
                            >
                              <UserCheck className="h-3 w-3 text-primary shrink-0" />
                              <span className="truncate">{assignedName}</span>
                            </span>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md font-semibold border border-amber-200">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Infinite Scroll Sentinel & Loader */}
                  <div ref={loadMoreRef} className="h-2" />
                  {isFetchingNextPage && (
                    <div className="py-2 space-y-2">
                      <SessionCardSkeleton />
                      <SessionCardSkeleton />
                    </div>
                  )}
                  {!hasNextPage && sessions.length >= 20 && (
                    <p className="text-[10px] text-center text-slate-400 py-2">
                      Loaded all {totalSessionsCount} conversations
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Column 2: Active Chat Interaction Feed ────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-slate-50/30 overflow-hidden h-full relative">
          {/* Floating Queue Sidebar Reopen Button when collapsed */}
          {!showLeftSidebar && !selectedSessionId && (
            <div className="absolute top-3 left-3 z-30 animate-in fade-in duration-150">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowLeftSidebar(true)}
                className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xs hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                title="Open Support Queue"
              >
                <ChevronRight className="h-4 w-4 text-primary" />
                <span>Support Queue</span>
                {incomingRequests.length > 0 && (
                  <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {incomingRequests.length}
                  </span>
                )}
              </Button>
            </div>
          )}
          {selectedSessionId ? (
            <>
              {/* Active Chat Header */}
              <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Left Sidebar Toggle Button: visible on < xl, or when collapsed on >= xl */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                    className={cn(
                      "h-8 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0",
                      showLeftSidebar ? "xl:hidden" : "flex"
                    )}
                    title="Toggle Queue Panel"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>Queue</span>
                    {incomingRequests.length > 0 && (
                      <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {incomingRequests.length}
                      </span>
                    )}
                  </Button>

                  <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {selectedSession?.guestInfo?.name?.charAt(0) || selectedSession?.userId?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {selectedSession?.guestInfo?.name ||
                        (selectedSession?.userId
                          ? `${selectedSession.userId.firstName || ""} ${selectedSession.userId.lastName || ""}`.trim()
                          : "Customer Session")}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                      <span>Session: {selectedSessionId}</span>
                      {selectedSession?.assignedAgent && (
                        <span className="text-primary font-semibold truncate">
                          • Specialist: {selectedSession.assignedAgent.firstName} {selectedSession.assignedAgent.lastName || ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Forward / Transfer Chat Button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTransferTargetEmployee(null);
                      setTransferModalOpen(true);
                    }}
                    className="h-8 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    title="Forward / Transfer this conversation to another specialist"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">Forward</span>
                  </Button>

                  {/* Mark Resolved Button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleResolveChat}
                    className="h-8 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Resolve</span>
                  </Button>

                  {/* Right Sidebar Collapse/Expand Toggle Button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={cn(
                      "h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors",
                      showInfoSidebar
                        ? "bg-primary/10 border-primary/30 text-primary font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    title={showInfoSidebar ? "Close Customer Details" : "Open Customer Details"}
                  >
                    {showInfoSidebar ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                    <span>Details</span>
                  </Button>
                </div>
              </div>

              {/* Messages Stream (Independently Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200">
                {messages.map((msg, index) => {
                  const isAgent = msg.senderType === "AGENT";
                  const isUser = msg.senderType === "USER";
                  const isBot = msg.senderType === "BOT";
                  const isSystem = msg.senderType === "SYSTEM";

                  if (isSystem) {
                    return (
                      <div key={index} className="flex justify-center my-1">
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 shadow-xs px-3 py-0.5 rounded-full uppercase tracking-wider text-center">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  if (msg.isInternalNote) {
                    return (
                      <div key={index} className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs max-w-lg mx-auto space-y-1 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          <Lock className="h-3 w-3" />
                          <span>Internal Staff Note • {msg.senderName || "Staff"}</span>
                        </div>
                        <p className="break-words">{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className={cn("flex flex-col gap-1", isAgent ? "items-end" : "items-start")}>
                      <div className={cn("flex items-center gap-1.5 px-1", isAgent ? "flex-row-reverse" : "flex-row")}>
                        <div
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-bold shadow-xs shrink-0",
                            isAgent
                              ? "bg-primary text-white"
                              : isBot
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-slate-200 text-slate-700"
                          )}
                        >
                          {isAgent ? "Me" : isBot ? "Bot" : <User className="h-3 w-3" />}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {isAgent ? "You (Specialist)" : isBot ? "Litmus Bot" : selectedSession?.guestInfo?.name || "Client"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[85%] shadow-xs whitespace-pre-wrap break-words",
                          isAgent
                            ? "bg-primary text-white rounded-tr-xs"
                            : isBot
                            ? "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200"
                            : "bg-white text-slate-900 rounded-tl-xs border border-slate-200"
                        )}
                      >
                        {msg.text}
                      </div>

                      <span className="text-[9px] text-slate-400 px-1 font-medium">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                  );
                })}

                {/* User Typing Indicator */}
                {isUserTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200 w-fit shadow-xs">
                    <div className="flex gap-1 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" />
                    </div>
                    <span className="text-[11px] font-medium">Client is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area with Canned Responses & Internal Note Switch */}
              <div className="p-3.5 bg-white border-t border-slate-200 shrink-0 space-y-2 shadow-xs">
                {/* Toolbar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* Canned Responses Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 rounded-lg border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <Sparkles className="h-3 w-3 text-slate-600" />
                          <span>Canned Responses</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-80 bg-white border-slate-200 text-slate-800 p-2 rounded-xl shadow-xl">
                        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Quick Template
                        </div>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {cannedResponses.map((cr) => (
                            <button
                              key={cr.id}
                              type="button"
                              onClick={() => setMessageInput(cr.text)}
                              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors block space-y-0.5"
                            >
                              <p className="text-xs font-bold text-slate-900">{cr.title}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{cr.text}</p>
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Private Staff Note Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(!isInternalNote)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border",
                        isInternalNote
                          ? "bg-amber-100 border-amber-300 text-amber-900"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      <Lock className="h-3 w-3" />
                      <span>{isInternalNote ? "Private Note Mode" : "Public Reply"}</span>
                    </button>
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={messageInput}
                      onChange={handleInputChange}
                      placeholder={isInternalNote ? "Write a private note for staff..." : "Type response to client..."}
                      className={cn(
                        "w-full h-10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 pr-10",
                        isInternalNote
                          ? "bg-amber-50 border-amber-300 focus-visible:ring-amber-400"
                          : "bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white"
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={cn(
                      "h-10 w-10 rounded-xl text-white border-0 p-0 flex items-center justify-center shrink-0 shadow-xs",
                      isInternalNote
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-primary hover:bg-primary-deep text-white"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Chat Selected</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Select a conversation from the queue or accept an incoming live request to begin assisting.
              </p>
              {!showLeftSidebar && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowLeftSidebar(true)}
                  className="mt-2 text-xs bg-primary hover:bg-primary-deep text-white rounded-xl shadow-xs gap-1.5 font-bold"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  <span>Show Support Queue</span>
                  {incomingRequests.length > 0 && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {incomingRequests.length}
                    </span>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Backdrop for mobile / tablet (< xl) when Customer Details Sidebar is open */}
        {selectedSessionId && selectedSession && showInfoSidebar && (
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-30 xl:hidden animate-in fade-in duration-200"
            onClick={() => setShowInfoSidebar(false)}
          />
        )}

        {/* ── Column 3: Customer Intelligence & Context Sidebar (Collapsible / Overlay on < xl) ── */}
        {selectedSessionId && selectedSession && showInfoSidebar && (
          <div className="absolute inset-y-0 right-0 z-40 w-72 sm:w-80 lg:w-84 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 shadow-2xl xl:shadow-none xl:static xl:z-auto animate-in fade-in slide-in-from-right-2 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Customer Details</span>
              <button
                type="button"
                onClick={() => setShowInfoSidebar(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Collapse Details Sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Specialist Assigned Information Card */}
            <Card className="p-3.5 bg-primary/5 border-primary/20 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Attending Specialist</span>
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTransferTargetEmployee(null);
                    setTransferModalOpen(true);
                  }}
                  className="h-6 px-1.5 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-md flex items-center gap-1"
                >
                  <ArrowRightLeft className="h-3 w-3" />
                  <span>Transfer</span>
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs shrink-0">
                  {selectedSession.assignedAgent?.firstName?.charAt(0) || "S"}
                </div>
                <div className="min-w-0 text-xs">
                  <p className="font-bold text-slate-900 truncate">
                    {selectedSession.assignedAgent
                      ? `${selectedSession.assignedAgent.firstName || ""} ${selectedSession.assignedAgent.lastName || ""}`.trim()
                      : "Unassigned"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {selectedSession.assignedAgent?.designation || selectedSession.assignedAgent?.department || selectedSession.assignedAgent?.email || "Diagnostic Team"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Customer Profile Card */}
            <Card className="p-3.5 bg-slate-50 border-slate-200 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedSession.guestInfo?.name?.charAt(0) || selectedSession.userId?.firstName?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {selectedSession.guestInfo?.name ||
                      (selectedSession.userId
                        ? `${selectedSession.userId.firstName || ""} ${selectedSession.userId.lastName || ""}`.trim()
                        : "Guest User")}
                  </h3>
                  <Badge className="bg-white text-slate-700 border-slate-200 text-[9px]">
                    {selectedSession.userType}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{selectedSession.guestInfo?.phone || selectedSession.userId?.phone || "Not provided"}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span>{selectedSession.guestInfo?.email || selectedSession.userId?.email || "Not provided"}</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Internal Staff Notes */}
            <Card className="p-3.5 bg-slate-50 border-slate-200 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  <span>Internal Staff Notes</span>
                </h4>
              </div>

              {selectedSession.internalNotes && selectedSession.internalNotes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedSession.internalNotes.map((note: any, nIdx: number) => (
                    <div key={nIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>{note.authorName || "Staff"}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No internal notes for this session yet.</p>
              )}

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <Input
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Add private note..."
                  className="h-8 text-xs bg-white border-slate-200 rounded-lg text-slate-900"
                />
                <Button type="submit" size="sm" className="h-8 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs">
                  Save
                </Button>
              </form>
            </Card>

            {/* Satisfaction Rating (if available) */}
            {selectedSession.rating && (
              <Card className="p-3.5 bg-amber-50/60 border-amber-200 rounded-xl space-y-2 shadow-xs">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>Customer Rating</span>
                </h4>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= (selectedSession.rating.score || 0) ? "fill-amber-500 text-amber-500" : "text-slate-300"
                      )}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-900 ml-2">{selectedSession.rating.score}/5</span>
                </div>
                {selectedSession.rating.feedback && (
                  <p className="text-xs text-slate-700 italic bg-white p-2 rounded-xl border border-amber-200">
                    "{selectedSession.rating.feedback}"
                  </p>
                )}
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ── Transfer / Forward Chat Right-Side Drawer (Sheet) ─────────────── */}
      <Sheet open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg bg-white border-l border-slate-200 p-0 flex flex-col h-full shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/70 space-y-1.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-slate-900">
                  Forward & Transfer Chat
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Reassign active consultation to another specialist in real time.
                </SheetDescription>
              </div>
            </div>

            {/* Current Active Client Context Pill */}
            {selectedSession && (
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-slate-900 truncate">
                    {selectedSession.guestInfo?.name || selectedSession.userId?.firstName || "Customer"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    ({selectedSession.sessionId.slice(-8)})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                  Active Session
                </span>
              </div>
            )}
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Search & Filter Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Select Destination Specialist
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {filteredTransferEmployees.length} available
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={transferSearchQuery}
                  onChange={(e) => setTransferSearchQuery(e.target.value)}
                  placeholder="Search specialist by name, role, email..."
                  className="h-9 pl-9 text-xs bg-slate-50 border-slate-200 rounded-xl placeholder:text-slate-400 focus-visible:ring-primary focus-visible:bg-white"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {(["ALL", "ONLINE", "BUSY"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTransferStatusFilter(filter)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border outline-none focus:outline-none select-none",
                      transferStatusFilter === filter
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {filter === "ALL" && "All Specialists"}
                    {filter === "ONLINE" && `🟢 Online (${onlineAgents.filter((a) => a.status === "ONLINE").length})`}
                    {filter === "BUSY" && `🟡 In Consultation (${onlineAgents.filter((a) => a.status === "BUSY").length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialists Directory List */}
            <div className="space-y-2">
              {filteredTransferEmployees.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Users className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-semibold">No Specialists Match Filters</p>
                  <p className="text-[11px] text-slate-400">Try adjusting your search query or status filter.</p>
                </div>
              ) : (
                filteredTransferEmployees.map((emp: any) => {
                  const empId = emp._id || emp.id;
                  const status = getEmployeePresence(empId);
                  const isSelected = (transferTargetEmployee?._id || transferTargetEmployee?.id) === empId;
                  const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Specialist";
                  const isSelf = empId === currentUser?._id;

                  return (
                    <div
                      key={empId}
                      onClick={() => setTransferTargetEmployee(emp)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none",
                        isSelected
                          ? "bg-primary/5 border-primary ring-2 ring-primary/30 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                            {emp.firstName?.charAt(0) || "S"}
                          </div>
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                              status === "ONLINE"
                                ? "bg-emerald-500 animate-pulse"
                                : status === "BUSY"
                                ? "bg-amber-500"
                                : "bg-slate-300"
                            )}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {fullName} {isSelf && <span className="text-[10px] font-normal text-slate-400">(You)</span>}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {emp.designation || emp.role || "Clinical Specialist"}
                          </p>
                          {emp.email && (
                            <p className="text-[9px] text-slate-400 truncate">
                              {emp.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5",
                            status === "ONLINE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : status === "BUSY"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          )}
                        >
                          {status}
                        </Badge>
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : "border-slate-300 group-hover:border-slate-400"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Handover Note */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Internal Handover Note (Optional)
              </label>
              <textarea
                value={transferHandoverNote}
                onChange={(e) => setTransferHandoverNote(e.target.value)}
                rows={3}
                placeholder="E.g., Patient is inquiring about turnaround time for blood culture test. Already verified prescription."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white resize-none"
              />
              <p className="text-[10px] text-slate-400">
                This note will appear as a private staff note visible only to clinical team members.
              </p>
            </div>
          </div>

          {/* Sticky Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTransferModalOpen(false);
                setTransferTargetEmployee(null);
              }}
              className="h-9 px-4 rounded-xl border-slate-200 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!transferTargetEmployee || isTransferring}
              onClick={handleExecuteTransfer}
              className="h-9 px-5 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              {isTransferring ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Transferring...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span>Confirm Transfer</span>
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
