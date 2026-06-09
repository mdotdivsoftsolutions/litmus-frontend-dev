import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, MessageSquareQuote, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ReviewManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    action: () => void;
    variant?: "default" | "destructive";
  } | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminReviews", page, limit],
    queryFn: () => adminApi.getReviews({ page, limit })
  });

  const reviews = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onError: () => toast.error("Failed to delete review")
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string, isVisible: boolean }) => adminApi.updateReview(id, { isVisible }),
    onSuccess: () => {
      toast.success("Visibility updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onError: () => toast.error("Failed to update visibility")
  });

  const handleDelete = (id: string) => {
    setDialogConfig({
      title: "Delete Review",
      description: "Are you sure you want to delete this customer review? This action cannot be undone.",
      variant: "destructive",
      action: () => deleteMutation.mutate(id),
    });
    setDialogOpen(true);
  };

  const handleVisibilityToggle = (id: string, currentVisibility: boolean) => {
    const actionText = currentVisibility ? "hide" : "show";
    setDialogConfig({
      title: "Change Visibility",
      description: `Are you sure you want to ${actionText} this review on the public home page?`,
      variant: "default",
      action: () => updateVisibilityMutation.mutate({ id, isVisible: !currentVisibility }),
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Reviews</h1>
          <p className="text-sm text-muted-foreground">Manage customer reviews that are displayed on the home page.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-deep shadow-md">
          <Link to="/admin/reviews/new">
            <Plus className="mr-2 h-4 w-4" /> Add Review
          </Link>
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" /> All Reviews
          </CardTitle>
          <CardDescription>View, edit, delete, and control visibility of reviews.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareQuote className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No reviews found</h3>
              <p className="text-muted-foreground">Get started by creating your first customer review.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/admin/reviews/new">Add Review</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/50 text-slate-600 font-medium border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Rating</th>
                      <th className="px-4 py-3 font-semibold">Review</th>
                      <th className="px-4 py-3 font-semibold">Visible</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reviews.map((review: any) => (
                      <tr key={review._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{review.name}</span>
                            <span className="text-xs text-muted-foreground">{review.city}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn("h-3.5 w-3.5", i < review.rating ? "fill-[#F06C00] text-[#F06C00]" : "text-slate-200")}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-[300px]">
                          <p className="truncate text-slate-600" title={review.text}>
                            "{review.text}"
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Switch
                            checked={review.isVisible}
                            onCheckedChange={() => handleVisibilityToggle(review._id, review.isVisible)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                              <Link to={`/admin/reviews/${review._id}/edit`}>
                                <Edit className="h-4 w-4 text-slate-600" />
                              </Link>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDelete(review._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} reviews
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {dialogConfig && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          onConfirm={dialogConfig.action}
          variant={dialogConfig.variant}
          confirmText={dialogConfig.variant === "destructive" ? "Delete" : "Confirm"}
        />
      )}
    </div>
  );
}
