import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, MapPin, LayoutGrid, List } from "lucide-react";
import { labApi } from "@/lib/api/lab";

export default function LaboratoriesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [accreditationFilter, setAccreditationFilter] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["publicLabs"],
    queryFn: () => labApi.getLabsPublic(),
  });

  const labs = response?.data || [];

  const filtered = labs.filter((lab: any) => {
    const matchesSearch = !search || lab.labName.toLowerCase().includes(search.toLowerCase()) || lab.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === "all" || lab.location?.city === cityFilter;
    const matchesAccreditation = accreditationFilter === "all" || 
      (accreditationFilter === "nabl" && lab.isNablAccredited) ||
      (accreditationFilter === "fssai" && lab.isFssaiApproved);
    
    return matchesSearch && matchesCity && matchesAccreditation;
  });

  const getLowestPrice = (pricing?: Record<string, number>) => {
    if (!pricing || Object.keys(pricing).length === 0) return 'N/A';
    return `₹${Math.min(...Object.values(pricing))}`;
  };

  const getRating = (reviews?: any[]) => {
    if (!reviews || reviews.length === 0) return 'New';
    return (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  };

  const renderGridSkeleton = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full ml-auto" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <Card className="border-0 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lab Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Accreditation</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Price From</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-5 w-12" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Laboratories</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search labs by name or city..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Accreditation" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="nabl">NABL Accredited</SelectItem>
            <SelectItem value="fssai">FSSAI Approved</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 shrink-0">
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {isLoading ? (
        view === "grid" ? renderGridSkeleton() : renderListSkeleton()
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-xl bg-white shadow-sm border-dashed">
          No laboratories found matching your criteria.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lab: any) => (
            <Card key={lab._id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground line-clamp-1" title={lab.labName}>{lab.labName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{lab.location?.city || "Unknown"}
                </div>
                <div className="flex items-center gap-2">
                  {lab.isNablAccredited && <Badge variant="approved" className="bg-[#D32F2F] text-white hover:bg-[#D32F2F]/90">NABL</Badge>}
                  {lab.isFssaiApproved && <Badge variant="completed">FSSAI</Badge>}
                  <div className="ml-auto flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
                    <span className="text-sm font-medium">{getRating(lab.reviews)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">From {getLowestPrice(lab.pricing)}</span>
                  <Button size="sm" asChild className="bg-primary hover:bg-primary-deep"><Link to={`/dashboard/laboratories/${lab._id}`}>View Lab</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lab Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Accreditation</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price From</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lab: any) => (
                <TableRow key={lab._id}>
                  <TableCell className="font-medium max-w-[200px] truncate" title={lab.labName}>{lab.labName}</TableCell>
                  <TableCell>{lab.location?.city || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {lab.isNablAccredited && <Badge variant="approved" className="bg-[#D32F2F] text-white hover:bg-[#D32F2F]/90">NABL</Badge>}
                      {lab.isFssaiApproved && <Badge variant="completed">FSSAI</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-status-pending text-status-pending" />
                      {getRating(lab.reviews)}
                    </div>
                  </TableCell>
                  <TableCell>{getLowestPrice(lab.pricing)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary-deep hover:bg-primary/10">
                      <Link to={`/dashboard/laboratories/${lab._id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
