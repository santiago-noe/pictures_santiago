import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { slugify, PROTECTED_CATEGORY_NAME } from "../lib/slugify";
import { HttpError } from "../middleware/errorHandler";

const createSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(40),
});

export async function listCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { photos: true } } },
  });

  res.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      protected: c.protected,
      photoCount: c._count.photos,
    })),
  });
}

export async function createCategory(req: Request, res: Response) {
  const { name } = createSchema.parse(req.body);
  const slug = slugify(name);

  const existing = await prisma.category.findUnique({
    where: { userId_slug: { userId: req.userId!, slug } },
  });
  if (existing) {
    throw new HttpError(400, "Ya tienes una categoría con ese nombre");
  }

  const category = await prisma.category.create({
    data: { name, slug, userId: req.userId! },
  });

  res.status(201).json({ category: { ...category, photoCount: 0 } });
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: { id, userId: req.userId },
  });
  if (!category) {
    throw new HttpError(404, "Categoría no encontrada");
  }
  if (category.protected) {
    throw new HttpError(409, `La categoría "${PROTECTED_CATEGORY_NAME}" no se puede eliminar`);
  }

  const fallback = await prisma.category.findFirst({
    where: { userId: req.userId, protected: true },
  });
  if (!fallback) {
    throw new HttpError(500, "No se encontró la categoría de respaldo");
  }

  await prisma.$transaction([
    prisma.photo.updateMany({
      where: { categoryId: category.id },
      data: { categoryId: fallback.id },
    }),
    prisma.category.delete({ where: { id: category.id } }),
  ]);

  res.json({ ok: true });
}
