'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getClients() {
    return await prisma.client.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function createClient(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const postcode = formData.get("postcode") as string
    const country = formData.get("country") as string
    const vatNumber = formData.get("vatNumber") as string

    await prisma.client.create({
        data: {
            name,
            email,
            phone,
            address,
            city,
            postcode,
            country: country || "United Kingdom",
            vatNumber
        }
    })

    revalidatePath("/clients")
    return { success: true }
}

export async function updateClient(id: string, formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const postcode = formData.get("postcode") as string
    const country = formData.get("country") as string
    const vatNumber = formData.get("vatNumber") as string

    await prisma.client.update({
        where: { id },
        data: {
            name,
            email,
            phone,
            address,
            city,
            postcode,
            country,
            vatNumber
        }
    })

    revalidatePath("/clients")
    return { success: true }
}

export async function deleteClient(id: string) {
    await prisma.client.delete({
        where: { id }
    })
    revalidatePath("/clients")
    return { success: true }
}
