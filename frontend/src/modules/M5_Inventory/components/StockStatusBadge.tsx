import type { StockStatus } from "../inventoryTypes";

// props: status එක ලැබුණාම අදාළ පාට badge එක පෙන්වනවා
type StockStatusBadgeProps = {
  status: StockStatus;
};

const badgeStyles: Record<StockStatus, string> = {
  "in-stock": "bg-green-100 text-green-700",
  "low-stock": "bg-yellow-100 text-yellow-700",
  "out-of-stock": "bg-red-100 text-red-600",
};

const badgeLabels: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out Of Stock",
};

export default function StockStatusBadge({ status }: StockStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[status]}`}
    >
      {badgeLabels[status]}
    </span>
  );
}