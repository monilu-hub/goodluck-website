"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  PRINT_COLLECTIONS,
  PRINTS,
  printDesignUrl,
} from "../../../data/prints";

type Props = {
  onSelect: (url: string) => void;
};

export function PrintLibrary({ onSelect }: Props) {
  const [collection, setCollection] = useState<string>(PRINT_COLLECTIONS[0].id);

  const items = useMemo(
    () =>
      PRINTS.filter(
        (p) =>
          p.collection === collection &&
          !p.name.toLowerCase().includes("back") &&
          !p.name.toLowerCase().includes("colores") &&
          // Skip full-garment mockups mistakenly filed under prints
          !p.name.toLowerCase().startsWith("camiseta-"),
      ).slice(0, 28),
    [collection],
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {PRINT_COLLECTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCollection(c.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
              collection === c.id
                ? "bg-ink text-surface"
                : "border border-border bg-surface text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
        {items.map((print) => (
          <button
            key={print.id}
            type="button"
            onClick={() => onSelect(printDesignUrl(print))}
            className="relative aspect-square overflow-hidden border border-border bg-[linear-gradient(45deg,#e8e2d8_25%,transparent_25%),linear-gradient(-45deg,#e8e2d8_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e8e2d8_75%),linear-gradient(-45deg,transparent_75%,#e8e2d8_75%)] bg-[length:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0]"
            title={print.name}
          >
            <Image
              src={printDesignUrl(print)}
              alt={print.name}
              fill
              className="object-contain p-1"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
