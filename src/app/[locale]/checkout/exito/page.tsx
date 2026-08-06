import { Link } from "@/i18n/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const order = typeof params.order === "string" ? params.order : "";
  const provider =
    typeof params.provider === "string" ? params.provider : "pago";

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">GoodLuck</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Pedido recibido</h1>
      <p className="mt-4 text-sm text-muted">
        Gracias por tu compra
        {order ? `. Referencia: ${order}` : "."}
        {provider === "cod"
          ? " Te contactaremos para confirmar contra entrega o transferencia."
          : " Estamos confirmando el pago con el proveedor seleccionado."}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/catalogo"
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-surface"
        >
          Seguir comprando
        </Link>
        <Link
          href="/cuenta/pedidos"
          className="rounded-full border border-border px-5 py-2.5 text-sm"
        >
          Ver pedidos
        </Link>
      </div>
    </div>
  );
}
