# 03 — Fotos y galería

## Objetivo

Subir, ver, filtrar y borrar fotos en una galería moderna, limpia y responsive.

## Requisitos funcionales

- Subida de foto: archivo (jpg/png/webp, máx. 8MB), título obligatorio, descripción opcional, categoría obligatoria (del propio usuario).
- El archivo se sube a Cloudinary (carpeta por usuario) y se guarda `url` + `cloudinaryId` en la DB, junto con metadata.
- Listado de fotos del usuario, con filtro opcional por categoría (`?category=slug`) y orden por fecha descendente.
- Borrado de foto: elimina el registro en DB y el archivo en Cloudinary.
- Edición de foto: cambiar título, descripción o categoría (no reemplaza el archivo).
- Galería en frontend: tabs de categorías (incluye "Todas"), grid responsive de tarjetas con imagen, título y categoría, modal de subida con preview antes de confirmar, estado vacío ("Aún no subiste fotos en esta categoría") y loading states.

## Contrato de API

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/api/photos?category=slug` | — | `200 { photos: [{id,title,description,url,category,createdAt}] }` |
| POST | `/api/photos` | multipart: `file, title, description?, categoryId` | `201 { photo }` |
| PATCH | `/api/photos/:id` | `{ title?, description?, categoryId? }` | `200 { photo }` |
| DELETE | `/api/photos/:id` | — | `200 { ok: true }` |

Errores: `400` archivo inválido/demasiado grande o falta título/categoría, `404` foto no existe o no pertenece al usuario.

## Criterios de aceptación

- Subir un archivo que no sea imagen o que pese más de 8MB devuelve `400` y no crea registro ni sube nada a Cloudinary.
- Filtrar por categoría en la galería solo muestra fotos de esa categoría; "Todas" muestra todas.
- Borrar una foto la quita de Cloudinary (verificable por `cloudinaryId` ya no resuelve) y de la galería.
- La galería es usable en móvil (1 columna) y desktop (grid de varias columnas) sin overflow horizontal.

## Fuera de alcance

- Reordenar fotos manualmente, múltiples imágenes por "foto", edición de imagen (crop/filtros).
