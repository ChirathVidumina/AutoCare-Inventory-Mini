import { useEffect, useState, type FormEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import { partsCatalogue, type PartItem } from "../data/jobCardsData";

type Props = {
  jobId: string;
  vehicle: string;
  initial?: PartItem; // when given, the pop-up edits this part's quantity
  onClose: () => void;
  onSave: (part: PartItem) => void;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500";

export default function AddPartModal({ jobId, vehicle, initial, onClose, onSave }: Props) {
  const isEditing = initial !== undefined;
  const [partNo, setPartNo] = useState(initial?.partNo ?? "");
  const [qty, setQty] = useState(initial ? String(initial.qty) : "1");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // when editing, keep the price the part was added with
  const selected = isEditing ? initial : partsCatalogue.find((p) => p.partNo === partNo);
  const quantity = Number(qty);
  const lineTotal = selected && quantity > 0 ? selected.unitPrice * quantity : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return setError("Choose a part.");
    if (!Number.isInteger(quantity) || quantity < 1) return setError("Quantity must be a whole number, 1 or more.");
    onSave({ partNo: selected.partNo, name: selected.name, unitPrice: selected.unitPrice, qty: quantity });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="part-modal-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="part-modal-title" className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Part" : "Add Part"}
            </h2>
            <p className="text-xs text-slate-500">
              Job Card #{jobId} · {vehicle}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div>
            <label htmlFor="part-select" className="text-sm font-medium text-slate-700">Part *</label>
            <select
              id="part-select"
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
              disabled={isEditing}
              className={inputClass}
            >
              <option value="">Select part...</option>
              {isEditing && initial && !partsCatalogue.some((p) => p.partNo === initial.partNo) && (
                <option value={initial.partNo}>{initial.name}</option>
              )}
              {partsCatalogue.map((p) => (
                <option key={p.partNo} value={p.partNo}>
                  {p.name} — Rs {p.unitPrice.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="part-qty" className="text-sm font-medium text-slate-700">Quantity *</label>
            <input
              id="part-qty"
              type="number"
              min="1"
              step="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex justify-between rounded-lg bg-slate-100 px-4 py-3 text-sm">
            <span className="text-slate-600">Line total</span>
            <span className="font-semibold text-slate-900">Rs {lineTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-yellow-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            {isEditing ? <Check size={16} /> : <Plus size={16} />} {isEditing ? "Save Part" : "Add Part"}
          </button>
        </div>
      </form>
    </div>
  );
}
