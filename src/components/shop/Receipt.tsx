"use client"

import { formatCurrency } from "@/lib/format"
import { forwardRef } from "react"
import { format } from "date-fns"

interface ReceiptProps {
    invoice: any // Replace with proper type
    settings?: any
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ invoice, settings }, ref) => {
    if (!invoice) return null

    return (
        <div ref={ref} className="hidden print:block print:w-[80mm] print:p-2 text-[12px] font-mono leading-tight">
            <div className="text-center mb-4">
                <h1 className="font-bold text-lg mb-1">{settings?.companyName || "STORE NAME"}</h1>
                <p>{settings?.companyAddress}</p>
                <p>{settings?.companyPhone}</p>
                {settings?.vatNumber && <p>{settings?.taxName ?? "Tax"}: {settings.vatNumber}</p>}
            </div>

            <div className="mb-4 border-b border-black border-dashed pb-2">
                <p>Date: {format(new Date(invoice.date), "dd/MM/yyyy HH:mm")}</p>
                <p>Inv #: {invoice.invoiceNumber}</p>
            </div>

            <div className="mb-4">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-black">
                            <th className="w-1/2">Item</th>
                            <th className="text-right">Qty</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/0">
                        {invoice.items.map((item: any) => (
                            <tr key={item.id}>
                                <td className="py-1 pr-2 truncate max-w-[40mm]">{item.description}</td>
                                <td className="text-right align-top">{item.quantity}</td>
                                <td className="text-right align-top">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-black border-dashed pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(invoice.total, settings?.currencySymbol ?? "£")}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span>{settings?.taxName ?? "Tax"} (Included)</span>
                    <span>{formatCurrency(invoice.totalVat, settings?.currencySymbol ?? "£")}</span>
                </div>
            </div>

            <div className="text-center mt-6 text-[10px]">
                <p>Thank you for your business!</p>
            </div>
        </div>
    )
})

Receipt.displayName = "Receipt"
