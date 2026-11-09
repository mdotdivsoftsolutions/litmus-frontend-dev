import { format } from "date-fns";
import { Calendar as CalendarIcon, Mail, MessageSquare, Phone, Trash2, User, XCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONSULTATION_STATUSES, ConsultationStatusBadge } from "./consultationStatus";

interface ConsultationDetailSheetProps {
  consultation: any | null;
  onClose: () => void;
  /** Employees without MANAGE_CONSULTATIONS see the lead read-only. */
  canManage: boolean;
  /** Only the super-admin login may delete. */
  canDelete: boolean;
  isUpdating: boolean;
  onStatusChange: (status: string) => void;
  onNotConverted: () => void;
  onDelete: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center">
      <span className="text-muted-foreground font-medium">{label}</span>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

export function ConsultationDetailSheet({
  consultation: c,
  onClose,
  canManage,
  canDelete,
  isUpdating,
  onStatusChange,
  onNotConverted,
  onDelete,
}: ConsultationDetailSheetProps) {
  return (
    <Sheet open={!!c} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-6 flex flex-col justify-between bg-white">
        {c && (
          <div className="flex flex-col h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <User className="h-4 w-4 text-primary" />
                <span>Consultation Details</span>
              </div>
              <div className="flex items-start justify-between gap-2 pt-1 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-foreground">{c.name}</h2>
                  <p className="text-xs text-muted-foreground">{c.business || "General Consultation"}</p>
                </div>
                <ConsultationStatusBadge status={c.status} />
              </div>
            </div>

            <div className="space-y-4 text-xs flex-1">
              <Row label="Service">
                <span className="font-semibold text-foreground">{c.serviceName}</span>
              </Row>
              <Row label="Requested For">
                <span className="text-slate-800 flex items-center gap-1.5 font-medium">
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {c.date} at {c.time}
                </span>
              </Row>
              <Row label="Email">
                <a href={`mailto:${c.email}`} className="text-primary flex items-center gap-1.5 hover:underline truncate">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{c.email}</span>
                </a>
              </Row>
              <Row label="Phone">
                <a href={`tel:${c.phone}`} className="text-slate-800 flex items-center gap-1.5 hover:underline">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{c.phone}</span>
                </a>
              </Row>
              <Row label="Source">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {c.source || "General"}
                </span>
              </Row>
              <Row label="Submitted On">
                <span className="text-slate-600">
                  {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy · h:mm a") : "N/A"}
                </span>
              </Row>

              <div className="pt-2">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    Customer Message / Notes
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{c.message || "No notes provided"}</p>
                </div>
              </div>

              {c.status === "Not Converted" && c.nonConversionReason && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
                  <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Reason for non-conversion
                  </span>
                  <p className="text-xs text-rose-900 leading-relaxed whitespace-pre-wrap">{c.nonConversionReason}</p>
                  {canManage && (
                    <button type="button" className="text-[11px] font-semibold text-rose-700 hover:underline" onClick={onNotConverted}>
                      Edit reason
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="gap-2 h-9 text-xs border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs font-medium"
                  onClick={() => window.open(`mailto:${c.email}`, "_blank")}
                >
                  <Mail className="h-3.5 w-3.5 text-slate-500" /> Email Client
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 h-9 text-xs border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs font-medium"
                  onClick={() => window.open(`tel:${c.phone}`, "_self")}
                >
                  <Phone className="h-3.5 w-3.5 text-slate-500" /> Call Client
                </Button>
              </div>

              {canManage && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Update Lead Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONSULTATION_STATUSES.map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 text-xs font-semibold transition-all px-1",
                          c.status === s
                            ? "bg-primary hover:bg-primary/90 text-white border-primary shadow-2xs"
                            : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                        )}
                        onClick={() => (s === "Not Converted" ? onNotConverted() : onStatusChange(s))}
                        disabled={isUpdating}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-8 gap-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete request
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
