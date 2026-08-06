"use client";

type Props = {
  view: "front" | "back";
  onViewChange: (view: "front" | "back") => void;
  previewUrl?: string | null;
};

export function PreviewPanel({ view, onViewChange, previewUrl }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wider text-muted">Vista</p>
      <div className="mt-3 flex gap-2">
        {(["front", "back"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              view === v ? "bg-ink text-surface" : "border border-border"
            }`}
          >
            {v === "front" ? "Frente" : "Espalda"}
          </button>
        ))}
      </div>
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Vista previa"
          className="mt-4 w-full rounded-md border border-border"
        />
      )}
    </div>
  );
}
