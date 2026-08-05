"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category, Photo } from "@/lib/types";

export function PhotoViewModal({
  photo,
  categories,
  onClose,
  onChangeCategory,
}: {
  photo: Photo;
  categories: Category[];
  onClose: () => void;
  onChangeCategory: (photoId: string, categoryId: string) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  async function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const categoryId = e.target.value;
    if (categoryId === photo.category.id) return;
    setSaving(true);
    try {
      await onChangeCategory(photo.id, categoryId);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-black/95">
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl text-white transition hover:bg-black/70"
      >
        ✕
      </button>

      <div className="relative flex-1" onClick={onClose}>
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          sizes="100vw"
          priority
          className="object-contain"
        />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 bg-gradient-to-t from-black/95 to-black/60 px-5 py-4 text-white sm:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">{photo.title}</h2>

          <div className="relative">
            <select
              value={photo.category.id}
              onChange={handleCategoryChange}
              disabled={saving}
              className="appearance-none rounded-full border border-accent-500/40 bg-accent-500/20 py-0.5 pl-3 pr-7 text-xs font-semibold uppercase tracking-wide text-white outline-none hover:bg-accent-500/30 disabled:opacity-60"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-ink-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">
              ▾
            </span>
          </div>

          {saving && <span className="text-xs text-white/60">Guardando…</span>}
        </div>
        <p className="mx-auto mt-1 max-w-3xl whitespace-pre-wrap text-sm text-white/80">
          {photo.description || "Sin descripción."}
        </p>
        <p className="mx-auto mt-1 max-w-3xl text-xs text-white/50">
          Subida el{" "}
          {new Date(photo.createdAt).toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
