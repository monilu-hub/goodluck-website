import { DesignerStudio } from "@/components/designer/DesignerStudio";
import { getCustomizableProducts } from "@/lib/catalog";

export const metadata = {
  title: "Diseñar",
  description: "Crea tu propio diseño GoodLuck sobre prendas del catálogo.",
};

export default function DisenarPage() {
  const products = getCustomizableProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Diseñador GoodLuck
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Elige prenda y color, sube tu arte o escribe texto, y añade el
          resultado al carrito.
        </p>
      </div>
      <DesignerStudio products={products} />
    </div>
  );
}
