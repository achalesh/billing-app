import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, Activity, ArrowUpRight, CreditCard } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { formatCurrency } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const stats = await getDashboardStats()

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your business performance.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/invoices">View Invoices</Link>
          </Button>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/invoices">Create New</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +2
              </span>
              new this month
            </p>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.outstanding)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid invoices
            </p>
          </CardContent>
        </Card>
        <Card className="border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime generated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 border-indigo-50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentInvoices.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                        {invoice.client.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{invoice.client.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        invoice.status === 'DRAFT' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                      {invoice.status}
                    </div>
                    <div className="font-bold text-gray-900 w-24 text-right">{formatCurrency(invoice.total)}</div>
                  </div>
                </div>
              ))}
              {stats.recentInvoices.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <CreditCard className="mx-auto h-10 w-10 opacity-20 mb-3" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
