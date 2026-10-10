import { OFFLINE_METHODS } from "./types";
import { inr, linePrice } from "./pricing";
import { PricingSummary } from "./PricingSummary";
import type { AssistedBookingState } from "./useAssistedBooking";

function Block({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={onEdit}>Edit</button>
      </div>
      <div className="text-sm text-slate-700 space-y-1">{children}</div>
    </div>
  );
}

export function StepReview({ state }: { state: AssistedBookingState }) {
  const { customer, lines, logistics, payment, pricing, adminComment, goTo } = state;
  const methodLabel = OFFLINE_METHODS.find((m) => m.value === payment.method)?.label;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Review & confirm</h2>
        <p className="text-xs text-muted-foreground mt-0.5">The booking appears in the customer's My Orders as soon as you confirm.</p>
      </div>
      <Block title="Customer" onEdit={() => goTo(0)}>
        <p className="font-semibold text-slate-900">{customer?.firstName} {customer?.lastName}</p>
        <p>{customer?.email} · {customer?.phone}</p>
      </Block>
      <Block title="Tests & packages" onEdit={() => goTo(1)}>
        {lines.map((l) => (
          <div key={l.key} className="flex justify-between gap-3">
            <span className="truncate">
              {l.name} <span className="text-slate-400">× {l.samples.filter((s) => s.productName.trim()).length} sample(s)</span>
            </span>
            <span className="font-semibold shrink-0">{inr(linePrice(l))}</span>
          </div>
        ))}
      </Block>
      <Block title="Collection" onEdit={() => goTo(2)}>
        <p>
          {logistics.collectionMethod === "PICKUP" ? "Pickup" : "Courier"} ·{" "}
          {[logistics.address, logistics.city, logistics.state, logistics.pincode].filter(Boolean).join(", ")}
        </p>
        {logistics.collectionMethod === "PICKUP" && logistics.pickupDate && <p>Preferred: {logistics.pickupDate} {logistics.pickupTime}</p>}
        {logistics.gstNumber && <p>GSTIN: {logistics.gstNumber}</p>}
      </Block>
      <Block title="Payment" onEdit={() => goTo(3)}>
        {payment.status === "PAID" ? (
          <p>
            <span className="font-semibold text-emerald-700">Paid</span> via {methodLabel}
            {payment.platform && ` (${payment.platform})`}
            {payment.transactionId && ` · Ref ${payment.transactionId}`} · {payment.paidOn}
          </p>
        ) : (
          <p><span className="font-semibold text-amber-700">Payment pending</span> — customer pays online from My Orders.</p>
        )}
        {adminComment.trim() && <p className="text-xs text-amber-800 bg-amber-50 rounded p-2 mt-1">Internal: {adminComment}</p>}
      </Block>
      <div className="rounded-xl border border-slate-200 p-4">
        <PricingSummary pricing={pricing} />
      </div>
    </div>
  );
}
