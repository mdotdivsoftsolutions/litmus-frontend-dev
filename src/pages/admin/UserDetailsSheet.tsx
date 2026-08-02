import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

export function UserDetailsSheet({ userId, open, onOpenChange }: { userId: string | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["adminUserDetailed", userId],
    queryFn: () => adminApi.getUserDetailedProfile(userId!),
    enabled: !!userId,
  });

  const detailedData = response?.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-[700px] w-[90vw]">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {detailedData && (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl">{detailedData.user.firstName} {detailedData.user.lastName}</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{detailedData.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{detailedData.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {detailedData.user.isActive ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">Inactive</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{detailedData.user.createdAt ? format(new Date(detailedData.user.createdAt), "MMM d, yyyy") : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{detailedData.user.lastLoginAt ? format(new Date(detailedData.user.lastLoginAt), "MMM d, yyyy HH:mm") : "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{detailedData.stats.totalBookings}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Bookings</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{detailedData.stats.completedBookings}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">{detailedData.stats.pendingBookings}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-brand mt-1">{formatCurrency(detailedData.stats.totalAmountPaid)}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
                </div>
              </div>

              <Tabs defaultValue="bookings">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="cart">Abandoned Cart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings" className="mt-4">
                  {detailedData.bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No bookings found</p>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Lab</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailedData.bookings.map((booking: any) => (
                            <TableRow key={booking._id}>
                              <TableCell>{format(new Date(booking.createdAt), "MMM d, yyyy")}</TableCell>
                              <TableCell>{booking.labId?.labName || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{booking.status}</Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  {detailedData.payments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No payments found</p>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailedData.payments.map((payment: any) => (
                            <TableRow key={payment._id}>
                              <TableCell>{format(new Date(payment.createdAt), "MMM d, yyyy")}</TableCell>
                              <TableCell className="font-mono text-xs">{payment.razorpayOrderId}</TableCell>
                              <TableCell>
                                <Badge variant={payment.status === 'SUCCESS' ? 'default' : 'destructive'} className={payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : ''}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cart" className="mt-4">
                  {!detailedData.cart || !detailedData.cart.items || detailedData.cart.items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Cart is currently empty</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Added On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailedData.cart.items.map((item: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {item.itemType === 'TEST' ? item.testId?.name || item.testId?.testName : item.packageId?.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.itemType}</Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>
                                {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
