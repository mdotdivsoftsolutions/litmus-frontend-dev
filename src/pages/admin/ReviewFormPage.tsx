import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, MessageSquareQuote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";

export default function ReviewFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    rating: 5,
    text: "",
    dateText: "",
    isVisible: true,
  });

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ["adminReview", id],
    queryFn: () => adminApi.getReviewById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (reviewData?.data) {
      const rev = reviewData.data;
      setFormData({
        name: rev.name || "",
        city: rev.city || "",
        rating: rev.rating || 5,
        text: rev.text || "",
        dateText: rev.dateText || "",
        isVisible: rev.isVisible !== undefined ? rev.isVisible : true,
      });
    }
  }, [reviewData]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => isEditing ? adminApi.updateReview(id!, data) : adminApi.createReview(data),
    onSuccess: () => {
      toast.success(isEditing ? "Review updated successfully" : "Review created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      navigate("/admin/reviews");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save review");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, isVisible: checked });
  };

  const handleSave = () => {
    if (!formData.name || !formData.city || !formData.text) {
      toast.error("Please fill all required fields");
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/reviews"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Review" : "Add New Review"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update customer review details." : "Create a new customer review to display on the home screen."}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" /> Review Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Customer Name <span className="text-destructive">*</span></Label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Suresh Mehta" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">City <span className="text-destructive">*</span></Label>
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Chennai" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rating (1-5) <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Text (Optional)</Label>
              <Input name="dateText" value={formData.dateText} onChange={handleChange} placeholder="e.g. 2 weeks ago" />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate from creation date.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Review Content <span className="text-destructive">*</span></Label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={4}
              placeholder="Write the customer's review here..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/20">
            <div>
              <Label className="text-base font-medium">Visible to Public</Label>
              <p className="text-sm text-muted-foreground mt-1">If enabled, this review will appear on the home screen carousel.</p>
            </div>
            <Switch checked={formData.isVisible} onCheckedChange={handleSwitchChange} />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-40 bg-primary hover:bg-primary-deep shadow-md">
              {saveMutation.isPending ? "Saving..." : (isEditing ? "Save Changes" : "Create Review")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
