"use client";

import { useEffect, useState } from "react";
import { getClients } from "@/services/clients";
import { ClientDialog } from "@/components/main/ClientDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const clientsData = await getClients();
                setClients(clientsData);
            } catch (error) {
                console.error("Failed to load clients:", error);
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
        <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Clients</h2>
                    <p className="text-slate-500 font-medium text-lg">Manage and organize your client relationships.</p>
                </div>
                <ClientDialog mode="create" />
            </div>

            <Card className="glass-card border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-900 text-white">
                            <TableRow className="hover:bg-transparent border-0">
                                <TableHead className="py-5 pl-6 font-bold uppercase tracking-widest text-[10px]">Name</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Email</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Phone</TableHead>
                                <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Address</TableHead>
                                <TableHead className="py-5 pr-6 text-right font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-24 text-slate-400">
                                        <Users className="mx-auto h-12 w-12 opacity-10 mb-4" />
                                        <p className="text-lg font-bold">No clients found. Add your first client to start billing.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                            {clients.map((client: any) => (
                                <TableRow key={client.id} className="hover:bg-white/50 border-slate-50 transition-all duration-200 group">
                                    <TableCell className="font-extrabold text-slate-900 pl-6 py-5">{client.name}</TableCell>
                                    <TableCell className="text-slate-500 font-bold py-5">{client.email || "-"}</TableCell>
                                    <TableCell className="text-slate-500 font-bold py-5">{client.phone || "-"}</TableCell>
                                    <TableCell className="text-slate-500 font-bold py-5 truncate max-w-[200px]">{client.address || "-"}</TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <ClientDialog client={client} mode="edit" trigger={
                                            <Button variant="ghost" className="h-9 px-4 rounded-xl font-bold text-slate-600 hover:text-primary hover:bg-primary/5 transition-all">
                                                Edit Profile
                                            </Button>
                                        } />
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
