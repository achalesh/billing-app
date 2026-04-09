import { getProducts } from "@/actions/products"
import { getSettings } from "@/actions/settings"
import { POSInterface } from "@/components/shop/POSInterface"

export default async function ShopPage() {
    const [products, settings] = await Promise.all([getProducts(), getSettings()])

    return (
        <div className="p-6 h-screen bg-gray-100/50 overflow-hidden">
            <POSInterface 
                products={products} 
                currencySymbol={settings?.currencySymbol ?? "£"} 
                taxName={settings?.taxName ?? "Tax"}
                defaultTaxRate={settings?.defaultVatRate ?? 20}
            />
        </div>
    )
}
