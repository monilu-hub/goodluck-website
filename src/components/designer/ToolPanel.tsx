"use client";

type Props = {
  onAddText: () => void;
  onUploadImage: (file: File) => void;
  onBringForward: () => void;
  onSendBack: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export function ToolPanel({
  onAddText,
  onUploadImage,
  onBringForward,
  onSendBack,
  onDelete,
  onUndo,
  onRedo,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wider text-muted">Herramientas</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onAddText}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-ink"
        >
          Texto
        </button>
        <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-center text-sm hover:border-ink">
          Imagen
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={onBringForward}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-ink"
        >
          Traer al frente
        </button>
        <button
          type="button"
          onClick={onSendBack}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-ink"
        >
          Enviar atrás
        </button>
        <button
          type="button"
          onClick={onUndo}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-ink"
        >
          Deshacer
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="rounded-md border border-border px-3 py-2 text-sm hover:border-ink"
        >
          Rehacer
        </button>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="w-full rounded-md border border-highlight/40 px-3 py-2 text-sm text-highlight hover:bg-highlight/10"
      >
        Eliminar selección
      </button>
    </div>
  );
}
