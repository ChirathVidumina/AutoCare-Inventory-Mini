
import { AlertTriangle, X } from "lucide-react";
import type { Category } from "./EditCategoryModal";

type Props = {
  category: Category;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export default function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete Category"
        className="w-full max-w-[350px] overflow-hidden rounded-xl bg-[#f8f9fc] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-xs font-medium text-[#253f8d]">
              Delete Category?
            </h2>
          </div>

          <button onClick={onClose} aria-label="Close">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-6 text-center text-xs">
          <p>
            Are you sure you want to delete{" "}
            <strong>"{category.name}"</strong>?
          </p>
          <p className="mt-1 text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded border border-blue-300 bg-white px-4 py-1.5 text-xs text-[#253f8d]"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(category.id)}
            className="rounded bg-red-600 px-5 py-1.5 text-xs text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
