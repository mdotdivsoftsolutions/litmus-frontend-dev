import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Beaker, CheckSquare, Globe2, Info, RotateCcw, Search, Square, X } from "lucide-react";
import { categoryTestsApi, CategoryTestItem, CategoryTestsChanges } from "@/lib/api/categoryTests";
import { cn } from "@/lib/utils";

interface CategoryTestsPickerProps {
  /** Category being edited; null while creating a new category. */
  categoryId: string | null;
  /** Reports the pending add/remove lists whenever the selection changes. */
  onChange: (changes: CategoryTestsChanges) => void;
}

type ViewFilter = "all" | "in" | "out" | "changed";
const PAGE_STEP = 100;
const NO_TESTS: CategoryTestItem[] = [];

const isIncluded = (t: CategoryTestItem) => t.membership !== "NONE";

/**
 * Lists every test so the admin can link or unlink tests to the category in one place.
 * Tests already in the category are highlighted; changes are applied when the category is saved.
 */
export function CategoryTestsPicker({ categoryId, onChange }: CategoryTestsPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  const { data: tests = NO_TESTS, isLoading, isError } = useQuery({
    queryKey: ["categoryTests", categoryId ?? "new"],
    queryFn: () => (categoryId ? categoryTestsApi.list(categoryId) : categoryTestsApi.listForNewCategory()),
    staleTime: 30 * 1000,
  });

  // Start from what is already linked (or shown via "all categories").
  useEffect(() => {
    setSelected(new Set(tests.filter(isIncluded).map((t) => t._id)));
  }, [tests]);

  const changes = useMemo<CategoryTestsChanges>(() => {
    const add: string[] = [];
    const remove: string[] = [];
    for (const t of tests) {
      const now = selected.has(t._id);
      if (now && !isIncluded(t)) add.push(t._id);
      if (!now && isIncluded(t)) remove.push(t._id);
    }
    return { add, remove };
  }, [tests, selected]);

  useEffect(() => onChange(changes), [changes, onChange]);

  const changedIds = useMemo(() => new Set([...changes.add, ...changes.remove]), [changes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tests.filter((t) => {
      if (q && !t.testName.toLowerCase().includes(q) && !t.type.toLowerCase().includes(q)) return false;
      // Tabs follow the saved state, so ticking a row doesn't make it jump away before saving.
      if (view === "in") return isIncluded(t);
      if (view === "out") return !isIncluded(t);
      if (view === "changed") return changedIds.has(t._id);
      return true;
    });
  }, [tests, search, view, changedIds]);

  useEffect(() => setVisibleCount(PAGE_STEP), [search, view]);

  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const setShown = (checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((t) => (checked ? next.add(t._id) : next.delete(t._id)));
      return next;
    });

  const resetChanges = () => setSelected(new Set(tests.filter(isIncluded).map((t) => t._id)));

  // With a search or filter active, bulk actions apply to the shown tests only.
  const isFiltered = search.trim() !== "" || view !== "all";
  const scopeLabel = isFiltered ? `shown (${filtered.length})` : `all (${tests.length})`;
  const shownSelectedCount = filtered.filter((t) => selected.has(t._id)).length;
  const headerState: boolean | "indeterminate" =
    shownSelectedCount === 0 ? false : shownSelectedCount === filtered.length ? true : "indeterminate";

  const removedAllCategoryTests = tests.filter((t) => t.membership === "ALL" && !selected.has(t._id)).length;
  const savedInCount = useMemo(() => tests.filter(isIncluded).length, [tests]);
  const counts = { all: tests.length, in: savedInCount, out: tests.length - savedInCount, changed: changedIds.size };
  const chips: { key: ViewFilter; label: string }[] = [
    { key: "all", label: "All tests" },
    { key: "in", label: "In this category" },
    { key: "out", label: "Not added" },
    { key: "changed", label: "Unsaved changes" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests by name or type..."
            className="pl-9 pr-8 h-9 bg-white text-xs sm:text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => setShown(true)}
            disabled={!filtered.length || shownSelectedCount === filtered.length}
          >
            <CheckSquare className="h-3.5 w-3.5 text-primary" /> Select {scopeLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => setShown(false)}
            disabled={!filtered.length || shownSelectedCount === 0}
          >
            <Square className="h-3.5 w-3.5 text-slate-500" /> Unselect {scopeLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 text-xs gap-1.5 text-slate-600"
            onClick={resetChanges}
            disabled={changedIds.size === 0}
            title="Undo all unsaved changes"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setView(c.key)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors",
              view === c.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {c.label} <span className="opacity-70">{counts[c.key]}</span>
          </button>
        ))}
      </div>

      {removedAllCategoryTests > 0 && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {removedAllCategoryTests} test(s) currently apply to <b>all categories</b>. Removing them here keeps them in every other
          category but hides them from this one.
        </p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white max-h-[440px] overflow-y-auto divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <p className="p-6 text-center text-xs text-rose-600">Failed to load tests.</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">No tests match.</p>
        ) : (
          <>
            <label className="sticky top-0 z-10 flex items-center gap-3 px-3 py-2 bg-slate-50 border-b border-slate-200 cursor-pointer">
              <Checkbox
                checked={headerState}
                onCheckedChange={() => setShown(headerState !== true)}
                aria-label={headerState === true ? "Unselect all shown tests" : "Select all shown tests"}
              />
              <span className="text-[11px] font-bold text-slate-700">
                {headerState === true ? "Unselect" : "Select"} {isFiltered ? "all shown" : "all"} tests
              </span>
              <span className="ml-auto text-[11px] text-slate-500">
                {shownSelectedCount} of {filtered.length} selected
              </span>
            </label>
            {filtered.slice(0, visibleCount).map((t) => {
              const checked = selected.has(t._id);
              const willAdd = checked && !isIncluded(t);
              const willRemove = !checked && isIncluded(t);
              return (
                <label
                  key={t._id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors border-l-2",
                    checked ? "bg-primary/5 border-l-primary hover:bg-primary/10" : "border-l-transparent hover:bg-slate-50",
                    willRemove && "bg-rose-50/60 border-l-rose-400"
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={(v) => toggle(t._id, !!v)} aria-label={`Include ${t.testName}`} />
                  <Beaker className={cn("h-4 w-4 shrink-0", checked ? "text-primary" : "text-slate-300")} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-xs truncate", checked ? "font-semibold text-slate-900" : "text-slate-700")} title={t.testName}>
                      {t.testName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {t.type || "Standard"} · ₹{(t.offerPrice || t.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {t.membership === "ALL" && (
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700" title="Applies to all categories">
                      <Globe2 className="h-3 w-3" /> All categories
                    </span>
                  )}
                  {willAdd && <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Will add</span>}
                  {willRemove && <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">Will remove</span>}
                  {!willAdd && !willRemove && t.membership === "DIRECT" && (
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">In category</span>
                  )}
                </label>
              );
            })}
            {filtered.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_STEP)}
                className="w-full py-2.5 text-xs font-semibold text-primary hover:bg-primary/5"
              >
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            )}
          </>
        )}
      </div>

      {changedIds.size > 0 && (
        <p className="text-[11px] text-slate-600">
          <b className="text-emerald-700">{changes.add.length} to add</b> · <b className="text-rose-700">{changes.remove.length} to remove</b>. Changes
          are applied when you save the category.
        </p>
      )}
    </div>
  );
}
