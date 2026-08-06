import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  getCollections,
  getFeaturedProducts,
} from "@/lib/catalog";

export const revalidate = 3600;

export default function HomePage() {
  const collections = getCollections();
  const featured = getFeaturedProducts();

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="/products/mockups/camiseta-oversized-negro.svg"
          alt="GoodLuck SS26"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="animate-fade text-sm uppercase tracking-[0.35em] text-surface/80">
            GoodLuck
          </p>
          <h1 className="animate-rise mt-3 max-w-xl text-5xl font-semibold tracking-tight text-surface sm:text-6xl">
            Ropa con carácter
          </h1>
          <p className="animate-rise delay-100 mt-4 max-w-md text-base text-surface/85">
            Catálogo SS26, ediciones especiales y tu propio diseño en minutos.
          </p>
          <div className="animate-rise delay-200 mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-soft"
            >
              Ver catálogo
            </Link>
            <Link
              href="/disenar"
              className="rounded-full border border-surface/70 px-6 py-3 text-sm font-medium text-surface transition hover:bg-surface/10"
            >
              Diseñar ahora
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Colecciones</h2>
            <p className="mt-2 text-sm text-muted">
              Tres líneas activas, un mismo estándar.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((collection, i) => (
            <Link
              key={collection.id}
              href={`/colecciones/${collection.slug}`}
              className="group relative min-h-64 overflow-hidden animate-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Image
                src={collection.heroImage}
                alt={collection.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-ink/45 transition group-hover:bg-ink/55" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-surface">
                <h3 className="text-xl font-semibold">{collection.name}</h3>
                <p className="mt-1 text-sm text-surface/80">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-ink">Destacados</h2>
          <p className="mt-2 text-sm text-muted">
            Piezas listas para llevar o personalizar.
          </p>
        </div>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
