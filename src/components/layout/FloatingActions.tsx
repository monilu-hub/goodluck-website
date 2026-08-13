"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { PersonalityQuiz } from "@/components/quiz/PersonalityQuiz";
import { usePathname } from "@/i18n/navigation";
import {
  buildWhatsAppUrl,
  contextualVars,
  resolveWhatsAppKey,
} from "@/lib/whatsapp";

export function FloatingActions() {
  const tQuiz = useTranslations("quiz");
  const tWa = useTranslations("whatsapp");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openForPath, setOpenForPath] = useState(pathname);

  if (openForPath !== pathname) {
    setOpenForPath(pathname);
    if (open) setOpen(false);
  }

  const onQuizPage = pathname.includes("/quiz");

  const waHref = useMemo(() => {
    const { key } = resolveWhatsAppKey(pathname);
    const vars = contextualVars(pathname);
    const message = tWa.has(key)
      ? tWa(key as "home", vars)
      : tWa("default");
    return buildWhatsAppUrl(message);
  }, [pathname, tWa]);

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && !onQuizPage && (
        <div className="flex max-h-[min(78vh,640px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-border bg-ink px-4 py-3 text-surface">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-surface/70">
                {tQuiz("chatEyebrow")}
              </p>
              <p className="font-display mt-1 text-base font-semibold">
                {tQuiz("fabLabel")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-2 py-1 text-sm text-surface/80 hover:text-surface"
              aria-label={tQuiz("fabClose")}
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto px-4 py-4">
            <p className="mb-4 text-xs leading-relaxed text-muted">
              {tQuiz("chatIntro")}
            </p>
            <PersonalityQuiz />
          </div>
        </div>
      )}

      {!onQuizPage && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-surface shadow-lg transition hover:bg-accent"
          aria-expanded={open}
          aria-label={open ? tQuiz("fabClose") : tQuiz("fabOpen")}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-xs font-bold">
            ?
          </span>
          <span className="pr-1">{tQuiz("fabLabel")}</span>
        </button>
      )}

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:brightness-110"
        aria-label={tWa("aria")}
        title={tWa("label")}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M20.5 3.5A10.5 10.5 0 0 0 3.2 17.3L2 22l4.9-1.3A10.5 10.5 0 1 0 20.5 3.5zm-8 16.4a8.7 8.7 0 0 1-4.4-1.2l-.3-.2-2.9.8.8-2.8-.2-.3a8.7 8.7 0 1 1 7 3.7zm4.8-6.5c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.1 7.1 0 0 1-2.1-1.3 7.8 7.8 0 0 1-1.4-1.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4s-1 1-1 2.4 1 2.7 1.2 2.9a10 10 0 0 0 3.5 3.1c1.3.6 1.8.6 2.5.5.4-.1 1.6-.6 1.8-1.3s.2-1.1.2-1.2-.2-.2-.4-.3z" />
        </svg>
      </a>
    </div>
  );
}
