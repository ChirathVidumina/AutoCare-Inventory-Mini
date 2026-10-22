import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Printer, Download, Car } from "lucide-react";
import { invoices, calcTotals, formatMoney, formatDate } from "./mockData";
import StatusBadge from "./StatusBadge";

export default function InvoiceViewPage() {
  const { invoiceId } = useParams();
  const invoice = invoices.find((i) => i.id === invoiceId);

  if (!invoice) {
    return (
      <div className="p-6">
        <Link to="/billing" className="text-blue-700 hover:underline">← Back to invoices</Link>
        <p className="mt-4 text-gray-600">Invoice not found.</p>
      </div>
    );
  }

  const totals = calcTotals(invoice.items, invoice.taxRate, invoice.discount);
  const isPaid = invoice.status === "Paid";

  return (
    <div className="p-6">
      {/* Only the invoice sheet is printed */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; }
        }
      `}</style>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to="/billing" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Email sending will be connected when the backend is ready.")}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" /> Email
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div id="invoice-print" className="relative mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
        {isPaid && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="-rotate-45 select-none text-[10rem] font-black text-gray-100">PAID</span>
          </div>
        )}

        <div className="relative">
          {/* Company + invoice header */}
          <div className="mb-10 flex flex-wrap justify-between gap-6">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-800 text-white">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-900">Auto Care</p>
                <p className="text-sm text-gray-500">Service &amp; Restoration</p>
                <p className="mt-4 text-sm text-gray-500">4521 Automotive Way, Delgahakanda</p>
                <p className="text-sm text-gray-500">Colombo 08</p>
                <p className="text-sm text-gray-500">+94 3341488 | billing@autocare.lk</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">INVOICE</p>
              <p className="text-sm"># {invoice.id}</p>
              <p className="text-sm text-gray-400">Date: {formatDate(invoice.date)}</p>
              <div className="mt-2">
                <StatusBadge status={invoice.status} label={isPaid ? "Fully Paid" : invoice.status} />
              </div>
            </div>
          </div>

          {/* Bill to + vehicle */}
          <div className="mb-8 grid gap-6 border border-gray-300 p-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-500">Bill To</h2>
              <p className="text-sm">{invoice.customer}</p>
              <p className="text-sm">{invoice.phone}</p>
              <p className="text-sm">{invoice.address}</p>
              <p className="text-sm">{invoice.email}</p>
            </div>
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-500">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-400">Make &amp; Model</p><p>{invoice.vehicle}</p></div>
                <div><p className="text-gray-400">Plate Number</p><p>{invoice.plate}</p></div>
                {invoice.vin && <div><p className="text-gray-400">VIN</p><p>{invoice.vin}</p></div>}
                {invoice.mileage && <div><p className="text-gray-400">Mileage In</p><p>{invoice.mileage}</p></div>}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="mb-8 w-full text-left text-sm">
              <thead>
                <tr className="text-base">
                  <th className="py-3">Description</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Qty/Hrs</th>
                  <th className="py-3">Unit Price</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3">
                      <p className="font-semibold">{item.name}</p>
                      {item.note && <p className="text-xs text-gray-400">{item.note}</p>}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded px-3 py-1 text-xs ${
                          item.type === "Service" ? "bg-sky-100 text-sky-600" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.type === "Part" ? "Parts" : "Service"}
                      </span>
                    </td>
                    <td className="py-3">{item.qty.toFixed(1)}</td>
                    <td className="py-3">{formatMoney(item.unitPrice)}</td>
                    <td className="py-3 text-right">{formatMoney(item.qty * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes + totals */}
          <div className="flex flex-wrap justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="mb-2 font-semibold text-gray-500">Notes &amp; Terms</h3>
              <p className="text-sm text-gray-400">
                Thank you for choosing Auto Care for your vehicle maintenance. Parts and labor are warranted for
                3 months or 12,000 miles, whichever comes first. Please keep this invoice for your records.
              </p>
            </div>
            <div className="w-full max-w-xs text-sm">
              <div className="flex justify-between py-1 text-gray-500"><span>Sub total</span><span className="text-black">{formatMoney(totals.subtotal)}</span></div>
              <div className="flex justify-between py-1 text-gray-500"><span>Sales Tax ({invoice.taxRate}%)</span><span className="text-black">{formatMoney(totals.tax)}</span></div>
              <div className="flex justify-between py-1 text-gray-500"><span>Discount</span><span className="text-green-600">- {formatMoney(totals.discount)}</span></div>
              <div className="mt-3 flex items-center justify-between border-y border-gray-200 py-3">
                <span className="text-lg">Total</span>
                <span className="text-xl font-bold text-blue-900">{formatMoney(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}