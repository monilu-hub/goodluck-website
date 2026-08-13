"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MODELS,
  cmToInches,
  heightLabel,
  modelImage,
  type CuratedModel,
  type ModelGender,
} from "../../../data/models";

export type GarmentCut = "tee" | "crop";

type Props = {
  garmentUrl?: string | null;
  designOverlayUrl?: string | null;
  size: string;
  /** Sync model gender to the selected product */
  preferredGender?: ModelGender;
  garmentCut?: GarmentCut;
  productLabel?: string;
  colorLabel?: string;
};

function torsoFor(model: CuratedModel, cut: GarmentCut) {
  const t = model.torso;
  if (cut === "crop") {
    return {
      x: t.x + t.w * 0.04,
      y: t.y + t.h * 0.02,
      w: t.w * 0.92,
      h: t.h * 0.62,
    };
  }
  return t;
}

export function ModelPreview({
  garmentUrl,
  designOverlayUrl,
  size,
  preferredGender = "male",
  garmentCut = "tee",
  productLabel,
  colorLabel,
}: Props) {
  const t = useTranslations("designer");
  const [gender, setGender] = useState<ModelGender>(preferredGender);
  const [genderSource, setGenderSource] = useState(preferredGender);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [heightCm, setHeightCm] = useState(175);
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (genderSource !== preferredGender) {
    setGenderSource(preferredGender);
    setGender(preferredGender);
    setPickedId(null);
  }

  const genderModels = useMemo(
    () => MODELS.filter((m) => m.gender === gender),
    [gender],
  );

  const model: CuratedModel | undefined = useMemo(() => {
    const picked = pickedId
      ? genderModels.find((m) => m.id === pickedId)
      : undefined;
    return (
      picked ??
      genderModels.find((m) => m.size === size) ??
      genderModels[0]
    );
  }, [genderModels, pickedId, size]);

  if (!model) return null;

  const box = torsoFor(model, garmentCut);
  const sliderValue = unit === "cm" ? heightCm : cmToInches(heightCm);
  const heightScale = Math.min(1.08, Math.max(0.92, heightCm / model.heightCm));

  return (
    <div className="space-y-4">
      {/* Working garment — updates immediately with type / color */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#efe9df]">
        {garmentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={garmentUrl}
            src={garmentUrl}
            alt={productLabel || t("garment")}
            className="absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t("garment")}
          </div>
        )}
        {designOverlayUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={designOverlayUrl}
            alt=""
            className="pointer-events-none absolute object-contain"
            style={{
              left: "28%",
              top: "26%",
              width: "44%",
              height: "40%",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3 text-surface">
          <p className="font-display text-sm font-semibold">
            {productLabel || t("garment")}
          </p>
          {colorLabel && (
            <p className="text-xs capitalize text-surface/85">{colorLabel}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setGender(g);
              setPickedId(null);
            }}
            className={`flex-1 rounded-full px-3 py-2 text-sm ${
              gender === g ? "bg-ink text-surface" : "border border-border"
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
                setPickedId(m.id);
                setHeightCm(m.heightCm);
              }}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-16 ${
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

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          {t("height")}:{" "}
          <span className="text-ink">{heightLabel(heightCm)}</span>
        </p>
        <div className="flex gap-1">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`rounded-md px-2 py-1 text-xs ${
                unit === u ? "bg-accent-soft text-ink" : "text-muted"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <input
        type="range"
        min={unit === "cm" ? 150 : 59}
        max={unit === "cm" ? 195 : 77}
        step={unit === "cm" ? 1 : 0.5}
        value={sliderValue}
        onChange={(e) => {
          const v = Number(e.target.value);
          setHeightCm(unit === "cm" ? v : Math.round(v * 2.54));
        }}
        className="w-full accent-accent"
      />

      <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-accent-soft/40">
        <div
          className="absolute inset-0 origin-bottom transition-transform duration-300"
          style={{ transform: `scale(${heightScale})` }}
        >
          <Image
            src={modelImage(model.id, "front", model.heightCm)}
            alt={model.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 420px"
            priority
          />
          {garmentUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`tryon-${garmentUrl}`}
              src={garmentUrl}
              alt=""
              className="pointer-events-none absolute object-contain object-center drop-shadow-md"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.w * 100}%`,
                height: `${box.h * 100}%`,
              }}
            />
          )}
          {designOverlayUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={designOverlayUrl}
              alt=""
              className="pointer-events-none absolute object-contain"
              style={{
                left: `${(box.x + box.w * 0.12) * 100}%`,
                top: `${(box.y + box.h * 0.16) * 100}%`,
                width: `${box.w * 0.76 * 100}%`,
                height: `${box.h * 0.55 * 100}%`,
              }}
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-3 text-surface">
          <p className="font-display text-sm font-semibold">{model.name}</p>
          <p className="text-xs text-surface/85">{t("modelPreviewHint")}</p>
        </div>
      </div>
    </div>
  );
}
