import { useState } from "react";
import { Save, Pencil, Trash2, X, Camera } from "lucide-react";
import type { InventoryItem } from "../inventoryTypes";

export type ModalMode = "add" | "edit" | "view";

// Form එකෙන් පිටතට යවන data (id එක page එකෙන් දෙනවා)
export type ItemFormData = Omit<InventoryItem, "id">;

const CATEGORIES = [
  "Oil Change",
  "Consumables",
  "Brakes",
  "Electrical",
  "Tyres",
  "Spare Parts",
];

// props: modal එකට පිටතින් දෙන දේවල්
type ItemFormModalProps = {
  mode: ModalMode;
  item: InventoryItem | null; // add mode එකේදී null
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
  onDelete: (id: string) => void;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none focus:border-blue-700 disabled:cursor-not-allowed disabled:text-slate-600";

export default function ItemFormModal({
  mode,
  item,
  onClose,
  onSave,
  onDelete,
}: ItemFormModalProps) {
  const isView = mode === "view";

  // state: form එකේ තියෙන හැම field එකක්ම. number fields string ලෙස තියාගන්නේ type කරන්න ලේසි නිසා.
  const [name, setName] = useState(item?.name ?? "");
  const [partNumber, setPartNumber] = useState(item?.partNumber ?? "");
  const [category, setCategory] = useState(item?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [quantity, setQuantity] = useState(item ? String(item.quantity) : "0");
  const [lowStockAlert, setLowStockAlert] = useState(
    item ? String(item.lowStockAlert) : "5"
  );
  const [allowBackOrder, setAllowBackOrder] = useState(
    item?.allowBackOrder ?? false
  );
  const [error, setError] = useState("");

  // "Add Item" / "Edit Item" button එක එබුවම validate කරලා onSave call කරනවා
  function handleSubmit() {
    const priceNumber = Number(price);
    const quantityNumber = Number(quantity);
    const alertNumber = Number(lowStockAlert);

    if (!name.trim()) return setError("Item name is required.");
    if (!partNumber.trim()) return setError("Part number is required.");
    if (price === "" || Number.isNaN(priceNumber) || priceNumber < 0)
      return setError("Enter a valid selling price.");
    if (!Number.isInteger(quantityNumber) || quantityNumber < 0)
      return setError("Quantity must be a whole number (0 or more).");
    if (!Number.isInteger(alertNumber) || alertNumber < 0)
      return setError("Low stock alert must be a whole number (0 or more).");

    onSave({
      name: name.trim(),
      partNumber: partNumber.trim(),
      category,
      description: description.trim(),
      price: priceNumber,
      quantity: quantityNumber,
      lowStockAlert: alertNumber,
      allowBackOrder,
    });
  }

  const title =
    mode === "add"
      ? "Add New Inventory Item"
      : mode === "edit"
      ? "Edit Inventory Item"
      : "View Inventory Item";

  return (
    // අඳුරු background එක (overlay). ඒකට ක්ලික් කළාම modal එක වැසෙනවා
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      {/* modal box එක. e.stopPropagation() නිසා box එක ඇතුලේ ක්ලික් කළාම වැසෙන්නේ නැහැ */}
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">
              {mode === "add"
                ? "Fill below details to add items to your system"
                : mode === "edit"
                ? "You can edit details to update"
                : "Item details"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="text-blue-900" />
          </button>
        </div>

        {item && (
          <div className="mt-4">
            <p className="text-lg font-semibold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">
              SKU: {item.partNumber} • Category: {item.category}
            </p>
          </div>
        )}

        {/* Item Identity */}
        <h3 className="mt-6 text-sm font-semibold text-slate-500">
          Item Identity
        </h3>
        <div className="mt-3 grid gap-6 md:grid-cols-[160px_1fr_1fr]">
          {/* Photo box (දැනට placeholder එකක් පමණයි) */}
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
            <Camera />
            <span className="mt-2 text-xs font-medium">Upload Photos</span>
          </div>

          <div className="space-y-6 md:col-span-2 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            <label className="block text-sm font-medium text-slate-900">
              Item Name
              <input
                className={`${inputClass} mt-2`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="eg: Brake Pad"
                disabled={isView}
              />
            </label>

            <label className="block text-sm font-medium text-slate-900">
              Part Number
              <input
                className={`${inputClass} mt-2`}
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="eg: RAD-AL-210"
                disabled={isView}
              />
            </label>

            <label className="block text-sm font-medium text-slate-900">
              Category
              <select
                className={`${inputClass} mt-2`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isView}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-900">
              Description
              <textarea
                className={`${inputClass} mt-2 h-24 resize-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
                disabled={isView}
              />
            </label>
          </div>
        </div>

        {/* Price & Stock */}
        <h3 className="mt-8 text-sm font-semibold text-slate-500">
          Price &amp; Stock
        </h3>
        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-900">
            Selling Price (Rs.)
            <input
              type="number"
              min="0"
              className={`${inputClass} mt-2`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isView}
            />
          </label>

          <label className="block text-sm font-medium text-slate-900">
            {mode === "add" ? "Initial Quantity" : "Quantity On Hand"}
            <input
              type="number"
              min="0"
              className={`${inputClass} mt-2`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isView}
            />
          </label>

          <label className="block text-sm font-medium text-slate-900">
            Low Stock Alert
            <input
              type="number"
              min="0"
              className={`${inputClass} mt-2`}
              value={lowStockAlert}
              onChange={(e) => setLowStockAlert(e.target.value)}
              disabled={isView}
            />
          </label>

          <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-900">
            <input
              type="checkbox"
              checked={allowBackOrder}
              onChange={(e) => setAllowBackOrder(e.target.checked)}
              disabled={isView}
            />
            Allow Back Order
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-yellow-400 px-8 py-3 text-sm font-semibold text-white hover:bg-yellow-500"
          >
            Cancel
          </button>

          {mode === "view" && item ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Trash2 size={16} />
              Delete
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {mode === "add" ? <Save size={16} /> : <Pencil size={16} />}
              {mode === "add" ? "Add Item" : "Edit Item"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}