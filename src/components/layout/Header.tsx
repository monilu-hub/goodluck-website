"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart-store";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/colecciones/ss26", label: "SS26" },
  { href: "/colecciones/mundial-fifa26", label: "Mundial" },
  { href: "/disenar", label: "Diseñar" },
];

export function Header() {
  const count = useCartStore((s) => s.count());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-ink transition group-hover:text-accent">
            GoodLuck
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:inline">
            apparel
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/cuenta/login" className="text-muted hover:text-ink">
            Cuenta
          </Link>
          <Link
            href="/checkout"
            className="rounded-full bg-ink px-3 py-1.5 text-surface transition hover:bg-accent"
          >
            Carrito{mounted ? ` (${count})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
