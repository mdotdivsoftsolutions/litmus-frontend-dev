import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, Edit, Eye, Filter, MoreVertical, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;
import { adminApi } from "@/lib/api/admin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function LabManagement() {
  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);
  const [labToToggle, setLabToToggle] = useState<{lab: any, targetState: boolean} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteLab(id),
    onSuccess: () => {
      toast.success("Laboratory deleted successfully");
      setLabToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
    },
    onError: () => {
      toast.error("Failed to delete laboratory");
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.updateLab(id, { isActive }),
    onSuccess: () => {
      toast.success("Laboratory visibility updated");
      setLabToToggle(null);
      queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
    },
    onError: () => {
      toast.error("Failed to update laboratory visibility");
    }
  });
  
  const { data: labsData, isLoading } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: adminApi.getBookings,
  });

  const labs = labsData?.data || [];
  const allBookings = bookingsData?.data || [];
  const filtered = labs.filter((l: any) => !search || l.labName?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedLabs = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <Input 
            placeholder="Search labs..." 
            className="pl-9" 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-12 rounded-full" /><Skeleton className="h-5 w-12 rounded-full" /></div></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">No laboratories found.</TableCell></TableRow>
            ) : paginatedLabs.map((lab: any) => {
              const labBookings = allBookings.filter((b: any) => b.labId?._id === lab._id || b.labId === lab._id || b.laboratory?._id === lab._id || b.laboratory === lab._id);
              const totalRevenue = labBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
              
              return (
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
                <TableCell>{labBookings.length > 0 ? labBookings.length : "—"}</TableCell>
                <TableCell>{totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : "—"}</TableCell>
                <TableCell>
                  <Switch 
                    checked={lab.isActive} 
                    onCheckedChange={(checked) => setLabToToggle({ lab, targetState: checked })} 
                    disabled={toggleStatusMutation.isPending} 
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLab(lab)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/laboratories/${lab._id}/edit`} className="w-full flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Lab</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setLabToDelete(lab._id)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </Card>

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between border border-border px-4 py-3 bg-muted/20 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> laboratories
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2">
              Page {currentPage} of {Math.max(1, totalPages)}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => setCurrentPage((p) => Math.min(Math.max(1, totalPages), p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lab Detail Sheet */}
      <Sheet open={!!selectedLab} onOpenChange={(open) => !open && setSelectedLab(null)}>
        <SheetContent className="flex flex-col sm:max-w-md">
          {selectedLab && (
            <>
              <SheetHeader className="shrink-0">
                <SheetTitle className="text-xl">Laboratory Details</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
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
                      {selectedLab.reviews && selectedLab.reviews.length > 0 
                        ? (selectedLab.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / selectedLab.reviews.length).toFixed(1) 
                        : "New"} 
                      <span className="text-yellow-500 ml-1">★</span>
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Tests Available</p>
                    <p className="font-medium">{selectedLab.tests?.length || 0}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Tests Conducted</p>
                    <p className="font-medium">{selectedLab.testsConducted !== undefined ? `${selectedLab.testsConducted}+` : "0+"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-background shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">Starting Price</p>
                    <p className="font-medium">
                      {selectedLab.tests && selectedLab.tests.length > 0 
                        ? `₹${Math.min(...selectedLab.tests.map((t: any) => {
                            const specificTestPricing = selectedLab.pricing?.[t._id] || selectedLab.pricing?.testOverrides?.[t._id];
                            
                            let calculatedPrice = 0;
                            if (specificTestPricing && typeof specificTestPricing === 'object') {
                              t.metadata?.parameters?.forEach((p: any) => {
                                if (specificTestPricing[p.name] !== undefined) {
                                  calculatedPrice += Number(specificTestPricing[p.name]);
                                } else {
                                  calculatedPrice += (Number(p.price) || 0);
                                }
                              });
                              if (calculatedPrice === 0) calculatedPrice = t.offerPrice || t.price;
                            } else if (typeof specificTestPricing === 'number') {
                              calculatedPrice = specificTestPricing;
                            } else {
                              calculatedPrice = t.offerPrice || t.price;
                            }

                            return calculatedPrice;
                          }))}` 
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {selectedLab.tests && selectedLab.tests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold mb-3">Available Tests</h4>
                    <div className="space-y-2">
                      {selectedLab.tests.map((test: any) => {
                        const specificTestPricing = selectedLab.pricing?.[test._id] || selectedLab.pricing?.testOverrides?.[test._id];
                        console.log("LabManagement specificTestPricing:", specificTestPricing);
                        console.log("LabManagement test.metadata.parameters:", test.metadata?.parameters);
                        
                        let displayPrice = 0;
                        if (specificTestPricing && typeof specificTestPricing === 'object') {
                          test.metadata?.parameters?.forEach((p: any) => {
                            if (specificTestPricing[p.name] !== undefined) {
                              displayPrice += Number(specificTestPricing[p.name]);
                            } else {
                              displayPrice += (Number(p.price) || 0);
                            }
                          });
                          if (displayPrice === 0) displayPrice = test.offerPrice || test.price;
                        } else if (typeof specificTestPricing === 'number') {
                          displayPrice = specificTestPricing;
                        } else {
                          displayPrice = test.offerPrice || test.price;
                        }

                        return (
                          <div key={test._id} className="flex items-center justify-between py-3 border-b border-border/50 text-sm">
                            <span className="text-slate-700">{test.testName}</span>
                            <span className="text-slate-500">₹{displayPrice?.toLocaleString('en-IN') || "N/A"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm pt-2">
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Email</p><p className="font-medium break-all">{selectedLab.contactEmail || "—"}</p></div>
                  <div className="rounded-lg border border-border p-3"><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{selectedLab.contactPhone || "—"}</p></div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-auto shrink-0 bg-background">
                <Button className="w-full bg-primary hover:bg-primary-deep shadow-md" asChild>
                  <Link to={`/admin/laboratories/${selectedLab._id}`}>View Full Profile</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog 
        open={!!labToDelete}
        onOpenChange={(open) => !open && setLabToDelete(null)}
        title="Delete Laboratory"
        description="Are you sure you want to delete this laboratory? Past bookings will still retain the lab details (soft delete)."
        onConfirm={() => labToDelete && deleteMutation.mutate(labToDelete)}
        confirmText="Delete"
        variant="destructive"
      />

      <ConfirmDialog 
        open={!!labToToggle}
        onOpenChange={(open) => !open && setLabToToggle(null)}
        title={labToToggle?.targetState ? "Enable Public Visibility" : "Disable Public Visibility"}
        description={labToToggle?.targetState 
          ? `Are you sure you want to make ${labToToggle?.lab.labName} visible to the public? Users will be able to search and book tests for this laboratory.`
          : `Are you sure you want to hide ${labToToggle?.lab.labName} from the public? Users will no longer be able to find or book new tests for this laboratory.`
        }
        onConfirm={() => labToToggle && toggleStatusMutation.mutate({ id: labToToggle.lab._id, isActive: labToToggle.targetState })}
        confirmText={labToToggle?.targetState ? "Make Visible" : "Hide Laboratory"}
        variant={labToToggle?.targetState ? "default" : "destructive"}
      />
    </div>
  );
}
