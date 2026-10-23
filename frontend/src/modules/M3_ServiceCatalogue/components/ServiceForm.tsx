
import { useEffect, useId, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  Clock3,
  Minus,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

export type ServiceType = "Service" | "Package";
export type ServiceStatus = "Active" | "Disabled";

export type PackageLine = {
  serviceId: string;
  quantity: number;
};

export type ServiceItem = {
  id: string;
  name: string;
  category: string;
  type: ServiceType;
  description: string;
  price: number;
  duration: number;
  warrantyMonths: number;
  status: ServiceStatus;
  imageName: string | null;
  imageDataUrl?: string | null;
  packageLines?: PackageLine[];
};

type Props = {
  mode: "add" | "edit";
  item?: ServiceItem | null;
  categories: string[];
  availableServices: ServiceItem[];
  initialType?: ServiceType;
  onClose: () => void;
  onSave: (item: ServiceItem) => void;
};

const fieldClass =
  "mt-2 w-full rounded-md border border-[#d7ddea] bg-[#eef0f7] px-3 py-3 text-xs outline-none focus:border-[#253f8d]";

function money(value: number) {
  return `LKR ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ServiceForm({
  mode,
  item,
  categories,
  availableServices,
  initialType = "Service",
  onClose,
  onSave,
}: Props) {
  const fileId = useId();
  const editing = mode === "edit";

  const [type, setType] = useState<ServiceType>(
    item?.type ?? initialType
  );

  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(
    item?.type === "Service" ? item.category : ""
  );
  const [description, setDescription] = useState(
    item?.description ?? ""
  );

  const [price, setPrice] = useState(
    item?.type === "Service" ? String(item.price) : ""
  );

  const [duration, setDuration] = useState(
    item?.type === "Service" ? String(item.duration) : ""
  );

  const [warranty, setWarranty] = useState(
    item?.type === "Service"
      ? String(item.warrantyMonths)
      : ""
  );

  const [status, setStatus] = useState<ServiceStatus>(
    item?.status ?? "Active"
  );

  const [imageName, setImageName] = useState<string | null>(
    item?.imageName ?? null
  );

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(
    item?.imageDataUrl ?? null
  );

  const [lines, setLines] = useState<PackageLine[]>(
    item?.packageLines?.map((line) => ({ ...line })) ?? []
  );

  const [serviceSearch, setServiceSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const individualServices = useMemo(
    () =>
      availableServices.filter(
        (service) =>
          service.type === "Service" &&
          service.name
            .toLowerCase()
            .includes(serviceSearch.trim().toLowerCase())
      ),
    [availableServices, serviceSearch]
  );

  const includedServices = lines.map((line) => ({
    line,
    service: availableServices.find(
      (service) => service.id === line.serviceId
    ),
  }));

  const itemCount = lines.reduce(
    (total, line) => total + line.quantity,
    0
  );

  const totalCost = includedServices.reduce(
    (total, entry) =>
      total + (entry.service?.price ?? 0) * entry.line.quantity,
    0
  );

  const totalDuration = includedServices.reduce(
    (total, entry) =>
      total +
      (entry.service?.duration ?? 0) * entry.line.quantity,
    0
  );

  function addService(serviceId: string) {
    setLines((previous) => {
      const exists = previous.some(
        (line) => line.serviceId === serviceId
      );

      return exists
        ? previous.map((line) =>
            line.serviceId === serviceId
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [...previous, { serviceId, quantity: 1 }];
    });
    setError("");
  }

  function changeQuantity(serviceId: string, amount: number) {
    setLines((previous) =>
      previous.map((line) =>
        line.serviceId === serviceId
          ? {
              ...line,
              quantity: Math.max(1, line.quantity + amount),
            }
          : line
      )
    );
  }

  function removeService(serviceId: string) {
    setLines((previous) =>
      previous.filter((line) => line.serviceId !== serviceId)
    );
  }

  async function handleImage(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only PNG and JPG images are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    try {
      const dataUrl = await new Promise<string>(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () =>
            resolve(String(reader.result));

          reader.onerror = () =>
            reject(new Error("Failed to read image"));

          reader.readAsDataURL(file);
        }
      );

      setImageDataUrl(dataUrl);
      setImageName(file.name);
      setError("");
    } catch {
      setError("Unable to load the selected image.");
    }
  }

  function removeImage() {
    setImageName(null);
    setImageDataUrl(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }

    if (type === "Package") {
      if (lines.length === 0) {
        setError("Add at least one individual service.");
        return;
      }

      if (includedServices.some((entry) => !entry.service)) {
        setError("One or more included services are missing.");
        return;
      }

      onSave({
        id: item?.id ?? crypto.randomUUID(),
        name: name.trim(),
        category: "Package",
        type: "Package",
        description: description.trim(),
        price: totalCost,
        duration: totalDuration,
        warrantyMonths: 0,
        status,
        imageName,
        imageDataUrl,
        packageLines: lines,
      });

      return;
    }

    const numericPrice = Number(price);
    const numericDuration = Number(duration);
    const numericWarranty =
      warranty.trim() === "" ? 0 : Number(warranty);

    if (
      !category ||
      price.trim() === "" ||
      duration.trim() === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericDuration) ||
      numericDuration <= 0 ||
      !Number.isInteger(numericWarranty) ||
      numericWarranty < 0
    ) {
      setError("Please enter valid service details.");
      return;
    }

    onSave({
      id: item?.id ?? crypto.randomUUID(),
      name: name.trim(),
      category,
      type: "Service",
      description: description.trim(),
      price: numericPrice,
      duration: numericDuration,
      warrantyMonths: numericWarranty,
      status,
      imageName,
      imageDataUrl,
    });
  }

  function ImageSection() {
    return (
      <div className="rounded-lg border border-gray-200 bg-[#f5f5f5] p-4">
        {imageDataUrl ? (
          <div className="flex flex-wrap items-start gap-5">
            <img
              src={imageDataUrl}
              alt="Service preview"
              className="h-28 w-36 rounded object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">
                Service Image
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                Current image attached to this service.
              </p>

              <p className="mt-2 break-all text-[11px] text-gray-500">
                {imageName}
              </p>

              <label
                htmlFor={fileId}
                className="mt-3 block cursor-pointer text-xs font-medium text-[#253f8d] underline"
              >
                Change Image
              </label>

              <button
                type="button"
                onClick={removeImage}
                className="mt-3 block text-xs font-medium text-red-600"
              >
                <Trash2 size={13} className="mr-1 inline" />
                Remove Current Image
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={fileId}
            className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 bg-[#e7eaf4] p-5 text-center"
          >
            <UploadCloud size={26} className="text-gray-500" />

            <span className="mt-2 text-xs font-semibold">
              Upload Service Image
            </span>

            <span className="mt-1 text-[11px] text-gray-500">
              PNG, JPG, up to 5MB
            </span>

            <span className="mt-2 text-xs text-[#253f8d] underline">
              Browse File
            </span>

            {imageName && (
              <span className="mt-2 text-xs text-gray-600">
                {imageName}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }

  function StatusSwitch() {
    return (
      <div className="flex items-center justify-between rounded border border-gray-200 p-3">
        <span className="text-xs font-semibold">Active Status</span>

        <button
          type="button"
          role="switch"
          aria-checked={status === "Active"}
          aria-label="Active status"
          onClick={() =>
            setStatus(
              status === "Active" ? "Disabled" : "Active"
            )
          }
          className={`relative h-6 w-11 rounded-full ${
            status === "Active"
              ? "bg-[#253f8d]"
              : "bg-gray-400"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
              status === "Active" ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/45 p-3">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={editing ? `Edit ${type}` : `Add ${type}`}
        className="relative my-auto w-full max-w-[950px] rounded-lg border border-blue-300 bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">
              {editing
                ? type === "Package"
                  ? "Edit Service Package"
                  : "Edit Service"
                : type === "Package"
                  ? "Add New Service Package"
                  : "Add New Service"}
            </h2>

            <p className="mt-1 text-[11px] text-gray-500">
              {editing
                ? "Edit previous service details and save."
                : type === "Package"
                  ? "Combine multiple services into a valuable bundle for your customers."
                  : "Create a new service offering or bundle existing services."}
            </p>
          </div>

          {(!editing || type === "Service") && (
            <div className="mr-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-gray-300 px-5 py-2 text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded bg-[#253f8d] px-5 py-2 text-xs text-white"
              >
                <Check size={14} />
                {editing
                  ? "Save Service"
                  : type === "Package"
                    ? "Create Package"
                    : "Save Service"}
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label="Close form"
            onClick={onClose}
            className="absolute right-4 top-4 text-[#253f8d]"
          >
            <X size={20} />
          </button>
        </div>

        {/* TABS - ADD MODE */}
        {!editing && (
          <div className="mx-6 mb-4 grid max-w-[480px] grid-cols-2 rounded-lg bg-[#f1f1f1] p-1">
            <button
              type="button"
              onClick={() => setType("Service")}
              className={`rounded px-4 py-2 text-xs font-semibold ${
                type === "Service"
                  ? "bg-white shadow"
                  : "text-gray-600"
              }`}
            >
              Single Service
            </button>

            <button
              type="button"
              onClick={() => setType("Package")}
              className={`rounded px-4 py-2 text-xs font-semibold ${
                type === "Package"
                  ? "bg-white shadow"
                  : "text-gray-600"
              }`}
            >
              Service Package
            </button>
          </div>
        )}

        {/* EDIT MODE TABS - LOCKED */}
        {editing && type === "Service" && (
          <div className="mx-6 mb-4 grid max-w-[400px] grid-cols-2 rounded bg-gray-100 p-1">
            <span className="rounded bg-white px-4 py-2 text-center text-xs font-semibold">
              Single Service
            </span>
            <span className="px-4 py-2 text-center text-xs text-gray-500">
              Service Package
            </span>
          </div>
        )}

        <div className="max-h-[72vh] overflow-y-auto px-5 pb-5">
          {type === "Service" ? (
            /* SINGLE SERVICE */
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <label className="text-xs font-semibold">
                  Service Name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="eg: Synthetic Oil Change"
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-semibold">
                  Category
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select Category</option>
                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                    {category && !categories.includes(category) && (
                      <option value={category}>{category}</option>
                    )}
                  </select>
                </label>

                <label className="text-xs font-semibold sm:col-span-2">
                  Description
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Enter description"
                    className={`${fieldClass} resize-none`}
                  />
                </label>
              </div>

              <div className="grid gap-5 border-t border-gray-200 p-5 sm:grid-cols-3">
                <label className="text-xs font-semibold">
                  Base Price
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={fieldClass}
                  />
                </label>

                <label className="text-xs font-semibold">
                  Estimated Duration
                  <div className="relative">
                    <Clock3
                      size={14}
                      className="absolute left-3 top-5 text-gray-500"
                    />
                    <select
                      required
                      value={duration}
                      onChange={(e) =>
                        setDuration(e.target.value)
                      }
                      className={`${fieldClass} pl-9`}
                    >
                      <option value="">Select Duration</option>
                      {[15, 30, 45, 60, 90, 120, 180, 240].map(
                        (minutes) => (
                          <option key={minutes} value={minutes}>
                            {minutes} Minutes
                          </option>
                        )
                      )}
                      {duration &&
                        ![15, 30, 45, 60, 90, 120, 180, 240]
                          .includes(Number(duration)) && (
                          <option value={duration}>
                            {duration} Minutes
                          </option>
                        )}
                    </select>
                  </div>
                </label>

                <label className="text-xs font-semibold">
                  Warranty (Months)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="eg: 6"
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="border-t border-gray-200 p-5">
                <ImageSection />
              </div>
            </div>
          ) : editing ? (
            /* EDIT SERVICE PACKAGE */
            <div className="grid gap-5 lg:grid-cols-[40%_1fr]">
              <div className="space-y-4">
                <div className="rounded border border-gray-200 p-4">
                  <h3 className="mb-4 text-sm font-bold">
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <label className="block text-xs font-semibold">
                      Package Name
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={fieldClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold">
                      Total Price
                      <input
                        readOnly
                        value={money(totalCost)}
                        className={fieldClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold">
                      Description
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                        className={`${fieldClass} resize-none`}
                      />
                    </label>

                    <StatusSwitch />
                  </div>
                </div>

                <ImageSection />
              </div>

              {/* EDIT PACKAGE - INCLUDED SERVICES */}
              <div className="rounded border border-gray-200 p-4">
                <h3 className="mb-5 text-sm font-bold">
                  Include Services
                </h3>

                <p className="mb-2 text-xs font-semibold">
                  Add More Services
                </p>

                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    value={serviceSearch}
                    onChange={(e) =>
                      setServiceSearch(e.target.value)
                    }
                    placeholder="Search for a service to add"
                    className={`${fieldClass} pl-9`}
                  />
                </div>

                <div className="mt-3 max-h-32 space-y-2 overflow-y-auto">
                  {individualServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => addService(service.id)}
                      className="flex w-full items-center justify-between rounded bg-[#eef0f7] p-3 text-left text-xs"
                    >
                      <span>
                        {service.name}
                        <span className="block text-[11px] text-gray-500">
                          {money(service.price)}
                        </span>
                      </span>
                      <Plus size={14} />
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {includedServices.map(({ line, service }) =>
                    service ? (
                      <div
                        key={line.serviceId}
                        className="rounded bg-[#eef0f7] p-3"
                      >
                        <div className="flex justify-between gap-3">
                          <p className="text-xs font-semibold">
                            {service.name}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              removeService(service.id)
                            }
                            aria-label={`Remove ${service.name}`}
                          >
                            <Trash2
                              size={15}
                              className="text-gray-500"
                            />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(service.id, -1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(service.id, 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-xs font-medium">
                            {money(
                              service.price * line.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                {lines.length === 0 && (
                  <p className="py-6 text-center text-xs text-gray-400">
                    No services included.
                  </p>
                )}

                <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span>Items Count :</span>
                    <strong>{itemCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost :</span>
                    <strong>{money(totalCost)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ADD SERVICE PACKAGE */
            <div className="grid gap-4 lg:grid-cols-[35%_1fr]">
              <div className="space-y-4">
                <div className="rounded border border-gray-200 p-4">
                  <h3 className="mb-4 text-sm font-bold text-[#253f8d]">
                    Package Details
                  </h3>

                  <div className="space-y-4">
                    <label className="block text-xs font-semibold">
                      Package Name
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter package name"
                        className={fieldClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold">
                      Total Price
                      <input
                        readOnly
                        value={money(totalCost)}
                        className={fieldClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold">
                      Description
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                        placeholder="Enter description"
                        className={`${fieldClass} resize-none`}
                      />
                    </label>

                    <StatusSwitch />
                  </div>
                </div>
                <ImageSection />
              </div>

              <div className="rounded border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <h3 className="text-sm font-bold text-[#253f8d]">
                    Package Content Builder
                  </h3>
                  <span className="text-xs text-gray-500">
                    {lines.length} services added
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold">
                      Available Services
                    </h4>

                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        value={serviceSearch}
                        onChange={(e) =>
                          setServiceSearch(e.target.value)
                        }
                        placeholder="Search Services"
                        className={`${fieldClass} pl-9`}
                      />
                    </div>

                    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                      {individualServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => addService(service.id)}
                          className="flex w-full justify-between rounded bg-[#eef0f7] p-3 text-left text-xs"
                        >
                          <span>
                            <strong>{service.name}</strong>
                            <span className="mt-1 block">
                              {money(service.price)}
                            </span>
                          </span>
                          <Plus size={15} />
                        </button>
                      ))}

                      {individualServices.length === 0 && (
                        <p className="p-5 text-center text-xs text-gray-400">
                          No individual services available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex justify-between">
                      <h4 className="text-xs font-bold text-[#253f8d]">
                        INCLUDED IN PACKAGE
                      </h4>
                      <button
                        type="button"
                        onClick={() => setLines([])}
                        className="text-xs text-red-500"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex min-h-72 flex-col rounded bg-[#f4f4f4] p-3">
                      <div className="space-y-2">
                        {includedServices.map(({ line, service }) =>
                          service ? (
                            <div
                              key={line.serviceId}
                              className="rounded bg-white p-3"
                            >
                              <p className="text-xs font-semibold">
                                {service.name}
                              </p>
                              <p className="mt-1 text-[11px]">
                                {money(
                                  service.price * line.quantity
                                )}
                              </p>

                              <div className="mt-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      changeQuantity(service.id, -1)
                                    }
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={13} />
                                  </button>
                                  <span className="text-xs">
                                    {line.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      changeQuantity(service.id, 1)
                                    }
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeService(service.id)
                                  }
                                  className="text-xs text-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>

                      <div className="mt-auto space-y-2 border-t pt-4 text-xs">
                        <div className="flex justify-between">
                          <span>Items Count :</span>
                          <strong>{itemCount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Cost :</span>
                          <strong>{money(totalCost)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <input
            id={fileId}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              void handleImage(e.target.files?.[0]);
            }}
          />

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* EDIT PACKAGE FOOTER */}
          {editing && type === "Package" && (
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-gray-300 px-5 py-2.5 text-xs"
              >
                Discard Changes
              </button>

              <button
                type="submit"
                className="rounded bg-[#253f8d] px-5 py-2.5 text-xs text-white"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
