import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Eye, Loader2, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: adminApi.getUsers,
  });

  const statusMutation = useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: (data) => {
      toast.success(data.message || "User status updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  });

  const users = response?.data || [];

  const filtered = users.filter((u: any) => {
    const fullName = `${u.firstName} ${u.lastName || ""}`.toLowerCase();
    const matchesSearch = !search || 
      fullName.includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) || 
      u.phone.includes(search);
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && u.isActive) || 
      (statusFilter === "inactive" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    statusMutation.mutate({ userId, isActive: !currentStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">User Management</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or phone..." 
            className="pl-9" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="LAB">Lab</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u: any) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{u.phone}</TableCell>
                    <TableCell>
                      {u.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(u.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-3.5 w-3.5" />View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>{u.firstName} {u.lastName}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            <div className="text-sm space-y-2">
                              <p><span className="text-muted-foreground">Email:</span> {u.email}</p>
                              <p><span className="text-muted-foreground">Business:</span> {u.metadata?.businessName || "—"}</p>
                              <p><span className="text-muted-foreground">FSSAI:</span> {u.fssaiNumber || "—"}</p>
                              <p><span className="text-muted-foreground">Mobile:</span> {u.phone}</p>
                              <p>
                                <span className="text-muted-foreground">Status:</span>{" "}
                                {u.isActive ? (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>
                                )}
                              </p>
                              <p><span className="text-muted-foreground">Joined:</span> {format(new Date(u.createdAt), "yyyy-MM-dd")}</p>
                            </div>
                            
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">Documents</h4>
                              {!u.documents || u.documents.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No documents uploaded</p>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between rounded-lg border p-3">
                                    <span className="text-sm">FSSAI Certificate</span>
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="outline" className="h-7 text-green-600 border-green-200">
                                        <UserCheck className="h-3 w-3 mr-1" />Approve
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-7 text-red-600 border-red-200">
                                        <UserX className="h-3 w-3 mr-1" />Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">Booking History</h4>
                              <p className="text-sm text-muted-foreground">0 bookings · 0 completed · ₹0 total</p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Verify User</Button>
                              <Button 
                                size="sm" 
                                variant={u.isActive ? "destructive" : "default"}
                                onClick={() => handleStatusToggle(u._id, u.isActive)}
                                disabled={statusMutation.isPending}
                              >
                                {statusMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : null}
                                {u.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
