import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-lg font-semibold text-ink">GoodLuck</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Ropa con carácter. Catálogo SS26, ediciones especiales y diseños a
            tu medida.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium text-ink">Explorar</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <Link href="/catalogo" className="hover:text-accent">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/disenar" className="hover:text-accent">
                Diseñador custom
              </Link>
            </li>
            <li>
              <Link href="/colecciones/dia-del-padre-2026" className="hover:text-accent">
                Día del Padre
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium text-ink">Envíos</p>
          <p className="mt-3 text-muted">
            Envíos a toda Colombia. Envío gratis en compras desde $200.000.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} GoodLuck. Todos los derechos reservados.
      </div>
    </footer>
  );
}
