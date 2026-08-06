"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PRINT_COLLECTIONS, PRINTS } from "../../../data/prints";

type Props = {
  onSelect: (url: string) => void;
};

export function PrintLibrary({ onSelect }: Props) {
  const [collection, setCollection] = useState<string>(PRINT_COLLECTIONS[0].id);

  const items = useMemo(
    () =>
      PRINTS.filter(
        (p) => p.collection === collection && !p.name.toLowerCase().includes("back"),
      ).slice(0, 24),
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
            onClick={() => onSelect(print.url)}
            className="relative aspect-square overflow-hidden border border-border bg-background"
          >
            <Image
              src={print.url}
              alt={print.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
