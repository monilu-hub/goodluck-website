import { createHash } from "crypto";
import type { Order } from "@/types";
import type { PaymentProviderAdapter } from "./types";

export const wompiProvider: PaymentProviderAdapter = {
  id: "wompi",
  label: "Wompi",
  description: "PSE, Nequi y tarjetas Colombia",
  available: () =>
    Boolean(process.env.WOMPI_PRIVATE_KEY && process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY),
  async createSession(order: Order) {
    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    if (!privateKey || !publicKey) throw new Error("Wompi no configurado");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const amountInCents = order.totalCop * 100;
    const reference = `GL-${order.id}`;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET || "";
    const signature = createHash("sha256")
      .update(`${reference}${amountInCents}COP${integritySecret}`)
      .digest("hex");

    // Widget checkout URL pattern for hosted checkout / redirect flow
    const params = new URLSearchParams({
      "public-key": publicKey,
      currency: "COP",
      "amount-in-cents": String(amountInCents),
      reference,
      "signature:integrity": signature,
      "redirect-url": `${siteUrl}/checkout/exito?order=${order.id}&provider=wompi`,
      "customer-data-email": order.shippingAddress.email,
    });

    return {
      provider: "wompi",
      orderId: order.id,
      redirectUrl: `https://checkout.wompi.co/p/?${params.toString()}`,
      externalId: reference,
      publicKey,
    };
  },
  async handleWebhook(payload) {
    const body = payload as {
      data?: { transaction?: { reference?: string; status?: string; id?: string } };
      event?: string;
    };

    const tx = body.data?.transaction;
    const reference = tx?.reference ?? "";
    const orderId = reference.replace(/^GL-/, "");
    const status =
      tx?.status === "APPROVED"
        ? "succeeded"
        : tx?.status === "DECLINED" || tx?.status === "ERROR"
          ? "failed"
          : "processing";

    return {
      orderId,
      status,
      externalId: tx?.id,
      provider: "wompi",
    };
  },
};
