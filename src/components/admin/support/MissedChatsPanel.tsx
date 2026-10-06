import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import {
  missedChatApi,
  MissedChat,
  MissedChatStatusFilter,
  MISSED_CHAT_STATUS_LABELS,
} from "@/lib/api/missedChat";
import { Clock, Mail, Phone, PhoneMissed } from "lucide-react";
import { cn } from "@/lib/utils";
import { MissedChatDetailSheet } from "./MissedChatDetailSheet";
import { useMissedChatCounts } from "./useMissedChatCounts";
import {
  MISSED_CHATS_QUERY_KEY,
  MISSED_CHAT_COUNTS_QUERY_KEY,
  REASON_LABELS,
  STATUS_BADGE_CLASSES,
  formatDateTime,
  missedChatContact,
} from "./missedChatUtils";

interface MissedChatsPanelProps {
  socket: Socket | null;
  searchQuery: string;
}

const PAGE_SIZE = 20;
const STATUS_FILTERS: MissedChatStatusFilter[] = ["PENDING", "CONTACTED", "RESOLVED", "UNREACHABLE", "ALL"];

/**
 * Support desk list of live-chat requests nobody attended, so the team can
 * call or email the customer back and track the follow-up.
 */
export function MissedChatsPanel({ socket, searchQuery }: MissedChatsPanelProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<MissedChatStatusFilter>("PENDING");
  const [selected, setSelected] = useState<MissedChat | null>(null);
  const search = useDebounce(searchQuery.trim(), 350);
  const { data: counts } = useMissedChatCounts();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: [MISSED_CHATS_QUERY_KEY, statusFilter, search],
    queryFn: ({ pageParam }) =>
      missedChatApi.list({ status: statusFilter, search: search || undefined, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage?.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined),
    staleTime: 15 * 1000,
  });

  const records = useMemo(() => data?.pages.flatMap((p) => p?.data || []) ?? [], [data]);

  // New missed requests arrive over the support socket; refresh the list and counts.
  useEffect(() => {
    if (!socket) return;
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: [MISSED_CHATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MISSED_CHAT_COUNTS_QUERY_KEY] });
    };
    socket.on("missed_chat_created", refresh);
    return () => {
      socket.off("missed_chat_created", refresh);
    };
  }, [socket, queryClient]);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && fetchNextPage(),
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="flex flex-wrap gap-1 pb-1.5">
        {STATUS_FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors",
              statusFilter === key
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {key === "ALL" ? "All" : MISSED_CHAT_STATUS_LABELS[key]}
            <span className="ml-1 opacity-70">{counts?.[key] ?? 0}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="p-6 text-center text-xs text-rose-600">Failed to load missed requests.</p>
      ) : records.length === 0 ? (
        <div className="p-6 text-center text-slate-400 space-y-2">
          <PhoneMissed className="h-7 w-7 mx-auto text-slate-300 stroke-1" />
          <p className="text-xs font-semibold">No missed requests</p>
          <p className="text-[11px]">Live-chat requests that no specialist answered will appear here for call-back.</p>
        </div>
      ) : (
        <>
          {records.map((record) => {
            const contact = missedChatContact(record);
            return (
              <Card
                key={record._id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(record)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(record)}
                className="p-3 bg-white border-slate-200 hover:border-slate-300 shadow-xs space-y-1.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{contact.name}</span>
                  <Badge variant="outline" className={cn("text-[9px] font-bold shrink-0", STATUS_BADGE_CLASSES[record.followUpStatus])}>
                    {MISSED_CHAT_STATUS_LABELS[record.followUpStatus]}
                  </Badge>
                </div>
                {(contact.phone || contact.email) && (
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                    {contact.phone ? <Phone className="h-3 w-3 shrink-0" /> : <Mail className="h-3 w-3 shrink-0" />}
                    <span className="truncate">{contact.phone || contact.email}</span>
                  </p>
                )}
                {record.initialQuery && (
                  <p className="text-[11px] text-slate-500 italic line-clamp-1">"{record.initialQuery}"</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDateTime(record.missedAt)}
                  </span>
                  <span>{REASON_LABELS[record.reason]}</span>
                </div>
              </Card>
            );
          })}
          <div ref={sentinelRef} className="h-2" />
          {isFetchingNextPage && <Skeleton className="h-20 w-full rounded-xl" />}
        </>
      )}

      <MissedChatDetailSheet
        record={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onUpdated={setSelected}
      />
    </>
  );
}
