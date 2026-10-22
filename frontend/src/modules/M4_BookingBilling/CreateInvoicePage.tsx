import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, CreditCard, Landmark, Trash2, X, Printer, Save } from "lucide-react";
import {
  calcTotals, formatMoney, nextInvoiceId, addInvoice,
  type JobCard, type InvoiceItem, type PaymentMethod, type InvoiceStatus,
} from "./mockData";
import { billingJobCards } from "./jobCardAdapter";

const TAX_RATE = 18;
type Discount = { kind: "flat" | "percent"; value: number };

const methods = [
  { name: "Cash" as PaymentMethod, icon: Banknote },
  { name: "Card" as PaymentMethod, icon: CreditCard },
  { name: "Bank" as PaymentMethod, icon: Landmark },
];

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [invoiceId] = useState(() => nextInvoiceId());
  const [today] = useState(() => new Date());

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [discountInput, setDiscountInput] = useState("");
  const [discount, setDiscount] = useState<Discount>({ kind: "flat", value: 0 });
  const [error, setError] = useState("");

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const discountAmount = discount.kind === "percent" ? (subtotal * discount.value) / 100 : discount.value;
  const totals = calcTotals(items, TAX_RATE, discountAmount);

  const results = billingJobCards.filter((j) =>
    `${j.id} ${j.plate}`.toLowerCase().includes(query.toLowerCase())
  );

  const selectJob = (j: JobCard) => {
    setJobCard(j);
    setItems(j.items.map((i) => ({ ...i })));
    setQuery(j.id);
    setOpen(false);
    setError("");
  };

  const updateQty = (idx: number, qty: number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, qty: Math.max(1, qty || 1) } : it)));
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const applyDiscount = () => {
    const raw = discountInput.trim();
    if (!raw) {
      setDiscount({ kind: "flat", value: 0 });
      setError("");
      return;
    }
    const isPercent = raw.endsWith("%");
    const num = parseFloat(raw.replace("%", ""));
    if (isNaN(num) || num < 0 || (isPercent && num > 100)) {
      setError("Enter a valid discount, e.g. 500 or 10%");
      return;
    }
    setDiscount({ kind: isPercent ? "percent" : "flat", value: num });
    setError("");
  };

  const save = (status: InvoiceStatus) => {
    if (!jobCard) {
      setError("Please select a job card first.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one billable item.");
      return;
    }
    const due = new Date(today);
    due.setDate(due.getDate() + 7);
    addInvoice({
      id: invoiceId,
      customer: jobCard.customer,
      phone: jobCard.phone,
      email: jobCard.email,
      address: jobCard.address,
      vehicle: jobCard.vehicle,
      plate: jobCard.plate,
      date: toISO(today),
      dueDate: toISO(due),
      status,
      paymentMethod: method,
      taxRate: TAX_RATE,
      discount: totals.discount,
      items,
    });
    navigate(`/billing/${invoiceId}`);
  };

  const info: [string, string | undefined][] = [
    ["Customer", jobCard?.customer],
    ["Phone", jobCard?.phone],
    ["Vehicle", jobCard?.vehicle],
    ["Plate", jobCard?.plate],
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create New Invoice</h1>
          <p className="text-sm text-gray-600">Review billable services and generate customer payment request.</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-400">Invoice Number</p>
            <p className="text-lg font-semibold">{invoiceId}</p>
          </div>
          <div className="border-l border-gray-300 pl-6">
            <p className="text-sm text-gray-400">Date</p>
            <p className="text-lg font-semibold">
              {today.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Job card selection */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-medium text-blue-900">Job Card Selection</h2>
        <div className="flex flex-wrap gap-6">
          <div className="relative w-full max-w-md">
            <p className="mb-2 text-sm font-medium text-gray-600">Select Active Job Card</p>
            <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 px-3">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search by JOB ID or License Plate"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
              <button type="button" onClick={() => setOpen(!open)} className="text-sm font-medium text-blue-900">
                Browse
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Example: JOB-7721, EV-992-TX</p>

            {open && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {results.map((j) => (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => selectJob(j)}
                      className="flex w-full justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <span className="font-medium">{j.id}</span>
                      <span className="text-gray-500">{j.customer} · {j.plate}</span>
                    </button>
                  </li>
                ))}
                {results.length === 0 && <li className="px-4 py-2 text-sm text-gray-500">No job cards found.</li>}
              </ul>
            )}
          </div>

          <div className="flex flex-1 flex-wrap gap-3">
            {info.map(([label, value]) => (
              <div key={label} className="min-w-32 flex-1 rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="mt-1 text-sm font-medium">{value ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billable items */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-medium">Billable Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3">Item/Service Name</th>
                <th className="py-3">Type</th>
                <th className="py-3">Qty</th>
                <th className="py-3">Unit Price</th>
                <th className="py-3">Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 font-medium">{item.name}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.type === "Service" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(idx, Number(e.target.value))}
                      className="w-16 rounded border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="py-3">{formatMoney(item.unitPrice)}</td>
                  <td className="py-3 font-medium">{formatMoney(item.qty * item.unitPrice)}</td>
                  <td className="py-3 text-right">
                    <button type="button" onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Select a job card to load its billable items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment + summary */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-medium">Payment Method</h2>
          <div className="mb-6 flex gap-4">
            {methods.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setMethod(name)}
                className={`flex h-24 flex-1 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-medium ${
                  method === name ? "border-2 border-blue-900 text-blue-900" : "border-gray-200 text-gray-600"
                }`}
              >
                <Icon className="h-6 w-6" />
                {name}
              </button>
            ))}
          </div>

          <p className="mb-2 text-sm font-medium">Discount (Flat or %)</p>
          <div className="flex gap-3">
            <input
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="e.g. 500 or 10%"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={applyDiscount}
              className="rounded-lg bg-slate-100 px-6 py-2 font-medium text-blue-900 hover:bg-slate-200"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-blue-900 p-6 text-white">
          <div className="flex justify-between py-2 text-lg"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
          <div className="flex justify-between py-2 text-lg"><span>Tax (GST {TAX_RATE}%)</span><span>{formatMoney(totals.tax)}</span></div>
          <div className="flex justify-between py-2 text-lg text-rose-300"><span>Discount</span><span>- {formatMoney(totals.discount)}</span></div>
          <div className="mt-4 border-t border-blue-700 pt-4">
            <p className="text-sm font-medium tracking-wide">GRAND TOTAL</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-3xl font-semibold">{formatMoney(totals.total)}</p>
              <span className="rounded-full bg-sky-200 px-3 py-1 text-xs text-blue-900">Dues in 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/billing")}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-5 py-3 hover:bg-gray-50"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          type="button"
          onClick={() => save("Draft")}
          className="flex items-center gap-1 rounded-lg bg-yellow-400 px-5 py-3 font-medium hover:bg-yellow-300"
        >
          <Save className="h-4 w-4" /> Save as draft
        </button>
        <button
          type="button"
          onClick={() => save("Pending")}
          className="flex items-center gap-1 rounded-lg bg-blue-900 px-5 py-3 font-medium text-white hover:bg-blue-800"
        >
          <Printer className="h-4 w-4" /> Generate &amp; Print
        </button>
      </div>
    </div>
  );
}