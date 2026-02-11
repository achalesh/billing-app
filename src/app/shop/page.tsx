import { getProducts } from "@/actions/products"
import { POSInterface } from "@/components/shop/POSInterface"

export default async function ShopPage() {
    const products = await getProducts()

    return (
        <div className="p-6 h-screen bg-gray-100/50 overflow-hidden">
            <POSInterface products={products} />
        </div>
    )
}
