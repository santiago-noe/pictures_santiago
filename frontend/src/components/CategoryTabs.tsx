"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";

export function CategoryTabs({
  categories,
  activeSlug,
  onSelect,
  onCreate,
  totalCount,
}: {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  onCreate: (name: string) => Promise<void>;
  totalCount: number;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onCreate(name.trim());
      setName("");
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          activeSlug === "all"
            ? "bg-accent-500 text-white"
            : "border border-white/10 bg-white/5 text-ink-300 hover:border-white/25 hover:text-white"
        }`}
      >
        Todas ({totalCount})
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeSlug === cat.slug
              ? "bg-accent-500 text-white"
              : "border border-white/10 bg-white/5 text-ink-300 hover:border-white/25 hover:text-white"
          }`}
        >
          {cat.name} ({cat.photoCount})
        </button>
      ))}

      {creating ? (
        <form onSubmit={handleCreate} className="flex items-center gap-1">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="w-32 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-ink-500 outline-none focus:border-accent-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent-500 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => {
              setCreating(false);
              setName("");
            }}
            className="rounded-full px-2 py-1.5 text-sm text-ink-400 hover:text-white"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="rounded-full border border-dashed border-white/20 px-4 py-1.5 text-sm font-medium text-ink-400 hover:border-accent-500 hover:text-accent-400"
        >
          + Categoría
        </button>
      )}
    </div>
  );
}
