import { BadgePercent, Check, CreditCard, IndianRupee, Lock, Percent, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { inr } from "./pricing";
import { OFFLINE_METHODS, type DiscountType, type OfflineMethod, type PaymentDraft } from "./types";
import type { AssistedBookingState } from "./useAssistedBooking";

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 text-left rounded-xl border p-3 transition-colors",
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300"
      )}
    >
      {children}
    </button>
  );
}

export function StepPayment({ state }: { state: AssistedBookingState }) {
  const { discount, setDiscount, maxDiscountPercent, pricing, payment, setPayment, adminComment, setAdminComment } = state;
  const setPay = (key: keyof PaymentDraft, value: string) => setPayment((prev) => ({ ...prev, [key]: value }));
  const method = OFFLINE_METHODS.find((m) => m.value === payment.method);
  const types: { value: DiscountType; label: string; icon: typeof Percent }[] = [
    { value: "FLAT", label: "Flat amount (₹)", icon: IndianRupee },
    { value: "PERCENTAGE", label: "Percentage (%)", icon: Percent },
  ];

  return (
    <div className="space-y-7">
      {/* Special discount */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Litmus Special Discount</h2>
        </div>
        <p className="text-xs text-muted-foreground -mt-1">
          The negotiated discount. Applied before GST and shown to the customer on their order.
          {maxDiscountPercent < 100 && <> Limit: {maxDiscountPercent}% of subtotal.</>}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {types.map((t) => (
            <Choice key={t.value} active={discount.discountType === t.value} onClick={() => setDiscount({ discountType: t.value, value: "" })}>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <t.icon className="h-4 w-4 text-primary" /> {t.label}
                {discount.discountType === t.value && <Check className="h-4 w-4 text-primary ml-auto" />}
              </span>
            </Choice>
          ))}
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1 w-48">
            <Label className="text-[11px] font-semibold text-slate-500">
              {discount.discountType === "FLAT" ? "Discount amount (₹)" : "Discount percentage (%)"}
            </Label>
            <Input
              type="number"
              min={0}
              max={discount.discountType === "PERCENTAGE" ? 100 : undefined}
              placeholder="0"
              className={cn("h-10", pricing.error && "border-red-500")}
              value={discount.value}
              onChange={(e) => setDiscount((prev) => ({ ...prev, value: e.target.value }))}
            />
          </div>
          {pricing.specialDiscount > 0 && (
            <p className="text-sm text-emerald-700 font-semibold pb-2">
              − {inr(pricing.specialDiscount)} ({pricing.specialPercent}% of {inr(pricing.subtotal)})
            </p>
          )}
        </div>
        {pricing.error && <p className="text-xs font-semibold text-red-600">{pricing.error}</p>}
      </section>

      {/* Payment */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-slate-900">Payment</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Choice active={payment.status === "PAID"} onClick={() => setPay("status", "PAID")}>
            <p className="text-sm font-semibold text-slate-800">Already paid</p>
            <p className="text-xs text-slate-500">Customer paid by UPI / bank / cash. Booking is marked paid.</p>
          </Choice>
          <Choice active={payment.status === "PENDING"} onClick={() => setPay("status", "PENDING")}>
            <p className="text-sm font-semibold text-slate-800">Customer will pay online</p>
            <p className="text-xs text-slate-500">Booking shows as payment pending; customer pays from My Orders.</p>
          </Choice>
        </div>

        {payment.status === "PAID" && (
          <div className="grid sm:grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-500">Paid via *</Label>
              <Select value={payment.method || undefined} onValueChange={(v) => setPayment((p) => ({ ...p, method: v as OfflineMethod, platform: "" }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  {OFFLINE_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {method && method.platforms.length > 0 && (
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-500">{payment.method === "UPI" ? "UPI app" : "Bank / terminal"}</Label>
                <Input list="assisted-payment-platforms" className="h-9" placeholder={method.platforms[0]} value={payment.platform} onChange={(e) => setPay("platform", e.target.value)} />
                <datalist id="assisted-payment-platforms">
                  {method.platforms.map((p) => <option key={p} value={p} />)}
                </datalist>
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-500">
                {payment.method === "CHEQUE" ? "Cheque number" : "Transaction / UTR / reference no."}{payment.method !== "CASH" && " *"}
              </Label>
              <Input className="h-9" value={payment.transactionId} placeholder={payment.method === "CASH" ? "Optional receipt no." : "e.g. 412345678901"} onChange={(e) => setPay("transactionId", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-500">Payment date *</Label>
              <Input type="date" className="h-9" max={new Date().toISOString().slice(0, 10)} value={payment.paidOn} onChange={(e) => setPay("paidOn", e.target.value)} />
            </div>
            <p className="sm:col-span-2 text-xs text-slate-500 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Amount received should be {inr(pricing.total)} (incl. GST).
            </p>
          </div>
        )}
      </section>

      {/* Internal comment */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900">Admin comment</h2>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Internal only</span>
        </div>
        <Textarea
          rows={3}
          maxLength={2000}
          placeholder="e.g. 15% discount agreed on phone for quarterly batch commitment — approved by sales head."
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
        />
        <p className="text-[11px] text-slate-500">Visible to Litmus staff only. Never shown to the customer, lab or on invoices.</p>
      </section>
    </div>
  );
}
