import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock, ChevronLeft, ChevronRight, Eye, ListFilter, Pencil, Plus, Search,
  TrendingDown, TrendingUp, UserPlus, Users, Wrench,
} from "lucide-react";
import {
  customers,
  formatDate,
  fullName,
  getCustomerStats,
  getCustomerVehicles,
  type CustomerStatus,
} from "../data/customersData";
import { jobCards } from "../data/jobCardsData";

// TODO: read this from the Booking module (M4) when it is ready
const PENDING_BOOKINGS_SAMPLE = 3;

const PAGE_SIZES = [5, 8, 10];

type SortKey = "recent" | "name" | "id";
const sortLabels: Record<SortKey, string> = {
  recent: "Last visit (newest)",
  name: "Name (A–Z)",
  id: "Customer ID",
};

const statusStyles: Record<CustomerStatus, string> = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-sky-100 text-sky-700",
};

type Trend = { text: string; direction: "up" | "down" | "none" };

function SummaryCard({ label, value, icon, trend }: { label: string; value: number; icon: ReactNode; trend: Trend }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-medium text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
          {icon}
        </span>
      </div>
      <p
        className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${
          trend.direction === "up" ? "text-green-600" : trend.direction === "down" ? "text-red-600" : "text-slate-500"
        }`}
      >
        {trend.direction === "up" && <TrendingUp size={16} />}
        {trend.direction === "down" && <TrendingDown size={16} />}
        {trend.text}
      </p>
    </div>
  );
}

/** Page buttons like "1 2 … 9": first, last, and the pages next to the current one. */
function pageNumbers(current: number, count: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let n = 1; n <= count; n++) {
    if (n === 1 || n === count || Math.abs(n - current) <= 1) pages.push(n);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return pages;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);

  // one row per customer, with the numbers worked out from their job cards
  const rows = customers.map((c) => ({
    customer: c,
    vehicles: getCustomerVehicles(c.id),
    ...getCustomerStats(c.id),
  }));

  // ----- summary cards -----
  const thisMonth = new Date().toLocaleDateString("en-CA").slice(0, 7); // "2026-10"
  const lastMonthDate = new Date();
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toLocaleDateString("en-CA").slice(0, 7); // "2026-09"

  const newThisMonth = customers.filter((c) => c.joinedAt.startsWith(thisMonth)).length;
  const newLastMonth = customers.filter((c) => c.joinedAt.startsWith(lastMonth)).length;
  const activeServices = jobCards.filter((j) => j.status === "Open" || j.status === "In Progress").length;
  const customersInWorkshop = rows.filter((r) => r.status !== "Inactive").length;

  const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
  const monthDiff = newThisMonth - newLastMonth;

  const customerTrend: Trend = {
    text: `+${percent(newThisMonth, customers.length - newThisMonth)}% this month`,
    direction: newThisMonth > 0 ? "up" : "none",
  };
  const serviceTrend: Trend = { text: `${customersInWorkshop} customers in the workshop`, direction: "none" };
  const bookingTrend: Trend = { text: "Awaiting confirmation", direction: "none" };
  const newTrend: Trend = {
    text: `${monthDiff >= 0 ? "+" : ""}${monthDiff} vs last month`,
    direction: monthDiff > 0 ? "up" : monthDiff < 0 ? "down" : "none",
  };

  // ----- search, sort, pages -----
  const query = search.trim().toLowerCase();
  const filtered = rows.filter(
    (r) =>
      query === "" ||
      fullName(r.customer).toLowerCase().includes(query) ||
      r.customer.id.toLowerCase().includes(query) ||
      r.customer.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")) ||
      r.vehicles.some((v) => v.plateNo.toLowerCase().includes(query))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return fullName(a.customer).localeCompare(fullName(b.customer));
    if (sortBy === "id") return a.customer.id.localeCompare(b.customer.id);
    return (b.lastVisit ?? "").localeCompare(a.lastVisit ?? ""); // most recent visit first
  });

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(firstIndex, firstIndex + pageSize);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Overview</h1>
          <p className="text-sm text-slate-500">Manage relationships and view each client's service history</p>
        </div>
        {/* opens the Add Customer pop-up (next step) */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Customers" value={customers.length} icon={<Users size={20} />} trend={customerTrend} />
        <SummaryCard label="Active Services" value={activeServices} icon={<Wrench size={20} />} trend={serviceTrend} />
        <SummaryCard label="Pending Bookings" value={PENDING_BOOKINGS_SAMPLE} icon={<CalendarClock size={20} />} trend={bookingTrend} />
        <SummaryCard label="New This Month" value={newThisMonth} icon={<UserPlus size={20} />} trend={newTrend} />
      </div>

      {/* Search and sort */}
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // new search starts from the first page
            }}
            placeholder="Search by name, customer ID, phone or plate"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            aria-expanded={sortOpen}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-6 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-300"
          >
            <ListFilter size={18} /> Sort
          </button>
          {sortOpen && (
            <ul className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy(key);
                      setSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 ${
                      sortBy === key ? "font-semibold text-blue-800" : "text-slate-700"
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-lg border border-slate-300 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-4 py-4 font-semibold">Customer Id</th>
              <th className="px-4 py-4 font-semibold">Customer Name</th>
              <th className="px-4 py-4 font-semibold">Vehicle</th>
              <th className="px-4 py-4 font-semibold">Service Type</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Last Visit</th>
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(({ customer, vehicles, lastJob, lastVisit, lastServiceType, status }) => {
              // show the vehicle from the latest visit, otherwise their first vehicle
              const shown = vehicles.find((v) => v.plateNo === lastJob?.plateNo) ?? vehicles[0];
              return (
                <tr key={customer.id} className="border-t border-slate-200 text-slate-800 hover:bg-slate-50">
                  <td className="px-4 py-4">{customer.id}</td>
                  <td className="px-4 py-4">{fullName(customer)}</td>
                  <td className="px-4 py-4">
                    {shown ? `${shown.make} ${shown.model}` : "—"}
                    {shown && <span className="ml-1 text-xs text-slate-500">· {shown.plateNo}</span>}
                    {vehicles.length > 1 && (
                      <span className="ml-1 text-xs text-slate-500">+{vehicles.length - 1} more</span>
                    )}
                  </td>
                  <td className="px-4 py-4">{lastServiceType ?? <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {lastVisit ? formatDate(lastVisit) : <span className="text-slate-400">No visits yet</span>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/customers/${customer.id}`}
                        aria-label={`View ${fullName(customer)}`}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <Eye size={18} />
                      </Link>
                      {/* opens the Edit Customer pop-up (next step) */}
                      <button
                        type="button"
                        aria-label={`Edit ${fullName(customer)}`}
                        className="text-blue-800 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: rows per page and page buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <label className="flex items-center gap-2">
          Showing
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Rows per page"
            className="rounded-full border-0 bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-slate-900"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          out of {sorted.length}
        </label>

        <nav aria-label="Pagination" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-slate-900 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers(currentPage, pageCount).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-slate-500">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`h-7 w-7 rounded-full text-xs font-semibold shadow-sm ${
                  n === currentPage ? "bg-yellow-200 text-slate-900" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="Next page"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-slate-900 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
}
