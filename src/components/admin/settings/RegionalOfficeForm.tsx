import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Loader2, Save } from "lucide-react";
import { IRegionalOffice } from "@/lib/api/settings";
import { IntakeSchedulePicker } from "./IntakeSchedulePicker";
import { cn } from "@/lib/utils";

const EMPTY_OFFICE: IRegionalOffice = {
  name: "",
  states: [],
  isDefault: false,
  isActive: true,
  facilityName: "",
  attention: "Sample Logistics & Ingestion Desk",
  street: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  workingHours: "Mon – Sat · 08:00 AM – 08:00 PM IST",
};

interface RegionalOfficeFormProps {
  open: boolean;
  office: IRegionalOffice | null;
  /** All Indian states the server accepts. */
  stateOptions: string[];
  /** State → office name, for states already served by another active office. */
  takenStates: Map<string, string>;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (office: IRegionalOffice) => void;
}

const REQUIRED_WHEN_ACTIVE: (keyof IRegionalOffice)[] = ["facilityName", "street", "city", "state", "pincode", "phone", "email"];

/** Validates one office the same way the server does, so admins see problems before saving. */
function validate(o: IRegionalOffice): string | null {
  if (!o.name.trim()) return "Office name is required";
  if (!o.isActive) return null;
  const missing = REQUIRED_WHEN_ACTIVE.filter((f) => !String(o[f] ?? "").trim());
  if (missing.length) return `Fill in ${missing.join(", ")} (required for an active office)`;
  if (!/^\d{6}$/.test(o.pincode.trim())) return "PIN code must be 6 digits";
  if (!/^[+\d][\d\s()-]{6,20}$/.test(o.phone.trim())) return "Phone number is invalid";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email.trim())) return "Email address is invalid";
  if (o.isDefault && !o.isActive) return "The default office must be active";
  return null;
}

export function RegionalOfficeForm({ open, office, stateOptions, takenStates, isSaving, onOpenChange, onSave }: RegionalOfficeFormProps) {
  const [form, setForm] = useState<IRegionalOffice>(EMPTY_OFFICE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(office ? { ...EMPTY_OFFICE, ...office } : EMPTY_OFFICE);
      setError(null);
    }
  }, [open, office]);

  const set = <K extends keyof IRegionalOffice>(key: K, value: IRegionalOffice[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleState = (name: string) =>
    set("states", form.states.includes(name) ? form.states.filter((s) => s !== name) : [...form.states, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }
    const clash = form.isActive ? form.states.find((s) => takenStates.has(s)) : undefined;
    if (clash) {
      setError(`${clash} is already served by the ${takenStates.get(clash)} office`);
      return;
    }
    onSave(form);
  };

  const field = (key: keyof IRegionalOffice, label: string, opts: { placeholder?: string; type?: string; required?: boolean } = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`office-${key}`} className="text-xs font-semibold">
        {label} {opts.required && form.isActive && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={`office-${key}`}
        type={opts.type || "text"}
        value={String(form[key] ?? "")}
        placeholder={opts.placeholder}
        onChange={(e) => set(key, e.target.value as never)}
      />
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{office?._id || office?.name ? `Edit ${office.name || "office"}` : "Add regional office"}</SheetTitle>
          <SheetDescription>
            Customers whose address is in one of the selected states see this office&apos;s address, phone and email at checkout.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-3">
            {field("name", "Office name", { placeholder: "e.g. Kochi", required: true })}
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center justify-between gap-3 text-xs font-semibold">
                Active (shown to customers)
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs font-semibold">
                Default for other states
                <Switch checked={form.isDefault} onCheckedChange={(v) => set("isDefault", v)} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">States served</Label>
            <p className="text-[11px] text-muted-foreground">
              Customers from these states see this office. States already served by another active office are locked.
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto rounded-lg border border-slate-200 p-2">
              {stateOptions.map((name) => {
                const selected = form.states.includes(name);
                const owner = takenStates.get(name);
                const locked = !selected && Boolean(owner) && form.isActive;
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={locked}
                    onClick={() => toggleState(name)}
                    title={locked ? `Served by ${owner}` : undefined}
                    className={cn(
                      "px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors",
                      selected ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-200 hover:border-primary/50",
                      locked && "opacity-40 cursor-not-allowed hover:border-slate-200"
                    )}
                  >
                    {name}
                    {locked && <span className="ml-1 font-normal">· {owner}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-800">Address</p>
            {field("facilityName", "Facility / hub name", { placeholder: "e.g. Litmus Kochi Sample Intake Centre", required: true })}
            {field("attention", "Attention / desk", { placeholder: "e.g. Sample Logistics Desk" })}
            {field("street", "Street address / building", { required: true })}
            <div className="grid sm:grid-cols-3 gap-3">
              {field("city", "City", { placeholder: "Kochi", required: true })}
              {field("state", "State", { placeholder: "Kerala", required: true })}
              {field("pincode", "PIN code", { placeholder: "682030", required: true })}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-800">Contact</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {field("phone", "Phone", { placeholder: "+91 …", required: true })}
              {field("email", "Email", { type: "email", placeholder: "kochi@litmus…", required: true })}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> Receiving hours
              </Label>
              <IntakeSchedulePicker value={form.workingHours} onChange={(v) => set("workingHours", v)} />
            </div>
          </div>

          {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-1.5 bg-primary text-white">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save office
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
