"use client";

import Image from "next/image";
import type { Photo } from "@/lib/types";

export function PhotoViewModal({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
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
          <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium">
            {photo.category.name}
          </span>
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
