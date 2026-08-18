import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
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
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import EmployeeManagement from "./pages/admin/EmployeeManagement.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import UserDetailsPage from "./pages/admin/UserDetailsPage.tsx";
import LabManagement from "./pages/admin/LabManagement.tsx";
import LabFormPage from "./pages/admin/LabFormPage.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminBookingDetails from "./pages/admin/AdminBookingDetails.tsx";
import CategoryManagement from "./pages/admin/CategoryManagement.tsx";
import ProductManagement from "./pages/admin/ProductManagement.tsx";
import ProductFormPage from "./pages/admin/ProductFormPage.tsx";
import TestManagement from "./pages/admin/TestManagement.tsx";
import TestFormPage from "./pages/admin/TestFormPage.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import ReviewManagement from "./pages/admin/ReviewManagement.tsx";
import ReviewFormPage from "./pages/admin/ReviewFormPage.tsx";
import AdminApprovals from "./pages/admin/AdminApprovals.tsx";
import PackageManagement from "./pages/admin/PackageManagement.tsx";
import PackageFormPage from "./pages/admin/PackageFormPage.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminConsultations from "./pages/admin/AdminConsultations.tsx";
import CategoryFormPage from "./pages/admin/CategoryFormPage.tsx";
import LaboratoryDetailPage from "./pages/admin/LaboratoryDetailPage.tsx";
import LiveSupportPage from "./pages/admin/LiveSupportPage.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

const queryClient = new QueryClient();

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
            <Routes>
            {/* Public Auth */}
            <Route path="/admin/login" element={<LoginPage role="admin" />} />
            
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin Portal */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]} />}>
              <Route element={<PortalLayout portal="admin" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
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
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </SocketProvider>
  </QueryClientProvider>
);

export default App;
