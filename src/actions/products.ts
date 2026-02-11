"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    sku: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export async function createProduct(data: ProductFormValues) {
    try {
        const validated = productSchema.parse(data)
        await prisma.product.create({
            data: validated,
        })
        revalidatePath("/inventory")
        return { success: true }
    } catch (error) {
        console.error("Failed to create product:", error)
        return { success: false, error: "Failed to create product" }
    }
}

export async function updateProduct(id: string, data: ProductFormValues) {
    try {
        const validated = productSchema.parse(data)
        await prisma.product.update({
            where: { id },
            data: validated,
        })
        revalidatePath("/inventory")
        return { success: true }
    } catch (error) {
        console.error("Failed to update product:", error)
        return { success: false, error: "Failed to update product" }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        })
        revalidatePath("/inventory")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { success: false, error: "Failed to delete product" }
    }
}

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { name: "asc" },
    })
}

export async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id },
    })
}
