import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Tag as TagIcon, 
  Settings2, 
  FlaskConical, 
  Truck, 
  Microscope, 
  Briefcase, 
  BadgeCheck, 
  MapPin, 
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Building2,
  Sliders,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { tagApi } from "@/lib/api/tag";
import { testTypeApi } from "@/lib/api/testType";
import { logisticsApi } from "@/lib/api/logistics";
import { infrastructureApi } from "@/lib/api/infrastructure";
import { activityStatusApi } from "@/lib/api/activityStatus";
import { apiClient } from "@/lib/api/axios";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PickupCoverageSettings } from "./PickupCoverageSettings";
import { DeskNotificationSettings } from "./DeskNotificationSettings";

const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type BaseFormValues = z.infer<typeof baseSchema>;

const infraSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  icon: z.string().default("microscope"),
});

type InfraFormValues = z.infer<typeof infraSchema>;

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("test-types");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({ queryKey: ["adminTags"], queryFn: () => tagApi.getTags() });
  const { data: testTypesData, isLoading: isLoadingTestTypes } = useQuery({ queryKey: ["adminTestTypes"], queryFn: () => testTypeApi.getTestTypes() });
  const { data: logisticsData, isLoading: isLoadingLogistics } = useQuery({ queryKey: ["adminLogistics"], queryFn: () => logisticsApi.getLogisticsOptions() });
  const { data: infrastructureData, isLoading: isLoadingInfrastructure } = useQuery({ queryKey: ["adminInfrastructure"], queryFn: () => infrastructureApi.getInfrastructureOptions() });
  const { data: activityStatusData, isLoading: isLoadingActivityStatus } = useQuery({ queryKey: ["adminActivityStatus"], queryFn: () => activityStatusApi.getActivityStatuses() });
  const { data: departmentsData, isLoading: isLoadingDepartments } = useQuery({ queryKey: ["adminDepartments"], queryFn: () => apiClient.get('/options?category=DEPARTMENT').then(res => res.data) });
  const { data: designationsData, isLoading: isLoadingDesignations } = useQuery({ queryKey: ["adminDesignations"], queryFn: () => apiClient.get('/options?category=DESIGNATION').then(res => res.data) });

  const tagForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const testTypeForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const logisticsForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const activityStatusForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const infrastructureForm = useForm<InfraFormValues>({ resolver: zodResolver(infraSchema), defaultValues: { title: "", description: "", icon: "microscope" } });
  const departmentForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const designationForm = useForm<BaseFormValues>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });

  // Mutations
  const createTagMutation = useMutation({
    mutationFn: (data: { name: string }) => tagApi.createTag(data),
    onSuccess: () => {
      toast.success("Tag created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminTags"] });
      tagForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create tag")
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagApi.deleteTag(id),
    onSuccess: () => { toast.success("Tag deleted successfully"); queryClient.invalidateQueries({ queryKey: ["adminTags"] }); setDeleteTarget(null); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete tag")
  });

  const createTestTypeMutation = useMutation({
    mutationFn: (data: { name: string }) => testTypeApi.createTestType(data),
    onSuccess: () => {
      toast.success("Test Type created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminTestTypes"] });
      testTypeForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create test type")
  });

  const deleteTestTypeMutation = useMutation({
    mutationFn: (id: string) => testTypeApi.deleteTestType(id),
    onSuccess: () => { toast.success("Test Type deleted successfully"); queryClient.invalidateQueries({ queryKey: ["adminTestTypes"] }); setDeleteTarget(null); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete test type")
  });

  const createLogisticsMutation = useMutation({
    mutationFn: (data: { name: string }) => logisticsApi.createLogisticsOption(data),
    onSuccess: () => {
      toast.success("Logistics option created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminLogistics"] });
      logisticsForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create logistics option")
  });

  const deleteLogisticsMutation = useMutation({
    mutationFn: (id: string) => logisticsApi.deleteLogisticsOption(id),
    onSuccess: () => { toast.success("Logistics option deleted successfully"); queryClient.invalidateQueries({ queryKey: ["adminLogistics"] }); setDeleteTarget(null); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete logistics option")
  });

  const createInfrastructureMutation = useMutation({
    mutationFn: (data: { title: string; description: string; icon: string }) => infrastructureApi.createInfrastructureOption(data),
    onSuccess: () => {
      toast.success("Infrastructure template created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminInfrastructure"] });
      infrastructureForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create infrastructure template")
  });

  const deleteInfrastructureMutation = useMutation({
    mutationFn: (id: string) => infrastructureApi.deleteInfrastructureOption(id),
    onSuccess: () => { toast.success("Infrastructure template deleted successfully"); queryClient.invalidateQueries({ queryKey: ["adminInfrastructure"] }); setDeleteTarget(null); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete infrastructure template")
  });

  const createActivityStatusMutation = useMutation({
    mutationFn: (data: { name: string }) => activityStatusApi.createActivityStatus(data),
    onSuccess: () => {
      toast.success("Activity Status created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminActivityStatus"] });
      activityStatusForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create activity status")
  });

  const deleteActivityStatusMutation = useMutation({
    mutationFn: (id: string) => activityStatusApi.deleteActivityStatus(id),
    onSuccess: () => { toast.success("Activity Status deleted successfully"); queryClient.invalidateQueries({ queryKey: ["adminActivityStatus"] }); setDeleteTarget(null); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete activity status")
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: { name: string }) => apiClient.post('/options', { category: 'DEPARTMENT', value: data.name }),
    onSuccess: () => {
      toast.success("Department created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminDepartments"] });
      departmentForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create department")
  });

  const deleteOptionMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/options/${id}`),
    onSuccess: () => { 
      toast.success("Option deleted successfully"); 
      queryClient.invalidateQueries({ queryKey: ["adminDepartments"] }); 
      queryClient.invalidateQueries({ queryKey: ["adminDesignations"] }); 
      setDeleteTarget(null); 
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to delete option")
  });

  const createDesignationMutation = useMutation({
    mutationFn: (data: { name: string }) => apiClient.post('/options', { category: 'DESIGNATION', value: data.name }),
    onSuccess: () => {
      toast.success("Designation created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminDesignations"] });
      designationForm.reset();
      setIsSheetOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create designation")
  });

  const tags = (tagsData?.data || []).filter((t: any) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const testTypes = (testTypesData?.data || []).filter((t: any) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const logisticsOptions = (logisticsData?.data || []).filter((t: any) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const infrastructureOptions = (infrastructureData?.data || []).filter((t: any) => !searchQuery || (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())));
  const activityStatuses = (activityStatusData?.data || []).filter((t: any) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const departments = (departmentsData?.data || []).filter((t: any) => !searchQuery || (t.value && t.value.toLowerCase().includes(searchQuery.toLowerCase())));
  const designations = (designationsData?.data || []).filter((t: any) => !searchQuery || (t.value && t.value.toLowerCase().includes(searchQuery.toLowerCase())));

  // Navigation menu grouped by domain
  const settingsSections = [
    {
      group: "Catalog & Classifications",
      items: [
        { id: "test-types", label: "Test Classifications", icon: FlaskConical, count: (testTypesData?.data || []).length, desc: "Sample & diagnostic test categories" },
        { id: "tags", label: "Package Tags", icon: TagIcon, count: (tagsData?.data || []).length, desc: "Highlight badges for packages" },
      ]
    },
    {
      group: "Logistics & Facilities",
      items: [
        { id: "logistics", label: "Logistics & Pickup", icon: Truck, count: (logisticsData?.data || []).length, desc: "Sample transport methods" },
        { id: "infrastructure", label: "Lab Equipment", icon: Microscope, count: (infrastructureData?.data || []).length, desc: "Accredited equipment templates" },
        { id: "activity-status", label: "Operational Status", icon: Settings2, count: (activityStatusData?.data || []).length, desc: "Workflow states & labels" },
        { id: "pickup", label: "Pickup Cities", icon: MapPin, count: null, desc: "Direct doorstep pickup zones" },
      ]
    },
    {
      group: "Live Support & Notifications",
      items: [
        { id: "desk-notifications", label: "Desk & Alerts", icon: Settings2, count: null, desc: "Presence status, alerts & chime settings" },
      ]
    },
    {
      group: "Organization & Staff",
      items: [
        { id: "departments", label: "Departments", icon: Briefcase, count: (departmentsData?.data || []).length, desc: "Internal organizational divisions" },
        { id: "designations", label: "Staff Designations", icon: BadgeCheck, count: (designationsData?.data || []).length, desc: "Job roles and positions" },
      ]
    }
  ];

  const currentTabMeta = settingsSections.flatMap(s => s.items).find(i => i.id === activeTab);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "test-types") deleteTestTypeMutation.mutate(deleteTarget.id);
    else if (deleteTarget.type === "tags") deleteTagMutation.mutate(deleteTarget.id);
    else if (deleteTarget.type === "logistics") deleteLogisticsMutation.mutate(deleteTarget.id);
    else if (deleteTarget.type === "infrastructure") deleteInfrastructureMutation.mutate(deleteTarget.id);
    else if (deleteTarget.type === "activity-status") deleteActivityStatusMutation.mutate(deleteTarget.id);
    else if (deleteTarget.type === "departments" || deleteTarget.type === "designations") deleteOptionMutation.mutate(deleteTarget.id);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden space-y-4 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Platform Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure system lookups, test classifications, employee roles, and coverage areas.
          </p>
        </div>
      </div>

      {/* 2-Column High-End Settings Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 h-full flex flex-col min-h-0">
          <Card className="bg-white border border-slate-200/80 shadow-xs rounded-xl overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {settingsSections.map((section, sIdx) => (
                <div key={section.group} className={sIdx > 0 ? "pt-3 border-t border-slate-100" : ""}>
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {section.group}
                  </p>
                  <div className="space-y-0.5 mt-1">
                    {section.items.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group text-left outline-none focus:outline-none border-0 select-none",
                            isActive 
                              ? "bg-primary text-white shadow-xs font-semibold" 
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                            <span className="truncate">{tab.label}</span>
                          </div>
                          {tab.count !== null && (
                            <span className={cn(
                              "ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                              isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                            )}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col min-h-0">
          <Card className="bg-white border border-slate-200/80 shadow-xs rounded-xl overflow-hidden h-full flex flex-col">
            
            {/* Header with Search and Action */}
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {currentTabMeta?.icon && (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <currentTabMeta.icon className="h-4 w-4" />
                      </div>
                    )}
                    <CardTitle className="text-base font-bold text-slate-900">
                      {currentTabMeta?.label || "Settings"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">
                    {currentTabMeta?.desc || "Manage lookup configuration for this category."}
                  </CardDescription>
                </div>

                {!["pickup", "desk-notifications"].includes(activeTab) && (
                  <div className="flex items-center gap-2">
                    <div className="relative w-44 sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder={`Filter items...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs bg-white border-slate-200 shadow-xs rounded-lg"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setIsSheetOpen(true)} 
                      className="h-8 text-xs bg-primary hover:bg-primary/90 text-white rounded-lg shadow-xs shrink-0 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add New
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              
              {/* 1. Test Classifications */}
              {activeTab === "test-types" && (
                <div>
                  {isLoadingTestTypes ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : testTypes.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <FlaskConical className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No test classifications found</p>
                      <p className="text-[11px]">Click "Add New" above to create your first diagnostic classification.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {testTypes.map((item: any) => (
                        <div key={item._id} className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                              <FlaskConical className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate" title={item.name}>{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">Standard Test Category</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "test-types", name: item.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Package Tags */}
              {activeTab === "tags" && (
                <div>
                  {isLoadingTags ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : tags.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <TagIcon className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No package tags found</p>
                      <p className="text-[11px]">Create highlight badges like "Popular", "Comprehensive", or "NABL Verified".</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                      {tags.map((item: any) => (
                        <div key={item._id} className="p-2.5 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-2 min-w-0">
                            <TagIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate" title={item.name}>{item.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "tags", name: item.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Logistics Services */}
              {activeTab === "logistics" && (
                <div>
                  {isLoadingLogistics ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : logisticsOptions.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Truck className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No logistics options configured</p>
                      <p className="text-[11px]">Add sample pickup options such as "Home Collection" or "Courier Pickup".</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {logisticsOptions.map((item: any) => (
                        <div key={item._id} className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
                              <Truck className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate" title={item.name}>{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">Logistics Service</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "logistics", name: item.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Lab Equipment */}
              {activeTab === "infrastructure" && (
                <div>
                  {isLoadingInfrastructure ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : infrastructureOptions.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Microscope className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No equipment templates configured</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {infrastructureOptions.map((item: any) => (
                        <div key={item._id} className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2 relative">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Microscope className="h-4 w-4" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>{item.title}</h4>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                              onClick={() => setDeleteTarget({ id: item._id, type: "infrastructure", name: item.title })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Operational Status */}
              {activeTab === "activity-status" && (
                <div>
                  {isLoadingActivityStatus ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : activityStatuses.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Settings2 className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No operational statuses found</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activityStatuses.map((item: any) => (
                        <div key={item._id} className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-900 truncate">{item.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "activity-status", name: item.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. Departments */}
              {activeTab === "departments" && (
                <div>
                  {isLoadingDepartments ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : departments.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Briefcase className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No departments configured</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {departments.map((item: any) => (
                        <div key={item._id} className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate">{item.value}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "departments", name: item.value })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Designations */}
              {activeTab === "designations" && (
                <div>
                  {isLoadingDesignations ? (
                    <div className="p-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
                  ) : designations.length === 0 ? (
                    <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <BadgeCheck className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">No designations configured</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {designations.map((item: any) => (
                        <div key={item._id} className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <BadgeCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate">{item.value}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors shrink-0"
                            onClick={() => setDeleteTarget({ id: item._id, type: "designations", name: item.value })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 8. Pickup Cities */}
              {activeTab === "pickup" && (
                <div className="-m-4 sm:-m-5">
                  <PickupCoverageSettings />
                </div>
              )}

              {/* 9. Live Desk & Notification Settings */}
              {activeTab === "desk-notifications" && (
                <div className="p-2">
                  <DeskNotificationSettings />
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Slide-over Sheet for Creation */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md bg-white">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <SheetTitle className="text-base font-bold">
              Add New {currentTabMeta?.label}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Define a new system lookup entry for {currentTabMeta?.label.toLowerCase()}.
            </SheetDescription>
          </SheetHeader>

          <div className="py-5">
            {activeTab === "test-types" && (
              <Form {...testTypeForm}>
                <form onSubmit={testTypeForm.handleSubmit((d) => createTestTypeMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={testTypeForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Classification Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Microbiological Analysis" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createTestTypeMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createTestTypeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Classification
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "tags" && (
              <Form {...tagForm}>
                <form onSubmit={tagForm.handleSubmit((d) => createTagMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={tagForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Tag Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Popular, Advanced Safety" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createTagMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createTagMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Tag
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "logistics" && (
              <Form {...logisticsForm}>
                <form onSubmit={logisticsForm.handleSubmit((d) => createLogisticsMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={logisticsForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Logistics Service Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Cold-Chain Express" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createLogisticsMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createLogisticsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Logistics Service
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "infrastructure" && (
              <Form {...infrastructureForm}>
                <form onSubmit={infrastructureForm.handleSubmit((d) => createInfrastructureMutation.mutate({
                  title: d.title || "",
                  description: d.description || "",
                  icon: d.icon || "microscope"
                }))} className="space-y-4">
                  <FormField control={infrastructureForm.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Equipment Title</FormLabel>
                      <FormControl><Input placeholder="e.g. HPLC Spectrometer" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={infrastructureForm.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Description</FormLabel>
                      <FormControl><Input placeholder="High precision analytical equipment" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createInfrastructureMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createInfrastructureMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Equipment Template
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "activity-status" && (
              <Form {...activityStatusForm}>
                <form onSubmit={activityStatusForm.handleSubmit((d) => createActivityStatusMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={activityStatusForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Status Label</FormLabel>
                      <FormControl><Input placeholder="e.g. Sample Processing" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createActivityStatusMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createActivityStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Status
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "departments" && (
              <Form {...departmentForm}>
                <form onSubmit={departmentForm.handleSubmit((d) => createDepartmentMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={departmentForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Department Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Microbiology Dept" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createDepartmentMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createDepartmentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Department
                  </Button>
                </form>
              </Form>
            )}

            {activeTab === "designations" && (
              <Form {...designationForm}>
                <form onSubmit={designationForm.handleSubmit((d) => createDesignationMutation.mutate({ name: d.name }))} className="space-y-4">
                  <FormField control={designationForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Designation Title</FormLabel>
                      <FormControl><Input placeholder="e.g. Lead Microbiologist" {...field} className="text-xs h-9" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createDesignationMutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                    {createDesignationMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Designation
                  </Button>
                </form>
              </Form>
            )}

          </div>
        </SheetContent>
      </Sheet>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog 
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Lookup Entry"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This change will remove it from system dropdowns.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
