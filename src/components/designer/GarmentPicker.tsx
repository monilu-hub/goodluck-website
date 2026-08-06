"use client";

import type { Product } from "@/types";
import { ColorSwatch } from "@/components/catalog/ColorSwatch";
import { SizeSelector } from "@/components/catalog/SizeSelector";

type Props = {
  products: Product[];
  selectedSlug: string;
  color: string;
  size: string;
  onProductChange: (slug: string) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
};

export function GarmentPicker({
  products,
  selectedSlug,
  color,
  size,
  onProductChange,
  onColorChange,
  onSizeChange,
}: Props) {
  const product = products.find((p) => p.slug === selectedSlug) ?? products[0];

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Prenda</p>
        <select
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={selectedSlug}
          onChange={(e) => onProductChange(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {product && (
        <>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">
              Color
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={c === color}
                  onSelect={onColorChange}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">
              Talla
            </p>
            <SizeSelector
              sizes={product.sizes}
              selected={size}
              onSelect={onSizeChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
