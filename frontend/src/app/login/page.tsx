"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { ApiError, useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/gallery");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Bienvenida de nuevo" subtitle="Inicia sesión para ver tu galería">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {submitting ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-accent-600 hover:underline">
          Crea una
        </Link>
      </p>
    </AuthCard>
  );
}
