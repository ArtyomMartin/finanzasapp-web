// src/services/formateo.js
// ─────────────────────────────────────────────────────────────────────────────
// Helpers de formato y presentación. Sin dependencias externas.
// ─────────────────────────────────────────────────────────────────────────────

export const NOMBRES_MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

/** Nombre del mes (1-12) */
export function nombreMes(mes) {
  return NOMBRES_MESES[mes - 1] ?? ""
}

/**
 * Formatea un número como moneda.
 * @param {number} n
 * @param {string} locale  — p.ej. "es-ES"
 * @param {string} simbolo — p.ej. "€"
 */
export function fmt(n, locale, simbolo) {
  return n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " " + simbolo
}

/**
 * Dado un índice de mes (anio*12+mes) devuelve { mes, anio }.
 * Útil para iterar rangos de meses.
 */
export function mesAnioDesdeIndice(indice) {
  const anio = Math.floor(indice / 12)
  const mes  = indice % 12 || 12
  return { mes, anio }
}

/** Formatea una fecha ISO como "dd/mm/aaaa" */
export function formatearFecha(isoString) {
  if (!isoString) return ""
  const d = new Date(isoString)
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}
