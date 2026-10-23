import { jobCards as m2JobCards, type JobCard as M2JobCard } from "../M2_Operations/data/jobCardsData";
import type { JobCard, InvoiceItem } from "./mockData";

// Convert one M2 job card into the shape the billing page uses
export function toBillingJobCard(j: M2JobCard): JobCard {
  const serviceItems: InvoiceItem[] = j.services.map((s) => ({
    name: s.description,
    type: "Service",
    qty: 1,
    unitPrice: s.labourCost,
    note: s.type,
  }));

  const partItems: InvoiceItem[] = j.parts.map((p) => ({
    name: p.name,
    type: "Part",
    qty: p.qty,
    unitPrice: p.unitPrice,
    note: `Part No: ${p.partNo}`,
  }));

  return {
    id: j.id,
    customer: j.customer,
    phone: j.customerInfo.phone,
    email: j.customerInfo.email,
    address: j.customerInfo.address,
    vehicle: j.vehicle,
    plate: j.plateNo,
    items: [...serviceItems, ...partItems],
  };
}

// Job cards that can still be billed (hide the ones already invoiced)
export const billingJobCards: JobCard[] = m2JobCards
  .filter((j) => j.status !== "Invoiced")
  .map(toBillingJobCard);