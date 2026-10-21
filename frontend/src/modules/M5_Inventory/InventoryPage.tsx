import { useState } from "react";
import { Package, Plus, Search, TriangleAlert, Wallet } from "lucide-react";
import { mockInventoryItems } from "./inventoryMockData";
import { getStockStatus } from "./inventoryTypes";
import type { InventoryItem } from "./inventoryTypes";
import StockStatusBadge from "./components/StockStatusBadge";

export default function InventoryPage() {
  // state: items list එක සහ search box එකේ type කරන text එක
  const [items] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchText, setSearchText] = useState("");

  // Summary card values (items list එකෙන් ගණනය කරනවා)
  const totalItems = items.length;
  const lowStockCount = items.filter(
    (item) => getStockStatus(item) !== "in-stock"
  ).length;
  const inventoryValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Search: name හෝ part number එකෙන් filter කරනවා
  const keyword = searchText.trim().toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.partNumber.toLowerCase().includes(keyword)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Inventory Overview
          </h1>
          <p className="text-sm text-slate-500">Manage items and view items history</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          Add Items
        </button>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Total Stock Items</p>
            <p className="text-2xl font-semibold text-slate-900">{totalItems}</p>
          </div>
          <Package className="text-yellow-500" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Low Stock</p>
            <p className="text-2xl font-semibold text-slate-900">{lowStockCount}</p>
            <span className="text-xs text-red-500">! Action Needed</span>
          </div>
          <TriangleAlert className="text-red-500" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Inventory Value</p>
            <p className="text-2xl font-semibold text-slate-900">
              LKR. {inventoryValue.toLocaleString()}
            </p>
          </div>
          <Wallet className="text-green-600" />
        </div>
      </div>

      {/* Search box */}
      <div className="relative mt-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search items by name, part number"
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-700"
        />
      </div>

      {/* Items table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Item ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Part Number</th>
              <th className="px-4 py-3 font-medium">Price (1pcs)</th>
              <th className="px-4 py-3 font-medium">Quantity On Hand</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-4">{item.id}</td>
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.partNumber}</td>
                  <td className="px-4 py-4">Rs.{item.price.toFixed(2)}</td>
                  <td className="px-4 py-4 font-medium">{item.quantity}</td>
                  <td className="px-4 py-4">
                    <StockStatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}