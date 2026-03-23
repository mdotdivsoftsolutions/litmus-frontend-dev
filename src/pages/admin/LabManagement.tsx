import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const modalSteps = ["Basic Info", "Accreditation", "Select Tests", "Set Pricing"];

export default function LabManagement() {
  const [search, setSearch] = useState("");
  const [modalStep, setModalStep] = useState(0);
  const filtered = laboratories.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Laboratory Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add New Lab</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Laboratory</DialogTitle></DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              {modalSteps.map((label, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold", i <= modalStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {i < modalStep ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </div>
                  {i < modalSteps.length - 1 && <div className={cn("mx-1 h-0.5 flex-1", i < modalStep ? "bg-primary" : "bg-muted")} />}
                </div>
              ))}
            </div>
            {modalStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-2"><Label>Lab Name</Label><Input placeholder="Chennai Food Testing Lab" /></div>
                <div className="space-y-2"><Label>Address</Label><Input placeholder="123, Lab Street" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Contact</Label><Input placeholder="+91 44 2345 6789" /></div>
                  <div className="space-y-2"><Label>Email</Label><Input placeholder="lab@email.com" /></div>
                </div>
              </div>
            )}
            {modalStep === 1 && (
              <div className="space-y-3">
                <div className="space-y-2"><Label>NABL Number</Label><Input placeholder="TC-XXXX" /></div>
                <div className="space-y-2"><Label>NABL Expiry Date</Label><Input type="date" /></div>
                <div className="flex items-center justify-between"><Label>FSSAI Approved</Label><Switch /></div>
              </div>
            )}
            {modalStep === 2 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {["Fat Content Analysis", "Total Plate Count", "Moisture Content", "Acid Value", "Coliform Count", "Protein Content", "Lead Content", "Aflatoxin B1"].map((t) => (
                  <label key={t} className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-muted">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            )}
            {modalStep === 3 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {["Fat Content Analysis", "Total Plate Count", "Moisture Content"].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-lg border p-2">
                    <span className="text-sm flex-1">{t}</span>
                    <Input className="w-24" placeholder="₹ Price" />
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {modalStep > 0 && <Button variant="outline" onClick={() => setModalStep(modalStep - 1)}>Back</Button>}
              {modalStep < 3 ? (
                <Button onClick={() => setModalStep(modalStep + 1)}>Next</Button>
              ) : (
                <Button>Save Lab</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search labs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lab Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Accreditation</TableHead>
              <TableHead>Tests</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lab) => (
              <TableRow key={lab.id}>
                <TableCell className="font-medium">{lab.name}</TableCell>
                <TableCell>{lab.city}</TableCell>
                <TableCell><div className="flex gap-1">{lab.nabl && <Badge variant="approved">NABL</Badge>}{lab.fssai && <Badge variant="completed">FSSAI</Badge>}</div></TableCell>
                <TableCell>{lab.testsCount}</TableCell>
                <TableCell>{lab.activeBookings}</TableCell>
                <TableCell>₹{(lab.revenue / 1000).toFixed(0)}K</TableCell>
                <TableCell><Switch defaultChecked /></TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
