import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BadgePercent, Loader2 } from "lucide-react";
import { settingsApi } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Cap on the Litmus special discount admins can give when booking for a customer. */
export function SpecialDiscountSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["adminPlatformSettings"], queryFn: settingsApi.getSettings });
  const saved: number = data?.data?.maxSpecialDiscountPercent ?? 100;
  const [value, setValue] = useState(String(saved));

  useEffect(() => setValue(String(saved)), [saved]);

  const mutation = useMutation({
    mutationFn: (maxSpecialDiscountPercent: number) => settingsApi.updateSettings({ maxSpecialDiscountPercent }),
    onSuccess: () => {
      toast.success("Special discount limit updated");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to update discount limit"),
  });

  const save = () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 100) return toast.error("Enter a percentage between 0 and 100");
    mutation.mutate(n);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-xl">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <BadgePercent className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Litmus Special Discount Limit</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Highest special discount staff can give when creating a booking for a customer, as a percentage of the
            booking subtotal. Applies to both flat (₹) and percentage discounts. Set 100 for no limit.
          </p>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="space-y-1.5 w-40">
          <Label htmlFor="max-special-discount" className="text-xs font-semibold">Maximum discount (%)</Label>
          <Input
            id="max-special-discount"
            type="number"
            min={0}
            max={100}
            value={value}
            disabled={isLoading}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button onClick={save} disabled={mutation.isPending || isLoading || Number(value) === saved}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save
        </Button>
      </div>
    </div>
  );
}
