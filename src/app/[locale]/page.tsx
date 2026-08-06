import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/home/HomePage";
import { getCollections, getFeaturedProducts } from "@/lib/catalog";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const collections = getCollections();
  const featured = getFeaturedProducts();

  return <HomePage collections={collections} featured={featured} />;
}
