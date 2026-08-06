"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { PRINTS } from "../../../data/prints";
import { FadeUp, ParallaxImage } from "@/components/motion/Parallax";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Link } from "@/i18n/navigation";
import type { Collection, Product } from "@/types";

type Props = {
  collections: Collection[];
  featured: Product[];
};

export function HomePage({ collections, featured }: Props) {
  const t = useTranslations("home");
  const printRail = PRINTS.filter((p) => !p.name.includes("back")).slice(0, 16);

  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden">
        <ParallaxImage className="absolute inset-0" speed={60}>
          <div className="relative h-[120%] w-full -translate-y-[8%]">
            <Image
              src="/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp"
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
            <div className="relative mb-4 h-12 w-40 sm:h-14 sm:w-48">
              <Image
                src="/brand/logo.webp"
                alt="GoodLuck"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="192px"
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

      <section className="border-y border-border/60 bg-surface/50 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <FadeUp>
            <h2 className="font-display text-3xl font-semibold text-ink">{t("prints")}</h2>
            <p className="mt-2 text-sm text-muted">{t("printsSub")}</p>
          </FadeUp>
        </div>
        <div className="mt-8 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:px-6">
          {printRail.map((print, i) => (
            <FadeUp key={print.id} delay={Math.min(i, 6) * 0.04} className="shrink-0">
              <Link
                href="/disenar"
                className="group relative block h-44 w-36 overflow-hidden sm:h-56 sm:w-44"
              >
                <Image
                  src={print.url}
                  alt={print.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="176px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-2">
                  <p className="truncate text-[11px] text-surface">{print.name}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
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
