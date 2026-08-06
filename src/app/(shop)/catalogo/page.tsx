import Link from "next/link";
import { Suspense } from "react";
import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { filterProducts } from "@/lib/catalog";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const result = filterProducts({
    collection: typeof params.collection === "string" ? params.collection : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    color: typeof params.color === "string" ? params.color : undefined,
    gender: typeof params.gender === "string" ? params.gender : undefined,
    q: typeof params.q === "string" ? params.q : undefined,
    page,
    pageSize: 12,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Catálogo</h1>
        <p className="mt-2 text-sm text-muted">
          {result.total} producto{result.total === 1 ? "" : "s"}
        </p>
      </div>

      <Suspense fallback={<div className="h-20 animate-pulse rounded-xl bg-border/40" />}>
        <FilterBar />
      </Suspense>

      <div className="mt-10">
        <ProductGrid products={result.items} />
      </div>

      {result.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const next = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
              if (typeof v === "string") next.set(k, v);
            });
            next.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/catalogo?${next.toString()}`}
                className={`min-w-10 rounded-md px-3 py-2 text-center text-sm ${
                  p === result.page
                    ? "bg-ink text-surface"
                    : "border border-border bg-surface text-ink"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
