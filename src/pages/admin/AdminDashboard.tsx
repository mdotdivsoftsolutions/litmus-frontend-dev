import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart,
  Bar
} from "recharts";
import { 
  Users, 
  Building2, 
  ClipboardList, 
  IndianRupee, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  RefreshCw, 
  CreditCard, 
  Activity, 
  Package,
  Layers,
  ChevronRight
} from "lucide-react";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [chartMetric, setChartMetric] = useState<"revenue" | "bookings">("revenue");
  const [timeRange, setTimeRange] = useState<number>(14); // 7, 14, 30 days
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: statsData, isLoading: statsLoading } = useQuery({ 
    queryKey: ["adminStats"], 
    queryFn: adminApi.getStats 
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({ 
    queryKey: ["adminBookings"], 
    queryFn: () => adminApi.getBookings() 
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({ 
    queryKey: ["adminPayments"], 
    queryFn: adminApi.getPayments 
  });

  const { data: labsData, isLoading: labsLoading } = useQuery({ 
    queryKey: ["adminLabs"], 
    queryFn: adminApi.getLabs 
  });

  const isLoading = statsLoading || bookingsLoading || labsLoading || paymentsLoading;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminStats"] }),
        queryClient.invalidateQueries({ queryKey: ["adminBookings"] }),
        queryClient.invalidateQueries({ queryKey: ["adminPayments"] }),
        queryClient.invalidateQueries({ queryKey: ["adminLabs"] }),
        queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] }),
      ]);
      toast.success("Dashboard metrics synchronized with live database");
    } finally {
      setIsRefreshing(false);
    }
  };

  const rawBookings: any[] = useMemo(() => bookingsData?.data || [], [bookingsData]);
  const rawPayments: any[] = useMemo(() => paymentsData?.data || [], [paymentsData]);
  const rawLabs: any[] = useMemo(() => labsData?.data || [], [labsData]);
  const rawStats = statsData?.data || {};

  // Real live calculated KPI metrics
  const totalBookingsCount = rawBookings.length || rawStats.totalBookings || 0;
  const totalUsersCount = rawStats.totalUsers || 0;
  const totalLabsCount = rawLabs.length || rawStats.totalLabs || 0;
  const activeLabsCount = rawLabs.filter((l: any) => l.isActive !== false).length;

  // Real calculated live revenue from payments and bookings
  const calculatedRevenue = useMemo(() => {
    if (rawPayments.length > 0) {
      const successfulPayments = rawPayments.filter((p: any) => 
        p.status === "SUCCESS" || p.status === "COMPLETED" || p.status === "PAID"
      );
      if (successfulPayments.length > 0) {
        return successfulPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      }
    }
    if (rawStats.totalRevenue) return rawStats.totalRevenue;
    return rawBookings.reduce((sum: number, b: any) => {
      const bookingSum = b.items?.reduce((s: number, item: any) => s + (Number(item.price) || 0), 0) || b.totalAmount || 0;
      return sum + bookingSum;
    }, 0);
  }, [rawPayments, rawStats, rawBookings]);

  // Operational Queues
  const pendingAssignmentBookings = useMemo(() => {
    return rawBookings.filter((b: any) => {
      const status = (b.status || "").toUpperCase();
      return status === "PENDING" || !b.labId;
    });
  }, [rawBookings]);

  const pendingVerificationReports = useMemo(() => {
    return rawBookings.filter((b: any) => {
      return b.reportFiles && b.reportFiles.length > 0 && !b.isReportApprovedByAdmin;
    });
  }, [rawBookings]);

  const completedBookings = useMemo(() => {
    return rawBookings.filter((b: any) => {
      const status = (b.status || "").toUpperCase();
      return status === "COMPLETED" || b.isReportApprovedByAdmin;
    });
  }, [rawBookings]);

  const inProgressBookings = useMemo(() => {
    return rawBookings.filter((b: any) => {
      const status = (b.status || "").toUpperCase();
      return status === "IN_PROGRESS" || status === "SAMPLE_COLLECTED" || (b.labId && !b.isReportApprovedByAdmin && status !== "PENDING" && status !== "CANCELLED" && status !== "REJECTED");
    });
  }, [rawBookings]);

  // Status Distribution Data for Pie/Donut Chart
  const statusDistribution = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let cancelled = 0;

    rawBookings.forEach((b: any) => {
      const s = (b.status || "").toUpperCase();
      if (s === "COMPLETED" || b.isReportApprovedByAdmin) {
        completed++;
      } else if (s === "IN_PROGRESS" || s === "SAMPLE_COLLECTED" || s === "UNDER_TESTING") {
        inProgress++;
      } else if (s === "CANCELLED" || s === "REJECTED") {
        cancelled++;
      } else {
        pending++;
      }
    });

    const data = [
      { name: "Verified / Completed", value: completed, color: "#10B981", percent: totalBookingsCount ? Math.round((completed / totalBookingsCount) * 100) : 0 },
      { name: "In Progress / Testing", value: inProgress, color: "#3B82F6", percent: totalBookingsCount ? Math.round((inProgress / totalBookingsCount) * 100) : 0 },
      { name: "Pending Review / Lab", value: pending, color: "#F59E0B", percent: totalBookingsCount ? Math.round((pending / totalBookingsCount) * 100) : 0 },
      { name: "Cancelled / Rejected", value: cancelled, color: "#EF4444", percent: totalBookingsCount ? Math.round((cancelled / totalBookingsCount) * 100) : 0 },
    ].filter(d => d.value > 0);

    if (data.length === 0) {
      return [{ name: "No Active Bookings", value: 1, color: "#CBD5E1", percent: 100 }];
    }
    return data;
  }, [rawBookings, totalBookingsCount]);

  // Timeline Trend Generation (Live Data Aggregated by Day)
  const timelineData = useMemo(() => {
    const days: any[] = [];
    const today = new Date();

    for (let i = timeRange - 1; i >= 0; i--) {
      const targetDate = subDays(today, i);
      const dateKey = format(targetDate, "yyyy-MM-dd");
      const label = format(targetDate, "dd MMM");

      // Filter bookings created on this day
      const dayBookings = rawBookings.filter((b: any) => {
        if (!b.createdAt) return false;
        try {
          const bDate = typeof b.createdAt === "string" ? parseISO(b.createdAt) : new Date(b.createdAt);
          return isSameDay(bDate, targetDate);
        } catch {
          return false;
        }
      });

      // Filter payments created on this day
      const dayPayments = rawPayments.filter((p: any) => {
        if (!p.createdAt) return false;
        try {
          const pDate = typeof p.createdAt === "string" ? parseISO(p.createdAt) : new Date(p.createdAt);
          return isSameDay(pDate, targetDate) && (p.status === "SUCCESS" || p.status === "COMPLETED" || p.status === "PAID");
        } catch {
          return false;
        }
      });

      const dayRevenue = dayPayments.length > 0 
        ? dayPayments.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0)
        : dayBookings.reduce((s: number, b: any) => {
            const bookingAmt = b.items?.reduce((is: number, it: any) => is + (Number(it.price) || 0), 0) || b.totalAmount || 0;
            return s + bookingAmt;
          }, 0);

      const dayCompleted = dayBookings.filter((b: any) => (b.status || "").toUpperCase() === "COMPLETED" || b.isReportApprovedByAdmin).length;

      days.push({
        date: label,
        fullDate: dateKey,
        bookings: dayBookings.length,
        revenue: dayRevenue,
        completed: dayCompleted,
      });
    }
    return days;
  }, [rawBookings, rawPayments, timeRange]);

  // Top Products & Categories Breakdown
  const topProductsBreakdown = useMemo(() => {
    const productMap: Record<string, { count: number; revenue: number }> = {};
    
    rawBookings.forEach((b: any) => {
      b.items?.forEach((item: any) => {
        const name = item.samples?.[0]?.productName || item.packageId?.name || item.testId?.name || "Standard Diagnostic Package";
        const price = Number(item.price) || 0;
        if (!productMap[name]) {
          productMap[name] = { count: 0, revenue: 0 };
        }
        productMap[name].count += 1;
        productMap[name].revenue += price;
      });
    });

    const items = Object.entries(productMap).map(([name, val]) => ({
      name,
      count: val.count,
      revenue: val.revenue,
    })).sort((a, b) => b.count - a.count);

    return items.slice(0, 5);
  }, [rawBookings]);

  // Partner Labs Performance Matrix (Calculated from Real Bookings)
  const labsMatrix = useMemo(() => {
    return rawLabs.map((lab: any) => {
      const assignedBookings = rawBookings.filter((b: any) => {
        const labId = b.labId?._id || b.labId;
        return labId && String(labId) === String(lab._id);
      });

      const completed = assignedBookings.filter((b: any) => 
        (b.status || "").toUpperCase() === "COMPLETED" || b.isReportApprovedByAdmin
      ).length;

      const totalRevenue = assignedBookings.reduce((sum: number, b: any) => {
        return sum + (b.items?.reduce((is: number, it: any) => is + (Number(it.price) || 0), 0) || 0);
      }, 0);

      const capacityRate = Math.min(100, Math.round((assignedBookings.length / (lab.capacity || 20)) * 100));

      return {
        id: lab._id,
        name: lab.labName || "Accredited Testing Facility",
        city: lab.city || lab.address?.city || "National Network",
        state: lab.state || lab.address?.state || "India",
        isActive: lab.isActive !== false,
        totalAssigned: assignedBookings.length,
        completed,
        totalRevenue,
        capacityRate,
      };
    }).sort((a: any, b: any) => b.totalAssigned - a.totalAssigned);
  }, [rawLabs, rawBookings]);

  // Recent 5 Transactions
  const recentTransactions = useMemo(() => {
    return rawPayments.slice(0, 5).map((p: any) => {
      const booking = p.bookingId;
      const userName = booking?.userId 
        ? `${booking.userId.firstName || ''} ${booking.userId.lastName || ''}`.trim() || booking.userId.email
        : "Customer";
      const bookingDisplayId = booking?._id ? `BKG-${booking._id.substring(booking._id.length - 6).toUpperCase()}` : "Order";

      return {
        id: p._id,
        transactionId: p.razorpayPaymentId || p.transactionId || `TXN-${p._id.substring(p._id.length - 8).toUpperCase()}`,
        bookingDisplayId,
        userName,
        amount: Number(p.amount) || 0,
        status: p.status || "SUCCESS",
        method: p.paymentMethod || "Online / UPI",
        date: p.createdAt ? format(new Date(p.createdAt), "MMM d, h:mm a") : "Recent",
      };
    });
  }, [rawPayments]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <Skeleton className="h-7 w-44 bg-muted/70" />
            <Skeleton className="h-4 w-72 bg-muted/50" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 bg-muted/60" />
            <Skeleton className="h-9 w-32 bg-muted/60" />
          </div>
        </div>
        
        {/* KPI Skeleton Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border border-border/80 shadow-xs p-4 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2.5">
                <Skeleton className="h-8 w-8 rounded-md bg-muted/60" />
                <Skeleton className="h-4 w-12 rounded-full bg-muted/50" />
              </div>
              <Skeleton className="h-7 w-24 mb-1 bg-muted/60" />
              <Skeleton className="h-3 w-16 bg-muted/40" />
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2 border border-border/80 shadow-xs bg-white p-5 rounded-lg">
            <Skeleton className="h-5 w-44 mb-4 bg-muted/60" />
            <Skeleton className="h-[260px] w-full rounded-md bg-muted/40" />
          </Card>
          <Card className="border border-border/80 shadow-xs bg-white p-5 rounded-lg">
            <Skeleton className="h-5 w-36 mb-4 bg-muted/60" />
            <Skeleton className="h-[260px] w-full rounded-full bg-muted/40" />
          </Card>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Customers",
      value: totalUsersCount.toLocaleString(),
      subtitle: "Registered users & clients",
      icon: Users,
      badgeText: "Active",
    },
    {
      title: "Partner Laboratories",
      value: totalLabsCount.toLocaleString(),
      subtitle: `${activeLabsCount} active testing labs`,
      icon: Building2,
      badgeText: "NABL / ISO",
    },
    {
      title: "Total Bookings",
      value: totalBookingsCount.toLocaleString(),
      subtitle: `${completedBookings.length} completed · ${inProgressBookings.length} active`,
      icon: ClipboardList,
      badgeText: "Total",
    },
    {
      title: "Gross Revenue",
      value: `₹${calculatedRevenue.toLocaleString('en-IN')}`,
      subtitle: "Digital collections",
      icon: IndianRupee,
      badgeText: "Live",
    },
    {
      title: "Actions Required",
      value: (pendingAssignmentBookings.length + pendingVerificationReports.length).toString(),
      subtitle: `${pendingAssignmentBookings.length} pending · ${pendingVerificationReports.length} reports`,
      icon: AlertCircle,
      badgeText: pendingAssignmentBookings.length + pendingVerificationReports.length > 0 ? "Pending" : "Clear",
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time operations, booking pipelines, laboratory capacity, and financial summaries.
          </p>
        </div>

        {/* Action Shortcut Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 h-8 text-xs bg-white hover:bg-slate-50 text-slate-700 border-border/80 rounded-md shadow-2xs"
          >
            <RefreshCw className={cn("h-3 w-3 text-muted-foreground", isRefreshing && "animate-spin text-primary")} />
            {isRefreshing ? "Syncing..." : "Sync"}
          </Button>

          <Button 
            size="sm" 
            asChild
            className="gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90 text-white rounded-md shadow-2xs"
          >
            <Link to="/admin/reports">
              <FileCheck2 className="h-3.5 w-3.5" />
              Verify Reports ({pendingVerificationReports.length})
            </Link>
          </Button>

          <Button 
            size="sm" 
            variant="secondary"
            asChild
            className="gap-1.5 h-8 text-xs rounded-md shadow-2xs"
          >
            <Link to="/admin/bookings">
              <ClipboardList className="h-3.5 w-3.5" />
              Bookings
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - Clean, Unified, Subtle Radius */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card 
            key={kpi.title} 
            className="bg-white border border-border/80 rounded-lg shadow-2xs hover:shadow-xs transition-shadow duration-150 relative"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                  <kpi.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                  {kpi.badgeText}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                <p className="text-xs font-medium text-slate-600">{kpi.title}</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Timeline Chart (Revenue & Bookings Trend) */}
        <Card className="lg:col-span-2 bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/40 p-4">
            <div>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                {chartMetric === "revenue" ? "Revenue Timeline" : "Orders Activity"}
              </CardTitle>
              <CardDescription className="text-[11px]">
                Real-time activity aggregated over the last {timeRange} days.
              </CardDescription>
            </div>

            {/* Metric & Time Toggle */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="bg-slate-100 p-0.5 rounded-md border border-slate-200/80 flex text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setChartMetric("revenue")}
                  className={cn(
                    "px-2.5 py-0.5 rounded transition-all",
                    chartMetric === "revenue" ? "bg-white text-primary shadow-2xs font-semibold" : "text-slate-600 hover:text-foreground"
                  )}
                >
                  Revenue (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric("bookings")}
                  className={cn(
                    "px-2.5 py-0.5 rounded transition-all",
                    chartMetric === "bookings" ? "bg-white text-primary shadow-2xs font-semibold" : "text-slate-600 hover:text-foreground"
                  )}
                >
                  Orders Count
                </button>
              </div>

              <div className="bg-slate-100 p-0.5 rounded-md border border-slate-200/80 flex text-[11px] font-medium">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTimeRange(days)}
                    className={cn(
                      "px-2 py-0.5 rounded transition-all",
                      timeRange === days ? "bg-white text-foreground shadow-2xs font-semibold" : "text-slate-500 hover:text-foreground"
                    )}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-4">
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMetric === "revenue" ? (
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="liveRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00751F" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00751F" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: "#64748B" }} 
                      axisLine={{ stroke: "#E2E8F0" }} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#64748B" }} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1 border border-slate-800">
                              <p className="font-semibold text-slate-300">{data.fullDate} ({label})</p>
                              <p className="text-emerald-400 font-bold text-sm">
                                Revenue: ₹{Number(data.revenue).toLocaleString('en-IN')}
                              </p>
                              <p className="text-slate-300 text-[11px]">
                                Orders: <span className="font-medium text-white">{data.bookings}</span> · Completed: <span className="font-medium text-white">{data.completed}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#00751F" 
                      strokeWidth={2} 
                      fill="url(#liveRevenueGrad)" 
                      dot={{ r: 2.5, fill: "#00751F", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#00751F" }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: "#64748B" }} 
                      axisLine={{ stroke: "#E2E8F0" }} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#64748B" }} 
                      axisLine={false} 
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1 border border-slate-800">
                              <p className="font-semibold text-slate-300">{data.fullDate} ({label})</p>
                              <p className="text-sky-400 font-bold text-sm">
                                Orders: {data.bookings}
                              </p>
                              <p className="text-emerald-400 font-medium text-[11px]">
                                Revenue: ₹{Number(data.revenue).toLocaleString('en-IN')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="bookings" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Donut Chart */}
        <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Order Pipeline Distribution
              </CardTitle>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {totalBookingsCount} Total
              </span>
            </div>
            <CardDescription className="text-[11px]">
              Breakdown across testing stages and completion.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="h-[185px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-xs shadow-md border border-slate-800">
                            <span className="font-semibold">{item.name}:</span> {item.value} ({item.percent}%)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-foreground">{totalBookingsCount}</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">Orders</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-1.5 w-full pt-2.5 border-t border-slate-100 text-xs">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-1 rounded bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-slate-700 text-[10px]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground text-[10px] shrink-0 ml-1">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Section: Tabs for Queues, Labs, Top Tests, and Payments */}
      <div className="space-y-3">
        <Tabs defaultValue="urgent" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded-lg border border-border/80 shadow-2xs">
            <TabsList className="bg-slate-100 p-0.5 rounded-md">
              <TabsTrigger value="urgent" className="gap-1.5 text-xs py-1">
                <AlertCircle className="h-3 w-3 text-rose-600" />
                Urgent Actions ({pendingAssignmentBookings.length + pendingVerificationReports.length})
              </TabsTrigger>
              <TabsTrigger value="labs" className="gap-1.5 text-xs py-1">
                <Building2 className="h-3 w-3 text-sky-600" />
                Partner Labs ({rawLabs.length})
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5 text-xs py-1">
                <Package className="h-3 w-3 text-amber-600" />
                Top Packages
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-1.5 text-xs py-1">
                <CreditCard className="h-3 w-3 text-emerald-600" />
                Payments ({rawPayments.length})
              </TabsTrigger>
            </TabsList>

            <Button variant="ghost" size="sm" asChild className="text-xs text-primary font-medium h-7 px-2">
              <Link to="/admin/bookings" className="flex items-center gap-1">
                Manage All Bookings <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* TAB 1: Urgent Action Items */}
          <TabsContent value="urgent" className="space-y-4 mt-3">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* 1. Pending Assignment */}
              <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden">
                <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      Pending Lab Assignment
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Orders placed by customers requiring lab allocation.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] px-1.5 py-0.5">
                    {pendingAssignmentBookings.length} Pending
                  </Badge>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/70 text-[10px]">
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product / Test</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingAssignmentBookings.slice(0, 5).map((b: any) => {
                        const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
                        const userName = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.trim() || b.userId?.email || 'Customer';
                        const productName = b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || b.items?.[0]?.testId?.name || "Service Item";
                        const total = b.items?.reduce((s: number, i: any) => s + (Number(i.price) || 0), 0) || b.totalAmount || 0;

                        return (
                          <TableRow key={b._id} className="hover:bg-slate-50/80 text-xs">
                            <TableCell className="font-mono font-semibold text-primary">{displayId}</TableCell>
                            <TableCell className="font-medium text-slate-800">{userName}</TableCell>
                            <TableCell className="text-slate-600 max-w-[130px] truncate">{productName}</TableCell>
                            <TableCell className="font-semibold text-foreground">₹{total.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="default" className="h-6 text-[11px] px-2 bg-primary hover:bg-primary/90 text-white rounded" asChild>
                                <Link to={`/admin/bookings`}>
                                  Assign
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {pendingAssignmentBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              <p className="font-semibold text-foreground text-xs">All bookings assigned</p>
                              <p className="text-[10px]">No orders currently waiting for lab routing.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 2. Quality Control & Report Verification Queue */}
              <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden">
                <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                      Reports Pending Sign-off
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Uploaded test reports requiring admin publication.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] px-1.5 py-0.5">
                    {pendingVerificationReports.length} To Verify
                  </Badge>
                </CardHeader>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/70 text-[10px]">
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Testing Lab</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Files</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingVerificationReports.slice(0, 5).map((b: any) => {
                        const displayId = `BKG-${b._id.substring(b._id.length - 6).toUpperCase()}`;
                        const labName = b.labId?.labName || "Litmus Lab";
                        const productName = b.items?.[0]?.samples?.[0]?.productName || b.items?.[0]?.packageId?.name || "Sample Test";

                        return (
                          <TableRow key={b._id} className="hover:bg-slate-50/80 text-xs">
                            <TableCell className="font-mono font-semibold text-primary">{displayId}</TableCell>
                            <TableCell className="font-medium text-slate-800 truncate max-w-[120px]">{labName}</TableCell>
                            <TableCell className="text-slate-600 truncate max-w-[120px]">{productName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                {b.reportFiles?.length || 1} doc(s)
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" className="h-6 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded" asChild>
                                <Link to="/admin/reports">
                                  Review
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {pendingVerificationReports.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-xs">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              <p className="font-semibold text-foreground text-xs">Verification queue is clear</p>
                              <p className="text-[10px]">All uploaded reports are approved and published.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: Partner Laboratories Matrix */}
          <TabsContent value="labs" className="mt-3">
            <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden">
              <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-sky-600" />
                    Accredited Testing Facilities Performance
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Live test assignment volume and active laboratory utilization.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild className="text-xs h-7 rounded">
                  <Link to="/admin/labs">Manage Labs</Link>
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/70 text-[10px]">
                      <TableHead>Laboratory Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Tests</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Active Load</TableHead>
                      <TableHead className="text-right">Processed Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labsMatrix.slice(0, 6).map((lab) => (
                      <TableRow key={lab.id} className="hover:bg-slate-50/80 text-xs">
                        <TableCell className="font-semibold text-slate-800">{lab.name}</TableCell>
                        <TableCell className="text-slate-600">{lab.city}, {lab.state}</TableCell>
                        <TableCell>
                          <Badge variant={lab.isActive ? "approved" : "rejected"} className="text-[10px] py-0 px-1.5">
                            {lab.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{lab.totalAssigned} bookings</TableCell>
                        <TableCell className="font-medium text-emerald-700">{lab.completed} done</TableCell>
                        <TableCell className="w-44">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>Load</span>
                              <span>{lab.capacityRate}%</span>
                            </div>
                            <Progress value={lab.capacityRate} className="h-1 w-full" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          ₹{lab.totalRevenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {labsMatrix.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                          No accredited labs registered in the network.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Top Diagnostic Packages */}
          <TabsContent value="products" className="mt-3">
            <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden">
              <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-amber-600" />
                    Top Demanded Testing Packages
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Highest demanded tests and safety profiles.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild className="text-xs h-7 rounded">
                  <Link to="/admin/packages">All Packages</Link>
                </Button>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topProductsBreakdown.map((item, idx) => (
                    <div key={item.name} className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">#{idx + 1}</span>
                        <Badge variant="secondary" className="text-[10px] font-semibold py-0 px-1.5">
                          {item.count} Orders
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground text-xs truncate" title={item.name}>{item.name}</p>
                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 text-[11px]">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-bold text-emerald-700">₹{item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {topProductsBreakdown.length === 0 && (
                    <p className="col-span-3 text-center py-6 text-xs text-muted-foreground">
                      No product order data available yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Live Payments Feed */}
          <TabsContent value="transactions" className="mt-3">
            <Card className="bg-white border border-border/80 rounded-lg shadow-2xs overflow-hidden">
              <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Live transaction logs synchronized with payment gateway.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild className="text-xs h-7 rounded">
                  <Link to="/admin/payments">Payment Ledger</Link>
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/70 text-[10px]">
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50/80 text-xs">
                        <TableCell className="font-mono text-slate-700 font-semibold">{tx.transactionId}</TableCell>
                        <TableCell className="font-mono text-primary font-medium">{tx.bookingDisplayId}</TableCell>
                        <TableCell className="font-medium text-slate-800">{tx.userName}</TableCell>
                        <TableCell className="text-slate-600">{tx.method}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status === "SUCCESS" || tx.status === "COMPLETED" ? "Approved" : tx.status} />
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-700">
                          ₹{tx.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                          No payment transactions recorded.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
