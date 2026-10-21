import { useState } from "react";
import {
  Eye,
  Package,
  Pencil,
  Plus,
  Search,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { mockInventoryItems } from "./inventoryMockData";
import { getStockStatus } from "./inventoryTypes";
import type { InventoryItem } from "./inventoryTypes";
import StockStatusBadge from "./components/StockStatusBadge";
import ItemFormModal from "./components/ItemFormModal";
import type { ItemFormData, ModalMode } from "./components/ItemFormModal";

// අලුත් item එකකට ඊළඟ ID එක හදනවා (උදා: IT-0022)
function generateItemId(list: InventoryItem[]): string {
  const maxNumber = list.reduce(
    (max, item) => Math.max(max, Number(item.id.replace("IT-", "")) || 0),
    0
  );
  return `IT-${String(maxNumber + 1).padStart(4, "0")}`;
}

export default function InventoryPage() {
  // state: items list, search text, සහ modal එකේ තත්ත්වය (null = modal වසා තියෙනවා)
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchText, setSearchText] = useState("");
  const [modal, setModal] = useState<{
    mode: ModalMode;
    item: InventoryItem | null;
  } | null>(null);

  // Summary card values
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

  // Modal එකෙන් Save කළාම: edit නම් update, add නම් අලුතින් ඇතුල් කරනවා
  function handleSave(data: ItemFormData) {
    if (modal?.mode === "edit" && modal.item) {
      const id = modal.item.id;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...data, id } : item))
      );
    } else {
      setItems((prev) => [...prev, { ...data, id: generateItemId(prev) }]);
    }
    setModal(null);
  }

  // Delete: confirm කළොත් list එකෙන් අයින් කරනවා
  function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setModal(null);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Inventory Overview
          </h1>
          <p className="text-sm text-slate-500">
            Manage items and view items history
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "add", item: null })}
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
            <p className="text-2xl font-semibold text-slate-900">
              {totalItems}
            </p>
          </div>
          <Package className="text-yellow-500" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm text-slate-500">Low Stock</p>
            <p className="text-2xl font-semibold text-slate-900">
              {lowStockCount}
            </p>
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
              <th className="px-4 py-3 font-medium">Actions</th>
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
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`View ${item.name}`}
                        onClick={() => setModal({ mode: "view", item })}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => setModal({ mode: "edit", item })}
                        className="text-blue-700 hover:text-blue-900"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: modal state එක null නොවේ නම් පමණක් පෙන්වනවා */}
      {modal && (
        <ItemFormModal
          key={modal.item?.id ?? "new"}
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}