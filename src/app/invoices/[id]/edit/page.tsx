import { getInvoice } from "@/actions/invoices"
import { getClients } from "@/actions/clients"
import { InvoiceForm } from "@/components/invoices/InvoiceForm"
import { notFound } from "next/navigation"
import { InvoiceItem } from "@prisma/client"

interface EditInvoicePageProps {
    params: {
        id: string
    }
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const { id } = await Promise.resolve(params) // Await params in newer Next.js versions if needed, or just params

    const [invoice, clients] = await Promise.all([
        getInvoice(id),
        getClients()
    ])

    if (!invoice) {
        notFound()
    }

    // Transform invoice data to match form values
    const formattedInvoice: any = {
        ...invoice,
        items: invoice.items.map((item: InvoiceItem) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            vatRate: Number(item.vatRate)
        }))
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Edit Invoice</h2>
                        <p className="text-muted-foreground mt-1">Update invoice details.</p>
                    </div>
                </div>
                <InvoiceForm clients={clients} initialData={formattedInvoice} />
            </div>
        </div>
    )
}
