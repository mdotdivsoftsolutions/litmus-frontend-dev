import { useQuery } from "@tanstack/react-query";
import { Check, Truck, MapPin } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PICKUP_TIMES, type LogisticsDraft } from "./types";
import type { AssistedBookingState } from "./useAssistedBooking";

const ADDRESS_FIELDS: { key: keyof LogisticsDraft; label: string; wide?: boolean }[] = [
  { key: "name", label: "Contact name" },
  { key: "phone", label: "Contact phone" },
  { key: "email", label: "Contact email" },
  { key: "gstNumber", label: "GST number (optional)" },
  { key: "address", label: "Street address *", wide: true },
  { key: "city", label: "City *" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode *" },
];

export function StepLogistics({ state }: { state: AssistedBookingState }) {
  const { logistics, setLogistics, pickupCities, isPickupCovered } = state;
  const set = (key: keyof LogisticsDraft, value: string) => setLogistics((prev) => ({ ...prev, [key]: value }));

  const { data: labsRes } = useQuery({ queryKey: ["adminLabs"], queryFn: adminApi.getLabs });
  const labs: { _id: string; labName?: string; name?: string }[] = labsRes?.data || [];

  const methods = [
    { value: "COURIER" as const, icon: Truck, title: "Courier", desc: "Customer ships samples to the nearest Litmus office." },
    {
      value: "PICKUP" as const,
      icon: MapPin,
      title: "Pickup",
      desc: `Litmus agent collects from the address. Available in ${pickupCities.join(", ") || "covered cities"}.`,
    },
  ];

  return (
    <div className="space-y-5 pt-2 border-t border-slate-200">
      <div>
        <h2 className="text-base font-bold text-slate-900">Collection & logistics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Pre-filled from the customer profile — edit if needed.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {ADDRESS_FIELDS.map((f) => (
          <div key={f.key} className={cn("space-y-1", f.wide && "sm:col-span-2")}>
            <Label className="text-[11px] font-semibold text-slate-500">{f.label}</Label>
            <Input
              value={logistics[f.key]}
              className="h-9"
              onChange={(e) =>
                set(f.key, f.key === "gstNumber" ? e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15) : e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {methods.map((m) => {
          const active = logistics.collectionMethod === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => set("collectionMethod", m.value)}
              className={cn(
                "text-left rounded-xl border p-4 transition-colors",
                active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                <m.icon className="h-5 w-5 text-primary" />
                {active && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="mt-2 text-sm font-bold text-slate-900">{m.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
              {m.value === "PICKUP" && active && !isPickupCovered && (
                <p className="mt-2 text-[11px] font-semibold text-amber-700">Not available for {logistics.city || "this city"}.</p>
              )}
            </button>
          );
        })}
      </div>

      {logistics.collectionMethod === "PICKUP" && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-500">Preferred pickup date (optional)</Label>
            <Input type="date" className="h-9" min={new Date().toISOString().slice(0, 10)} value={logistics.pickupDate} onChange={(e) => set("pickupDate", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-slate-500">Preferred pickup time (optional)</Label>
            <Select value={logistics.pickupTime || undefined} onValueChange={(v) => set("pickupTime", v)}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {PICKUP_TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-1 max-w-sm">
        <Label className="text-[11px] font-semibold text-slate-500">Laboratory</Label>
        <Select value={logistics.labId} onValueChange={(v) => set("labId", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Litmus Smart Allocation (assign later)</SelectItem>
            {labs.map((lab) => <SelectItem key={lab._id} value={lab._id}>{lab.labName || lab.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
