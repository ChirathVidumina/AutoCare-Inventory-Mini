import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Car, CheckCircle2, ClipboardList, History, Mail, MapPin, Package,
  Pencil, Phone, Plus, Receipt, Send, Trash2, User, Wrench,
} from "lucide-react";
import {
  getJobCardById,
  getJobCardTotals,
  jobCards,
  TAX_RATE,
  type JobCard,
  type JobCardStatus,
  type ServiceStatus,
} from "../data/jobCardsData";
import { mechanicPerformance } from "../data/dashboardData";
import InspectionPhotos from "../components/InspectionPhotos";

const statusStyles: Record<JobCardStatus, string> = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
  Invoiced: "bg-slate-200 text-slate-700",
};

const serviceStyles: Record<ServiceStatus, string> = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
};

const money = (amount: number) => `Rs ${amount.toLocaleString()}`;

const mechanicNames = mechanicPerformance.map((m) => m.name);

const linkButton =
  "inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline";

function InfoCard({
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
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SmallBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-100 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-slate-900">{children}</div>
    </div>
  );
}

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function JobCardDetailsPage() {
  const { id } = useParams();
  const job = getJobCardById(id);

  if (!job) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Job card not found</h1>
        <p className="mt-1 text-sm text-slate-500">There is no job card with ID "{id}".</p>
        <Link to="/job-cards" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to job cards
        </Link>
      </div>
    );
  }

  // key={job.id} gives every job card a fresh copy of the state below
  return <JobCardDetails key={job.id} job={job} />;
}

