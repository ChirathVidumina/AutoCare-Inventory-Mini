
import {
  Clock3,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import type { ServiceItem } from "./ServiceForm";

type Props = {
  packages: ServiceItem[];
  onView: (item: ServiceItem) => void;
  onEdit: (item: ServiceItem) => void;
  onDelete: (item: ServiceItem) => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(price);
}

export default function ServicePackagesTable({
  packages,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-xs">
        <thead className="bg-[#f3f4f6] text-gray-600">
          <tr>
            <th className="px-4 py-4 font-semibold">
              Packages Name
            </th>
            <th className="px-4 py-4 font-semibold">
              Type
            </th>
            <th className="px-4 py-4 font-semibold">
              Estimated Duration
            </th>
            <th className="px-4 py-4 font-semibold">
              Total Price
            </th>
            <th className="px-4 py-4 font-semibold">
              Status
            </th>
            <th className="px-4 py-4 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {packages.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-slate-50"
            >
              <td className="px-4 py-4 font-medium">
                {item.name}
              </td>

              <td className="px-4 py-4">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-[11px] text-indigo-700">
                  {item.category}
                </span>
              </td>

              <td className="px-4 py-4">
                <span className="flex items-center gap-2">
                  <Clock3 size={14} className="text-gray-400" />
                  {item.duration >= 60
                    ? `${Math.floor(item.duration / 60)}h ${
                        item.duration % 60
                          ? `${item.duration % 60}m`
                          : ""
                      }`
                    : `${item.duration} mins`}
                </span>
              </td>

              <td className="px-4 py-4 font-semibold">
                {formatPrice(item.price)}
              </td>

              <td className="px-4 py-4">
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  {item.status}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    title="View"
                    aria-label={`View ${item.name}`}
                    onClick={() => onView(item)}
                  >
                    <Eye size={16} className="text-gray-500" />
                  </button>

                  <button
                    type="button"
                    title="Edit"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => onEdit(item)}
                  >
                    <Pencil
                      size={16}
                      className="text-[#253f8d]"
                    />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {packages.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-16 text-center text-sm text-gray-400"
              >
                No service packages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
