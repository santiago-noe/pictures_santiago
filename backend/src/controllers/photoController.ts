import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { deleteImage, uploadImageBuffer } from "../lib/cloudinary";
import { HttpError } from "../middleware/errorHandler";

const uploadSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  categoryId: z.string().min(1, "La categoría es obligatoria"),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  categoryId: z.string().min(1).optional(),
});

function toPublicPhoto(photo: {
  id: string;
  title: string;
  description: string | null;
  url: string;
  createdAt: Date;
  category: { id: string; name: string; slug: string };
}) {
  return {
    id: photo.id,
    title: photo.title,
    description: photo.description,
    url: photo.url,
    createdAt: photo.createdAt,
    category: photo.category,
  };
}

async function assertOwnCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new HttpError(400, "Categoría inválida");
  }
  return category;
}

export async function listPhotos(req: Request, res: Response) {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;

  const photos = await prisma.photo.findMany({
    where: {
      userId: req.userId,
      ...(categorySlug && categorySlug !== "all"
        ? { category: { slug: categorySlug } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  res.json({ photos: photos.map(toPublicPhoto) });
}

export async function uploadPhoto(req: Request, res: Response) {
  const { title, description, categoryId } = uploadSchema.parse(req.body);

  if (!req.file) {
    throw new HttpError(400, "Debes adjuntar una imagen");
  }

  await assertOwnCategory(req.userId!, categoryId);

  const { url, publicId } = await uploadImageBuffer(req.file.buffer, `fotos/${req.userId}`);

  const photo = await prisma.photo.create({
    data: {
      title,
      description: description || null,
      url,
      cloudinaryId: publicId,
      categoryId,
      userId: req.userId!,
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  res.status(201).json({ photo: toPublicPhoto(photo) });
}

export async function updatePhoto(req: Request, res: Response) {
  const { id } = req.params;
  const data = updateSchema.parse(req.body);

  const existing = await prisma.photo.findFirst({ where: { id, userId: req.userId } });
  if (!existing) {
    throw new HttpError(404, "Foto no encontrada");
  }

  if (data.categoryId) {
    await assertOwnCategory(req.userId!, data.categoryId);
  }

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description || null } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });

  res.json({ photo: toPublicPhoto(photo) });
}

export async function deletePhoto(req: Request, res: Response) {
  const { id } = req.params;

  const existing = await prisma.photo.findFirst({ where: { id, userId: req.userId } });
  if (!existing) {
    throw new HttpError(404, "Foto no encontrada");
  }

  await prisma.photo.delete({ where: { id } });
  await deleteImage(existing.cloudinaryId).catch(() => undefined);

  res.json({ ok: true });
}
