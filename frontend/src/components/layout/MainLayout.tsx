
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
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
  CalendarDays,
  CircleUserRound,
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
  const { pathname } = useLocation();

const pageTitle =
  pathname === "/profile"
    ? "My Profile"
    : [...menuItems, ...bottomItems].find(
        (item) =>
          pathname === item.path ||
          pathname.startsWith(`${item.path}/`)
      )?.label ?? "Auto Care";

const today = new Date().toLocaleDateString("en-US", {
  timeZone: "Asia/Colombo",
  month: "long",
  day: "numeric",
  year: "numeric",
});

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
  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-8 print:hidden">
    <p className="text-xl font-semibold text-slate-900">
      {pageTitle}
    </p>

    <div className="flex flex-wrap items-center gap-4">
      {/* Today's date */}
      <span className="inline-flex items-center gap-2 rounded-full bg-[#e7eaf3] px-4 py-2 text-sm font-medium text-[#253f8d]">
        <CalendarDays size={17} aria-hidden="true" />
        {today}
      </span>

      {/* Notifications */}
      <Link
        to="/notifications"
        aria-label="View notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-900"
      >
        <Bell size={21} aria-hidden="true" />
      </Link>

      {/* Admin profile — sample identity until account data is connected */}
      <Link
        to="/profile"
        aria-label="Open admin profile"
        className="flex items-center gap-3 border-l border-slate-200 pl-4"
      >
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            Admin User
          </p>
          <p className="text-xs text-slate-500">Manager</p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#253f8d]">
          <CircleUserRound size={25} aria-hidden="true" />
        </span>
      </Link>
    </div>
  </header>

  <Outlet />
</main>
    </div>
  );
}
