/**
 * Seed catalog into Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL.
 *
 *   npx tsx supabase/seed/products.ts
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { COLLECTIONS, PRODUCTS } from "../../data/catalog";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Catalog local data/catalog.ts remains available.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const collectionIdByLocal: Record<string, string> = {};

  for (const collection of COLLECTIONS) {
    const { data, error } = await supabase
      .from("collections")
      .upsert(
        {
          slug: collection.slug,
          name: collection.name,
          description: collection.description,
          hero_image: collection.heroImage,
          sort_order: collection.sortOrder,
        },
        { onConflict: "slug" },
      )
      .select("id, slug")
      .single();

    if (error) throw error;
    collectionIdByLocal[collection.id] = data.id;
  }

  for (const product of PRODUCTS) {
    const { data: prod, error } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          description: product.description,
          collection_id: collectionIdByLocal[product.collectionId],
          type: product.type,
          gender: product.gender,
          base_price_cop: product.basePriceCop,
          is_customizable: product.isCustomizable,
          featured: Boolean(product.featured),
          active: true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error) throw error;

    await supabase.from("product_images").delete().eq("product_id", prod.id);
    await supabase.from("product_variants").delete().eq("product_id", prod.id);

    if (product.images.length) {
      const { error: imgErr } = await supabase.from("product_images").insert(
        product.images.map((img, i) => ({
          product_id: prod.id,
          url: img.url,
          alt: img.alt,
          view: img.view,
          color: img.color ?? null,
          sort_order: i,
        })),
      );
      if (imgErr) throw imgErr;
    }

    const { error: varErr } = await supabase.from("product_variants").insert(
      product.variants.map((v) => ({
        product_id: prod.id,
        sku: v.sku,
        color: v.color,
        color_hex: v.colorHex,
        size: v.size,
        price_cop: v.priceCop,
        stock: v.stock,
        image_url: v.imageUrl ?? null,
      })),
    );
    if (varErr) throw varErr;

    console.log(`Seeded ${product.slug}`);
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
