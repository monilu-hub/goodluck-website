export function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001112233";
  return raw.replace(/[^\d]/g, "");
}

export function buildWhatsAppUrl(message: string) {
  const phone = getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

type WaContext = {
  pathname: string;
  productName?: string;
  collectionName?: string;
};

/** Pick a contextual WhatsApp seed message from the current route. */
export function resolveWhatsAppKey(pathname: string): {
  key: string;
  vars?: Record<string, string>;
} {
  const path = pathname.replace(/^\/(es|en)/, "") || "/";

  if (path.startsWith("/catalogo/") && path !== "/catalogo/") {
    return { key: "product" };
  }
  if (path.startsWith("/catalogo")) return { key: "catalog" };
  if (path.startsWith("/colecciones/")) return { key: "collection" };
  if (path.startsWith("/disenar")) return { key: "designer" };
  if (path.startsWith("/quiz")) return { key: "quiz" };
  if (path.startsWith("/checkout")) return { key: "checkout" };
  if (path.startsWith("/blog")) return { key: "blog" };
  if (
    path.startsWith("/preguntas-frecuentes") ||
    path.startsWith("/terminos") ||
    path.startsWith("/privacidad")
  ) {
    return { key: "legal" };
  }
  if (path === "/" || path === "") return { key: "home" };
  return { key: "default" };
}

export function contextualVars(
  pathname: string,
  ctx?: WaContext,
): Record<string, string> {
  const path = pathname.replace(/^\/(es|en)/, "") || "/";
  const vars: Record<string, string> = {};

  if (ctx?.productName) vars.name = ctx.productName;
  if (ctx?.collectionName) vars.name = ctx.collectionName;

  if (!vars.name && path.startsWith("/catalogo/")) {
    vars.name = decodeURIComponent(path.split("/")[2] || "esta prenda").replace(
      /-/g,
      " ",
    );
  }
  if (!vars.name && path.startsWith("/colecciones/")) {
    vars.name = decodeURIComponent(path.split("/")[2] || "esta colección").replace(
      /-/g,
      " ",
    );
  }
  return vars;
}
