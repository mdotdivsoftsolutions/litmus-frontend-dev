import { format } from "date-fns";
import { Headset, Lock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { inr } from "./pricing";
import { OFFLINE_METHODS } from "./types";

const methodLabel = (m?: string) => OFFLINE_METHODS.find((x) => x.value === m)?.label || m || "—";
const safeDate = (d?: string) => {
  try {
    return d ? format(new Date(d), "MMM d, yyyy") : "—";
  } catch {
    return "—";
  }
};

/** Price breakdown, offline payment proof and internal comment for admin-created bookings. */
export function AssistedBookingDetailsCard({ booking }: { booking: any }) {
  const pricing = booking?.pricing;
  const offline = booking?.offlinePayment;
  const isAssisted = booking?.bookingChannel === "ADMIN_ASSISTED";
  if (!isAssisted && !pricing?.subtotal && !offline?.method) return null;

  const bookedBy = booking?.bookedBy;
  const bookedByName = bookedBy && typeof bookedBy === "object" ? `${bookedBy.firstName || ""} ${bookedBy.lastName || ""}`.trim() || bookedBy.email : null;
  const special = pricing?.specialDiscount;

  return (
    <Card className="bg-white border border-indigo-200 shadow-2xs rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Headset className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Admin-Assisted Booking</h3>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Created by admin</span>
        </div>
        {bookedByName && <p className="text-xs text-slate-500">Booked by {bookedByName}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {pricing?.subtotal != null && (
          <div className="space-y-1.5 text-sm text-slate-700">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Price breakdown</p>
            <div className="flex justify-between"><span>Total MRP</span><span>{inr(pricing.mrpTotal)}</span></div>
            {pricing.catalogDiscount > 0 && (
              <div className="flex justify-between text-emerald-700"><span>Catalog discount</span><span>− {inr(pricing.catalogDiscount)}</span></div>
            )}
            <div className="flex justify-between"><span>Subtotal</span><span>{inr(pricing.subtotal)}</span></div>
            {special?.amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Special discount ({special.discountType === "PERCENTAGE" ? `${special.value}%` : "flat"})</span>
                <span>− {inr(special.amount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span>GST ({Math.round((pricing.gstRate ?? 0.18) * 100)}%)</span><span>{inr(pricing.gstAmount)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 border-t pt-1"><span>Total</span><span>{inr(booking.totalAmount)}</span></div>
          </div>
        )}

        <div className="space-y-1.5 text-sm text-slate-700">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Wallet className="h-3 w-3" /> Offline payment</p>
          {offline?.method ? (
            <>
              <p><span className="text-slate-500">Method:</span> {methodLabel(offline.method)}{offline.platform && ` · ${offline.platform}`}</p>
              <p className="break-all"><span className="text-slate-500">Reference:</span> {offline.transactionId || "—"}</p>
              <p><span className="text-slate-500">Paid on:</span> {safeDate(offline.paidOn)}</p>
              <p className="text-xs text-slate-500">Recorded {safeDate(offline.recordedAt)}</p>
            </>
          ) : (
            <p className="text-slate-500">Not paid offline — customer pays online from My Orders.</p>
          )}
        </div>

        <div className="space-y-1.5 text-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1"><Lock className="h-3 w-3" /> Admin comment (internal)</p>
          <p className="text-slate-700 whitespace-pre-wrap bg-amber-50/60 border border-amber-100 rounded p-2 min-h-[3rem]">
            {booking?.adminComment?.trim() || <span className="text-slate-400">No comment</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}
