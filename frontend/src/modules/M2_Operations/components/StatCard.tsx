import { Car, Wallet, Clock, CircleCheck, TrendingUp, TrendingDown } from "lucide-react";
import type { Stat } from "../data/dashboardData";

const icons = {
  services: Car,
  revenue: Wallet,
  pending: Clock,
  completed: CircleCheck,
};

export default function StatCard({ title, value, change, icon }: Stat) {
  const Icon = icons[icon];
  const isUp = change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <Icon size={22} className="text-yellow-500" />
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${isUp ? "text-green-600" : "text-red-600"}`}>
        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{isUp ? "+" : ""}{change}%</span>
      </div>
    </div>
  );
}