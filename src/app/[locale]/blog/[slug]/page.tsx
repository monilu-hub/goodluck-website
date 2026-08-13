import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BLOG_POSTS, getPost } from "../../../../../data/blog";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const loc = locale as "es" | "en";
  return {
    title: post.title[loc],
    description: post.excerpt[loc],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getPost(slug);
  if (!post) notFound();
  const loc = locale as "es" | "en";

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/blog" className="text-sm text-muted hover:text-ink">
        ← {t("back")}
      </Link>
      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted">
        {post.publishedAt} · {t("minRead", { min: post.minutes })}
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
        {post.title[loc]}
      </h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-accent-soft/40">
        <Image
          src={post.coverImage}
          alt={post.title[loc]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
        {post.body[loc].map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
