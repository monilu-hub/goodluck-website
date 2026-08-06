"use client";

import { useEffect } from "react";
import type { LocaleCode } from "@/lib/currency";
import { usePrefsStore } from "@/stores/prefs-store";

export function PrefsSync({ locale }: { locale: LocaleCode }) {
  const setLocale = usePrefsStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(locale);
    document.documentElement.lang = locale;
  }, [locale, setLocale]);

  return null;
}
