import type { PaymentProvider } from "@/types";
import { codProvider } from "./cod";
import { mercadoPagoProvider } from "./mercadopago";
import { stripeProvider } from "./stripe";
import type { PaymentProviderAdapter } from "./types";
import { wompiProvider } from "./wompi";

const providers: PaymentProviderAdapter[] = [
  stripeProvider,
  wompiProvider,
  mercadoPagoProvider,
  codProvider,
];

export function listPaymentProviders() {
  return providers.map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
    available: p.available(),
  }));
}

export function getPaymentProvider(id: PaymentProvider): PaymentProviderAdapter {
  const provider = providers.find((p) => p.id === id);
  if (!provider) throw new Error(`Provider desconocido: ${id}`);
  return provider;
}

export type { PaymentProviderAdapter } from "./types";
