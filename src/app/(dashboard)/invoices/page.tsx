"use client";

import { useEffect, useState } from "react";
import { getInvoices } from "@/services/invoices";
import { getSettings } from "@/services/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { Plus, ArrowUpRight, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [invoicesData, settingsData] = await Promise.all([
                    getInvoices(),
                    getSettings()
                ]);
                setInvoices(invoicesData);
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load invoices:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const currencySymbol = settings?.currencySymbol ?? "£";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Invoices</h2>
                    <p className="text-slate-500 font-medium text-lg">Manage and track your business transactions.</p>
                </div>
                <Link href="/invoices/new">
                    <Button className="rounded-xl px-6 premium-gradient text-white border-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> New Invoice
                    </Button>
                </Link>
            </div>

            <Card className="glass-card border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-900 text-white">
                            <TableRow className="hover:bg-transparent border-0">
                                <TableHead className="pl-6 py-5 font-bold uppercase tracking-widest text-[10px]">Invoice #</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Date</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Client</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                                <TableHead className="text-right py-5 font-bold uppercase tracking-widest text-[10px]">Total</TableHead>
                                <TableHead className="text-right pr-6 py-5 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-24 text-slate-400">
                                        <FileText className="mx-auto h-12 w-12 opacity-10 mb-4" />
                                        <p className="text-lg font-bold">No invoices found. Create one to get started.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id} className="hover:bg-white/50 border-slate-50 transition-all duration-200 group">
                                    <TableCell className="font-extrabold text-slate-900 pl-6 py-5 tabular-nums">
                                        {invoice.invoice_number || invoice.invoiceNumber}
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-bold py-5">
                                        {invoice.created_at ? format(new Date(invoice.created_at), "dd MMM yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-slate-900 font-black py-5">
                                        {invoice.client?.name ?? "Walk-in"}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                                            invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                                            invoice.status === 'DRAFT' ? 'bg-slate-50 text-slate-600 ring-slate-200' :
                                            'bg-amber-50 text-amber-700 ring-amber-200'
                                        }`}>
                                            {invoice.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-slate-900 py-5 text-lg tabular-nums">
                                        {formatCurrency(invoice.total, currencySymbol)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <Link
                                            href={`/invoices/view?id=${invoice.id}`}
                                            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md shadow-slate-900/10"
                                        >
                                            View <ArrowUpRight className="h-3 w-3" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
