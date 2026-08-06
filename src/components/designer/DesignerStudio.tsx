"use client";

import { useMemo, useRef, useState } from "react";
import type { Product } from "@/types";
import { CUSTOMIZATION_FEE_COP } from "../../../data/catalog";
import { formatCop } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useDesignStore } from "@/stores/design-store";
import {
  DesignCanvas,
  type DesignCanvasApi,
} from "./DesignCanvas";
import { GarmentPicker } from "./GarmentPicker";
import { PreviewPanel } from "./PreviewPanel";
import { ToolPanel } from "./ToolPanel";

type Props = {
  products: Product[];
  initialSlug?: string;
  initialColor?: string;
  initialSize?: string;
};

export function DesignerStudio({
  products,
  initialSlug,
  initialColor,
  initialSize,
}: Props) {
  const first = products[0];
  const [slug, setSlug] = useState(initialSlug || first?.slug || "");
  const product = useMemo(
    () => products.find((p) => p.slug === slug) ?? first,
    [products, slug, first],
  );
  const [color, setColor] = useState(
    initialColor || product?.colors[0] || "negro",
  );
  const [size, setSize] = useState(initialSize || "M");
  const view = useDesignStore((s) => s.view);
  const setView = useDesignStore((s) => s.setView);
  const pushHistory = useDesignStore((s) => s.pushHistory);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const addItem = useCartStore((s) => s.addItem);
  const apiRef = useRef<DesignCanvasApi | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const garmentUrl =
    product?.images.find((i) => i.color === color)?.url ??
    product?.variants.find((v) => v.color === color)?.imageUrl ??
    product?.images[0]?.url ??
    "/products/mockups/camiseta-oversized-negro.svg";

  const variant = product?.variants.find(
    (v) => v.color === color && v.size === size,
  );

  async function saveAndAddToCart() {
    const api = apiRef.current;
    if (!api || !product || !variant) return;

    setStatus("Guardando diseño...");
    const canvasJson = api.toJSON();
    const dataUrl = api.toDataURL();
    setPreviewUrl(dataUrl);

    let designId = `local-${Date.now()}`;
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productSlug: product.slug,
          color,
          size,
          canvasJson,
          previewDataUrl: dataUrl,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { id: string; previewUrl?: string };
        designId = data.id;
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      }
    } catch {
      // Local fallback if API/Supabase unavailable
    }

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      color,
      size,
      priceCop: variant.priceCop,
      imageUrl: garmentUrl,
      customDesignId: designId,
      customDesignPreview: dataUrl,
      customizationFeeCop: CUSTOMIZATION_FEE_COP,
    });

    setStatus(`Diseño añadido (+${formatCop(CUSTOMIZATION_FEE_COP)} personalización)`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_240px]">
      <div className="space-y-4">
        <GarmentPicker
          products={products}
          selectedSlug={slug}
          color={color}
          size={size}
          onProductChange={(next) => {
            setSlug(next);
            const p = products.find((x) => x.slug === next);
            if (p) setColor(p.colors[0] ?? color);
          }}
          onColorChange={setColor}
          onSizeChange={setSize}
        />
        <ToolPanel
          onAddText={() => apiRef.current?.addText()}
          onUploadImage={(file) => void apiRef.current?.addImageFile(file)}
          onBringForward={() => apiRef.current?.bringForward()}
          onSendBack={() => apiRef.current?.sendBack()}
          onDelete={() => apiRef.current?.deleteSelected()}
          onUndo={() => {
            const json = undo();
            if (json) void apiRef.current?.loadJson(json);
          }}
          onRedo={() => {
            const json = redo();
            if (json) void apiRef.current?.loadJson(json);
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <DesignCanvas
          key={`${slug}-${color}-${view}`}
          garmentUrl={garmentUrl}
          onReady={(api) => {
            apiRef.current = api;
          }}
          onChange={(json) => pushHistory(json)}
        />
        <button
          type="button"
          onClick={() => void saveAndAddToCart()}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition hover:bg-accent"
        >
          Guardar y añadir al carrito
        </button>
        {status && <p className="text-sm text-muted">{status}</p>}
      </div>

      <PreviewPanel
        view={view}
        onViewChange={setView}
        previewUrl={previewUrl}
      />
    </div>
  );
}
