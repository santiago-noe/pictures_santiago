export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const DEFAULT_CATEGORY_NAMES = [
  "Naturaleza",
  "Retratos",
  "Viajes",
  "Eventos",
  "Familia",
  "Otros",
];

export const PROTECTED_CATEGORY_NAME = "Otros";
