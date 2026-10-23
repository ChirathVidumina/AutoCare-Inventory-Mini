import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  partsCatalogue,
  serviceTypes,
  type PartItem,
  type ServiceItem,
  type ServiceStatus,
} from "../data/jobCardsData";

type PartRow = { partNo: string; qty: number };

type Props = {
  jobId: string;
  vehicle: string;
  mechanics: string[];
  initial?: ServiceItem; // when given, the pop-up edits this service instead of adding a new one
  onClose: () => void;
  onAdd: (service: ServiceItem, parts: PartItem[]) => void;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const labelClass = "text-sm font-medium text-slate-700";
const sectionTitle = "text-xs font-semibold uppercase tracking-wider text-blue-700";

export default function AddServiceModal({ jobId, vehicle, mechanics, initial, onClose, onAdd }: Props) {
  const isEditing = initial !== undefined;
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [status, setStatus] = useState<ServiceStatus>(initial?.status ?? "Pending");
  const [estHours, setEstHours] = useState(initial ? String(initial.estHours) : "");
  const [actualHours, setActualHours] = useState(initial ? String(initial.actualHours) : "");
  const [labourCost, setLabourCost] = useState(initial ? String(initial.labourCost) : "");
  const [mechanic, setMechanic] = useState(initial?.mechanic ?? "Unassigned");
  const [partRows, setPartRows] = useState<PartRow[]>([{ partNo: "", qty: 1 }]);
  const [errors, setErrors] = useState<string[]>([]);

  // close the pop-up with the Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const updateRow = (index: number, changes: Partial<PartRow>) =>
    setPartRows(partRows.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  const addRow = () => setPartRows([...partRows, { partNo: "", qty: 1 }]);

  const removeRow = (index: number) => setPartRows(partRows.filter((_, i) => i !== index));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // stop the browser from reloading the page

    const chosenRows = partRows.filter((row) => row.partNo !== "");
    const problems: string[] = [];
    if (description.trim() === "") problems.push("Enter the service name.");
    if (type === "") problems.push("Choose a service type.");
    if (Number(labourCost) <= 0) problems.push("Enter the labour cost.");
    if (Number(estHours) < 0 || Number(actualHours) < 0) problems.push("Hours cannot be negative.");
    if (status === "Completed" && Number(actualHours) <= 0)
      problems.push("Enter the actual hours for a completed service.");
    if (chosenRows.some((row) => row.qty < 1)) problems.push("Each part needs a quantity of at least 1.");

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const parts: PartItem[] = chosenRows.flatMap((row) => {
      const item = partsCatalogue.find((p) => p.partNo === row.partNo);
      return item ? [{ ...item, qty: row.qty }] : [];
    });

    onAdd(
      {
        id: initial?.id ?? crypto.randomUUID(),
        description: description.trim(),
        type,
        mechanic,
        status,
        estHours: Number(estHours) || 0,
        actualHours: Number(actualHours) || 0,
        labourCost: Number(labourCost),
      },
      isEditing ? [] : parts
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-service-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="add-service-title" className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-xs text-slate-500">
              Job Card #{jobId} · {vehicle}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <ul className="mx-6 mt-4 list-inside list-disc rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        {/* Service details */}
        <div className="space-y-4 border-b border-slate-200 px-6 py-5">
          <p className={sectionTitle}>Service details</p>
          <div>
            <label htmlFor="svc-desc" className={labelClass}>Service name / description *</label>
            <input
              id="svc-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Front Brake Pad Replacement"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-type" className={labelClass}>Service type *</label>
              <select id="svc-type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                <option value="">Select type...</option>
                {serviceTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="svc-status" className={labelClass}>Service status</label>
              <select
                id="svc-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                className={inputClass}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Labour and assignment */}
        <div className="space-y-4 border-b border-slate-200 px-6 py-5">
          <p className={sectionTitle}>Labour &amp; assignment</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="svc-est" className={labelClass}>Estimated hours</label>
              <input id="svc-est" type="number" min="0" step="0.1" value={estHours}
                onChange={(e) => setEstHours(e.target.value)} placeholder="0.0" className={inputClass} />
            </div>
            <div>
              <label htmlFor="svc-actual" className={labelClass}>Actual hours</label>
              <input id="svc-actual" type="number" min="0" step="0.1" value={actualHours}
                onChange={(e) => setActualHours(e.target.value)} placeholder="0.0" className={inputClass} />
            </div>
            <div>
              <label htmlFor="svc-cost" className={labelClass}>Labour cost (Rs) *</label>
              <input id="svc-cost" type="number" min="0" step="100" value={labourCost}
                onChange={(e) => setLabourCost(e.target.value)} placeholder="0" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="svc-mech" className={labelClass}>Mechanic assigned</label>
            <select id="svc-mech" value={mechanic} onChange={(e) => setMechanic(e.target.value)} className={inputClass}>
              <option>Unassigned</option>
              {mechanics.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parts required (only when adding; parts are edited in the parts table) */}
        {!isEditing && (
        <div className="space-y-3 px-6 py-5">
          <p className={sectionTitle}>Parts required</p>
          <div className="rounded-xl bg-slate-100 p-4">
            <div className="grid grid-cols-[1fr_90px_32px] gap-3 text-xs font-semibold text-slate-600">
              <span>Part</span>
              <span>Quantity</span>
              <span />
            </div>
            {partRows.map((row, index) => (
              <div key={index} className="mt-2 grid grid-cols-[1fr_90px_32px] items-center gap-3">
                <select
                  aria-label={`Part ${index + 1}`}
                  value={row.partNo}
                  onChange={(e) => updateRow(index, { partNo: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select part...</option>
                  {partsCatalogue.map((p) => (
                    <option key={p.partNo} value={p.partNo}>
                      {p.name} — Rs {p.unitPrice.toLocaleString()}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Quantity for part ${index + 1}`}
                  type="number"
                  min="1"
                  value={row.qty}
                  onChange={(e) => updateRow(index, { qty: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label={`Remove part ${index + 1}`}
                  className="text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              <Plus size={14} /> Add another part
            </button>
          </div>
        </div>
        )}

        {/* Footer */}
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
            <Plus size={16} /> {isEditing ? "Save Service" : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
