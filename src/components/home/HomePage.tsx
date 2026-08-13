"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FadeUp, ParallaxImage } from "@/components/motion/Parallax";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Link } from "@/i18n/navigation";
import { lookbookPath } from "../../../data/lookbook";
import type { Collection, Product } from "@/types";

const HERO_LOOKBOOK = lookbookPath("camiseta-oversized-fit", "negro");

type Props = {
  collections: Collection[];
  featured: Product[];
};

export function HomePage({ collections, featured }: Props) {
  const t = useTranslations("home");
  const toolFeatures = [
    {
      title: t("toolFeature1Title"),
      body: t("toolFeature1Body"),
    },
    {
      title: t("toolFeature2Title"),
      body: t("toolFeature2Body"),
    },
    {
      title: t("toolFeature3Title"),
      body: t("toolFeature3Body"),
    },
  ] as const;

  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden">
        <ParallaxImage className="absolute inset-0" speed={60}>
          <div className="relative h-[120%] w-full -translate-y-[8%]">
            <Image
              src={HERO_LOOKBOOK}
              alt="GoodLuck"
              fill
              priority
              className="object-cover object-[center_20%]"
              sizes="100vw"
            />
          </div>
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
          <FadeUp>
            <div className="relative mb-4 h-12 w-44 sm:h-14 sm:w-52">
              <Image
                src="/brand/logo.png"
                alt="GoodLuck"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="208px"
                priority
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-display max-w-xl text-4xl font-bold tracking-tight text-surface sm:text-6xl">
              {t("headline")}
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-4 max-w-md text-base text-surface/85">{t("sub")}</p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="rounded-full bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-soft"
              >
                {t("ctaCatalog")}
              </Link>
              <Link
                href="/disenar"
                className="rounded-full border border-surface/70 px-6 py-3 text-sm font-medium text-surface transition hover:bg-surface/10"
              >
                {t("ctaDesign")}
              </Link>
              <Link
                href="/quiz"
                className="rounded-full border border-surface/40 px-6 py-3 text-sm font-medium text-surface/90 transition hover:bg-surface/10"
              >
                {t("ctaQuiz")}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeUp>
          <h2 className="font-display text-3xl font-semibold text-ink">{t("collections")}</h2>
          <p className="mt-2 text-sm text-muted">{t("collectionsSub")}</p>
        </FadeUp>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {collections.map((collection, i) => (
            <FadeUp key={collection.id} delay={i * 0.08}>
              <Link
                href={`/colecciones/${collection.slug}`}
                className="group relative block min-h-72 overflow-hidden md:min-h-80"
              >
                <ParallaxImage className="absolute inset-0" speed={30}>
                  <div className="relative h-[115%] w-full">
                    <Image
                      src={collection.heroImage}
                      alt={collection.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </ParallaxImage>
                <div className="absolute inset-0 bg-ink/40 transition group-hover:bg-ink/50" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-surface">
                  <h3 className="font-display text-xl font-semibold">{collection.name}</h3>
                  <p className="mt-1 text-sm text-surface/80">{collection.description}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border/60 py-16 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_20%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_60%),radial-gradient(700px_380px_at_90%_80%,color-mix(in_oklab,var(--highlight)_14%,transparent),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <FadeUp>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-highlight">
                {t("toolDelivery")}
              </p>
              <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("toolTitle")}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                {t("toolSub")}
              </p>
            </FadeUp>

            <ul className="mt-8 space-y-5">
              {toolFeatures.map((feature, i) => (
                <FadeUp key={feature.title} delay={0.08 + i * 0.06}>
                  <li className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-1 font-display text-sm font-semibold text-accent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-ink">
                        {feature.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {feature.body}
                      </p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ul>

            <FadeUp delay={0.3}>
              <Link
                href="/disenar"
                className="mt-10 inline-flex rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-surface transition hover:bg-accent"
              >
                {t("toolCta")}
              </Link>
            </FadeUp>
          </div>

          <FadeUp delay={0.12}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-ink shadow-[0_24px_60px_-28px_rgba(18,16,14,0.55)] lg:max-w-none">
              <Image
                src={HERO_LOOKBOOK}
                alt=""
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-surface sm:p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-surface/70">
                  GoodLuck Designer
                </p>
                <p className="font-display mt-1 text-lg font-semibold sm:text-xl">
                  {t("toolDelivery")}
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeUp>
          <h2 className="font-display text-3xl font-semibold text-ink">{t("featured")}</h2>
          <p className="mt-2 text-sm text-muted">{t("featuredSub")}</p>
        </FadeUp>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/products/mockups/el.webp"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <FadeUp>
            <h2 className="font-display max-w-lg text-4xl font-bold text-surface">
              {t("designCta")}
            </h2>
            <p className="mt-3 max-w-md text-surface/80">{t("designCtaSub")}</p>
            <Link
              href="/disenar"
              className="mt-8 inline-flex rounded-full bg-highlight px-6 py-3 text-sm font-medium text-surface transition hover:brightness-110"
            >
              {t("ctaDesign")}
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
