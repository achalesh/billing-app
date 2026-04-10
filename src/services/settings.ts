import { supabase } from "@/lib/supabase";

/**
 * Maps database snake_case keys to application camelCase keys
 */
function mapFromStorage(data: any) {
  if (!data) return null;
  return {
    companyName: data.company_name,
    companyAddress: data.company_address,
    companyPhone: data.company_phone,
    companyEmail: data.company_email,
    currencySymbol: data.currency_symbol,
    defaultVatRate: data.tax_rate,
    vatNumber: data.vat_number,
    bankName: data.bank_name,
    sortCode: data.sort_code,
    accountNumber: data.account_number,
    invoiceTerms: data.invoice_terms,
    country: data.country,
    taxName: data.tax_name,
  };
}

/**
 * Maps application camelCase keys to database snake_case keys
 */
function mapToStorage(data: any) {
  return {
    id: 'settings',
    company_name: data.companyName,
    company_address: data.companyAddress,
    company_phone: data.companyPhone,
    company_email: data.companyEmail,
    currency_symbol: data.currencySymbol,
    tax_rate: data.defaultVatRate,
    vat_number: data.vatNumber,
    bank_name: data.bankName,
    sort_code: data.sortCode,
    account_number: data.accountNumber,
    invoice_terms: data.invoiceTerms,
    country: data.country,
    tax_name: data.taxName,
  };
}

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'settings')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase error:', error);
  }

  return mapFromStorage(data);
}

export async function updateSettings(data: any) {
  const payload = mapToStorage(data);
  const { error } = await supabase
    .from('settings')
    .upsert(payload);

  if (error) {
    console.error('Supabase error:', error);
    return { success: false, error };
  }

  return { success: true };
}
