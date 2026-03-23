import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Search, Settings2 } from "lucide-react";
import { products, tests } from "@/lib/placeholder-data";

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Product Name</Label><Input placeholder="Full Cream Milk" /></div>
              <div className="space-y-2"><Label>Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{["Dairy", "Beverages", "Grains", "Spices"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Product description" /></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch defaultChecked /></div>
              <Button>Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Product Name</TableHead><TableHead>Category</TableHead><TableHead>Tests</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                <TableCell>{p.testCount} tests</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Sheet>
                      <SheetTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Settings2 className="h-3.5 w-3.5" />Tests</Button></SheetTrigger>
                      <SheetContent className="overflow-y-auto">
                        <SheetHeader><SheetTitle>Manage Tests — {p.name}</SheetTitle></SheetHeader>
                        <div className="mt-4 space-y-2">
                          {tests.map((t) => (
                            <label key={t.id} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted">
                              <input type="checkbox" defaultChecked={Math.random() > 0.5} className="rounded" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.method} · {t.type}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
