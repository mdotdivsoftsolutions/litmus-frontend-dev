import { useCallback, useMemo, useState } from "react";

/** Row selection state for admin tables with bulk actions (selection survives paging). */
export function useBulkSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  const toggle = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)));
  }, []);

  /** Selects or clears every row currently visible (e.g. the current page). */
  const togglePage = useCallback((pageIds: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...pageIds]));
      const page = new Set(pageIds);
      return prev.filter((id) => !page.has(id));
    });
  }, []);

  const isPageSelected = useCallback(
    (pageIds: string[]) => pageIds.length > 0 && pageIds.every((id) => selectedSet.has(id)),
    [selectedSet]
  );

  const clear = useCallback(() => setSelectedIds([]), []);

  return { selectedIds, isSelected, toggle, togglePage, isPageSelected, clear };
}
