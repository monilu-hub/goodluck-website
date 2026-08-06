"use client";

import { colorHex } from "@/lib/colors";

type Props = {
  color: string;
  selected?: boolean;
  onSelect?: (color: string) => void;
  size?: "sm" | "md";
};

export function ColorSwatch({ color, selected, onSelect, size = "md" }: Props) {
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <button
      type="button"
      title={color}
      aria-label={color}
      onClick={() => onSelect?.(color)}
      className={`${dim} rounded-full border transition ${
        selected ? "ring-2 ring-accent ring-offset-2" : "border-border"
      }`}
      style={{ backgroundColor: colorHex(color) }}
    />
  );
}
