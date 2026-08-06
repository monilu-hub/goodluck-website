import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  filterProducts,
  getCollectionBySlug,
  getCollections,
} from "@/lib/catalog";

export const revalidate = 3600;

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const { items } = filterProducts({ collection: slug, pageSize: 50 });

  return (
    <div>
      <section className="relative min-h-[48vh] overflow-hidden sm:min-h-[56vh]">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl items-end px-4 pb-12 sm:min-h-[56vh] sm:px-6">
          <div className="text-surface">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {collection.name}
            </h1>
            <p className="mt-3 max-w-lg text-sm text-surface/85">
              {collection.description}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
