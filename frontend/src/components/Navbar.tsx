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
    <header className="sticky top-0 z-10 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-sm font-semibold text-white">
            M
          </div>
          <span className="text-sm font-semibold text-ink-900">Mi Galería</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-500 sm:inline">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
