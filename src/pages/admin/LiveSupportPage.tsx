import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Headphones, MessageSquare, User, Clock, CheckCheck, Send, Search,
  Volume2, VolumeX, Sparkles, CheckCircle2, FileText, UserCheck, Lock, Star, Phone, Mail
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
    } catch {}
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);

      // Join room via socket
      if (socket && socket.connected) {
        socket.emit("mark_read", { sessionId: selectedSessionId });
      }
    }
  }, [selectedSessionId, socket, fetchMessages]);

  // Socket Real-time Message Listeners
  useEffect(() => {
    if (!socket) return;

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

    const handleUserTyping = (data: { sessionId: string; isTyping: boolean; senderType: string }) => {
      if (data.sessionId === selectedSessionId && data.senderType === "USER") {
        setIsUserTyping(data.isTyping);
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
      {/* ── Top Header Toolbar (Clean White Theme) ─────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Live Support & Diagnostic Desk</span>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] uppercase font-bold">
                Real-Time Desk
              </Badge>
            </h1>
            <p className="text-xs text-slate-500">Connect, assist, and track diagnostic inquiries</p>
          </div>
        </div>

        {/* Presence & Audio Controls */}
        <div className="flex items-center gap-2.5">
          {/* Audio Alerts Button */}
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
              "h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all",
              audioAlertsEnabled
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-50 border-slate-200 text-slate-400"
            )}
          >
            {audioAlertsEnabled ? <Volume2 className="h-3.5 w-3.5 text-teal-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            <span>{audioAlertsEnabled ? "Sound Active" : "Sound Muted"}</span>
          </Button>

          {/* Presence Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xs transition-all",
                  presenceStatus === "ONLINE"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : presenceStatus === "BUSY"
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-slate-50 border-slate-200 text-slate-600"
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
                <span>Offline</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── 3-Column Workspace (Non-scrollable outer, scrollable inside) ────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── Column 1: Queue & Navigation ──────────────────────────────────── */}
        <div className="w-80 sm:w-96 border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0 h-full overflow-hidden">
          {/* Navigation Tabs */}
          <div className="p-3 border-b border-slate-200 bg-white">
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
                className="h-9 pl-9 bg-slate-50 border-slate-200 text-xs rounded-xl text-slate-900 placeholder:text-slate-400 focus-visible:bg-white"
              />
            </div>
          </div>

          {/* Scrollable Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
            {activeTab === "incoming" ? (
              incomingRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <Headphones className="h-8 w-8 mx-auto opacity-30 text-teal-600" />
                  <p>No incoming live requests currently waiting.</p>
                </div>
              ) : (
                incomingRequests.map((req) => {
                  const customerName =
                    req.guestInfo?.name ||
                    (req.user ? `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() : "Guest User");
                  return (
                    <Card
                      key={req.sessionId}
                      className="p-3.5 bg-gradient-to-br from-teal-50/50 via-white to-white border-teal-200/80 rounded-2xl space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                          <span className="text-xs font-bold text-slate-900 tracking-tight">{customerName}</span>
                        </div>
                        <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[9px]">
                          {req.userType === "REGISTERED" ? "Client" : "Guest"}
                        </Badge>
                      </div>

                      {req.guestInfo?.phone && (
                        <p className="text-[11px] text-slate-500 font-medium">📞 {req.guestInfo.phone}</p>
                      )}

                      {req.initialQuery && (
                        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60 italic">
                          "{req.initialQuery}"
                        </p>
                      )}

                      <Button
                        type="button"
                        onClick={() => handleAcceptIncoming(req.sessionId)}
                        className="w-full h-9 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xs border-0 flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Accept Chat</span>
                      </Button>
                    </Card>
                  );
                })
              )
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No active sessions found.</div>
            ) : (
              sessions.map((sess: any) => {
                const customerName =
                  sess.guestInfo?.name ||
                  (sess.userId ? `${sess.userId.firstName || ""} ${sess.userId.lastName || ""}`.trim() : "Guest User");
                const isSelected = selectedSessionId === sess.sessionId;
                return (
                  <button
                    key={sess.sessionId}
                    type="button"
                    onClick={() => setSelectedSessionId(sess.sessionId)}
                    className={cn(
                      "w-full text-left p-3 rounded-2xl border transition-all space-y-1.5 block",
                      isSelected
                        ? "bg-white border-teal-500 shadow-xs ring-1 ring-teal-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{customerName}</span>
                      <span className="text-[10px] text-slate-400">
                        {sess.lastMessageAt ? new Date(sess.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{sess.guestInfo?.phone || sess.userId?.phone || sess.sessionId.slice(-8)}</span>
                      {sess.assignedAgent && (
                        <span className="text-[10px] text-teal-700 font-semibold truncate max-w-[100px] bg-teal-50 px-1.5 py-0.5 rounded-md">
                          👨‍🔬 {sess.assignedAgent.firstName || "Agent"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Column 2: Active Chat Interaction Feed ────────────────────────── */}
        <div className="flex-1 flex flex-col bg-slate-50/40 overflow-hidden h-full">
          {selectedSessionId ? (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs">
                    {selectedSession?.guestInfo?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {selectedSession?.guestInfo?.name ||
                        (selectedSession?.userId
                          ? `${selectedSession.userId.firstName || ""} ${selectedSession.userId.lastName || ""}`.trim()
                          : "Customer Session")}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Session: {selectedSessionId} • {selectedSession?.userType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleResolveChat}
                    className="h-8 rounded-xl bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark as Resolved</span>
                  </Button>
                </div>
              </div>

              {/* Messages Stream (Independently Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {messages.map((msg, index) => {
                  const isAgent = msg.senderType === "AGENT";
                  const isUser = msg.senderType === "USER";
                  const isBot = msg.senderType === "BOT";
                  const isSystem = msg.senderType === "SYSTEM";

                  if (isSystem) {
                    return (
                      <div key={index} className="flex justify-center my-1.5">
                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 shadow-xs px-3 py-1 rounded-full uppercase tracking-wider">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  if (msg.isInternalNote) {
                    return (
                      <div key={index} className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs max-w-lg mx-auto space-y-1 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          <Lock className="h-3 w-3" />
                          <span>Internal Staff Note • {msg.senderName || "Specialist"}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className={cn("flex flex-col gap-1", isAgent ? "items-end" : "items-start")}>
                      <div className={cn("flex items-center gap-1.5 px-1", isAgent ? "flex-row-reverse" : "flex-row")}>
                        <div
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-bold shadow-xs",
                            isAgent
                              ? "bg-teal-600 text-white"
                              : isBot
                              ? "bg-slate-100 text-teal-700 border border-slate-200"
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
                          "p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[80%] shadow-xs whitespace-pre-wrap",
                          isAgent
                            ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-tr-xs"
                            : isBot
                            ? "bg-white text-slate-700 rounded-tl-xs border border-slate-200"
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
                  <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 p-2 rounded-xl border border-teal-200 w-fit">
                    <div className="flex gap-1 items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-bounce" />
                    </div>
                    <span className="text-[11px] font-medium">Client is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area with Canned Responses & Internal Note Switch */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-2 shadow-xs">
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
                          <Sparkles className="h-3 w-3 text-teal-600" />
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
                      <span>{isInternalNote ? "Private Staff Note Active" : "Send as Public Reply"}</span>
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
                        "w-full h-11 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 pr-10",
                        isInternalNote
                          ? "bg-amber-50 border-amber-300 focus-visible:ring-amber-400"
                          : "bg-slate-50 border-slate-200 focus-visible:ring-teal-500 focus-visible:bg-white"
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={cn(
                      "h-11 w-11 rounded-xl text-white border-0 p-0 flex items-center justify-center shrink-0 shadow-sm",
                      isInternalNote
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="h-16 w-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Chat Selected</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Select an active conversation from the queue on the left or accept an incoming live request to begin assisting.
              </p>
            </div>
          )}
        </div>

        {/* ── Column 3: Customer Intelligence & Context Sidebar ─────────────── */}
        {selectedSessionId && selectedSession && (
          <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 shadow-xs">
            {/* Customer Profile Card */}
            <Card className="p-4 bg-slate-50/70 border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                  {selectedSession.guestInfo?.name?.charAt(0) || selectedSession.userId?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedSession.guestInfo?.name ||
                      (selectedSession.userId
                        ? `${selectedSession.userId.firstName || ""} ${selectedSession.userId.lastName || ""}`.trim()
                        : "Guest User")}
                  </h3>
                  <Badge className="bg-white text-slate-700 border-slate-200 text-[10px]">
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
            <Card className="p-4 bg-slate-50/70 border-slate-200 rounded-2xl space-y-3 shadow-xs">
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
              <Card className="p-4 bg-amber-50/60 border-amber-200 rounded-2xl space-y-2 shadow-xs">
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
