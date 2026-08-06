import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/orders";
import { stripeProvider } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const result = await stripeProvider.handleWebhook(rawBody, request.headers);

    if (result.status === "succeeded" && result.orderId) {
      await markOrderPaid(result.orderId, result.externalId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
