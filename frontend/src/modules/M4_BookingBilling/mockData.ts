export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface Invoice {
  id: string;
  customer: string;
  vehicle: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

export const invoices: Invoice[] = [
  { id: "INV-1001", customer: "Vikum", vehicle: "CAB-1234", date: "2026-10-01", amount: 25000, status: "Paid" },
  { id: "INV-1002", customer: "Chirath", vehicle: "KY-5678", date: "2026-10-05", amount: 18500, status: "Pending" },
  { id: "INV-1003", customer: "Yasiru", vehicle: "WP-9012", date: "2026-10-08", amount: 42000, status: "Overdue" },
  { id: "INV-1004", customer: "Dewmini", vehicle: "CBA-3456", date: "2026-10-12", amount: 12750, status: "Paid" },
  { id: "INV-1005", customer: "Pavani", vehicle: "SP-7890", date: "2026-10-15", amount: 33200, status: "Pending" },
];