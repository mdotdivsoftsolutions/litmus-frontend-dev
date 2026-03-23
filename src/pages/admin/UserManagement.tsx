import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Eye, CheckCircle2, XCircle } from "lucide-react";
import { users } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.fssai.includes(search));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">User Management</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or FSSAI..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Business</TableHead>
              <TableHead className="hidden md:table-cell">FSSAI No</TableHead>
              <TableHead className="hidden sm:table-cell">Mobile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{u.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.business}</TableCell>
                <TableCell className="hidden md:table-cell text-sm font-mono">{u.fssai}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{u.mobile}</TableCell>
                <TableCell><StatusBadge status={u.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                <TableCell>
                  <Sheet>
                    <SheetTrigger asChild><Button variant="ghost" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" />View</Button></SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                      <SheetHeader><SheetTitle>{u.name}</SheetTitle></SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="text-sm space-y-2">
                          <p><span className="text-muted-foreground">Business:</span> {u.business}</p>
                          <p><span className="text-muted-foreground">FSSAI:</span> {u.fssai}</p>
                          <p><span className="text-muted-foreground">Mobile:</span> {u.mobile}</p>
                          <p><span className="text-muted-foreground">Status:</span> <StatusBadge status={u.status} /></p>
                          <p><span className="text-muted-foreground">Joined:</span> {u.joined}</p>
                        </div>
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Documents</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <span className="text-sm">FSSAI Certificate</span>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-status-approved"><CheckCircle2 className="h-3 w-3 mr-1" />Approve</Button>
                                <Button size="sm" variant="outline" className="h-7 text-status-rejected"><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                              <span className="text-sm">GST Certificate</span>
                              <Badge variant="approved">Approved</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Booking History</h4>
                          <p className="text-sm text-muted-foreground">12 bookings · 8 completed · ₹45,600 total</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Verify User</Button>
                          <Button size="sm" variant="outline" className="text-destructive">Deactivate</Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
