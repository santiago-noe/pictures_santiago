# 04 — Despliegue

## Objetivo

Frontend en Vercel, backend + base de datos en Railway (trial 30 días), imágenes en Cloudinary (free tier). Documentado paso a paso porque requiere login interactivo del usuario en cada plataforma (no automatizable por el asistente).

## Variables de entorno

### Backend (Railway)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | La genera Railway automáticamente al añadir el plugin PostgreSQL |
| `JWT_SECRET` | Cadena aleatoria larga para firmar los JWT |
| `CLOUDINARY_CLOUD_NAME` | De tu cuenta Cloudinary |
| `CLOUDINARY_API_KEY` | De tu cuenta Cloudinary |
| `CLOUDINARY_API_SECRET` | De tu cuenta Cloudinary |
| `FRONTEND_URL` | URL del frontend en Vercel, para configurar CORS |
| `NODE_ENV` | `production` |
| `PORT` | Railway la inyecta automáticamente |

### Frontend (Vercel)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend en Railway (ej. `https://xxx.up.railway.app`) |

## Pasos

1. **Cloudinary**: crear cuenta gratuita en cloudinary.com → Dashboard → copiar `Cloud name`, `API Key`, `API Secret`.
2. **Railway**: crear proyecto nuevo → "Deploy from GitHub repo" (requiere repo en GitHub) → añadir plugin **PostgreSQL** → en el servicio backend, Settings → Root Directory = `backend` → añadir las variables de entorno de la tabla de arriba → Railway detecta Node y corre `npm install && npm run build && npm start` (definidos en `backend/package.json`); la migración de Prisma se aplica en el build (`prisma migrate deploy`).
3. **Vercel**: "Add New Project" → importar el mismo repo de GitHub → Root Directory = `frontend` → framework detectado automáticamente como Next.js → añadir `NEXT_PUBLIC_API_URL` con la URL pública de Railway → Deploy.
4. Volver a Railway y actualizar `FRONTEND_URL` con la URL final de Vercel (para que CORS la acepte) → redeploy backend.

## Criterios de aceptación

- Con las variables correctas, `npm run build` funciona igual en local que en Railway/Vercel (sin pasos manuales adicionales).
- El login funciona cross-domain entre el dominio de Vercel y el de Railway (cookie `SameSite=None; Secure` sobre HTTPS).
- El repo queda listo con git inicializado y un primer commit; conectar GitHub↔Railway↔Vercel es un paso manual del usuario (requiere sus credenciales).
