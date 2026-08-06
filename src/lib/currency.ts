export type CurrencyCode = "COP" | "USD";
export type LocaleCode = "es" | "en";

const DEFAULT_USD_RATE = Number(process.env.NEXT_PUBLIC_USD_RATE || "0.00025");

export function getUsdRate() {
  return DEFAULT_USD_RATE > 0 ? DEFAULT_USD_RATE : 0.00025;
}

/** Convert COP cents/units to display currency. Prices are stored in COP. */
export function convertFromCop(amountCop: number, currency: CurrencyCode) {
  if (currency === "USD") {
    return Math.round(amountCop * getUsdRate() * 100) / 100;
  }
  return amountCop;
}

export function formatMoney(
  amountCop: number,
  currency: CurrencyCode = "COP",
  locale: LocaleCode = "es",
) {
  const value = convertFromCop(amountCop, currency);
  const localeTag = locale === "en" ? "en-US" : "es-CO";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "COP" ? 0 : 2,
  }).format(value);
}
