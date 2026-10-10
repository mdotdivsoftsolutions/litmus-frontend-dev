import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlaskConical, Loader2, Package as PackageIcon, Plus, Search, Trash2 } from "lucide-react";
import { testApi } from "@/lib/api/test";
import { packageApi } from "@/lib/api/package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inr, lineMrp, linePrice } from "./pricing";
import { newSample, type CatalogParam, type ItemType, type LineDraft } from "./types";
import type { AssistedBookingState } from "./useAssistedBooking";

type CatalogLine = Omit<LineDraft, "samples" | "key">;

/** Converts a catalog test / package into a booking line (one sample). */
function toLine(itemType: ItemType, raw: any): CatalogLine {
  if (itemType === "TEST") {
    const parameters: CatalogParam[] = Array.isArray(raw?.metadata?.parameters) ? raw.metadata.parameters : [];
    const base = Number(raw.price) || 0;
    const value = Number(raw.discountValue) || 0;
    const discounted =
      raw.discountType === "PERCENTAGE" ? base * (1 - value / 100) : raw.discountType === "FLAT" ? base - value : base;
    return {
      itemType,
      refId: raw._id,
      name: raw.testName || raw.name || "Test",
      // Parameter-priced tests are re-priced per sample in pricing.ts; this is the no-parameter fallback.
      unitPrice: Math.max(0, Math.round(discounted * 100) / 100),
      unitMrp: base,
      parameters: parameters.filter((p) => p?.name),
      packageTests: [],
      catalogDiscountType: raw.discountType,
      catalogDiscountValue: Number(raw.discountValue) || 0,
    };
  }
  const packageTests: string[] = (Array.isArray(raw?.tests) ? raw.tests : [])
    .map((t: any) => (typeof t === "object" ? t?.testName || t?.name : null))
    .filter(Boolean);
  return {
    itemType,
    refId: raw._id,
    name: raw.name || "Package",
    unitPrice: Number(raw.price) || 0,
    unitMrp: Number(raw.mrp) || Number(raw.price) || 0,
    parameters: [],
    packageTests,
  };
}

const previewPrice = (line: CatalogLine) => {
  const draft: LineDraft = { ...line, key: line.refId, samples: [newSample(line.parameters.map((p) => p.name))] };
  return { price: linePrice(draft), mrp: lineMrp(draft) };
};

export function StepItems({ state }: { state: AssistedBookingState }) {
  const { lines, addLine, removeLine } = state;
  const [tab, setTab] = useState<ItemType>("TEST");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isFetching } = useQuery({
    queryKey: ["assistedBookingCatalog", tab, debounced],
    queryFn: () =>
      tab === "TEST"
        ? testApi.getTests({ search: debounced || undefined, limit: 30, page: 1 })
        : packageApi.getPackages({ search: debounced || undefined, limit: 30, page: 1 }),
  });
  const catalog: CatalogLine[] = (data?.data || []).map((raw: any) => toLine(tab, raw));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Tests & Packages</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Add everything the customer agreed to. Catalog prices are filled in automatically.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Tabs value={tab} onValueChange={(v) => setTab(v as ItemType)}>
          <TabsList>
            <TabsTrigger value="TEST" className="gap-1.5"><FlaskConical className="h-3.5 w-3.5" /> Tests</TabsTrigger>
            <TabsTrigger value="PACKAGE" className="gap-1.5"><PackageIcon className="h-3.5 w-3.5" /> Packages</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={tab === "TEST" ? "Search tests..." : "Search packages..."}
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {catalog.length === 0 && !isFetching && <p className="p-6 text-center text-sm text-slate-500">Nothing found.</p>}
        {catalog.map((item) => {
          const { price, mrp } = previewPrice(item);
          const added = lines.some((l) => l.refId === item.refId);
          return (
            <div key={item.refId} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {inr(price)}
                  {mrp > price && <span className="line-through ml-2 text-slate-400">{inr(mrp)}</span>}
                  {item.parameters.length > 0 && <span className="ml-2">· {item.parameters.length} parameters</span>}
                  {item.packageTests.length > 0 && <span className="ml-2">· {item.packageTests.length} tests</span>}
                  <span className="ml-1 text-slate-400">/ sample</span>
                </p>
              </div>
              <Button size="sm" variant={added ? "secondary" : "outline"} disabled={added} className="gap-1 shrink-0" onClick={() => addLine(item)}>
                {added ? "Added" : <><Plus className="h-3.5 w-3.5" /> Add</>}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected ({lines.length})</h3>
        {lines.length === 0 ? (
          <p className="text-sm text-slate-500 rounded-xl border border-dashed border-slate-300 p-4 text-center">No tests or packages added yet.</p>
        ) : (
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
            {lines.map((l) => (
              <div key={l.key} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    <span className="text-[10px] font-bold uppercase mr-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{l.itemType}</span>
                    {l.name}
                  </p>
                  <p className="text-xs text-slate-500">{l.samples.length} sample(s) · {inr(linePrice(l))}</p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => removeLine(l.key)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
