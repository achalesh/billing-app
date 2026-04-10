"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, Activity, ArrowUpRight, CreditCard, Loader2 } from "lucide-react";
import { getDashboardStats } from "@/services/dashboard";
import { getSettings } from "@/services/settings";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, settingsData] = await Promise.all([
          getDashboardStats(),
          getSettings()
        ]);
        setStats(statsData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Welcome back, <span className="text-primary">Adrinix</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">Your business intelligence for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl border-slate-200 hover:bg-white/80 transition-all">
            <Link href="/invoices">View Invoices</Link>
          </Button>
          <Button asChild className="rounded-xl px-6 premium-gradient text-white border-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Link href="/invoices/new">New Invoice</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card rounded-2xl border-0 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Total Revenue</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <DollarSign className="h-5 w-5 text-emerald-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(stats.totalRevenue, currencySymbol)}</div>
            <div className="flex items-center mt-2">
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +20%
              </span>
              <span className="text-xs text-slate-400 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Active Clients</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
              <Users className="h-5 w-5 text-violet-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeClients}</div>
            <div className="flex items-center mt-2 text-xs font-bold text-slate-500">
              Tracking {stats.activeClients} relationships
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Outstanding</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <FileText className="h-5 w-5 text-amber-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-600 tracking-tight">{formatCurrency(stats.outstanding, currencySymbol)}</div>
            <div className="flex items-center mt-2 text-xs font-bold text-slate-500">
              Collection required
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Invoices</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Activity className="h-5 w-5 text-blue-600 group-hover:text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalInvoices}</div>
            <div className="flex items-center mt-2 text-xs font-bold text-slate-500">
              Across all lifecycles
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0 rounded-3xl p-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentInvoices.map((invoice: any) => (
              <div key={invoice.id} className="flex items-center justify-between p-5 bg-white/50 border border-slate-100/50 rounded-2xl hover:bg-white hover:scale-[1.01] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xl shadow-slate-900/20">
                    {invoice.client?.name.substring(0, 1).toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">{invoice.client?.name || "Client"}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{invoice.invoiceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    href={`/invoices/view?id=${invoice.id}`}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold ring-1 ring-inset ${
                    invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                    invoice.status === 'DRAFT' ? 'bg-slate-50 text-slate-600 ring-slate-200' :
                    'bg-amber-50 text-amber-700 ring-amber-200'
                  }`}>
                    {invoice.status}
                  </Link>
                  <div className="font-black text-slate-900 text-lg tabular-nums">
                    {formatCurrency(invoice.total, currencySymbol)}
                  </div>
                </div>
              </div>
            ))}
            {stats.recentInvoices.length === 0 && (
              <div className="text-center py-16 text-slate-300 space-y-4">
                <CreditCard className="mx-auto h-16 w-16 opacity-10" />
                <p className="font-bold text-lg">Your activity will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
