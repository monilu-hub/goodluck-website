"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { CurrencyCode, LocaleCode } from "@/lib/currency";
import { useCartStore } from "@/stores/cart-store";
import { usePrefsStore } from "@/stores/prefs-store";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale() as LocaleCode;
  const pathname = usePathname();
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const currency = usePrefsStore((s) => s.currency);
  const setCurrency = usePrefsStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const [openForPath, setOpenForPath] = useState(pathname);

  if (openForPath !== pathname) {
    setOpenForPath(pathname);
    if (open) setOpen(false);
  }

  const links = [
    { href: "/catalogo", label: t("catalog") },
    { href: "/colecciones/ss26", label: t("ss26") },
    { href: "/blog", label: t("blog") },
    { href: "/quiz", label: t("discover") },
    { href: "/disenar", label: t("design") },
  ] as const;

  function switchLocale(next: LocaleCode) {
    router.replace(pathname, { locale: next });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="relative flex h-11 w-36 shrink-0 items-center sm:w-40">
          <Image
            src="/brand/logo.png"
            alt="GoodLuck"
            fill
            className="object-contain object-left"
            sizes="160px"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-sm sm:gap-3">
          <label className="hidden items-center gap-1 text-xs text-muted sm:flex">
            <span className="sr-only">{tCommon("language")}</span>
            <select
              value={locale}
              onChange={(e) => switchLocale(e.target.value as LocaleCode)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-ink"
              aria-label={tCommon("language")}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </label>
          <label className="hidden items-center gap-1 text-xs text-muted sm:flex">
            <span className="sr-only">{tCommon("currency")}</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-ink"
              aria-label={tCommon("currency")}
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <Link href="/cuenta/login" className="hidden text-muted hover:text-ink sm:inline">
            {t("account")}
          </Link>
          <Link
            href="/checkout"
            className="rounded-full bg-ink px-3 py-1.5 text-surface transition hover:bg-accent"
          >
            <span suppressHydrationWarning>
              {t("cart")} ({count})
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t("menu")}</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-4 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-4 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-base text-ink">
                {link.label}
              </Link>
            ))}
            <Link href="/cuenta/login" className="text-base text-ink">
              {t("account")}
            </Link>
          </nav>
          <div className="mt-4 flex gap-3">
            <select
              value={locale}
              onChange={(e) => switchLocale(e.target.value as LocaleCode)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2"
              aria-label={tCommon("language")}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2"
              aria-label={tCommon("currency")}
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
