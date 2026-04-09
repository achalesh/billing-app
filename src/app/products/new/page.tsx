import { getSettings } from "@/actions/settings"
import { ProductForm } from "@/components/inventory/ProductForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewProductPage() {
    const settings = await getSettings()
    const currencySymbol = settings?.currencySymbol ?? "£"

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Button asChild variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-indigo-600">
                        <Link href="/products" className="flex items-center">
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Products
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">New Product</h2>
                    <p className="text-muted-foreground mt-1">Add a new item to your product catalog.</p>
                </div>

                <Card className="border-indigo-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>
                            Enter the information for the new product. This will be available in the POS and Invoices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ProductForm currencySymbol={currencySymbol} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