function JobCardDetails({ job }: { job: JobCard }) {
  const [leadMechanic, setLeadMechanic] = useState(job.mechanic);
  const [editingMechanic, setEditingMechanic] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  
  const [status, setStatus] = useState(job.status);
  const [services, setServices] = useState(job.services);
  const [parts, setParts] = useState(job.parts);

  // money is always worked out from the current services and parts
  const totals = getJobCardTotals({ ...job, services, parts });

  const isClosed = status === "Completed" || status === "Invoiced";
  const unfinished = services.filter((s) => s.status !== "Completed").length;
  const canComplete = !isClosed && services.length > 0 && unfinished === 0;

  const changeServiceStatus = (serviceId: string, newStatus: ServiceStatus) => {
    setServices(services.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s)));
    if (status === "Open" && newStatus !== "Pending") setStatus("In Progress");
  };

  const removeService = (serviceId: string) =>
    setServices(services.filter((s) => s.id !== serviceId));

  const removePart = (partNo: string) =>
    setParts(parts.filter((p) => p.partNo !== partNo));

  // other job cards for the same vehicle (same plate number)
  const history = jobCards.filter((j) => j.plateNo === job.plateNo && j.id !== job.id);

  return (
    <div className="p-8">
      <Link to="/job-cards" className={linkButton}>
        <ArrowLeft size={16} /> Back to job cards
      </Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Job Card #{job.id}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
        {job.priority === "High" && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            High priority
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Created on {job.createdAt} at {job.createdTime}
      </p>

      {/* Top cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <InfoCard
          title="Customer Details"
          icon={<User size={18} />}
          action={
            <Link to="/customers" className={linkButton}>
              <Pencil size={14} /> Edit
            </Link>
          }
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
              {initials(job.customer)}
            </span>
            <div>
              <p className="font-semibold text-slate-900">{job.customer}</p>
              <p className="text-xs text-slate-500">Customer since {job.customerInfo.since}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2"><Phone size={16} className="text-slate-400" /> {job.customerInfo.phone}</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> {job.customerInfo.email}</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {job.customerInfo.address}</li>
          </ul>
        </InfoCard>

        <InfoCard
          title="Vehicle Details"
          icon={<Car size={18} />}
          action={
            <>
              <Link to="/customers" className={linkButton}>
                <Pencil size={14} /> Edit
              </Link>
              <button type="button" onClick={() => setShowHistory(!showHistory)} className={linkButton}>
                <History size={14} /> {showHistory ? "Hide history" : "History"}
              </button>
            </>
          }
        >
          <p className="font-semibold text-slate-900">{job.vehicle}</p>
          <p className="text-xs text-slate-500">
            {job.vehicleInfo.year} · {job.vehicleInfo.colour}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SmallBox label="License plate">{job.plateNo}</SmallBox>
            <SmallBox label="Mileage">{job.vehicleInfo.mileage.toLocaleString()} km</SmallBox>
            <SmallBox label="VIN">{job.vehicleInfo.vin}</SmallBox>
            <SmallBox label="Fuel level">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-slate-300">
                  <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: `${job.vehicleInfo.fuelLevel}%` }}
                  />
                </div>
                <span className="text-xs">{job.vehicleInfo.fuelLevel}%</span>
              </div>
            </SmallBox>
          </div>

          {showHistory && (
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold text-slate-500">Previous job cards</p>
              {history.length === 0 ? (
                <p className="mt-1 text-sm text-slate-400">No previous job cards for this vehicle.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center justify-between gap-2 text-sm">
                      <Link to={`/job-cards/${h.id}`} className="font-medium text-blue-600 hover:underline">
                        {h.id}
                      </Link>
                      <span className="text-slate-500">{h.createdAt}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[h.status]}`}>
                        {h.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </InfoCard>

        <InfoCard
          title="Lead Mechanic"
          icon={<Wrench size={18} />}
          action={
            <button type="button" onClick={() => setEditingMechanic(!editingMechanic)} className={linkButton}>
              <Pencil size={14} /> {editingMechanic ? "Done" : "Change"}
            </button>
          }
        >
          {editingMechanic ? (
            <select
              value={leadMechanic}
              onChange={(e) => setLeadMechanic(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option>Unassigned</option>
              {mechanicNames.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          ) : leadMechanic === "Unassigned" ? (
            <p className="text-sm italic text-slate-400">No mechanic assigned yet</p>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-blue-900">
                {initials(leadMechanic)}
              </span>
              <p className="font-semibold text-slate-900">{leadMechanic}</p>
            </div>
          )}

          <p className="mt-4 text-xs font-semibold text-slate-500">Customer request</p>
          <p className="mt-1 text-sm text-slate-700">{job.issue}</p>

          <p className="mt-4 text-xs font-semibold text-slate-500">Job note</p>
          <p className="mt-1 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {job.mechanicNote || "No notes for the mechanic."}
          </p>
        </InfoCard>
      </div>

            {/* Services, parts and cost summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <InfoCard
            title="Service & Labour"
            icon={<ClipboardList size={18} />}
            action={
              !isClosed && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  <Plus size={14} /> Add Service
                </button>
              )
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="px-3 py-2 font-semibold">Service</th>
                    <th className="px-3 py-2 font-semibold">Assigned To</th>
                    <th className="px-3 py-2 font-semibold">Hours (est / actual)</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 text-right font-semibold">Labour</th>
                    {!isClosed && <th className="px-3 py-2"><span className="sr-only">Remove</span></th>}
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id} className="border-t border-slate-200">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-slate-900">{s.description}</p>
                        <p className="text-xs text-slate-500">{s.type}</p>
                      </td>
                      <td className={`px-3 py-2.5 ${s.mechanic === "Unassigned" ? "italic text-slate-400" : ""}`}>
                        {s.mechanic}
                      </td>
                      <td className="px-3 py-2.5">
                        {s.estHours} h / {s.actualHours} h
                      </td>
                      <td className="px-3 py-2.5">
                        {isClosed ? (
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${serviceStyles[s.status]}`}>
                            {s.status}
                          </span>
                        ) : (
                          <select
                            value={s.status}
                            onChange={(e) => changeServiceStatus(s.id, e.target.value as ServiceStatus)}
                            aria-label={`Status of ${s.description}`}
                            className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${serviceStyles[s.status]}`}
                          >
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">{money(s.labourCost)}</td>
                      {!isClosed && (
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removeService(s.id)}
                            aria-label={`Remove ${s.description}`}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                        No services added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </InfoCard>

          <InfoCard title="Parts Requisition" icon={<Package size={18} />}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="px-3 py-2 font-semibold">Part No</th>
                    <th className="px-3 py-2 font-semibold">Part Name</th>
                    <th className="px-3 py-2 text-right font-semibold">Quantity</th>
                    <th className="px-3 py-2 text-right font-semibold">Unit Price</th>
                    <th className="px-3 py-2 text-right font-semibold">Total Price</th>
                    {!isClosed && <th className="px-3 py-2"><span className="sr-only">Remove</span></th>}
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p.partNo} className="border-t border-slate-200">
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{p.partNo}</td>
                      <td className="px-3 py-2.5">{p.name}</td>
                      <td className="px-3 py-2.5 text-right">{p.qty}</td>
                      <td className="px-3 py-2.5 text-right">{money(p.unitPrice)}</td>
                      <td className="px-3 py-2.5 text-right font-medium">{money(p.qty * p.unitPrice)}</td>
                      {!isClosed && (
                        <td className="px-3 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => removePart(p.partNo)}
                            aria-label={`Remove ${p.name}`}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {parts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                        No parts used yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </InfoCard>
        </div>

        <div className="self-start">
          <InfoCard title="Cost Summary" icon={<Receipt size={18} />}>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Labour total</dt>
                <dd className="font-medium">{money(totals.labour)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Parts total</dt>
                <dd className="font-medium">{money(totals.parts)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Service charge</dt>
                <dd className="font-medium">{money(totals.serviceCharge)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Tax ({TAX_RATE * 100}%)</dt>
                <dd className="font-medium">{money(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <dt className="text-base font-bold text-slate-900">Grand Total</dt>
                <dd className="text-lg font-bold text-blue-800">{money(totals.grandTotal)}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled={!canComplete}
              onClick={() => setStatus("Completed")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <CheckCircle2 size={18} /> {isClosed ? "Job completed" : "Complete Job"}
            </button>
            {!isClosed && unfinished > 0 && (
              <p className="mt-2 text-center text-xs text-slate-500">
                {unfinished} {unfinished === 1 ? "service is" : "services are"} not completed yet
              </p>
            )}

            <button
              type="button"
              disabled={status !== "Completed"}
              onClick={() => setStatus("Invoiced")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              <Send size={18} /> {status === "Invoiced" ? "Invoice sent" : "Send Invoice"}
            </button>
          </InfoCard>
        </div>
      </div>
      <InspectionPhotos readOnly={isClosed} />
    </div>
  );
}