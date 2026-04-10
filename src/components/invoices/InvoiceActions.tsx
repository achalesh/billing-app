"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteInvoice, updateInvoiceStatus } from "@/services/invoices"
import { Edit, MoreVertical, Trash, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface InvoiceActionsProps {
    id: string
    status: string
}

export function InvoiceActions({ id, status }: InvoiceActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onDelete() {
        try {
            setIsLoading(true)
            await deleteInvoice(id)
            toast.success("Invoice deleted")
            router.push("/invoices")
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    async function onStatusUpdate(newStatus: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED") {
        try {
            setIsLoading(true)
            await updateInvoiceStatus(id, newStatus)
            toast.success("Status updated")
            window.location.reload()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        Change Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"].map((s) => (
                        <DropdownMenuItem
                            key={s}
                            onClick={() => onStatusUpdate(s as any)}
                            disabled={isLoading}
                        >
                            {s}
                            {status === s && <CheckCircle className="ml-2 h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" asChild>
                <Link href={`/invoices/edit?id=${id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Link>
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isLoading}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the invoice.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
