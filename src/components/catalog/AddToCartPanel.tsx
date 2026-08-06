"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { useMoney } from "@/hooks/useMoney";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { ColorSwatch } from "./ColorSwatch";
import { SizeSelector } from "./SizeSelector";

export function AddToCartPanel({ product }: { product: Product }) {
  const t = useTranslations("catalog");
  const { format } = useMoney();
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0] ?? "M");
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const images = useMemo(() => {
    const colorImages = product.images.filter((i) => i.color === color);
    if (colorImages.length) return colorImages;
    return product.images.length
      ? product.images
      : [
          {
            url:
              product.variants.find((v) => v.color === color)?.imageUrl ??
              product.images[0]?.url ??
              "",
            alt: product.name,
            view: "front" as const,
            color,
          },
        ];
  }, [product, color]);

  const image = images[Math.min(activeImage, images.length - 1)]?.url ?? "";

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
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:pb-0">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft/30">
            {image && (
              <Image
                src={image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-14 shrink-0 overflow-hidden border ${
                    i === activeImage ? "border-ink" : "border-border"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 pb-28 lg:pb-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {product.collectionSlug}
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-muted">
              {format(variant?.priceCop ?? product.basePriceCop)}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/80">
              {product.description}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              {t("color")} · {color}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={c === color}
                  onSelect={(next) => {
                    setColor(next);
                    setActiveImage(0);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">{t("size")}</p>
            <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />
          </div>

          <div className="hidden flex-wrap gap-3 lg:flex">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!variant}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition hover:bg-accent disabled:opacity-50"
            >
              {added ? "✓" : t("add")}
            </button>
            {product.isCustomizable && (
              <Link
                href={`/disenar/${product.slug}?color=${encodeURIComponent(color)}&size=${size}`}
                className="rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-surface"
              >
                {t("customize")}
              </Link>
            )}
          </div>
          {variant && (
            <p className="text-xs text-muted">
              {t("stock")}: {variant.stock} · SKU {variant.sku}
            </p>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
        <div className="flex gap-2">
          {product.isCustomizable && (
            <Link
              href={`/disenar/${product.slug}?color=${encodeURIComponent(color)}&size=${size}`}
              className="rounded-full border border-ink px-4 py-3.5 text-sm font-medium text-ink"
            >
              {t("customize")}
            </Link>
          )}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!variant}
            className="flex-1 rounded-full bg-highlight px-6 py-3.5 text-sm font-medium text-surface disabled:opacity-50"
          >
            {added ? "✓" : `${t("add")} · ${format(variant?.priceCop ?? product.basePriceCop)}`}
          </button>
        </div>
      </div>
    </>
  );
}
