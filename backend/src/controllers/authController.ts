import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { clearSessionCookie, setSessionCookie, signSession } from "../lib/auth";
import { DEFAULT_CATEGORY_NAMES, PROTECTED_CATEGORY_NAME, slugify } from "../lib/slugify";
import { HttpError } from "../middleware/errorHandler";

const registerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

function toPublicUser(user: { id: string; name: string; email: string }) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "Ya existe una cuenta con ese email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({ data: { name, email, passwordHash } });

    await tx.category.createMany({
      data: DEFAULT_CATEGORY_NAMES.map((categoryName) => ({
        name: categoryName,
        slug: slugify(categoryName),
        protected: categoryName === PROTECTED_CATEGORY_NAME,
        userId: created.id,
      })),
    });

    return created;
  });

  const token = signSession({ userId: user.id });
  setSessionCookie(res, token);
  res.status(201).json({ user: toPublicUser(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !passwordMatches) {
    throw new HttpError(401, "Email o contraseña incorrectos");
  }

  const token = signSession({ userId: user.id });
  setSessionCookie(res, token);
  res.json({ user: toPublicUser(user) });
}

export function logout(_req: Request, res: Response) {
  clearSessionCookie(res);
  res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    throw new HttpError(401, "No autenticado");
  }
  res.json({ user: toPublicUser(user) });
}
