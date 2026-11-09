import { Badge } from "@/components/ui/badge";

export const CONSULTATION_STATUSES = ["Pending", "Contacted", "Resolved", "Converted", "Not Converted"] as const;
export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

const STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60",
  Contacted: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/60",
  Resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60",
  Converted: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-900/60",
  "Not Converted": "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/60",
};

export function ConsultationStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`font-medium whitespace-nowrap ${STYLES[status] || ""}`}>
      {status}
    </Badge>
  );
}
