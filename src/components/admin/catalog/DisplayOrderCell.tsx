import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { catalogOrderApi, CatalogEntity, DISPLAY_ORDER_MAX } from "@/lib/api/catalogOrder";

interface DisplayOrderCellProps {
  entity: CatalogEntity;
  id: string;
  value?: number | null;
  /** Query keys to refresh once the priority is saved. */
  invalidateKeys: string[];
}

/**
 * Inline editor for a catalog item's storefront priority (1 = shown first).
 * Saves on blur / Enter; an empty value clears the priority.
 */
export function DisplayOrderCell({ entity, id, value, invalidateKeys }: DisplayOrderCellProps) {
  const queryClient = useQueryClient();
  const initial = value ? String(value) : "";
  const [draft, setDraft] = useState(initial);

  useEffect(() => setDraft(initial), [initial]);

  const mutation = useMutation({
    mutationFn: (displayOrder: number | null) => catalogOrderApi.update(entity, [{ id, displayOrder }]),
    onSuccess: (_res, displayOrder) => {
      toast.success(displayOrder ? `Priority set to ${displayOrder}` : "Priority cleared");
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
    onError: (err: any) => {
      setDraft(initial);
      toast.error(err?.response?.data?.message || "Failed to update priority");
    },
  });

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === initial) return;
    if (!trimmed) {
      mutation.mutate(null);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > DISPLAY_ORDER_MAX) {
      toast.error(`Priority must be a whole number between 1 and ${DISPLAY_ORDER_MAX}`);
      setDraft(initial);
      return;
    }
    mutation.mutate(parsed);
  };

  return (
    <div className="relative w-20" onClick={(e) => e.stopPropagation()}>
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        max={DISPLAY_ORDER_MAX}
        value={draft}
        placeholder="—"
        disabled={mutation.isPending}
        aria-label="Display priority"
        title="Storefront priority: 1 is shown first. Leave empty for default (A→Z) order."
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") setDraft(initial);
        }}
        className="h-8 text-xs text-center bg-white border-slate-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {mutation.isPending && <Loader2 className="absolute right-1.5 top-2 h-4 w-4 animate-spin text-slate-400" />}
    </div>
  );
}
