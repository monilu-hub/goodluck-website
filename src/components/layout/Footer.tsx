"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="relative h-10 w-32">
            <Image
              src="/brand/logo.webp"
              alt="GoodLuck"
              fill
              className="object-contain object-left"
              sizes="128px"
            />
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{t("tagline")}</p>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">{t("home.collections")}</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <Link href="/catalogo" className="hover:text-accent">
                {t("nav.catalog")}
              </Link>
            </li>
            <li>
              <Link href="/disenar" className="hover:text-accent">
                {t("nav.design")}
              </Link>
            </li>
            <li>
              <Link href="/colecciones/dia-del-padre-2026" className="hover:text-accent">
                Día del Padre
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">Colombia</p>
          <p className="mt-3 text-muted">
            COP / USD · ES / EN · Envíos a toda Colombia.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} GoodLuck
      </div>
    </footer>
  );
}
