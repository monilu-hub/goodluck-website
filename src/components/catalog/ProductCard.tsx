import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatCop } from "@/lib/format";
import { colorHex } from "@/lib/colors";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url ?? "/products/mockups/camiseta-oversized-negro.svg";

  return (
    <Link
      href={`/catalogo/${product.slug}`}
      className="group block animate-rise"
    >
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
          <h3 className="text-sm font-medium text-ink">{product.name}</h3>
          <p className="text-sm text-muted">{formatCop(product.basePriceCop)}</p>
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
  );
}
