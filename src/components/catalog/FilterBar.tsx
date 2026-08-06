"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "", label: "Todos" },
  { value: "oversized", label: "Oversized" },
  { value: "camiseta-algodon", label: "Algodón" },
  { value: "crop-top", label: "Crop top" },
  { value: "tela-fria", label: "Tela fría" },
];

const GENDERS = [
  { value: "", label: "Todos" },
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
];

const COLLECTIONS = [
  { value: "", label: "Todas" },
  { value: "ss26", label: "SS26" },
  { value: "dia-del-padre-2026", label: "Día del Padre" },
  { value: "mundial-fifa26", label: "Mundial FIFA26" },
];

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`/catalogo?${next.toString()}`);
  }

  return (
    <div className="sticky top-16 z-30 -mx-4 border-y border-border bg-background/90 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border">
      <div className="flex flex-wrap gap-3">
        <label className="text-xs text-muted">
          Colección
          <select
            className="mt-1 block rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-ink"
            value={params.get("collection") ?? ""}
            onChange={(e) => update("collection", e.target.value)}
          >
            {COLLECTIONS.map((c) => (
              <option key={c.value || "all"} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Tipo
          <select
            className="mt-1 block rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-ink"
            value={params.get("type") ?? ""}
            onChange={(e) => update("type", e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t.value || "all"} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Género
          <select
            className="mt-1 block rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-ink"
            value={params.get("gender") ?? ""}
            onChange={(e) => update("gender", e.target.value)}
          >
            {GENDERS.map((g) => (
              <option key={g.value || "all"} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[160px] flex-1 text-xs text-muted">
          Buscar
          <input
            className="mt-1 block w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-ink"
            defaultValue={params.get("q") ?? ""}
            placeholder="Oversized, mundial..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update("q", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
