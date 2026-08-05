"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";

export function UploadModal({
  categories,
  defaultCategoryId,
  onClose,
  onUpload,
}: {
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Selecciona una imagen");
      return;
    }
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("categoryId", categoryId);

    setSubmitting(true);
    try {
      await onUpload(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Subir foto</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-ink-200 p-4 text-center hover:border-accent-400">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Vista previa" className="mx-auto max-h-48 rounded-lg object-contain" />
            ) : (
              <span className="text-sm text-ink-500">
                Haz clic para elegir una imagen (JPG, PNG o WEBP, máx. 8MB)
              </span>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          </label>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              placeholder="Atardecer en la playa"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-600 disabled:opacity-60"
          >
            {submitting ? "Subiendo…" : "Subir foto"}
          </button>
        </form>
      </div>
    </div>
  );
}
