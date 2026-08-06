import { notFound } from "next/navigation";
import { DesignerStudio } from "@/components/designer/DesignerStudio";
import {
  getCustomizableProducts,
  getProductBySlug,
} from "@/lib/catalog";

type Props = {
  params: Promise<{ productSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DisenarProductoPage({
  params,
  searchParams,
}: Props) {
  const { productSlug } = await params;
  const query = await searchParams;
  const product = getProductBySlug(productSlug);
  if (!product || !product.isCustomizable) notFound();

  const products = getCustomizableProducts();
  const color =
    typeof query.color === "string" ? query.color : product.colors[0];
  const size = typeof query.size === "string" ? query.size : "M";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Personalizar {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted">{product.description}</p>
      </div>
      <DesignerStudio
        products={products}
        initialSlug={product.slug}
        initialColor={color}
        initialSize={size}
      />
    </div>
  );
}
