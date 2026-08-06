import { MercadoPagoConfig, Preference } from "mercadopago";
import type { Order } from "@/types";
import type { PaymentProviderAdapter } from "./types";

function getClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

export const mercadoPagoProvider: PaymentProviderAdapter = {
  id: "mercadopago",
  label: "Mercado Pago",
  description: "Tarjetas y medios LATAM",
  available: () => Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
  async createSession(order: Order) {
    const client = getClient();
    if (!client) throw new Error("Mercado Pago no configurado");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        external_reference: order.id,
        items: order.items.map((item) => ({
          id: item.variantId,
          title: `${item.productName} · ${item.color}/${item.size}`,
          quantity: item.quantity,
          unit_price: item.priceCop + (item.customizationFeeCop ?? 0),
          currency_id: "COP",
        })),
        shipments: order.shippingCop
          ? {
              cost: order.shippingCop,
              mode: "not_specified",
            }
          : undefined,
        back_urls: {
          success: `${siteUrl}/checkout/exito?order=${order.id}&provider=mercadopago`,
          failure: `${siteUrl}/checkout?cancelled=1`,
          pending: `${siteUrl}/checkout/exito?order=${order.id}&provider=mercadopago&pending=1`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        payer: {
          email: order.shippingAddress.email,
          name: order.shippingAddress.fullName,
        },
      },
    });

    return {
      provider: "mercadopago",
      orderId: order.id,
      redirectUrl: result.init_point ?? result.sandbox_init_point ?? undefined,
      externalId: String(result.id ?? ""),
    };
  },
  async handleWebhook(payload) {
    const body = payload as {
      data?: { id?: string };
      type?: string;
      external_reference?: string;
    };

    return {
      orderId: body.external_reference ?? "",
      status: "processing",
      externalId: body.data?.id,
      provider: "mercadopago",
    };
  },
};
