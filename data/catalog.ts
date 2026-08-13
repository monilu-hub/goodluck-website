import type { Collection, Product, ProductImage } from "@/types";
import { colorHex } from "@/lib/colors";
import { lookbookPath } from "./lookbook";

const SIZES = ["S", "M", "L", "XL"];

/** Lookbook first (model wearing garment), mockup as fallback entry. */
function catalogImages(
  slug: string,
  entries: Array<{
    color: string;
    front: string;
    back?: string;
    alt: string;
  }>,
): ProductImage[] {
  const out: ProductImage[] = [];
  for (const e of entries) {
    out.push({
      url: lookbookPath(slug, e.color, "front"),
      alt: `${e.alt} · lookbook`,
      view: "front",
      color: e.color,
    });
    if (e.back) {
      out.push({
        url: lookbookPath(slug, e.color, "back"),
        alt: `${e.alt} espalda · lookbook`,
        view: "back",
        color: e.color,
      });
    }
    out.push({
      url: e.front,
      alt: e.alt,
      view: "front",
      color: e.color,
    });
    if (e.back) {
      out.push({
        url: e.back,
        alt: `${e.alt} espalda`,
        view: "back",
        color: e.color,
      });
    }
  }
  return out;
}

function variants(
  productId: string,
  colors: string[],
  price: number,
  imagesByColor: Record<string, string>,
) {
  return colors.flatMap((color) =>
    SIZES.map((size) => ({
      id: `${productId}-${color}-${size}`.toLowerCase().replace(/\s+/g, "-"),
      sku: `GL-${productId.slice(0, 4).toUpperCase()}-${color.slice(0, 3).toUpperCase()}-${size}`,
      color,
      colorHex: colorHex(color),
      size,
      priceCop: price,
      stock: 12,
      imageUrl: imagesByColor[color],
    })),
  );
}

const IMG = {
  oversizedNegro:
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp",
  oversizedNegroBack:
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-back.webp",
  oversizedOff:
    "/products/mockups/camiseta-oversized-fit-off-white.webp",
  oversizedBeige:
    "/products/mockups/camiseta-oversized-fit-beige-oscuro-h-m-co.webp",
  oversizedGris: "/products/mockups/camiseta-oversized-fit-gris.webp",
  oversizedCafe: "/products/mockups/camiseta-oversized-fit-cafe.webp",
  oversizedOliva:
    "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-verde-oliva.webp",
  oversizedAcid:
    "/products/mockups/camiseta-oversized-fit-negro-acid-wash-negro.webp",
  algodonRosado:
    "/products/mockups/camiseta-de-algodon-rosado-apagado-oscuro-h-m-co.webp",
  algodonCaqui:
    "/products/mockups/camiseta-en-algodon-verde-caqui-h-m-co.webp",
  crop: "/products/mockups/crop-top-femenino.webp",
  cropAlt: "/products/mockups/camiseta-oversized-crop-top-fem.webp",
  mundialRoja: "/products/designs/mundial-2026/camiseta-roja-front.webp",
  mundialAmarilla:
    "/products/designs/mundial-2026/camiseta-amarilla-front.webp",
  mundialNavy: "/products/designs/mundial-2026/camiseta-azul-navy-front.webp",
  mundialRey: "/products/designs/mundial-2026/camiseta-azul-rey-front.webp",
  mundialRosada: "/products/designs/mundial-2026/camiseta-rosada-front.webp",
  mundialBaby: "/products/designs/mundial-2026/camiseta-babyblue-front.webp",
  mundialOff: "/products/designs/mundial-2026/camiseta-offwhite-front.webp",
  hero: "/products/mockups/el.webp",
  siluetas: "/products/mockups/siluetas.webp",
};

