# Mi Galería

App para crear tu cuenta y guardar tus fotos organizadas por categoría.

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS → Vercel (free tier permanente)
- **Backend**: Node.js + Express + TypeScript + Prisma → Render (free tier permanente, sin vencimiento)
- **Base de datos**: PostgreSQL → Neon (free tier permanente)
- **Imágenes**: Cloudinary (plan gratuito)

> Se eligió Render + Neon en vez de Railway porque el trial gratis de Railway dura solo 30 días o $5 de crédito y luego pide tarjeta. Render/Neon no vencen, a cambio el backend "duerme" tras ~15 min sin tráfico (la primera petición tras estar inactivo tarda ~30-50s).

Metodología de desarrollo: **SDD (Spec Driven Development)**. Las especificaciones de cada funcionalidad están en [`specs/`](specs/): objetivo, contrato de API, criterios de aceptación. Empieza por [`specs/00-overview.md`](specs/00-overview.md).

## Estructura

```
fotos/
  specs/       specs SDD (una card por funcionalidad)
  backend/     API Express + Prisma
  frontend/    Next.js + Tailwind
```

## Desarrollo local

### 1. Base de datos (Postgres local con Docker)

```bash
docker run --name fotos-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fotos -p 5433:5432 -d postgres:16
```

Se usa el puerto **5433** (no 5432) porque en esta máquina ya hay un PostgreSQL nativo escuchando en 5432; si tu caso es distinto puedes usar 5432 y ajustar `DATABASE_URL` igual.

### 2. Cloudinary

Crea una cuenta gratuita en [cloudinary.com](https://cloudinary.com) y copia `Cloud name`, `API Key` y `API Secret` desde el Dashboard.

### 3. Backend

```bash
cd backend
cp .env.example .env
# Edita .env: DATABASE_URL, JWT_SECRET, CLOUDINARY_*
npm install
npm run prisma:migrate   # crea las tablas
npm run dev               # http://localhost:4000 (o el PORT que definas si el 4000 ya está ocupado)
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev               # http://localhost:3000
```

Abre `http://localhost:3000`, crea una cuenta y sube tu primera foto.

## Despliegue

Ver el detalle completo en [`specs/04-deployment.md`](specs/04-deployment.md). Resumen:

1. **Cloudinary**: cuenta gratuita → copiar credenciales.
2. **Neon**: cuenta gratuita en neon.tech → New Project → copiar el connection string (`DATABASE_URL`).
3. **GitHub**: sube este repo a un repositorio de GitHub (Render y Vercel despliegan conectando el repo).
4. **Render** (backend, free tier permanente):
   - New → Web Service → conectar el repo de GitHub.
   - Root Directory = `backend`. Build Command = `npm install && npm run build`. Start Command = `npm start`.
   - Variables de entorno: `DATABASE_URL` (de Neon), `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`.
   - `npm start` aplica las migraciones con `prisma migrate deploy` antes de arrancar.
5. **Vercel** (frontend):
   - Add New Project → importar el mismo repo.
   - Root Directory = `frontend`.
   - Variable `NEXT_PUBLIC_API_URL` = URL pública de Render.
6. Volver a Render y actualizar `FRONTEND_URL` con la URL final de Vercel → redeploy.

> Atajo: este repo incluye [`render.yaml`](render.yaml) (Blueprint de Render). En Render puedes usar "New → Blueprint", apuntarlo a este repo, y crea el servicio con la configuración ya lista — solo te pedirá rellenar `DATABASE_URL`, las de Cloudinary y `FRONTEND_URL`.

**Nota:** conectar tus cuentas de GitHub/Render/Vercel/Neon requiere que inicies sesión tú mismo (OAuth interactivo) — eso no se puede automatizar. El repo queda listo para importar directamente.

## Notas de seguridad

- Contraseñas con `bcrypt`, nunca en texto plano.
- Sesión vía JWT en cookie `httpOnly; Secure; SameSite=None` (no en `localStorage`, para mitigar robo de token por XSS).
- CORS restringido al dominio del frontend (`FRONTEND_URL`).
- Rate limiting en `/api/auth/login` y `/api/auth/register`.
- Cada usuario solo puede ver/editar sus propias categorías y fotos (validado en cada endpoint).
