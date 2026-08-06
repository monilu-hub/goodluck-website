import Stripe from "stripe";
import type { Order } from "@/types";
import type { PaymentProviderAdapter } from "./types";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const stripeProvider: PaymentProviderAdapter = {
  id: "stripe",
  label: "Tarjeta (Stripe)",
  description: "Visa, Mastercard y Amex",
  available: () => Boolean(process.env.STRIPE_SECRET_KEY),
  async createSession(order: Order) {
    const stripe = getStripe();
    if (!stripe) throw new Error("Stripe no configurado");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/checkout/exito?order=${order.id}&provider=stripe`,
      cancel_url: `${siteUrl}/checkout?cancelled=1`,
      customer_email: order.shippingAddress.email,
      line_items: [
        ...order.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "cop",
            unit_amount: item.priceCop + (item.customizationFeeCop ?? 0),
            product_data: {
              name: `${item.productName} · ${item.color} / ${item.size}`,
              images: item.imageUrl?.startsWith("http") ? [item.imageUrl] : [],
            },
          },
        })),
        ...(order.shippingCop > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "cop",
                  unit_amount: order.shippingCop,
                  product_data: { name: "Envío" },
                },
              },
            ]
          : []),
      ],
      metadata: { orderId: order.id },
    });

    return {
      provider: "stripe",
      orderId: order.id,
      redirectUrl: session.url ?? undefined,
      externalId: session.id,
    };
  },
  async handleWebhook(payload, headers) {
    const stripe = getStripe();
    if (!stripe) throw new Error("Stripe no configurado");

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET faltante");

    const signature = headers?.get("stripe-signature");
    if (!signature) throw new Error("Firma Stripe ausente");

    const event = stripe.webhooks.constructEvent(
      payload as string | Buffer,
      signature,
      secret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        orderId: session.metadata?.orderId ?? "",
        status: "succeeded",
        externalId: session.id,
        provider: "stripe",
      };
    }

    return {
      orderId: "",
      status: "processing",
      provider: "stripe",
    };
  },
};
