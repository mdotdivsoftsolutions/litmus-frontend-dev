import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { catalogOrderApi, CatalogEntity, DISPLAY_ORDER_MAX } from "@/lib/api/catalogOrder";
import { cn } from "@/lib/utils";

interface DisplayOrderCellProps {
  entity: CatalogEntity;
  id: string;
  value?: number | null;
  /** Query keys to refresh once the priority is saved. */
  invalidateKeys: string[];
}

/**
 * Compact storefront-priority badge (1 = shown first). Click to edit inline;
 * saves on Enter / blur, Esc cancels, and an empty value clears the priority.
 */
export function DisplayOrderCell({ entity, id, value, invalidateKeys }: DisplayOrderCellProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = value ? String(value) : "";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initial);

  useEffect(() => setDraft(initial), [initial]);
  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

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
    setIsEditing(false);
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

  if (mutation.isPending) {
    return (
      <span className="inline-flex h-7 w-12 items-center justify-center">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
      </span>
    );
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={draft}
        placeholder="—"
        aria-label="Display priority"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(initial);
            setIsEditing(false);
          }
        }}
        className="h-7 w-12 rounded-md border border-primary bg-white text-center text-xs font-bold text-slate-900 outline-none ring-2 ring-primary/20"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title={value ? `Priority ${value} — click to change` : "No priority (default order) — click to set"}
      className={cn(
        "group inline-flex h-7 min-w-[48px] items-center justify-center gap-1 rounded-md px-2 text-xs font-bold transition-colors",
        value
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "border border-dashed border-slate-300 text-slate-400 hover:border-primary/60 hover:text-primary"
      )}
    >
      {value ? `#${value}` : "Set"}
      <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
    </button>
  );
}
