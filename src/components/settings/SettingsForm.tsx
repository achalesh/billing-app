"use client"

import { updateSettings } from "@/services/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countryConfigs, getCountryConfig } from "@/lib/country-config"
import { settingsSchema, type SettingsFormValues } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SettingsFormProps {
    settings?: SettingsFormValues | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema) as any,
        defaultValues: {
            companyName: settings?.companyName || "",
            companyAddress: settings?.companyAddress || "",
            companyEmail: settings?.companyEmail || "",
            companyPhone: settings?.companyPhone || "",
            country: settings?.country || "United Kingdom",
            taxName: settings?.taxName || "VAT",
            currencySymbol: settings?.currencySymbol || "£",
            defaultVatRate: settings?.defaultVatRate || 20,
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

    // Direct save that bypasses global Zod validation,
    // allowing each tab to save independently
    async function savePartial() {
        try {
            const values = form.getValues()
            await updateSettings(values)
            toast.success("Settings saved successfully")
        } catch (error) {
            toast.error("Failed to save settings")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="company" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                        <TabsTrigger value="company">Company details</TabsTrigger>
                        <TabsTrigger value="bank">Bank Details</TabsTrigger>
                        <TabsTrigger value="app">App settings</TabsTrigger>
                        <TabsTrigger value="users">User Management</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="company" className="space-y-4">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <FormLabel>{form.watch("taxName") || "VAT"} Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="GB123456789" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Button type="button" onClick={savePartial}>Save Company Details</Button>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Button type="button" onClick={savePartial}>Save Bank Details</Button>
                    </TabsContent>

                    <TabsContent value="app" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>App Settings</CardTitle>
                                <CardDescription>Configure application-wide preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Operating Country</FormLabel>
                                            <Select 
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    const config = getCountryConfig(value);
                                                    form.setValue("currencySymbol", config.currencySymbol);
                                                    form.setValue("taxName", config.taxName);
                                                    form.setValue("defaultVatRate", config.defaultTaxRate);
                                                }} 
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countryConfigs.map((config) => (
                                                        <SelectItem key={config.country} value={config.country}>
                                                            {config.country}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="currencySymbol"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Currency Symbol</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="taxName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="defaultVatRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default Tax Rate (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Button type="button" onClick={savePartial}>Save App Settings</Button>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>Manage user access and permissions for your team.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                    User management features will be implemented here.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
