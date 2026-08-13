import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BLOG_POSTS } from "../../../../data/blog";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const loc = locale as "es" | "en";
  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-10 max-w-xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-muted">{t("subtitle")}</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-accent-soft/40">
              <Image
                src={post.coverImage}
                alt={post.title[loc]}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted">
              {post.publishedAt} · {t("minRead", { min: post.minutes })}
            </p>
            <h2 className="font-display mt-2 text-xl font-semibold text-ink">
              {post.title[loc]}
            </h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt[loc]}</p>
            <span className="mt-3 inline-block text-sm text-accent">{t("read")} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
