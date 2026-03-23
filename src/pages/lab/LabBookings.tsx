import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { bookings } from "@/lib/placeholder-data";

export default function LabBookings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="new">New</TabsTrigger><TabsTrigger value="inprogress">In Progress</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger><TabsTrigger value="all">All</TabsTrigger></TabsList>
        {["all", "new", "inprogress", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="border-0 shadow-sm overflow-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Booking ID</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Tests</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {bookings.filter((b) => tab === "all" || (tab === "new" && b.status === "Pending") || (tab === "inprogress" && b.status === "In Progress") || (tab === "completed" && b.status === "Completed")).map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.id}</TableCell>
                      <TableCell>{b.user}</TableCell>
                      <TableCell>{b.product}</TableCell>
                      <TableCell><Badge variant="secondary">{b.testsCount}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{b.date}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" asChild><Link to={`/lab/bookings/${b.id}/upload`}>Upload</Link></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
