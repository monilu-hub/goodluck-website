/**
 * Import + optimize GoodLuck assets from the client folder into public/.
 *
 *   npx tsx scripts/import-assets.ts
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { basename, extname, join } from "path";
import { config } from "dotenv";
import sharp from "sharp";

config({ path: ".env.local" });
config();

const catalogRoot =
  process.env.GOODLUCK_CATALOG_PATH ||
  "C:/Users/monic/Documents/00_Clientes/01_GoodLuck";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function findChildDir(parent: string, startsWith: string): string | null {
  if (!existsSync(parent)) return null;
  const match = readdirSync(parent).find((name) =>
    name.toLowerCase().startsWith(startsWith.toLowerCase()),
  );
  return match ? join(parent, match) : null;
}

function listFiles(dir: string, recursive = false): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (recursive) out.push(...listFiles(full, true));
    } else if (IMAGE_EXT.has(extname(entry).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function slugify(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function optimizeToWebp(
  src: string,
  destDir: string,
  opts: { maxWidth?: number; quality?: number; name?: string } = {},
) {
  ensureDir(destDir);
  const base = opts.name || slugify(basename(src));
  const dest = join(destDir, `${base}.webp`);
  try {
    let pipeline = sharp(src, { failOn: "none" }).rotate();
    if (opts.maxWidth) {
      pipeline = pipeline.resize({
        width: opts.maxWidth,
        withoutEnlargement: true,
      });
    }
    await pipeline.webp({ quality: opts.quality ?? 82 }).toFile(dest);
    console.log(`OK ${basename(src)} -> ${dest}`);
    return dest;
  } catch (err) {
    const fallback = join(destDir, basename(src));
    copyFileSync(src, fallback);
    console.warn(`Copy fallback ${basename(src)}:`, err);
    return fallback;
  }
}

async function importGroup(
  files: string[],
  destDir: string,
  maxWidth: number,
  limit?: number,
) {
  const selected = limit ? files.slice(0, limit) : files;
  let count = 0;
  for (const file of selected) {
    await optimizeToWebp(file, destDir, { maxWidth });
    count += 1;
  }
  return count;
}

async function main() {
  console.log("Catalog root:", catalogRoot);

  const disenos = findChildDir(catalogRoot, "00_");
  const mockups = findChildDir(catalogRoot, "01_mock");
  if (!disenos) throw new Error("00_Diseños folder not found");

  const logoDir = findChildDir(disenos, "00_logo");
  const rompehielos = findChildDir(disenos, "01_");
  const mundial = findChildDir(disenos, "02_");
  const genZ = findChildDir(disenos, "03_");
  const trending = findChildDir(disenos, "04_");
  const diaPadre = findChildDir(disenos, "05_");

  const brandDir = join(process.cwd(), "public", "brand");
  const mockupsDest = join(process.cwd(), "public", "products", "mockups");
  const mundialDest = join(
    process.cwd(),
    "public",
    "products",
    "designs",
    "mundial-2026",
  );
  const printsRoot = join(process.cwd(), "public", "products", "prints");

  ensureDir(brandDir);

  // Logo
  let logoCount = 0;
  if (logoDir) {
    const logos = listFiles(logoDir).filter((f) =>
      /transparente|logo/i.test(basename(f)),
    );
    const preferred =
      logos.find((f) => /transparente/i.test(basename(f))) || logos[0];
    if (preferred) {
      await optimizeToWebp(preferred, brandDir, {
        maxWidth: 1200,
        quality: 90,
        name: "logo",
      });
      logoCount = 1;
    }
  }

  // Color board
  if (rompehielos) {
    const colores = listFiles(rompehielos).find((f) =>
      /colores\.png$/i.test(basename(f)),
    );
    if (colores) {
      await optimizeToWebp(colores, brandDir, {
        maxWidth: 1600,
        name: "color-board",
      });
    }
  }

  // Mockups
  const mockupFiles = mockups ? listFiles(mockups) : [];
  const mockCount = await importGroup(mockupFiles, mockupsDest, 1200);

  // Mundial product shots
  const mundialFiles = mundial
    ? listFiles(mundial).filter((f) => /camiseta/i.test(basename(f)))
    : [];
  const mundialCount = await importGroup(mundialFiles, mundialDest, 1200);

  // Prints libraries
  const printMap: Array<[string | null, string, number]> = [
    [rompehielos, "rompehielos", 24],
    [genZ, "gen-z", 20],
    [trending, "trending", 16],
    [diaPadre, "dia-padre", 24],
    [mundial, "mundial", 20],
  ];

  const printManifest: Array<{
    id: string;
    collection: string;
    name: string;
    url: string;
  }> = [];

  for (const [srcDir, collection, limit] of printMap) {
    if (!srcDir) continue;
    const dest = join(printsRoot, collection);
    const files = listFiles(srcDir, true)
      .filter((f) => !/whatsapp/i.test(basename(f)))
      .sort((a, b) => statSync(b).size - statSync(a).size);
    const picked = files.slice(0, limit);
    for (const file of picked) {
      const name = slugify(basename(file));
      const out = await optimizeToWebp(file, dest, {
        maxWidth: 1400,
        quality: 85,
        name,
      });
      printManifest.push({
        id: `${collection}-${name}`,
        collection,
        name: basename(file).replace(/\.[^.]+$/, ""),
        url: `/products/prints/${collection}/${basename(out)}`,
      });
    }
  }

  const manifestPath = join(process.cwd(), "data", "prints.json");
  writeFileSync(manifestPath, JSON.stringify(printManifest, null, 2), "utf8");

  console.log(
    `\nDone. logo=${logoCount} mockups=${mockCount} mundial=${mundialCount} prints=${printManifest.length}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
