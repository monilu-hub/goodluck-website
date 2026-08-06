"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { usePrefsStore } from "@/stores/prefs-store";
import type { LocaleCode } from "@/lib/currency";

type Messages = typeof es;

const dict: Record<LocaleCode, Messages> = { es, en };

type I18nContextValue = {
  locale: LocaleCode;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(messages: Messages, path: string): string {
  const parts = path.split(".");
  let cur: unknown = messages;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof cur === "string" ? cur : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = usePrefsStore((s) => s.locale);
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (path, vars) => {
        let text = lookup(dict[locale] ?? es, path);
        if (vars) {
          Object.entries(vars).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      },
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within I18nProvider");
  return ctx;
}
