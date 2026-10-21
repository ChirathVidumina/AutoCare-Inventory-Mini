import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Car, ClipboardList, Plus, Save, Search, UserRound, X } from "lucide-react";
import {
  addJobCard,
  jobCards,
  nextJobCardId,
  serviceTypes,
  type JobCard,
  type Priority,
} from "../data/jobCardsData";

type FormState = {
  customer: string;
  email: string;
  phone: string;
  address: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  plateNo: string;
  vin: string;
  mileage: string;
  fuelLevel: string;
  serviceType: string;
  issue: string;
  priority: Priority;
};

const emptyForm: FormState = {
  customer: "",
  email: "",
  phone: "",
  address: "",
  make: "",
  model: "",
  year: "",
  colour: "",
  plateNo: "",
  vin: "",
  mileage: "",
  fuelLevel: "",
  serviceType: "",
  issue: "",
  priority: "Normal",
};

const priorities: Priority[] = ["Low", "Normal", "High"];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <span className="text-blue-700">{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateJobCardPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");

  // change one field and keep all the others
  const update = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm({ ...form, [field]: value });

  // customers we already know, from previous job cards (one entry per person)
  const knownCustomers = Array.from(
    new Map(
      jobCards.map((j) => [
        `${j.customer}|${j.customerInfo.phone}`,
        { name: j.customer, ...j.customerInfo },
      ])
    ).values()
  );
  type KnownCustomer = (typeof knownCustomers)[number];

  const query = customerQuery.trim().toLowerCase().replace(/\s/g, "");
  const customerMatches =
    query === ""
      ? []
      : knownCustomers
          .filter(
            (c) =>
              c.name.toLowerCase().replace(/\s/g, "").includes(query) ||
              c.phone.replace(/\s/g, "").includes(query)
          )
          .slice(0, 5);

  const pickCustomer = (c: KnownCustomer) => {
    setForm({ ...form, customer: c.name, phone: c.phone, email: c.email, address: c.address });
    setSearching(false);
    setCustomerQuery("");
  };

  // vehicles this customer brought before (newest first, each plate once)
  const customerVehicles = jobCards
    .filter((j) => j.customer === form.customer && j.customerInfo.phone === form.phone)
    .filter((j, i, list) => list.findIndex((x) => x.plateNo === j.plateNo) === i);

  const pickVehicle = (j: JobCard) => {
    const [make, ...model] = j.vehicle.split(" ");
    setForm({
      ...form,
      make,
      model: model.join(" "),
      year: String(j.vehicleInfo.year),
      colour: j.vehicleInfo.colour,
      plateNo: j.plateNo,
      vin: j.vehicleInfo.vin,
      mileage: String(j.vehicleInfo.mileage),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const phoneDigits = form.phone.replace(/\s/g, "");
    const plate = form.plateNo.trim().toUpperCase();
    const year = Number(form.year);
    const fuel = form.fuelLevel === "" ? 0 : Number(form.fuelLevel);
    const thisYear = new Date().getFullYear();

    const problems: string[] = [];
    if (form.customer.trim() === "") problems.push("Enter the customer name.");
    if (!/^0\d{9}$/.test(phoneDigits)) problems.push("Enter a 10-digit phone number, e.g. 077 123 4567.");
    if (form.email !== "" && !/^\S+@\S+\.\S+$/.test(form.email)) problems.push("Enter a valid email address.");
    if (form.make.trim() === "" || form.model.trim() === "") problems.push("Enter the vehicle make and model.");
    if (!(year >= 1980 && year <= thisYear + 1)) problems.push(`Enter a year between 1980 and ${thisYear + 1}.`);
    if (plate === "") problems.push("Enter the license plate.");
    if (Number(form.mileage) < 0) problems.push("Mileage cannot be negative.");
    if (fuel < 0 || fuel > 100) problems.push("Fuel level must be between 0 and 100%.");
    if (form.serviceType === "") problems.push("Choose the service type.");
    if (form.issue.trim() === "") problems.push("Describe the customer's request.");

    // a vehicle should not have two active job cards at the same time
    const active = jobCards.find(
      (j) => j.plateNo.toUpperCase() === plate && (j.status === "Open" || j.status === "In Progress")
    );
    if (plate !== "" && active) problems.push(`${plate} already has an active job card (${active.id}).`);

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const now = new Date();
    const known = knownCustomers.find(
      (c) => c.name === form.customer.trim() && c.phone.replace(/\s/g, "") === phoneDigits
    );

    const job: JobCard = {
      id: nextJobCardId(),
      createdAt: now.toLocaleDateString("en-CA"), // YYYY-MM-DD in local time
      createdTime: now.toTimeString().slice(0, 5), // HH:mm
      priority: form.priority,
      status: "Open",
      issue: `${form.serviceType}: ${form.issue.trim()}`,
      customer: form.customer.trim(),
      customerInfo: {
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        since: known ? known.since : now.getFullYear(),
      },
      vehicle: `${form.make.trim()} ${form.model.trim()}`,
      plateNo: plate,
      vehicleInfo: {
        year,
        colour: form.colour.trim() || "Colour not recorded",
        vin: form.vin.trim() || "—",
        mileage: Number(form.mileage) || 0,
        fuelLevel: fuel,
      },
      mechanic: "Unassigned",
      mechanicNote: "",
      services: [],
      parts: [],
    };

    addJobCard(job);
    navigate(`/job-cards/${job.id}`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="p-8">
      <Link to="/job-cards" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
        <ArrowLeft size={16} /> Back to job cards
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Job Card</h1>
          <p className="text-sm text-slate-500">Register the customer, the vehicle and what they need</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/job-cards"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          {/* TODO: save drafts once the backend is ready */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-yellow-300"
          >
            <Save size={16} /> Save Draft
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Left: customer and vehicle */}
        <div className="space-y-5 lg:col-span-3">
          <Card
            title="Customer Details"
            icon={<UserRound size={18} />}
            action={
              <button
                type="button"
                onClick={() => setSearching(!searching)}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                {searching ? <X size={14} /> : <Search size={14} />}
                {searching ? "Close search" : "Existing Customer"}
              </button>
            }
          >
            {searching && (
              <div className="mb-4 rounded-xl bg-blue-50 p-3">
                <label htmlFor="cust-search" className="text-xs font-semibold text-blue-800">
                  Search by name or phone
                </label>
                <input
                  id="cust-search"
                  autoFocus
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder="e.g. Kamal or 0778527896"
                  className={inputClass}
                />
                {query !== "" && (
                  <ul className="mt-2 divide-y divide-blue-100 overflow-hidden rounded-lg bg-white">
                    {customerMatches.map((c) => (
                      <li key={`${c.name}|${c.phone}`}>
                        <button
                          type="button"
                          onClick={() => pickCustomer(c)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-blue-50"
                        >
                          <span className="font-medium text-slate-900">{c.name}</span>
                          <span className="text-slate-500">{c.phone}</span>
                        </button>
                      </li>
                    ))}
                    {customerMatches.length === 0 && (
                      <li className="px-3 py-2 text-sm text-slate-500">No customer found. Fill in the details below.</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Customer name *" htmlFor="cust-name">
                  <input id="cust-name" value={form.customer} onChange={(e) => update("customer", e.target.value)}
                    placeholder="e.g. John Doe" className={inputClass} />
                </Field>
              </div>
              <Field label="Email" htmlFor="cust-email">
                <input id="cust-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  placeholder="e.g. john@gmail.com" className={inputClass} />
              </Field>
              <Field label="Phone number *" htmlFor="cust-phone">
                <input id="cust-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. 077 585 4736" className={inputClass} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address" htmlFor="cust-address">
                  <input id="cust-address" value={form.address} onChange={(e) => update("address", e.target.value)}
                    placeholder="e.g. Maradana, Colombo 10" className={inputClass} />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Vehicle Info" icon={<Car size={18} />}>
            {customerVehicles.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-500">Previous vehicles:</span>
                {customerVehicles.map((j) => (
                  <button
                    key={j.plateNo}
                    type="button"
                    onClick={() => pickVehicle(j)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-medium text-blue-800 hover:bg-blue-100"
                  >
                    {j.vehicle} · {j.plateNo}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Make *" htmlFor="veh-make">
                <input id="veh-make" value={form.make} onChange={(e) => update("make", e.target.value)}
                  placeholder="e.g. Toyota" className={inputClass} />
              </Field>
              <Field label="Model *" htmlFor="veh-model">
                <input id="veh-model" value={form.model} onChange={(e) => update("model", e.target.value)}
                  placeholder="e.g. Axio" className={inputClass} />
              </Field>
              <Field label="Year *" htmlFor="veh-year">
                <input id="veh-year" type="number" value={form.year} onChange={(e) => update("year", e.target.value)}
                  placeholder="e.g. 2016" className={inputClass} />
              </Field>
              <Field label="Colour" htmlFor="veh-colour">
                <input id="veh-colour" value={form.colour} onChange={(e) => update("colour", e.target.value)}
                  placeholder="e.g. White" className={inputClass} />
              </Field>
              <Field label="License plate *" htmlFor="veh-plate">
                <input id="veh-plate" value={form.plateNo} onChange={(e) => update("plateNo", e.target.value)}
                  placeholder="e.g. CAB-1234" className={`${inputClass} uppercase`} />
              </Field>
              <Field label="VIN (Vehicle Identification Number)" htmlFor="veh-vin">
                <input id="veh-vin" value={form.vin} onChange={(e) => update("vin", e.target.value)}
                  placeholder="e.g. NKE165-7021456" className={inputClass} />
              </Field>
              <Field label="Mileage (km)" htmlFor="veh-mileage">
                <input id="veh-mileage" type="number" min="0" value={form.mileage}
                  onChange={(e) => update("mileage", e.target.value)} placeholder="0" className={inputClass} />
              </Field>
              <Field label="Fuel level (%)" htmlFor="veh-fuel">
                <input id="veh-fuel" type="number" min="0" max="100" value={form.fuelLevel}
                  onChange={(e) => update("fuelLevel", e.target.value)} placeholder="0" className={inputClass} />
              </Field>
            </div>
          </Card>
        </div>

        {/* Right: service request */}
        <div className="lg:col-span-2">
          <Card title="Initial Service Request" icon={<ClipboardList size={18} />}>
            <div className="space-y-4">
              <Field label="Service type *" htmlFor="req-type">
                <select id="req-type" value={form.serviceType} onChange={(e) => update("serviceType", e.target.value)}
                  className={inputClass}>
                  <option value="">Select service type...</option>
                  {serviceTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Issue description *" htmlFor="req-issue">
                <textarea id="req-issue" rows={4} value={form.issue} onChange={(e) => update("issue", e.target.value)}
                  placeholder="Describe the customer's request or any special issue"
                  className={`${inputClass} resize-y`} />
              </Field>

              <fieldset>
                <legend className="text-sm font-medium text-slate-700">Priority level</legend>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={form.priority === p}
                      onClick={() => update("priority", p)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                        form.priority === p
                          ? p === "High"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-blue-300 bg-blue-50 text-blue-800"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </fieldset>

              {errors.length > 0 && (
                <ul role="alert" className="list-inside list-disc rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Plus size={18} /> Create Job Card
              </button>
              <p className="text-center text-xs text-slate-500">
                The job card opens as <span className="font-medium">Open</span> with no mechanic assigned. Add services
                and assign a mechanic on the next page.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
