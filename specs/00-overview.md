# 00 — Visión general del producto

## Objetivo

Una app web donde cada persona crea su cuenta y sube sus fotos organizándolas por categoría, con una galería moderna y limpia. Uso personal/portafolio, no red social (cada usuario solo ve y gestiona sus propias fotos).

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS → desplegado en **Vercel**.
- **Backend**: Node.js + Express + TypeScript + Prisma ORM → desplegado en **Railway** (trial gratuito 30 días).
- **Base de datos**: PostgreSQL (plugin de Railway).
- **Almacenamiento de imágenes**: Cloudinary (plan gratuito) — Railway no persiste archivos entre despliegues, así que las fotos NO se guardan en disco del backend.
- **Auth**: email + contraseña, JWT en cookie `httpOnly`.

## Arquitectura

```
Usuario → Frontend (Vercel, Next.js)
              │  fetch con credentials:'include'
              ▼
        Backend API (Railway, Express)
              │            │
              ▼            ▼
        PostgreSQL     Cloudinary
        (Railway)      (imágenes)
```

## Flujo principal

1. Usuario se registra (nombre, email, contraseña) → se crean categorías por defecto para su cuenta.
2. Usuario inicia sesión → recibe cookie de sesión (JWT httpOnly).
3. Usuario entra a `/gallery`: ve tabs de categorías + grid de fotos.
4. Usuario sube una foto: elige archivo + título + categoría → se sube a Cloudinary → se guarda registro en DB.
5. Usuario filtra por categoría, borra o edita sus fotos.
6. Usuario cierra sesión.

## Fuera de alcance (v1)

- Compartir fotos entre usuarios o hacerlas públicas.
- Login social (Google, etc.).
- Edición de imágenes (recorte, filtros).
- Álbumes anidados o etiquetas múltiples (solo una categoría por foto).
