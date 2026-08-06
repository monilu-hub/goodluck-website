"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/types";

const DesignerStudio = dynamic(
  () =>
    import("./DesignerStudio").then((m) => m.DesignerStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-border bg-surface">
        <p className="text-sm text-muted">Cargando diseñador…</p>
      </div>
    ),
  },
);

type Props = {
  products: Product[];
  initialSlug?: string;
  initialColor?: string;
  initialSize?: string;
  initialPhrase?: string;
};

export function DesignerLazy(props: Props) {
  return <DesignerStudio {...props} />;
}
