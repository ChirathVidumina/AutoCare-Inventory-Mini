export type JobCardStatus = "Open" | "In Progress" | "Completed" | "Invoiced";
export type Priority = "High" | "Normal" | "Low";
export type ServiceStatus = "Pending" | "In Progress" | "Completed";

export type ServiceItem = {
  id: string;
  description: string;
  type: string;
  mechanic: string;
  status: ServiceStatus;
  estHours: number;
  actualHours: number;
  labourCost: number; // LKR
};

export type PartItem = {
  partNo: string;
  name: string;
  qty: number;
  unitPrice: number; // LKR
};

export type JobCard = {
  id: string;
  createdAt: string; // YYYY-MM-DD
  createdTime: string; // HH:mm
  priority: Priority;
  status: JobCardStatus;
  issue: string; // customer's request when the job card was opened

  customer: string;
  customerInfo: { phone: string; email: string; address: string; since: number };

  vehicle: string; // make + model
  plateNo: string;
  vehicleInfo: { year: number; colour: string; vin: string; mileage: number; fuelLevel: number };

  mechanic: string; // lead mechanic
  mechanicNote: string;

  services: ServiceItem[];
  parts: PartItem[];
};

/** Parts in stock. Later this list will come from the Inventory module (M5). */
export const partsCatalogue: Omit<PartItem, "qty">[] = [
  { partNo: "EO-5W30", name: "Engine oil 5W-30 (4L)", unitPrice: 14500 },
  { partNo: "OF-112", name: "Oil filter", unitPrice: 2200 },
  { partNo: "AF-310", name: "Air filter", unitPrice: 3800 },
  { partNo: "CF-220", name: "Cabin air filter", unitPrice: 3200 },
  { partNo: "SP-IR4", name: "Spark plug (iridium)", unitPrice: 1800 },
  { partNo: "BP-F45", name: "Front brake pad set", unitPrice: 11500 },
  { partNo: "BF-DOT4", name: "Brake fluid DOT4 (1L)", unitPrice: 2800 },
  { partNo: "CL-1L", name: "Coolant (1L)", unitPrice: 1900 },
  { partNo: "WB-22", name: "Wiper blade", unitPrice: 1650 },
  { partNo: "BT-NS60", name: "Car battery NS60", unitPrice: 11500 },
  { partNo: "DF-4M41", name: "Diesel fuel filter", unitPrice: 4600 },
];

export const serviceTypes = ["Routine Maintenance", "Repair", "Inspection", "Diagnostics", "Detailing"];

export const SERVICE_CHARGE = 500; // LKR, fixed per job card
export const TAX_RATE = 0.03; // 3%

/** Works out all money values from the services and parts, so they can never disagree. */
export function getJobCardTotals(job: JobCard) {
  const labour = job.services.reduce((sum, s) => sum + s.labourCost, 0);
  const parts = job.parts.reduce((sum, p) => sum + p.qty * p.unitPrice, 0);
  const subtotal = labour + parts + SERVICE_CHARGE;
  const tax = Math.round(subtotal * TAX_RATE);
  return { labour, parts, serviceCharge: SERVICE_CHARGE, tax, grandTotal: subtotal + tax };
}

export function getJobCardById(id: string | undefined) {
  return jobCards.find((j) => j.id === id);
}

/** Next free job card number, e.g. "JC-0147". */
export function nextJobCardId() {
  const highest = Math.max(...jobCards.map((j) => Number(j.id.replace("JC-", ""))));
  return `JC-${String(highest + 1).padStart(4, "0")}`;
}

/**
 * TEMPORARY: keeps a new job card in memory (lost on page refresh).
 * When the backend is ready, this becomes a POST request to the API.
 */
export function addJobCard(job: JobCard) {
  jobCards.unshift(job); // newest first
}

