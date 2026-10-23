
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Plus, Search,
  Wrench, Package, TrendingUp, Clock3, Eye, Pencil,
  Trash2, ChevronLeft, ChevronRight, 
} from "lucide-react";

import ServiceForm from "../components/ServiceForm";
import type {
  ServiceItem,
  ServiceType,
} from "../components/ServiceForm";

import ViewServiceModal from "../components/ViewServiceModal";
import PackageSummaryCards from "../components/PackageSummaryCards";
import ServicePackagesTable from "../components/ServicePackagesTable";

type Tab = "All Items" | "Individual Services" | "Service Packages";
const PAGE_SIZE = 8;

function money(value: number) {
  return `LKR ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ServicesPackages() {
  // Starts empty. No mock records.
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [tab, setTab] = useState<Tab>("All Items");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [formMode, setFormMode] =
    useState<"add" | "edit" | null>(null);
  const [initialType, setInitialType] =
    useState<ServiceType>("Service");
  const [selectedItem, setSelectedItem] =
    useState<ServiceItem | null>(null);

  const [viewItem, setViewItem] =
    useState<ServiceItem | null>(null);
  const [deleteItem, setDeleteItem] =
    useState<ServiceItem | null>(null);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [saveError, setSaveError] = useState("");

  const isPackageTab = tab === "Service Packages";

  

  const services = items.filter(
    (item) => item.type === "Service"
  );
  const packages = items.filter(
    (item) => item.type === "Package"
  );

  const activePackages = packages.filter(
    (item) => item.status === "Active"
  ).length;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchTab =
        tab === "All Items" ||
        (tab === "Individual Services" &&
          item.type === "Service") ||
        (tab === "Service Packages" &&
          item.type === "Package");

      const matchSearch =
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);

      const matchCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchTab && matchSearch && matchCategory;
    });
  }, [items, tab, search, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);

  const visibleItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const filterCategories = [
    ...new Set(items.map((item) => item.category)),
  ].sort();

  function openAdd() {
    setSelectedItem(null);
    setInitialType(isPackageTab ? "Package" : "Service");
    setSaveError("");
    setFormMode("add");
  }

  function openEdit(item: ServiceItem) {
    setViewItem(null);
    setSelectedItem(item);
    setInitialType(item.type);
    setSaveError("");
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setSelectedItem(null);
    setSaveError("");
  }

  function saveItem(item: ServiceItem) {
    const duplicate = items.some(
      (existing) =>
        existing.id !== item.id &&
        existing.name.toLowerCase() ===
          item.name.toLowerCase()
    );

    if (duplicate) {
      setSaveError("An item with this name already exists.");
      return;
    }

    setItems((previous) => {
      const exists = previous.some(
        (existing) => existing.id === item.id
      );

      return exists
        ? previous.map((existing) =>
            existing.id === item.id ? item : existing
          )
        : [...previous, item];
    });

    closeForm();
    setPage(1);
  }

  function deleteSelected() {
    if (!deleteItem) return;

    if (
      deleteItem.type === "Service" &&
      packages.some((item) =>
        item.packageLines?.some(
          (line) => line.serviceId === deleteItem.id
        )
      )
    ) {
      window.alert(
        "This service belongs to a package. Remove it from the package first."
      );
      return;
    }

    setItems((previous) =>
      previous.filter((item) => item.id !== deleteItem.id)
    );

    setDeleteItem(null);
  }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newCategory.trim();

    if (!name) return;

    if (
      categories.some(
        (value) => value.toLowerCase() === name.toLowerCase()
      )
    ) {
      window.alert("Category already exists.");
      return;
    }

    setCategories((previous) => [...previous, name]);
    setCategoryOpen(false);
    setNewCategory("");
  }

  const summary = [
    {
      label: "Total Services",
      value: String(services.length),
      icon: Wrench,
    },
    {
      label: "Active Packages",
      value: String(activePackages),
      icon: Package,
    },
    {
      label: "Most Popular",
      value: "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-900">

      {/* PAGE */}
      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold">
            {isPackageTab
              ? "Service Packages"
              : "Service Overview"}
          </h2>

          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#253f8d] px-5 py-3 text-xs text-white hover:bg-blue-800"
          >
            <Plus size={16} />
            {isPackageTab
              ? "Add New Package"
              : "Add New Service"}
          </button>
        </div>

        {/* SUMMARY CARDS */}
        {isPackageTab ? (
          <PackageSummaryCards packages={packages} />
        ) : (
          <div className="mb-9 grid gap-5 md:grid-cols-3">
            {summary.map((card) => {
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
        )}

        {/* TABS */}
        <div className="mb-5 flex flex-wrap gap-8 border-b border-gray-200">
          {(
            [
              "All Items",
              "Individual Services",
              "Service Packages",
            ] as Tab[]
          ).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                setSearch("");
                setCategoryFilter("All");
                setPage(1);
              }}
              className={`border-b-[3px] px-1 py-3 text-xs font-medium ${
                tab === value
                  ? "border-[#253f8d] text-[#253f8d]"
                  : "border-transparent text-gray-400"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={
                isPackageTab
                  ? "Search package name..."
                  : "Search service name, category or package name..."
              }
              aria-label="Search catalogue"
              className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-3 text-xs outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
            className="rounded-md border border-gray-200 bg-white px-4 py-3 text-xs"
          >
            <option value="All">Filter By Category</option>
            {filterCategories.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setCategoryOpen(true)}
            className="rounded-md border border-[#253f8d] px-3 py-3 text-xs text-[#253f8d]"
          >
            + Category
          </button>
        </div>

        {/* TABLE */}
        {isPackageTab ? (
          <ServicePackagesTable
            packages={visibleItems}
            onView={setViewItem}
            onEdit={openEdit}
            onDelete={setDeleteItem}
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-[#f3f4f6] text-gray-600">
                <tr>
                  {[
                    "Service Name",
                    "Category",
                    "Duration",
                    "Price",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-4 font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2">
                        <Clock3
                          size={14}
                          className="text-gray-400"
                        />
                        {item.duration} mins
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {money(item.price)}
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
                      <div className="flex gap-3">
                        <button
                          type="button"
                          aria-label={`View ${item.name}`}
                          onClick={() => setViewItem(item)}
                        >
                          <Eye size={16} className="text-gray-500" />
                        </button>

                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => openEdit(item)}
                        >
                          <Pencil
                            size={16}
                            className="text-[#253f8d]"
                          />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${item.name}`}
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2
                            size={16}
                            className="text-red-500"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      No services or packages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Showing {visibleItems.length} out of {filtered.length}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage(Math.max(1, currentPage - 1))
              }
              aria-label="Previous page"
              className="rounded-full bg-yellow-400 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage(Math.min(totalPages, currentPage + 1))
              }
              aria-label="Next page"
              className="rounded-full bg-yellow-400 p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {formMode && (
        <>
          <ServiceForm
            key={selectedItem?.id ?? `new-${initialType}`}
            mode={formMode}
            item={selectedItem}
            categories={categories}
            availableServices={services}
            initialType={initialType}
            onClose={closeForm}
            onSave={saveItem}
          />

          {saveError && (
            <div
              role="alert"
              className="fixed bottom-5 right-5 z-[10000] rounded bg-red-600 px-5 py-3 text-xs text-white shadow-xl"
            >
              {saveError}
            </div>
          )}
        </>
      )}

      {/* FIGMA VIEW SERVICE / VIEW PACKAGE */}
      {viewItem && (
        <ViewServiceModal
          item={viewItem}
          allServices={services}
          onClose={() => setViewItem(null)}
          onEdit={openEdit}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {deleteItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete item"
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h3 className="font-semibold text-red-600">
              Delete {deleteItem.type}?
            </h3>

            <p className="mt-4 text-sm">
              Are you sure you want to delete{" "}
              <strong>"{deleteItem.name}"</strong>?
            </p>

            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="rounded border border-gray-300 px-5 py-2 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteSelected}
                className="rounded bg-red-600 px-5 py-2 text-xs text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPORARY CATEGORY ENTRY */}
      {categoryOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={addCategory}
            role="dialog"
            aria-modal="true"
            aria-label="Add category"
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h3 className="font-semibold text-[#253f8d]">
              Add Category Option
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Temporary category list until API integration.
            </p>

            <input
              required
              value={newCategory}
              onChange={(event) =>
                setNewCategory(event.target.value)
              }
              placeholder="Enter category name"
              className="mt-4 w-full rounded border p-3 text-sm"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategoryOpen(false);
                  setNewCategory("");
                }}
                className="rounded border px-4 py-2 text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded bg-[#253f8d] px-4 py-2 text-xs text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
