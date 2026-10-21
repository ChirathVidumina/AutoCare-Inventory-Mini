
import { Package, TrendingUp, CheckCircle2 } from "lucide-react";
import type { ServiceItem } from "./ServiceForm";

type Props = {
  packages: ServiceItem[];
};

export default function PackageSummaryCards({ packages }: Props) {
  const total = packages.length;

  const active = packages.filter(
    (item) => item.status === "Active"
  ).length;

  // Real booking / sales data is needed to calculate top selling.
  const topSelling = "—";

  const cards = [
    {
      label: "Total Packages",
      value: String(total),
      icon: Package,
    },
    {
      label: "Active Packages",
      value: String(active),
      icon: CheckCircle2,
    },
    {
      label: "Top Selling",
      value: topSelling,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mb-9 grid gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="flex min-h-[105px] items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {card.label}
              </p>

              <p className="mt-2 text-xl font-bold text-[#253f8d]">
                {card.value}
              </p>
            </div>

            <div className="rounded-full bg-yellow-100 p-3">
              <Icon size={21} className="text-yellow-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