export const jobCards: JobCard[] = [
  {
    id: "JC-0146", createdAt: "2026-10-21", createdTime: "11:40", priority: "Normal", status: "Open",
    issue: "Regular full service. Customer mentioned a squeak when turning.",
    customer: "Saman Kumara",
    customerInfo: { phone: "077 412 9081", email: "saman.k@gmail.com", address: "18, Temple Road, Maharagama", since: 2023 },
    vehicle: "Toyota Aqua", plateNo: "WP-3345",
    vehicleInfo: { year: 2017, colour: "Pearl White", vin: "NHP10-6612093", mileage: 88400, fuelLevel: 40 },
    mechanic: "Unassigned", mechanicNote: "",
    services: [
      { id: "S1", description: "Full Service", type: "Routine Maintenance", mechanic: "Unassigned", status: "Pending", estHours: 2, actualHours: 0, labourCost: 4500 },
    ],
    parts: [],
  },
  {
    id: "JC-0145", createdAt: "2026-10-21", createdTime: "10:15", priority: "Normal", status: "In Progress",
    issue: "Car pulls to the left at high speed.",
    customer: "Ishara Fernando",
    customerInfo: { phone: "071 556 2340", email: "ishara.f@yahoo.com", address: "7/2, Lake Drive, Kandy", since: 2021 },
    vehicle: "Toyota Premio", plateNo: "CAA-9090",
    vehicleInfo: { year: 2016, colour: "Silver", vin: "NZT260-3145578", mileage: 102300, fuelLevel: 65 },
    mechanic: "Harsha Nimed", mechanicNote: "Check tyre wear on the front left.",
    services: [
      { id: "S1", description: "Wheel Alignment", type: "Repair", mechanic: "Harsha Nimed", status: "Completed", estHours: 1, actualHours: 1, labourCost: 4000 },
      { id: "S2", description: "Tyre Rotation", type: "Routine Maintenance", mechanic: "Harsha Nimed", status: "In Progress", estHours: 0.5, actualHours: 0, labourCost: 2500 },
    ],
    parts: [{ partNo: "WB-015", name: "Wheel balancing weights", qty: 8, unitPrice: 150 }],
  },
  {
    id: "JC-0144", createdAt: "2026-10-21", createdTime: "09:05", priority: "High", status: "Open",
    issue: "Battery range has dropped. Full service due.",
    customer: "Ruwan Jayasinghe",
    customerInfo: { phone: "076 980 1122", email: "ruwanj@gmail.com", address: "45, Galle Road, Moratuwa", since: 2024 },
    vehicle: "Nissan Leaf", plateNo: "KJ-7712",
    vehicleInfo: { year: 2018, colour: "Blue", vin: "ZE1-0213347", mileage: 54100, fuelLevel: 80 },
    mechanic: "Dasun Perera", mechanicNote: "Run battery health report before starting.",
    services: [
      { id: "S1", description: "Full Service", type: "Routine Maintenance", mechanic: "Dasun Perera", status: "Pending", estHours: 2, actualHours: 0, labourCost: 6000 },
      { id: "S2", description: "Brake Fluid Replacement", type: "Routine Maintenance", mechanic: "Dasun Perera", status: "Pending", estHours: 0.5, actualHours: 0, labourCost: 2500 },
      { id: "S3", description: "Battery Health Check", type: "Inspection", mechanic: "Dasun Perera", status: "Pending", estHours: 1, actualHours: 0, labourCost: 3500 },
    ],
    parts: [
      { partNo: "BF-DOT4", name: "Brake fluid DOT4 (1L)", qty: 1, unitPrice: 2800 },
      { partNo: "CF-220", name: "Cabin air filter", qty: 1, unitPrice: 3200 },
    ],
  },
  {
    id: "JC-0143", createdAt: "2026-10-20", createdTime: "16:20", priority: "High", status: "Open",
    issue: "Grinding noise when braking.",
    customer: "Nadeesha Silva",
    customerInfo: { phone: "070 223 4567", email: "nadeesha.s@gmail.com", address: "12, Flower Road, Colombo 07", since: 2022 },
    vehicle: "Honda Fit", plateNo: "CAF-2201",
    vehicleInfo: { year: 2014, colour: "Red", vin: "GP1-1098834", mileage: 121700, fuelLevel: 25 },
    mechanic: "David", mechanicNote: "",
    services: [
      { id: "S1", description: "Brake Inspection", type: "Inspection", mechanic: "David", status: "Pending", estHours: 1, actualHours: 0, labourCost: 3000 },
    ],
    parts: [],
  },
  {
    id: "JC-0142", createdAt: "2026-10-20", createdTime: "09:20", priority: "High", status: "In Progress",
    issue: "Engine feels rough at idle. Oil change due.",
    customer: "Kamal Perera",
    customerInfo: { phone: "077 852 7896", email: "kamal.perera@gmail.com", address: "42, John Road, Kurunegala", since: 2019 },
    vehicle: "Toyota Axio", plateNo: "CAB-4521",
    vehicleInfo: { year: 2015, colour: "White", vin: "NKE165-7021456", mileage: 96250, fuelLevel: 55 },
    mechanic: "John Deo", mechanicNote: "Customer needs the car by 5 PM.",
    services: [
      { id: "S1", description: "Engine Oil Change", type: "Routine Maintenance", mechanic: "John Deo", status: "Completed", estHours: 0.5, actualHours: 0.5, labourCost: 2500 },
      { id: "S2", description: "Engine Tune-up", type: "Repair", mechanic: "John Deo", status: "In Progress", estHours: 2, actualHours: 1.2, labourCost: 6500 },
      { id: "S3", description: "Spark Plug Replacement", type: "Repair", mechanic: "David", status: "Pending", estHours: 0.5, actualHours: 0, labourCost: 2000 },
      { id: "S4", description: "Air Filter Replacement", type: "Routine Maintenance", mechanic: "John Deo", status: "Pending", estHours: 0.3, actualHours: 0, labourCost: 1500 },
    ],
    parts: [
      { partNo: "EO-5W30", name: "Engine oil 5W-30 (4L)", qty: 1, unitPrice: 14500 },
      { partNo: "OF-112", name: "Oil filter", qty: 1, unitPrice: 2200 },
      { partNo: "SP-IR4", name: "Spark plug (iridium)", qty: 4, unitPrice: 1800 },
      { partNo: "AF-310", name: "Air filter", qty: 1, unitPrice: 3800 },
    ],
  },
  {
    id: "JC-0141", createdAt: "2026-10-19", createdTime: "14:00", priority: "Low", status: "Completed",
    issue: "Wipers leaving streaks. Wash requested.",
    customer: "Dilini Fernando",
    customerInfo: { phone: "071 330 9876", email: "dilini.fernando@gmail.com", address: "3, Station Road, Panadura", since: 2025 },
    vehicle: "Suzuki Wagon R", plateNo: "CAD-1190",
    vehicleInfo: { year: 2019, colour: "Silver", vin: "MH55S-2290011", mileage: 41800, fuelLevel: 70 },
    mechanic: "David", mechanicNote: "",
    services: [
      { id: "S1", description: "Body Wash & Vacuum", type: "Detailing", mechanic: "David", status: "Completed", estHours: 1, actualHours: 1, labourCost: 2500 },
      { id: "S2", description: "Wiper Blade Replacement", type: "Repair", mechanic: "David", status: "Completed", estHours: 0.2, actualHours: 0.2, labourCost: 1000 },
    ],
    parts: [{ partNo: "WB-22", name: "Wiper blade", qty: 2, unitPrice: 1650 }],
  },
  {
    id: "JC-0140", createdAt: "2026-10-18", createdTime: "10:45", priority: "Normal", status: "Completed",
    issue: "Hybrid warning light. Brakes feel soft.",
    customer: "Mohamed Rizan",
    customerInfo: { phone: "075 118 4402", email: "rizan.m@outlook.com", address: "88, Main Street, Negombo", since: 2020 },
    vehicle: "Honda Vezel", plateNo: "CBH-7788",
    vehicleInfo: { year: 2017, colour: "Black", vin: "RU3-1207765", mileage: 76900, fuelLevel: 50 },
    mechanic: "John Deo", mechanicNote: "",
    services: [
      { id: "S1", description: "Hybrid System Check", type: "Diagnostics", mechanic: "John Deo", status: "Completed", estHours: 1, actualHours: 1.3, labourCost: 5000 },
      { id: "S2", description: "Brake Pad Replacement", type: "Repair", mechanic: "John Deo", status: "Completed", estHours: 1, actualHours: 0.9, labourCost: 4500 },
      { id: "S3", description: "Wheel Alignment", type: "Repair", mechanic: "Harsha Nimed", status: "Completed", estHours: 1, actualHours: 1, labourCost: 4000 },
    ],
    parts: [{ partNo: "BP-F45", name: "Front brake pad set", qty: 1, unitPrice: 11500 }],
  },
  {
    id: "JC-0139", createdAt: "2026-10-17", createdTime: "09:30", priority: "Normal", status: "Invoiced",
    issue: "Engine oil leak and weak battery.",
    customer: "Amila Prasad",
    customerInfo: { phone: "077 852 7896", email: "amila@gmail.com", address: "42, John Road, Kurunegala", since: 2019 },
    vehicle: "Toyota Crown", plateNo: "ABC-2172",
    vehicleInfo: { year: 2010, colour: "Silver Metallic", vin: "GRS200-1234678", mileage: 45210, fuelLevel: 72 },
    mechanic: "John Deo", mechanicNote: "",
    services: [
      { id: "S1", description: "Oil Change", type: "Routine Maintenance", mechanic: "John Deo", status: "Completed", estHours: 0.5, actualHours: 0.5, labourCost: 5000 },
      { id: "S2", description: "Engine Repair", type: "Repair", mechanic: "David", status: "Completed", estHours: 4, actualHours: 4.5, labourCost: 15000 },
      { id: "S3", description: "Battery Replacement", type: "Repair", mechanic: "Dasun Perera", status: "Completed", estHours: 0.5, actualHours: 0.5, labourCost: 5000 },
    ],
    parts: [
      { partNo: "EO-5W30", name: "Engine oil 5W-30 (4L)", qty: 1, unitPrice: 14500 },
      { partNo: "GK-2GR", name: "Engine gasket kit", qty: 1, unitPrice: 24000 },
      { partNo: "BT-NS60", name: "Car battery NS60", qty: 1, unitPrice: 11500 },
    ],
  },
  {
    id: "JC-0138", createdAt: "2026-10-16", createdTime: "15:10", priority: "Low", status: "Invoiced",
    issue: "Engine hesitates when accelerating.",
    customer: "Sachini Jayawardena",
    customerInfo: { phone: "072 645 3310", email: "sachini.j@gmail.com", address: "21, Hill Street, Dehiwala", since: 2018 },
    vehicle: "Mitsubishi Montero", plateNo: "WP-KD-5544",
    vehicleInfo: { year: 2012, colour: "Grey", vin: "V98W-0405521", mileage: 158300, fuelLevel: 35 },
    mechanic: "Dasun Perera", mechanicNote: "",
    services: [
      { id: "S1", description: "Diesel Filter Replacement", type: "Routine Maintenance", mechanic: "Dasun Perera", status: "Completed", estHours: 1, actualHours: 1, labourCost: 3000 },
    ],
    parts: [{ partNo: "DF-4M41", name: "Diesel fuel filter", qty: 1, unitPrice: 4600 }],
  },
  {
    id: "JC-0121", createdAt: "2026-07-14", createdTime: "10:00", priority: "Normal", status: "Invoiced",
    issue: "Scheduled 90,000 km service.",
    customer: "Kamal Perera",
    customerInfo: { phone: "077 852 7896", email: "kamal.perera@gmail.com", address: "42, John Road, Kurunegala", since: 2019 },
    vehicle: "Toyota Axio", plateNo: "CAB-4521",
    vehicleInfo: { year: 2015, colour: "White", vin: "NKE165-7021456", mileage: 90120, fuelLevel: 60 },
    mechanic: "John Deo", mechanicNote: "",
    services: [
      { id: "S1", description: "Engine Oil Change", type: "Routine Maintenance", mechanic: "John Deo", status: "Completed", estHours: 0.5, actualHours: 0.5, labourCost: 2500 },
      { id: "S2", description: "Brake Pad Replacement", type: "Repair", mechanic: "David", status: "Completed", estHours: 1, actualHours: 1, labourCost: 4500 },
    ],
    parts: [
      { partNo: "EO-5W30", name: "Engine oil 5W-30 (4L)", qty: 1, unitPrice: 14500 },
      { partNo: "OF-112", name: "Oil filter", qty: 1, unitPrice: 2200 },
      { partNo: "BP-F21", name: "Front brake pad set", qty: 1, unitPrice: 9800 },
    ],
  },
];
