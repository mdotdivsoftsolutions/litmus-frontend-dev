import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PortalLayout } from "@/components/layout/PortalLayout";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const EmployeeManagement = lazy(() => import("./pages/admin/EmployeeManagement.tsx"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement.tsx"));
const UserDetailsPage = lazy(() => import("./pages/admin/UserDetailsPage.tsx"));
const LabManagement = lazy(() => import("./pages/admin/LabManagement.tsx"));
const LabFormPage = lazy(() => import("./pages/admin/LabFormPage.tsx"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings.tsx"));
const AdminBookingDetails = lazy(() => import("./pages/admin/AdminBookingDetails.tsx"));
const CategoryManagement = lazy(() => import("./pages/admin/CategoryManagement.tsx"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement.tsx"));
const ProductFormPage = lazy(() => import("./pages/admin/ProductFormPage.tsx"));
const TestManagement = lazy(() => import("./pages/admin/TestManagement.tsx"));
const TestFormPage = lazy(() => import("./pages/admin/TestFormPage.tsx"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments.tsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.tsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.tsx"));
const ReviewManagement = lazy(() => import("./pages/admin/ReviewManagement.tsx"));
const ReviewFormPage = lazy(() => import("./pages/admin/ReviewFormPage.tsx"));
const AdminApprovals = lazy(() => import("./pages/admin/AdminApprovals.tsx"));
const PackageManagement = lazy(() => import("./pages/admin/PackageManagement.tsx"));
const PackageFormPage = lazy(() => import("./pages/admin/PackageFormPage.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminConsultations = lazy(() => import("./pages/admin/AdminConsultations.tsx"));
const CategoryFormPage = lazy(() => import("./pages/admin/CategoryFormPage.tsx"));
const LaboratoryDetailPage = lazy(() => import("./pages/admin/LaboratoryDetailPage.tsx"));
const LiveSupportPage = lazy(() => import("./pages/admin/LiveSupportPage.tsx"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/AdminNotificationsPage.tsx"));
import { SocketProvider } from "./context/SocketContext.tsx";


// Data younger than 30s is reused on mount / window focus instead of refetched every time.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SocketProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
            <Routes>
            {/* Public Auth */}
            <Route path="/admin/login" element={<LoginPage role="admin" />} />
            
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin Portal */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]} />}>
              <Route element={<PortalLayout portal="admin" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="live-support" element={<LiveSupportPage />} />

                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:id" element={<UserDetailsPage />} />
                <Route path="laboratories" element={<LabManagement />} />
                <Route path="laboratories/new" element={<LabFormPage />} />
                <Route path="laboratories/:id" element={<LaboratoryDetailPage />} />
                <Route path="laboratories/:id/edit" element={<LabFormPage />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="bookings/:id" element={<AdminBookingDetails />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="categories/new" element={<CategoryFormPage />} />
                <Route path="categories/:id/edit" element={<CategoryFormPage />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                <Route path="tests" element={<TestManagement />} />
                <Route path="tests/new" element={<TestFormPage />} />
                <Route path="tests/:id/edit" element={<TestFormPage />} />
                <Route path="packages" element={<PackageManagement />} />
                <Route path="packages/new" element={<PackageFormPage />} />
                <Route path="packages/:id/edit" element={<PackageFormPage />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<ReviewManagement />} />
                <Route path="reviews/new" element={<ReviewFormPage />} />
                <Route path="reviews/:id/edit" element={<ReviewFormPage />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="approvals" element={<AdminApprovals />} />
                <Route path="consultations" element={<AdminConsultations />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </SocketProvider>
  </QueryClientProvider>
);

export default App;
