import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCop } from "@/lib/format";

export const metadata = { title: "Mis pedidos" };

export default async function PedidosPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold text-ink">Mis pedidos</h1>
        <p className="mt-4 text-sm text-muted">
          Conecta Supabase para sincronizar el historial de pedidos. Mientras
          tanto puedes completar compras con contra entrega en{" "}
          <Link href="/checkout" className="text-accent underline">
            checkout
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
        <p className="text-muted">
          <Link href="/cuenta/login" className="text-accent underline">
            Inicia sesión
          </Link>{" "}
          para ver tus pedidos.
        </p>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_cop, payment_provider, created_at, order_items(product_name, quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-ink">Mis pedidos</h1>
        <Link href="/cuenta/disenos" className="text-sm text-accent">
          Mis diseños
        </Link>
      </div>
      {!orders?.length ? (
        <p className="text-sm text-muted">Aún no tienes pedidos.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-muted">{order.status}</p>
              </div>
              <p className="mt-2 text-sm text-ink">
                {formatCop(order.total_cop)} · {order.payment_provider}
              </p>
              <p className="mt-1 text-xs text-muted">
                {new Date(order.created_at).toLocaleString("es-CO")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
