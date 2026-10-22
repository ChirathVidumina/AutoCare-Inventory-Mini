import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { invoices, type InvoiceStatus } from "./mockData";

const badgeStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
};

export default function InvoiceListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | InvoiceStatus>("All");

  const filtered = invoices.filter((inv) => {
    const text = `${inv.id} ${inv.customer} ${inv.vehicle}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = status === "All" || inv.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Billing – Invoices</h1>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          + New Invoice
        </button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by invoice, customer or vehicle"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | InvoiceStatus)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount (LKR)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{inv.id}</td>
                <td className="px-4 py-3">{inv.customer}</td>
                <td className="px-4 py-3">{inv.vehicle}</td>
                <td className="px-4 py-3">{inv.date}</td>
                <td className="px-4 py-3">{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Eye className="h-4 w-4" /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}