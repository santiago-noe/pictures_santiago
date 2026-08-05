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
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
    >
      <Image
        src={photo.url}
        alt={photo.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
      >
        {deleting ? "Borrando…" : "Borrar"}
      </button>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-400">
          {photo.category.name}
        </p>
        <p className="mt-1 truncate text-sm font-bold uppercase text-white">{photo.title}</p>
      </div>
    </div>
  );
}
