import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { DesignerLazy } from "@/components/designer/DesignerLazy";
import { getCustomizableProducts } from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "designer" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function DisenarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "designer" });
  const products = getCustomizableProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("subtitle")}</p>
      </div>
      <DesignerLazy products={products} />
    </div>
  );
}
