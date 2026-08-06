"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import { CUSTOMIZATION_FEE_COP } from "../../../data/catalog";
import { useMoney } from "@/hooks/useMoney";
import { useCartStore } from "@/stores/cart-store";
import { useDesignStore } from "@/stores/design-store";
import {
  DesignCanvas,
  type DesignCanvasApi,
} from "./DesignCanvas";
import { GarmentPicker } from "./GarmentPicker";
import { ModelPreview } from "./ModelPreview";
import { PrintLibrary } from "./PrintLibrary";
import { TextTools } from "./TextTools";
import { ToolPanel } from "./ToolPanel";

type Props = {
  products: Product[];
  initialSlug?: string;
  initialColor?: string;
  initialSize?: string;
  initialPhrase?: string;
};

type Step = "garment" | "design" | "model";

export function DesignerStudio({
  products,
  initialSlug,
  initialColor,
  initialSize,
  initialPhrase,
}: Props) {
  const t = useTranslations("designer");
  const { format } = useMoney();
  const first = products[0];
  const [step, setStep] = useState<Step>(initialPhrase ? "design" : "garment");
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
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 460 });

  useEffect(() => {
    const update = () => {
      const w = Math.min(360, Math.max(280, window.innerWidth - 48));
      setCanvasSize({ width: w, height: Math.round(w * 1.28) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const garmentUrl = useMemo(() => {
    if (!product) return "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp";
    const byView = product.images.find(
      (i) => i.color === color && i.view === view,
    );
    if (byView) return byView.url;
    return (
      product.images.find((i) => i.color === color)?.url ??
      product.variants.find((v) => v.color === color)?.imageUrl ??
      product.images[0]?.url ??
      "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp"
    );
  }, [product, color, view]);

  const variant = product?.variants.find(
    (v) => v.color === color && v.size === size,
  );

  function refreshOverlay() {
    const overlay = apiRef.current?.exportDesignOverlay() ?? null;
    setOverlayUrl(overlay);
    const full = apiRef.current?.toDataURL() ?? null;
    if (full) setPreviewUrl(full);
  }

  async function saveAndAddToCart() {
    const api = apiRef.current;
    if (!api || !product || !variant) return;

    setStatus("…");
    const canvasJson = api.toJSON();
    const dataUrl = api.toDataURL();
    setPreviewUrl(dataUrl);
    setOverlayUrl(api.exportDesignOverlay());

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
      // Local fallback
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

    setStatus(`+${format(CUSTOMIZATION_FEE_COP)}`);
  }

  const steps: { id: Step; label: string }[] = [
    { id: "garment", label: t("stepGarment") },
    { id: "design", label: t("stepDesign") },
    { id: "model", label: t("stepModel") },
  ];

  return (
    <div className="pb-28 lg:pb-8">
      <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              if (s.id === "model") refreshOverlay();
              setStep(s.id);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${
              step === s.id
                ? "bg-ink text-surface"
                : "border border-border bg-surface text-ink"
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {step === "garment" && (
        <div className="mx-auto max-w-md space-y-4">
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
          <button
            type="button"
            onClick={() => setStep("design")}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface"
          >
            {t("stepDesign")} →
          </button>
        </div>
      )}

      {step === "design" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {(["front", "back"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    view === v ? "bg-ink text-surface" : "border border-border"
                  }`}
                >
                  {v === "front" ? t("front") : t("backView")}
                </button>
              ))}
            </div>
            <DesignCanvas
              key={`${slug}-${color}-${view}-${initialPhrase ?? ""}`}
              garmentUrl={garmentUrl}
              width={canvasSize.width}
              height={canvasSize.height}
              initialPhrase={initialPhrase}
              onReady={(api) => {
                apiRef.current = api;
              }}
              onChange={(json) => {
                pushHistory(json);
                refreshOverlay();
              }}
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-muted">{t("tools")}</p>
            <TextTools
              onAdd={(opts) => apiRef.current?.addText(opts)}
              onUpdate={(opts) => apiRef.current?.updateActiveText(opts)}
            />
            <ToolPanel
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
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted">
                {t("prints")}
              </p>
              <PrintLibrary
                onSelect={(url) => void apiRef.current?.addImageUrl(url)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                refreshOverlay();
                setStep("model");
              }}
              className="hidden w-full rounded-full border border-ink px-6 py-3 text-sm font-medium lg:block"
            >
              {t("stepModel")} →
            </button>
          </div>
        </div>
      )}

      {step === "model" && (
        <div className="mx-auto max-w-md">
          <ModelPreview designOverlayUrl={overlayUrl ?? previewUrl} size={size} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 lg:hidden">
            {step !== "garment" && (
              <button
                type="button"
                onClick={() =>
                  setStep(step === "model" ? "design" : "garment")
                }
                className="rounded-full border border-border px-4 py-3 text-sm"
              >
                ←
              </button>
            )}
            {step !== "model" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "garment") setStep("design");
                  else {
                    refreshOverlay();
                    setStep("model");
                  }
                }}
                className="flex-1 rounded-full border border-ink px-4 py-3 text-sm"
              >
                →
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => void saveAndAddToCart()}
            className="w-full rounded-full bg-highlight px-6 py-3.5 text-sm font-medium text-surface transition hover:brightness-110 sm:w-auto"
          >
            {t("saveCart")}
          </button>
          {status && <p className="text-center text-sm text-muted sm:text-left">{status}</p>}
        </div>
      </div>
    </div>
  );
}
