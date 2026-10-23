import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { monthlyRevenue, dailyRevenue } from "../data/dashboardData";

export default function RevenueChart() {
  const [view, setView] = useState<"monthly" | "daily">("monthly");
  const data = view === "monthly" ? monthlyRevenue : dailyRevenue;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
          <p className="text-xs text-slate-500">
            {view === "monthly" ? "Monthly" : "Daily"} revenue analytics
          </p>
        </div>

        <div className="flex rounded-full bg-slate-100 p-1 text-xs font-medium">
          {(["monthly", "daily"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1 capitalize ${
                view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#1e3a8a" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }}
                   tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(v) => [`LKR ${Number(v).toLocaleString()}`, "Revenue"]} />
            <Line type="monotone" dataKey="amount" stroke="#1e3a8a" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}