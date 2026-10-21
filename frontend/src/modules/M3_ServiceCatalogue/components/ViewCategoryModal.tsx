
import { X } from "lucide-react";
import type { Category } from "./EditCategoryModal";

type Props = {
  category: Category;
  onClose: () => void;
};

export default function ViewCategoryModal({
  category,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="View Category"
        className="w-full max-w-[370px] rounded-xl bg-[#f8f9fc] p-4 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-300 pb-3">
          <h2 className="text-base font-semibold text-[#253f8d]">
            View Category
          </h2>

          <button onClick={onClose} aria-label="Close">
            <X size={19} className="text-[#253f8d]" />
          </button>
        </div>

        <div className="space-y-4 px-3 py-6 text-xs">
          {[
            ["Category Name", category.name],
            [
              "Category Type",
              category.type === "Service" ? "Services" : "Packages",
            ],
            ["Created Date", category.createdAt],
            ["Description", category.description],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[110px_1fr] gap-3"
            >
              <span className="font-semibold">{label} :</span>
              <span>{value || "—"}</span>
            </div>
          ))}

          <div className="grid grid-cols-[110px_1fr] gap-3">
            <span className="font-semibold">Status :</span>
            <span>
              <span
                className={`rounded-full px-3 py-1 text-xs text-white ${
                  category.status === "Active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {category.status}
              </span>
            </span>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-300 pt-3">
          <button
            onClick={onClose}
            className="rounded border border-blue-300 bg-white px-5 py-1.5 text-xs text-[#253f8d]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
