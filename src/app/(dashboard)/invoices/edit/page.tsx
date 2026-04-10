"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getInvoice } from "@/services/invoices";
import { getClients } from "@/services/clients";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { Loader2 } from "lucide-react";

function EditInvoiceContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [invoice, setInvoice] = useState<any>(null);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function loadData() {
            try {
                const [invoiceData, clientsData] = await Promise.all([
                    getInvoice(id as string),
                    getClients()
                ]);
                setInvoice(invoiceData);
                setClients(clientsData);
            } catch (error) {
                console.error("Failed to load edit page data:", error);
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

    // Transform invoice data to match form values
    const formattedInvoice: any = {
        ...invoice,
        items: invoice.items?.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unit_price || item.unitPrice),
            vatRate: Number(item.vat_rate || item.vatRate)
        }))
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Edit Invoice</h2>
                        <p className="text-slate-500 font-medium mt-1">Update invoice details and items.</p>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-8">
                    <InvoiceForm clients={clients} initialData={formattedInvoice} />
                </div>
            </div>
        </div>
    );
}

export default function EditInvoicePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50/30"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <EditInvoiceContent />
        </Suspense>
    );
}
