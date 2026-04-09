"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, Settings, Menu, Package, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

// ... imports

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Clients",
        icon: Users,
        href: "/clients",
        color: "text-violet-500",
    },
    {
        label: "Invoices",
        icon: FileText,
        href: "/invoices",
        color: "text-pink-700",
    },
    {
        label: "Products",
        icon: Package,
        href: "/products",
        color: "text-emerald-500",
    },
    {
        label: "Shop (POS)",
        icon: ShoppingCart,
        href: "/shop",
        color: "text-orange-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-gray-400",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/5 text-white print:hidden">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-3">
                        <Image 
                            src="/logo.png" 
                            alt="Adrinix Logo" 
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        Adrinix
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition duration-200",
                                pathname === route.href ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-4 border-t border-white/5 mx-3">
                <div className="flex items-center gap-x-2 text-xs text-zinc-500 pl-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>System Online</span>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    // Using primitive Sheet to avoid SSR hydration mismatches if possible, 
    // but here we just update styles.
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden print:hidden">
                    <Menu className="text-white" /> {/* Ensure menu icon is visible on dark bg */}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-none w-72">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
