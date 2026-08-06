"use client";

import { useState } from "react";
import { formatCop } from "@/lib/format";

type OrderRow = {
  id: string;
  status: string;
  total_cop: number;
  payment_provider: string;
  shipping_full_name: string | null;
  shipping_email: string | null;
  created_at: string;
};

export function AdminOrders({ initialOrders }: { initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [busy, setBusy] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    }
    setBusy(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Pago</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border/70">
              <td className="px-4 py-3 font-mono text-xs">
                {order.id.slice(0, 8)}
              </td>
              <td className="px-4 py-3">
                <div>{order.shipping_full_name}</div>
                <div className="text-xs text-muted">{order.shipping_email}</div>
              </td>
              <td className="px-4 py-3">{formatCop(order.total_cop)}</td>
              <td className="px-4 py-3">{order.payment_provider}</td>
              <td className="px-4 py-3">
                <select
                  disabled={busy === order.id}
                  value={order.status}
                  onChange={(e) => void updateStatus(order.id, e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1"
                >
                  {[
                    "pending_payment",
                    "paid",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length && (
        <p className="p-6 text-sm text-muted">No hay pedidos todavía.</p>
      )}
    </div>
  );
}
