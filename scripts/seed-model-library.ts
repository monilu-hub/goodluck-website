/**
 * Seeds public/models/library/{id}/{camera}/{height}.webp from source fronts.
 * No API key required — placeholders until `npm run models:library` runs with Grok.
 */
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import {
  HEIGHT_BANDS,
  MODELS,
  MODEL_CAMERAS,
  modelLibraryPath,
} from "../data/models";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

function publicFile(url: string) {
  return join(PUBLIC, url.replace(/^\//, ""));
}

function main() {
  let n = 0;
  for (const model of MODELS) {
    const src = publicFile(model.sourceImageUrl);
    if (!existsSync(src)) {
      console.warn("missing source", model.sourceImageUrl);
      continue;
    }
    for (const camera of MODEL_CAMERAS) {
      for (const band of HEIGHT_BANDS) {
        const destUrl = modelLibraryPath(model.id, camera, band);
        const dest = publicFile(destUrl);
        mkdirSync(dirname(dest), { recursive: true });
        if (!existsSync(dest)) {
          copyFileSync(src, dest);
          n += 1;
          console.log("seeded", destUrl);
        }
      }
    }
  }
  console.log(`Done. Seeded ${n} library files (skipped existing).`);
}

main();
