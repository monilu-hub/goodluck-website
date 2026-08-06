import type { Order } from "@/types";
import type { PaymentProviderAdapter } from "./types";

export const codProvider: PaymentProviderAdapter = {
  id: "cod",
  label: "Contra entrega / Transferencia",
  description: "Paga al recibir o por transferencia bancaria",
  available: () => true,
  async createSession(order: Order) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return {
      provider: "cod",
      orderId: order.id,
      redirectUrl: `${siteUrl}/checkout/exito?order=${order.id}&provider=cod`,
      externalId: `COD-${order.id}`,
    };
  },
  async handleWebhook() {
    return {
      orderId: "",
      status: "pending",
      provider: "cod",
    };
  },
};
