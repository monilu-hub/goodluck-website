import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Mis diseños" };

export default async function DisenosPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold text-ink">Mis diseños</h1>
        <p className="mt-4 text-sm text-muted">
          Configura Supabase para guardar diseños en la nube. El editor local
          sigue disponible en{" "}
          <Link href="/disenar" className="text-accent underline">
            /disenar
          </Link>
          .
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/cuenta/login" className="text-accent underline">
          Inicia sesión
        </Link>
      </div>
    );
  }

  const { data: designs } = await supabase
    .from("custom_designs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-ink">Mis diseños</h1>
        <Link href="/disenar" className="rounded-full bg-ink px-4 py-2 text-sm text-surface">
          Nuevo diseño
        </Link>
      </div>
      {!designs?.length ? (
        <p className="text-sm text-muted">No hay diseños guardados todavía.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <article
              key={design.id}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative aspect-[4/5] bg-accent-soft/30">
                {design.preview_url ? (
                  <Image
                    src={design.preview_url}
                    alt={design.product_slug}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : null}
              </div>
              <div className="p-3 text-sm">
                <p className="font-medium text-ink">{design.product_slug}</p>
                <p className="text-muted">
                  {design.color} / {design.size}
                </p>
                <Link
                  href={`/disenar/${design.product_slug}`}
                  className="mt-2 inline-block text-accent"
                >
                  Reordenar / editar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
