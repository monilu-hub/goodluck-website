import { formatMoney, type CurrencyCode, type LocaleCode } from "./currency";

/** @deprecated Prefer formatMoney / useMoney for multicurrency UI */
export function formatCop(amount: number): string {
  return formatMoney(amount, "COP", "es");
}

export { formatMoney };
export type { CurrencyCode, LocaleCode };

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
