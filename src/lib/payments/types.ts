import type { Order, PaymentProvider, PaymentResult, PaymentSession } from "@/types";

export interface PaymentProviderAdapter {
  id: PaymentProvider;
  label: string;
  description: string;
  available: () => boolean;
  createSession: (order: Order) => Promise<PaymentSession>;
  handleWebhook: (payload: unknown, headers?: Headers) => Promise<PaymentResult>;
}
