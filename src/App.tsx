import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PortalLayout } from "@/components/layout/PortalLayout";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import UserDashboard from "./pages/user/UserDashboard.tsx";
import ProductsPage from "./pages/user/ProductsPage.tsx";
import ProductDetailPage from "./pages/user/ProductDetailPage.tsx";
import LaboratoriesPage from "./pages/user/LaboratoriesPage.tsx";
import LaboratoryDetailPage from "./pages/user/LaboratoryDetailPage.tsx";
import NewBookingPage from "./pages/user/NewBookingPage.tsx";
import BookingHistoryPage from "./pages/user/BookingHistoryPage.tsx";
import BookingDetailPage from "./pages/user/BookingDetailPage.tsx";
import PaymentsPage from "./pages/user/PaymentsPage.tsx";
import ReportsPage from "./pages/user/ReportsPage.tsx";
import DocumentsPage from "./pages/user/DocumentsPage.tsx";
import UserProfilePage from "./pages/user/UserProfilePage.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import LabManagement from "./pages/admin/LabManagement.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import CategoryManagement from "./pages/admin/CategoryManagement.tsx";
import ProductManagement from "./pages/admin/ProductManagement.tsx";
import TestManagement from "./pages/admin/TestManagement.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import LabDashboard from "./pages/lab/LabDashboard.tsx";
import LabBookings from "./pages/lab/LabBookings.tsx";
import UploadResultsPage from "./pages/lab/UploadResultsPage.tsx";
import LabPricingPage from "./pages/lab/LabPricingPage.tsx";
import LabSchedulePage from "./pages/lab/LabSchedulePage.tsx";
import LabProfilePage from "./pages/lab/LabProfilePage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Portal */}
          <Route path="/dashboard" element={<PortalLayout portal="user" userName="Rajesh Kumar" />}>
            <Route index element={<UserDashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="laboratories" element={<LaboratoriesPage />} />
            <Route path="laboratories/:id" element={<LaboratoryDetailPage />} />
            <Route path="bookings/new" element={<NewBookingPage />} />
            <Route path="bookings" element={<BookingHistoryPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<PortalLayout portal="admin" userName="Admin User" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="laboratories" element={<LabManagement />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Lab Portal */}
          <Route path="/lab" element={<PortalLayout portal="lab" userName="Chennai Lab" />}>
            <Route path="dashboard" element={<LabDashboard />} />
            <Route path="bookings" element={<LabBookings />} />
            <Route path="bookings/:id/upload" element={<UploadResultsPage />} />
            <Route path="upload" element={<UploadResultsPage />} />
            <Route path="pricing" element={<LabPricingPage />} />
            <Route path="schedule" element={<LabSchedulePage />} />
            <Route path="profile" element={<LabProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
