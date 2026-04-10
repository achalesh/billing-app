"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getSettings } from "@/services/settings";
import { POSInterface } from "@/components/shop/POSInterface";
import { Loader2 } from "lucide-react";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [productsData, settingsData] = await Promise.all([
                    getProducts(),
                    getSettings()
                ]);
                setProducts(productsData);
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load shop data:", error);
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

    return (
        <div className="p-6 h-screen bg-gray-100/50 overflow-hidden text-slate-900">
            <POSInterface 
                products={products} 
                currencySymbol={settings?.currencySymbol ?? "£"} 
                taxName={settings?.taxName ?? "Tax"}
                defaultTaxRate={settings?.defaultVatRate ?? 20}
            />
        </div>
    );
}
