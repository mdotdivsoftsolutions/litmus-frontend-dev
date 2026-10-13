import type { DiscountDraft, LineDraft } from "./types";

export const GST_RATE = 0.18;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** MRP of one sample of a test priced by parameters (falls back to the test price). */
const parameterBase = (line: LineDraft, selected: string[]) => {
  const sum = line.parameters.reduce(
    (acc, p) => (!p.isCustom && selected.includes(p.name) ? acc + (Number(p.price) || 0) : acc),
    0
  );
  return sum > 0 ? sum : line.unitMrp;
};

/** Line MRP — same rules as the customer checkout. */
export function lineMrp(line: LineDraft): number {
  if (line.itemType === "TEST" && line.parameters.length > 0) {
    return round2(line.samples.reduce((acc, s) => acc + parameterBase(line, s.selectedParameters), 0));
  }
  return round2((line.unitMrp || line.unitPrice) * line.samples.length);
}

/** Line selling price after the catalog discount — same rules as the customer checkout. */
export function linePrice(line: LineDraft): number {
  if (line.itemType === "TEST" && line.parameters.length > 0) {
    const base = lineMrp(line);
    const value = Number(line.catalogDiscountValue) || 0;
    const discount =
      line.catalogDiscountType === "PERCENTAGE" ? base * (value / 100) : line.catalogDiscountType === "FLAT" ? value : 0;
    return round2(Math.max(0, base - discount));
  }
  return round2(line.unitPrice * line.samples.length);
}

export interface PricingSummary {
  mrpTotal: number;
  catalogDiscount: number;
  subtotal: number;
  specialDiscount: number;
  specialPercent: number;
  taxableAmount: number;
  gstAmount: number;
  total: number;
  error?: string;
}

/** Mirrors computeAssistedPricing on the server (GST is charged after the special discount). */
export function summarize(lines: LineDraft[], discount: DiscountDraft, maxPercent = 100): PricingSummary {
  const subtotal = round2(lines.reduce((acc, l) => acc + linePrice(l), 0));
  const mrpTotal = round2(lines.reduce((acc, l) => acc + Math.max(lineMrp(l), linePrice(l)), 0));
  const value = Number(discount.value) || 0;
  let special = value > 0 ? round2(discount.discountType === "PERCENTAGE" ? (subtotal * value) / 100 : value) : 0;
  let error: string | undefined;
  if (value < 0) error = "Discount cannot be negative";
  else if (discount.discountType === "PERCENTAGE" && value > 100) error = "Percentage cannot be more than 100%";
  else if (special > subtotal) error = "Discount cannot be more than the subtotal";
  else if (subtotal > 0 && (special / subtotal) * 100 > maxPercent + 1e-9) {
    error = `Special discount cannot exceed ${maxPercent}% of the subtotal`;
  }
  if (error) special = 0;
  const taxableAmount = round2(subtotal - special);
  const gstAmount = Math.round(taxableAmount * GST_RATE);
  return {
    mrpTotal,
    catalogDiscount: round2(Math.max(0, mrpTotal - subtotal)),
    subtotal,
    specialDiscount: special,
    specialPercent: subtotal > 0 ? round2((special / subtotal) * 100) : 0,
    taxableAmount,
    gstAmount,
    total: round2(taxableAmount + gstAmount),
    error,
  };
}

export const inr = (n: number) => `₹${(Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
