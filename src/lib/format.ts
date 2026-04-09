/**
 * Formats an amount with a given currency symbol.
 * Uses Intl.NumberFormat for proper decimal/thousands formatting,
 * but injects the custom symbol to support non-Intl currencies like ₹, C$, etc.
 */
export function formatCurrency(amount: number, currencySymbol: string = "£"): string {
    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
    return `${currencySymbol}${formatted}`
}
