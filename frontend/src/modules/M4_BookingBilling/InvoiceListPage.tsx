import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Plus } from "lucide-react";
import { invoices, calcTotals, formatMoney, formatDate, type InvoiceStatus } from "./mockData";
import StatusBadge from "./StatusBadge";

export default function InvoiceListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | InvoiceStatus>("All");

  const filtered = invoices.filter((inv) => {
    const text = `${inv.id} ${inv.customer} ${inv.plate} ${inv.vehicle}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "All" || inv.status === status);
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Billing – Invoices</h1>
        <Link
          to="/billing/new"
          className="flex items-center gap-1 rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" /> New Invoice
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by invoice, customer, vehicle or plate"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | InvoiceStatus)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Draft">Draft</option>
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
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{inv.id}</td>
                <td className="px-4 py-3">{inv.customer}</td>
                <td className="px-4 py-3">{inv.vehicle} ({inv.plate})</td>
                <td className="px-4 py-3">{formatDate(inv.date)}</td>
                <td className="px-4 py-3">{formatMoney(calcTotals(inv.items, inv.taxRate, inv.discount).total)}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3">
                  <Link to={`/billing/${inv.id}`} className="flex items-center gap-1 text-blue-700 hover:underline">
                    <Eye className="h-4 w-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}