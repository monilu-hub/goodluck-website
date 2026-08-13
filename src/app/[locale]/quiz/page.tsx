import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PersonalityQuiz } from "@/components/quiz/PersonalityQuiz";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quiz" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function QuizPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "quiz" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {t("chatEyebrow")}
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{t("subtitle")}</p>
      </div>
      <PersonalityQuiz />
    </div>
  );
}
