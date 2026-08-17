import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, MessageSquareQuote, Star, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ReviewManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
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

  const rawReviews = response?.data || [];
  const total = response?.total || 0;

  // Client-side filtering for fast interactive feedback
  const filteredReviews = rawReviews.filter((r: any) => {
    const textMatch = !search || 
      (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.city && r.city.toLowerCase().includes(search.toLowerCase())) ||
      (r.text && r.text.toLowerCase().includes(search.toLowerCase()));

    const ratingMatch = ratingFilter === "all" || String(r.rating) === ratingFilter;
    const visibilityMatch = visibilityFilter === "all" ||
      (visibilityFilter === "visible" && r.isVisible !== false) ||
      (visibilityFilter === "hidden" && r.isVisible === false);

    return textMatch && ratingMatch && visibilityMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / limit));
  const paginatedReviews = filteredReviews.slice((page - 1) * limit, page * limit);

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
    <div className="space-y-6 animate-fade-in pb-20 mx-auto">
      {/* Title Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Reviews</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage testimonials, ratings, customer feedback, and public home page visibility.
          </p>
        </div>
      </div>

      {/* Single-Line Controls: Search + Filters + Add Review Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[260px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search reviews by customer, city, text..." 
              className="pl-9 bg-white border border-slate-200 shadow-sm h-10 text-xs sm:text-sm" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }} 
            />
          </div>

          {/* Rating Filter */}
          <Select
            value={ratingFilter}
            onValueChange={(val) => {
              setRatingFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-white border border-slate-200 shadow-sm h-10 text-xs font-medium">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars ★</SelectItem>
              <SelectItem value="4">4 Stars ★</SelectItem>
              <SelectItem value="3">3 Stars ★</SelectItem>
              <SelectItem value="2">2 Stars ★</SelectItem>
              <SelectItem value="1">1 Star ★</SelectItem>
            </SelectContent>
          </Select>

          {/* Visibility Filter */}
          <Select
            value={visibilityFilter}
            onValueChange={(val) => {
              setVisibilityFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-white border border-slate-200 shadow-sm h-10 text-xs font-medium">
              <SelectValue placeholder="All Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="visible">Visible Only</SelectItem>
              <SelectItem value="hidden">Hidden Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Primary Styled Add Review Button */}
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm h-10 px-4 gap-2 self-start lg:self-auto">
          <Link to="/admin/reviews/new">
            <Plus className="h-4 w-4" /> Add Review
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border border-border shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="py-3 px-4 text-xs">Customer</TableHead>
                <TableHead className="py-3 px-4 text-xs">Rating</TableHead>
                <TableHead className="py-3 px-4 text-xs">Review Feedback</TableHead>
                <TableHead className="py-3 px-4 text-xs">Public Visibility</TableHead>
                <TableHead className="py-3 px-4 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MessageSquareQuote className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-800">No customer reviews found</span>
                      <span className="text-xs">Add client testimonials to highlight credibility on the homepage.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReviews.map((review: any) => (
                  <TableRow key={review._id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-slate-900">{review.name}</span>
                        <span className="text-[11px] text-muted-foreground">{review.city || "India"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn("h-3.5 w-3.5", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 max-w-[340px]">
                      <p className="text-xs text-slate-700 truncate" title={review.text}>
                        "{review.text}"
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={review.isVisible}
                          onCheckedChange={() => handleVisibilityToggle(review._id, review.isVisible)}
                        />
                        <span className={cn("text-xs font-medium", review.isVisible ? "text-emerald-700" : "text-slate-400")}>
                          {review.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button asChild variant="outline" size="icon" className="h-8 w-8 bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
                          <Link to={`/admin/reviews/${review._id}/edit`}>
                            <Edit className="h-3.5 w-3.5 text-slate-600" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-white border border-slate-200 shadow-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {!isLoading && filteredReviews.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-slate-50/50">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, filteredReviews.length)}</span> of <span className="font-medium text-foreground">{filteredReviews.length}</span> reviews
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border border-slate-200 shadow-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-xs font-medium px-2">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border border-slate-200 shadow-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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
