import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, MapPin, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "@/lib/api/settings";

export function PickupCoverageSettings() {
  const queryClient = useQueryClient();
  const [newCity, setNewCity] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminPlatformSettings"],
    queryFn: settingsApi.getSettings,
  });

  const cities: string[] = data?.data?.pickupCities || [];
  const enablePickupSlotSelection: boolean = data?.data?.enablePickupSlotSelection ?? false;

  const updateCitiesMutation = useMutation({
    mutationFn: (pickupCities: string[]) => settingsApi.updateSettings({ pickupCities }),
    onSuccess: () => {
      toast.success("Pickup coverage updated");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
      setNewCity("");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to update pickup cities"),
  });

  const toggleSlotMutation = useMutation({
    mutationFn: (enablePickupSlotSelection: boolean) =>
      settingsApi.updateSettings({ enablePickupSlotSelection }),
    onSuccess: (res, vars) => {
      toast.success(
        vars
          ? "Date & Time slot selection enabled for pickup bookings"
          : "Date & Time slot selection hidden (24-48 hr notice active)"
      );
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Failed to update slot settings"),
  });

  const addCity = () => {
    const city = newCity.trim();
    if (!city) return;
    const exists = cities.some((c) => c.toLowerCase() === city.toLowerCase());
    if (exists) {
      toast.error("City already in the list");
      return;
    }
    updateCitiesMutation.mutate([...cities, city]);
  };

  const removeCity = (city: string) => {
    const next = cities.filter((c) => c !== city);
    if (next.length === 0) {
      toast.error("Keep at least one pickup city");
      return;
    }
    updateCitiesMutation.mutate(next);
  };

  return (
    <div className="space-y-6">
      {/* Pickup Slot Selection Toggle */}
      <div className="mx-6 mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <Label htmlFor="slot-toggle" className="text-sm font-bold text-slate-900 cursor-pointer">
                Pickup Date & Time Slot Selection
              </Label>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When disabled, users will not be asked to pick a date & time slot. Instead, they are informed that samples will be collected within 24 - 48 hours.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold text-slate-700">
              {enablePickupSlotSelection ? "Enabled" : "Hidden (24-48h)"}
            </span>
            <Switch
              id="slot-toggle"
              checked={enablePickupSlotSelection}
              disabled={toggleSlotMutation.isPending || isLoading}
              onCheckedChange={(checked) => toggleSlotMutation.mutate(checked)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />
      <p className="text-sm text-muted-foreground px-6 pt-4">
        Litmus pickup is offered only in these cities. Users outside this list must use courier.
      </p>
      <div className="flex gap-2 px-6">
        <Input
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="e.g. Chennai"
          onKeyDown={(e) => e.key === "Enter" && addCity()}
        />
        <Button onClick={addCity} disabled={updateCitiesMutation.isPending || !newCity.trim()} className="bg-primary hover:bg-primary-deep shrink-0">
          {updateCitiesMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          Add city
        </Button>
      </div>
      <div className="relative w-full overflow-y-auto max-h-[calc(100vh-360px)] min-h-[320px]">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No pickup cities configured.
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> {city}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeCity(city)}
                        disabled={updateCitiesMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
