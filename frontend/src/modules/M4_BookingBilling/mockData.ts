export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";
export type ItemType = "Service" | "Part";
export type PaymentMethod = "Cash" | "Card" | "Bank";

export interface InvoiceItem {
  name: string;
  type: ItemType;
  qty: number;
  unitPrice: number;
  note?: string;
}

export interface Invoice {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  vehicle: string;
  plate: string;
  vin?: string;
  mileage?: string;
  date: string; // YYYY-MM-DD
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  taxRate: number; // percent
  discount: number; // flat Rs amount
  items: InvoiceItem[];
}

export interface JobCard {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  vehicle: string;
  plate: string;
  items: InvoiceItem[];
}

export function calcTotals(items: InvoiceItem[], taxRate: number, discount: number) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const tax = (subtotal * taxRate) / 100;
  const appliedDiscount = Math.min(discount, subtotal + tax);
  return { subtotal, tax, discount: appliedDiscount, total: subtotal + tax - appliedDiscount };
}

export const formatMoney = (n: number) =>
  `Rs. ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export const jobCards: JobCard[] = [
  {
    id: "JOB-7721", customer: "James Perera", phone: "+94 774221598", email: "james@gmail.com",
    address: "Colombo 05", vehicle: "Tesla Model 3", plate: "EV-992-TX",
    items: [
      { name: "Full Synthetic Oil Change", type: "Service", qty: 1, unitPrice: 2500, note: "Premium 0W-30 Synthetic Oil + OEM Filter" },
      { name: "Brake Pad Replacement (Front)", type: "Part", qty: 2, unitPrice: 3900, note: "Ceramic pads for high-performance braking" },
      { name: "Tire Rotation & Balancing", type: "Service", qty: 1, unitPrice: 4580, note: "Rotation, balancing and pressure check" },
    ],
  },
  {
    id: "JOB-7722", customer: "Janath Kariyawasam", phone: "+94 787645199", email: "janath@gmail.com",
    address: "Kalugala, Madalla", vehicle: "2021 BMW M3 Sedan", plate: "CAL 992-K",
    items: [
      { name: "Brake System Labor", type: "Service", qty: 2, unitPrice: 1500, note: "Installation, bleeding, and testing" },
      { name: "Multi-Point Safety Inspection", type: "Service", qty: 1, unitPrice: 3000, note: "Tire pressure, fluids, and suspension check" },
    ],
  },
  {
    id: "JOB-7723", customer: "Nimal Perera", phone: "077 123 4567", email: "nimal@gmail.com",
    address: "Galle Road, Matara", vehicle: "Toyota Axio", plate: "CAB-1234",
    items: [
      { name: "Full Service", type: "Service", qty: 1, unitPrice: 15000 },
      { name: "Oil Filter", type: "Part", qty: 1, unitPrice: 2500 },
    ],
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-1001", customer: "Nimal Perera", phone: "077 123 4567", email: "nimal@gmail.com",
    address: "Galle Road, Matara", vehicle: "Toyota Axio", plate: "CAB-1234", vin: "NZE141-1234567", mileage: "45,200 km",
    date: "2026-10-01", dueDate: "2026-10-08", status: "Paid", paymentMethod: "Card", taxRate: 18, discount: 1000,
    items: [
      { name: "Full Service", type: "Service", qty: 1, unitPrice: 15000, note: "Engine oil, filters and fluid top-up" },
      { name: "Oil Filter", type: "Part", qty: 1, unitPrice: 2500 },
      { name: "Engine Oil (1L)", type: "Part", qty: 4, unitPrice: 1500 },
    ],
  },
  {
    id: "INV-1002", customer: "Kasun Silva", phone: "071 234 5678", email: "kasun@gmail.com",
    address: "Kandy Road, Kegalle", vehicle: "Suzuki Wagon R", plate: "KY-5678",
    date: "2026-10-05", dueDate: "2026-10-12", status: "Pending", paymentMethod: "Cash", taxRate: 18, discount: 0,
    items: [
      { name: "Wheel Alignment", type: "Service", qty: 1, unitPrice: 6500 },
      { name: "Brake Pads (set)", type: "Part", qty: 1, unitPrice: 9000 },
    ],
  },
  {
    id: "INV-1003", customer: "Amali Fernando", phone: "076 345 6789", email: "amali@gmail.com",
    address: "Negombo", vehicle: "Honda Vezel", plate: "WP-9012",
    date: "2026-10-08", dueDate: "2026-10-15", status: "Overdue", paymentMethod: "Bank", taxRate: 18, discount: 2000,
    items: [
      { name: "Engine Diagnostics", type: "Service", qty: 1, unitPrice: 8000 },
      { name: "Spark Plugs", type: "Part", qty: 4, unitPrice: 2200 },
      { name: "Battery", type: "Part", qty: 1, unitPrice: 22000 },
    ],
  },
  {
    id: "INV-1004", customer: "Ruwan Jayasinghe", phone: "070 456 7890", email: "ruwan@gmail.com",
    address: "Galle", vehicle: "Nissan Leaf", plate: "CBA-3456",
    date: "2026-10-12", dueDate: "2026-10-19", status: "Paid", paymentMethod: "Cash", taxRate: 18, discount: 0,
    items: [
      { name: "Interior Cleaning", type: "Service", qty: 1, unitPrice: 5000 },
      { name: "Air Freshener", type: "Part", qty: 2, unitPrice: 750 },
    ],
  },
  {
    id: "INV-1005", customer: "Dilani Wickrama", phone: "075 567 8901", email: "dilani@gmail.com",
    address: "Matara", vehicle: "Toyota Prius", plate: "SP-7890",
    date: "2026-10-15", dueDate: "2026-10-22", status: "Pending", paymentMethod: "Card", taxRate: 18, discount: 1500,
    items: [
      { name: "Tyre Replacement", type: "Service", qty: 1, unitPrice: 4000 },
      { name: "Tyre 195/65R15", type: "Part", qty: 4, unitPrice: 6500 },
    ],
  },
];

export function nextInvoiceId() {
  return `INV-${1000 + invoices.length + 1}`;
}

export function addInvoice(invoice: Invoice) {
  invoices.unshift(invoice);
}