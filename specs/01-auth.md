# 01 — Autenticación

## Objetivo

Permitir que una persona cree su cuenta y luego inicie/cierre sesión de forma segura, con sesión persistida vía cookie httpOnly (no localStorage, para mitigar XSS).

## Requisitos funcionales

- Registro con: nombre, email (único), contraseña (mínimo 8 caracteres).
- Contraseña almacenada con hash `bcrypt` (nunca en texto plano).
- Login con email + contraseña → si es válido, se emite un JWT firmado y se manda como cookie `httpOnly; Secure; SameSite=None` (cross-domain Vercel↔Railway).
- Endpoint para conocer el usuario autenticado actual (`/me`).
- Logout: invalida la cookie (se sobreescribe con expiración inmediata).
- Rutas de fotos/categorías protegidas por middleware que exige sesión válida.
- Rate limiting básico en `/login` y `/register` para mitigar fuerza bruta.

## Contrato de API

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | `201 { user: {id,name,email} }` + set-cookie |
| POST | `/api/auth/login` | `{ email, password }` | `200 { user: {id,name,email} }` + set-cookie |
| POST | `/api/auth/logout` | — | `200 { ok: true }`, cookie limpiada |
| GET | `/api/auth/me` | — | `200 { user }` o `401` si no hay sesión |

Errores: `400` datos inválidos (zod), `409` email ya registrado, `401` credenciales incorrectas.

## Criterios de aceptación

- No se puede registrar dos veces con el mismo email (case-insensitive).
- Un login con contraseña incorrecta devuelve `401` sin filtrar si el email existe o no (mismo mensaje genérico).
- Al registrarse, quedan creadas las categorías por defecto del usuario (ver `02-categories.md`).
- Las rutas de `/api/photos` y `/api/categories` devuelven `401` sin cookie de sesión válida.
- La cookie de sesión expira (ej. 7 días) y se renueva en cada login.
