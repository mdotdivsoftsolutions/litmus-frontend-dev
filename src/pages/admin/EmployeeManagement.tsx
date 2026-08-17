import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MoreVertical, PowerOff, Power, UserPlus, Pencil, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api/axios";
import { CreateEmployeeDrawer } from "./CreateEmployeeDrawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Local API calls for employee management
const employeeApi = {
  getEmployees: async () => {
    const response = await apiClient.get('/employees');
    return response.data;
  },
  updateEmployee: async ({ id, ...data }: { id: string; [key: string]: any }) => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  }
};

export default function EmployeeManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeToToggle, setEmployeeToToggle] = useState<{id: string, isActive: boolean} | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminEmployees"],
    queryFn: employeeApi.getEmployees,
  });

  const updateMutation = useMutation({
    mutationFn: employeeApi.updateEmployee,
    onSuccess: (data) => {
      toast.success(data.message || "Employee updated");
      queryClient.invalidateQueries({ queryKey: ["adminEmployees"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  });

  const employees = (response?.data || []).slice().sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const filtered = employees.filter((u: any) => {
    const fullName = `${u.firstName} ${u.lastName || ""}`.toLowerCase();
    const matchesSearch = !search || 
      fullName.includes(search.toLowerCase()) || 
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) || 
      (u.phone && u.phone.includes(search)) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      (u.designation && u.designation.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && u.isActive !== false) ||
      (statusFilter === "inactive" && u.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, isActive: !currentStatus });
  };

  const confirmToggleStatus = () => {
    if (employeeToToggle) {
      handleStatusToggle(employeeToToggle.id, employeeToToggle.isActive);
      setEmployeeToToggle(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage staff members, department allocations, access permissions, and account statuses.
          </p>
        </div>
      </div>

      {/* Single-Line Controls: Search + Status Filter + Add Employee Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, phone, or department..." 
              className="pl-9 bg-white border border-slate-200 shadow-xs h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-[140px] bg-white border border-slate-200 shadow-xs h-10 text-xs font-medium">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Primary Styled Add Employee Button */}
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs h-10 px-4 gap-2 self-start lg:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card className="border border-border shadow-xs overflow-hidden bg-white min-h-[360px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="py-3 px-4">Employee</TableHead>
                <TableHead className="py-3 px-4">Email</TableHead>
                <TableHead className="py-3 px-4">Phone</TableHead>
                <TableHead className="py-3 px-4">Department & Role</TableHead>
                <TableHead className="py-3 px-4">Permissions</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4">Joined</TableHead>
                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="py-3 px-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-muted-foreground text-xs">
                    No employees found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u: any) => (
                  <TableRow key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. Employee Name & Avatar */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg border border-slate-200 shrink-0">
                          {u.profilePic && <AvatarImage src={u.profilePic} alt={u.firstName} />}
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

                    {/* 2. Email Column */}
                    <TableCell className="py-3 px-4 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={u.email}>
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email || "N/A"}</span>
                      </div>
                    </TableCell>

                    {/* 3. Phone Column */}
                    <TableCell className="py-3 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{u.phone || "N/A"}</span>
                      </div>
                    </TableCell>

                    {/* 4. Department & Designation Column */}
                    <TableCell className="py-3 px-4">
                      <div className="space-y-0.5 min-w-0 max-w-[160px]">
                        <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 truncate" title={u.department || "General Department"}>
                          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{u.department || "General Department"}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate" title={u.designation || "Staff Member"}>
                          <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{u.designation || "Staff Member"}</span>
                        </p>
                      </div>
                    </TableCell>

                    {/* 5. Permissions Badges */}
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {u.permissions && u.permissions.length > 0 ? (
                          u.permissions.map((p: string) => (
                            <Badge 
                              key={p} 
                              variant="outline" 
                              className="text-[9px] px-1.5 py-0 h-4 bg-slate-50 border-slate-200 text-slate-700 font-medium"
                            >
                              {p.replace(/_/g, " ")}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Standard Staff</span>
                        )}
                      </div>
                    </TableCell>

                    {/* 6. Status Badge */}
                    <TableCell className="py-3 px-4">
                      {u.isActive !== false ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-[10px] px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-medium text-[10px] px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    {/* 7. Joined Date */}
                    <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "Recent"}
                    </TableCell>

                    {/* 8. Actions */}
                    <TableCell className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 outline-none focus:outline-none">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1.5 shadow-lg border border-slate-200 bg-white rounded-xl">
                          <DropdownMenuItem 
                            onClick={() => setEmployeeToEdit(u)}
                            className="text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setEmployeeToToggle({ id: u._id, isActive: u.isActive !== false })}
                            className={u.isActive !== false ? "text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-rose-600 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-700" : "text-xs flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700"}
                          >
                            {u.isActive !== false ? <PowerOff className="h-3.5 w-3.5 text-rose-500" /> : <Power className="h-3.5 w-3.5 text-emerald-500" />}
                            <span>{u.isActive !== false ? "Deactivate" : "Activate"}</span>
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
      </Card>

      <CreateEmployeeDrawer 
        open={isCreateModalOpen || !!employeeToEdit}
        onOpenChange={(val) => {
          if (!val) {
            setIsCreateModalOpen(false);
            setEmployeeToEdit(null);
          }
        }}
        employee={employeeToEdit}
      />

      <ConfirmDialog 
        open={!!employeeToToggle}
        onOpenChange={(open) => !open && setEmployeeToToggle(null)}
        title={employeeToToggle?.isActive ? "Deactivate Employee" : "Activate Employee"}
        description={`Are you sure you want to ${employeeToToggle?.isActive ? "deactivate" : "activate"} this employee?`}
        onConfirm={confirmToggleStatus}
        confirmText={employeeToToggle?.isActive ? "Deactivate" : "Activate"}
        variant={employeeToToggle?.isActive ? "destructive" : "default"}
      />
    </div>
  );
}
