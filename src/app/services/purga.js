// src/services/purga.js
// ─────────────────────────────────────────────────────────────────────────────
// Lógica de purga de la base de datos.
//
// "Purgar" significa eliminar definitivamente registros históricos que ya no
// tienen utilidad operativa, reduciendo el tamaño de la DB.
//
// A diferencia del soft delete (eliminado: true), la purga reemplaza el
// registro completo por un tombstone mínimo:
//   { id, eliminado: true, actualizadoEn }
//
// El tombstone viaja en el siguiente sync para que el merge remoto sepa
// que ese ID fue eliminado intencionalmente y no lo restituya.
// Una vez que ambos dispositivos sincronizaron, el tombstone desaparece
// del resultado final (ver mergeDatos en driveSync.js).
//
// Para añadir lógica de purga a una colección nueva, agregar una entrada
// en el objeto REGLAS_PURGA al final de este archivo.
// ─────────────────────────────────────────────────────────────────────────────

import { indiceMes } from "./calculos"

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Crea un tombstone a partir de un registro existente.
 * El tombstone conserva solo id y la marca de eliminado+fecha.
 * Todos los demás campos (nombre, monto, etc.) se descartan.
 */
function _tombstone(item) {
  return {
    id: item.id,
    eliminado: true,
    actualizadoEn: new Date().toISOString(),
  }
}

/**
 * Procesa un array de registros y convierte en tombstone los que
 * cumplan la condición esElimínable(item, anioPurga).
 * Los que no la cumplen se devuelven intactos.
 */
function _purgarColeccion(arr = [], esEliminable, anioPurga) {
  return arr.map(item => {
    // Si ya es tombstone (de una purga anterior), lo dejamos como está
    if (item.eliminado && Object.keys(item).length === 3) return item
    return esEliminable(item, anioPurga) ? _tombstone(item) : item
  })
}

// ── Reglas de elegibilidad por colección ──────────────────────────────────────
//
// Cada función recibe (item, anioPurga) y devuelve true si el registro
// puede ser eliminado definitivamente.
//
// Criterio general: un registro es purgable cuando su actividad terminó
// ANTES del año de corte, es decir, ya no afecta ningún cálculo futuro.
//
// ⚠️  Si añadís una nueva colección al merge (driveSync.js), considerá
//     si necesita regla de purga aquí también.

const REGLAS_PURGA = {

  // Salarios: purgable si tiene fecha de fin y terminó antes del año de corte.
  // Los salarios sin fin (mesFin=null) son activos y nunca se purgan.
  salarios: (item, anioPurga) => {
    if (item.mesFin === null || item.anioFin === null) return false
    return item.anioFin < anioPurga
  },

  // Variaciones (ingresos puntuales): purgable si el año del ingreso
  // es anterior al año de corte.
  variaciones: (item, anioPurga) => {
    return item.anio < anioPurga
  },

  // Egresos: purgable si tiene fecha de fin y terminó antes del año de corte.
  // Los egresos sin fin (mesFin=null) son activos y nunca se purgan.
  egresos: (item, anioPurga) => {
    if (item.mesFin === null || item.anioFin === null) return false
    return item.anioFin < anioPurga
  },

  // Ajustes (créditos y fondos personales):
  //   - Pago único: purgable si su mes/año es anterior al año de corte.
  //   - Cuotas: purgable si la última cuota terminó antes del año de corte.
  //     La última cuota cae en: mesInicio + numCuotas - 1 (en índice de mes).
  ajustes: (item, anioPurga) => {
    if (item.forma === "unico") {
      return item.anio < anioPurga
    }
    if (item.forma === "cuotas") {
      // Índice del mes en que cae la última cuota
      const indiceUltimaCuota = indiceMes(item.anioInicio, item.mesInicio) + item.numCuotas - 1
      // Índice del primer mes del año de corte
      const indiceCorteMes1   = indiceMes(anioPurga, 1)
      return indiceUltimaCuota < indiceCorteMes1
    }
    return false
  },

  // Inversiones — el array mezcla dos tipos (ver documentación):
  //   Tipo 1 (sin cuentaId): inversión mensual recurrente o puntual.
  //     - Recurrente: purgable si tiene fin y terminó antes del año de corte.
  //     - Puntual (tiene mes/anio): purgable si el año es anterior al corte.
  //   Tipo 2 (con cuentaId): registro de rendimiento mensual.
  //     - Purgable si el año del registro es anterior al año de corte.
  inversiones: (item, anioPurga) => {
    if (item.cuentaId) {
      // Tipo 2: registro de rendimiento
      return item.anio < anioPurga
    }
    // Tipo 1 recurrente
    if (item.mesInicio != null) {
      if (item.mesFin === null || item.anioFin === null) return false
      return item.anioFin < anioPurga
    }
    // Tipo 1 puntual
    return item.anio < anioPurga
  },

  // Las siguientes colecciones NO se purgan automáticamente:
  //
  // cuentasInversion: son metadata (nombre de la cuenta). Pesan muy poco
  //   y son referenciadas por los registros de inversiones. Si se purgan
  //   antes que sus registros, los registros quedan huérfanos.
  //
  // planes: notas cualitativas. El usuario decide cuándo borrarlas manualmente.
  //
  // ubicacion: tabla libre de "dónde está el dinero". Es un snapshot actual,
  //   no un historial — no tiene fechas de actividad por las que filtrar.
  //
  // extra1, extra2, extra3: reservados, sin lógica definida aún.
}

// ── Función principal ─────────────────────────────────────────────────────────

/**
 * Purga la base de datos eliminando registros históricos anteriores a anioPurga.
 *
 * @param {object} datos    - El objeto completo de la DB (de AppContext).
 * @param {number} anioPurga - Año de corte (ej: 2026 purga todo lo anterior a 2026).
 *                            Los registros del propio año de corte NO se purgan.
 * @returns {{ datosPurgados: object, resumen: object }}
 *   - datosPurgados: nueva DB lista para guardar con actualizarDatos()
 *   - resumen: cuántos registros se purgaron por colección (para mostrar en UI)
 *
 * Uso típico desde Ajustes.jsx:
 *   const { datosPurgados, resumen } = purgarDatos(datos, 2025)
 *   actualizarDatos(datosPurgados)
 *   // → forzar sync para que los tombstones lleguen a la nube
 */
export function purgarDatos(datos, anioPurga) {
  const datosPurgados = { ...datos }
  const resumen = {}

  for (const [coleccion, esEliminable] of Object.entries(REGLAS_PURGA)) {
    const original = datos[coleccion] || []
    const procesado = _purgarColeccion(original, esEliminable, anioPurga)

    // Contamos cuántos registros pasaron a ser tombstones en esta ejecución
    // (excluimos los que ya eran tombstones de purgas anteriores)
    const purgados = procesado.filter(
      (item, i) => _esTombstoneNuevo(item, original[i])
    ).length

    datosPurgados[coleccion] = procesado
    resumen[coleccion] = purgados
  }

  resumen.total = Object.values(resumen).reduce((a, b) => a + b, 0)
  return { datosPurgados, resumen }
}

/**
 * Devuelve true si el item procesado es un tombstone que no lo era antes.
 * Usado solo para contar cuántos registros se purgaron en esta pasada.
 */
function _esTombstoneNuevo(itemProcesado, itemOriginal) {
  const esTS = itemProcesado.eliminado && Object.keys(itemProcesado).length === 3
  const eraTS = itemOriginal.eliminado && Object.keys(itemOriginal).length === 3
  return esTS && !eraTS
}
