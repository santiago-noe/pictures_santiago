"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-500" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Mi Galería
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink-400 sm:inline">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-200 transition hover:border-accent-500 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
