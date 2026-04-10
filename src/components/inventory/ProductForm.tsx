"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProduct, updateProduct } from "@/services/products"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "@/lib/schemas"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"

interface ProductFormProps {
    product?: any
    mode?: "create" | "edit"
    currencySymbol?: string
    onSuccess?: () => void
}

export function ProductForm({ product, mode = "create", currencySymbol = "£", onSuccess }: ProductFormProps) {
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: product?.name ?? "",
            description: product?.description ?? "",
            price: product?.price ?? 0,
            stock: product?.stock ?? 0,
            sku: product?.sku ?? "",
        },
    })

    async function onSubmit(data: ProductFormValues) {
        try {
            if (mode === "create") {
                await createProduct(data)
                toast.success("Product created successfully")
            } else {
                if (!product?.id) return
                await updateProduct(product.id, data)
                toast.success("Product updated successfully")
            }
            
            if (onSuccess) {
                onSuccess()
            } else {
                router.push("/products")
                router.refresh()
            }
            
            if (mode === "create") {
                form.reset()
            }
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Product Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ({currencySymbol})</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SKU / Barcode</FormLabel>
                            <FormControl>
                                <Input placeholder="Scan or enter SKU" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="pt-4 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto">
                        {mode === "create" ? "Create Product" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
