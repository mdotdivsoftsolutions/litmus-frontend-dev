import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mail, Phone, Calendar, Clock, ShoppingCart, CreditCard, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsPage() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminUserDetailed", userId],
    queryFn: () => adminApi.getUserDetailedProfile(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in mx-auto pb-10 w-full">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Card Skeleton */}
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full max-w-[180px]" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats & Activity Skeleton */}
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center justify-center space-y-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-sm border-0 ring-1 ring-border">
              <div className="px-6 pt-4 border-b bg-muted/20 flex gap-2">
                <Skeleton className="h-10 w-24 rounded-t-lg rounded-b-none" />
                <Skeleton className="h-10 w-24 rounded-t-lg rounded-b-none" />
                <Skeleton className="h-10 w-24 rounded-t-lg rounded-b-none" />
              </div>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const detailedData = response?.data;

  if (!detailedData) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <Button onClick={() => navigate("/admin/users")}>Back to Users</Button>
      </div>
    );
  }

  const { user, stats, bookings, payments, cart } = detailedData;

  return (
    <div className="space-y-6 animate-fade-in mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {user.firstName} {user.lastName}
            {user.isActive ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">Active</Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-700 ml-2">Inactive</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">User Profile & Activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 h-fit shadow-sm">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Email</p>
                <p className="truncate font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Phone</p>
                <p className="font-medium">{user.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Joined</p>
                <p className="font-medium">{user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Last Login</p>
                <p className="font-medium">{user.lastLoginAt ? format(new Date(user.lastLoginAt), "MMM d, yyyy HH:mm") : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Total Bookings</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-full">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-700">{stats.completedBookings}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">{stats.pendingBookings}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-brand/20 bg-brand/5">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-brand/10 text-brand rounded-full">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand">{formatCurrency(stats.totalAmountPaid)}</p>
                  <p className="text-[10px] text-brand/70 uppercase font-bold tracking-wider mt-1">Total Paid</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-0 ring-1 ring-border">
            <CardContent className="p-0">
              <Tabs defaultValue="bookings" className="w-full">
                <div className="px-6 pt-4 border-b bg-muted/20">
                  <TabsList className="grid w-full max-w-md grid-cols-3 bg-transparent h-12">
                    <TabsTrigger value="bookings" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none h-full border-b-2 border-transparent data-[state=active]:border-primary">Bookings</TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none h-full border-b-2 border-transparent data-[state=active]:border-primary">Payments</TabsTrigger>
                    <TabsTrigger value="cart" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none h-full border-b-2 border-transparent data-[state=active]:border-primary">
                      <span className="flex items-center gap-2">
                        Cart 
                        {cart?.items?.length > 0 && (
                          <Badge variant="secondary" className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 min-w-[20px]">
                            {cart.items.length}
                          </Badge>
                        )}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-0">
                  <TabsContent value="bookings" className="m-0">
                    {bookings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                        <div className="bg-muted p-4 rounded-full mb-4">
                          <Calendar className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="font-medium text-foreground">No bookings found</p>
                        <p className="text-sm mt-1">This user hasn't made any bookings yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead className="pl-6">Date</TableHead>
                              <TableHead>Lab</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right pr-6">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings.map((booking: any) => (
                              <TableRow key={booking._id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate(`/admin/bookings/${booking._id}`)}>
                                <TableCell className="font-medium pl-6">{format(new Date(booking.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>{booking.labId?.labName || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge variant={booking.status === 'COMPLETED' ? 'default' : 'outline'} 
                                         className={booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''}>
                                    {booking.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium pr-6">{formatCurrency(booking.totalAmount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payments" className="m-0">
                    {payments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                        <div className="bg-muted p-4 rounded-full mb-4">
                          <CreditCard className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="font-medium text-foreground">No payments recorded</p>
                        <p className="text-sm mt-1">This user has no payment history.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead className="pl-6">Date</TableHead>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right pr-6">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payments.map((payment: any) => (
                              <TableRow key={payment._id}>
                                <TableCell className="pl-6">{format(new Date(payment.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{payment.razorpayOrderId}</TableCell>
                                <TableCell>
                                  <Badge variant={payment.status === 'SUCCESS' ? 'default' : 'destructive'} 
                                         className={payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-transparent' : ''}>
                                    {payment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-medium pr-6">{formatCurrency(payment.amount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="cart" className="m-0">
                    {!cart || !cart.items || cart.items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                        <div className="bg-muted p-4 rounded-full mb-4">
                          <ShoppingCart className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="font-medium text-foreground">Cart is empty</p>
                        <p className="text-sm mt-1">The user doesn't have any items in their cart.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead className="pl-6">Item</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Added On</TableHead>
                              <TableHead className="text-right pr-6">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cart.items.map((item: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium pl-6">
                                  {item.itemType === 'TEST' ? item.testId?.name || item.testId?.testName : item.packageId?.name}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-background">{item.itemType}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                                </TableCell>
                                <TableCell className="text-right font-medium pr-6">{formatCurrency(item.price)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
