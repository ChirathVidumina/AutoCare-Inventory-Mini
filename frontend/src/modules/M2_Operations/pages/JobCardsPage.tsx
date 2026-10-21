import { jobCards } from "../data/jobCardsData";
import JobCardsTable from "../components/JobCardsTable";

function SummaryCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-red-600" : "text-blue-900"}`}>{value}</p>
    </div>
  );
}

export default function JobCardsPage() {
  const total = jobCards.length;
  const open = jobCards.filter((j) => j.status === "Open").length;
  const inProgress = jobCards.filter((j) => j.status === "In Progress").length;
  const completed = jobCards.filter((j) => j.status === "Completed").length;
  const highPriorityOpen = jobCards.filter(
    (j) => j.priority === "High" && (j.status === "Open" || j.status === "In Progress")
  ).length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">All Job Cards</h1>
      <p className="text-sm text-slate-500">
        Track every vehicle in the workshop, from open to invoiced
      </p>

      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total Job Cards" value={total} />
        <SummaryCard label="Open" value={open} />
        <SummaryCard label="In Progress" value={inProgress} />
        <SummaryCard label="Completed" value={completed} />
        <SummaryCard label="High Priority Active" value={highPriorityOpen} highlight />
      </div>
      <JobCardsTable />
    </div>
  );
}