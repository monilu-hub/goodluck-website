"use client";

import { formatMoney } from "@/lib/currency";
import { usePrefsStore } from "@/stores/prefs-store";

export function useMoney() {
  const currency = usePrefsStore((s) => s.currency);
  const locale = usePrefsStore((s) => s.locale);

  return {
    currency,
    locale,
    format: (amountCop: number) => formatMoney(amountCop, currency, locale),
  };
}
