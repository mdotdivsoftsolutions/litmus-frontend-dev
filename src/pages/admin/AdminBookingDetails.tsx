import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Beaker, FileText, CheckCircle2, XCircle } from "lucide-react";

export default function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedLabId, setSelectedLabId] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: adminApi.getBookings,
  });

  const { data: labsResponse } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: adminApi.getLabs,
  });
  const labs = labsResponse?.data || [];

  const rawBookings = response?.data || [];
  const rawBooking = rawBookings.find((b: any) => b._id === id);

  const assignLabMutation = useMutation({
    mutationFn: ({ bookingId, labId }: { bookingId: string, labId: string }) => adminApi.assignLab(bookingId, labId),
    onSuccess: () => {
      toast.success("Laboratory assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setSelectedLabId("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to assign lab")
  });

  const rejectBookingMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string, reason: string }) => adminApi.rejectBooking(bookingId, reason),
    onSuccess: () => {
      toast.success("Booking rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      setIsRejecting(false);
      setRejectReason("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject booking")
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading booking details...</div>;
  }

  if (!rawBooking) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button onClick={() => navigate("/admin/bookings")}>Back to Bookings</Button>
      </div>
    );
  }

  const b = rawBooking;
  const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
  const user = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.collectionDetails?.name || "Unknown User";
  const lab = b.labId?.labName || "Litmus Smart Allocation";
  const amount = b.totalAmount || b.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
  const status = b.status || "PENDING";
  const paymentStatus = b.paymentStatus || "PENDING";
  const date = format(new Date(b.createdAt || new Date()), "MMM d, yyyy");
  const rawItems = b.items || [];
  const collectionDetails = b.collectionDetails || {};

  const timelineSteps = [
    { label: "Booking Placed", done: true },
    { label: "Payment Confirmed", done: paymentStatus?.toLowerCase() === "paid" },
    { label: "Admin Approved", done: status?.toLowerCase() !== "pending" },
    { label: "Lab Assigned", done: ["in progress", "completed"].includes(status?.toLowerCase() || "") },
    { label: "Testing In Progress", done: status?.toLowerCase() === "in progress" || status?.toLowerCase() === "completed" },
    { label: "Report Uploaded", done: status?.toLowerCase() === "completed" },
    { label: "Complete", done: status?.toLowerCase() === "completed" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/bookings")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking {displayId}</h1>
          <p className="text-sm text-muted-foreground">Placed on {date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Status</p>
                  <StatusBadge status={status} />
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Payment</p>
                  <StatusBadge status={paymentStatus} />
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Total Amount</p>
                  <p className="font-semibold text-lg">₹{amount.toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Assigned Lab</p>
                  <p className="font-medium">{lab}</p>
               </div>
            </div>
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Name</p>
                  <p className="font-medium">{collectionDetails?.name || user}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Phone</p>
                  <p className="font-medium">{collectionDetails?.phone || b.userId?.phone || "N/A"}</p>
               </div>
               <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Email</p>
                  <p className="font-medium">{collectionDetails?.email || b.userId?.email || "N/A"}</p>
               </div>
            </div>
            {collectionDetails?.address && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Collection Address</p>
                <p className="text-sm">
                  {collectionDetails.address}, {collectionDetails.city}, {collectionDetails.state} - {collectionDetails.pincode}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Beaker className="h-5 w-5 text-primary" /> Booking Items & Samples</h3>
            <div className="space-y-4">
              {rawItems.map((item: any, i: number) => (
                <div key={i} className="rounded-lg border border-border overflow-hidden bg-muted/10">
                  <div className="bg-muted px-4 py-3 flex justify-between items-center border-b border-border">
                      <span className="font-semibold text-sm">Item {i+1}: {item.itemType}</span>
                      <span className="font-medium text-sm">₹{item.price?.toLocaleString() || 0}</span>
                  </div>
                  <div className="p-4 space-y-4 bg-card">
                      {item.samples?.map((sample: any, j: number) => (
                        <div key={j} className="text-sm space-y-4 border-b border-border pb-4 last:border-0 last:pb-0">
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Product Info</span>
                            <p className="font-semibold text-base text-foreground">{sample.productName || "Unknown Product"}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs text-muted-foreground">
                              {sample.quantity && <span>Qty: <span className="font-medium text-slate-700">{sample.quantity}</span></span>}
                              {sample.batchNumber && <span>Batch: <span className="font-medium text-slate-700">{sample.batchNumber}</span></span>}
                              {sample.sku && <span>SKU: <span className="font-medium text-slate-700">{sample.sku}</span></span>}
                            </div>
                          </div>
                          {sample.selectedParameters && sample.selectedParameters.length > 0 && (
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-2">Parameters to Test</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {sample.selectedParameters.map((p: string, k: number) => (
                                  <Badge key={k} variant="outline" className="font-normal text-xs bg-background text-foreground shadow-sm px-2.5 py-0.5">{p}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {sample.specifics && (
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block mb-1">Specifics</span>
                              <p className="text-sm mt-1 bg-muted/30 p-3 rounded-md leading-relaxed">{sample.specifics}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!item.samples || item.samples.length === 0) && (
                        <p className="text-sm font-medium">{item.packageId?.name || item.testId?.name || "Service Item"}</p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Actions & Timeline */}
        <div className="space-y-6">
          {status?.toLowerCase() === "pending" && (
            <Card className="p-6 border border-primary/20 shadow-md bg-primary/5">
              <h3 className="text-lg font-semibold mb-4 text-primary">Admin Actions</h3>
              
              {isRejecting ? (
                <div className="space-y-4 bg-background p-4 rounded-lg border border-red-200 shadow-sm">
                  <label className="text-sm font-semibold text-red-800 dark:text-red-300">Reason for Rejection</label>
                  <Textarea 
                    placeholder="Provide a reason to the user..." 
                    className="bg-background border-red-200 focus-visible:ring-red-500 min-h-[100px]" 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      className="flex-1" 
                      onClick={() => rejectBookingMutation.mutate({ bookingId: id as string, reason: rejectReason })}
                      disabled={!rejectReason.trim() || rejectBookingMutation.isPending}
                    >
                      {rejectBookingMutation.isPending ? "Rejecting..." : "Submit Rejection"}
                    </Button>
                    <Button variant="outline" onClick={() => { setIsRejecting(false); setRejectReason(""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Assign Laboratory</label>
                    <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select lab to forward to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {labs.map((lab: any) => (
                          <SelectItem key={lab._id} value={lab._id}>{lab.labName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <Button 
                      className="w-full bg-litmus-emerald hover:bg-emerald-600 text-white shadow-sm gap-2"
                      disabled={!selectedLabId || assignLabMutation.isPending}
                      onClick={() => assignLabMutation.mutate({ bookingId: id as string, labId: selectedLabId })}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {assignLabMutation.isPending ? "Assigning..." : "Approve & Assign Lab"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2" 
                      onClick={() => setIsRejecting(true)}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Booking
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {status?.toLowerCase() === "rejected" && (
            <Card className="p-6 border border-red-200 shadow-sm bg-red-50/50 dark:bg-red-950/20">
              <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
                <XCircle className="h-5 w-5" /> Booking Rejected
              </h3>
              <p className="text-sm font-medium text-red-900 mt-4 mb-1">Reason provided:</p>
              <p className="text-sm text-red-800 bg-white dark:bg-black/20 p-3 rounded-md border border-red-100">
                {b.metadata?.rejectionReason || "No reason specified."}
              </p>
            </Card>
          )}

          <Card className="p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Booking Timeline</h3>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${step.done ? "bg-litmus-emerald border-litmus-emerald text-white" : "bg-card border-border"}`}>
                      {step.done && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    {i < timelineSteps.length - 1 && <div className={`w-0.5 flex-1 min-h-[2.5rem] my-1 ${step.done ? "bg-litmus-emerald" : "bg-border"}`} />}
                  </div>
                  <p className={`text-sm pt-0.5 pb-6 ${step.done ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{step.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
