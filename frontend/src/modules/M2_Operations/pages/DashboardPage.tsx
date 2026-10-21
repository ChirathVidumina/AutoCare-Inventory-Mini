import StatCard from "../components/StatCard";
import { stats } from "../data/dashboardData";
import RevenueChart from "../components/RevenueChart";
import MechanicLeaderboard from "../components/MechanicLeaderboard";
import RecentJobCards from "../components/RecentJobCards";

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
            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
                <MechanicLeaderboard />
      </div>
            <div className="mt-6">
        <RecentJobCards />
      </div>
    </div>
  );
}