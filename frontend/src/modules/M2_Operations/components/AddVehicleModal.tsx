import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { addVehicle, findVehicleByPlate, vehicleMakes, type Customer } from "../data/customersData";

type Props = {
  customer: Customer;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AddVehicleModal({ customer, onClose, onSaved }: Props) {
  const [vin, setVin] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPlate = plateNo.trim().toUpperCase();
    const yearNumber = Number(year);
    const thisYear = new Date().getFullYear();

    const problems: string[] = [];
    if (cleanPlate === "") problems.push("Enter the licence plate.");
    else if (findVehicleByPlate(cleanPlate)) problems.push(`${cleanPlate} is already registered to another vehicle.`);
    if (!(yearNumber >= 1980 && yearNumber <= thisYear + 1)) problems.push(`Enter a year between 1980 and ${thisYear + 1}.`);
    if (make === "") problems.push("Select the make.");
    if (model.trim() === "") problems.push("Enter the model.");
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    addVehicle({
      vin: vin.trim(),
      plateNo: cleanPlate,
      year: yearNumber,
      make,
      model: model.trim(),
      colour: colour.trim(),
      customerId: customer.id,
    });
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-vehicle-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        noValidate
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="add-vehicle-title" className="text-xl font-bold text-slate-900">Add Vehicle</h2>
            <p className="text-xs text-slate-500">
              For {customer.firstName} {customer.lastName} · {customer.id}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-blue-900 hover:text-blue-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {errors.length > 0 && (
            <ul role="alert" className="list-inside list-disc rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="VIN" htmlFor="av-vin">
              <input id="av-vin" value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Enter VIN" className={inputClass} />
            </Field>
            <Field label="Licence Plate *" htmlFor="av-plate">
              <input id="av-plate" value={plateNo} onChange={(e) => setPlateNo(e.target.value)} placeholder="e.g. CBA-1234"
                className={`${inputClass} uppercase placeholder:normal-case`} />
            </Field>
            <Field label="Year *" htmlFor="av-year">
              <input id="av-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Make *" htmlFor="av-make">
              <select id="av-make" value={make} onChange={(e) => setMake(e.target.value)} className={inputClass}>
                <option value="">Select make</option>
                {vehicleMakes.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Model *" htmlFor="av-model">
              <input id="av-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Camry" className={inputClass} />
            </Field>
            <Field label="Colour" htmlFor="av-colour">
              <input id="av-colour" value={colour} onChange={(e) => setColour(e.target.value)} placeholder="e.g. White" className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose}
            className="rounded bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-white hover:bg-yellow-500">
            Cancel
          </button>
          <button type="submit"
            className="inline-flex items-center gap-2 rounded bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
