"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode, LocaleCode } from "@/lib/currency";

type PrefsState = {
  locale: LocaleCode;
  currency: CurrencyCode;
  setLocale: (locale: LocaleCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
};

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      locale: "es",
      currency: "COP",
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "goodluck-prefs" },
  ),
);
