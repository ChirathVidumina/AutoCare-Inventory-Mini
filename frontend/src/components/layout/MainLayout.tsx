import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Shapes,
  Archive,
  Receipt,
  Network,
  ChartNoAxesCombined,
  Bell,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Job Card", path: "/job-cards", icon: ClipboardList },
  { name: "Customer", path: "/customers", icon: Users },
  { name: "Category", path: "/categories", icon: Shapes },
  { name: "Inventory", path: "/inventory", icon: Archive },
  { name: "Billing", path: "/billing", icon: Receipt },
  { name: "Staff", path: "/staff", icon: Network },
  { name: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="flex min-h-screen w-56 shrink-0 flex-col bg-[#253f8d] text-white">
        <div className="pt-6 text-center">
          <h1 className="text-xl font-bold text-yellow-300">
            Auto Care
          </h1>
          <p className="mt-1 text-xs text-blue-100">
            Admin Panel
          </p>
        </div>

        <nav className="mt-12 flex-1 space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-full px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-700"
                  }`
                }
              >
                <Icon size={19} className="text-sky-400" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-2 px-3 pb-6">
          <NavLink
            to="/notifications"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm hover:bg-blue-700"
          >
            <Bell size={19} className="text-sky-400" />
            Notification
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm hover:bg-blue-700"
          >
            <Settings size={19} className="text-sky-400" />
            Setting
          </NavLink>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[#f5f6fa]">
        <Outlet />
      </main>
    </div>
  );
}