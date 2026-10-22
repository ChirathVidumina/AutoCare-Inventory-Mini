
import { useEffect } from "react";
import {
  X,
  Pencil,
  Clock3,
  Wrench,
  Banknote,
  ImageOff,
  Layers3,
} from "lucide-react";

import type { ServiceItem } from "./ServiceForm";

type Props = {
  item: ServiceItem;
  allServices: ServiceItem[];
  onClose: () => void;
  onEdit: (item: ServiceItem) => void;
};

function formatMoney(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) return `${minutes} Minutes`;
  if (remaining === 0) return `${hours} Hours`;

  return `${hours} Hours ${remaining} Minutes`;
}

function ServiceImage({ item }: { item: ServiceItem }) {
  return item.imageDataUrl ? (
    <img
      src={item.imageDataUrl}
      alt={item.name}
      className="h-44 w-full rounded-md object-cover"
    />
  ) : (
    <div className="flex h-44 w-full flex-col items-center justify-center rounded-md bg-[#eef0f7] text-gray-400">
      <ImageOff size={30} />
      <span className="mt-2 text-xs">No image uploaded</span>
    </div>
  );
}

export default function ViewServiceModal({
  item,
  allServices,
  onClose,
  onEdit,
}: Props) {
  const isPackage = item.type === "Package";

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const included = (item.packageLines ?? []).map((line) => ({
    ...line,
    service: allServices.find(
      (service) => service.id === line.serviceId
    ),
  }));

  const totalServiceUnits = included.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );

  // Calculate package cost from its current included services.
  const packageValue = included.reduce(
    (sum, entry) =>
      sum + (entry.service?.price ?? 0) * entry.quantity,
    0
  );

  const packageDuration = included.reduce(
    (sum, entry) =>
      sum + (entry.service?.duration ?? 0) * entry.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/45 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isPackage ? "View Package" : "View Service"}
        className={`relative my-auto w-full rounded-xl bg-white p-5 shadow-2xl ${
          isPackage ? "max-w-[900px]" : "max-w-[670px]"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-black">
              {isPackage ? "View Package" : "View Service"}
            </h2>

            <p className="mt-1 text-[11px] text-gray-500">
              View service information
            </p>
          </div>

          <div className="mr-8">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="flex items-center gap-2 rounded bg-[#253f8d] px-4 py-2 text-xs font-medium text-white"
            >
              <Pencil size={13} />
              Edit Service
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 text-[#253f8d]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto pt-5">
          {!isPackage ? (
            /* VIEW SINGLE SERVICE */
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-5 text-sm font-bold text-[#253f8d]">
                {item.name}
              </h3>

              <div className="grid gap-6 sm:grid-cols-[42%_1fr]">
                <ServiceImage item={item} />

                <div>
                  <h4 className="mb-5 text-xs font-bold">
                    Service Parameters
                  </h4>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-6 text-xs">
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="mt-2 font-semibold">
                        {item.category}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Base Price</p>
                      <p className="mt-2 font-semibold">
                        {formatMoney(item.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Estimated Duration
                      </p>
                      <p className="mt-2 font-semibold">
                        {formatDuration(item.duration)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Status</p>
                      <span
                        className={`mt-2 inline-block font-semibold ${
                          item.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-500">Warranty</p>
                      <p className="mt-2 font-semibold">
                        {item.warrantyMonths} Months
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-xs font-bold">
                  Detailed Description
                </h4>

                <p className="whitespace-pre-line text-xs leading-6 text-slate-700">
                  {item.description || "No description provided."}
                </p>
              </div>
            </div>
          ) : (
            /* VIEW PACKAGE */
            <div className="space-y-5">
              {/* PACKAGE INFORMATION */}
              <div className="rounded-lg border border-gray-200 p-5">
                <h3 className="mb-5 text-center text-sm font-bold text-[#253f8d]">
                  {item.name}
                </h3>

                <div className="grid gap-5 sm:grid-cols-[40%_1fr]">
                  <ServiceImage item={item} />

                  <div>
                    <h4 className="text-xs font-bold">
                      Detailed Description
                    </h4>

                    <p className="mt-3 whitespace-pre-line text-xs leading-5 text-gray-700">
                      {item.description || "No description provided."}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-[#f4f5f9] p-3 text-center">
                        <Clock3
                          size={17}
                          className="mx-auto mb-2 text-[#253f8d]"
                        />
                        <p className="text-[11px] text-gray-500">
                          Estimate Duration
                        </p>
                        <p className="mt-1 text-xs font-bold">
                          {formatDuration(packageDuration)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f4f5f9] p-3 text-center">
                        <Layers3
                          size={17}
                          className="mx-auto mb-2 text-[#253f8d]"
                        />
                        <p className="text-[11px] text-gray-500">
                          Total Services
                        </p>
                        <p className="mt-1 text-xs font-bold">
                          {totalServiceUnits} Items
                        </p>
                      </div>

                      <div className="rounded-lg bg-green-50 p-3 text-center">
                        <Banknote
                          size={17}
                          className="mx-auto mb-2 text-green-600"
                        />
                        <p className="text-[11px] text-gray-500">
                          Value Sum
                        </p>
                        <p className="mt-1 text-xs font-bold text-green-700">
                          {formatMoney(packageValue)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs">
                      <span className="font-semibold">Status: </span>
                      <span
                        className={
                          item.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* INCLUDED SERVICES */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#253f8d]">
                  <Wrench size={17} />
                  Included Services
                </h4>

                <div className="overflow-x-auto rounded border border-gray-200">
                  <table className="w-full min-w-[580px] text-left text-xs">
                    <thead className="bg-[#f3f4f6]">
                      <tr>
                        <th className="px-4 py-3">Service Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Individual Value</th>
                      </tr>
                    </thead>

                    <tbody>
                      {included.map((entry) => (
                        <tr
                          key={entry.serviceId}
                          className="border-t border-gray-200"
                        >
                          <td className="px-4 py-4 font-medium">
                            {entry.service?.name ?? "Unavailable Service"}
                            {entry.quantity > 1 && (
                              <span className="ml-2 text-gray-500">
                                × {entry.quantity}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {entry.service?.category ?? "—"}
                          </td>

                          <td className="px-4 py-4">
                            {entry.service
                              ? formatDuration(
                                  entry.service.duration *
                                    entry.quantity
                                )
                              : "—"}
                          </td>

                          <td className="px-4 py-4">
                            {entry.service
                              ? formatMoney(
                                  entry.service.price *
                                    entry.quantity
                                )
                              : "—"}
                          </td>
                        </tr>
                      ))}

                      {included.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-10 text-center text-gray-400"
                          >
                            No services included.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CLOSE BUTTON */}
        <div className="mt-5 flex justify-end border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-blue-300 px-5 py-2 text-xs font-medium text-[#253f8d]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
