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
  MoreVertical, 
  PowerOff, 
  Power, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus,
  Filter,
  Calendar as CalendarIcon,
  RotateCcw,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateUserDrawer } from "./CreateUserDrawer";

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
              className="pl-9 bg-white border border-slate-200 shadow-xs h-10 text-xs sm:text-sm" 
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
            <SelectTrigger className="w-36 h-10 bg-white border border-slate-200 shadow-xs text-xs sm:text-sm">
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
              className="gap-2 bg-white border border-slate-200 shadow-xs h-10 shrink-0 text-xs sm:text-sm" 
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs h-10 px-4 gap-2 self-start lg:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border border-border shadow-xs overflow-hidden bg-white min-h-[380px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="py-3 px-4">User</TableHead>
                <TableHead className="py-3 px-4">Email Address</TableHead>
                <TableHead className="py-3 px-4">Phone / Mobile</TableHead>
                <TableHead className="py-3 px-4">Account Type</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4">Registered Date</TableHead>
                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg bg-muted/60" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 bg-muted/60" />
                          <Skeleton className="h-3 w-16 bg-muted/60" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-36 bg-muted/60" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-24 bg-muted/60" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-5 w-20 rounded-full bg-muted/60" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-full bg-muted/60" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-24 bg-muted/60" /></TableCell>
                    <TableCell className="py-3 px-4 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md bg-muted/60" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
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
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                  >
                    {/* 1. User Name & Avatar */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg border border-slate-200 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-lg">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-slate-900 truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">ID: {String(u._id).slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Email Address */}
                    <TableCell className="py-3 px-4 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 truncate max-w-[220px]" title={u.email}>
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email || "N/A"}</span>
                      </div>
                    </TableCell>

                    {/* 3. Phone / Mobile */}
                    <TableCell className="py-3 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{u.phone || "N/A"}</span>
                      </div>
                    </TableCell>

                    {/* 4. Role / Account Type */}
                    <TableCell className="py-3 px-4">
                      <Badge variant="secondary" className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5">
                        {u.role === "ADMIN" ? (
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> Admin</span>
                        ) : u.role === "EMPLOYEE" ? (
                          <span className="flex items-center gap-1"><UserCheck className="h-3 w-3 text-sky-600" /> Employee</span>
                        ) : (
                          "Client / User"
                        )}
                      </Badge>
                    </TableCell>

                    {/* 5. Status Badge */}
                    <TableCell className="py-3 px-4">
                      {u.isActive ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-[10px] px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-medium text-[10px] px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
                          Suspended
                        </Badge>
                      )}
                    </TableCell>

                    {/* 6. Registered Date */}
                    <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "N/A"}
                    </TableCell>

                    {/* 7. Actions */}
                    <TableCell className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" /> View
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 outline-none focus:outline-none">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 p-1.5 shadow-lg border border-slate-200 bg-white rounded-xl">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/admin/users/${u._id}`)}
                              className="text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setUserToToggle({ id: u._id, isActive: u.isActive })}
                              className={u.isActive ? "text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-rose-600 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-700" : "text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700"}
                            >
                              {u.isActive ? <PowerOff className="h-3.5 w-3.5 text-rose-500" /> : <Power className="h-3.5 w-3.5 text-emerald-500" />}
                              <span>{u.isActive ? "Deactivate User" : "Activate User"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <p className="text-xs text-muted-foreground">
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
              <div className="text-xs font-medium px-2">
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

      <CreateUserDrawer 
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
