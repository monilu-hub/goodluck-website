"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="relative h-11 w-40">
            <Image
              src="/brand/logo.png"
              alt="GoodLuck"
              fill
              className="object-contain object-left"
              sizes="160px"
            />
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{t("tagline")}</p>
          <p className="mt-4 text-xs text-muted">{t("footer.colombia")}</p>
        </div>

        <div className="text-sm">
          <p className="font-display font-semibold text-ink">{t("footer.explore")}</p>
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
              <Link href="/quiz" className="hover:text-accent">
                {t("nav.discover")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-accent">
                {t("nav.blog")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-display font-semibold text-ink">{t("footer.help")}</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <Link href="/preguntas-frecuentes" className="hover:text-accent">
                {t("nav.faq")}
              </Link>
            </li>
            <li>
              <Link href="/colecciones/ss26" className="hover:text-accent">
                {t("nav.ss26")}
              </Link>
            </li>
            <li>
              <Link href="/colecciones/mundial-fifa26" className="hover:text-accent">
                {t("nav.mundial")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-display font-semibold text-ink">{t("footer.legal")}</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <Link href="/terminos" className="hover:text-accent">
                {t("legal.termsTitle")}
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:text-accent">
                {t("legal.privacyTitle")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} GoodLuck · Colombia
      </div>
    </footer>
  );
}
