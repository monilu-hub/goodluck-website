import { notFound } from "next/navigation";
import Image from "next/image";
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
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const { items } = filterProducts({ collection: slug, pageSize: 50 });

  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl items-end px-4 pb-12 sm:px-6">
          <div className="text-surface">
            <p className="text-xs uppercase tracking-[0.25em] text-surface/70">
              Colección
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
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
