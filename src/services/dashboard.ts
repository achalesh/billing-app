import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const { data: revenueData, error: revenueError } = await supabase
    .from('invoices')
    .select('total')
    .eq('status', 'PAID');

  const { data: outstandingData, error: outstandingError } = await supabase
    .from('invoices')
    .select('total')
    .in('status', ['SENT', 'OVERDUE']);

  const { count: activeClientsCount, error: clientsError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  const { count: invoiceCount, error: invoiceError } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true });

  const { data: recentInvoices, error: recentError } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })
    .limit(5);

  if (revenueError || outstandingError || clientsError || invoiceError || recentError) {
    console.error('Supabase error:', { revenueError, outstandingError, clientsError, invoiceError, recentError });
  }

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
  const outstanding = outstandingData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

  return {
    totalRevenue,
    outstanding,
    activeClients: activeClientsCount || 0,
    totalInvoices: invoiceCount || 0,
    recentInvoices: recentInvoices || []
  };
}
