"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Category, Photo } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { PhotoCard } from "@/components/PhotoCard";
import { PhotoViewModal } from "@/components/PhotoViewModal";
import { UploadModal } from "@/components/UploadModal";

export default function GalleryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeSlug, setActiveSlug] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const loadCategories = useCallback(async () => {
    const res = await api.get<{ categories: Category[] }>("/api/categories");
    setCategories(res.categories);
  }, []);

  const loadPhotos = useCallback(async (slug: string) => {
    const query = slug === "all" ? "" : `?category=${encodeURIComponent(slug)}`;
    const res = await api.get<{ photos: Photo[] }>(`/api/photos${query}`);
    setPhotos(res.photos);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([loadCategories(), loadPhotos(activeSlug)]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeSlug]);

  async function handleCreateCategory(name: string) {
    await api.post("/api/categories", { name });
    await loadCategories();
  }

  async function handleUpload(formData: FormData) {
    await api.post("/api/photos", formData);
    await Promise.all([loadCategories(), loadPhotos(activeSlug)]);
  }

  async function handleDeletePhoto(id: string) {
    await api.delete(`/api/photos/${id}`);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setViewingPhoto((prev) => (prev?.id === id ? null : prev));
    loadCategories();
  }

  async function handleChangeCategory(photoId: string, categoryId: string) {
    const res = await api.patch<{ photo: Photo }>(`/api/photos/${photoId}`, { categoryId });
    setViewingPhoto(res.photo);
    await Promise.all([loadCategories(), loadPhotos(activeSlug)]);
  }

  const totalCount = categories.reduce((sum, c) => sum + c.photoCount, 0);
  const defaultCategoryId =
    categories.find((c) => c.slug === activeSlug)?.id ?? categories[0]?.id ?? "";

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <p className="text-sm text-ink-400">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />

      <div className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-accent-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">
            Hola, {user.name.split(" ")[0]}
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-[1.05] text-white sm:text-5xl">
            Tu galería
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-400">
            {totalCount} {totalCount === 1 ? "foto guardada" : "fotos guardadas"} en{" "}
            {categories.length} categorías.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <CategoryTabs
            categories={categories}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
            onCreate={handleCreateCategory}
            totalCount={totalCount}
          />
          <button
            onClick={() => setShowUpload(true)}
            className="rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-accent-600"
          >
            + Subir foto
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 py-20 text-center">
            <p className="text-sm font-medium text-white">Aún no subiste fotos aquí</p>
            <p className="mt-1 text-sm text-ink-400">Sube tu primera foto en esta categoría</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-accent-600"
            >
              + Subir foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDelete={handleDeletePhoto}
                onView={setViewingPhoto}
              />
            ))}
          </div>
        )}
      </main>

      {showUpload && (
        <UploadModal
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}

      {viewingPhoto && (
        <PhotoViewModal
          photo={viewingPhoto}
          categories={categories}
          onClose={() => setViewingPhoto(null)}
          onChangeCategory={handleChangeCategory}
        />
      )}
    </div>
  );
}
