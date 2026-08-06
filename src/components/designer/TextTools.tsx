"use client";

import { useTranslations } from "next-intl";
import type { TextOptions } from "./DesignCanvas";

type Props = {
  onAdd: (opts: TextOptions) => void;
  onUpdate: (opts: TextOptions) => void;
};

const FONTS = [
  "Syne, sans-serif",
  "Source Sans 3, sans-serif",
  "Georgia, serif",
  "Impact, sans-serif",
];

export function TextTools({ onAdd, onUpdate }: Props) {
  const t = useTranslations("designer");

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
      <button
        type="button"
        onClick={() => onAdd({ text: "GoodLuck", fontSize: 32 })}
        className="w-full rounded-md bg-ink px-3 py-2.5 text-sm text-surface"
      >
        + {t("text")}
      </button>
      <label className="block text-xs text-muted">
        {t("fontSize")}
        <input
          type="range"
          min={14}
          max={72}
          defaultValue={28}
          className="mt-1 w-full"
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
        />
      </label>
      <label className="block text-xs text-muted">
        {t("fontColor")}
        <input
          type="color"
          defaultValue="#1c1a17"
          className="mt-1 h-9 w-full cursor-pointer rounded border border-border"
          onChange={(e) => onUpdate({ fill: e.target.value })}
        />
      </label>
      <label className="block text-xs text-muted">
        Font
        <select
          className="mt-1 w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-ink"
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f.split(",")[0]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        {(["left", "center", "right"] as const).map((align) => (
          <button
            key={align}
            type="button"
            onClick={() => onUpdate({ textAlign: align })}
            className="flex-1 rounded-md border border-border py-2 text-xs capitalize"
          >
            {align}
          </button>
        ))}
      </div>
    </div>
  );
}
