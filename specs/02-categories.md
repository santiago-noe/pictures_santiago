# 02 — Categorías

## Objetivo

Cada usuario organiza sus fotos en categorías propias (no compartidas entre usuarios).

## Requisitos funcionales

- Al registrarse un usuario, se siembran automáticamente 6 categorías por defecto: **Naturaleza, Retratos, Viajes, Eventos, Familia, Otros**.
- El usuario puede crear categorías propias adicionales (nombre único por usuario).
- El usuario puede borrar una categoría propia; si tiene fotos asociadas, las fotos se reasignan a "Otros" (no se borran fotos al borrar una categoría).
- No se pueden borrar categorías de otro usuario ni verlas.

## Contrato de API

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/api/categories` | — | `200 { categories: [{id,name,slug,photoCount}] }` |
| POST | `/api/categories` | `{ name }` | `201 { category }` |
| DELETE | `/api/categories/:id` | — | `200 { ok: true }` |

Errores: `400` nombre vacío/duplicado, `404` categoría no existe o no pertenece al usuario, `409` intento de borrar "Otros" (categoría protegida, no se puede eliminar).

## Criterios de aceptación

- Un usuario nuevo, al hacer `GET /api/categories` justo después de registrarse, ve las 6 categorías por defecto.
- Crear una categoría con nombre repetido (mismo usuario) da `400`.
- Borrar una categoría con fotos mueve esas fotos a "Otros" y el conteo de fotos se actualiza en ambas categorías.
- La categoría "Otros" no se puede eliminar.
