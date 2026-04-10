"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/services/settings";
import { ProductForm } from "@/components/inventory/ProductForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    const currencySymbol = settings?.currencySymbol ?? "£";

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen text-slate-900">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <Button asChild variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-indigo-600">
                        <Link href="/products" className="flex items-center">
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Products
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">New Product</h2>
                    <p className="text-slate-500 font-medium mt-1">Add a new item to your product catalog.</p>
                </div>

                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden glass-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-black">Product Details</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Enter the information for the new product. This will be available in the POS and Invoices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ProductForm currencySymbol={currencySymbol} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
