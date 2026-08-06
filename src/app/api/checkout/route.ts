import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";

const schema = z.object({
  provider: z.enum(["stripe", "wompi", "mercadopago", "cod", "transfer"]),
  subtotalCop: z.number().nonnegative(),
  shippingCop: z.number().nonnegative(),
  totalCop: z.number().positive(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    email: z.email(),
    phone: z.string().min(7),
    address: z.string().min(5),
    city: z.string().min(2),
    department: z.string().min(2),
    postalCode: z.string().optional(),
    notes: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string(),
        productSlug: z.string(),
        productName: z.string(),
        variantId: z.string(),
        color: z.string(),
        size: z.string(),
        priceCop: z.number(),
        quantity: z.number().int().positive(),
        imageUrl: z.string(),
        customDesignId: z.string().optional(),
        customDesignPreview: z.string().optional(),
        customizationFeeCop: z.number().optional(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = schema.parse(json);

    const order = await createOrder(payload);
    const provider = getPaymentProvider(payload.provider);

    if (!provider.available() && payload.provider !== "cod") {
      return NextResponse.json(
        { error: `Proveedor ${payload.provider} no configurado` },
        { status: 400 },
      );
    }

    const session = await provider.createSession(order);

    return NextResponse.json({
      orderId: order.id,
      redirectUrl: session.redirectUrl,
      provider: session.provider,
      externalId: session.externalId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creando checkout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
