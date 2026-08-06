import {
  ARCHETYPE_TIEBREAK,
  getArchetypeById,
  QUIZ_QUESTIONS,
  type ArchetypeId,
  type QuizArchetype,
} from "../../../data/quiz";
import { getProductBySlug } from "@/lib/catalog";
import type { Product } from "@/types";

export type QuizAnswers = Record<string, string>;

export type ArchetypeResult = {
  archetype: QuizArchetype;
  product: Product;
  imageUrl: string;
  designerHref: string;
};

export function scoreAnswers(answers: QuizAnswers): ArchetypeId {
  const scores: Record<ArchetypeId, number> = {
    "mirada-lenta": 0,
    "chispa-abierta": 0,
    "misterio-suave": 0,
    "calor-cercano": 0,
    "confianza-directa": 0,
  };

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [archetypeId, weight] of Object.entries(option.weights)) {
      scores[archetypeId as ArchetypeId] += weight ?? 0;
    }
  }

  let best = ARCHETYPE_TIEBREAK[ARCHETYPE_TIEBREAK.length - 1]!;
  let bestScore = -1;

  for (const id of ARCHETYPE_TIEBREAK) {
    const score = scores[id];
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }

  return best;
}

export function getArchetypeResult(
  archetypeId: ArchetypeId,
  locale: "es" | "en" = "es",
): ArchetypeResult {
  const archetype = getArchetypeById(archetypeId);
  const product = getProductBySlug(archetype.productSlug);
  if (!product) {
    throw new Error(`Product not found for archetype: ${archetypeId}`);
  }

  const color = product.colors.includes(archetype.color)
    ? archetype.color
    : product.colors[0]!;

  const imageUrl =
    product.images.find((i) => i.color === color && i.view === "front")?.url ??
    product.images.find((i) => i.color === color)?.url ??
    product.variants.find((v) => v.color === color)?.imageUrl ??
    product.images[0]?.url ??
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp";

  const phrase = archetype.phrase[locale];
  const params = new URLSearchParams({
    color,
    size: "M",
    frase: phrase,
  });

  return {
    archetype: { ...archetype, color },
    product,
    imageUrl,
    designerHref: `/disenar/${product.slug}?${params.toString()}`,
  };
}

export function recommendFromAnswers(
  answers: QuizAnswers,
  locale: "es" | "en" = "es",
): ArchetypeResult {
  return getArchetypeResult(scoreAnswers(answers), locale);
}
