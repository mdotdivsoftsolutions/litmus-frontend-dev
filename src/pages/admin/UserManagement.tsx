import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Search, 
  Eye, 
  Loader2, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  PowerOff, 
  Power, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus,
  Filter,
  Calendar as CalendarIcon,
  RotateCcw,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateUserModal } from "./CreateUserModal";

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{ id: string; isActive: boolean } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminUsers", statusFilter, search, startDate, endDate],
    queryFn: () => adminApi.getUsers({
      status: statusFilter === "all" ? undefined : statusFilter,
      search: search.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
  });

  const statusMutation = useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: (data) => {
      toast.success(data.message || "User status updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
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

    let matchesDate = true;
    if (u.createdAt) {
      const createdDate = new Date(u.createdAt);
      if (startDate) {
        matchesDate = matchesDate && !isBefore(createdDate, startOfDay(new Date(startDate)));
      }
      if (endDate) {
        matchesDate = matchesDate && !isAfter(createdDate, endOfDay(new Date(endDate)));
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  const hasActiveFilters = statusFilter !== "all" || Boolean(startDate) || Boolean(endDate) || Boolean(search);

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
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View registered clients, monitor account activity, and manage access statuses.
          </p>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-xs text-muted-foreground hover:text-foreground gap-1 self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </Button>
        )}
      </div>

      {/* Single-Line Top Controls: Search + Status Select + Date Filter Sheet + Create User */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or phone..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }} 
            />
          </div>

          {/* Status Dropdown */}
          <Select 
            value={statusFilter} 
            onValueChange={(val) => { 
              setStatusFilter(val); 
              setCurrentPage(1); 
            }}
          >
            <SelectTrigger className="w-36 h-10 bg-white border border-slate-200 shadow-sm text-xs sm:text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter Button & Drawer */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <Button 
              variant="outline" 
              className="gap-2 bg-white border border-slate-200 shadow-sm h-10 shrink-0 text-xs sm:text-sm" 
              onClick={() => setShowFilters(true)}
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" /> Date Range
              {(startDate || endDate) && <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />}
            </Button>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Filter Users by Date
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Account Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white border border-slate-200 shadow-sm">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Joined Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" /> Joined Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">From</span>
                      <Input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="bg-white border border-slate-200 shadow-sm text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">To</span>
                      <Input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="bg-white border border-slate-200 shadow-sm text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90" 
                    onClick={() => { 
                      setShowFilters(false); 
                      setCurrentPage(1); 
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Primary Styled Create User Button */}
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2 self-start lg:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border border-border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden sm:table-cell">Mobile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full bg-muted/60" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-muted/60" />
                        <Skeleton className="h-3 w-24 bg-muted/60" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24 bg-muted/60" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full bg-muted/60" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-muted/60" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md bg-muted/60" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <span className="font-medium">No users found matching your filters.</span>
                    {hasActiveFilters && (
                      <Button variant="link" size="sm" onClick={clearFilters} className="text-xs text-primary">
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((u: any) => (
                <TableRow 
                  key={u._id} 
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/users/${u._id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm font-medium text-foreground">
                    {u.phone || "N/A"}
                  </TableCell>
                  <TableCell>
                    {u.isActive ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 font-medium">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-900/60 font-medium">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/users/${u._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setUserToToggle({ id: u._id, isActive: u.isActive })}
                          className={u.isActive ? "text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer"}
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

        {/* Pagination Bar */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of{" "}
              <span className="font-medium text-foreground">{filtered.length}</span> users
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
              <div className="text-xs sm:text-sm font-medium px-2">
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
      </Card>

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
