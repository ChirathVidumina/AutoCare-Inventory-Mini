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