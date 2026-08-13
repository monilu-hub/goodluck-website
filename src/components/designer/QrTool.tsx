"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { qrDataUrlFromLink } from "@/lib/qr";

type Props = {
  onGenerate: (dataUrl: string) => void;
};

export function QrTool({ onGenerate }: Props) {
  const t = useTranslations("designer");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await qrDataUrlFromLink(link);
      setPreview(dataUrl);
      onGenerate(dataUrl);
    } catch {
      setError(t("qrInvalid"));
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-3">
      <p className="text-xs uppercase tracking-wider text-muted">{t("qr")}</p>
      <p className="text-xs leading-relaxed text-muted">{t("qrHint")}</p>
      <input
        type="url"
        inputMode="url"
        autoComplete="url"
        placeholder={t("qrPlaceholder")}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleGenerate();
        }}
        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-ink outline-none focus:border-ink"
      />
      <button
        type="button"
        disabled={loading || !link.trim()}
        onClick={() => void handleGenerate()}
        className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-surface disabled:opacity-40"
      >
        {loading ? t("qrGenerating") : t("qrGenerate")}
      </button>
      {error && <p className="text-xs text-highlight">{error}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="QR"
          className="mx-auto h-28 w-28 rounded-md border border-border bg-white p-1"
        />
      )}
    </div>
  );
}
