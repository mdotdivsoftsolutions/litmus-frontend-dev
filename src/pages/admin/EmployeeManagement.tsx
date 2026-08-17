import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MoreVertical, PowerOff, Power, UserPlus, Pencil } from "lucide-react";
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
      (u.phone && u.phone.includes(search));

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
            Manage staff members, roles, access permissions, and account statuses.
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
              placeholder="Search by name, email, or phone..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-[140px] bg-white border border-slate-200 shadow-sm h-10 text-xs font-medium">
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2 self-start lg:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card className="border border-border shadow-sm overflow-auto bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Employee</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No employees found.
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
                          <p className="text-xs text-muted-foreground">{u.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {u.permissions?.map((p: string) => (
                          <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                        )) || <span className="text-xs text-muted-foreground">None</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Inactive</Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => setEmployeeToEdit(u)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Permissions</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setEmployeeToToggle({ id: u._id, isActive: u.isActive })}
                            className={u.isActive ? "text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" : "text-green-600 focus:bg-green-100 focus:text-green-700 cursor-pointer"}
                          >
                            {u.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                            <span>{u.isActive ? "Deactivate" : "Activate"}</span>
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
