/**
 * Convert print artwork to transparent PNG (+ alpha WebP) for the designer.
 *
 *   npx tsx scripts/process-prints-transparent.ts
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { basename, dirname, extname, join, relative } from "path";
import { config } from "dotenv";
import sharp from "sharp";

config({ path: ".env.local" });
config();

const ROOT = process.cwd();
const PRINTS_DIR = join(ROOT, "public", "products", "prints");
const OUT_DIR = join(ROOT, "public", "products", "prints-transparent");
const PRINTS_JSON = join(ROOT, "data", "prints.json");

type PrintEntry = {
  id: string;
  collection: string;
  name: string;
  url: string;
  previewUrl?: string;
  transparentUrl?: string;
};

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function listWebp(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listWebp(full));
    else if (extname(entry).toLowerCase() === ".webp") out.push(full);
  }
  return out;
}

function sampleCorners(
  data: Buffer,
  width: number,
  height: number,
  sample = 10,
) {
  const pts: Array<[number, number]> = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [Math.floor(width / 2), 4],
    [Math.floor(width / 2), height - 5],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const [cx, cy] of pts) {
    for (let dy = -sample; dy <= sample; dy++) {
      for (let dx = -sample; dx <= sample; dx++) {
        const x = Math.min(width - 1, Math.max(0, cx + dx));
        const y = Math.min(height - 1, Math.max(0, cy + dy));
        const i = (y * width + x) * 4;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
  }
  return { r: r / n, g: g / n, b: b / n };
}

/** Best for digital flats with near-white backgrounds. */
function knockOutFlatWhite(data: Buffer, width: number, height: number) {
  let transparent = 0;
  const total = width * height;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 228 && g > 228 && b > 228) {
      data[i + 3] = 0;
      transparent++;
    } else if (r > 210 && g > 210 && b > 210) {
      const t = (Math.min(r, g, b) - 210) / 18;
      data[i + 3] = Math.round(255 * (1 - t));
      if (data[i + 3] < 10) {
        data[i + 3] = 0;
        transparent++;
      }
    }
  }
  return Math.round((100 * transparent) / total);
}

/**
 * Best for photographed handwriting / ink on gray-beige paper.
 * Removes paper using sampled corner color + relative darkness.
 */
function knockOutPaperScan(data: Buffer, width: number, height: number) {
  const bg = sampleCorners(data, width, height);
  const bgLum = 0.2126 * bg.r + 0.7152 * bg.g + 0.0722 * bg.b;
  let transparent = 0;
  const total = width * height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const dist = Math.hypot(r - bg.r, g - bg.g, b - bg.b);
    const ink = Math.max(0, bgLum - lum);

    if (ink < 18 && dist < 78) {
      data[i + 3] = 0;
      transparent++;
      continue;
    }

    if (ink < 42) {
      const a = Math.round(255 * ((ink - 18) / 24));
      data[i + 3] = Math.max(0, Math.min(255, a));
      const k = Math.min(1, ink / 70);
      data[i] = Math.round(r * (1 - k));
      data[i + 1] = Math.round(g * (1 - k));
      data[i + 2] = Math.round(b * (1 - k));
      if (data[i + 3] < 8) {
        data[i + 3] = 0;
        transparent++;
      }
      continue;
    }

    const k = Math.min(1, ink / 95);
    data[i] = Math.round(r * (1 - 0.88 * k));
    data[i + 1] = Math.round(g * (1 - 0.88 * k));
    data[i + 2] = Math.round(b * (1 - 0.88 * k));
    data[i + 3] = 255;
  }

  return Math.round((100 * transparent) / total);
}

function looksLikeInkScan(name: string) {
  const n = name.toLowerCase();
  return (
    n.startsWith("img-") ||
    n.startsWith("handw") ||
    n.includes("handw") ||
    n.includes("ai-is-sugar")
  );
}

async function processOne(srcWebp: string) {
  const rel = relative(PRINTS_DIR, srcWebp).replace(/\\/g, "/");
  const base = basename(srcWebp, ".webp");
  const collection = dirname(rel);
  const outCollection = join(OUT_DIR, collection);
  ensureDir(outCollection);

  const pngOut = join(outCollection, `${base}.png`);
  const webpOut = join(outCollection, `${base}.webp`);

  const { data, info } = await sharp(srcWebp, { failOn: "none" })
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let transparentPct = looksLikeInkScan(base)
    ? knockOutPaperScan(data, info.width, info.height)
    : knockOutFlatWhite(data, info.width, info.height);

  // Fallback if flat method barely removed anything
  if (!looksLikeInkScan(base) && transparentPct < 15) {
    transparentPct = knockOutPaperScan(data, info.width, info.height);
  }

  const buf = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 6 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(pngOut, buf);
  await sharp(buf).webp({ quality: 92, alphaQuality: 100 }).toFile(webpOut);

  return {
    rel,
    base,
    collection,
    transparentPct,
    pngUrl: `/products/prints-transparent/${collection}/${base}.png`,
    webpUrl: `/products/prints-transparent/${collection}/${base}.webp`,
  };
}

async function main() {
  if (!existsSync(PRINTS_DIR)) {
    console.error("Missing", PRINTS_DIR);
    process.exit(1);
  }
  ensureDir(OUT_DIR);

  const files = listWebp(PRINTS_DIR).filter((f) => {
    const name = basename(f).toLowerCase();
    return !name.includes("colores") && !name.includes("color-board");
  });

  type Result = Awaited<ReturnType<typeof processOne>>;
  console.log(`Processing ${files.length} prints…`);
  const results: Result[] = [];
  for (const file of files) {
    try {
      const r = await processOne(file);
      results.push(r);
      console.log(
        `ok ${r.collection}/${r.base} transparent≈${r.transparentPct}%`,
      );
    } catch (e) {
      console.warn("fail", file, e);
    }
  }

  if (existsSync(PRINTS_JSON)) {
    const prints = JSON.parse(
      readFileSync(PRINTS_JSON, "utf8"),
    ) as PrintEntry[];
    const byOldUrl = new Map<string, Result>();
    for (const r of results) {
      byOldUrl.set(`/products/prints/${r.rel}`, r);
      byOldUrl.set(r.pngUrl, r);
      byOldUrl.set(
        `/products/prints-transparent/${r.collection}/${r.base}.webp`,
        r,
      );
    }

    const next = prints.map((p) => {
      const oldPreview =
        p.previewUrl ||
        (p.url.includes("/prints-transparent/")
          ? `/products/prints/${p.collection || ""}/${basename(p.url).replace(/\.png$/i, ".webp")}`
          : p.url);
      const keyCandidates = [p.url, p.previewUrl, oldPreview].filter(
        Boolean,
      ) as string[];
      let hit: Result | null = null;
      for (const k of keyCandidates) {
        const found = byOldUrl.get(k);
        if (found) {
          hit = found;
          break;
        }
      }
      if (!hit) {
        const base = basename(p.url).replace(/\.(png|webp)$/i, "");
        hit =
          results.find(
            (r) => r.base === base && r.collection === p.collection,
          ) ?? null;
      }
      if (!hit) return p;
      return {
        ...p,
        url: hit.pngUrl,
        previewUrl: `/products/prints/${hit.rel}`,
        transparentUrl: hit.pngUrl,
      };
    });
    writeFileSync(PRINTS_JSON, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    console.log("Updated data/prints.json → transparent PNG urls");
  }

  console.log(`Done. ${results.length} transparent prints → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
