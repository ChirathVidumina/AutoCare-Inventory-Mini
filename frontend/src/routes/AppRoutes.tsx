import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../modules/M2_Operations/pages/DashboardPage";
import JobCardsPage from "../modules/M2_Operations/pages/JobCardsPage";
import JobCardDetailsPage from "../modules/M2_Operations/pages/JobCardDetailsPage";
import CreateJobCardPage from "../modules/M2_Operations/pages/CreateJobCardPage";

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
  { path: "customers", title: "Customer Management" },
  { path: "categories", title: "Service Categories" },
  { path: "inventory", title: "Inventory" },
  { path: "billing", title: "Billing" },
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
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="dashboard" element={<DashboardPage />} />
           <Route path="job-cards" element={<JobCardsPage />} />
              <Route path="job-cards/new" element={<CreateJobCardPage />} />
            <Route path="job-cards/:id" element={<JobCardDetailsPage />} />

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