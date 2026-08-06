"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Product } from "@/types";
import { useMoney } from "@/hooks/useMoney";
import { colorHex } from "@/lib/colors";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("catalog");
  const { format } = useMoney();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const image =
    product.images[0]?.url ??
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp";
  const defaultColor = product.colors[0] ?? "";
  const defaultSize = product.sizes[1] ?? product.sizes[0] ?? "M";
  const variant = product.variants.find(
    (v) => v.color === defaultColor && v.size === defaultSize,
  );

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      color: defaultColor,
      size: defaultSize,
      priceCop: variant.priceCop,
      imageUrl: image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="group animate-rise">
      <Link href={`/catalogo/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft/40">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 bg-surface/90 px-2 py-1 text-[11px] uppercase tracking-wider text-ink">
            {product.collectionSlug}
          </span>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-sm font-medium text-ink">
              {product.name}
            </h3>
            <p className="text-sm text-muted">{format(product.basePriceCop)}</p>
          </div>
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 6).map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full border border-border"
                style={{ backgroundColor: colorHex(color) }}
                title={color}
              />
            ))}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={quickAdd}
        disabled={!variant}
        className="mt-3 w-full rounded-full border border-ink/20 bg-surface py-2.5 text-xs font-medium text-ink transition hover:border-ink hover:bg-ink hover:text-surface disabled:opacity-40 md:opacity-0 md:group-hover:opacity-100"
      >
        {added ? "✓" : t("quickAdd")}
      </button>
    </div>
  );
}
