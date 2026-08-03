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
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

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
import PackageDetailPage from "./pages/user/PackageDetailPage.tsx";
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

// Lab
import PackageManagement from "./pages/admin/PackageManagement.tsx";
import PackageFormPage from "./pages/admin/PackageFormPage.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminConsultations from "./pages/admin/AdminConsultations.tsx";

// Lab
import LabDashboard from "./pages/lab/LabDashboard.tsx";
import LabBookings from "./pages/lab/LabBookings.tsx";
import UploadResultsPage from "./pages/lab/UploadResultsPage.tsx";
import LabTestsPage from "./pages/lab/LabTestsPage.tsx";
import LabPackagesPage from "./pages/lab/LabPackagesPage.tsx";
import LabSchedulePage from "./pages/lab/LabSchedulePage.tsx";
import LabProfilePage from "./pages/lab/LabProfilePage.tsx";
import CategoryFormPage from "./pages/admin/CategoryFormPage.tsx";
import LaboratoryDetailPage from "./pages/admin/LaboratoryDetailPage.tsx";
import LabBookingDetails from "./pages/lab/LabBookingDetails.tsx";
import LabTestFormPage from "./pages/lab/LabTestFormPage.tsx";
import LabPackageFormPage from "./pages/lab/LabPackageFormPage.tsx";

const queryClient = new QueryClient();

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Initialize Lenis for smooth scrolling globally
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
          {/* Public Auth - Admin & Laboratory specific */}
          <Route path="/admin/login" element={<LoginPage role="admin" />} />
          <Route path="/laboratory/login" element={<LoginPage role="lab" />} />
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
            <Route path="/packages/:id" element={<PackageDetailPage />} />
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
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN", "LAB"]} />}>
              <Route path="/bookings/new" element={<NewBookingPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/reports" element={<ConsumerReportsPage />} />
              <Route path="/profile" element={<ConsumerProfilePage />} />
            </Route>
          </Route>

          {/* Admin Portal — sidebar stays */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<PortalLayout portal="admin" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
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

          {/* Lab Portal — sidebar stays */}
          <Route path="/lab" element={<ProtectedRoute allowedRoles={["LAB"]} />}>
            <Route element={<PortalLayout portal="lab" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<LabDashboard />} />
              <Route path="bookings" element={<LabBookings />} />
              <Route path="bookings/:id" element={<LabBookingDetails />} />
              <Route path="bookings/:id/upload" element={<UploadResultsPage />} />
              <Route path="upload" element={<UploadResultsPage />} />
              <Route path="tests" element={<LabTestsPage />} />
              <Route path="tests/new" element={<LabTestFormPage />} />
              <Route path="tests/edit/:id" element={<LabTestFormPage />} />
              <Route path="packages" element={<LabPackagesPage />} />
              <Route path="packages/new" element={<LabPackageFormPage />} />
              <Route path="packages/edit/:id" element={<LabPackageFormPage />} />
              <Route path="schedule" element={<LabSchedulePage />} />
              <Route path="profile" element={<LabProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
