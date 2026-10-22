import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { pendingJobs, type JobStatus } from "../data/dashboardData";

const statusStyles: Record<JobStatus, string> = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
};

export default function RecentJobCards() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pending Jobs</h2>
        <Link to="/job-cards" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="px-4 py-3 font-semibold">Job ID</th>
              <th className="px-4 py-3 font-semibold">Vehicle ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Service Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Mechanic</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingJobs.map((job) => (
              <tr key={job.jobId} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{job.jobId}</td>
                <td className="px-4 py-3">{job.vehicleId}</td>
                <td className="px-4 py-3">{job.customer}</td>
                <td className="px-4 py-3">{job.serviceType}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className={`px-4 py-3 ${job.mechanic === "Unassigned" ? "italic text-slate-400" : ""}`}>
                  {job.mechanic}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to="/job-cards"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Eye size={16} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}