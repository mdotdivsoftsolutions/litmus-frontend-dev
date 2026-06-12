import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle2, Beaker, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { testApi } from "@/lib/api/test";
import { categoryApi } from "@/lib/api/category";
import { testTypeApi } from "@/lib/api/testType";
import { adminApi } from "@/lib/api/admin";

const stepLabels = ["Basic Details", "Parameters & Pricing"];

export default function TestFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    testName: "",
    description: "",
    price: "",
    offerPrice: "",
    turnAroundTime: "",
    isPopular: false,
    isApplicableToAll: true,
    creatorType: "ADMIN",
    labId: "",
    applicableCategories: [],
    metadata: {
      method: "",
      type: "",
      parameters: [{ name: "", unit: "", minLimit: "", maxLimit: "" }]
    }
  });

  const { data: testData, isLoading } = useQuery({
    queryKey: ["test", id],
    queryFn: () => testApi.getTestById(id!),
    enabled: isEditing,
  });

  const { data: categoriesData, isLoading: categoriesIsLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryApi.getCategories(),
  });

  const { data: testTypesData } = useQuery({
    queryKey: ["adminTestTypes"],
    queryFn: () => testTypeApi.getTestTypes(),
  });

  const { data: labsData } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: () => adminApi.getLabs(),
  });

  const categories = categoriesData?.data?.data || [];

  useEffect(() => {
    if (testData?.data) {
      const test = testData.data;
      setFormData({
        testName: test.testName || "",
        description: test.description || "",
        price: test.price?.toString() || "",
        offerPrice: test.offerPrice?.toString() || "",
        turnAroundTime: test.turnAroundTime || "",
        isPopular: test.isPopular || false,
        isApplicableToAll: test.isApplicableToAll !== undefined ? test.isApplicableToAll : true,
        creatorType: test.creatorType || "ADMIN",
        labId: test.labId?._id || test.labId || "",
        applicableCategories: test.applicableCategories?.map((c: any) => typeof c === 'string' ? c : c._id) || [],
        metadata: {
          method: test.metadata?.method || "",
          type: test.metadata?.type || "",
          parameters: test.metadata?.parameters?.length > 0 ? test.metadata.parameters : [{ name: "", unit: "", minLimit: "", maxLimit: "" }]
        }
      });
    }
  }, [testData]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => isEditing ? testApi.updateTest(id!, data) : testApi.createTest(data),
    onSuccess: () => {
      toast.success(isEditing ? "Test updated successfully!" : "Test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminTests"] });
      navigate("/admin/tests");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save test");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMetadataChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, [key]: value }
    });
  };

  const addParameterRow = () => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        parameters: [...formData.metadata.parameters, { name: "", unit: "", minLimit: "", maxLimit: "" }]
      }
    });
  };

  const removeParameterRow = (index: number) => {
    const newParams = [...formData.metadata.parameters];
    newParams.splice(index, 1);
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, parameters: newParams }
    });
  };

  const handleParameterChange = (index: number, field: string, value: string) => {
    const newParams = [...formData.metadata.parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, parameters: newParams }
    });
  };

  const handleSave = () => {
    saveMutation.mutate({
      ...formData,
      price: Number(formData.price) || 0,
      offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
      labId: formData.creatorType === 'LAB' ? formData.labId : undefined,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading test details...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/tests"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Test Protocol" : "Add New Test Protocol"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update laboratory testing procedures and parameters." : "Define a new standard testing protocol."}
          </p>
        </div>
      </div>

      <div className="flex w-full mb-8 border-b border-border">
        {stepLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-colors border-b-2 outline-none",
              step === i 
                ? "border-primary text-primary bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            {step === 0 && <FileText className="h-5 w-5 text-primary" />}
            {step === 1 && <Beaker className="h-5 w-5 text-primary" />}
            {stepLabels[step]}
          </CardTitle>
          <CardDescription>
            {step === 0 && "Provide the fundamental details about the test protocol."}
            {step === 1 && "Configure the test parameters and set standard pricing."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in w-full">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Test Name <span className="text-destructive">*</span></Label>
                <Input name="testName" value={formData.testName} onChange={handleChange} placeholder="e.g. Fat Content Analysis" className="bg-background/50" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">FSSAI Reference Method</Label>
                  <Input value={formData.metadata.method} onChange={(e) => handleMetadataChange("method", e.target.value)} placeholder="e.g. IS:1479" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Test Type</Label>
                  <Select value={formData.metadata.type || undefined} onValueChange={(val) => handleMetadataChange("type", val)}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      {testTypesData?.data?.map((type: any) => (
                        <SelectItem key={type._id} value={type.name}>{type.name}</SelectItem>
                      ))}
                      {(!testTypesData || testTypesData.data.length === 0) && (
                        <SelectItem value="chemical" disabled>No Test Types Available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Turn Around Time</Label>
                  <Input name="turnAroundTime" value={formData.turnAroundTime} onChange={handleChange} placeholder="e.g. 24 hours" className="bg-background/50" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Test Creator</Label>
                  <Select value={formData.creatorType} onValueChange={(val) => setFormData({ ...formData, creatorType: val, labId: val === "ADMIN" ? "" : formData.labId })}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select Creator" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Platform (Admin)</SelectItem>
                      <SelectItem value="LAB">Personalized (Lab)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.creatorType === "LAB" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Laboratory <span className="text-destructive">*</span></Label>
                    <Select value={formData.labId || undefined} onValueChange={(val) => setFormData({ ...formData, labId: val })}>
                      <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select Lab" /></SelectTrigger>
                      <SelectContent>
                        {labsData?.data?.map((lab: any) => (
                          <SelectItem key={lab._id} value={lab._id}>{lab.labName}</SelectItem>
                        ))}
                        {(!labsData || labsData.data.length === 0) && (
                          <SelectItem value="none" disabled>No Laboratories Available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold">Category Applicability</h3>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
                  <div>
                    <Label className="text-base font-medium">Applicable to All Categories</Label>
                    <p className="text-sm text-muted-foreground mt-1">If enabled, this test can be assigned to any product regardless of its category.</p>
                  </div>
                  <Switch 
                    checked={formData.isApplicableToAll} 
                    onCheckedChange={(checked) => setFormData({ ...formData, isApplicableToAll: checked })} 
                  />
                </div>
                
                {!formData.isApplicableToAll && (
                  <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm font-medium">Select Applicable Categories <span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categoriesIsLoading ? (
                        <div className="col-span-full text-sm text-muted-foreground">Loading categories...</div>
                      ) : categories.length === 0 ? (
                        <div className="col-span-full text-sm text-muted-foreground">No categories available.</div>
                      ) : (
                        categories.map((cat: any) => {
                          const isSelected = formData.applicableCategories.includes(cat._id);
                          return (
                            <label 
                              key={cat._id} 
                              className={cn(
                                "flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors text-sm",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                              )}
                            >
                              <input 
                                type="checkbox" 
                                className="accent-primary"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({ ...formData, applicableCategories: [...formData.applicableCategories, cat._id] });
                                  } else {
                                    setFormData({ ...formData, applicableCategories: formData.applicableCategories.filter((id: string) => id !== cat._id) });
                                  }
                                }}
                              />
                              <span className="font-medium truncate">{cat.name}</span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium">Detailed Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the testing methodology and purpose..." className="min-h-[120px] bg-background/50" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 max-w-xs">
                  <Label className="text-sm font-medium">Standard Base Price (₹) <span className="text-destructive">*</span></Label>
                  <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 500" className="bg-background/50" />
                  <p className="text-xs text-muted-foreground mt-1">This is the default recommended pricing.</p>
                </div>
                <div className="space-y-2 max-w-xs">
                  <Label className="text-sm font-medium">Offer Price (₹)</Label>
                  <Input name="offerPrice" type="number" value={formData.offerPrice} onChange={handleChange} placeholder="e.g. 450" className="bg-background/50" />
                  <p className="text-xs text-muted-foreground mt-1">Optional discounted price for this test.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50 mt-6">
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background/30 hover:bg-muted/20 transition-colors">
                  <div>
                    <Label className="text-base font-medium">Popular Test (Home Screen)</Label>
                    <p className="text-sm text-muted-foreground mt-1">If enabled, this test will appear in the popular tests section on the home screen.</p>
                  </div>
                  <Switch 
                    checked={formData.isPopular} 
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <h3 className="text-lg font-semibold">Test Parameters</h3>
                  <Button variant="outline" size="sm" onClick={addParameterRow} className="gap-2 h-8 text-xs">
                    <Plus className="h-3 w-3" /> Add Parameter
                  </Button>
                </div>
                
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                  <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                    <div className="col-span-4">Parameter Name</div>
                    <div className="col-span-2">Unit</div>
                    <div className="col-span-2">Min Limit</div>
                    <div className="col-span-3">Max Limit</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>
                  
                  {formData.metadata.parameters.map((param: any, i: number) => (
                    <div key={i} className="grid grid-cols-12 gap-3 items-center group">
                      <div className="col-span-4">
                        <Input value={param.name} onChange={(e) => handleParameterChange(i, "name", e.target.value)} placeholder="e.g. Saturated Fat" className="h-9 text-sm bg-background" />
                      </div>
                      <div className="col-span-2">
                        <Input value={param.unit} onChange={(e) => handleParameterChange(i, "unit", e.target.value)} placeholder="e.g. %" className="h-9 text-sm bg-background" />
                      </div>
                      <div className="col-span-2">
                        <Input value={param.minLimit} onChange={(e) => handleParameterChange(i, "minLimit", e.target.value)} placeholder="0.0" className="h-9 text-sm bg-background" />
                      </div>
                      <div className="col-span-3">
                        <Input value={param.maxLimit} onChange={(e) => handleParameterChange(i, "maxLimit", e.target.value)} placeholder="10.0" className="h-9 text-sm bg-background" />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button variant="ghost" size="icon" onClick={() => removeParameterRow(i)} className="text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {formData.metadata.parameters.length === 0 && (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No parameters defined. Add standard parameters that will be checked in this test.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="w-32">
          Back
        </Button>
        {step < 1 ? (
          <Button onClick={() => setStep(step + 1)} className="w-32 bg-primary hover:bg-primary-deep shadow-md shadow-primary/20">
            Next Step
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-40 bg-litmus-emerald hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
            {saveMutation.isPending ? "Saving..." : (isEditing ? "Save Changes" : "Create Protocol")}
          </Button>
        )}
      </div>
    </div>
  );
}
