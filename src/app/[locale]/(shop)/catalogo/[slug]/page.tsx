import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/catalog/AddToCartPanel";
import { getAllProducts, getProductBySlug } from "@/lib/catalog";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product?.name ?? "Producto",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AddToCartPanel product={product} />
    </div>
  );
}
