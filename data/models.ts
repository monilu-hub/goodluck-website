export type ModelGender = "male" | "female";

export type CuratedModel = {
  id: string;
  name: string;
  gender: ModelGender;
  /** Default height in centimeters */
  heightCm: number;
  size: "XS" | "S" | "M" | "L" | "XL";
  imageUrl: string;
  /** Normalized torso box for design overlay (0–1 relative to image) */
  torso: { x: number; y: number; w: number; h: number };
};

export const MODELS: CuratedModel[] = [
  {
    id: "male-m-175",
    name: "Andrés",
    gender: "male",
    heightCm: 175,
    size: "M",
    imageUrl: "/products/mockups/camiseta-oversized-fit-negro-h-m-co-1-front.webp",
    torso: { x: 0.28, y: 0.22, w: 0.44, h: 0.42 },
  },
  {
    id: "male-l-182",
    name: "Mateo",
    gender: "male",
    heightCm: 182,
    size: "L",
    imageUrl: "/products/mockups/camiseta-oversized-fit-off-white.webp",
    torso: { x: 0.27, y: 0.2, w: 0.46, h: 0.44 },
  },
  {
    id: "male-s-170",
    name: "Diego",
    gender: "male",
    heightCm: 170,
    size: "S",
    imageUrl: "/products/mockups/camiseta-oversized-fit-cafe.webp",
    torso: { x: 0.29, y: 0.23, w: 0.42, h: 0.4 },
  },
  {
    id: "female-s-165",
    name: "Valentina",
    gender: "female",
    heightCm: 165,
    size: "S",
    imageUrl: "/products/mockups/crop-top-femenino.webp",
    torso: { x: 0.3, y: 0.24, w: 0.4, h: 0.36 },
  },
  {
    id: "female-m-170",
    name: "Camila",
    gender: "female",
    heightCm: 170,
    size: "M",
    imageUrl: "/products/mockups/camiseta-oversized-crop-top-fem.webp",
    torso: { x: 0.29, y: 0.22, w: 0.42, h: 0.38 },
  },
  {
    id: "female-l-178",
    name: "Lucía",
    gender: "female",
    heightCm: 178,
    size: "L",
    imageUrl: "/products/mockups/camiseta-de-algodon-rosado-apagado-oscuro-h-m-co.webp",
    torso: { x: 0.28, y: 0.21, w: 0.44, h: 0.4 },
  },
];

export function cmToInches(cm: number) {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function inchesToCm(inches: number) {
  return Math.round(inches * 2.54);
}

export function heightLabel(cm: number) {
  return `${cm} cm / ${cmToInches(cm)} in`;
}

export function modelsFor(gender: ModelGender, size?: string) {
  return MODELS.filter(
    (m) => m.gender === gender && (!size || m.size === size),
  );
}
