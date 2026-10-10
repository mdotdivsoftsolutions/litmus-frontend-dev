import { Separator } from "@/components/ui/separator";
import { inr, type PricingSummary as Summary } from "./pricing";

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center justify-between text-sm ${className || ""}`}>
      <span>{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

/** MRP → catalog discount → subtotal → special discount → GST → total. */
export function PricingSummary({ pricing }: { pricing: Summary }) {
  return (
    <div className="space-y-2 text-slate-700">
      <Row label="Total MRP" value={inr(pricing.mrpTotal)} />
      {pricing.catalogDiscount > 0 && <Row label="Catalog discount" value={`− ${inr(pricing.catalogDiscount)}`} className="text-emerald-700" />}
      <Row label="Subtotal" value={inr(pricing.subtotal)} />
      {pricing.specialDiscount > 0 && (
        <Row
          label={`Litmus special discount (${pricing.specialPercent}%)`}
          value={`− ${inr(pricing.specialDiscount)}`}
          className="text-emerald-700 bg-emerald-50 -mx-2 px-2 py-1 rounded"
        />
      )}
      <Row label="Taxable amount" value={inr(pricing.taxableAmount)} />
      <Row label="GST (18%)" value={inr(pricing.gstAmount)} />
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900">Total payable</span>
        <span className="text-lg font-bold text-primary tabular-nums">{inr(pricing.total)}</span>
      </div>
    </div>
  );
}
