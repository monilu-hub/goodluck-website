import { randomUUID } from "crypto";
import type { CartItem, Order, PaymentProvider, ShippingAddress } from "@/types";
import { createClient } from "@/lib/supabase/server";

export type CheckoutPayload = {
  provider: PaymentProvider;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotalCop: number;
  shippingCop: number;
  totalCop: number;
};

export async function createOrder(
  payload: CheckoutPayload,
): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    status: payload.provider === "cod" ? "pending_payment" : "pending_payment",
    paymentProvider: payload.provider,
    subtotalCop: payload.subtotalCop,
    shippingCop: payload.shippingCop,
    totalCop: payload.totalCop,
    shippingAddress: payload.shippingAddress,
    items: payload.items,
    createdAt: new Date().toISOString(),
  };

  const supabase = await createClient();
  if (!supabase) {
    return order;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      id: order.id,
      user_id: user?.id ?? null,
      status: order.status,
      payment_provider: order.paymentProvider,
      subtotal_cop: order.subtotalCop,
      shipping_cop: order.shippingCop,
      total_cop: order.totalCop,
      shipping_full_name: order.shippingAddress.fullName,
      shipping_email: order.shippingAddress.email,
      shipping_phone: order.shippingAddress.phone,
      shipping_address: order.shippingAddress.address,
      shipping_city: order.shippingAddress.city,
      shipping_department: order.shippingAddress.department,
      shipping_postal_code: order.shippingAddress.postalCode ?? null,
      shipping_notes: order.shippingAddress.notes ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Order insert failed, using local order", error.message);
    return order;
  }

  await supabase.from("order_items").insert(
    payload.items.map((item) => ({
      order_id: data.id,
      product_id: item.productId,
      variant_id: item.variantId,
      custom_design_id: item.customDesignId?.startsWith("local-")
        ? null
        : item.customDesignId,
      product_name: item.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unit_price_cop: item.priceCop,
      customization_fee_cop: item.customizationFeeCop ?? 0,
      image_url: item.imageUrl,
      preview_url: item.customDesignPreview ?? null,
    })),
  );

  await supabase.from("payments").insert({
    order_id: data.id,
    provider: payload.provider,
    status: "pending",
    amount_cop: payload.totalCop,
    metadata: {},
  });

  return order;
}

export async function markOrderPaid(orderId: string, externalId?: string) {
  const supabase = await createClient();
  if (!supabase || !orderId) return;

  await supabase
    .from("orders")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  await supabase
    .from("payments")
    .update({
      status: "succeeded",
      external_id: externalId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", orderId);
}
