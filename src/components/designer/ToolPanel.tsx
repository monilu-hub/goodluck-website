"use client";

import { useTranslations } from "next-intl";

type Props = {
  onUploadImage: (file: File) => void;
  onBringForward: () => void;
  onSendBack: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export function ToolPanel({
  onUploadImage,
  onBringForward,
  onSendBack,
  onDelete,
  onUndo,
  onRedo,
}: Props) {
  const t = useTranslations("designer");

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-3 py-3 text-sm hover:border-ink">
        {t("image")}
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
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onBringForward}
          className="rounded-md border border-border px-3 py-2.5 text-sm"
        >
          {t("forward")}
        </button>
        <button
          type="button"
          onClick={onSendBack}
          className="rounded-md border border-border px-3 py-2.5 text-sm"
        >
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onUndo}
          className="rounded-md border border-border px-3 py-2.5 text-sm"
        >
          {t("undo")}
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="rounded-md border border-border px-3 py-2.5 text-sm"
        >
          {t("redo")}
        </button>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="w-full rounded-md border border-highlight/40 px-3 py-2.5 text-sm text-highlight"
      >
        {t("delete")}
      </button>
    </div>
  );
}
