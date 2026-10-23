
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus,
  Shapes,
  Package,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import EditCategoryModal from "../components/EditCategoryModal";
import ViewCategoryModal from "../components/ViewCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

import type { Category } from "../components/EditCategoryModal";

type CategoryType = Category["type"];
type CategoryStatus = Category["status"];

type CategoryFormData = {
  id: string;
  name: string;
  description: string;
  type: CategoryType | "";
  createdAt: string;
  status: CategoryStatus;
};

const emptyForm: CategoryFormData = {
  id: "",
  name: "",
  description: "",
  type: "",
  createdAt: "",
  status: "Disabled",
};

const PAGE_SIZE = 7;

export default function CategoryList() {
  // No mock records. All data starts empty.
  const [categories, setCategories] = useState<Category[]>([]);

  // Table navigation
  const [activeTab, setActiveTab] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  // Add Category modal
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CategoryFormData>({
    ...emptyForm,
  });
  const [error, setError] = useState("");

  // Edit, View and Delete modals
  const [editCategory, setEditCategory] =
    useState<Category | null>(null);

  const [viewCategory, setViewCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const anyModalOpen =
    formOpen ||
    editCategory !== null ||
    viewCategory !== null ||
    deleteCategory !== null;

  // Disable background scrolling while modal is open.
  useEffect(() => {
    if (!anyModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [anyModalOpen]);



  // Summary counts
  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (item) => item.status === "Active"
  ).length;

  const totalPackages = categories.filter(
    (item) => item.type === "Package"
  ).length;

  // Filtering
  const filtered = useMemo(() => {
    return categories.filter((item) => {
      const matchesTab =
        activeTab === "All Categories" ||
        (activeTab === "Services" && item.type === "Service") ||
        (activeTab === "Packages" && item.type === "Package");

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return (
        matchesTab &&
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    categories,
    activeTab,
    search,
    statusFilter,
    typeFilter,
  ]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleCategories = filtered.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // ADD CATEGORY
  function openAddModal() {
    setForm({ ...emptyForm });
    setError("");
    setFormOpen(true);
  }

  function closeAddModal() {
    setFormOpen(false);
    setError("");
  }

  function saveNewCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = form.id.trim();
    const name = form.name.trim();

    if (!id || !name || !form.type || !form.createdAt) {
      setError("Please complete all required fields.");
      return;
    }

    const duplicate = categories.some(
      (item) =>
        item.id.toLowerCase() === id.toLowerCase() ||
        item.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setError("Category ID or name already exists.");
      return;
    }

    const newCategory: Category = {
      id,
      name,
      description: form.description.trim(),
      type: form.type,
      createdAt: form.createdAt,
      status: form.status,
    };

    setCategories((previous) => [
      ...previous,
      newCategory,
    ]);

    closeAddModal();
    setPage(1);
  }

  // EDIT CATEGORY
  function saveEditedCategory(updatedCategory: Category) {
    const duplicate = categories.some(
      (item) =>
        item.id !== updatedCategory.id &&
        item.name.toLowerCase() ===
          updatedCategory.name.trim().toLowerCase()
    );

    if (duplicate) {
      window.alert("Category name already exists.");
      return;
    }

    setCategories((previous) =>
      previous.map((item) =>
        item.id === updatedCategory.id
          ? updatedCategory
          : item
      )
    );

    setEditCategory(null);
  }

  // DELETE CATEGORY
  function confirmDeleteCategory(categoryId: string) {
    setCategories((previous) =>
      previous.filter(
        (item) => item.id !== categoryId
      )
    );

    setDeleteCategory(null);
  }

  // Dashboard cards
  const summaryCards = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: Shapes,
    },
    {
      title: "Active Categories",
      value: activeCategories,
      icon: Shapes,
    },
    {
      title: "Packages",
      value: totalPackages,
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      

      {/* PAGE CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-7 md:px-12">
        {/* PAGE TITLE */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            Category Overview
          </h2>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#253f8d] px-5 py-3 text-sm font-medium text-white hover:bg-blue-800"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-9 grid gap-5 sm:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="flex min-h-28 items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-5"
              >
                <div>
                  <p className="font-semibold text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#253f8d]">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-full bg-yellow-100 p-2">
                  <Icon
                    size={19}
                    className="text-yellow-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CATEGORY TABS */}
        <div className="mb-3 flex gap-10 border-b border-gray-200">
          {[
            "All Categories",
            "Services",
            "Packages",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`border-b-2 px-1 py-3 text-sm ${
                activeTab === tab
                  ? "border-[#253f8d] font-semibold text-[#253f8d]"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded border border-gray-300 p-4">
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          <select
            aria-label="Filter by type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="All">All Types</option>
            <option value="Service">Service</option>
            <option value="Package">Package</option>
          </select>

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Category name..."
            aria-label="Search categories"
            className="ml-auto w-full rounded border border-gray-300 px-4 py-2 text-sm md:w-80"
          />
        </div>

        {/* CATEGORY TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#dedede]">
              <tr>
                {[
                  "Category ID",
                  "Category Name",
                  "Description",
                  "Type",
                  "Created Date",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-5 text-xs font-medium"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-300"
                >
                  <td className="px-3 py-4">
                    {category.id}
                  </td>

                  <td className="px-3 py-4">
                    {category.name}
                  </td>

                  <td className="px-3 py-4">
                    {category.description}
                  </td>

                  <td className="px-3 py-4">
                    {category.type}
                  </td>

                  <td className="px-3 py-4">
                    {category.createdAt}
                  </td>

                  <td className="px-3 py-4">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          category.status === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />

                      {category.status}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`View ${category.name}`}
                        title="View"
                        onClick={() =>
                          setViewCategory(category)
                        }
                      >
                        <Eye
                          size={17}
                          className="text-[#253f8d]"
                        />
                      </button>

                      <button
                        type="button"
                        aria-label={`Edit ${category.name}`}
                        title="Edit"
                        onClick={() =>
                          setEditCategory(category)
                        }
                      >
                        <Pencil
                          size={17}
                          className="text-[#253f8d]"
                        />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${category.name}`}
                        title="Delete"
                        onClick={() =>
                          setDeleteCategory(category)
                        }
                      >
                        <Trash2
                          size={17}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-gray-400"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {visibleCategories.length} out of{" "}
            {filtered.length}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((previous) =>
                  Math.max(1, previous - 1)
                )
              }
              className="rounded-full bg-yellow-400 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              className="rounded-full bg-yellow-400 p-2 disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/35 p-4">
          <form
            onSubmit={saveNewCategory}
            role="dialog"
            aria-modal="true"
            aria-label="Add Category"
            className="my-auto w-full max-w-[370px] rounded-xl bg-[#f8f9fc] p-4 shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <h2 className="text-base font-semibold text-[#253f8d]">
                Add Category
              </h2>

              <button
                type="button"
                onClick={closeAddModal}
                aria-label="Close modal"
              >
                <X
                  size={18}
                  className="text-[#253f8d]"
                />
              </button>
            </div>

            {/* FORM FIELDS */}
            <div className="space-y-3 px-3 py-4 text-xs">
              <div>
                <label
                  htmlFor="category-id"
                  className="mb-1 block font-semibold"
                >
                  Category ID
                </label>

                <input
                  id="category-id"
                  required
                  value={form.id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      id: e.target.value,
                    })
                  }
                  placeholder="Enter category ID"
                  className="w-40 rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#253f8d]"
                />
              </div>

              <div>
                <label
                  htmlFor="category-name"
                  className="mb-1 block font-semibold"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name..."
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#253f8d]"
                />
              </div>

              <div>
                <label
                  htmlFor="category-type"
                  className="mb-1 block font-semibold"
                >
                  Category Type
                </label>

                <select
                  id="category-type"
                  required
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as
                        | CategoryType
                        | "",
                    })
                  }
                  className="w-36 rounded border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="">Select type</option>
                  <option value="Service">Services</option>
                  <option value="Package">Packages</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category-date"
                  className="mb-1 block font-semibold"
                >
                  Created Date
                </label>

                <input
                  id="category-date"
                  type="date"
                  required
                  value={form.createdAt}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      createdAt: e.target.value,
                    })
                  }
                  className="rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#253f8d]"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-1 block font-semibold"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter description..."
                  className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#253f8d]"
                />
              </div>

              {/* STATUS SWITCH */}
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  Status
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-label="Category status"
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

                <span className="text-gray-500">
                  {form.status}
                </span>
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {error}
                </p>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 border-t border-gray-300 pt-3">
              <button
                type="button"
                onClick={closeAddModal}
                className="rounded border border-blue-300 bg-white px-5 py-2 text-xs text-[#253f8d]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded bg-[#253f8d] px-6 py-2 text-xs font-medium text-white hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editCategory && (
        <EditCategoryModal
          key={editCategory.id}
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSave={saveEditedCategory}
        />
      )}

      {/* VIEW CATEGORY MODAL */}
      {viewCategory && (
        <ViewCategoryModal
          category={viewCategory}
          onClose={() => setViewCategory(null)}
        />
      )}

      {/* DELETE CATEGORY MODAL */}
      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          onClose={() => setDeleteCategory(null)}
          onConfirm={confirmDeleteCategory}
        />
      )}
    </div>
  );
}
