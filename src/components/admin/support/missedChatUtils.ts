import type { MissedChat, MissedChatStatus } from "@/lib/api/missedChat";

export const MISSED_CHATS_QUERY_KEY = "missedChats";
export const MISSED_CHAT_COUNTS_QUERY_KEY = "missedChatCounts";

export const STATUS_BADGE_CLASSES: Record<MissedChatStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONTACTED: "bg-sky-50 text-sky-700 border-sky-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UNREACHABLE: "bg-slate-100 text-slate-600 border-slate-200",
};

export const REASON_LABELS: Record<MissedChat["reason"], string> = {
  QUEUE_TIMEOUT: "No specialist answered",
  USER_CANCELLED: "Customer left the queue",
};

const populatedUser = (record: MissedChat) => (record.userId && typeof record.userId === "object" ? record.userId : null);

export function missedChatContact(record: MissedChat) {
  const user = populatedUser(record);
  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
  return {
    name: record.contact?.name || userName || `Guest (${record.sessionId.slice(-6)})`,
    phone: record.contact?.phone || user?.phone || "",
    email: record.contact?.email || user?.email || "",
    isRegistered: Boolean(user),
  };
}

export function formatWait(seconds: number) {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins ? `${mins}m ${secs}s` : `${secs}s`;
}

export function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
