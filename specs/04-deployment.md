# 04 — Despliegue

## Objetivo

Frontend en Vercel, backend en Render (free tier, sin vencimiento), base de datos en Neon (Postgres gratis permanente), imágenes en Cloudinary (free tier). Documentado paso a paso porque requiere login interactivo del usuario en cada plataforma (no automatizable por el asistente).

Se eligió Render + Neon sobre Railway porque el trial gratuito de Railway dura solo 30 días o $5 de crédito (lo que ocurra primero) y luego exige tarjeta; Render y Neon tienen planes gratuitos permanentes. Contrapartida: el free tier de Render "duerme" el servicio tras ~15 min sin tráfico, así que la primera petición después de estar inactivo tarda unos 30-50s en responder (arranque en frío).

## Variables de entorno

### Backend (Render)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Neon (con `?sslmode=require`) |
| `JWT_SECRET` | Cadena aleatoria larga para firmar los JWT |
| `CLOUDINARY_CLOUD_NAME` | De tu cuenta Cloudinary |
| `CLOUDINARY_API_KEY` | De tu cuenta Cloudinary |
| `CLOUDINARY_API_SECRET` | De tu cuenta Cloudinary |
| `FRONTEND_URL` | URL del frontend en Vercel, para configurar CORS |
| `NODE_ENV` | `production` |
| `PORT` | Render la inyecta automáticamente |

### Frontend (Vercel)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend en Render (ej. `https://fotos-backend.onrender.com`) |

## Pasos

1. **Cloudinary**: crear cuenta gratuita en cloudinary.com → Dashboard → copiar `Cloud name`, `API Key`, `API Secret`.
2. **Neon**: crear cuenta gratuita en neon.tech → New Project → copiar el connection string (`DATABASE_URL`, ya incluye `?sslmode=require`).
3. **Render**: New → Web Service → conectar el repo de GitHub → Root Directory = `backend` → Build Command `npm install && npm run build` → Start Command `npm start` (aplica `prisma migrate deploy` antes de arrancar, ver `backend/package.json`) → añadir las variables de entorno de la tabla de arriba → Deploy. El plan **Free** alcanza para esto.
4. **Vercel**: "Add New Project" → importar el mismo repo de GitHub → Root Directory = `frontend` → framework detectado automáticamente como Next.js → añadir `NEXT_PUBLIC_API_URL` con la URL pública de Render → Deploy.
5. Volver a Render y actualizar `FRONTEND_URL` con la URL final de Vercel (para que CORS la acepte) → redeploy backend.

## Criterios de aceptación

- Con las variables correctas, `npm run build` funciona igual en local que en Render/Vercel (sin pasos manuales adicionales).
- El login funciona cross-domain entre el dominio de Vercel y el de Render (cookie `SameSite=None; Secure` sobre HTTPS).
- El repo queda listo con git inicializado y un primer commit; conectar GitHub↔Render↔Vercel↔Neon es un paso manual del usuario (requiere sus credenciales).
- Ninguno de los servicios usados (Vercel, Render, Neon, Cloudinary) tiene fecha de vencimiento en su plan gratuito.
