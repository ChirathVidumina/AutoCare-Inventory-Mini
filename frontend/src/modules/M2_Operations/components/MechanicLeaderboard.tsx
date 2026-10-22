import { Link } from "react-router-dom";
import { mechanicPerformance } from "../data/dashboardData";

export default function MechanicLeaderboard() {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Mechanic Performance</h2>
        <Link to="/mechanics" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      <ul className="mt-5 space-y-5">
        {mechanicPerformance.map((m) => (
          <li key={m.name}>
            <div className="flex justify-between text-sm font-semibold text-slate-800">
              <span>{m.name}</span>
              <span>{m.performance}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-blue-900"
                style={{ width: `${m.performance}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">{m.jobsCompleted} jobs completed</p>
          </li>
        ))}
      </ul>
    </div>
  );
}