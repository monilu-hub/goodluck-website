export type ModelGender = "male" | "female";
export type ModelCamera = "front" | "side" | "back";
export type GarmentCut = "tee" | "crop";

export type CuratedModel = {
  id: string;
  name: string;
  gender: ModelGender;
  /** Default height in centimeters */
  heightCm: number;
  size: "XS" | "S" | "M" | "L" | "XL";
  /** Legacy/source front photo (used to bootstrap the library) */
  sourceImageUrl: string;
  /** Normalized torso box for design overlay (0–1 relative to image) — front */
  torso: { x: number; y: number; w: number; h: number };
};

export const MODEL_CAMERAS: ModelCamera[] = ["front", "side", "back"];
export const HEIGHT_MIN = 150;
export const HEIGHT_MAX = 190;
export const HEIGHT_STEP = 10;
export const HEIGHT_BANDS = [150, 160, 170, 180, 190] as const;
export type HeightBand = (typeof HEIGHT_BANDS)[number];

export const MODELS: CuratedModel[] = [
  {
    id: "male-andres",
    name: "Andrés",
    gender: "male",
    heightCm: 170,
    size: "M",
    sourceImageUrl: "/models/model-male-andres.webp",
    torso: { x: 0.3, y: 0.28, w: 0.4, h: 0.34 },
  },
  {
    id: "male-mateo",
    name: "Mateo",
    gender: "male",
    heightCm: 180,
    size: "L",
    sourceImageUrl: "/models/model-male-mateo.webp",
    torso: { x: 0.29, y: 0.3, w: 0.42, h: 0.34 },
  },
  {
    id: "male-diego",
    name: "Diego",
    gender: "male",
    heightCm: 170,
    size: "S",
    sourceImageUrl: "/models/model-male-diego.webp",
    torso: { x: 0.3, y: 0.32, w: 0.4, h: 0.33 },
  },
  {
    id: "female-valentina",
    name: "Valentina",
    gender: "female",
    heightCm: 160,
    size: "S",
    sourceImageUrl: "/models/model-female-valentina.webp",
    torso: { x: 0.3, y: 0.3, w: 0.4, h: 0.34 },
  },
  {
    id: "female-camila",
    name: "Camila",
    gender: "female",
    heightCm: 170,
    size: "M",
    sourceImageUrl: "/models/model-female-camila.webp",
    torso: { x: 0.29, y: 0.3, w: 0.42, h: 0.34 },
  },
  {
    id: "female-lucia",
    name: "Lucía",
    gender: "female",
    heightCm: 180,
    size: "L",
    sourceImageUrl: "/models/model-female-lucia.webp",
    torso: { x: 0.3, y: 0.3, w: 0.4, h: 0.34 },
  },
];

export function snapHeight(cm: number): HeightBand {
  const clamped = Math.min(HEIGHT_MAX, Math.max(HEIGHT_MIN, cm));
  return (Math.round(clamped / HEIGHT_STEP) * HEIGHT_STEP) as HeightBand;
}

/** Public URL for a library asset. Falls back to source front if missing at request time. */
export function modelLibraryPath(
  modelId: string,
  camera: ModelCamera,
  heightCm: number,
) {
  const band = snapHeight(heightCm);
  return `/models/library/${modelId}/${camera}/${band}.webp`;
}

/**
 * Resolve library image for a model view.
 * Run `npm run models:seed` (then optionally `models:library` with Grok) first.
 */
export function modelImage(
  modelId: string,
  camera: ModelCamera = "front",
  heightCm = 170,
): string {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) {
    return MODELS[0]?.sourceImageUrl ?? "/models/model-male-andres.webp";
  }
  return modelLibraryPath(modelId, camera, heightCm);
}

/** Legacy helper used by older UI — maps to source or library front. */
export function modelPrimaryUrl(model: CuratedModel) {
  return modelImage(model.id, "front", model.heightCm);
}

const SIZE_SCALE: Record<string, number> = {
  XS: 0.9,
  S: 0.94,
  M: 1,
  L: 1.06,
  XL: 1.12,
};

function scaleBox(
  box: { x: number; y: number; w: number; h: number },
  factor: number,
) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const w = box.w * factor;
  const h = box.h * factor;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export function torsoFor(
  model: CuratedModel,
  camera: ModelCamera,
  cut: GarmentCut = "tee",
  size = "M",
) {
  let base = { ...model.torso };
  if (cut === "crop") {
    base = {
      x: base.x + base.w * 0.04,
      y: base.y + base.h * 0.02,
      w: base.w * 0.92,
      h: base.h * 0.62,
    };
  }
  if (camera === "side") {
    base = {
      x: base.x + base.w * 0.28,
      y: base.y + base.h * 0.04,
      w: base.w * 0.38,
      h: base.h * 0.92,
    };
  } else if (camera === "back") {
    base = {
      x: base.x + base.w * 0.02,
      y: base.y + base.h * 0.02,
      w: base.w * 0.96,
      h: base.h * 0.96,
    };
  }
  return scaleBox(base, SIZE_SCALE[size] ?? 1);
}

export function cmToInches(cm: number) {
  return Math.round((cm / 2.54) * 10) / 10;
}

export function inchesToCm(inches: number) {
  return Math.round(inches * 2.54);
}

export function heightLabel(cm: number) {
  const snapped = snapHeight(cm);
  return `${snapped} cm / ${cmToInches(snapped)} in`;
}

export function modelsFor(gender: ModelGender, size?: string) {
  return MODELS.filter(
    (m) => m.gender === gender && (!size || m.size === size),
  );
}

export function defaultModelForGender(gender: ModelGender | "unisex" | "hombre" | "mujer") {
  if (gender === "mujer" || gender === "female") {
    return MODELS.find((m) => m.id === "female-camila") ?? MODELS.find((m) => m.gender === "female")!;
  }
  if (gender === "hombre" || gender === "male") {
    return MODELS.find((m) => m.id === "male-andres") ?? MODELS.find((m) => m.gender === "male")!;
  }
  return MODELS.find((m) => m.id === "male-andres") ?? MODELS[0]!;
}
