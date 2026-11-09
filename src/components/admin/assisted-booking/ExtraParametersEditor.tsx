import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newExtraParameter, type ExtraParameter } from "./types";

interface ExtraParametersEditorProps {
  extras: ExtraParameter[];
  /** Names already on this sample (catalog parameters / package tests), to suggest and to avoid duplicates. */
  suggestions: string[];
  onChange: (extras: ExtraParameter[]) => void;
}

/** "Add another parameter" for one sample — name + price, billed on top of the catalog parameters. */
export function ExtraParametersEditor({ extras, suggestions, onChange }: ExtraParametersEditorProps) {
  const update = (id: string, key: "name" | "price", value: string) =>
    onChange(extras.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  const taken = new Set(suggestions.map((s) => s.trim().toLowerCase()));

  return (
    <div className="space-y-2">
      {extras.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-500">Additional parameters for this sample</p>
          {extras.map((x) => {
            const duplicate = x.name.trim() && taken.has(x.name.trim().toLowerCase());
            return (
              <div key={x.id} className="flex flex-wrap sm:flex-nowrap items-start gap-2">
                <div className="flex-1 min-w-[180px]">
                  <Input
                    className="h-9"
                    placeholder="Parameter name, e.g. Moisture"
                    value={x.name}
                    onChange={(e) => update(x.id, "name", e.target.value)}
                  />
                  {duplicate && <p className="text-[11px] text-amber-700 mt-0.5">Already listed above — tick it there instead.</p>}
                </div>
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                  <Input
                    className="h-9 pl-6"
                    type="number"
                    min={0}
                    placeholder="Price"
                    value={x.price}
                    onChange={(e) => update(x.id, "price", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-slate-400 hover:text-destructive"
                  aria-label="Remove parameter"
                  onClick={() => onChange(extras.filter((p) => p.id !== x.id))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <Button type="button" size="sm" variant="ghost" className="h-8 gap-1 text-primary px-2" onClick={() => onChange([...extras, newExtraParameter()])}>
        <Plus className="h-3.5 w-3.5" /> Add another parameter
      </Button>
    </div>
  );
}
