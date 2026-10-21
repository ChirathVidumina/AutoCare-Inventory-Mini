import { useState } from "react";
import { Link } from "react-router-dom";
import {
  jobCards,
  getJobCardTotals,
  type JobCardStatus,
  type Priority,
} from "../data/jobCardsData";
import { Search } from "lucide-react";

type Tab = "All" | JobCardStatus;
const tabs: Tab[] = ["All", "Open", "In Progress", "Completed", "Invoiced"];

const statusStyles: Record<JobCardStatus, string> = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
  Invoiced: "bg-slate-200 text-slate-700",
};

const priorityStyles: Record<Priority, string> = {
  High: "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700",
  Normal: "text-slate-600",
  Low: "text-slate-400",
};

export default function JobCardsTable() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

    const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<"All" | Priority>("All");
  const [mechanic, setMechanic] = useState("All");

  // unique mechanic names for the dropdown, A–Z
  const mechanics = [...new Set(jobCards.map((j) => j.mechanic))].sort();

  const hasFilters = search !== "" || priority !== "All" || mechanic !== "All";

  const clearFilters = () => {
    setSearch("");
    setPriority("All");
    setMechanic("All");
  };

  const countFor = (tab: Tab) =>
    tab === "All"
      ? jobCards.length
      : jobCards.filter((j) => j.status === tab).length;

    const query = search.trim().toLowerCase();

  const visible = jobCards.filter((j) => {
    const matchesTab = activeTab === "All" || j.status === activeTab;
    const matchesPriority = priority === "All" || j.priority === priority;
    const matchesMechanic = mechanic === "All" || j.mechanic === mechanic;
    const matchesSearch =
      query === "" ||
      j.id.toLowerCase().includes(query) ||
      j.customer.toLowerCase().includes(query) ||
      j.vehicle.toLowerCase().includes(query) ||
      j.plateNo.toLowerCase().includes(query);

    return matchesTab && matchesPriority && matchesMechanic && matchesSearch;
  });

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-medium ${
              activeTab === tab
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab} ({countFor(tab)})
          </button>
        ))}
      </div>

            {/* Search and filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job ID, customer, vehicle or plate"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "All" | Priority)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>High</option>
            <option>Normal</option>
            <option>Low</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          Mechanic
          <select
            value={mechanic}
            onChange={(e) => setMechanic(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            {mechanics.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="px-4 py-3 font-semibold">Job Card</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Vehicle</th>
              <th className="px-4 py-3 font-semibold">Services</th>
              <th className="px-4 py-3 font-semibold">Lead Mechanic</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((job) => (
              <tr key={job.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-blue-700">{job.id}</td>
                <td className="px-4 py-3">{job.customer}</td>
                <td className="px-4 py-3">
                  {job.vehicle}
                  <div className="text-xs text-slate-500">{job.plateNo}</div>
                </td>
                <td className="px-4 py-3">
                     {job.services.length} {job.services.length === 1 ? "service" : "services"}
                </td>
                <td
                  className={`px-4 py-3 ${
                    job.mechanic === "Unassigned" ? "italic text-slate-400" : ""
                  }`}
                >
                  {job.mechanic}
                </td>
                <td className="px-4 py-3">
                  <span className={priorityStyles[job.priority]}>{job.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3">{job.createdAt}</td>
                <td className="px-4 py-3 text-right">
                Rs {getJobCardTotals(job).grandTotal.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/job-cards/${job.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                  No job cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {visible.length} of {jobCards.length} job cards
      </p>
    </section>
  );
}