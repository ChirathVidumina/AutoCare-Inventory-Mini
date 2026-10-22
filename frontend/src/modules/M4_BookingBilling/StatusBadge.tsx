import type { InvoiceStatus } from "./mockData";

const styles: Record<InvoiceStatus, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status, label }: { status: InvoiceStatus; label?: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {label ?? status}
    </span>
  );
}