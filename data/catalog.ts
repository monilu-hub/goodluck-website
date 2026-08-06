import type { Collection, Product } from "@/types";
import { colorHex } from "@/lib/colors";

const SIZES = ["S", "M", "L", "XL"];

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
    heroImage: IMG.oversizedNegro,
    sortOrder: 1,
  },
  {
    id: "col-padre",
    slug: "dia-del-padre-2026",
    name: "Día del Padre 2026",
    description:
      "Piezas pensadas para regalar — oversized, algodón y detalles GoodLuck.",
    heroImage: IMG.oversizedCafe,
    sortOrder: 2,
  },
  {
    id: "col-mundial",
    slug: "mundial-fifa26",
    name: "Mundial FIFA26",
    description:
      "Pre-orden edición Mundial — colores vivos listos para la cancha y la calle.",
    heroImage: IMG.mundialRoja,
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
    images: [
      {
        url: IMG.oversizedNegro,
        alt: "Camiseta Oversized Fit negro",
        view: "front",
        color: "negro",
      },
      {
        url: IMG.oversizedNegroBack,
        alt: "Camiseta Oversized Fit negro espalda",
        view: "back",
        color: "negro",
      },
      {
        url: IMG.oversizedOff,
        alt: "Camiseta Oversized Fit off-white",
        view: "front",
        color: "off-white",
      },
      {
        url: IMG.oversizedBeige,
        alt: "Camiseta Oversized Fit beige",
        view: "front",
        color: "beige-oscuro",
      },
    ],
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
        negro: IMG.oversizedNegro,
        "off-white": IMG.oversizedOff,
        "beige-oscuro": IMG.oversizedBeige,
        gris: IMG.oversizedGris,
        cafe: IMG.oversizedCafe,
        "verde-oliva": IMG.oversizedOliva,
        "acid-negro": IMG.oversizedAcid,
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
    images: [
      {
        url: IMG.algodonRosado,
        alt: "Camiseta algodón rosado",
        view: "front",
        color: "rosado-apagado",
      },
      {
        url: IMG.algodonCaqui,
        alt: "Camiseta algodón caqui",
        view: "front",
        color: "verde-caqui",
      },
    ],
    variants: variants(
      "prod-algodon",
      ["rosado-apagado", "verde-caqui"],
      79900,
      {
        "rosado-apagado": IMG.algodonRosado,
        "verde-caqui": IMG.algodonCaqui,
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
    images: [
      {
        url: IMG.crop,
        alt: "Crop top negro",
        view: "front",
        color: "negro",
      },
      {
        url: IMG.cropAlt,
        alt: "Crop top oversized",
        view: "front",
        color: "off-white",
      },
    ],
    variants: variants("prod-crop", ["negro", "off-white"], 74900, {
      negro: IMG.crop,
      "off-white": IMG.cropAlt,
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
    images: [
      {
        url: IMG.oversizedCafe,
        alt: "Oversized Día del Padre café",
        view: "front",
        color: "cafe",
      },
    ],
    variants: variants(
      "prod-padre",
      ["negro", "cafe", "gris-medio", "beige-oscuro"],
      94900,
      {
        negro: IMG.oversizedNegro,
        cafe: IMG.oversizedCafe,
        "gris-medio": "/products/mockups/camiseta-oversized-fit-gris-medio.webp",
        "beige-oscuro": IMG.oversizedBeige,
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
    images: [
      {
        url: IMG.mundialRoja,
        alt: "Camiseta Mundial roja",
        view: "front",
        color: "roja",
      },
      {
        url: IMG.mundialAmarilla,
        alt: "Camiseta Mundial amarilla",
        view: "front",
        color: "amarilla",
      },
      {
        url: IMG.mundialNavy,
        alt: "Camiseta Mundial navy",
        view: "front",
        color: "azul-navy",
      },
    ],
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
        roja: IMG.mundialRoja,
        amarilla: IMG.mundialAmarilla,
        "azul-navy": IMG.mundialNavy,
        "azul-rey": IMG.mundialRey,
        rosada: IMG.mundialRosada,
        "baby-blue": IMG.mundialBaby,
        "off-white": IMG.mundialOff,
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
    images: [
      {
        url: IMG.mundialRoja,
        alt: "Camiseta tela fría roja",
        view: "front",
        color: "roja",
      },
    ],
    variants: variants("prod-fria", ["roja", "negro", "azul-navy"], 84900, {
      roja: IMG.mundialRoja,
      negro: IMG.oversizedNegro,
      "azul-navy": IMG.mundialNavy,
    }),
  },
];

export const HERO_IMAGE = IMG.hero;
export const SILUETAS_IMAGE = IMG.siluetas;
export const CUSTOMIZATION_FEE_COP = 15000;
export const SHIPPING_COP = 12000;
export const FREE_SHIPPING_THRESHOLD = 200000;
