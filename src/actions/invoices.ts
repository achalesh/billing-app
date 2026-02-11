'use server'

import { prisma } from "@/lib/db"
import { InvoiceFormValues } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

export async function getInvoices() {
    return await prisma.invoice.findMany({
        include: {
            client: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function getInvoice(id: string) {
    return await prisma.invoice.findUnique({
        where: { id },
        include: {
            client: true,
            items: true
        }
    })
}

export async function createInvoice(data: InvoiceFormValues) {
    // Calculate totals
    const items = data.items.map(item => {
        const amount = Number(item.quantity) * Number(item.unitPrice)
        return {
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            vatRate: Number(item.vatRate),
            amount
        }
    })

    const subTotal = items.reduce((acc, item) => acc + item.amount, 0)
    const totalVat = items.reduce((acc, item) => acc + (item.amount * (item.vatRate / 100)), 0)
    const total = subTotal + totalVat

    // Generate Invoice Number
    const count = await prisma.invoice.count()
    const invoiceNumber = `INV-${(count + 1).toString().padStart(4, '0')}`

    const result = await prisma.invoice.create({
        data: {
            invoiceNumber,
            date: data.date,
            dueDate: data.dueDate,
            status: data.status,
            clientId: data.clientId || undefined, // Handle empty string as undefined
            items: {
                create: items
            },
            subTotal,
            totalVat,
            total
        }
    })

    revalidatePath("/invoices")
    return { success: true, invoice: result }
}

export async function updateInvoice(id: string, data: InvoiceFormValues) {
    const items = data.items.map(item => {
        const amount = Number(item.quantity) * Number(item.unitPrice)
        return {
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            vatRate: Number(item.vatRate),
            amount
        }
    })

    const subTotal = items.reduce((acc, item) => acc + item.amount, 0)
    const totalVat = items.reduce((acc, item) => acc + (item.amount * (item.vatRate / 100)), 0)
    const total = subTotal + totalVat

    await prisma.$transaction(async (tx) => {
        await tx.invoiceItem.deleteMany({
            where: { invoiceId: id }
        })

        await tx.invoice.update({
            where: { id },
            data: {
                date: data.date,
                dueDate: data.dueDate,
                status: data.status,
                clientId: data.clientId || undefined, // Handle empty string as undefined
                items: {
                    create: items
                },
                subTotal,
                totalVat,
                total
            }
        })
    })

    revalidatePath("/invoices")
    revalidatePath(`/invoices/${id}`)
    return { success: true }
}

export async function deleteInvoice(id: string) {
    await prisma.invoice.delete({
        where: { id }
    })
    revalidatePath("/invoices")
    return { success: true }
}

export async function updateInvoiceStatus(id: string, status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED") {
    await prisma.invoice.update({
        where: { id },
        data: { status }
    })
    revalidatePath("/invoices")
    revalidatePath(`/invoices/${id}`)
    return { success: true }
}
