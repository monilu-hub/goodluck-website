"use client";

import { useTranslations } from "next-intl";
import { useCallback, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

const KEY = "goodluck-cookie-consent";
const EVENT = "goodluck-cookie-consent-change";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getConsent(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const t = useTranslations("cookies");
  const consent = useSyncExternalStore(subscribe, getConsent, () => "ssr");
  const visible = consent === null;

  const save = useCallback((value: "all" | "necessary") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-base font-semibold text-ink">{t("title")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("body")}</p>
          <Link
            href="/privacidad"
            className="mt-2 inline-block text-sm text-accent underline underline-offset-2"
          >
            {t("more")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => save("necessary")}
            className="rounded-full border border-border px-5 py-2.5 text-sm text-ink"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
