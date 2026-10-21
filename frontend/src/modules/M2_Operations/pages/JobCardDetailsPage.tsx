import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Car, Mail, MapPin, Phone, User, Wrench } from "lucide-react";
import { getJobCardById, type JobCardStatus } from "../data/jobCardsData";

const statusStyles: Record<JobCardStatus, string> = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-amber-100 text-amber-800",
  Completed: "bg-green-100 text-green-800",
  Invoiced: "bg-slate-200 text-slate-700",
};

function InfoCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <span className="text-blue-700">{icon}</span>
        {title}
      </h2>
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

  return (
    <div className="p-8">
      <Link to="/job-cards" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
        <ArrowLeft size={16} /> Back to job cards
      </Link>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Job Card #{job.id}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}>
          {job.status}
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
        <InfoCard title="Customer Details" icon={<User size={18} />}>
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

        <InfoCard title="Vehicle Details" icon={<Car size={18} />}>
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
        </InfoCard>

        <InfoCard title="Lead Mechanic" icon={<Wrench size={18} />}>
          {job.mechanic === "Unassigned" ? (
            <p className="text-sm italic text-slate-400">No mechanic assigned yet</p>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-blue-900">
                {initials(job.mechanic)}
              </span>
              <p className="font-semibold text-slate-900">{job.mechanic}</p>
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

      {/* Services, parts and cost summary come next */}
    </div>
  );
}