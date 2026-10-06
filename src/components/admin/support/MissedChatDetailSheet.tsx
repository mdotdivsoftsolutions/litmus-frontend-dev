import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { missedChatApi, MissedChat, MissedChatStatus, MISSED_CHAT_STATUS_LABELS } from "@/lib/api/missedChat";
import { Loader2, Mail, MessageSquare, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  MISSED_CHATS_QUERY_KEY,
  MISSED_CHAT_COUNTS_QUERY_KEY,
  REASON_LABELS,
  STATUS_BADGE_CLASSES,
  formatDateTime,
  formatWait,
  missedChatContact,
} from "./missedChatUtils";

interface MissedChatDetailSheetProps {
  record: MissedChat | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (record: MissedChat) => void;
}

const NOTE_MAX = 2000;

/** Contact details and follow-up log for one missed live-support request. */
export function MissedChatDetailSheet({ record, onOpenChange, onUpdated }: MissedChatDetailSheetProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MissedChatStatus>("PENDING");
  const [note, setNote] = useState("");

  // Re-sync the form whenever a different (or freshly saved) record is shown.
  useEffect(() => {
    if (record) {
      setStatus(record.followUpStatus);
      setNote("");
    }
  }, [record]);

  const mutation = useMutation({
    mutationFn: () =>
      missedChatApi.updateFollowUp(record!._id, {
        status: status !== record!.followUpStatus ? status : undefined,
        note: note.trim() || undefined,
      }),
    onSuccess: (res) => {
      onUpdated(res.data);
      setNote("");
      queryClient.invalidateQueries({ queryKey: [MISSED_CHATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MISSED_CHAT_COUNTS_QUERY_KEY] });
      toast.success("Follow-up updated");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update follow-up"),
  });

  if (!record) return null;
  const contact = missedChatContact(record);
  const hasChanges = status !== record.followUpStatus || note.trim().length > 0;
  const notes = [...(record.followUpNotes || [])].reverse();

  return (
    <Sheet open={!!record} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> {contact.name}
          </SheetTitle>
          <SheetDescription>
            Missed {formatDateTime(record.missedAt)} · {REASON_LABELS[record.reason]}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-5 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-bold", STATUS_BADGE_CLASSES[record.followUpStatus])}>
              {MISSED_CHAT_STATUS_LABELS[record.followUpStatus]}
            </Badge>
            <Badge variant="outline" className="text-[10px]">{contact.isRegistered ? "Registered user" : "Guest"}</Badge>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 p-3">
            {contact.phone ? (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                <Phone className="h-4 w-4" /> {contact.phone}
              </a>
            ) : (
              <p className="flex items-center gap-2 text-slate-400"><Phone className="h-4 w-4" /> No phone shared</p>
            )}
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-primary hover:underline break-all">
                <Mail className="h-4 w-4 shrink-0" /> {contact.email}
              </a>
            ) : (
              <p className="flex items-center gap-2 text-slate-400"><Mail className="h-4 w-4" /> No email shared</p>
            )}
          </div>

          {record.initialQuery && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> Customer's question
              </p>
              <p className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-slate-700 italic whitespace-pre-wrap">
                "{record.initialQuery}"
              </p>
            </div>
          )}

          <dl className="grid grid-cols-3 gap-2 text-xs">
            <div><dt className="text-slate-500">Queued</dt><dd className="font-medium">{formatDateTime(record.queuedAt)}</dd></div>
            <div><dt className="text-slate-500">Waited</dt><dd className="font-medium">{formatWait(record.waitDurationSec)}</dd></div>
            <div><dt className="text-slate-500">Attempts</dt><dd className="font-medium">{record.attempts}</dd></div>
          </dl>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-700">Update follow-up</p>
            <Select value={status} onValueChange={(v) => setStatus(v as MissedChatStatus)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(MISSED_CHAT_STATUS_LABELS) as MissedChatStatus[]).map((key) => (
                  <SelectItem key={key} value={key}>{MISSED_CHAT_STATUS_LABELS[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={note}
              maxLength={NOTE_MAX}
              rows={3}
              placeholder="Add a note, e.g. called customer, booked a sample pickup…"
              onChange={(e) => setNote(e.target.value)}
            />
            <Button className="w-full gap-2" disabled={!hasChanges || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save follow-up
            </Button>
          </div>

          {notes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Follow-up history</p>
              {notes.map((n, i) => (
                <div key={n._id || i} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{n.note}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {n.authorName || "Staff"} · {formatDateTime(n.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
