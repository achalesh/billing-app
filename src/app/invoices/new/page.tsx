import { getClients } from "@/actions/clients"
import { getSettings } from "@/actions/settings"
import { InvoiceForm } from "@/components/invoices/InvoiceForm"

export default async function NewInvoicePage() {
    const [clients, settings] = await Promise.all([getClients(), getSettings()])

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">New Invoice</h2>
                        <p className="text-muted-foreground mt-1">Create a new invoice for your client.</p>
                    </div>
                </div>
                <InvoiceForm 
                    clients={clients} 
                    currencySymbol={settings?.currencySymbol ?? "£"}
                    taxName={settings?.taxName ?? "Tax"}
                    defaultVatRate={settings?.defaultVatRate ?? 20}
                />
            </div>
        </div>
    )
}
