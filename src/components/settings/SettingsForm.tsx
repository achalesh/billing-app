"use client"

import { updateSettings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { settingsSchema, type SettingsFormValues } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SettingsFormProps {
    settings?: SettingsFormValues | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            companyName: settings?.companyName || "",
            companyAddress: settings?.companyAddress || "",
            companyEmail: settings?.companyEmail || "",
            companyPhone: settings?.companyPhone || "",
            vatNumber: settings?.vatNumber || "",
            bankName: settings?.bankName || "",
            sortCode: settings?.sortCode || "",
            accountNumber: settings?.accountNumber || "",
            invoiceTerms: settings?.invoiceTerms || "Payment due within 30 days.",
        },
    })

    async function onSubmit(data: SettingsFormValues) {
        try {
            await updateSettings(data)
            toast.success("Settings updated successfully")
        } catch (error) {
            toast.error("Failed to update settings")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>These details will appear on your invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Company Ltd" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Business Rd..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="accounts@mycompany.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+44 123 456 789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VAT Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="GB123456789" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bank Details</CardTitle>
                        <CardDescription>Payment information for your clients.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Barclays" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sortCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sort Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12-34-56" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="invoiceTerms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Terms & Conditions</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Payment due within 30 days." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit">Save Settings</Button>
            </form>
        </Form>
    )
}
