import { AlertTriangle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const label = (status?: string) => (status || "PENDING").replace(/_/g, " ").toLowerCase();

/** Shown wherever a report can be released while the customer has not paid. */
export function PaymentPendingBanner({ paymentStatus, amount }: { paymentStatus?: string; amount?: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-3 text-amber-900">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
      <div className="text-xs leading-relaxed">
        <p className="font-bold uppercase tracking-wide">Payment pending</p>
        <p>
          The customer has not paid for this booking yet{amount ? ` (${amount})` : ""} — payment status is{" "}
          <span className="font-semibold">{label(paymentStatus)}</span>. Collect the payment and mark it as Paid before
          sharing the report.
        </p>
      </div>
    </div>
  );
}

/** Asks for confirmation before releasing a report on an unpaid booking. */
export function ReleaseUnpaidReportDialog({
  open,
  onOpenChange,
  onConfirm,
  paymentStatus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  paymentStatus?: string;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Payment pending"
      description={`Payment for this booking is still ${label(paymentStatus)}. Approving will complete the booking and share the report with the customer before they pay. Do you want to release the report anyway?`}
      confirmText="Release report anyway"
      cancelText="Go back"
      variant="destructive"
      onConfirm={onConfirm}
    />
  );
}
