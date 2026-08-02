import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Info, TestTubes, Package } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminApprovals() {
  const [rejectingItem, setRejectingItem] = useState<{ id: string, type: 'test' | 'package' } | null>(null);
  
  const queryClient = useQueryClient();

  const { data: approvalsData, isLoading } = useQuery({
    queryKey: ["adminApprovals"],
    queryFn: adminApi.getPendingApprovals,
  });

  const pendingTests = approvalsData?.data?.tests || [];
  const pendingPackages = approvalsData?.data?.packages || [];

  const approveTestMutation = useMutation({
    mutationFn: adminApi.approveTest,
    onSuccess: () => {
      toast.success("Test approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminApprovals"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to approve test")
  });

  const rejectTestMutation = useMutation({
    mutationFn: (data: { id: string, reason: string }) => adminApi.rejectTest(data.id, data.reason),
    onSuccess: () => {
      toast.success("Test rejected");
      queryClient.invalidateQueries({ queryKey: ["adminApprovals"] });
      setRejectingItem(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to reject test")
  });

  const approvePackageMutation = useMutation({
    mutationFn: adminApi.approvePackage,
    onSuccess: () => {
      toast.success("Package approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminApprovals"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to approve package")
  });

  const rejectPackageMutation = useMutation({
    mutationFn: (data: { id: string, reason: string }) => adminApi.rejectPackage(data.id, data.reason),
    onSuccess: () => {
      toast.success("Package rejected");
      queryClient.invalidateQueries({ queryKey: ["adminApprovals"] });
      setRejectingItem(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to reject package")
  });

  const handleReject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;

    if (!rejectingItem) return;

    if (rejectingItem.type === 'test') {
      rejectTestMutation.mutate({ id: rejectingItem.id, reason });
    } else {
      rejectPackageMutation.mutate({ id: rejectingItem.id, reason });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tests" className="gap-2">
            <TestTubes className="h-4 w-4" /> Tests ({pendingTests.length})
          </TabsTrigger>
          <TabsTrigger value="packages" className="gap-2">
            <Package className="h-4 w-4" /> Packages ({pendingPackages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <Card className="border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Test Name</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Offer Price (₹)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : pendingTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle className="h-8 w-8 text-emerald-500/50" />
                          <span>All caught up! No pending tests.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pendingTests.map((t: any) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium">{t.testName}</TableCell>
                      <TableCell>{t.labId?.labName || 'Unknown Lab'}</TableCell>
                      <TableCell className="font-medium">₹{t.price?.toLocaleString() || 0}</TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        {t.offerPrice ? `₹${t.offerPrice.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10"
                                  onClick={() => setRejectingItem({ id: t._id, type: 'test' })}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => approveTestMutation.mutate(t._id)}
                                  disabled={approveTestMutation.isPending}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card className="border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Package Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Original (₹)</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : pendingPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CheckCircle className="h-8 w-8 text-emerald-500/50" />
                          <span>All caught up! No pending packages.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : pendingPackages.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{p.category}</Badge></TableCell>
                      <TableCell className="font-medium text-slate-400 line-through">₹{p.mrp?.toLocaleString() || 0}</TableCell>
                      <TableCell className="font-medium text-emerald-600">₹{p.price?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10"
                                  onClick={() => setRejectingItem({ id: p._id, type: 'package' })}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => approvePackageMutation.mutate(p._id)}
                                  disabled={approvePackageMutation.isPending}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {rejectingItem?.type === 'test' ? 'Test' : 'Package'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea 
                id="reason" 
                name="reason" 
                placeholder="Please explain why this is being rejected..." 
                rows={4} 
                required 
              />
            </div>
            <div className="pt-4 border-t border-border mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRejectingItem(null)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={rejectTestMutation.isPending || rejectPackageMutation.isPending}>
                Reject
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
