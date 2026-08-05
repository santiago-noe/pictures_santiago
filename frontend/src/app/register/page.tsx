"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { ApiError, useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push("/gallery");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Empieza ahora"
      title="Crea tu cuenta"
      subtitle="Guarda tus fotos organizadas por categoría"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-200">Nombre</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="Jeimy Sulca"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-200">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-200">Contraseña</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent-500 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {submitting ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-accent-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthCard>
  );
}
