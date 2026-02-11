import { getInvoices } from "@/actions/invoices"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { Plus, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default async function InvoicesPage() {
    const invoices = await getInvoices()

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Invoices</h2>
                    <p className="text-muted-foreground mt-1">Manage and track your invoices.</p>
                </div>
                <Link href="/invoices/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20">
                        <Plus className="mr-2 h-4 w-4" /> New Invoice
                    </Button>
                </Link>
            </div>

            <Card className="border-indigo-50 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-b border-gray-100">
                                <TableHead className="pl-6 py-4">Invoice #</TableHead>
                                <TableHead className="py-4">Date</TableHead>
                                <TableHead className="py-4">Client</TableHead>
                                <TableHead className="py-4">Status</TableHead>
                                <TableHead className="text-right py-4">Total</TableHead>
                                <TableHead className="text-right pr-6 py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No invoices found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors group">
                                    <TableCell className="font-semibold text-gray-900 pl-6 py-4">{invoice.invoiceNumber}</TableCell>
                                    <TableCell className="text-gray-600 py-4">{invoice.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-gray-900 font-medium py-4">{invoice.client.name}</TableCell>
                                    <TableCell className="py-4">
                                        <div className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                invoice.status === 'DRAFT' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                        )}>
                                            {invoice.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-gray-900 py-4">{formatCurrency(invoice.total)}</TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <Link
                                            href={`/invoices/${invoice.id}`}
                                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                                        >
                                            View <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </Link>
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
