import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotConvertedDialogProps {
  open: boolean;
  name?: string;
  initialReason?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

/** Asks for the reason a consultation lead did not convert before saving the status. */
export function NotConvertedDialog({ open, name, initialReason, loading, onOpenChange, onSubmit }: NotConvertedDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason(initialReason || "");
  }, [open, initialReason]);

  const trimmed = reason.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Mark as Not Converted</DialogTitle>
          <DialogDescription>
            {name ? `Why did ${name} not convert?` : "Why did this lead not convert?"} This is kept for internal follow-up.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="non-conversion-reason" className="text-xs font-semibold">
            Reason for non-conversion *
          </Label>
          <Textarea
            id="non-conversion-reason"
            rows={4}
            maxLength={1000}
            autoFocus
            placeholder="e.g. Budget too high, chose another lab, only wanted a price quote…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground text-right">{reason.length}/1000</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!trimmed || loading} onClick={() => onSubmit(trimmed)}>
            {loading && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            Save as Not Converted
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
