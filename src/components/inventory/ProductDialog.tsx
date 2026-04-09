"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Plus } from "lucide-react"
import { ProductForm } from "./ProductForm"

interface ProductDialogProps {
    product?: any
    mode?: "create" | "edit"
    trigger?: React.ReactNode
    currencySymbol?: string
}

export function ProductDialog({ product, mode = "create", trigger, currencySymbol = "£" }: ProductDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add Product" : "Edit Product"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Add a new product to your inventory."
                            : "Update product details."}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <ProductForm 
                        product={product} 
                        mode={mode} 
                        currencySymbol={currencySymbol} 
                        onSuccess={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
