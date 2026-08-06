import { Link } from "@/i18n/navigation";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { getAllProducts } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { formatCop } from "@/lib/format";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const products = getAllProducts();

  let orders: Array<{
    id: string;
    status: string;
    total_cop: number;
    payment_provider: string;
    shipping_full_name: string | null;
    shipping_email: string | null;
    created_at: string;
  }> = [];

  if (supabase) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, status, total_cop, payment_provider, shipping_full_name, shipping_email, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    orders = data ?? [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Admin GoodLuck</h1>
          <p className="mt-2 text-sm text-muted">
            Pedidos, confirmación COD y vista rápida de catálogo.
          </p>
        </div>
        <Link href="/catalogo" className="text-sm text-accent">
          Ver tienda
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-ink">Pedidos</h2>
        {!supabase ? (
          <p className="rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            Conecta Supabase para gestionar pedidos en vivo. El catálogo local
            ya está disponible abajo.
          </p>
        ) : (
          <AdminOrders initialOrders={orders} />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Productos ({products.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Colección</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Variantes</th>
                <th className="px-4 py-3">Custom</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/70">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.collectionSlug}</td>
                  <td className="px-4 py-3">{formatCop(p.basePriceCop)}</td>
                  <td className="px-4 py-3">{p.variants.length}</td>
                  <td className="px-4 py-3">{p.isCustomizable ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
