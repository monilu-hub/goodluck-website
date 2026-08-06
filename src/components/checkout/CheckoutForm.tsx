"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { COLOMBIA_DEPARTMENTS } from "@/lib/colombia";
import { useMoney } from "@/hooks/useMoney";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import type { PaymentProvider } from "@/types";

type ProviderOption = {
  id: PaymentProvider;
  label: string;
  description: string;
  available: boolean;
};

export function CheckoutForm({ providers }: { providers: ProviderOption[] }) {
  const { format } = useMoney();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const shipping = useCartStore((s) => s.shipping);
  const total = useCartStore((s) => s.total);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const availableProviders = useMemo(
    () => providers.filter((p) => p.available || p.id === "cod"),
    [providers],
  );

  const [provider, setProvider] = useState<PaymentProvider>(
    availableProviders.find((p) => p.id === "cod")?.id ??
      availableProviders[0]?.id ??
      "cod",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "Antioquia",
    postalCode: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          items,
          shippingAddress: form,
          subtotalCop: subtotal(),
          shippingCop: shipping(),
          totalCop: total(),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        redirectUrl?: string;
        orderId?: string;
      };

      if (!res.ok) throw new Error(data.error || "No se pudo crear el pedido");

      if (provider === "cod") clear();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      throw new Error("No se recibió URL de pago");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de checkout");
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="text-ink">Tu carrito está vacío.</p>
        <Link
          href="/catalogo"
          className="mt-4 inline-block text-sm text-accent underline"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-ink">Envío en Colombia</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["fullName", "Nombre completo"],
                ["email", "Email"],
                ["phone", "Teléfono"],
                ["city", "Ciudad"],
                ["address", "Dirección"],
                ["postalCode", "Código postal (opcional)"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm text-muted sm:col-span-1">
                {label}
                <input
                  required={key !== "postalCode"}
                  type={key === "email" ? "email" : "text"}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-ink"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </label>
            ))}
            <label className="text-sm text-muted">
              Departamento
              <select
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-ink"
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
              >
                {COLOMBIA_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted sm:col-span-2">
              Notas
              <textarea
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-ink"
                rows={2}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-ink">Método de pago</h2>
          <div className="mt-4 space-y-2">
            {availableProviders.map((p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 ${
                  provider === p.id
                    ? "border-ink bg-accent-soft/40"
                    : "border-border"
                } ${!p.available && p.id !== "cod" ? "opacity-50" : ""}`}
              >
                <input
                  type="radio"
                  name="provider"
                  value={p.id}
                  checked={provider === p.id}
                  disabled={!p.available && p.id !== "cod"}
                  onChange={() => setProvider(p.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {p.label}
                    {!p.available && p.id !== "cod" ? " (configurar keys)" : ""}
                  </span>
                  <span className="text-xs text-muted">{p.description}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Resumen</h2>
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-16 w-14 overflow-hidden bg-accent-soft/40">
                <Image
                  src={item.customDesignPreview || item.imageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-ink">{item.productName}</p>
                <p className="text-muted">
                  {item.color} / {item.size}
                  {item.customDesignId ? " · Custom" : ""}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    className="px-1"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="px-1"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs text-highlight"
                    onClick={() => removeItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink">
                {format(
                  (item.priceCop + (item.customizationFeeCop ?? 0)) *
                    item.quantity,
                )}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{format(subtotal())}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Envío</span>
            <span>{shipping() === 0 ? "Gratis" : format(shipping())}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{format(total())}</span>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-highlight">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-ink py-3 text-sm font-medium text-surface transition hover:bg-accent disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Confirmar pedido"}
        </button>
      </aside>
    </form>
  );
}
