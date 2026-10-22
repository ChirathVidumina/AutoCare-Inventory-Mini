import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Banknote, Camera, Car, Clock, Pencil, Plus, Printer } from "lucide-react";
import {
  formatDate,
  fullName,
  getCustomerById,
  getCustomerJobCards,
  getCustomerStats,
  getCustomerVehicles,
  updateCustomer,
  type Customer,
  type CustomerStatus,
} from "../data/customersData";
import { getJobCardTotals, type JobCardStatus } from "../data/jobCardsData";
import CustomerFormModal from "../components/CustomerFormModal";
import AddVehicleModal from "../components/AddVehicleModal";
import "./jobCardPrint.css"; // hides the sidebar when printing

const HISTORY_PREVIEW = 4;

const statusStyles: Record<CustomerStatus, string> = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-sky-100 text-sky-700",
};

const jobStatusStyles: Record<JobCardStatus, string> = {
  Open: "bg-sky-100 text-sky-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Invoiced: "bg-green-100 text-green-700",
};

const money = (amount: number) =>
  `Rs ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700";

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-[15px] font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-blue-900">{icon}</span>
    </div>
  );
}

export default function CustomerProfilePage() {
  const { id } = useParams();
  const customer = getCustomerById(id);

  if (!customer) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Customer not found</h1>
        <p className="mt-1 text-sm text-slate-500">There is no customer with ID "{id}".</p>
        <Link to="/customers" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to customers
        </Link>
      </div>
    );
  }

  // key gives each customer a fresh copy of the page state
  return <CustomerProfile key={customer.id} customer={customer} />;
}

function CustomerProfile({ customer: initialCustomer }: { customer: Customer }) {
  // the data lists change in memory, so this counter tells React to draw the page again
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  const customer = getCustomerById(initialCustomer.id) ?? initialCustomer;

  // contact details form (read-only until "Edit" is clicked)
  const [editingContact, setEditingContact] = useState(false);
  const [name, setName] = useState(fullName(customer));
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);
  const [contactErrors, setContactErrors] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [showAllHistory, setShowAllHistory] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingVehicle, setAddingVehicle] = useState(false);

  const vehicles = getCustomerVehicles(customer.id);
  const jobs = getCustomerJobCards(customer.id);
  const stats = getCustomerStats(customer.id);
  const history = showAllHistory ? jobs : jobs.slice(0, HISTORY_PREVIEW);

  const fillContact = (c: Customer) => {
    setName(fullName(c));
    setEmail(c.email);
    setPhone(c.phone);
    setAddress(c.address);
    setContactErrors([]);
  };

  const cancelContact = () => {
    fillContact(customer);
    setEditingContact(false);
  };

  const saveContact = (e: FormEvent) => {
    e.preventDefault();
    if (!editingContact) {
      setEditingContact(true); // first click on "Edit" unlocks the fields
      return;
    }

    const [firstName, ...rest] = name.trim().split(/\s+/);
    const problems: string[] = [];
    if (!firstName || rest.length === 0) problems.push("Enter the full name (first and last name).");
    if (!/^0\d{9}$/.test(phone.replace(/\s/g, ""))) problems.push("Enter a 10-digit phone number.");
    if (email !== "" && !/^\S+@\S+\.\S+$/.test(email)) problems.push("Enter a valid email address.");
    if (address.trim() === "") problems.push("Enter the address.");
    if (problems.length > 0) {
      setContactErrors(problems);
      return;
    }

    updateCustomer({
      ...customer,
      firstName,
      lastName: rest.join(" "),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setContactErrors([]);
    setEditingContact(false);
    refresh();
  };

  const choosePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file)); // preview only, until the backend can store it
    e.target.value = "";
  };

  return (
    <div className="p-8">
      <Link to="/customers" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline print:hidden">
        <ArrowLeft size={16} /> Back to customers
      </Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{fullName(customer)}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
            Customer ID: {customer.id}
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusStyles[stats.status]}`}>
              {stats.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-blue-900 hover:bg-slate-50"
          >
            <Printer size={16} /> Print Summary
          </button>
          <button
            type="button"
            onClick={() => setEditingProfile(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Pencil size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Total Spend" value={money(stats.totalSpend)} icon={<Banknote size={24} />} />
        <StatCard label="Total Visits" value={String(stats.visits)} icon={<Car size={24} />} />
        <StatCard
          label="Last Visit"
          value={stats.lastVisit ? formatDate(stats.lastVisit) : "No visits yet"}
          icon={<Clock size={24} className="text-red-500" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Contact details */}
        <form onSubmit={saveContact} noValidate className="rounded-xl border border-slate-300 bg-white xl:row-span-2">
          <h2 className="border-b border-slate-200 px-5 py-4 text-lg font-semibold text-slate-900">Contact Details</h2>
          <div className="space-y-5 p-5">
            <div className="flex justify-center">
              <div className="relative">
                {photoUrl ? (
                  <img src={photoUrl} alt={fullName(customer)} className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-500">
                    {initials(fullName(customer))}
                  </span>
                )}
                <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-blue-900 shadow print:hidden">
                  <Camera size={16} />
                  <span className="sr-only">Change photo</span>
                  <input type="file" accept="image/*" onChange={choosePhoto} className="sr-only" />
                </label>
              </div>
            </div>

            {contactErrors.length > 0 && (
              <ul role="alert" className="list-inside list-disc rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {contactErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}

            <div>
              <label htmlFor="cp-name" className="font-medium text-slate-800">Full Name</label>
              <input id="cp-name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editingContact} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cp-email" className="font-medium text-slate-800">Email Address</label>
              <input id="cp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editingContact}
                placeholder="No email recorded" className={inputClass} />
            </div>
            <div>
              <label htmlFor="cp-phone" className="font-medium text-slate-800">Phone Number</label>
              <input id="cp-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editingContact} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cp-address" className="font-medium text-slate-800">Address</label>
              <textarea id="cp-address" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editingContact}
                className={`${inputClass} resize-none`} />
            </div>

            <div className="flex justify-between gap-4 pt-2 print:hidden">
              <button
                type="button"
                onClick={cancelContact}
                disabled={!editingContact}
                className="rounded-lg border border-slate-300 px-8 py-2.5 text-sm font-semibold text-blue-900 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-blue-900 px-10 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
                {editingContact ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </form>

        {/* Vehicles */}
        <section className="rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Vehicle Details</h2>
            <button
              type="button"
              onClick={() => setAddingVehicle(true)}
              className="inline-flex items-center gap-2 rounded bg-slate-200 px-4 py-1.5 text-sm font-semibold text-blue-900 hover:bg-slate-300 print:hidden"
            >
              <Plus size={16} /> Add Vehicle
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
            {vehicles.map((v) => {
              const inWorkshop = jobs.some(
                (j) => j.plateNo === v.plateNo && (j.status === "Open" || j.status === "In Progress")
              );
              return (
                <div key={v.plateNo} className="rounded-xl border border-slate-300 p-4">
                  <div className="relative flex h-36 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                    <Car size={64} strokeWidth={1.25} />
                    {inWorkshop && (
                      <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-semibold text-slate-900">
                        In workshop
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {v.year} {v.make} {v.model}
                    </p>
                    <span className="text-xs font-medium text-slate-500">{v.plateNo}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">VIN {v.vin || "not recorded"}</p>
                  {v.colour && <p className="text-sm text-slate-500">{v.colour}</p>}
                </div>
              );
            })}
            {vehicles.length === 0 && <p className="text-sm text-slate-500">No vehicles registered yet.</p>}
          </div>
        </section>

        {/* Service history */}
        <section className="rounded-xl border border-slate-300 bg-white xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Service History</h2>
            {jobs.length > HISTORY_PREVIEW && (
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 print:hidden"
              >
                {showAllHistory ? "Show less" : "View All"} <ArrowRight size={16} />
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-slate-200 text-slate-600">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Job Card</th>
                  <th className="px-5 py-3 font-semibold">Vehicle</th>
                  <th className="px-5 py-3 font-semibold">Service Type</th>
                  <th className="px-5 py-3 text-right font-semibold">Cost</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((j) => (
                  <tr key={j.id} className="border-t border-slate-200">
                    <td className="px-5 py-4">{j.createdAt}</td>
                    <td className="px-5 py-4">
                      <Link to={`/job-cards/${j.id}`} className="font-medium text-blue-600 hover:underline">
                        {j.id}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{j.vehicle}</td>
                    <td className="px-5 py-4">{j.services[0]?.description ?? j.issue.split(":")[0]}</td>
                    <td className="px-5 py-4 text-right">{money(getJobCardTotals(j).grandTotal)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${jobStatusStyles[j.status]}`}>
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      No visits yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editingProfile && (
        <CustomerFormModal
          customer={customer}
          onClose={() => setEditingProfile(false)}
          onSaved={(saved) => {
            setEditingProfile(false);
            fillContact(saved);
            refresh();
          }}
        />
      )}

      {addingVehicle && (
        <AddVehicleModal
          customer={customer}
          onClose={() => setAddingVehicle(false)}
          onSaved={() => {
            setAddingVehicle(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
