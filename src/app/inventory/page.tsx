import { getProducts } from "@/actions/products"
import { ProductDialog } from "@/components/inventory/ProductDialog"
import { ProductActions } from "@/components/inventory/ProductActions"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"

export default async function InventoryPage() {
    const products = await getProducts()

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventory</h2>
                    <p className="text-muted-foreground mt-1">Manage your products and stock.</p>
                </div>
                <ProductDialog mode="create" />
            </div>

            <Card className="border-indigo-50 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-b border-gray-100">
                                <TableHead className="pl-6 py-4">Name</TableHead>
                                <TableHead className="py-4">SKU</TableHead>
                                <TableHead className="py-4 text-right">Price</TableHead>
                                <TableHead className="py-4 text-right">Stock</TableHead>
                                <TableHead className="py-4 pr-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No products found. Add items to your inventory.
                                    </TableCell>
                                </TableRow>
                            )}
                            {products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                    <TableCell className="font-semibold text-gray-900 pl-6 py-4">
                                        <div>{product.name}</div>
                                        {product.description && <div className="text-xs text-muted-foreground font-normal">{product.description}</div>}
                                    </TableCell>
                                    <TableCell className="text-gray-600 py-4 font-mono text-sm">{product.sku || "-"}</TableCell>
                                    <TableCell className="text-right font-medium text-gray-900 py-4">{formatCurrency(product.price)}</TableCell>
                                    <TableCell className="text-right py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : product.stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <ProductActions product={product} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
