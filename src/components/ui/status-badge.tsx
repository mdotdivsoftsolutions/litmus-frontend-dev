import { Badge } from "@/components/ui/badge";

type StatusType = "Pending" | "Approved" | "Rejected" | "Completed" | "In Progress" | "Active" | "Inactive" | "Verified" | "Pending Verification";

const statusVariantMap: Record<string, "pending" | "approved" | "rejected" | "completed" | "inprogress" | "default" | "secondary"> = {
  "Pending": "pending",
  "Pending Verification": "pending",
  "Approved": "approved",
  "Active": "approved",
  "Verified": "approved",
  "Rejected": "rejected",
  "Inactive": "rejected",
  "Completed": "completed",
  "In Progress": "inprogress",
};

export function StatusBadge({ status }: { status: StatusType | string }) {
  const variant = statusVariantMap[status] || "default";
  return <Badge variant={variant}>{status}</Badge>;
}
