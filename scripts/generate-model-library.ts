/**
 * Offline: expand model library (cameras × height bands) via Grok Imagine edits.
 * Requires XAI_API_KEY. Falls back to copy-seed when --seed-only or no key.
 *
 *   npm run models:library
 *   npm run models:library -- --seed-only
 */
import { config } from "dotenv";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import sharp from "sharp";
import {
  HEIGHT_BANDS,
  MODELS,
  MODEL_CAMERAS,
  modelLibraryPath,
  snapHeight,
  type ModelCamera,
} from "../data/models";
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

function cameraPrompt(camera: ModelCamera, height: number) {
  if (camera === "side") {
    return `Keep the exact same person and clothing. Show a clear side profile view of this model standing, photorealistic studio photo, neutral background, height cues for about ${height} cm. Do not add logos or text.`;
  }
  if (camera === "back") {
    return `Keep the exact same person and clothing. Show the model from the back, standing, photorealistic studio photo, neutral background, height cues for about ${height} cm. Do not add logos or text.`;
  }
  return `Keep the exact same person, face, and clothing. Adjust framing for a full-body standing pose that reads as about ${height} cm tall, photorealistic studio photo, neutral background. Do not add logos or text.`;
}

async function ensureWebp(buf: Buffer, dest: string) {
  mkdirSync(dirname(dest), { recursive: true });
  const webp = await sharp(buf).webp({ quality: 82 }).toBuffer();
  writeFileSync(dest, webp);
}

async function main() {
  let generated = 0;
  let copied = 0;

  for (const model of MODELS) {
    const srcPath = publicFile(model.sourceImageUrl);
    if (!existsSync(srcPath)) {
      console.warn("skip missing source", model.sourceImageUrl);
      continue;
    }
    const srcBuf = await sharp(srcPath).png().toBuffer();
    const srcDataUri = fileToDataUri(srcBuf, "image/png");

    for (const camera of MODEL_CAMERAS) {
      for (const band of HEIGHT_BANDS) {
        const destUrl = modelLibraryPath(model.id, camera, band);
        const dest = publicFile(destUrl);
        const isIdentity =
          camera === "front" && band === snapHeight(model.heightCm);

        if (seedOnly || isIdentity) {
          mkdirSync(dirname(dest), { recursive: true });
          if (!existsSync(dest) || isIdentity) {
            copyFileSync(srcPath, dest);
            copied += 1;
            console.log(isIdentity ? "identity" : "seed", destUrl);
          }
          continue;
        }

        if (existsSync(dest) && !process.argv.includes("--force")) {
          console.log("skip existing", destUrl);
          continue;
        }

        console.log("grok", destUrl);
        try {
          const result = await editImages({
            prompt: cameraPrompt(camera, band),
            images: [{ url: srcDataUri }],
            resolution: "1k",
          });
          const buf = result.b64_json
            ? Buffer.from(result.b64_json, "base64")
            : await downloadToBuffer(result.url!);
          await ensureWebp(buf, dest);
          generated += 1;
        } catch (e) {
          console.warn("grok failed, seeding copy", destUrl, e);
          mkdirSync(dirname(dest), { recursive: true });
          copyFileSync(srcPath, dest);
          copied += 1;
        }
      }
    }
  }

  console.log(`Done. generated=${generated} copied=${copied} seedOnly=${seedOnly}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
