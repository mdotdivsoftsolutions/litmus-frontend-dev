import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import NewBookingPage from "./pages/user/NewBookingPage.tsx";
import OrdersPage from "./pages/user/OrdersPage.tsx";
import OrderDetailPage from "./pages/user/OrderDetailPage.tsx";
import ConsumerReportsPage from "./pages/user/ConsumerReportsPage.tsx";
import ConsumerProfilePage from "./pages/user/ConsumerProfilePage.tsx";
import PackagesPage from "./pages/user/PackagesPage.tsx";
import ConsultationPage from "./pages/user/ConsultationPage.tsx";
import SupportPage from "./pages/user/SupportPage.tsx";
import TermsPage from "./pages/user/TermsPage.tsx";
import PrivacyPage from "./pages/user/PrivacyPage.tsx";
import NablDataPage from "./pages/user/NablDataPage.tsx";
import CartOpenerPage from "./pages/user/CartOpenerPage.tsx";
import HelpCenterPage from "./pages/user/HelpCenterPage.tsx";
import FaqsPage from "./pages/user/FaqsPage.tsx";
import AboutPage from "./pages/user/AboutPage.tsx";
import ContactPage from "./pages/user/ContactPage.tsx";
import CareersPage from "./pages/user/CareersPage.tsx";
import CareerDetailPage from "./pages/user/CareerDetailPage.tsx";
import BlogsPage from "./pages/user/BlogsPage.tsx";
import BlogDetailPage from "./pages/user/BlogDetailPage.tsx";

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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Auth - Admin & Laboratory specific */}
          <Route path="/admin/login" element={<LoginPage role="admin" />} />
          <Route path="/laboratory/login" element={<LoginPage role="lab" />} />

          {/* Redirect generic /login to home where modal will trigger if needed, or keep for direct hits */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User Consumer Portal — NO sidebar */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/tests" element={<TestsListingPage />} />
            <Route path="/tests/:id" element={<TestDetailPage />} />
            <Route path="/labs" element={<LabsListingPage />} />
            <Route path="/labs/:id" element={<LabDetailConsumerPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/nabl" element={<NablDataPage />} />
            <Route path="/cart" element={<CartOpenerPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug" element={<CareerDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/bookings/new" element={<NewBookingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/reports" element={<ConsumerReportsPage />} />
            <Route path="/profile" element={<ConsumerProfilePage />} />
          </Route>

          {/* Admin Portal — sidebar stays */}
          <Route path="/admin" element={<PortalLayout portal="admin" userName="Admin User" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
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
            <Route index element={<Navigate to="dashboard" replace />} />
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
