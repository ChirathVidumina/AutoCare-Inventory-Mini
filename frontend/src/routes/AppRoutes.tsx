import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        {title}
      </h1>
    </div>
  );
}

const pages = [
  { path: "dashboard", title: "Dashboard" },
  { path: "job-cards", title: "Job Cards" },
  { path: "customers", title: "Customer Management" },
  { path: "categories", title: "Service Categories" },
  { path: "inventory", title: "Inventory" },
  { path: "billing", title: "Billing" },
  { path: "staff", title: "Staff" },
  { path: "reports", title: "Reports" },
  { path: "notifications", title: "Notifications" },
  { path: "settings", title: "Settings" },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PlaceholderPage title={page.title} />}
          />
        ))}
      </Route>
    </Routes>
  );
}