"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getSettings } from "@/services/settings";
import { ProductDialog } from "@/components/inventory/ProductDialog";
import { ProductActions } from "@/components/inventory/ProductActions";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Package, Loader2 } from "lucide-react";

export default function ProductsPage() {
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
                console.error("Failed to load products:", error);
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
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Inventory</h2>
                    <p className="text-slate-500 font-medium text-lg">Manage your products, pricing, and stock levels.</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline" className="rounded-xl border-slate-200 hover:bg-white/80 transition-all">
                        <Link href="/products/new">Advanced View</Link>
                    </Button>
                    <ProductDialog mode="create" currencySymbol={currencySymbol} />
                </div>
            </div>

            <Card className="glass-card border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-900 text-white">
                            <TableRow className="hover:bg-transparent border-0">
                                <TableHead className="pl-6 py-5 font-bold uppercase tracking-widest text-[10px]">Product Info</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">SKU / ID</TableHead>
                                <TableHead className="text-right py-5 font-bold uppercase tracking-widest text-[10px]">Unit Price</TableHead>
                                <TableHead className="text-right py-5 font-bold uppercase tracking-widest text-[10px]">Stock Status</TableHead>
                                <TableHead className="text-right pr-6 py-5 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-24 text-slate-400">
                                        <Package className="mx-auto h-12 w-12 opacity-10 mb-4" />
                                        <p className="text-lg font-bold">Your inventory is empty.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            {products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-white/50 border-slate-50 transition-all duration-200 group">
                                    <TableCell className="pl-6 py-5">
                                        <div className="font-extrabold text-slate-900 text-base">{product.name}</div>
                                        {product.description && <div className="text-xs text-slate-400 font-bold truncate max-w-[300px]">{product.description}</div>}
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-bold py-5 tabular-nums">
                                        {product.sku || product.id.substring(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-right font-black text-slate-900 py-5 text-lg tabular-nums">
                                        {formatCurrency(product.price, currencySymbol)}
                                    </TableCell>
                                    <TableCell className="text-right py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                                            (product.stock || 0) > 10 ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 
                                            (product.stock || 0) > 0 ? 'bg-amber-50 text-amber-700 ring-amber-200' : 
                                            'bg-rose-50 text-rose-700 ring-rose-200'
                                        }`}>
                                            {(product.stock || 0)} Units
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <ProductActions product={product} currencySymbol={currencySymbol} />
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
