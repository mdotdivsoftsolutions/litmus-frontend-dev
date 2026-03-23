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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Settings2, Edit, Trash2, Filter } from "lucide-react";
import { products, tests, categories } from "@/lib/placeholder-data";

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<typeof products[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2 bg-primary hover:bg-primary-deep"><Plus className="h-4 w-4" />Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label className="text-sm font-medium">Product Name</Label><Input placeholder="Full Cream Milk" /></div>
              <div className="space-y-2"><Label className="text-sm font-medium">Category</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-sm font-medium">Description</Label><Textarea placeholder="Product description" /></div>
              <div className="space-y-2"><Label className="text-sm font-medium">FSSAI Standard Reference</Label><Input placeholder="IS:XXXX" /></div>
              <div className="flex items-center justify-between"><Label className="text-sm font-medium">Active</Label><Switch defaultChecked /></div>
              <Button className="w-full bg-primary hover:bg-primary-deep">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}><Filter className="h-4 w-4" />Filters</Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Products</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Category</label>
                <Select><SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label>
                <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary-deep">Apply</Button>
                <Button variant="outline" className="flex-1">Clear</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border border-border shadow-sm overflow-auto">
        <Table>
          <TableHeader><TableRow className="bg-muted/50"><TableHead>Product Name</TableHead><TableHead>Category</TableHead><TableHead>Tests</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                <TableCell>{p.testCount} tests</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Edit className="h-3.5 w-3.5" />Edit</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Edit Product — {p.name}</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2"><Label className="text-sm font-medium">Product Name</Label><Input defaultValue={p.name} /></div>
                          <div className="space-y-2"><Label className="text-sm font-medium">Category</Label>
                            <Select defaultValue={p.category}><SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2"><Label className="text-sm font-medium">Description</Label><Textarea placeholder="Product description" /></div>
                          <div className="flex items-center justify-between"><Label className="text-sm font-medium">Active</Label><Switch defaultChecked={p.status === "Active"} /></div>
                          <Button className="w-full bg-primary hover:bg-primary-deep">Update Product</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Sheet>
                      <SheetTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Settings2 className="h-3.5 w-3.5" />Tests</Button></SheetTrigger>
                      <SheetContent className="overflow-y-auto">
                        <SheetHeader><SheetTitle>Manage Tests — {p.name}</SheetTitle></SheetHeader>
                        <div className="mt-4 space-y-2">
                          {tests.map((t) => (
                            <label key={t.id} className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                              <input type="checkbox" defaultChecked={Math.random() > 0.5} className="rounded accent-primary" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{t.name}</p>
                                <p className="text-xs text-muted-foreground">FSSAI {t.method} · {t.type}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button variant="ghost" size="sm" className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />Delete</Button>
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
