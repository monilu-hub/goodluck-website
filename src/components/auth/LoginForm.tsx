"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/cuenta/pedidos";
  const configured = isSupabaseConfigured();
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase no está configurado. Añade las variables en .env.local");
      setLoading(false);
      return;
    }

    if (mode === "magic") {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/cuenta/pedidos`,
        },
      });
      if (authError) setError(authError.message);
      else setMessage("Revisa tu correo para el enlace mágico.");
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) setError(signUpError.message);
        else {
          setMessage("Cuenta creada. Si el email confirmation está activo, revisa tu bandeja.");
          router.push(next);
          router.refresh();
        }
      } else {
        router.push(next);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-6"
    >
      <h1 className="text-2xl font-semibold text-ink">Tu cuenta GoodLuck</h1>
      <p className="mt-2 text-sm text-muted">
        Accede para ver pedidos y diseños guardados.
      </p>

      {!configured && (
        <p className="mt-4 rounded-md bg-highlight/10 px-3 py-2 text-sm text-highlight">
          Modo local: configura NEXT_PUBLIC_SUPABASE_URL y
          NEXT_PUBLIC_SUPABASE_ANON_KEY para activar auth.
        </p>
      )}

      <div className="mt-5 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`rounded-full px-3 py-1 ${mode === "magic" ? "bg-ink text-surface" : "border border-border"}`}
        >
          Magic link
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-full px-3 py-1 ${mode === "password" ? "bg-ink text-surface" : "border border-border"}`}
        >
          Email y contraseña
        </button>
      </div>

      <label className="mt-5 block text-sm text-muted">
        Email
        <input
          required
          type="email"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-ink"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      {mode === "password" && (
        <label className="mt-3 block text-sm text-muted">
          Contraseña
          <input
            required
            type="password"
            minLength={6}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-ink"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}

      {error && <p className="mt-3 text-sm text-highlight">{error}</p>}
      {message && <p className="mt-3 text-sm text-accent">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-medium text-surface hover:bg-accent disabled:opacity-60"
      >
        {loading ? "..." : mode === "magic" ? "Enviar enlace" : "Entrar / Registrarse"}
      </button>
    </form>
  );
}
