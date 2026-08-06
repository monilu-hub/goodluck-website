"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { formatCop } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { ColorSwatch } from "./ColorSwatch";
import { SizeSelector } from "./SizeSelector";

export function AddToCartPanel({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0] ?? "M");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const image =
    product.images.find((i) => i.color === color)?.url ??
    product.variants.find((v) => v.color === color)?.imageUrl ??
    product.images[0]?.url ??
    "";

  const variant = useMemo(
    () => product.variants.find((v) => v.color === color && v.size === size),
    [product.variants, color, size],
  );

  function handleAdd() {
    if (!variant) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      color,
      size,
      priceCop: variant.priceCop,
      imageUrl: image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft/30">
        <Image
          src={image}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {product.collectionSlug}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {formatCop(variant?.priceCop ?? product.basePriceCop)}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/80">
            {product.description}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Color · {color}</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <ColorSwatch
                key={c}
                color={c}
                selected={c === color}
                onSelect={setColor}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Talla</p>
          <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!variant}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition hover:bg-accent disabled:opacity-50"
          >
            {added ? "Añadido ✓" : "Añadir al carrito"}
          </button>
          {product.isCustomizable && (
            <Link
              href={`/disenar/${product.slug}?color=${encodeURIComponent(color)}&size=${size}`}
              className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-surface"
            >
              Personalizar
            </Link>
          )}
        </div>
        {variant && (
          <p className="text-xs text-muted">
            Stock: {variant.stock} · SKU {variant.sku}
          </p>
        )}
      </div>
    </div>
  );
}
