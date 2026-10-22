
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

// M1 - Authentication
import AdminLoginPage from "../modules/M1_Authentication/pages/AdminLoginPage";
import RegisterPage from "../modules/M1_Authentication/pages/RegisterPage";
import ForgotPasswordPage from "../modules/M1_Authentication/pages/ForgotPasswordPage";
import ProfilePage from "../modules/M1_Authentication/pages/ProfilePage";
import VideoAssistancePage from "../modules/M1_Authentication/pages/VideoAssistancePage";

// M2 - Admin Dashboard and Job Cards
import DashboardPage from "../modules/M2_Operations/pages/DashboardPage";
import JobCardsPage from "../modules/M2_Operations/pages/JobCardsPage";
import JobCardDetailsPage from "../modules/M2_Operations/pages/JobCardDetailsPage";

// M3 - Service Catalogue
import CategoryList from "../modules/M3_ServiceCatalogue/pages/CategoryList";
import ServicesPackages from "../modules/M3_ServiceCatalogue/pages/ServicesPackages";

// M4 - Billing
import InvoiceListPage from "../modules/M4_BookingBilling/InvoiceListPage";

// M5 - Inventory and Staff
import InventoryPage from "../modules/M5_Inventory/InventoryPage";
import StaffPage from "../modules/M5_Inventory/staff/StaffPage";

// Placeholder for unfinished modules
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        {title}
      </h1>
    </div>
  );
}

const pages = [
  { path: "customers", title: "Customer Management" },
  { path: "mechanics", title: "Mechanic Management" },
  { path: "reports", title: "Reports" },
  { path: "notifications", title: "Notifications" },
  { path: "settings", title: "Settings" },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* M1 - PUBLIC AUTHENTICATION PAGES */}
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route
        path="forgot-password"
        element={<ForgotPasswordPage />}
      />

      {/* ADMIN / STAFF LAYOUT */}
      <Route element={<MainLayout />}>
        {/* DEFAULT PAGE */}
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {/* M1 - PROFILE */}
        <Route
          path="profile"
          element={<ProfilePage />}
        />

        {/* M1 - VIDEO ASSISTANCE */}
        <Route
          path="video-assistance"
          element={<VideoAssistancePage />}
        />

        {/* M2 - ADMIN DASHBOARD */}
        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        {/* M2 - JOB CARDS LIST */}
        <Route
          path="job-cards"
          element={<JobCardsPage />}
        />

        {/* M2 - JOB CARD DETAILS */}
        <Route
          path="job-cards/:id"
          element={<JobCardDetailsPage />}
        />

        {/* M3 - CATEGORY MANAGEMENT */}
        <Route
          path="categories"
          element={<CategoryList />}
        />

        {/* M3 - SERVICES AND PACKAGES */}
        <Route
          path="services-packages"
          element={<ServicesPackages />}
        />

        {/* M4 - BILLING */}
        <Route
          path="billing"
          element={<InvoiceListPage />}
        />

        {/* M5 - INVENTORY */}
        <Route
          path="inventory"
          element={<InventoryPage />}
        />

        {/* M5 - STAFF MANAGEMENT */}
        <Route
          path="staff"
          element={<StaffPage />}
        />

        {/* OTHER ADMIN PAGES */}
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PlaceholderPage title={page.title} />}
          />
        ))}

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}
