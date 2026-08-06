"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { QUIZ_QUESTIONS } from "../../../data/quiz";
import { FadeUp } from "@/components/motion/Parallax";
import { Link } from "@/i18n/navigation";
import {
  recommendFromAnswers,
  type QuizAnswers,
} from "@/lib/quiz/recommend";

type Phase = "quiz" | "result";

export function PersonalityQuiz() {
  const t = useTranslations("quiz");
  const locale = useLocale() as "es" | "en";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [phase, setPhase] = useState<Phase>("quiz");

  const question = QUIZ_QUESTIONS[step];
  const progress = ((step + (phase === "result" ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  const result = useMemo(() => {
    if (phase !== "result") return null;
    if (Object.keys(answers).length < QUIZ_QUESTIONS.length) return null;
    return recommendFromAnswers(answers, locale);
  }, [answers, locale, phase]);

  function selectOption(optionId: string) {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    if (step >= QUIZ_QUESTIONS.length - 1) {
      setPhase("result");
      return;
    }
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setPhase("quiz");
  }

  if (phase === "result" && result) {
    const { archetype, product, imageUrl, designerHref } = result;

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: "100%" }} />
        </div>

        <FadeUp>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">{t("yourMatch")}</p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {archetype.name[locale]}
          </h2>
          <p className="mt-3 max-w-lg text-base text-foreground/85">
            {archetype.tagline[locale]}
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted">
            {archetype.profileNotes[locale]}
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-10 grid items-center gap-8 sm:grid-cols-[minmax(0,240px)_1fr]">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden bg-surface">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="240px"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("yourPhrase")}</p>
              <p className="font-display mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                “{archetype.phrase[locale]}”
              </p>
              <p className="mt-4 text-sm text-muted">
                {product.name} · {archetype.color.replace(/-/g, " ")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={designerHref}
                  className="rounded-full bg-highlight px-6 py-3 text-sm font-medium text-surface transition hover:brightness-110"
                >
                  {t("ctaPersonalize")}
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full border border-border px-6 py-3 text-sm font-medium text-ink transition hover:bg-surface"
                >
                  {t("retake")}
                </button>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>

      <FadeUp key={question.id}>
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {t("progress", { current: step + 1, total: QUIZ_QUESTIONS.length })}
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {question.prompt[locale]}
        </h2>

        <ul className="mt-8 space-y-3">
          {question.options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => selectOption(option.id)}
                className="w-full border border-border bg-surface/60 px-5 py-4 text-left text-sm text-ink transition hover:border-accent hover:bg-surface"
              >
                {option.label[locale]}
              </button>
            </li>
          ))}
        </ul>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="mt-6 text-sm text-muted transition hover:text-ink"
          >
            ← {t("back")}
          </button>
        )}
      </FadeUp>
    </div>
  );
}
