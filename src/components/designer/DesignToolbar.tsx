"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { TextOptions } from "./DesignCanvas";
import { PrintLibrary } from "./PrintLibrary";
import { QrTool } from "./QrTool";
import { TextTools } from "./TextTools";

export type ToolId = "text" | "image" | "prints" | "qr" | "edit" | null;

type Props = {
  hasSelection: boolean;
  isTextSelected: boolean;
  onAddText: (opts?: TextOptions) => void;
  onUpdateText: (opts: TextOptions) => void;
  onUploadImage: (file: File) => void;
  onSelectPrint: (url: string) => void;
  onAddQr: (dataUrl: string) => void;
  onBringForward: () => void;
  onSendBack: () => void;
  onDuplicate: () => void;
  onFlip: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export function DesignToolbar({
  hasSelection,
  isTextSelected,
  onAddText,
  onUpdateText,
  onUploadImage,
  onSelectPrint,
  onAddQr,
  onBringForward,
  onSendBack,
  onDuplicate,
  onFlip,
  onRotate,
  onDelete,
  onUndo,
  onRedo,
}: Props) {
  const t = useTranslations("designer");
  const [active, setActive] = useState<ToolId>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openTool(id: ToolId) {
    setActive((prev) => (prev === id ? null : id));
  }

  return (
    <div className="lg:space-y-4">
      <div className="hidden space-y-4 lg:block">
        <TextTools onAdd={onAddText} onUpdate={onUpdateText} />
        <QrTool onGenerate={onAddQr} />
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border bg-surface px-3 py-3 text-sm hover:border-ink">
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
          <EditActions
            hasSelection={hasSelection}
            onBringForward={onBringForward}
            onSendBack={onSendBack}
            onDuplicate={onDuplicate}
            onFlip={onFlip}
            onRotate={onRotate}
            onDelete={onDelete}
            onUndo={onUndo}
            onRedo={onRedo}
          />
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">
            {t("prints")}
          </p>
          <PrintLibrary onSelect={onSelectPrint} />
        </div>
      </div>

      <div className="lg:hidden">
        {active && (
          <div className="mb-2 max-h-[42vh] overflow-y-auto rounded-2xl border border-border bg-surface p-3 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-ink">
                {active === "text" && t("text")}
                {active === "image" && t("image")}
                {active === "prints" && t("prints")}
                {active === "qr" && t("qr")}
                {active === "edit" && t("edit")}
              </p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full px-3 py-1 text-xs text-muted"
              >
                {t("done")}
              </button>
            </div>

            {active === "text" && (
              <TextTools onAdd={onAddText} onUpdate={onUpdateText} />
            )}
            {active === "image" && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl bg-ink py-3.5 text-sm font-medium text-surface"
              >
                {t("uploadPhoto")}
              </button>
            )}
            {active === "prints" && (
              <PrintLibrary
                onSelect={(url) => {
                  onSelectPrint(url);
                  setActive(null);
                }}
              />
            )}
            {active === "qr" && (
              <QrTool
                onGenerate={(dataUrl) => {
                  onAddQr(dataUrl);
                }}
              />
            )}
            {active === "edit" && (
              <EditActions
                hasSelection={hasSelection}
                onBringForward={onBringForward}
                onSendBack={onSendBack}
                onDuplicate={onDuplicate}
                onFlip={onFlip}
                onRotate={onRotate}
                onDelete={onDelete}
                onUndo={onUndo}
                onRedo={onRedo}
              />
            )}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface/95 p-2 shadow-md backdrop-blur">
          <div className="grid grid-cols-6 gap-1">
            <DockButton
              label={t("text")}
              active={active === "text"}
              onClick={() => {
                openTool("text");
                if (!isTextSelected) onAddText({ text: "GoodLuck", fontSize: 32 });
              }}
              icon={
                <span className="font-display text-lg font-bold leading-none">T</span>
              }
            />
            <DockButton
              label={t("image")}
              active={active === "image"}
              onClick={() => openTool("image")}
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10" r="1.5" />
                  <path d="M3 16l5-4 4 3 3-2 6 5" />
                </svg>
              }
            />
            <DockButton
              label={t("prints")}
              active={active === "prints"}
              onClick={() => openTool("prints")}
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 8h16v11H4z" />
                  <path d="M8 8V5h8v3" />
                  <path d="M8 13h8" />
                </svg>
              }
            />
            <DockButton
              label={t("qr")}
              active={active === "qr"}
              onClick={() => openTool("qr")}
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm12-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v6h-2v-2h-2v-2h2v-2zm-4 4h2v2h-2v-2z" />
                </svg>
              }
            />
            <DockButton
              label={t("edit")}
              active={active === "edit"}
              onClick={() => openTool("edit")}
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3v18" />
                  <path d="M5 8l7-4 7 4" />
                  <path d="M5 16l7 4 7-4" />
                </svg>
              }
            />
            <DockButton
              label={t("delete")}
              active={false}
              danger
              disabled={!hasSelection}
              onClick={onDelete}
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 7h14" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M6 7l1 12h10l1-12" />
                  <path d="M9 7V5h6v2" />
                </svg>
              }
            />
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onUploadImage(file);
              setActive(null);
            }
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function DockButton({
  label,
  icon,
  active,
  onClick,
  danger,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-[9px] transition disabled:opacity-35 ${
        active
          ? "bg-ink text-surface"
          : danger
            ? "text-highlight"
            : "text-ink"
      }`}
    >
      {icon}
      <span className="leading-none">{label}</span>
    </button>
  );
}

function EditActions({
  hasSelection,
  onBringForward,
  onSendBack,
  onDuplicate,
  onFlip,
  onRotate,
  onDelete,
  onUndo,
  onRedo,
}: {
  hasSelection: boolean;
  onBringForward: () => void;
  onSendBack: () => void;
  onDuplicate: () => void;
  onFlip: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const t = useTranslations("designer");
  const btn =
    "rounded-xl border border-border bg-background px-3 py-3 text-sm disabled:opacity-35";
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" className={btn} onClick={onUndo}>
        {t("undo")}
      </button>
      <button type="button" className={btn} onClick={onRedo}>
        {t("redo")}
      </button>
      <button type="button" className={btn} disabled={!hasSelection} onClick={onBringForward}>
        {t("forward")}
      </button>
      <button type="button" className={btn} disabled={!hasSelection} onClick={onSendBack}>
        {t("back")}
      </button>
      <button type="button" className={btn} disabled={!hasSelection} onClick={onDuplicate}>
        {t("duplicate")}
      </button>
      <button type="button" className={btn} disabled={!hasSelection} onClick={onFlip}>
        {t("flip")}
      </button>
      <button type="button" className={btn} disabled={!hasSelection} onClick={onRotate}>
        {t("rotate")}
      </button>
      <button
        type="button"
        className={`${btn} border-highlight/40 text-highlight`}
        disabled={!hasSelection}
        onClick={onDelete}
      >
        {t("delete")}
      </button>
    </div>
  );
}
