import { getSettings } from "@/actions/settings"
import { SettingsForm } from "@/components/settings/SettingsForm"

export default async function SettingsPage() {
    const settings = await getSettings()

    // Sanitize settings to ensure no nulls are passed to the form
    const sanitizedSettings = settings ? {
        companyName: settings.companyName,
        companyAddress: settings.companyAddress || undefined,
        companyEmail: settings.companyEmail || undefined,
        companyPhone: settings.companyPhone || undefined,
        country: settings.country,
        taxName: settings.taxName,
        currencySymbol: settings.currencySymbol,
        defaultVatRate: settings.defaultVatRate,
        vatNumber: settings.vatNumber || undefined,
        bankName: settings.bankName || undefined,
        sortCode: settings.sortCode || undefined,
        accountNumber: settings.accountNumber || undefined,
        invoiceTerms: settings.invoiceTerms || undefined,
    } : null

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h2>
                        <p className="text-muted-foreground mt-1">Manage your company details and preferences.</p>
                    </div>
                </div>
                <SettingsForm settings={sanitizedSettings} />
            </div>
        </div>
    )
}
