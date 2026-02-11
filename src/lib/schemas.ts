import { z } from "zod"

export const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().default("United Kingdom"),
    vatNumber: z.string().optional(),
})


export const invoiceItemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
    vatRate: z.coerce.number().default(20),
})

export const invoiceSchema = z.object({
    clientId: z.string().optional().or(z.literal("")), // Optional for walk-ins
    date: z.date(),
    dueDate: z.date(),
    status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).default("DRAFT"),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
})

export const settingsSchema = z.object({
    companyName: z.string().min(1, "Company Name is required"),
    companyAddress: z.string().optional(),
    companyEmail: z.string().email().optional().or(z.literal("")),
    companyPhone: z.string().optional(),
    vatNumber: z.string().optional(),
    bankName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    invoiceTerms: z.string().optional(),
})

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    sku: z.string().optional(),
})

export type ClientFormValues = z.infer<typeof clientSchema>
export type InvoiceItemFormValues = z.infer<typeof invoiceItemSchema>
export type InvoiceFormValues = z.infer<typeof invoiceSchema>
export type SettingsFormValues = z.infer<typeof settingsSchema>
export type ProductFormValues = z.infer<typeof productSchema>
