import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2, Tag as TagIcon, Settings2, FlaskConical, Truck, Microscope } from "lucide-react";
import { toast } from "sonner";
import { tagApi } from "@/lib/api/tag";
import { testTypeApi } from "@/lib/api/testType";
import { logisticsApi } from "@/lib/api/logistics";
import { infrastructureApi } from "@/lib/api/infrastructure";
import { activityStatusApi } from "@/lib/api/activityStatus";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const infraSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  icon: z.string().default("microscope"),
});

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("test-types");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({ queryKey: ["adminTags"], queryFn: () => tagApi.getTags() });
  const { data: testTypesData, isLoading: isLoadingTestTypes } = useQuery({ queryKey: ["adminTestTypes"], queryFn: () => testTypeApi.getTestTypes() });
  const { data: logisticsData, isLoading: isLoadingLogistics } = useQuery({ queryKey: ["adminLogistics"], queryFn: () => logisticsApi.getLogisticsOptions() });
  const { data: infrastructureData, isLoading: isLoadingInfrastructure } = useQuery({ queryKey: ["adminInfrastructure"], queryFn: () => infrastructureApi.getInfrastructureOptions() });
  const { data: activityStatusData, isLoading: isLoadingActivityStatus } = useQuery({ queryKey: ["adminActivityStatus"], queryFn: () => activityStatusApi.getActivityStatuses() });

  const tagForm = useForm<z.infer<typeof baseSchema>>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const testTypeForm = useForm<z.infer<typeof baseSchema>>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const logisticsForm = useForm<z.infer<typeof baseSchema>>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const activityStatusForm = useForm<z.infer<typeof baseSchema>>({ resolver: zodResolver(baseSchema), defaultValues: { name: "" } });
  const infrastructureForm = useForm<z.infer<typeof infraSchema>>({ resolver: zodResolver(infraSchema), defaultValues: { title: "", description: "", icon: "microscope" } });

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

  const tags = tagsData?.data || [];
  const testTypes = testTypesData?.data || [];
  const logisticsOptions = logisticsData?.data || [];
  const infrastructureOptions = infrastructureData?.data || [];
  const activityStatuses = activityStatusData?.data || [];

  const sidebarItems = [
    { id: "test-types", label: "Test Types", icon: FlaskConical, desc: "Manage analysis types" },
    { id: "tags", label: "Package Tags", icon: TagIcon, desc: "Dynamic package labels" },
    { id: "logistics", label: "Service Logistics", icon: Truck, desc: "Available lab services" },
    { id: "infrastructure", label: "Infrastructure", icon: Microscope, desc: "Standard equipment" },
    { id: "activity-status", label: "Activity Status", icon: Settings2, desc: "Operational states" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Settings2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage dynamic lists and configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-primary" : "text-muted-foreground")} />
              <div>
                <div className="text-sm">{item.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <Card className="border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div>
                <CardTitle className="text-lg">
                  {activeTab === "test-types" && "Manage Test Types"}
                  {activeTab === "tags" && "Manage Package Tags"}
                  {activeTab === "logistics" && "Manage Service Logistics"}
                  {activeTab === "infrastructure" && "Manage Infrastructure Templates"}
                  {activeTab === "activity-status" && "Manage Activity Statuses"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {activeTab === "test-types" && "Create types of tests to assign to test protocols."}
                  {activeTab === "tags" && "Create dynamic tags that can be applied to packages."}
                  {activeTab === "logistics" && "Create dynamic logistics services that laboratories can select."}
                  {activeTab === "infrastructure" && "Define standard laboratory equipment templates."}
                  {activeTab === "activity-status" && "Define standard operating statuses for laboratories."}
                </CardDescription>
              </div>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-deep shadow-md">
                    <Plus className="h-4 w-4 mr-2" /> Add New
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>
                      {activeTab === "test-types" && "Add Test Type"}
                      {activeTab === "tags" && "Add Package Tag"}
                      {activeTab === "logistics" && "Add Logistics Service"}
                      {activeTab === "infrastructure" && "Add Infrastructure"}
                      {activeTab === "activity-status" && "Add Activity Status"}
                    </SheetTitle>
                    <SheetDescription>
                      Fill out the details below to add a new entry.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6">
                    {activeTab === "test-types" && (
                      <Form {...testTypeForm}>
                        <form onSubmit={testTypeForm.handleSubmit((d) => createTestTypeMutation.mutate(d as { name: string }))} className="space-y-4">
                          <FormField control={testTypeForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Type Name</FormLabel><FormControl><Input placeholder="e.g. Physical Analysis" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createTestTypeMutation.isPending}>
                            {createTestTypeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Test Type
                          </Button>
                        </form>
                      </Form>
                    )}

                    {activeTab === "tags" && (
                      <Form {...tagForm}>
                        <form onSubmit={tagForm.handleSubmit((d) => createTagMutation.mutate(d as { name: string }))} className="space-y-4">
                          <FormField control={tagForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Tag Name</FormLabel><FormControl><Input placeholder="e.g. Best Value" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createTagMutation.isPending}>
                            {createTagMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Tag
                          </Button>
                        </form>
                      </Form>
                    )}

                    {activeTab === "logistics" && (
                      <Form {...logisticsForm}>
                        <form onSubmit={logisticsForm.handleSubmit((d) => createLogisticsMutation.mutate(d as { name: string }))} className="space-y-4">
                          <FormField control={logisticsForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Service Name</FormLabel><FormControl><Input placeholder="e.g. Cold-Chain Support" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createLogisticsMutation.isPending}>
                            {createLogisticsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Service
                          </Button>
                        </form>
                      </Form>
                    )}

                    {activeTab === "activity-status" && (
                      <Form {...activityStatusForm}>
                        <form onSubmit={activityStatusForm.handleSubmit((d) => createActivityStatusMutation.mutate(d as { name: string }))} className="space-y-4">
                          <FormField control={activityStatusForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Status Name</FormLabel><FormControl><Input placeholder="e.g. Operational Now" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createActivityStatusMutation.isPending}>
                            {createActivityStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Status
                          </Button>
                        </form>
                      </Form>
                    )}

                    {activeTab === "infrastructure" && (
                      <Form {...infrastructureForm}>
                        <form onSubmit={infrastructureForm.handleSubmit((d) => createInfrastructureMutation.mutate(d as { title: string; description: string; icon: string }))} className="space-y-4">
                          <FormField control={infrastructureForm.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Equipment Title</FormLabel><FormControl><Input placeholder="e.g. HPLC System" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={infrastructureForm.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Short description..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={infrastructureForm.control} name="icon" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon</FormLabel>
                              <FormControl>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" {...field}>
                                  <option value="microscope">Microscope</option>
                                  <option value="flask">Flask</option>
                                  <option value="clock">Clock</option>
                                  <option value="shield">Shield</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <Button type="submit" className="w-full" disabled={createInfrastructureMutation.isPending}>
                            {createInfrastructureMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Template
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </CardHeader>

            <CardContent className="p-0">
              {activeTab === "test-types" && (
                <div className="relative w-full overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
                  {isLoadingTestTypes ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {testTypes.length === 0 ? (
                          <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No test types found.</TableCell></TableRow>
                        ) : testTypes.map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: item._id, type: "test-types", name: item.name })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === "tags" && (
                <div className="relative w-full overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
                  {isLoadingTags ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Tag Name</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {tags.length === 0 ? (
                          <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No tags found.</TableCell></TableRow>
                        ) : tags.map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium flex items-center gap-2"><TagIcon className="h-4 w-4 text-primary" /> {item.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: item._id, type: "tags", name: item.name })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="relative w-full overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
                  {isLoadingLogistics ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Service Name</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {logisticsOptions.length === 0 ? (
                          <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No logistics options found.</TableCell></TableRow>
                        ) : logisticsOptions.map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> {item.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: item._id, type: "logistics", name: item.name })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === "infrastructure" && (
                <div className="relative w-full overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
                  {isLoadingInfrastructure ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Equipment Title</TableHead><TableHead>Description</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {infrastructureOptions.length === 0 ? (
                          <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No infrastructure templates found.</TableCell></TableRow>
                        ) : infrastructureOptions.map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium flex items-center gap-2">
                              <Microscope className="h-4 w-4 text-primary" /> {item.title}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: item._id, type: "infrastructure", name: item.title })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}

              {activeTab === "activity-status" && (
                <div className="relative w-full overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
                  {isLoadingActivityStatus ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Status Name</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {activityStatuses.length === 0 ? (
                          <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No activity statuses found.</TableCell></TableRow>
                        ) : activityStatuses.map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /> {item.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget({ id: item._id, type: "activity-status", name: item.name })}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        variant="destructive"
        confirmText="Delete"
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === "test-types") deleteTestTypeMutation.mutate(deleteTarget.id);
          else if (deleteTarget.type === "tags") deleteTagMutation.mutate(deleteTarget.id);
          else if (deleteTarget.type === "logistics") deleteLogisticsMutation.mutate(deleteTarget.id);
          else if (deleteTarget.type === "infrastructure") deleteInfrastructureMutation.mutate(deleteTarget.id);
          else if (deleteTarget.type === "activity-status") deleteActivityStatusMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
