'use server'

import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/format"

export async function getDashboardStats() {
    const totalRevenue = await prisma.invoice.aggregate({
        _sum: {
            total: true
        },
        where: {
            status: "PAID"
        }
    })

    const outstandingResult = await prisma.invoice.aggregate({
        _sum: {
            total: true
        },
        where: {
            status: {
                in: ["SENT", "OVERDUE"]
            }
        }
    })

    const activeClientsCount = await prisma.client.count()
    const invoiceCount = await prisma.invoice.count()

    const recentInvoices = await prisma.invoice.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            client: true
        }
    })

    return {
        totalRevenue: totalRevenue._sum.total || 0,
        outstanding: outstandingResult._sum.total || 0,
        activeClients: activeClientsCount,
        totalInvoices: invoiceCount,
        recentInvoices
    }
}
