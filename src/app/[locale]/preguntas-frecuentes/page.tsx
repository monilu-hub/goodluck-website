import { setRequestLocale, getTranslations } from "next-intl/server";
import { FAQ_ITEMS } from "../../../../data/faq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const loc = locale as "es" | "en";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-10 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q.es}
            className="group border border-border bg-surface/60 px-4 py-3 open:bg-surface"
          >
            <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {item.q[loc]}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a[loc]}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
