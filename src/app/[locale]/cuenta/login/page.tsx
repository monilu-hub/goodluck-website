import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <Suspense fallback={<div className="mx-auto h-80 max-w-md animate-pulse rounded-xl bg-border/40" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
