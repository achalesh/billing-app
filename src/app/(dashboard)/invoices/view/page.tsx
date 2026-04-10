"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getInvoice } from "@/services/invoices";
import { getSettings } from "@/services/settings";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { PrintButton } from "@/components/invoices/PrintButton";
import { InvoiceActions } from "@/components/invoices/InvoiceActions";

function InvoiceContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [invoice, setInvoice] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function loadData() {
            try {
                const [invoiceData, settingsData] = await Promise.all([
                    getInvoice(id as string),
                    getSettings()
                ]);
                setInvoice(invoiceData);
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load invoice:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!invoice) return <div className="p-8 text-center text-slate-500 font-bold">Invoice not found.</div>;

    const currencySymbol = settings?.currencySymbol ?? "£";

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center print:hidden">
                    <h1 className="text-2xl font-bold text-slate-900">Invoice Details</h1>
                    <div className="flex gap-2">
                        <InvoiceActions id={invoice.id} status={invoice.status} />
                        <PrintButton />
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-10 print:shadow-none print:border-none" id="invoice-content">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-slate-900">INVOICE</h1>
                            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-sm">#{invoice.invoice_number || invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-black text-slate-900 text-lg">{settings?.companyName || "Adrinix Billing"}</h3>
                            <p className="text-slate-500 text-sm font-medium whitespace-pre-line mt-1">
                                {settings?.companyAddress}
                            </p>
                        </div>
                    </div>

                    {/* Client & Dates */}
                    <div className="grid grid-cols-2 gap-8 py-10 border-b border-slate-100">
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bill To</h4>
                            <p className="font-black text-slate-900 text-xl">{invoice.client?.name ?? "Customer"}</p>
                            <p className="text-slate-500 text-sm font-medium whitespace-pre-line mt-2">
                                {invoice.client?.address}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</h4>
                                <p className="text-slate-900 font-bold">{invoice.created_at ? format(new Date(invoice.created_at), "dd MMM yyyy") : "N/A"}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</h4>
                                <p className="text-slate-900 font-bold">{invoice.due_date ? format(new Date(invoice.due_date), "dd MMM yyyy") : "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="py-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 font-black text-slate-400 text-xs uppercase tracking-widest">Description</th>
                                    <th className="py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Qty</th>
                                    <th className="py-4 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoice.items?.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="py-5 text-sm font-bold text-slate-900">{item.description}</td>
                                        <td className="py-5 text-sm font-bold text-slate-500 text-right">{item.quantity}</td>
                                        <td className="py-5 text-base font-black text-slate-900 text-right tabular-nums">{formatCurrency(item.total, currencySymbol)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end border-t border-slate-100 pt-8">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-900 pt-4">
                                <span>Grand Total</span>
                                <span>{formatCurrency(invoice.total, currencySymbol)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50/30"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <InvoiceContent />
        </Suspense>
    );
}
