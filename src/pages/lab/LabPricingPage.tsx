import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Pencil } from "lucide-react";
import { labPricing } from "@/lib/placeholder-data";

export default function LabPricingPage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Pricing Configuration</h1>
        <Dialog>
          <DialogTrigger asChild><Button variant="outline">Bulk Update</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Bulk Price Update</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Apply a percentage increase or decrease to all test prices.</p>
              <div className="flex gap-2 items-end">
                <Input placeholder="e.g. 10" className="w-24" /><span className="text-sm">%</span>
                <Button>Increase</Button><Button variant="outline">Decrease</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Test Name</TableHead><TableHead>Type</TableHead><TableHead>Price (₹)</TableHead><TableHead>Last Updated</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {labPricing.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.testName}</TableCell>
                <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                <TableCell>
                  {editingId === t.id ? (
                    <div className="flex items-center gap-1"><Input defaultValue={t.price} className="w-24 h-8" /><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}><Check className="h-3.5 w-3.5" /></Button></div>
                  ) : (
                    <span className="font-semibold">₹{t.price.toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.lastUpdated}</TableCell>
                <TableCell>{editingId !== t.id && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(t.id)}><Pencil className="h-3.5 w-3.5" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
