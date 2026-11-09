import { useRef, useState } from "react";
import { ReleaseUnpaidReportDialog } from "./PaymentPendingWarning";

export const isBookingPaid = (paymentStatus?: string) => ["SUCCESS", "PAID"].includes(String(paymentStatus || "").toUpperCase());

/**
 * Wraps "approve / publish report" actions: when the booking is not paid, the admin must confirm
 * the Payment Pending warning first. Render `dialog` once in the page.
 */
export function useUnpaidReportGuard() {
  const [pending, setPending] = useState<{ status?: string } | null>(null);
  const action = useRef<(() => void) | null>(null);

  const guard = (paymentStatus: string | undefined, run: () => void) => {
    if (isBookingPaid(paymentStatus)) return run();
    action.current = run;
    setPending({ status: paymentStatus });
  };

  const dialog = (
    <ReleaseUnpaidReportDialog
      open={!!pending}
      paymentStatus={pending?.status}
      onOpenChange={(open) => {
        if (!open) {
          setPending(null);
          action.current = null;
        }
      }}
      onConfirm={() => {
        const run = action.current;
        setPending(null);
        action.current = null;
        run?.();
      }}
    />
  );

  return { guard, dialog };
}
