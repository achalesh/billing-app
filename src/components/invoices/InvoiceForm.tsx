"use client"


import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { invoiceSchema, type InvoiceFormValues } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Client } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"
import { useEffect } from "react"

import { createInvoice, updateInvoice } from "@/actions/invoices"

interface InvoiceFormProps {
    clients: Client[]
    initialData?: any // Validated by schema regardless
    currencySymbol?: string
    taxName?: string
    defaultVatRate?: number
}

export function InvoiceForm({ clients, initialData, currencySymbol = "£", taxName = "Tax", defaultVatRate = 20 }: InvoiceFormProps) {
    const router = useRouter()
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: initialData ? {
            clientId: initialData.clientId,
            date: new Date(initialData.date),
            dueDate: new Date(initialData.dueDate),
            status: initialData.status,
            items: initialData.items.map((item: any) => ({
                description: item.description,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice), // Ensure number
                vatRate: Number(item.vatRate)
            })),
        } : {
            clientId: "",
            date: new Date(),
            dueDate: new Date(),
            status: "DRAFT",
            items: [
                { description: "Service", quantity: 1, unitPrice: 0, vatRate: defaultVatRate }
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: form.control as any,
    })

    async function onSubmit(data: InvoiceFormValues) {
        try {
            if (initialData) {
                await updateInvoice(initialData.id, data)
                toast.success("Invoice updated successfully")
            } else {
                await createInvoice(data)
                toast.success("Invoice created successfully")
            }
            router.push("/invoices")
            router.refresh()
        } catch (error) {
            toast.error("Failed to save invoice")
            console.error(error)
        }
    }

    // Calculate totals for display
    const items = form.watch("items")
    const subTotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0)
    const totalVat = items.reduce((acc, item) => acc + ((Number(item.quantity) * Number(item.unitPrice)) * (Number(item.vatRate) / 100)), 0)
    const total = subTotal + totalVat

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a client" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {clients.map((client) => (
                                                    <SelectItem key={client.id} value={client.id}>
                                                        {client.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(subTotal, currencySymbol)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{taxName}:</span>
                                <span className="font-medium">{formatCurrency(totalVat, currencySymbol)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="font-bold text-lg">Total:</span>
                                <span className="font-bold text-lg">{formatCurrency(total, currencySymbol)}</span>
                            </div>
                            <Button type="submit" className="w-full mt-4" size="lg">Create Invoice</Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Line Items</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0, vatRate: 20 })}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border rounded-lg p-4">
                                <div className="col-span-12 md:col-span-5">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Item description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Qty</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Price ({currencySymbol})</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-3 md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.vatRate`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>{taxName} (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
