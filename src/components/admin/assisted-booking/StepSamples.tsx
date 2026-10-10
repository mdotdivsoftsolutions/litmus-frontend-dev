import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { inr, linePrice } from "./pricing";
import { newSample, type LineDraft, type SampleDraft } from "./types";
import type { AssistedBookingState } from "./useAssistedBooking";

const FIELDS: { key: keyof Omit<SampleDraft, "id" | "selectedParameters">; label: string; placeholder: string }[] = [
  { key: "productName", label: "Product name *", placeholder: "e.g. Mango Pickle" },
  { key: "quantity", label: "Quantity", placeholder: "e.g. 500 g" },
  { key: "batchNumber", label: "Batch no.", placeholder: "Optional" },
  { key: "sku", label: "SKU", placeholder: "Optional" },
  { key: "specifics", label: "Notes for the lab", placeholder: "Optional" },
];

function LineSamples({ line, state }: { line: LineDraft; state: AssistedBookingState }) {
  const update = (fn: (samples: SampleDraft[]) => SampleDraft[]) => state.updateLine(line.key, (l) => ({ ...l, samples: fn(l.samples) }));
  const setField = (id: string, key: keyof SampleDraft, value: string) =>
    update((samples) => samples.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  const toggleParam = (id: string, name: string) =>
    update((samples) =>
      samples.map((s) =>
        s.id !== id
          ? s
          : { ...s, selectedParameters: s.selectedParameters.includes(name) ? s.selectedParameters.filter((p) => p !== name) : [...s.selectedParameters, name] }
      )
    );
  const defaults = line.itemType === "TEST" ? line.parameters.map((p) => p.name) : line.packageTests;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-sm font-bold text-slate-900 truncate">
          <span className="text-[10px] font-bold uppercase mr-2 px-1.5 py-0.5 rounded bg-white border text-slate-600">{line.itemType}</span>
          {line.name}
        </p>
        <span className="text-sm font-semibold text-slate-700 shrink-0">{inr(linePrice(line))}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {line.samples.map((sample, idx) => (
          <div key={sample.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sample {idx + 1}</span>
              {line.samples.length > 1 && (
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-slate-500 hover:text-destructive" onClick={() => update((s) => s.filter((x) => x.id !== sample.id))}>
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FIELDS.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-500">{f.label}</Label>
                  <Input value={sample[f.key]} placeholder={f.placeholder} className="h-9" onChange={(e) => setField(sample.id, f.key, e.target.value)} />
                </div>
              ))}
            </div>
            {line.itemType === "TEST" && line.parameters.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-slate-500">Parameters ({sample.selectedParameters.length}/{line.parameters.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {line.parameters.map((p) => (
                    <label key={p.name} className="flex items-center gap-1.5 text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 cursor-pointer hover:bg-slate-50">
                      <Checkbox checked={sample.selectedParameters.includes(p.name)} onCheckedChange={() => toggleParam(sample.id, p.name)} />
                      {p.name}
                      {!p.isCustom && Number(p.price) > 0 && <span className="text-slate-400">{inr(Number(p.price))}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {line.itemType === "PACKAGE" && line.packageTests.length > 0 && (
              <p className="text-xs text-slate-500">Includes: {line.packageTests.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-100">
        <Button size="sm" variant="outline" className="gap-1" onClick={() => update((s) => [...s, newSample(defaults)])}>
          <Plus className="h-3.5 w-3.5" /> Add another sample
        </Button>
      </div>
    </div>
  );
}

export function StepSamples({ state }: { state: AssistedBookingState }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Sample details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Each sample is billed separately, the same as on the website.</p>
      </div>
      {state.lines.map((line) => (
        <LineSamples key={line.key} line={line} state={state} />
      ))}
    </div>
  );
}
