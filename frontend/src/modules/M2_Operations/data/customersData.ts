import { getJobCardTotals, jobCards } from "./jobCardsData";

// Matches the CUSTOMER and VEHICLE tables in the ER diagram.
export type Customer = {
  id: string; // e.g. "CUS-0001"
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  joinedAt: string; // YYYY-MM-DD
};

export type Vehicle = {
  vin: string;
  plateNo: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  customerId: string; // the owner (foreign key to Customer.id)
};

/**
 * Active   = one of their vehicles is being worked on now (job card In Progress)
 * Pending  = a vehicle is booked in but work has not started (job card Open)
 * Inactive = no vehicle in the workshop
 */
export type CustomerStatus = "Active" | "Pending" | "Inactive";

export const customers: Customer[] = [
  { id: "CUS-0001", firstName: "Kamal", lastName: "Perera", phone: "077 852 7896", email: "kamal.perera@gmail.com", address: "42, John Road, Kurunegala", joinedAt: "2019-03-15" },
  { id: "CUS-0002", firstName: "Amila", lastName: "Prasad", phone: "071 902 3344", email: "amila@gmail.com", address: "15, Lake Road, Kurunegala", joinedAt: "2019-08-02" },
  { id: "CUS-0003", firstName: "Sachini", lastName: "Jayawardena", phone: "072 645 3310", email: "sachini.j@gmail.com", address: "21, Hill Street, Dehiwala", joinedAt: "2018-05-20" },
  { id: "CUS-0004", firstName: "Mohamed", lastName: "Rizan", phone: "075 118 4402", email: "rizan.m@outlook.com", address: "88, Main Street, Negombo", joinedAt: "2020-01-11" },
  { id: "CUS-0005", firstName: "Ishara", lastName: "Fernando", phone: "071 556 2340", email: "ishara.f@yahoo.com", address: "7/2, Lake Drive, Kandy", joinedAt: "2021-06-09" },
  { id: "CUS-0006", firstName: "Nadeesha", lastName: "Silva", phone: "070 223 4567", email: "nadeesha.s@gmail.com", address: "12, Flower Road, Colombo 07", joinedAt: "2022-02-14" },
  { id: "CUS-0007", firstName: "Saman", lastName: "Kumara", phone: "077 412 9081", email: "saman.k@gmail.com", address: "18, Temple Road, Maharagama", joinedAt: "2023-04-03" },
  { id: "CUS-0008", firstName: "Ruwan", lastName: "Jayasinghe", phone: "076 980 1122", email: "ruwanj@gmail.com", address: "45, Galle Road, Moratuwa", joinedAt: "2024-07-19" },
  { id: "CUS-0009", firstName: "Dilini", lastName: "Fernando", phone: "071 330 9876", email: "dilini.fernando@gmail.com", address: "3, Station Road, Panadura", joinedAt: "2025-01-27" },
  { id: "CUS-0010", firstName: "Anura", lastName: "Jayanatha", phone: "078 221 7765", email: "anura.j@yahoo.com", address: "56, Baseline Road, Colombo 09", joinedAt: "2023-09-30" },
  { id: "CUS-0011", firstName: "Lasith", lastName: "Perera", phone: "072 589 3215", email: "lasith.perera@gmail.com", address: "Maradana, Colombo 10", joinedAt: "2026-10-08" },
  { id: "CUS-0012", firstName: "Nuwan", lastName: "Chinthaka", phone: "077 334 1209", email: "nuwan.c@gmail.com", address: "9, Kandy Road, Kadawatha", joinedAt: "2026-10-15" },
];

export const vehicles: Vehicle[] = [
  { vin: "NKE165-7021456", plateNo: "CAB-4521", make: "Toyota", model: "Axio", year: 2015, colour: "White", customerId: "CUS-0001" },
  { vin: "GRS200-1234678", plateNo: "ABC-2172", make: "Toyota", model: "Crown", year: 2010, colour: "Silver Metallic", customerId: "CUS-0002" },
  { vin: "ACV50-8857954", plateNo: "CBK-2134", make: "Toyota", model: "Camry", year: 2018, colour: "Grey", customerId: "CUS-0002" },
  { vin: "V98W-0405521", plateNo: "WP-KD-5544", make: "Mitsubishi", model: "Montero", year: 2012, colour: "Grey", customerId: "CUS-0003" },
  { vin: "RU3-1207765", plateNo: "CBH-7788", make: "Honda", model: "Vezel", year: 2017, colour: "Black", customerId: "CUS-0004" },
  { vin: "NZT260-3145578", plateNo: "CAA-9090", make: "Toyota", model: "Premio", year: 2016, colour: "Silver", customerId: "CUS-0005" },
  { vin: "GP1-1098834", plateNo: "CAF-2201", make: "Honda", model: "Fit", year: 2014, colour: "Red", customerId: "CUS-0006" },
  { vin: "NHP10-6612093", plateNo: "WP-3345", make: "Toyota", model: "Aqua", year: 2017, colour: "Pearl White", customerId: "CUS-0007" },
  { vin: "ZE1-0213347", plateNo: "KJ-7712", make: "Nissan", model: "Leaf", year: 2018, colour: "Blue", customerId: "CUS-0008" },
  { vin: "MH55S-2290011", plateNo: "CAD-1190", make: "Suzuki", model: "Wagon R", year: 2019, colour: "Silver", customerId: "CUS-0009" },
  { vin: "KDH201-0099821", plateNo: "PH-4471", make: "Toyota", model: "Hiace", year: 2014, colour: "White", customerId: "CUS-0010" },
  { vin: "ASV70-23GD730", plateNo: "CBC-9585", make: "Toyota", model: "Camry", year: 2019, colour: "White", customerId: "CUS-0011" },
  { vin: "FC1-4402118", plateNo: "KP-1180", make: "Honda", model: "Civic", year: 2016, colour: "Black", customerId: "CUS-0012" },
];

export const fullName = (c: Customer) => `${c.firstName} ${c.lastName}`;

/** "2026-10-22" -> "22 Oct 2026" */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function getCustomerById(id: string | undefined) {
  return customers.find((c) => c.id === id);
}

export function getCustomerVehicles(customerId: string) {
  return vehicles.filter((v) => v.customerId === customerId);
}

/** A customer's job cards, found through their vehicles' plate numbers. Newest first. */
export function getCustomerJobCards(customerId: string) {
  const plates = new Set(getCustomerVehicles(customerId).map((v) => v.plateNo));
  return jobCards
    .filter((j) => plates.has(j.plateNo))
    .sort((a, b) => `${b.createdAt} ${b.createdTime}`.localeCompare(`${a.createdAt} ${a.createdTime}`));
}


export function getCustomerStats(customerId: string) {
  const jobs = getCustomerJobCards(customerId);
  const totalSpend = jobs
    .filter((j) => j.status === "Completed" || j.status === "Invoiced")
    .reduce((sum, j) => sum + getJobCardTotals(j).grandTotal, 0);
  const lastVisit = jobs.length > 0 ? jobs[0].createdAt : null;

  let status: CustomerStatus = "Inactive";
  if (jobs.some((j) => j.status === "In Progress")) status = "Active";
  else if (jobs.some((j) => j.status === "Open")) status = "Pending";

  const lastJob = jobs.length > 0 ? jobs[0] : null;
  // what was done (or requested) on the latest visit
  const lastServiceType = lastJob
    ? lastJob.services[0]?.description ?? lastJob.issue.split(":")[0]
    : null;

  return { visits: jobs.length, totalSpend, lastVisit, lastJob, lastServiceType, status };
}
