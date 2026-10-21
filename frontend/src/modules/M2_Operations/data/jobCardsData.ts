export type JobCardStatus = "Open" | "In Progress" | "Completed" | "Invoiced";
export type Priority = "High" | "Normal" | "Low";

export type JobCard = {
  id: string;
  customer: string;
  vehicle: string;      // make + model
  plateNo: string;
  services: number;     // how many services on this job card
  mechanic: string;     // lead mechanic
  priority: Priority;
  status: JobCardStatus;
  createdAt: string;    // YYYY-MM-DD
  total: number;        // LKR
};

export const jobCards: JobCard[] = [
  { id: "JC-0146", customer: "Saman Kumara", vehicle: "Toyota Aqua", plateNo: "WP-3345", services: 1, mechanic: "Unassigned", priority: "Normal", status: "Open", createdAt: "2026-10-21", total: 9500 },
  { id: "JC-0145", customer: "Ishara Fernando", vehicle: "Toyota Premio", plateNo: "CAA-9090", services: 2, mechanic: "Harsha Nimed", priority: "Normal", status: "In Progress", createdAt: "2026-10-21", total: 14200 },
  { id: "JC-0144", customer: "Ruwan Jayasinghe", vehicle: "Nissan Leaf", plateNo: "KJ-7712", services: 3, mechanic: "Dasun Perera", priority: "High", status: "Open", createdAt: "2026-10-21", total: 31050 },
  { id: "JC-0143", customer: "Nadeesha Silva", vehicle: "Honda Fit", plateNo: "CAF-2201", services: 1, mechanic: "David", priority: "High", status: "Open", createdAt: "2026-10-20", total: 6500 },
  { id: "JC-0142", customer: "Kamal Perera", vehicle: "Toyota Axio", plateNo: "CAB-4521", services: 4, mechanic: "John Deo", priority: "High", status: "In Progress", createdAt: "2026-10-20", total: 42900 },
  { id: "JC-0141", customer: "Dilini Fernando", vehicle: "Suzuki Wagon R", plateNo: "CAD-1190", services: 2, mechanic: "David", priority: "Low", status: "Completed", createdAt: "2026-10-19", total: 15400 },
  { id: "JC-0140", customer: "Mohamed Rizan", vehicle: "Honda Vezel", plateNo: "CBH-7788", services: 3, mechanic: "John Deo", priority: "Normal", status: "Completed", createdAt: "2026-10-18", total: 27800 },
  { id: "JC-0139", customer: "Amila Prasad", vehicle: "Toyota Crown", plateNo: "ABC-2172", services: 3, mechanic: "John Deo", priority: "Normal", status: "Invoiced", createdAt: "2026-10-17", total: 77765 },
  { id: "JC-0138", customer: "Sachini Jayawardena", vehicle: "Mitsubishi Montero", plateNo: "WP-KD-5544", services: 1, mechanic: "Dasun Perera", priority: "Low", status: "Invoiced", createdAt: "2026-10-16", total: 8750 },
];