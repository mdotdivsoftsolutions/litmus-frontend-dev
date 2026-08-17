import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, MapPin } from "lucide-react";
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

  const updateMutation = useMutation({
    mutationFn: (pickupCities: string[]) => settingsApi.updateSettings({ pickupCities }),
    onSuccess: () => {
      toast.success("Pickup coverage updated");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
      setNewCity("");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to update pickup cities"),
  });

  const addCity = () => {
    const city = newCity.trim();
    if (!city) return;
    const exists = cities.some((c) => c.toLowerCase() === city.toLowerCase());
    if (exists) {
      toast.error("City already in the list");
      return;
    }
    updateMutation.mutate([...cities, city]);
  };

  const removeCity = (city: string) => {
    const next = cities.filter((c) => c !== city);
    if (next.length === 0) {
      toast.error("Keep at least one pickup city");
      return;
    }
    updateMutation.mutate(next);
  };

  return (
    <div className="space-y-4">
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
        <Button onClick={addCity} disabled={updateMutation.isPending || !newCity.trim()} className="bg-primary hover:bg-primary-deep shrink-0">
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
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
                        disabled={updateMutation.isPending}
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
