import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Headphones, MessageSquare, User, Clock, CheckCheck, Send, Search,
  Volume2, VolumeX, Sparkles, CheckCircle2, FileText, UserCheck, Lock, Star, Phone, Mail, Info,
  ChevronLeft, ChevronRight, Bell, BellOff, X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdminSocket } from "@/context/SocketContext";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    incomingRequests,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    isAudioUnlocked,
    unlockAudioContext,
    acceptChat,
  } = useAdminSocket();

  const { data: userResponse } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000,
  });
  const currentUser = userResponse?.data;
  const isAdmin = currentUser?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState<"incoming" | "my_chats" | "all_chats" | "history">("incoming");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showInfoSidebar, setShowInfoSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserTyping]);

  // Fetch Canned Responses
  useEffect(() => {
    apiClient.get("/chat/canned-responses").then((res) => {
      if (res.data?.data) setCannedResponses(res.data.data);
    }).catch(() => {});
  }, []);

  // Fetch Sessions Query
  const { data: sessionsData, refetch: refetchSessions } = useQuery({
    queryKey: ["chatSessions", activeTab, searchQuery],
    queryFn: async () => {
      let statusParam = "ACTIVE";
      let agentIdParam = undefined;

      if (activeTab === "my_chats") {
        statusParam = "ACTIVE";
        agentIdParam = currentUser?._id;
      } else if (activeTab === "all_chats") {
        statusParam = "ACTIVE";
      } else if (activeTab === "history") {
        statusParam = "RESOLVED";
      }

      const params: any = { page: 1, limit: 50 };
      if (statusParam) params.status = statusParam;
      if (agentIdParam) params.agentId = agentIdParam;
      if (searchQuery) params.search = searchQuery;

      const res = await apiClient.get("/chat/sessions", { params });
      return res.data?.data || [];
    },
    refetchInterval: 15000,
  });

  const sessions = sessionsData || [];

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
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
            <Headphones className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Live Support & Diagnostic Desk</span>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-semibold">
                Real-Time
              </Badge>
            </h1>
            <p className="text-[11px] text-slate-500">Connect, assist, and track diagnostic inquiries</p>
          </div>
        </div>

        {/* Presence & Notification Controls */}
        <div className="flex items-center gap-2">
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

      {/* ── 3-Column Workspace (Collapsible Sidebars) ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── Column 1: Queue & Navigation (Collapsible) ────────────────────── */}
        {showLeftSidebar && (
          <div className="w-64 sm:w-72 md:w-80 border-r border-slate-200 bg-slate-50/60 flex flex-col shrink-0 h-full overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150">
            {/* Header & Tabs */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Support Queue</span>
                <button
                  type="button"
                  onClick={() => setShowLeftSidebar(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Collapse Queue Sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("incoming")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 relative",
                    activeTab === "incoming" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span>Incoming</span>
                  {incomingRequests.length > 0 && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {incomingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("my_chats")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1",
                    activeTab === "my_chats" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span>My Active</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab(isAdmin ? "all_chats" : "history")}
                  className={cn(
                    "py-1.5 rounded-lg transition-all flex items-center justify-center gap-1",
                    activeTab === "all_chats" || activeTab === "history"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span>{isAdmin ? "All Staff" : "History"}</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, session..."
                  className="h-8 pl-8 bg-slate-50 border-slate-200 text-xs rounded-xl text-slate-900 placeholder:text-slate-400 focus-visible:bg-white"
                />
              </div>
            </div>

            {/* Scrollable Sessions List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
              {activeTab === "incoming" ? (
                incomingRequests.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Headphones className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                    <p className="text-xs font-semibold">No Incoming Requests</p>
                    <p className="text-[11px] text-slate-400">Incoming requests will appear here in real time.</p>
                  </div>
                ) : (
                  incomingRequests.map((req) => (
                    <Card
                      key={req.sessionId}
                      className="p-3 bg-white border-slate-200 hover:border-slate-300 shadow-xs space-y-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                          <User className="h-3.5 w-3.5 text-slate-600" />
                          <span className="truncate">{req.guestInfo?.name || req.user?.firstName || "Guest Client"}</span>
                        </span>
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[9px] uppercase font-bold animate-pulse">
                          LIVE
                        </Badge>
                      </div>

                      {req.initialQuery && (
                        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                          "{req.initialQuery}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(req.queuedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleAcceptIncoming(req.sessionId)}
                          className="h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          Accept
                        </Button>
                      </div>
                    </Card>
                  ))
                )
              ) : sessions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 space-y-2">
                  <MessageSquare className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-semibold">No Conversations</p>
                  <p className="text-[11px] text-slate-400">No sessions in this view.</p>
                </div>
              ) : (
                sessions.map((sess: any) => {
                  const isSelected = sess.sessionId === selectedSessionId;
                  return (
                    <button
                      key={sess.sessionId}
                      type="button"
                      onClick={() => setSelectedSessionId(sess.sessionId)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-xl transition-all border block space-y-1",
                        isSelected
                          ? "bg-white border-slate-900 shadow-xs ring-1 ring-slate-900"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                          {sess.guestInfo?.name || (sess.userId ? `${sess.userId.firstName || ""} ${sess.userId.lastName || ""}`.trim() : "Guest Client")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {sess.lastMessageAt ? new Date(sess.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[110px]">{sess.guestInfo?.phone || sess.userId?.phone || sess.sessionId.slice(-8)}</span>
                        {sess.assignedAgent && (
                          <span className="text-[10px] text-slate-700 font-semibold truncate max-w-[85px] bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {sess.assignedAgent.firstName || "Staff"}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── Column 2: Active Chat Interaction Feed ────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-slate-50/30 overflow-hidden h-full">
          {selectedSessionId ? (
            <>
              {/* Active Chat Header */}
              <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Left Sidebar Expand Arrow Button (shown when collapsed) */}
                  {!showLeftSidebar && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLeftSidebar(true)}
                      className="h-8 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs shrink-0"
                      title="Expand Queue Panel"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="hidden sm:inline">Queue</span>
                      {incomingRequests.length > 0 && (
                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {incomingRequests.length}
                        </span>
                      )}
                    </Button>
                  )}

                  <div className="h-8 w-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                    {selectedSession?.guestInfo?.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {selectedSession?.guestInfo?.name ||
                        (selectedSession?.userId
                          ? `${selectedSession.userId.firstName || ""} ${selectedSession.userId.lastName || ""}`.trim()
                          : "Customer Session")}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      Session: {selectedSessionId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleResolveChat}
                    className="h-8 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark as Resolved</span>
                  </Button>

                  {/* Right Sidebar Collapse/Expand Arrow Button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={cn(
                      "h-8 px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors",
                      showInfoSidebar
                        ? "bg-slate-100 border-slate-300 text-slate-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    title={showInfoSidebar ? "Collapse Customer Details" : "Expand Customer Details"}
                  >
                    {showInfoSidebar ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                    <span className="hidden md:inline">Details</span>
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
                              ? "bg-slate-900 text-white"
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
                          "p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[82%] shadow-xs whitespace-pre-wrap break-words",
                          isAgent
                            ? "bg-slate-900 text-white rounded-tr-xs"
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
                          : "bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:bg-white"
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
                        : "bg-slate-900 hover:bg-slate-800 text-white"
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
            </div>
          )}
        </div>

        {/* ── Column 3: Customer Intelligence & Context Sidebar (Collapsible) ── */}
        {selectedSessionId && selectedSession && showInfoSidebar && (
          <div className="w-72 lg:w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 shadow-xs z-10 animate-in fade-in slide-in-from-right-2 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Customer Details</span>
              <button
                type="button"
                onClick={() => setShowInfoSidebar(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Collapse Details Sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Customer Profile Card */}
            <Card className="p-3.5 bg-slate-50 border-slate-200 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs">
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
    </div>
  );
}
