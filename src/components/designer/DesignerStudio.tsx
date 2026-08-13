"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import { CUSTOMIZATION_FEE_COP } from "../../../data/catalog";
import { lookbookPath } from "../../../data/lookbook";
import {
  HEIGHT_MAX,
  HEIGHT_MIN,
  HEIGHT_STEP,
  MODELS,
  heightLabel,
  modelImage,
  snapHeight,
  type ModelCamera,
  type ModelGender,
} from "../../../data/models";
import { useMoney } from "@/hooks/useMoney";
import { useCartStore } from "@/stores/cart-store";
import { useDesignStore } from "@/stores/design-store";
import type { DesignCanvasApi } from "./DesignCanvas";
import { DesignToolbar } from "./DesignToolbar";
import { GarmentPicker } from "./GarmentPicker";
import { ModelStage } from "./ModelStage";

type Props = {
  products: Product[];
  initialSlug?: string;
  initialColor?: string;
  initialSize?: string;
  initialPhrase?: string;
};

type Panel = "garment" | "model" | "design";

const emptyDesigns = (): Record<ModelCamera, string | null> => ({
  front: null,
  side: null,
  back: null,
});

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
  const [slug, setSlug] = useState(initialSlug || first?.slug || "");
  const product = useMemo(
    () => products.find((p) => p.slug === slug) ?? first,
    [products, slug, first],
  );
  const [color, setColor] = useState(
    initialColor || product?.colors[0] || "negro",
  );
  const [size, setSize] = useState(initialSize || "M");
  const camera = useDesignStore((s) => s.view);
  const setCamera = useDesignStore((s) => s.setView);
  const pushHistory = useDesignStore((s) => s.pushHistory);
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const resetDesign = useDesignStore((s) => s.reset);
  const addItem = useCartStore((s) => s.addItem);

  const apiRef = useRef<DesignCanvasApi | null>(null);
  const [designByView, setDesignByView] = useState(emptyDesigns);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [panel, setPanel] = useState<Panel>("design");

  const preferredGender: ModelGender =
    product?.gender === "mujer" ? "female" : "male";
  const [gender, setGender] = useState<ModelGender>(preferredGender);
  const [genderSource, setGenderSource] = useState(preferredGender);
  const [modelId, setModelId] = useState(
    () =>
      MODELS.find(
        (m) => m.gender === preferredGender && m.size === (initialSize || "M"),
      )?.id ??
      MODELS.find((m) => m.gender === preferredGender)?.id ??
      MODELS[0]?.id ??
      "",
  );
  const [heightCm, setHeightCm] = useState(() =>
    snapHeight(MODELS.find((m) => m.id === modelId)?.heightCm ?? 170),
  );

  if (genderSource !== preferredGender) {
    setGenderSource(preferredGender);
    setGender(preferredGender);
    const next =
      MODELS.find((m) => m.gender === preferredGender && m.size === size) ??
      MODELS.find((m) => m.gender === preferredGender);
    if (next) {
      setModelId(next.id);
      setHeightCm(snapHeight(next.heightCm));
    }
  }

  const genderModels = useMemo(
    () => MODELS.filter((m) => m.gender === gender),
    [gender],
  );
  const model =
    genderModels.find((m) => m.id === modelId) ?? genderModels[0] ?? MODELS[0];

  const activeColor =
    product && product.colors.includes(color)
      ? color
      : (product?.colors[0] ?? color);

  if (product && color !== activeColor) {
    setColor(activeColor);
  }

  const garmentCut = product?.type === "crop-top" ? "crop" : "tee";
  const variant =
    product?.variants.find(
      (v) => v.color === activeColor && v.size === size,
    ) ?? product?.variants.find((v) => v.color === activeColor);
  const basePrice = variant?.priceCop ?? product?.variants[0]?.priceCop ?? 0;
  const totalPrice = basePrice + CUSTOMIZATION_FEE_COP;

  /** Lookbook at default height (garment+color); library for height/side variants. */
  const stageUrl = useMemo(() => {
    if (!model) return modelImage("male-andres", "front", 170);
    const atDefaultHeight =
      snapHeight(heightCm) === snapHeight(model.heightCm);
    if (
      product &&
      atDefaultHeight &&
      (camera === "front" || camera === "back")
    ) {
      return lookbookPath(
        product.slug,
        activeColor,
        camera === "back" ? "back" : "front",
      );
    }
    return modelImage(model.id, camera, heightCm);
  }, [product, model, camera, activeColor, heightCm]);

  const cartImageUrl =
    lookbookPath(product?.slug ?? "camiseta-oversized-fit", activeColor) ||
    stageUrl;

  function selectProduct(nextSlug: string) {
    const p = products.find((x) => x.slug === nextSlug);
    if (!p) return;
    setSlug(nextSlug);
    setColor(p.colors[0] ?? color);
    setSize(p.sizes.includes(size) ? size : (p.sizes[1] ?? p.sizes[0] ?? "M"));
    setDesignByView(emptyDesigns());
    setPreviewUrl(null);
    resetDesign();
    setCamera("front");
    setPanel("design");
  }

  function switchCamera(next: ModelCamera) {
    const json = apiRef.current?.toJSON() ?? null;
    setDesignByView((prev) => ({ ...prev, [camera]: json }));
    setCamera(next);
  }

  async function saveAndAddToCart() {
    if (!product || !variant) return;
    const api = apiRef.current;
    setStatus("…");
    const canvasJson = api?.toJSON() ?? designByView[camera] ?? "{}";
    const dataUrl = api?.toDataURL() ?? previewUrl ?? cartImageUrl;
    if (api) setPreviewUrl(dataUrl);

    let designId = `local-${Date.now()}`;
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productSlug: product.slug,
          color: activeColor,
          size,
          canvasJson,
          previewDataUrl: dataUrl,
          modelId: model?.id,
          heightCm,
          camera,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { id: string; previewUrl?: string };
        designId = data.id;
        if (data.previewUrl) setPreviewUrl(data.previewUrl);
      }
    } catch {
      // local fallback
    }

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      color: activeColor,
      size,
      priceCop: variant.priceCop,
      imageUrl: cartImageUrl,
      customDesignId: designId,
      customDesignPreview: dataUrl,
      customizationFeeCop: CUSTOMIZATION_FEE_COP,
    });
    setStatus(t("addedToCart"));
  }

  const panels: { id: Panel; label: string }[] = [
    { id: "garment", label: t("panelGarment") },
    { id: "model", label: t("panelModel") },
    { id: "design", label: t("panelDesign") },
  ];

  const cameras: { id: ModelCamera; label: string }[] = [
    { id: "front", label: t("cameraFront") },
    { id: "side", label: t("cameraSide") },
    { id: "back", label: t("cameraBack") },
  ];

  if (!model) return null;

  return (
    <div className="pb-36 lg:pb-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start lg:gap-6">
        <div className="space-y-3 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-wider text-muted">
              {t("stageLabel")}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={t("undo")}
                onClick={() => {
                  const json = undo();
                  if (json) void apiRef.current?.loadJson(json);
                }}
                className="rounded-full border border-border px-3 py-1.5 text-sm"
              >
                ↶
              </button>
              <button
                type="button"
                aria-label={t("redo")}
                onClick={() => {
                  const json = redo();
                  if (json) void apiRef.current?.loadJson(json);
                }}
                className="rounded-full border border-border px-3 py-1.5 text-sm"
              >
                ↷
              </button>
            </div>
          </div>

          <ModelStage
            stageUrl={stageUrl}
            model={model}
            camera={camera}
            garmentCut={garmentCut}
            size={size}
            initialPhrase={camera === "front" ? initialPhrase : undefined}
            canvasKey={`${slug}-${camera}-${model.id}-${garmentCut}`}
            initialJson={designByView[camera]}
            onReady={(api) => {
              apiRef.current = api;
            }}
            onChange={(json) => {
              pushHistory(json);
              setDesignByView((prev) => ({ ...prev, [camera]: json }));
            }}
            onSelectionChange={(selected, isText) => {
              setHasSelection(selected);
              setIsTextSelected(isText);
            }}
          />

          <div className="flex gap-2">
            {cameras.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => switchCamera(c.id)}
                className={`flex-1 rounded-full px-3 py-2 text-sm ${
                  camera === c.id
                    ? "bg-ink text-surface"
                    : "border border-border bg-surface"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted">
            {model.name} · {heightLabel(heightCm)} · {t("heightPose", { band: snapHeight(heightCm) })}
          </p>
        </div>

        <aside className="space-y-4">
          <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
            {panels.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPanel(p.id)}
                className={`flex-1 rounded-full px-3 py-2 text-sm ${
                  panel === p.id ? "bg-ink text-surface" : "text-muted"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {panel === "garment" && (
            <GarmentPicker
              products={products}
              selectedSlug={slug}
              color={activeColor}
              size={size}
              onProductChange={selectProduct}
              onColorChange={setColor}
              onSizeChange={setSize}
            />
          )}

          {panel === "model" && (
            <div className="space-y-5 rounded-xl border border-border bg-surface p-4">
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGender(g);
                      const next =
                        MODELS.find((m) => m.gender === g && m.size === size) ??
                        MODELS.find((m) => m.gender === g);
                      if (next) {
                        setModelId(next.id);
                        setHeightCm(snapHeight(next.heightCm));
                      }
                    }}
                    className={`flex-1 rounded-full px-3 py-2 text-sm ${
                      gender === g
                        ? "bg-ink text-surface"
                        : "border border-border"
                    }`}
                  >
                    {g === "male" ? t("male") : t("female")}
                  </button>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted">
                  {t("model")}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {genderModels.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModelId(m.id);
                        setHeightCm(snapHeight(m.heightCm));
                      }}
                      className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                        model.id === m.id
                          ? "border-ink"
                          : "border-transparent opacity-80"
                      }`}
                      aria-label={m.name}
                    >
                      <Image
                        src={modelImage(m.id, "front", m.heightCm)}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted">{t("height")}</span>
                  <span className="font-medium text-ink">
                    {heightLabel(heightCm)}
                  </span>
                </div>
                <input
                  type="range"
                  min={HEIGHT_MIN}
                  max={HEIGHT_MAX}
                  step={HEIGHT_STEP}
                  value={heightCm}
                  onChange={(e) =>
                    setHeightCm(snapHeight(Number(e.target.value)))
                  }
                  className="w-full accent-accent"
                />
                <p className="mt-2 text-xs text-muted">{t("heightHint")}</p>
              </div>
            </div>
          )}

          {panel === "design" && (
            <div className="space-y-3">
              <p className="text-sm text-muted">{t("designHint")}</p>
              <DesignToolbar
                hasSelection={hasSelection}
                isTextSelected={isTextSelected}
                onAddText={(opts) => apiRef.current?.addText(opts)}
                onUpdateText={(opts) => apiRef.current?.updateActiveText(opts)}
                onUploadImage={(file) => void apiRef.current?.addImageFile(file)}
                onSelectPrint={(url) => void apiRef.current?.addImageUrl(url)}
                onAddQr={(dataUrl) => void apiRef.current?.addQrImage(dataUrl)}
                onBringForward={() => apiRef.current?.bringForward()}
                onSendBack={() => apiRef.current?.sendBack()}
                onDuplicate={() => void apiRef.current?.duplicateSelected()}
                onFlip={() => apiRef.current?.flipHorizontal()}
                onRotate={() => apiRef.current?.rotateBy(15)}
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
          )}
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted">
              {t("priceTotal")}
            </p>
            <p className="font-display text-xl font-semibold text-ink">
              {format(totalPrice)}
            </p>
            <p className="truncate text-xs text-muted">
              {format(basePrice)} + {format(CUSTOMIZATION_FEE_COP)}{" "}
              {t("priceCustomization")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void saveAndAddToCart()}
            className="w-full rounded-full bg-highlight px-6 py-3.5 text-sm font-medium text-surface transition hover:brightness-110 sm:w-auto"
          >
            {t("saveCart")}
          </button>
          {status && (
            <p className="text-center text-sm text-muted sm:text-left">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
