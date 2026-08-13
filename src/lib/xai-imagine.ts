/**
 * Offline asset pipeline helper for xAI Grok Imagine.
 * Used only by scripts under /scripts — not by runtime Next.js routes.
 */

export type ImagineImageInput = {
  url: string;
  type?: "image_url";
};

export type EditImagesParams = {
  prompt: string;
  images: ImagineImageInput[];
  model?: string;
  resolution?: "1k" | "2k";
  n?: number;
  responseFormat?: "url" | "b64_json";
};

export type EditImagesResult = {
  url?: string;
  b64_json?: string;
};

function getApiKey() {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    throw new Error(
      "XAI_API_KEY is required for offline asset scripts (not used at runtime).",
    );
  }
  return key;
}

/** Call xAI images/edits (JSON body). Supports 1–3 reference images. */
export async function editImages(
  params: EditImagesParams,
): Promise<EditImagesResult> {
  const key = getApiKey();
  const model = params.model ?? "grok-imagine-image-quality";
  const images = params.images.map((img) => ({
    url: img.url,
    type: img.type ?? "image_url",
  }));

  const body: Record<string, unknown> = {
    model,
    prompt: params.prompt,
    n: params.n ?? 1,
    resolution: params.resolution ?? "1k",
    response_format: params.responseFormat ?? "url",
  };

  // API accepts either `image` (single) or `images` (multi) — never both.
  if (images.length === 1) {
    body.image = images[0];
  } else {
    body.images = images;
  }

  const res = await fetch("https://api.x.ai/v1/images/edits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`xAI images/edits ${res.status}: ${text.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    data?: Array<{ url?: string; b64_json?: string }>;
  };
  const first = json.data?.[0];
  if (!first?.url && !first?.b64_json) {
    throw new Error("xAI images/edits returned no image data");
  }
  return { url: first.url, b64_json: first.b64_json };
}

export async function downloadToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export function fileToDataUri(buf: Buffer, mime = "image/webp") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}
