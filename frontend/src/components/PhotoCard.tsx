"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/types";

export function PhotoCard({
  photo,
  onDelete,
  onView,
}: {
  photo: Photo;
  onDelete: (id: string) => Promise<void>;
  onView: (photo: Photo) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`¿Borrar "${photo.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(photo.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      onClick={() => onView(photo)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
        >
          {deleting ? "Borrando…" : "Borrar"}
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-ink-900">{photo.title}</p>
        <p className="mt-0.5 text-xs text-ink-500">{photo.category.name}</p>
      </div>
    </div>
  );
}
