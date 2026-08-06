import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/orders";
import { mercadoPagoProvider } from "@/lib/payments/mercadopago";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await mercadoPagoProvider.handleWebhook(
      payload,
      request.headers,
    );

    if (result.status === "succeeded" && result.orderId) {
      await markOrderPaid(result.orderId, result.externalId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
