import { getClients } from "@/actions/clients"
import { ClientDialog } from "@/components/main/ClientDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Client } from "@prisma/client"
import { Plus, Search } from "lucide-react" // Search icon for future use or visual decoration
import { Input } from "@/components/ui/input"

export default async function ClientsPage() {
    const clients = await getClients()

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Clients</h2>
                    <p className="text-muted-foreground mt-1">Manage your client base.</p>
                </div>
                <ClientDialog mode="create" />
            </div>

            <Card className="border-indigo-50 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-b border-gray-100">
                                <TableHead className="py-4 pl-6">Name</TableHead>
                                <TableHead className="py-4">Email</TableHead>
                                <TableHead className="py-4">Phone</TableHead>
                                <TableHead className="py-4">VAT Number</TableHead>
                                <TableHead className="py-4 pr-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No clients found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                            {clients.map((client: Client) => (
                                <TableRow key={client.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                    <TableCell className="font-semibold text-gray-900 pl-6 py-4">{client.name}</TableCell>
                                    <TableCell className="text-gray-600 py-4">{client.email || "-"}</TableCell>
                                    <TableCell className="text-gray-600 py-4">{client.phone || "-"}</TableCell>
                                    <TableCell className="text-gray-600 py-4">{client.vatNumber || "-"}</TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <ClientDialog client={client} mode="edit" trigger={
                                            <span className="font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline transition-colors">
                                                Edit
                                            </span>
                                        } />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
