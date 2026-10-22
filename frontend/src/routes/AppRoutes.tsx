
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

// M2 - Admin Dashboard
import DashboardPage from "../modules/M2_Operations/pages/DashboardPage";

// M3 - Service Catalogue
import CategoryList from "../modules/M3_ServiceCatalogue/pages/CategoryList";
import ServicesPackages from "../modules/M3_ServiceCatalogue/pages/ServicesPackages";

// M4 - Billing
import InvoiceListPage from "../modules/M4_BookingBilling/InvoiceListPage";

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
  { path: "video-assistance", title: "Video Assistance" },
  { path: "job-cards", title: "Job Cards" },
  { path: "customers", title: "Customer Management" },
  { path: "inventory", title: "Inventory" },
  { path: "staff", title: "Staff" },
  { path: "mechanics", title: "Mechanic Management" },
  { path: "reports", title: "Reports" },
  { path: "notifications", title: "Notifications" },
  { path: "settings", title: "Settings" },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* DEFAULT PAGE */}
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {/* M2 - ADMIN DASHBOARD */}
        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        {/* M3 - CATEGORY MANAGEMENT */}
        <Route
          path="categories"
          element={<CategoryList />}
        />

        {/* M3 - SERVICES & PACKAGES */}
        <Route
          path="services-packages"
          element={<ServicesPackages />}
        />

        {/* M4 - BILLING */}
        <Route
          path="billing"
          element={<InvoiceListPage />}
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
