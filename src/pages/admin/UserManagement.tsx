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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Loader2, UserCheck, UserX, MoreVertical, PowerOff, Power, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateUserModal } from "./CreateUserModal";
import { UserDetailsSheet } from "./UserDetailsSheet";

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userToToggle, setUserToToggle] = useState<{id: string, isActive: boolean} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) || 
      (u.phone && u.phone.includes(search));
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && u.isActive) || 
      (statusFilter === "inactive" && !u.isActive);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    statusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const confirmToggleStatus = () => {
    if (userToToggle) {
      handleStatusToggle(userToToggle.id, userToToggle.isActive);
      setUserToToggle(null);
    }
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        


        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden sm:table-cell">Mobile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((u: any) => (
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
                    <TableCell className="hidden sm:table-cell text-sm">{u.phone}</TableCell>
                    <TableCell>
                      {u.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "N/A"}
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
                          <DropdownMenuItem onClick={() => setSelectedUser(u._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setUserToToggle({ id: u._id, isActive: u.isActive })}
                            className={u.isActive ? "text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" : "text-green-600 focus:bg-green-100 focus:text-green-700 cursor-pointer"}
                          >
                            {u.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                            <span>{u.isActive ? "Deactivate User" : "Activate User"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </Card>

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between border border-border px-4 py-3 bg-muted/20 rounded-lg shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> users
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

      <UserDetailsSheet 
        userId={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />

      <CreateUserModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <ConfirmDialog 
        open={!!userToToggle}
        onOpenChange={(open) => !open && setUserToToggle(null)}
        title={userToToggle?.isActive ? "Deactivate User" : "Activate User"}
        description={`Are you sure you want to ${userToToggle?.isActive ? "deactivate" : "activate"} this user?`}
        onConfirm={confirmToggleStatus}
        confirmText={userToToggle?.isActive ? "Deactivate" : "Activate"}
        variant={userToToggle?.isActive ? "destructive" : "default"}
      />
    </div>
  );
}
