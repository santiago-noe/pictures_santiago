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
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-card sm:flex-row"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 bg-ink-100 sm:aspect-auto sm:w-2/3">
          <Image
            src={photo.url}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, 66vw"
            className="object-contain"
          />
        </div>

        <div className="flex w-full flex-col gap-3 overflow-y-auto p-5 sm:w-1/3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-ink-900">{photo.title}</h2>
            <button
              onClick={onClose}
              className="shrink-0 text-ink-400 hover:text-ink-700"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <span className="w-fit rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
            {photo.category.name}
          </span>

          <p className="whitespace-pre-wrap text-sm text-ink-600">
            {photo.description || "Sin descripción."}
          </p>

          <p className="mt-auto text-xs text-ink-400">
            Subida el{" "}
            {new Date(photo.createdAt).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