export const COLLECTIONS: Collection[] = [
  {
    id: "col-ss26",
    slug: "ss26",
    name: "SS26",
    description:
      "Colección Spring/Summer 2026 — cortes limpios y color con personalidad.",
    heroImage: lookbookPath("camiseta-oversized-fit", "negro"),
    sortOrder: 1,
  },
  {
    id: "col-padre",
    slug: "dia-del-padre-2026",
    name: "Día del Padre 2026",
    description:
      "Piezas pensadas para regalar — oversized, algodón y detalles GoodLuck.",
    heroImage: lookbookPath("oversized-dia-del-padre", "cafe"),
    sortOrder: 2,
  },
  {
    id: "col-mundial",
    slug: "mundial-fifa26",
    name: "Mundial FIFA26",
    description:
      "Pre-orden edición Mundial — colores vivos listos para la cancha y la calle.",
    heroImage: lookbookPath("camiseta-mundial-fifa26", "roja"),
    sortOrder: 3,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-oversized",
    slug: "camiseta-oversized-fit",
    name: "Camiseta Oversized Fit",
    description:
      "Corte oversized con caída relajada. Algodón premium, ideal para personalizar o usar en blanco.",
    collectionId: "col-ss26",
    collectionSlug: "ss26",
    type: "oversized",
    gender: "unisex",
    basePriceCop: 89900,
    isCustomizable: true,
    colors: [
      "negro",
      "off-white",
      "beige-oscuro",
      "gris",
      "cafe",
      "verde-oliva",
      "acid-negro",
    ],
    sizes: SIZES,
    featured: true,
    images: catalogImages("camiseta-oversized-fit", [
      {
        color: "negro",
        front: IMG.oversizedNegro,
        back: IMG.oversizedNegroBack,
        alt: "Camiseta Oversized Fit negro",
      },
      {
        color: "off-white",
        front: IMG.oversizedOff,
        alt: "Camiseta Oversized Fit off-white",
      },
      {
        color: "beige-oscuro",
        front: IMG.oversizedBeige,
        alt: "Camiseta Oversized Fit beige",
      },
      { color: "gris", front: IMG.oversizedGris, alt: "Camiseta Oversized Fit gris" },
      { color: "cafe", front: IMG.oversizedCafe, alt: "Camiseta Oversized Fit café" },
      {
        color: "verde-oliva",
        front: IMG.oversizedOliva,
        alt: "Camiseta Oversized Fit oliva",
      },
      {
        color: "acid-negro",
        front: IMG.oversizedAcid,
        alt: "Camiseta Oversized Fit acid",
      },
    ]),
    variants: variants(
      "prod-oversized",
      [
        "negro",
        "off-white",
        "beige-oscuro",
        "gris",
        "cafe",
        "verde-oliva",
        "acid-negro",
      ],
      89900,
      {
        negro: lookbookPath("camiseta-oversized-fit", "negro"),
        "off-white": lookbookPath("camiseta-oversized-fit", "off-white"),
        "beige-oscuro": lookbookPath("camiseta-oversized-fit", "beige-oscuro"),
        gris: lookbookPath("camiseta-oversized-fit", "gris"),
        cafe: lookbookPath("camiseta-oversized-fit", "cafe"),
        "verde-oliva": lookbookPath("camiseta-oversized-fit", "verde-oliva"),
        "acid-negro": lookbookPath("camiseta-oversized-fit", "acid-negro"),
      },
    ),
  },
  {
    id: "prod-algodon",
    slug: "camiseta-algodon",
    name: "Camiseta de Algodón",
    description:
      "Fit clásico en algodón suave. Colores SS26 con acabado mate y costuras reforzadas.",
    collectionId: "col-ss26",
    collectionSlug: "ss26",
    type: "camiseta-algodon",
    gender: "hombre",
    basePriceCop: 79900,
    isCustomizable: true,
    colors: ["rosado-apagado", "verde-caqui"],
    sizes: SIZES,
    featured: true,
    images: catalogImages("camiseta-algodon", [
      {
        color: "rosado-apagado",
        front: IMG.algodonRosado,
        alt: "Camiseta algodón rosado",
      },
      {
        color: "verde-caqui",
        front: IMG.algodonCaqui,
        alt: "Camiseta algodón caqui",
      },
    ]),
    variants: variants(
      "prod-algodon",
      ["rosado-apagado", "verde-caqui"],
      79900,
      {
        "rosado-apagado": lookbookPath("camiseta-algodon", "rosado-apagado"),
        "verde-caqui": lookbookPath("camiseta-algodon", "verde-caqui"),
      },
    ),
  },
  {
    id: "prod-crop",
    slug: "crop-top-femenino",
    name: "Crop Top Femenino",
    description: "Crop top con corte contemporáneo. Perfecto para looks de temporada.",
    collectionId: "col-ss26",
    collectionSlug: "ss26",
    type: "crop-top",
    gender: "mujer",
    basePriceCop: 74900,
    isCustomizable: true,
    colors: ["negro", "off-white"],
    sizes: SIZES,
    featured: true,
    images: catalogImages("crop-top-femenino", [
      { color: "negro", front: IMG.crop, alt: "Crop top negro" },
      { color: "off-white", front: IMG.cropAlt, alt: "Crop top off-white" },
    ]),
    variants: variants("prod-crop", ["negro", "off-white"], 74900, {
      negro: lookbookPath("crop-top-femenino", "negro"),
      "off-white": lookbookPath("crop-top-femenino", "off-white"),
    }),
  },
  {
    id: "prod-padre-oversized",
    slug: "oversized-dia-del-padre",
    name: "Oversized Día del Padre",
    description:
      "Edición especial Día del Padre 2026. Mismo oversized premium, paleta regalo.",
    collectionId: "col-padre",
    collectionSlug: "dia-del-padre-2026",
    type: "oversized",
    gender: "hombre",
    basePriceCop: 94900,
    isCustomizable: true,
    colors: ["negro", "cafe", "gris-medio", "beige-oscuro"],
    sizes: SIZES,
    featured: true,
    images: catalogImages("oversized-dia-del-padre", [
      { color: "cafe", front: IMG.oversizedCafe, alt: "Oversized Día del Padre café" },
      { color: "negro", front: IMG.oversizedNegro, alt: "Oversized Día del Padre negro" },
      {
        color: "gris-medio",
        front: "/products/mockups/camiseta-oversized-fit-gris-medio.webp",
        alt: "Oversized Día del Padre gris",
      },
      {
        color: "beige-oscuro",
        front: IMG.oversizedBeige,
        alt: "Oversized Día del Padre beige",
      },
    ]),
    variants: variants(
      "prod-padre",
      ["negro", "cafe", "gris-medio", "beige-oscuro"],
      94900,
      {
        negro: lookbookPath("oversized-dia-del-padre", "negro"),
        cafe: lookbookPath("oversized-dia-del-padre", "cafe"),
        "gris-medio": lookbookPath("oversized-dia-del-padre", "gris-medio"),
        "beige-oscuro": lookbookPath("oversized-dia-del-padre", "beige-oscuro"),
      },
    ),
  },
  {
    id: "prod-mundial",
    slug: "camiseta-mundial-fifa26",
    name: "Camiseta Mundial FIFA26",
    description:
      "Pre-orden edición Mundial. Diseños vibrantes en tela lista para personalizar o llevar como está.",
    collectionId: "col-mundial",
    collectionSlug: "mundial-fifa26",
    type: "tela-fria",
    gender: "unisex",
    basePriceCop: 99900,
    isCustomizable: true,
    colors: [
      "roja",
      "amarilla",
      "azul-navy",
      "azul-rey",
      "rosada",
      "baby-blue",
      "off-white",
    ],
    sizes: SIZES,
    featured: true,
    images: catalogImages("camiseta-mundial-fifa26", [
      { color: "roja", front: IMG.mundialRoja, alt: "Camiseta Mundial roja" },
      {
        color: "amarilla",
        front: IMG.mundialAmarilla,
        alt: "Camiseta Mundial amarilla",
      },
      {
        color: "azul-navy",
        front: IMG.mundialNavy,
        alt: "Camiseta Mundial navy",
      },
      { color: "azul-rey", front: IMG.mundialRey, alt: "Camiseta Mundial azul rey" },
      { color: "rosada", front: IMG.mundialRosada, alt: "Camiseta Mundial rosada" },
      {
        color: "baby-blue",
        front: IMG.mundialBaby,
        alt: "Camiseta Mundial baby blue",
      },
      {
        color: "off-white",
        front: IMG.mundialOff,
        alt: "Camiseta Mundial off-white",
      },
    ]),
    variants: variants(
      "prod-mundial",
      [
        "roja",
        "amarilla",
        "azul-navy",
        "azul-rey",
        "rosada",
        "baby-blue",
        "off-white",
      ],
      99900,
      {
        roja: lookbookPath("camiseta-mundial-fifa26", "roja"),
        amarilla: lookbookPath("camiseta-mundial-fifa26", "amarilla"),
        "azul-navy": lookbookPath("camiseta-mundial-fifa26", "azul-navy"),
        "azul-rey": lookbookPath("camiseta-mundial-fifa26", "azul-rey"),
        rosada: lookbookPath("camiseta-mundial-fifa26", "rosada"),
        "baby-blue": lookbookPath("camiseta-mundial-fifa26", "baby-blue"),
        "off-white": lookbookPath("camiseta-mundial-fifa26", "off-white"),
      },
    ),
  },
  {
    id: "prod-tela-fria",
    slug: "camiseta-tela-fria",
    name: "Camiseta Tela Fría",
    description: "Tejido técnico fresco para clima cálido. Ligera, de secado rápido.",
    collectionId: "col-ss26",
    collectionSlug: "ss26",
    type: "tela-fria",
    gender: "unisex",
    basePriceCop: 84900,
    isCustomizable: true,
    colors: ["roja", "negro", "azul-navy"],
    sizes: SIZES,
    images: catalogImages("camiseta-tela-fria", [
      { color: "roja", front: IMG.mundialRoja, alt: "Camiseta tela fría roja" },
      { color: "negro", front: IMG.oversizedNegro, alt: "Camiseta tela fría negro" },
      {
        color: "azul-navy",
        front: IMG.mundialNavy,
        alt: "Camiseta tela fría navy",
      },
    ]),
    variants: variants("prod-fria", ["roja", "negro", "azul-navy"], 84900, {
      roja: lookbookPath("camiseta-tela-fria", "roja"),
      negro: lookbookPath("camiseta-tela-fria", "negro"),
      "azul-navy": lookbookPath("camiseta-tela-fria", "azul-navy"),
    }),
  },
];

export const HERO_IMAGE = IMG.hero;
export const SILUETAS_IMAGE = IMG.siluetas;
export const CUSTOMIZATION_FEE_COP = 15000;
export const SHIPPING_COP = 12000;
export const FREE_SHIPPING_THRESHOLD = 200000;
