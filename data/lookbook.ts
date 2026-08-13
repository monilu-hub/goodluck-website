import type { Product } from "@/types";
import { defaultModelForGender } from "./models";

/** Lookbook path we generate offline with Grok. */
export function lookbookPath(
  productSlug: string,
  color: string,
  camera: "front" | "back" = "front",
) {
  const c = color.toLowerCase().replace(/\s+/g, "-");
  return `/products/lookbook/${productSlug}/${c}/${camera}.webp`;
}

/** Prefer lookbook when present in product.images; else first image / mockup. */
export function productHeroUrl(product: Product, color?: string) {
  const want = color ?? product.colors[0];
  if (want) {
    const look = product.images.find(
      (i) => i.color === want && i.view === "front" && i.url.includes("/lookbook/"),
    );
    if (look) return look.url;
    const byColor = product.images.find((i) => i.color === want);
    if (byColor) return byColor.url;
  }
  const lookAny = product.images.find((i) => i.url.includes("/lookbook/"));
  if (lookAny) return lookAny.url;
  return (
    product.images[0]?.url ??
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp"
  );
}

export function productImagesForColor(product: Product, color: string) {
  const colored = product.images.filter((i) => i.color === color);
  if (colored.length) return colored;
  return product.images;
}

export function defaultLookbookModelId(product: Product) {
  return defaultModelForGender(product.gender).id;
}
