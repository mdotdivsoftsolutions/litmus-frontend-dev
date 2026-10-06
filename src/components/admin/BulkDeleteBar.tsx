import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

/** Mirrors BULK_ACTION_LIMIT in the backend constants. */
export const BULK_ACTION_LIMIT = 500;

interface BulkDeleteBarProps {
  selectedIds: string[];
  onClear: () => void;
  /** Plural label used in messages, e.g. "labs". */
  entityLabel: string;
  deleteFn: (ids: string[]) => Promise<unknown>;
  /** Query keys to refresh after deletion. */
  invalidateKeys: string[];
  confirmDescription?: string;
}

/** Floating action bar + confirmation for deleting the selected table rows. */
export function BulkDeleteBar({
  selectedIds,
  onClear,
  entityLabel,
  deleteFn,
  invalidateKeys,
  confirmDescription,
}: BulkDeleteBarProps) {
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const count = selectedIds.length;

  const mutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success(`${count} ${entityLabel} deleted successfully`);
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      onClear();
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || `Failed to delete selected ${entityLabel}`);
      setIsConfirmOpen(false);
    },
  });

  if (count === 0) return null;

  const overLimit = count > BULK_ACTION_LIMIT;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700 text-xs font-semibold">
          <span className="flex h-6 min-w-6 px-1 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
            {count}
          </span>
          <span>selected</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
        >
          Deselect All
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={overLimit}
          title={overLimit ? `Select at most ${BULK_ACTION_LIMIT} items at a time` : undefined}
          onClick={() => setIsConfirmOpen(true)}
          className="h-8 text-xs font-medium gap-1.5 bg-red-600 hover:bg-red-700 text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Selected
        </Button>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={`Delete ${count} ${entityLabel}?`}
        description={
          confirmDescription || `Are you sure you want to delete the ${count} selected ${entityLabel}? This cannot be undone from the admin panel.`
        }
        confirmText="Delete Selected"
        variant="destructive"
        loading={mutation.isPending}
        onConfirm={() => mutation.mutate(selectedIds)}
      />
    </>
  );
}
