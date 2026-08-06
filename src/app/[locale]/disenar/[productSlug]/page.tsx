import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DesignerLazy } from "@/components/designer/DesignerLazy";
import {
  getCustomizableProducts,
  getProductBySlug,
} from "@/lib/catalog";

type Props = {
  params: Promise<{ locale: string; productSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DisenarProductoPage({
  params,
  searchParams,
}: Props) {
  const { locale, productSlug } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const product = getProductBySlug(productSlug);
  if (!product || !product.isCustomizable) notFound();

  const products = getCustomizableProducts();
  const color =
    typeof query.color === "string" ? query.color : product.colors[0];
  const size = typeof query.size === "string" ? query.size : "M";
  const frase =
    typeof query.frase === "string" ? query.frase : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted">{product.description}</p>
      </div>
      <DesignerLazy
        products={products}
        initialSlug={product.slug}
        initialColor={color}
        initialSize={size}
        initialPhrase={frase}
      />
    </div>
  );
}
