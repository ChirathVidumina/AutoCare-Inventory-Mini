
import { useState } from "react";
import type { FormEvent } from "react";
import { X, CalendarDays } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  type: "Service" | "Package";
  createdAt: string;
  description: string;
  status: "Active" | "Disabled";
};

type Props = {
  category: Category;
  onClose: () => void;
  onSave: (category: Category) => void;
};

export default function EditCategoryModal({
  category,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Category>({ ...category });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim()) return;

    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Category"
        className="w-full max-w-[370px] rounded-xl bg-[#f8f9fc] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-300 pb-3">
          <h2 className="text-base font-semibold text-[#253f8d]">
            Edit Category
          </h2>

          <button type="button" onClick={onClose} aria-label="Close">
            <X size={19} className="text-[#253f8d]" />
          </button>
        </div>

        <div className="space-y-3 px-4 py-5 text-xs">
          <div>
            <label className="mb-1 block font-semibold">
              Category ID
            </label>
            <input
              value={form.id}
              disabled
              className="w-28 rounded border border-gray-200 bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold">
              Category Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#253f8d]"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold">
              Category Type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as Category["type"],
                })
              }
              className="w-32 rounded border border-gray-300 bg-white px-3 py-2"
            >
              <option value="Service">Services</option>
              <option value="Package">Packages</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-semibold">
              Created Date
            </label>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={form.createdAt}
                disabled
                className="rounded border border-gray-300 bg-gray-100 px-2 py-2"
              />
              <CalendarDays size={17} />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Status</span>

            <button
              type="button"
              role="switch"
              aria-checked={form.status === "Active"}
              onClick={() =>
                setForm({
                  ...form,
                  status:
                    form.status === "Active"
                      ? "Disabled"
                      : "Active",
                })
              }
              className={`relative h-5 w-9 rounded-full ${
                form.status === "Active"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              <span
                className={`absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white ${
                  form.status === "Active"
                    ? "left-[19px]"
                    : "left-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-300 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-blue-300 bg-white px-5 py-2 text-xs text-[#253f8d]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded bg-[#253f8d] px-6 py-2 text-xs text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
