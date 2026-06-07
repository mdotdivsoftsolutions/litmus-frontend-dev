import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Edit, Eye, Filter } from "lucide-react";
import { adminApi } from "@/lib/api/admin";

export default function LabManagement() {
  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: labsData, isLoading } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });

  const labs = labsData?.data || [];
  const filtered = labs.filter((l: any) => !search || l.labName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Laboratory Management</h1>
        <Button className="gap-2 bg-primary hover:bg-primary-deep" asChild>
          <Link to="/admin/laboratories/new"><Plus className="h-4 w-4" />Add New Lab</Link>
        </Button>
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
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Loading laboratories...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No laboratories found.</TableCell></TableRow>
            ) : filtered.map((lab: any) => (
              <TableRow key={lab._id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{lab.labName}</TableCell>
                <TableCell>{lab.location?.city || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {lab.isNablAccredited ? <Badge variant="nabl" className="bg-green-700 hover:bg-green-800 text-white border-transparent">NABL</Badge> : "—"}
                    {lab.isFssaiApproved ? <Badge variant="fssai" className="bg-emerald-700 hover:bg-emerald-800 text-white border-transparent">FSSAI</Badge> : null}
                  </div>
                </TableCell>
                <TableCell>{lab.tests?.length || "—"}</TableCell>
                <TableCell>{"—"}</TableCell>
                <TableCell>{"—"}</TableCell>
                <TableCell><Switch checked={lab.isActive} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedLab(lab)}><Eye className="h-3.5 w-3.5" />View</Button>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link to={`/admin/laboratories/${lab._id}/edit`}><Edit className="h-3.5 w-3.5" />Edit</Link>
                    </Button>
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
              <SheetHeader><SheetTitle>{selectedLab.labName}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex gap-2">
                  {selectedLab.isNablAccredited && <Badge variant="nabl" className="bg-green-700 hover:bg-green-800 text-white border-transparent">NABL Accredited</Badge>}
                  {selectedLab.isFssaiApproved && <Badge variant="fssai" className="bg-emerald-700 hover:bg-emerald-800 text-white border-transparent">FSSAI Approved</Badge>}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">City</p>
                    <p className="font-medium">{selectedLab.location?.city || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Rating</p>
                    <p className="font-medium flex items-center">
                      4.8 <span className="text-yellow-500 ml-1">★</span>
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Tests Available</p>
                    <p className="font-medium">{selectedLab.tests?.length || 0}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Active Bookings</p>
                    <p className="font-medium">34</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Revenue</p>
                    <p className="font-medium">₹485,000</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Starting Price</p>
                    <p className="font-medium">
                      ₹{selectedLab.tests && selectedLab.tests.length > 0 
                        ? Math.min(...selectedLab.tests.map((t: any) => t.price)) 
                        : "0"}
                    </p>
                  </div>
                </div>

                {selectedLab.tests && selectedLab.tests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold mb-3">Available Tests</h4>
                    <div className="space-y-2">
                      {selectedLab.tests.map((test: any) => (
                        <div key={test._id} className="flex items-center justify-between py-3 border-b border-border/50 text-sm">
                          <span className="text-slate-700">{test.testName}</span>
                          <span className="text-slate-500">₹{test.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Email</p><p className="font-medium break-all">{selectedLab.contactEmail || "—"}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{selectedLab.contactPhone || "—"}</p></div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
