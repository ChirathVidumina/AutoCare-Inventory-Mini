import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Car, ChevronLeft, ChevronRight, Eye, Plus, Search, UserPlus, Users, Wrench } from "lucide-react";
import {
  customers,
  formatDate,
  fullName,
  getCustomerStats,
  getCustomerVehicles,
  vehicles,
  type CustomerStatus,
} from "../data/customersData";
import PageHeader from "../components/PageHeader";

const PAGE_SIZE = 8;

type SortKey = "recent" | "name" | "id";

const statusStyles: Record<CustomerStatus, string> = {
  "In Service": "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-slate-200 text-slate-600",
};

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
        {icon}
      </span>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);

  // one row per customer, with the numbers worked out from their job cards
  const rows = customers.map((c) => ({
    customer: c,
    vehicles: getCustomerVehicles(c.id),
    ...getCustomerStats(c.id),
  }));

  const thisMonth = new Date().toLocaleDateString("en-CA").slice(0, 7); // "2026-10"
  const inService = rows.filter((r) => r.status === "In Service").length;
  const newThisMonth = customers.filter((c) => c.joinedAt.startsWith(thisMonth)).length;

  // search by name, customer ID, phone or plate number
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

  // pagination
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(firstIndex, firstIndex + PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Customer Overview"
        subtitle="Manage relationships and view each client's service history"
      />

      <div className="p-8">
      <div className="flex justify-end">
        {/* opens the Add Customer pop-up (next step) */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Customers" value={customers.length} icon={<Users size={20} />} />
        <SummaryCard label="Customers In Service" value={inService} icon={<Wrench size={20} />} />
        <SummaryCard label="Registered Vehicles" value={vehicles.length} icon={<Car size={20} />} />
        <SummaryCard label="New This Month" value={newThisMonth} icon={<UserPlus size={20} />} />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Search and sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // new search starts from the first page
              }}
              placeholder="Search by name, customer ID, phone or plate"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="recent">Last visit (newest)</option>
              <option value="name">Name (A–Z)</option>
              <option value="id">Customer ID</option>
            </select>
          </label>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="px-4 py-3 font-semibold">Customer ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Vehicles</th>
                <th className="px-4 py-3 font-semibold">Last Visit</th>
                <th className="px-4 py-3 text-right font-semibold">Visits</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(({ customer, vehicles: owned, lastVisit, visits, status }) => (
                <tr key={customer.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{customer.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{fullName(customer)}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">
                    {owned.map((v) => (
                      <p key={v.plateNo}>
                        {v.make} {v.model} <span className="text-xs text-slate-500">· {v.plateNo}</span>
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    {lastVisit ? formatDate(lastVisit) : <span className="text-slate-400">No visits yet</span>}
                  </td>
                  <td className="px-4 py-3 text-right">{visits}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/customers/${customer.id}`}
                      aria-label={`View ${fullName(customer)}`}
                      className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
                    >
                      <Eye size={16} /> View
                    </Link>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            {sorted.length === 0
              ? "No customers"
              : `Showing ${firstIndex + 1}–${firstIndex + pageRows.length} of ${sorted.length} customers`}
          </span>
          <nav aria-label="Pagination" className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="rounded-full p-1.5 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`h-8 w-8 rounded-full text-sm font-medium ${
                  n === currentPage ? "bg-yellow-400 text-slate-900" : "hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              aria-label="Next page"
              className="rounded-full p-1.5 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      </section>
      </div>
    </div>
  );
}
