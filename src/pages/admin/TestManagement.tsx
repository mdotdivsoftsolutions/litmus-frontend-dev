import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { tests } from "@/lib/placeholder-data";

export default function TestManagement() {
  const [search, setSearch] = useState("");
  const filtered = tests.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Test Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Test</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Test</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Test Name</Label><Input placeholder="Fat Content Analysis" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>FSSAI Method</Label><Input placeholder="IS:1479" /></div>
                <div className="space-y-2"><Label>Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="chemical">Chemical</SelectItem>
                      <SelectItem value="microbiological">Microbiological</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Test description" /></div>
              <div className="space-y-2">
                <Label>Parameters</Label>
                <div className="space-y-2 rounded-lg border p-3">
                  {["Parameter 1"].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2">
                      <Input placeholder="Name" /><Input placeholder="Unit" /><Input placeholder="Min" /><Input placeholder="Max" />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">+ Add Parameter</Button>
                </div>
              </div>
              <Button>Save Test</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tests..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Test Name</TableHead><TableHead>Method</TableHead><TableHead>Type</TableHead><TableHead>Parameters</TableHead><TableHead>Used In</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-sm">FSSAI {t.method}</TableCell>
                <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                <TableCell>{t.parameters}</TableCell>
                <TableCell>{t.usedIn} products</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm">Edit</Button><Button variant="ghost" size="sm" className="text-destructive">Delete</Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
