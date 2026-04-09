"use client"

import { useState, useEffect } from "react"
import { Product } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createInvoice } from "@/actions/invoices"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface POSInterfaceProps {
    products: Product[]
    currencySymbol?: string
    taxName?: string
    defaultTaxRate?: number
}

interface CartItem extends Product {
    quantity: number
}

export function POSInterface({ products, currencySymbol = "£", taxName = "Tax", defaultTaxRate = 20 }: POSInterfaceProps) {
    const [search, setSearch] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    )

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const vatTotal = subTotal * (defaultTaxRate / 100)
    const total = subTotal + vatTotal

    const handleCheckout = async () => {
        if (cart.length === 0) return
        setLoading(true)

        try {
            await createInvoice({
                date: new Date(),
                dueDate: new Date(),
                status: "PAID",
                items: cart.map(item => ({
                    description: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    vatRate: defaultTaxRate
                }))
            })
            toast.success("Transaction completed!")
            setCart([])
        } catch (error) {
            toast.error("Transaction failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
            {/* Product Grid */}
            <div className="col-span-8 flex flex-col h-full space-y-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products or scan barcode..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>

                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-3 gap-4 pb-4">
                        {filteredProducts.map(product => (
                            <Card
                                key={product.id}
                                className="cursor-pointer hover:border-indigo-500 transition-all hover:shadow-md"
                                onClick={() => addToCart(product)}
                            >
                                <CardContent className="p-4 flex flex-col justify-between h-32">
                                    <div>
                                        <h3 className="font-semibold truncate" title={product.name}>{product.name}</h3>
                                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="font-bold text-lg text-indigo-600">{formatCurrency(product.price, currencySymbol)}</div>
                                        <div className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} in stock
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Cart */}
            <div className="col-span-4 flex flex-col h-full bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50">
                    <h2 className="font-semibold flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Current Order
                    </h2>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
                            <ShoppingCart className="h-12 w-12" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <div className="font-medium text-sm truncate">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{formatCurrency(item.price, currencySymbol)}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50/50 space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(subTotal, currencySymbol)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{taxName} ({defaultTaxRate}%)</span>
                            <span>{formatCurrency(vatTotal, currencySymbol)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t text-gray-900">
                            <span>Total</span>
                            <span>{formatCurrency(total, currencySymbol)}</span>
                        </div>
                    </div>
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all"
                        disabled={cart.length === 0 || loading}
                        onClick={handleCheckout}
                    >
                        {loading ? "Processing..." : (
                            <>
                                <CreditCard className="mr-2 h-5 w-5" /> Pay Now
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
