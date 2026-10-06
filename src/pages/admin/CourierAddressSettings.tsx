import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertTriangle, Building2, Clock, Edit3, Loader2, Mail, MapPin, Phone, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { settingsApi, IRegionalOffice } from "@/lib/api/settings";
import { RegionalOfficeForm } from "@/components/admin/settings/RegionalOfficeForm";
import { cn } from "@/lib/utils";

const SETTINGS_KEY = ["adminPlatformSettings"];
const NO_OFFICES: IRegionalOffice[] = [];
const NO_STATES: string[] = [];

const isComplete = (o: IRegionalOffice) =>
  [o.facilityName, o.street, o.city, o.state, o.pincode, o.phone, o.email].every((v) => String(v || "").trim());

/**
 * Regional offices shown at checkout: customers see the office serving their state
 * (e.g. Chennai for Tamil Nadu, Kochi for Kerala); other states see the default office.
 */
export function CourierAddressSettings() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<{ index: number | null; office: IRegionalOffice | null } | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: settingsApi.getSettings,
  });

  const offices: IRegionalOffice[] = settingsData?.data?.regionalOffices ?? NO_OFFICES;
  const stateOptions: string[] = settingsData?.meta?.indianStates ?? NO_STATES;
  const defaultOffice = offices.find((o) => o.isDefault && o.isActive);

  const saveMutation = useMutation({
    mutationFn: (next: IRegionalOffice[]) => settingsApi.updateRegionalOffices(next),
    onSuccess: (res) => {
      queryClient.setQueryData(SETTINGS_KEY, (prev: any) => (prev ? { ...prev, data: { ...prev.data, regionalOffices: res.data } } : prev));
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      setEditing(null);
      setDeleteIndex(null);
      toast.success("Regional offices updated");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update offices"),
  });

  const save = (next: IRegionalOffice[]) => saveMutation.mutate(next);

  /** States served by active offices other than the one being edited. */
  const takenStates = useMemo(() => {
    const map = new Map<string, string>();
    offices.forEach((o, i) => {
      if (!o.isActive || i === editing?.index) return;
      o.states.forEach((s) => map.set(s, o.name));
    });
    return map;
  }, [offices, editing?.index]);

  const uncoveredCount = useMemo(() => {
    const covered = new Set(offices.filter((o) => o.isActive).flatMap((o) => o.states));
    return stateOptions.filter((s) => !covered.has(s)).length;
  }, [offices, stateOptions]);

  const handleFormSave = (office: IRegionalOffice) => {
    const next = offices.map((o) => ({ ...o }));
    const index = editing?.index ?? next.length;
    next[index] = { ...office };
    // Only one default office.
    if (office.isDefault) next.forEach((o, i) => i !== index && (o.isDefault = false));
    save(next);
  };

  const setDefault = (index: number) => save(offices.map((o, i) => ({ ...o, isDefault: i === index })));

  const setActive = (index: number, isActive: boolean) => {
    const office = offices[index];
    if (isActive && !isComplete(office)) {
      toast.error(`Add the full address, phone and email for ${office.name} before activating it`);
      setEditing({ index, office: { ...office, isActive: true } });
      return;
    }
    save(offices.map((o, i) => (i === index ? { ...o, isActive } : o)));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading regional offices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Regional Offices &amp; Courier Addresses
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            At checkout, customers see the address, phone and email of the office serving their state. Other states see the default
            office{defaultOffice ? ` (${defaultOffice.name})` : ""}.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setEditing({ index: null, office: null })}
          className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shadow-sm text-xs h-8 px-4 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Add Office
        </Button>
      </div>

      {uncoveredCount > 0 && defaultOffice && (
        <p className="text-[11px] text-slate-500">
          {uncoveredCount} state(s) have no office of their own and will be shown the <b>{defaultOffice.name}</b> office.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {offices.map((office, index) => {
          const complete = isComplete(office);
          return (
            <div
              key={office._id || office.name}
              className={cn(
                "rounded-xl border p-4 space-y-3 bg-white shadow-xs",
                office.isDefault && office.isActive ? "border-primary/40 ring-1 ring-primary/15" : "border-slate-200",
                !office.isActive && "bg-slate-50/70"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-bold text-slate-900">{office.name}</p>
                    {office.isDefault && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1" variant="outline">
                        <Star className="h-3 w-3" /> Default
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        office.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {office.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {office.states.length ? (
                      office.states.map((s) => (
                        <span key={s} className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No states assigned</span>
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 shrink-0">
                  {office.isActive ? "On" : "Off"}
                  <Switch
                    checked={office.isActive}
                    disabled={saveMutation.isPending}
                    onCheckedChange={(v) => setActive(index, v)}
                    aria-label={`Show ${office.name} office to customers`}
                  />
                </label>
              </div>

              {!complete && (
                <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Address details are incomplete. Edit the office and add the real address, phone and email to activate it.
                </p>
              )}

              <div className="space-y-1 text-xs text-slate-700">
                <p className="flex items-start gap-1.5 font-semibold text-slate-900">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {office.facilityName || "—"}
                </p>
                <p className="pl-5 text-slate-600">{office.street || "Street not set"}</p>
                <p className="pl-5 text-slate-600">
                  {[office.city, office.state].filter(Boolean).join(", ")} {office.pincode && `— ${office.pincode}`}
                </p>
                <p className="flex items-center gap-1.5 pt-1">
                  <Phone className="h-3.5 w-3.5 text-primary" /> {office.phone || "—"}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-primary" /> {office.email || "—"}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {office.workingHours || "—"}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                <Button type="button" size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setEditing({ index, office })}>
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
                {!office.isDefault && office.isActive && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    disabled={saveMutation.isPending}
                    onClick={() => setDefault(index)}
                  >
                    <Star className="h-3.5 w-3.5" /> Make default
                  </Button>
                )}
                {!office.isDefault && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 ml-auto"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RegionalOfficeForm
        open={!!editing}
        office={editing?.office ?? null}
        stateOptions={stateOptions}
        takenStates={takenStates}
        isSaving={saveMutation.isPending}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={handleFormSave}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
        title={`Delete ${deleteIndex !== null ? offices[deleteIndex]?.name : ""} office?`}
        description="Customers from its states will see the default office instead. Existing bookings keep the address they were given."
        confirmText="Delete"
        variant="destructive"
        loading={saveMutation.isPending}
        onConfirm={() => deleteIndex !== null && save(offices.filter((_, i) => i !== deleteIndex))}
      />
    </div>
  );
}
