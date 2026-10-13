import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, CheckCircle2, Loader2, Mail, Phone, Search, UserPlus, X } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateUserDrawer } from "@/pages/admin/CreateUserDrawer";
import { cn } from "@/lib/utils";
import type { AssistedBookingState } from "./useAssistedBooking";
import type { Customer } from "./types";

const fullName = (c: Customer) => `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Unnamed customer";

export function StepCustomer({ state }: { state: AssistedBookingState }) {
  const { customer, selectCustomer } = state;
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isFetching } = useQuery({
    queryKey: ["assistedBookingCustomers", debounced],
    queryFn: () => adminApi.getUsers({ search: debounced, limit: 8, page: 1 }),
    enabled: debounced.length >= 2,
  });
  const results: Customer[] = data?.data || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Who is this booking for?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Search an existing customer by name, email or phone. If they are new, create their account first — they log in
          with that email to track the order and download reports.
        </p>
      </div>

      {customer ? (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-start gap-3 min-w-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 space-y-1">
              <p className="font-bold text-slate-900 truncate">{fullName(customer)}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 truncate"><Mail className="h-3 w-3" />{customer.email || "—"}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone className="h-3 w-3" />{customer.phone || "—"}</p>
              {customer.companyName && (
                <p className="text-xs text-slate-600 flex items-center gap-1.5"><Building2 className="h-3 w-3" />{customer.companyName}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-slate-600" onClick={() => selectCustomer(null)}>
            <X className="h-3.5 w-3.5" /> Change
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search customer by name, email or phone..."
                className="pl-9 h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
            </div>
            <Button variant="outline" className="gap-2 h-10" onClick={() => setCreateOpen(true)}>
              <UserPlus className="h-4 w-4" /> Create New Customer
            </Button>
          </div>

          {debounced.length >= 2 && !isFetching && results.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center space-y-3">
              <p className="text-sm text-slate-600">No customer found for "{debounced}".</p>
              <Button className="gap-2" onClick={() => setCreateOpen(true)}>
                <UserPlus className="h-4 w-4" /> Create New Customer
              </Button>
            </div>
          )}

          {results.length > 0 && (
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {results.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => selectCustomer(c)}
                  className={cn("w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3")}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {fullName(c)}
                      {c.companyName && <span className="font-normal text-slate-500"> · {c.companyName}</span>}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{c.email} · {c.phone}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">Select</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <CreateUserDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(u) => selectCustomer({ ...u, _id: u.id })}
      />
    </div>
  );
}
