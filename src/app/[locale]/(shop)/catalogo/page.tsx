import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Link } from "@/i18n/navigation";
import { filterProducts } from "@/lib/catalog";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogoPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "catalog" });
  const query = await searchParams;
  const page = Number(query.page ?? "1") || 1;
  const result = filterProducts({
    collection:
      typeof query.collection === "string" ? query.collection : undefined,
    type: typeof query.type === "string" ? query.type : undefined,
    color: typeof query.color === "string" ? query.color : undefined,
    gender: typeof query.gender === "string" ? query.gender : undefined,
    q: typeof query.q === "string" ? query.q : undefined,
    page,
    pageSize: 12,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {result.total === 1
            ? t("products", { count: result.total })
            : t("products_plural", { count: result.total })}
        </p>
      </div>

      <Suspense
        fallback={<div className="h-20 animate-pulse rounded-xl bg-border/40" />}
      >
        <FilterBar />
      </Suspense>

      <div className="mt-10">
        {result.items.length ? (
          <ProductGrid products={result.items} />
        ) : (
          <p className="text-sm text-muted">{t("empty")}</p>
        )}
      </div>

      {result.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const next = new URLSearchParams();
            Object.entries(query).forEach(([k, v]) => {
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
