import { useQuery } from "@tanstack/react-query";
import { missedChatApi } from "@/lib/api/missedChat";
import { MISSED_CHAT_COUNTS_QUERY_KEY } from "./missedChatUtils";

/** Missed live-support request counts keyed by follow-up status (ALL, PENDING, ...). */
export function useMissedChatCounts() {
  return useQuery({
    queryKey: [MISSED_CHAT_COUNTS_QUERY_KEY],
    queryFn: async () => (await missedChatApi.counts()).data,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
