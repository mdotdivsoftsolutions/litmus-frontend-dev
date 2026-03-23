import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Edit, Eye, Filter } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const modalSteps = ["Basic Info", "Accreditation", "Select Tests", "Set Pricing"];

export default function LabManagement() {
  const [search, setSearch] = useState("");
  const [modalStep, setModalStep] = useState(0);
  const [selectedLab, setSelectedLab] = useState<typeof laboratories[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filtered = laboratories.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Laboratory Management</h1>
        <Dialog onOpenChange={() => setModalStep(0)}>
          <DialogTrigger asChild><Button className="gap-2 bg-primary hover:bg-primary-deep"><Plus className="h-4 w-4" />Add New Lab</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Laboratory</DialogTitle></DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              {modalSteps.map((label, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold", i < modalStep ? "bg-litmus-emerald text-white" : i === modalStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {i < modalStep ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </div>
                  {i < modalSteps.length - 1 && <div className={cn("mx-1 h-0.5 flex-1 rounded-full", i < modalStep ? "bg-litmus-emerald" : "bg-muted")} />}
                </div>
              ))}
            </div>
            {modalStep === 0 && (
              <div className="space-y-3">
                <div className="space-y-2"><Label className="text-sm font-medium">Lab Name</Label><Input placeholder="Chennai Food Testing Lab" /></div>
                <div className="space-y-2"><Label className="text-sm font-medium">Address</Label><Input placeholder="123, Lab Street" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-sm font-medium">Contact</Label><Input placeholder="+91 44 2345 6789" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">Email</Label><Input placeholder="lab@email.com" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label className="text-sm font-medium">City</Label><Input placeholder="Chennai" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">State</Label><Input placeholder="Tamil Nadu" /></div>
                </div>
              </div>
            )}
            {modalStep === 1 && (
              <div className="space-y-3">
                <div className="space-y-2"><Label className="text-sm font-medium">NABL Number</Label><Input placeholder="TC-XXXX" /></div>
                <div className="space-y-2"><Label className="text-sm font-medium">NABL Expiry Date</Label><Input type="date" /></div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3"><Label className="text-sm font-medium">FSSAI Approved</Label><Switch /></div>
              </div>
            )}
            {modalStep === 2 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {["Fat Content Analysis", "Total Plate Count", "Moisture Content", "Acid Value", "Coliform Count", "Protein Content", "Lead Content", "Aflatoxin B1"].map((t) => (
                  <label key={t} className="flex items-center gap-2 rounded-lg border border-border p-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input type="checkbox" className="rounded accent-primary" />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            )}
            {modalStep === 3 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {["Fat Content Analysis", "Total Plate Count", "Moisture Content"].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                    <span className="text-sm flex-1">{t}</span>
                    <Input className="w-24 text-sm" placeholder="₹ Price" />
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {modalStep > 0 && <Button variant="outline" onClick={() => setModalStep(modalStep - 1)}>Back</Button>}
              {modalStep < 3 ? (
                <Button className="bg-primary hover:bg-primary-deep" onClick={() => setModalStep(modalStep + 1)}>Next</Button>
              ) : (
                <Button className="bg-primary hover:bg-primary-deep">Save Lab</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search labs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}><Filter className="h-4 w-4" />Filters</Button>
          <SheetContent>
            <SheetHeader><SheetTitle>Filter Laboratories</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">City</label><Input placeholder="Filter by city..." /></div>
              <div className="space-y-2 flex items-center justify-between"><label className="text-sm font-medium">NABL Accredited Only</label><Switch /></div>
              <div className="space-y-2 flex items-center justify-between"><label className="text-sm font-medium">FSSAI Approved Only</label><Switch /></div>
              <div className="flex gap-2 pt-4"><Button className="flex-1 bg-primary hover:bg-primary-deep">Apply</Button><Button variant="outline" className="flex-1">Clear</Button></div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border border-border shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
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
              <TableRow key={lab.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{lab.name}</TableCell>
                <TableCell>{lab.city}</TableCell>
                <TableCell><div className="flex gap-1">{lab.nabl && <Badge variant="nabl">NABL</Badge>}{lab.fssai && <Badge variant="fssai">FSSAI</Badge>}</div></TableCell>
                <TableCell>{lab.testsCount}</TableCell>
                <TableCell>{lab.activeBookings}</TableCell>
                <TableCell className="font-medium">₹{(lab.revenue / 1000).toFixed(0)}K</TableCell>
                <TableCell><Switch defaultChecked /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedLab(lab)}><Eye className="h-3.5 w-3.5" />View</Button>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Edit className="h-3.5 w-3.5" />Edit</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Edit — {lab.name}</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2"><Label className="text-sm font-medium">Lab Name</Label><Input defaultValue={lab.name} /></div>
                          <div className="space-y-2"><Label className="text-sm font-medium">City</Label><Input defaultValue={lab.city} /></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2"><Label className="text-sm font-medium">Contact</Label><Input placeholder="+91..." /></div>
                            <div className="space-y-2"><Label className="text-sm font-medium">Email</Label><Input placeholder="lab@email.com" /></div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-border p-3"><Label className="text-sm font-medium">NABL Accredited</Label><Switch defaultChecked={lab.nabl} /></div>
                          <div className="flex items-center justify-between rounded-lg border border-border p-3"><Label className="text-sm font-medium">FSSAI Approved</Label><Switch defaultChecked={lab.fssai} /></div>
                          <Button className="w-full bg-primary hover:bg-primary-deep">Update Lab</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Lab Detail Sheet */}
      <Sheet open={!!selectedLab} onOpenChange={(open) => !open && setSelectedLab(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedLab && (
            <>
              <SheetHeader><SheetTitle>{selectedLab.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex gap-2">{selectedLab.nabl && <Badge variant="nabl">NABL Accredited</Badge>}{selectedLab.fssai && <Badge variant="fssai">FSSAI Approved</Badge>}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">City</p><p className="font-medium">{selectedLab.city}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Rating</p><p className="font-medium">{selectedLab.rating} ⭐</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Tests Available</p><p className="font-medium">{selectedLab.testsCount}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Active Bookings</p><p className="font-medium">{selectedLab.activeBookings}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Revenue</p><p className="font-medium">₹{selectedLab.revenue.toLocaleString()}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Starting Price</p><p className="font-medium">₹{selectedLab.priceFrom}</p></div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold mb-3">Available Tests</h4>
                  <div className="space-y-2 text-sm">
                    {["Fat Content Analysis", "Total Plate Count", "Moisture Content", "Acid Value", "Coliform Count"].map(t => (
                      <div key={t} className="flex items-center justify-between rounded-lg border border-border p-2.5">
                        <span>{t}</span><span className="text-muted-foreground">₹{(800 + Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
