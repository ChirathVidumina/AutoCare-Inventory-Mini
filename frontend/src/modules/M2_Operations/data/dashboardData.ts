export type Stat = {
  title: string;
  value: string;
  change: number; // percentage, e.g. 15 or -8
  icon: "services" | "revenue" | "pending" | "completed";
};

export const stats: Stat[] = [
  { title: "Daily Services", value: "12", change: 15, icon: "services" },
  { title: "Total Revenue", value: "LKR 53,000", change: 8, icon: "revenue" },
  { title: "Pending Jobs", value: "5", change: -8, icon: "pending" },
  { title: "Completed Jobs", value: "8", change: 5, icon: "completed" },
];

export type RevenuePoint = { label: string; amount: number };

export const monthlyRevenue: RevenuePoint[] = [
  { label: "Jan", amount: 18000 },
  { label: "Feb", amount: 42000 },
  { label: "Mar", amount: 26000 },
  { label: "Apr", amount: 61000 },
  { label: "May", amount: 34000 },
  { label: "Jun", amount: 78000 },
  { label: "Jul", amount: 53000 },
];

export const dailyRevenue: RevenuePoint[] = [
  { label: "Mon", amount: 6200 },
  { label: "Tue", amount: 8100 },
  { label: "Wed", amount: 5400 },
  { label: "Thu", amount: 9700 },
  { label: "Fri", amount: 11200 },
  { label: "Sat", amount: 13800 },
  { label: "Sun", amount: 4300 },
];

export type MechanicPerf = {
  name: string;
  jobsCompleted: number;
  performance: number; // 0–100, e.g. tasks finished on time
};

export const mechanicPerformance: MechanicPerf[] = [
  { name: "John Deo", jobsCompleted: 25, performance: 92 },
  { name: "David", jobsCompleted: 18, performance: 80 },
  { name: "Dasun Perera", jobsCompleted: 9, performance: 52 },
  { name: "Harsha Nimed", jobsCompleted: 5, performance: 25 },
];