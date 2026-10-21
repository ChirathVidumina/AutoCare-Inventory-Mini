import StatCard from "../components/StatCard";
import { stats } from "../data/dashboardData";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-500">Overview of today's operations</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}