export const countryConfigs = [
    {
        country: "United Kingdom",
        currencySymbol: "£",
        taxName: "VAT",
        defaultTaxRate: 20,
    },
    {
        country: "India",
        currencySymbol: "₹",
        taxName: "GST",
        defaultTaxRate: 18,
    },
    {
        country: "United States",
        currencySymbol: "$",
        taxName: "Sales Tax",
        defaultTaxRate: 0,
    },
    {
        country: "Canada",
        currencySymbol: "C$",
        taxName: "GST",
        defaultTaxRate: 5,
    },
    {
        country: "Australia",
        currencySymbol: "A$",
        taxName: "GST",
        defaultTaxRate: 10,
    },
    {
        country: "European Union",
        currencySymbol: "€",
        taxName: "VAT",
        defaultTaxRate: 20,
    }
];

export function getCountryConfig(country: string) {
    return countryConfigs.find(c => c.country === country) || countryConfigs[0];
}
