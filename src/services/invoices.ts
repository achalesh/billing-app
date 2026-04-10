import { supabase } from "@/lib/supabase";

export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false });

  if (error) console.error('Supabase error:', error);
  return data || [];
}

export async function getInvoice(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return null;
  }
  return data;
}

export async function createInvoice(data: any) {
  const { items, ...invoice } = data;
  
  // 1. Insert Invoice
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      ...invoice,
      invoice_number: `INV-${Date.now().toString().slice(-6)}`,
      total: 0 // Will update after items
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // 2. Insert Items
  let grandTotal = 0;
  const invoiceItems = items.map((item: any) => {
    const itemTotal = Number(item.quantity) * Number(item.unitPrice);
    const taxAmount = itemTotal * (Number(item.vatRate) / 100);
    const total = itemTotal + taxAmount;
    grandTotal += total;
    
    return {
      invoice_id: invoiceData.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_rate: item.vatRate,
      total: total
    };
  });

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(invoiceItems);

  if (itemsError) throw itemsError;

  // 3. Update Invoice Total
  await supabase
    .from('invoices')
    .update({ total: grandTotal })
    .eq('id', invoiceData.id);

  return invoiceData;
}

export async function updateInvoice(id: string, data: any) {
  const { items, ...invoice } = data;

  // 1. Update Invoice Basic Info
  const { error: invoiceError } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id);

  if (invoiceError) throw invoiceError;

  // 2. Clear Old Items
  const { error: deleteError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', id);

  if (deleteError) throw deleteError;

  // 3. Insert New Items
  let grandTotal = 0;
  const invoiceItems = items.map((item: any) => {
    const itemTotal = Number(item.quantity) * Number(item.unitPrice);
    const taxAmount = itemTotal * (Number(item.vatRate) / 100);
    const total = itemTotal + taxAmount;
    grandTotal += total;

    return {
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_rate: item.vatRate,
      total: total
    };
  });

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(invoiceItems);

  if (itemsError) throw itemsError;

  // 4. Update Invoice Total
  await supabase
    .from('invoices')
    .update({ total: grandTotal })
    .eq('id', id);
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
