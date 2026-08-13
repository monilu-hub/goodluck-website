/**
 * Offline: build lookbook images (model wearing each product/color) via Grok.
 * Requires XAI_API_KEY for generation. Use --seed-only to copy placeholders.
 *
 *   npm run catalog:lookbook
 *   npm run catalog:lookbook -- --seed-only
 */
import { config } from "dotenv";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname } from "path";
import sharp from "sharp";
import { PRODUCTS } from "../data/catalog";
import { lookbookPath } from "../data/lookbook";
import {
  defaultModelForGender,
  modelImage,
  snapHeight,
} from "../data/models";
import { colorHex } from "../src/lib/colors";
import {
  downloadToBuffer,
  editImages,
  fileToDataUri,
} from "../src/lib/xai-imagine";
import { publicFile } from "./lib/paths";

config({ path: ".env.local" });
config(); // fallback .env

const seedOnly =
  process.argv.includes("--seed-only") || !process.env.XAI_API_KEY;

async function toDataUri(absPath: string) {
  const buf = await sharp(absPath).png().toBuffer();
  return fileToDataUri(buf, "image/png");
}

async function saveWebp(buf: Buffer, dest: string) {
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, await sharp(buf).webp({ quality: 84 }).toBuffer());
}

async function main() {
  let generated = 0;
  let seeded = 0;

  for (const product of PRODUCTS) {
    const model = defaultModelForGender(product.gender);
    const modelUrl = modelImage(model.id, "front", snapHeight(model.heightCm));
    const modelPath = publicFile(modelUrl);
    const modelFallback = publicFile(model.sourceImageUrl);
    const modelAbs = existsSync(modelPath) ? modelPath : modelFallback;

    for (const color of product.colors) {
      // Prefer flat mockup / source catalog photos — never the lookbook output itself.
      const mockup =
        product.images.find((i) => i.color === color && !i.url.includes("/lookbook/"))
          ?.url ??
        product.images.find((i) => !i.url.includes("/lookbook/"))?.url ??
        product.images.find((i) => i.color === color)?.url ??
        product.images[0]?.url;
      if (!mockup) continue;

      const lookUrl = lookbookPath(product.slug, color, "front");
      const dest = publicFile(lookUrl);
      const mockupAbs = publicFile(mockup);

      if (seedOnly) {
        mkdirSync(dirname(dest), { recursive: true });
        const seedSrc = existsSync(modelAbs) ? modelAbs : mockupAbs;
        if (existsSync(seedSrc) && (!existsSync(dest) || process.argv.includes("--force"))) {
          copyFileSync(seedSrc, dest);
          seeded += 1;
          console.log("seed", lookUrl);
        }
        const backUrl = lookbookPath(product.slug, color, "back");
        const backDest = publicFile(backUrl);
        if (existsSync(seedSrc) && (!existsSync(backDest) || process.argv.includes("--force"))) {
          copyFileSync(seedSrc, backDest);
          seeded += 1;
          console.log("seed", backUrl);
        }
        continue;
      }

      if (existsSync(dest) && !process.argv.includes("--force")) {
        console.log("skip", lookUrl);
        continue;
      }

      if (!existsSync(modelAbs) || !existsSync(mockupAbs)) {
        console.warn("missing assets", product.slug, color);
        continue;
      }

      const hex = colorHex(color);
      const prompt = `Image 1 is the model. Image 2 is the garment product photo. Dress the person in image 1 with the garment from image 2 in color ${color} (${hex}). Keep the same person, face, pose, and studio background. Photorealistic apparel ecommerce lookbook. No extra logos or text overlays.`;

      console.log("grok", lookUrl);
      try {
        const result = await editImages({
          prompt,
          images: [
            { url: await toDataUri(modelAbs) },
            { url: await toDataUri(mockupAbs) },
          ],
          resolution: "1k",
        });
        const buf = result.b64_json
          ? Buffer.from(result.b64_json, "base64")
          : await downloadToBuffer(result.url!);
        await saveWebp(buf, dest);
        generated += 1;
      } catch (e) {
        console.warn("grok failed, seeding model photo", lookUrl, e);
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, readFileSync(modelAbs));
        seeded += 1;
      }
    }
  }

  console.log(`Done. generated=${generated} seeded=${seeded} seedOnly=${seedOnly}`);
  console.log(
    "Tip: catalog UI prefers /products/lookbook/... paths via data/lookbook.ts + catalog images.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
