import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

export default function AdminBookings() {
  const [search, setSearch] = useState("");

  const renderTable = (items: typeof bookings) => (
    <Card className="border-0 shadow-sm overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Tests</TableHead>
            <TableHead className="hidden md:table-cell">Lab</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.filter((b) => !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.user.toLowerCase().includes(search.toLowerCase())).map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.id}</TableCell>
              <TableCell>{b.user}</TableCell>
              <TableCell>{b.product}</TableCell>
              <TableCell className="hidden md:table-cell"><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{b.lab.split(" ").slice(0, 2).join(" ")}</TableCell>
              <TableCell><StatusBadge status={b.paymentStatus === "Paid" ? "Approved" : b.paymentStatus === "Refunded" ? "Rejected" : "Pending"} /></TableCell>
              <TableCell><StatusBadge status={b.status} /></TableCell>
              <TableCell><Button variant="ghost" size="sm" asChild><Link to={`/admin/bookings/${b.id}`}>View</Link></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Booking Management</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search bookings..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">{renderTable(bookings)}</TabsContent>
        <TabsContent value="pending" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Pending"))}</TabsContent>
        <TabsContent value="approved" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Approved"))}</TabsContent>
        <TabsContent value="inprogress" className="mt-4">{renderTable(bookings.filter((b) => b.status === "In Progress"))}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Completed"))}</TabsContent>
        <TabsContent value="rejected" className="mt-4">{renderTable(bookings.filter((b) => b.status === "Rejected"))}</TabsContent>
      </Tabs>
    </div>
  );
}
