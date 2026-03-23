import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { tests } from "@/lib/placeholder-data";

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const filtered = tests.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const TestForm = ({ defaultValues, title }: { defaultValues?: typeof tests[0]; title: string }) => (
    <>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2"><Label className="text-sm font-medium">Test Name</Label><Input placeholder="Fat Content Analysis" defaultValue={defaultValues?.name} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label className="text-sm font-medium">FSSAI Method</Label><Input placeholder="IS:1479" defaultValue={defaultValues?.method} /></div>
          <div className="space-y-2"><Label className="text-sm font-medium">Type</Label>
            <Select defaultValue={defaultValues?.type.toLowerCase()}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="chemical">Chemical</SelectItem>
                <SelectItem value="microbiological">Microbiological</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2"><Label className="text-sm font-medium">Description</Label><Textarea placeholder="Test description" /></div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Parameters</Label>
          <div className="space-y-2 rounded-lg border border-border p-3 bg-muted/30">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
              <span>Name</span><span>Unit</span><span>Min Limit</span><span>Max Limit</span>
            </div>
            {Array.from({ length: defaultValues?.parameters || 1 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <Input placeholder="Param name" className="text-sm" /><Input placeholder="Unit" className="text-sm" /><Input placeholder="Min" className="text-sm" /><Input placeholder="Max" className="text-sm" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs">+ Add Parameter Row</Button>
          </div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary-deep">{defaultValues ? "Update Test" : "Save Test"}</Button>
      </div>
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2 bg-primary hover:bg-primary-deep"><Plus className="h-4 w-4" />Add Test</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><TestForm title="Add New Test" /></DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tests..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}><Filter className="h-4 w-4" />Filters</Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Tests</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Type</label>
                <Select><SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent><SelectItem value="physical">Physical</SelectItem><SelectItem value="chemical">Chemical</SelectItem><SelectItem value="microbiological">Microbiological</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4"><Button className="flex-1 bg-primary hover:bg-primary-deep">Apply</Button><Button variant="outline" className="flex-1">Clear</Button></div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border border-border shadow-sm overflow-auto">
        <Table>
          <TableHeader><TableRow className="bg-muted/50"><TableHead>Test Name</TableHead><TableHead>Method</TableHead><TableHead>Type</TableHead><TableHead>Parameters</TableHead><TableHead>Used In</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-sm">FSSAI {t.method}</TableCell>
                <TableCell><Badge variant={t.type === "Chemical" ? "pending" : t.type === "Microbiological" ? "inprogress" : "outline"}>{t.type}</Badge></TableCell>
                <TableCell>{t.parameters}</TableCell>
                <TableCell>{t.usedIn} products</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Edit className="h-3.5 w-3.5" />Edit</Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><TestForm title={`Edit Test — ${t.name}`} defaultValues={t} /></DialogContent>
                    </Dialog>
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
