import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { UserLayout } from "@/components/layout/UserLayout";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";

// User Consumer Pages
import HomePage from "./pages/user/HomePage.tsx";
import TestsListingPage from "./pages/user/TestsListingPage.tsx";
import TestDetailPage from "./pages/user/TestDetailPage.tsx";
import LabsListingPage from "./pages/user/LabsListingPage.tsx";
import LabDetailConsumerPage from "./pages/user/LabDetailConsumerPage.tsx";
import CartPage from "./pages/user/CartPage.tsx";
import NewBookingPage from "./pages/user/NewBookingPage.tsx";
import OrdersPage from "./pages/user/OrdersPage.tsx";
import OrderDetailPage from "./pages/user/OrderDetailPage.tsx";
import ConsumerReportsPage from "./pages/user/ConsumerReportsPage.tsx";
import ConsumerProfilePage from "./pages/user/ConsumerProfilePage.tsx";

// Admin
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

// Lab
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Consumer Portal — NO sidebar */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/tests" element={<TestsListingPage />} />
            <Route path="/tests/:id" element={<TestDetailPage />} />
            <Route path="/labs" element={<LabsListingPage />} />
            <Route path="/labs/:id" element={<LabDetailConsumerPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/bookings/new" element={<NewBookingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/reports" element={<ConsumerReportsPage />} />
            <Route path="/profile" element={<ConsumerProfilePage />} />
          </Route>

          {/* Admin Portal — sidebar stays */}
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

          {/* Lab Portal — sidebar stays */}
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
