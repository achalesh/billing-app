import { getInvoice } from "@/actions/invoices"
import { getSettings } from "@/actions/settings"
import { formatCurrency } from "@/lib/format"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { PrintButton } from "@/components/invoices/PrintButton"
import { InvoiceActions } from "@/components/invoices/InvoiceActions"

interface InvoicePageProps {
    params: Promise<{ id: string }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    const { id } = await params
    const [invoice, settings] = await Promise.all([
        getInvoice(id),
        getSettings()
    ])

    if (!invoice) return notFound()

    const currencySymbol = settings?.currencySymbol ?? "£"
    const taxName = settings?.taxName ?? "Tax"

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center print:hidden">
                    <h1 className="text-2xl font-bold">Invoice Details</h1>
                    <div className="flex gap-2">
                        <InvoiceActions id={invoice.id} status={invoice.status} />
                        <PrintButton />
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-10 shadow-sm print:shadow-none print:border-none" id="invoice-content">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">INVOICE</h1>
                            <p className="text-gray-500 mt-1">#{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-gray-900">{settings?.companyName || "Your Company Name"}</h3>
                            <p className="text-gray-500 text-sm whitespace-pre-line">
                                {settings?.companyAddress || "Address Line 1\nCity, Postcode\nCountry"}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                                {settings?.companyEmail && <p>{settings.companyEmail}</p>}
                                {settings?.companyPhone && <p>{settings.companyPhone}</p>}
                                {settings?.vatNumber && <p>{taxName} Reg: {settings.vatNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Client & Dates */}
                    <div className="grid grid-cols-2 gap-8 py-8 border-b">
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h4>
                            <p className="font-bold text-gray-900">{invoice.client?.name ?? "Walk-in Customer"}</p>
                            <p className="text-gray-500 text-sm whitespace-pre-line mt-1">
                                {invoice.client?.address}
                                {invoice.client?.city && `\n${invoice.client.city}`}
                                {invoice.client?.postcode && `\n${invoice.client.postcode}`}
                                {invoice.client?.country && `\n${invoice.client.country}`}
                            </p>
                            {invoice.client?.vatNumber && <p className="text-sm text-gray-500 mt-2">{taxName}: {invoice.client.vatNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Invoice Date</h4>
                                <p className="text-gray-900 font-medium">{format(invoice.date, "dd MMM yyyy")}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
                                <p className="text-gray-900 font-medium">{format(invoice.dueDate, "dd MMM yyyy")}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                    {invoice.status.toLowerCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="py-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Description</th>
                                    <th className="py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Qty</th>
                                    <th className="py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Price</th>
                                    <th className="py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">{taxName}</th>
                                    <th className="py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 text-sm text-gray-900">{item.description}</td>
                                        <td className="py-4 text-sm text-gray-500 text-right">{item.quantity}</td>
                                        <td className="py-4 text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice, currencySymbol)}</td>
                                        <td className="py-4 text-sm text-gray-500 text-right">{item.vatRate}%</td>
                                        <td className="py-4 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.amount, currencySymbol)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end border-t pt-8">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(invoice.subTotal, currencySymbol)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{taxName} Total</span>
                                <span>{formatCurrency(invoice.totalVat, currencySymbol)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                                <span>Total</span>
                                <span>{formatCurrency(invoice.total, currencySymbol)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Bank Details */}
                    {settings?.bankName && (
                        <div className="mt-12 pt-8 border-t text-sm text-gray-500">
                            <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                            <div className="grid grid-cols-2 max-w-sm gap-y-1">
                                <span>Bank Name:</span>
                                <span className="text-gray-900">{settings.bankName}</span>
                                <span>Sort Code:</span>
                                <span className="text-gray-900">{settings.sortCode}</span>
                                <span>Account No:</span>
                                <span className="text-gray-900">{settings.accountNumber}</span>
                            </div>
                            {settings.invoiceTerms && (
                                <div className="mt-4 text-xs">
                                    <p>{settings.invoiceTerms}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
