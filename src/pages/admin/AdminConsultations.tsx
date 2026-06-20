import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { consultationApi } from "@/lib/api/consultation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, CheckCircle, Mail, Phone, Calendar as CalendarIcon, User, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function AdminConsultations() {
  const queryClient = useQueryClient();
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminConsultations"],
    queryFn: consultationApi.getConsultations,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => consultationApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Consultation status updated.");
      queryClient.invalidateQueries({ queryKey: ["adminConsultations"] });
    },
    onError: () => {
      toast.error("Failed to update status.");
    },
  });

  const consultations = data?.data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>;
      case "Contacted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Contacted</Badge>;
      case "Resolved":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Consultation Requests</h1>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24 bg-muted/60" />
                      <Skeleton className="h-3 w-16 bg-muted/60" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 bg-muted/60" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-24 bg-muted/60" />
                        <Skeleton className="h-3 w-20 bg-muted/60" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-40 bg-muted/60" />
                      <Skeleton className="h-3 w-32 bg-muted/60" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-md bg-muted/60" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full bg-muted/60" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md bg-muted/60" /></TableCell>
                </TableRow>
              ))
            ) : consultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No consultation requests found.
                </TableCell>
              </TableRow>
            ) : (
              consultations.map((consultation: any) => (
                <TableRow key={consultation._id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{format(new Date(consultation.createdAt), "MMM d, yyyy")}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(consultation.createdAt), "h:mm a")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold">{consultation.name}</span>
                        {consultation.business && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {consultation.business}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {consultation.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {consultation.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-slate-800">{consultation.serviceName}</span>
                      <div className="flex items-center gap-2 text-xs text-brand-primary font-medium">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Requested for: {consultation.date} at {consultation.time}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      {consultation.source}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(consultation.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedConsultation(consultation)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Pending" })}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Mark Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Contacted" })}>
                          <Phone className="mr-2 h-4 w-4" /> Mark Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: consultation._id, status: "Resolved" })}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedConsultation && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Consultation Details
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedConsultation.name}</h3>
                    {selectedConsultation.business && (
                      <p className="text-sm text-muted-foreground">{selectedConsultation.business}</p>
                    )}
                  </div>
                  {getStatusBadge(selectedConsultation.status)}
                </div>

                <div className="grid gap-4 text-sm">
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Service</span>
                    <span className="col-span-2 font-semibold text-slate-800">{selectedConsultation.serviceName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Requested For</span>
                    <span className="col-span-2">{selectedConsultation.date} at {selectedConsultation.time}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Email</span>
                    <span className="col-span-2 flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/> <a href={`mailto:${selectedConsultation.email}`} className="text-primary hover:underline">{selectedConsultation.email}</a></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Phone</span>
                    <span className="col-span-2 flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/> <a href={`tel:${selectedConsultation.phone}`} className="text-primary hover:underline">{selectedConsultation.phone}</a></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Source</span>
                    <span className="col-span-2">{selectedConsultation.source}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Submitted On</span>
                    <span className="col-span-2">{format(new Date(selectedConsultation.createdAt), "MMM d, yyyy h:mm a")}</span>
                  </div>
                </div>

                {selectedConsultation.message && (
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Message</h4>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedConsultation.message}</p>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Update Status</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedConsultation.status === "Pending" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Pending" })}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={selectedConsultation.status === "Contacted" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Contacted" })}
                    >
                      Contacted
                    </Button>
                    <Button 
                      variant={selectedConsultation.status === "Resolved" ? "default" : "outline"}
                      className={`flex-1 ${selectedConsultation.status === 'Resolved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                      onClick={() => updateStatusMutation.mutate({ id: selectedConsultation._id, status: "Resolved" })}
                    >
                      Resolved
                    </Button>
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
