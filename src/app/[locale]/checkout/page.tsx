import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { listPaymentProviders } from "@/lib/payments";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  const providers = listPaymentProviders();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink">
        Checkout
      </h1>
      <CheckoutForm providers={providers} />
    </div>
  );
}
