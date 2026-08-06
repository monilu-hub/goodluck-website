import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  color: z.string(),
  size: z.string(),
  canvasJson: z.string(),
  previewDataUrl: z.string().optional(),
  guestEmail: z.email().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const id = randomUUID();
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({
        id: `local-${id}`,
        previewUrl: body.previewDataUrl,
      });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let previewUrl = body.previewDataUrl ?? null;

    if (body.previewDataUrl?.startsWith("data:image")) {
      const base64 = body.previewDataUrl.split(",")[1];
      if (base64) {
        const buffer = Buffer.from(base64, "base64");
        const path = `${user?.id ?? "guest"}/${id}.png`;
        const { error: uploadError } = await supabase.storage
          .from("design-previews")
          .upload(path, buffer, { contentType: "image/png", upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from("design-previews")
            .getPublicUrl(path);
          previewUrl = data.publicUrl;
        }
      }
    }

    const { data, error } = await supabase
      .from("custom_designs")
      .insert({
        id,
        user_id: user?.id ?? null,
        guest_email: body.guestEmail ?? null,
        product_id: body.productId,
        product_slug: body.productSlug,
        color: body.color,
        size: body.size,
        canvas_json: JSON.parse(body.canvasJson),
        preview_url: previewUrl,
      })
      .select("id, preview_url")
      .single();

    if (error) {
      return NextResponse.json({
        id: `local-${id}`,
        previewUrl: body.previewDataUrl,
        warning: error.message,
      });
    }

    return NextResponse.json({
      id: data.id,
      previewUrl: data.preview_url ?? previewUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo guardar el diseño";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
