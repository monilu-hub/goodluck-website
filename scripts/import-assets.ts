/**
 * Copies mockups and designs from GOODLUCK_ASSETS_PATH into public/
 * and optionally docs/catalogs from the client catalog folder.
 *
 * Usage:
 *   GOODLUCK_ASSETS_PATH="C:/Users/.../00_Proyectos/01_GoodLuck" npx tsx scripts/import-assets.ts
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { basename, join, extname } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const assetsRoot =
  process.env.GOODLUCK_ASSETS_PATH ||
  "C:/Users/monic/Documents/00_Proyectos/01_GoodLuck";

const catalogRoot =
  process.env.GOODLUCK_CATALOG_PATH ||
  "C:/Users/monic/Documents/00_Clientes/01_GoodLuck";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"]);

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function copyTree(src: string, dest: string) {
  if (!existsSync(src)) {
    console.warn(`Skip missing source: ${src}`);
    return 0;
  }

  ensureDir(dest);
  let count = 0;

  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    const st = statSync(from);
    if (st.isDirectory()) {
      count += copyTree(from, to);
    } else if (IMAGE_EXT.has(extname(entry).toLowerCase())) {
      copyFileSync(from, to);
      count += 1;
      console.log(`Copied ${basename(from)} -> ${to}`);
    }
  }

  return count;
}

function copyPdfCatalogs() {
  const dest = join(process.cwd(), "docs", "catalogs");
  ensureDir(dest);
  let count = 0;

  const candidates = [
    join(catalogRoot, "02_Catálogo Goodluck", "SS26_Goodluck-catalogo.pdf"),
    join(catalogRoot, "Catálogo West Basic 2026 v1.pdf"),
  ];

  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const target = join(dest, basename(file));
    copyFileSync(file, target);
    count += 1;
    console.log(`Copied catalog PDF -> ${target}`);
  }

  return count;
}

const mockupsSrc = join(assetsRoot, "01_Mock ups");
const designsSrc = join(assetsRoot, "00_Diseños", "02_Mundial `26");
const altDesigns = join(assetsRoot, "00_Diseños", "02_Mundial '26");

const mockupsDest = join(process.cwd(), "public", "products", "mockups");
const designsDest = join(
  process.cwd(),
  "public",
  "products",
  "designs",
  "mundial-2026",
);

console.log("Importing GoodLuck assets...");
console.log(`Assets root: ${assetsRoot}`);

const mockups = copyTree(mockupsSrc, mockupsDest);
const designs = existsSync(designsSrc)
  ? copyTree(designsSrc, designsDest)
  : copyTree(altDesigns, designsDest);
const pdfs = copyPdfCatalogs();

console.log(
  `\nDone. Mockups: ${mockups}, designs: ${designs}, catalog PDFs: ${pdfs}`,
);

if (mockups === 0 && designs === 0) {
  console.warn(
    "\nNo external assets found. Placeholder SVGs in public/products will be used until GOODLUCK_ASSETS_PATH is set.",
  );
  process.exitCode = 0;
}
