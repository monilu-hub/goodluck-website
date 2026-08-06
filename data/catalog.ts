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

export const COLLECTIONS: Collection[] = [
  {
    id: "col-ss26",
    slug: "ss26",
    name: "SS26",
    description: "Colección Spring/Summer 2026 — cortes limpios y color con personalidad.",
    heroImage: "/products/mockups/camiseta-oversized-negro.svg",
    sortOrder: 1,
  },
  {
    id: "col-padre",
    slug: "dia-del-padre-2026",
    name: "Día del Padre 2026",
    description: "Piezas pensadas para regalar — oversized, algodón y detalles GoodLuck.",
    heroImage: "/products/mockups/camiseta-algodon-verde-caqui.svg",
    sortOrder: 2,
  },
  {
    id: "col-mundial",
    slug: "mundial-fifa26",
    name: "Mundial FIFA26",
    description: "Pre-orden edición Mundial — colores vivos listos para la cancha y la calle.",
    heroImage: "/products/designs/mundial-2026/camiseta-roja.svg",
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
    colors: ["negro", "off-white", "beige-oscuro", "gris", "cafe", "verde-oliva", "acid-negro"],
    sizes: SIZES,
    featured: true,
    images: [
      {
        url: "/products/mockups/camiseta-oversized-negro.svg",
        alt: "Camiseta Oversized Fit negro",
        view: "front",
        color: "negro",
      },
      {
        url: "/products/mockups/camiseta-oversized-off-white.svg",
        alt: "Camiseta Oversized Fit off-white",
        view: "front",
        color: "off-white",
      },
      {
        url: "/products/mockups/camiseta-oversized-beige.svg",
        alt: "Camiseta Oversized Fit beige oscuro",
        view: "front",
        color: "beige-oscuro",
      },
    ],
    variants: variants(
      "prod-oversized",
      ["negro", "off-white", "beige-oscuro", "gris", "cafe", "verde-oliva", "acid-negro"],
      89900,
      {
        negro: "/products/mockups/camiseta-oversized-negro.svg",
        "off-white": "/products/mockups/camiseta-oversized-off-white.svg",
        "beige-oscuro": "/products/mockups/camiseta-oversized-beige.svg",
        gris: "/products/mockups/camiseta-oversized-gris.svg",
        cafe: "/products/mockups/camiseta-oversized-cafe.svg",
        "verde-oliva": "/products/mockups/camiseta-oversized-oliva.svg",
        "acid-negro": "/products/mockups/camiseta-oversized-acid.svg",
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
        url: "/products/mockups/camiseta-algodon-rosado.svg",
        alt: "Camiseta algodón rosado apagado",
        view: "front",
        color: "rosado-apagado",
      },
      {
        url: "/products/mockups/camiseta-algodon-verde-caqui.svg",
        alt: "Camiseta algodón verde caqui",
        view: "front",
        color: "verde-caqui",
      },
    ],
    variants: variants(
      "prod-algodon",
      ["rosado-apagado", "verde-caqui"],
      79900,
      {
        "rosado-apagado": "/products/mockups/camiseta-algodon-rosado.svg",
        "verde-caqui": "/products/mockups/camiseta-algodon-verde-caqui.svg",
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
    images: [
      {
        url: "/products/mockups/crop-top-negro.svg",
        alt: "Crop top negro",
        view: "front",
        color: "negro",
      },
    ],
    variants: variants("prod-crop", ["negro", "off-white"], 74900, {
      negro: "/products/mockups/crop-top-negro.svg",
      "off-white": "/products/mockups/crop-top-off-white.svg",
    }),
  },
  {
    id: "prod-padre-oversized",
    slug: "oversized-dia-del-padre",
    name: "Oversized Día del Padre",
    description: "Edición especial Día del Padre 2026. Mismo oversized premium, paleta regalo.",
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
        url: "/products/mockups/camiseta-oversized-cafe.svg",
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
        negro: "/products/mockups/camiseta-oversized-negro.svg",
        cafe: "/products/mockups/camiseta-oversized-cafe.svg",
        "gris-medio": "/products/mockups/camiseta-oversized-gris.svg",
        "beige-oscuro": "/products/mockups/camiseta-oversized-beige.svg",
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
    colors: ["roja", "amarilla", "azul-navy", "azul-rey", "rosada", "baby-blue", "off-white"],
    sizes: SIZES,
    featured: true,
    images: [
      {
        url: "/products/designs/mundial-2026/camiseta-roja.svg",
        alt: "Camiseta Mundial roja",
        view: "front",
        color: "roja",
      },
      {
        url: "/products/designs/mundial-2026/camiseta-amarilla.svg",
        alt: "Camiseta Mundial amarilla",
        view: "front",
        color: "amarilla",
      },
      {
        url: "/products/designs/mundial-2026/camiseta-azul-navy.svg",
        alt: "Camiseta Mundial azul navy",
        view: "front",
        color: "azul-navy",
      },
    ],
    variants: variants(
      "prod-mundial",
      ["roja", "amarilla", "azul-navy", "azul-rey", "rosada", "baby-blue", "off-white"],
      99900,
      {
        roja: "/products/designs/mundial-2026/camiseta-roja.svg",
        amarilla: "/products/designs/mundial-2026/camiseta-amarilla.svg",
        "azul-navy": "/products/designs/mundial-2026/camiseta-azul-navy.svg",
        "azul-rey": "/products/designs/mundial-2026/camiseta-azul-rey.svg",
        rosada: "/products/designs/mundial-2026/camiseta-rosada.svg",
        "baby-blue": "/products/designs/mundial-2026/camiseta-baby-blue.svg",
        "off-white": "/products/designs/mundial-2026/camiseta-off-white.svg",
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
        url: "/products/mockups/camiseta-tela-fria-roja.svg",
        alt: "Camiseta tela fría roja",
        view: "front",
        color: "roja",
      },
    ],
    variants: variants("prod-fria", ["roja", "negro", "azul-navy"], 84900, {
      roja: "/products/mockups/camiseta-tela-fria-roja.svg",
      negro: "/products/mockups/camiseta-oversized-negro.svg",
      "azul-navy": "/products/designs/mundial-2026/camiseta-azul-navy.svg",
    }),
  },
];

export const CUSTOMIZATION_FEE_COP = 15000;
export const SHIPPING_COP = 12000;
export const FREE_SHIPPING_THRESHOLD = 200000;
