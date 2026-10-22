import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Save, X } from "lucide-react";
import {
  addCustomer,
  addVehicle,
  findVehicleByPlate,
  getCustomerVehicles,
  nextCustomerId,
  updateCustomer,
  updateVehicle,
  vehicleMakes,
  type Customer,
  type Vehicle,
} from "../data/customersData";

type Props = {
  customer?: Customer; // when given, the pop-up edits this customer
  onClose: () => void;
  onSaved: (customer: Customer) => void;
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

export default function CustomerFormModal({ customer, onClose, onSaved }: Props) {
  const isEditing = customer !== undefined;
  const ownedVehicles = customer ? getCustomerVehicles(customer.id) : [];

  // customer fields
  const [firstName, setFirstName] = useState(customer?.firstName ?? "");
  const [lastName, setLastName] = useState(customer?.lastName ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");

  // vehicle fields (when editing, start with the customer's first vehicle)
  const [editingPlate, setEditingPlate] = useState(ownedVehicles[0]?.plateNo ?? "");
  const firstVehicle = ownedVehicles[0];
  const [vin, setVin] = useState(firstVehicle?.vin ?? "");
  const [plateNo, setPlateNo] = useState(firstVehicle?.plateNo ?? "");
  const [year, setYear] = useState(firstVehicle ? String(firstVehicle.year) : "");
  const [make, setMake] = useState(firstVehicle?.make ?? "");
  const [model, setModel] = useState(firstVehicle?.model ?? "");

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // a customer with several vehicles chooses which one to edit
  const chooseVehicle = (plate: string) => {
    const v = ownedVehicles.find((x) => x.plateNo === plate);
    if (!v) return;
    setEditingPlate(plate);
    setVin(v.vin);
    setPlateNo(v.plateNo);
    setYear(String(v.year));
    setMake(v.make);
    setModel(v.model);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const cleanPlate = plateNo.trim().toUpperCase();
    const yearNumber = Number(year);
    const thisYear = new Date().getFullYear();
    const otherVehicleWithPlate = findVehicleByPlate(cleanPlate);

    const problems: string[] = [];
    if (firstName.trim() === "") problems.push("Enter the first name.");
    if (lastName.trim() === "") problems.push("Enter the last name.");
    if (address.trim() === "") problems.push("Enter the address.");
    if (!/^0\d{9}$/.test(phone.replace(/\s/g, ""))) problems.push("Enter a 10-digit telephone number, e.g. 072 589 3215.");
    if (email !== "" && !/^\S+@\S+\.\S+$/.test(email)) problems.push("Enter a valid email address.");
    if (cleanPlate === "") problems.push("Enter the licence plate.");
    else if (otherVehicleWithPlate && otherVehicleWithPlate.plateNo !== editingPlate)
      problems.push(`${cleanPlate} is already registered to another vehicle.`);
    if (!(yearNumber >= 1980 && yearNumber <= thisYear + 1)) problems.push(`Enter a year between 1980 and ${thisYear + 1}.`);
    if (make === "") problems.push("Select the make.");
    if (model.trim() === "") problems.push("Enter the model.");

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const savedCustomer: Customer = {
      id: customer?.id ?? nextCustomerId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      joinedAt: customer?.joinedAt ?? new Date().toLocaleDateString("en-CA"),
    };
    const savedVehicle: Vehicle = {
      vin: vin.trim(),
      plateNo: cleanPlate,
      year: yearNumber,
      make,
      model: model.trim(),
      colour: ownedVehicles.find((v) => v.plateNo === editingPlate)?.colour ?? "",
      customerId: savedCustomer.id,
    };

    if (isEditing) {
      updateCustomer(savedCustomer);
      if (editingPlate) updateVehicle(editingPlate, savedVehicle);
      else addVehicle(savedVehicle); // the customer had no vehicle yet
    } else {
      addCustomer(savedCustomer, savedVehicle);
    }
    onSaved(savedCustomer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-form-title"
        onSubmit={handleSubmit}
        noValidate
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="rounded-2xl border border-slate-300">
          {/* Title */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <h2 id="customer-form-title" className="text-3xl font-bold text-slate-900">
                {isEditing ? "Edit Customer Details" : "Add New Customer"}
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {isEditing ? `Customer ID ${customer.id}` : "A new customer registration"}
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="text-blue-900 hover:text-blue-600">
              <X size={22} />
            </button>
          </div>

          {errors.length > 0 && (
            <ul role="alert" className="mx-6 mt-4 list-inside list-disc rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}

          {/* Personal information */}
          <div className="border-b border-slate-200 px-6 pb-7 pt-6">
            <h3 className="font-semibold text-blue-800/80">Customer Personal Information</h3>
            <div className="mt-5 grid grid-cols-1 gap-x-24 gap-y-5 sm:grid-cols-2">
              <Field label="First Name *" htmlFor="cf-first">
                <input id="cf-first" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="eg: Lasith" className={inputClass} />
              </Field>
              <Field label="Last Name *" htmlFor="cf-last">
                <input id="cf-last" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="eg: Perera" className={inputClass} />
              </Field>
              <Field label="Address *" htmlFor="cf-address">
                <input id="cf-address" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="eg: Maradana, Colombo 10" className={inputClass} />
              </Field>
              <Field label="Telephone Number *" htmlFor="cf-phone">
                <input id="cf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="eg: 0725893215" className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="cf-email">
                <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="eg: lasith@gmail.com" className={inputClass} />
              </Field>
            </div>
          </div>

          {/* Vehicle information */}
          <div className="px-6 pb-8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-blue-800/80">Vehicle Information</h3>
              {ownedVehicles.length > 1 && (
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  Vehicle
                  <select
                    value={editingPlate}
                    onChange={(e) => chooseVehicle(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
                  >
                    {ownedVehicles.map((v) => (
                      <option key={v.plateNo} value={v.plateNo}>
                        {v.make} {v.model} · {v.plateNo}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-16 gap-y-5 sm:grid-cols-3">
              <Field label="VIN" htmlFor="cf-vin">
                <input id="cf-vin" value={vin} onChange={(e) => setVin(e.target.value)}
                  placeholder="Enter your VIN" className={inputClass} />
              </Field>
              <Field label="Licence Plate *" htmlFor="cf-plate">
                <input id="cf-plate" value={plateNo} onChange={(e) => setPlateNo(e.target.value)}
                  placeholder="Enter your licence plate" className={`${inputClass} uppercase placeholder:normal-case`} />
              </Field>
              <Field label="Year *" htmlFor="cf-year">
                <input id="cf-year" type="number" value={year} onChange={(e) => setYear(e.target.value)}
                  placeholder="YYYY" className={inputClass} />
              </Field>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-24 gap-y-5 sm:grid-cols-2">
              <Field label="Make *" htmlFor="cf-make">
                <select id="cf-make" value={make} onChange={(e) => setMake(e.target.value)} className={inputClass}>
                  <option value="">Select make</option>
                  {vehicleMakes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Model *" htmlFor="cf-model">
                <input id="cf-model" value={model} onChange={(e) => setModel(e.target.value)}
                  placeholder="eg: Camry" className={inputClass} />
              </Field>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-10">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-10 py-3 text-sm font-semibold text-white bg-yellow-400 hover:bg-yellow-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Save size={16} /> {isEditing ? "Save Changes" : "Save Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
