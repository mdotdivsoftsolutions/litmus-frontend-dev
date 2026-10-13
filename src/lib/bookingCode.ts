/**
 * Booking reference shown to staff — the same one customers see in emails and on the site.
 * Sequential order code (LIT-ORD-10001) when present; older bookings fall back to BKG-<last 6 of _id>.
 */
export const bookingDisplayCode = (booking?: { _id?: string; orderCode?: string | null } | null): string => {
  if (!booking) return "";
  if (booking.orderCode) return booking.orderCode;
  const id = String(booking._id ?? "");
  return id ? `BKG-${id.slice(-6).toUpperCase()}` : "";
};
