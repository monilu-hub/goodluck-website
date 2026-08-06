"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MODELS,
  cmToInches,
  heightLabel,
  type ModelGender,
} from "../../../data/models";

type Props = {
  designOverlayUrl: string | null;
  size: string;
};

export function ModelPreview({ designOverlayUrl, size }: Props) {
  const t = useTranslations("designer");
  const [gender, setGender] = useState<ModelGender>("male");
  const [heightCm, setHeightCm] = useState(175);
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const model = useMemo(() => {
    const pool = MODELS.filter((m) => m.gender === gender);
    const bySize = pool.filter((m) => m.size === size);
    const candidates = bySize.length ? bySize : pool;
    return (
      candidates.reduce((best, cur) =>
        Math.abs(cur.heightCm - heightCm) < Math.abs(best.heightCm - heightCm)
          ? cur
          : best,
      ) ?? pool[0]
    );
  }, [gender, heightCm, size]);

  if (!model) return null;

  const sliderValue = unit === "cm" ? heightCm : cmToInches(heightCm);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            className={`flex-1 rounded-full px-3 py-2 text-sm ${
              gender === g ? "bg-ink text-surface" : "border border-border"
            }`}
          >
            {g === "male" ? t("male") : t("female")}
          </button>
        ))}
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
        className="w-full"
      />

      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-accent-soft/40">
        <Image
          src={model.imageUrl}
          alt={model.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 384px"
        />
        {designOverlayUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={designOverlayUrl}
            alt=""
            className="pointer-events-none absolute object-contain mix-blend-multiply"
            style={{
              left: `${model.torso.x * 100}%`,
              top: `${model.torso.y * 100}%`,
              width: `${model.torso.w * 100}%`,
              height: `${model.torso.h * 100}%`,
            }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-3 text-surface">
          <p className="font-display text-sm font-semibold">{model.name}</p>
          <p className="text-xs text-surface/80">
            {model.size} · {heightLabel(model.heightCm)}
          </p>
        </div>
      </div>
    </div>
  );
}
