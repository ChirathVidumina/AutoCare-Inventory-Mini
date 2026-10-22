import { Link } from "react-router-dom";
import { Bell, CalendarDays } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
};

/** White bar at the top of a page: title on the left, today's date and notifications on the right. */
export default function PageHeader({ title, subtitle }: Props) {
  // e.g. "October 22, 2026"
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
          <CalendarDays size={16} /> {today}
        </span>
        <Link to="/notifications" aria-label="Notifications" className="relative text-slate-400 hover:text-slate-700">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
        </Link>
        {/* Admin user profile will be added here later */}
      </div>
    </header>
  );
}
