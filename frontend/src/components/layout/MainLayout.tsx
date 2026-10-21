
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  ClipboardList,
  Users,
  Layers3,
  Boxes,
  Receipt,
  UserRound,
  Wrench,
  ChartNoAxesCombined,
  Bell,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon | null;
};

const menuItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Video Assist",
    path: "/video-assistance",
    icon: Video,
  },
  {
    label: "Job Card",
    path: "/job-cards",
    icon: ClipboardList,
  },
  {
    label: "Customer",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Category",
    path: "/categories",
    icon: Layers3,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    label: "Billing",
    path: "/billing",
    icon: Receipt,
  },
  {
    label: "Staff",
    path: "/staff",
    icon: UserRound,
  },
  {
    label: "Services & Packages",
    path: "/services-packages",
    icon: null,
  },
  {
    label: "Mechanic",
    path: "/mechanics",
    icon: Wrench,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: ChartNoAxesCombined,
  },
];

const bottomItems: SidebarItem[] = [
  {
    label: "Notification",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Setting",
    path: "/settings",
    icon: Settings,
  },
];

function SidebarLink({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#4260ae] text-white"
            : "text-white/90 hover:bg-white/10"
        }`
      }
    >
      {/* Keep text aligned even when the icon is absent */}
      <span className="flex w-5 shrink-0 items-center justify-center">
        {Icon ? (
          <Icon size={19} className="text-[#70a7ff]" />
        ) : null}
      </span>

      <span>{item.label}</span>
    </NavLink>
  );
}

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-[#253f8d] px-4 py-6">
        {/* Brand */}
        <div className="mb-7 px-4">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Auto Care
          </h1>
        </div>

        {/* Main Navigation */}
        <nav
          aria-label="Main navigation"
          className="min-h-0 flex-1 space-y-1 overflow-y-auto"
        >
          {menuItems.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <nav
          aria-label="Account navigation"
          className="mt-4 space-y-1 border-t border-white/20 pt-4"
        >
          {bottomItems.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
