// src/services/calculos.js
// ─────────────────────────────────────────────────────────────────────────────
// Toda la lógica de cálculo financiero de la app en un único lugar.
// Importar desde cualquier página con:
//   import { calcularMes, lunesEnMes, ... } from "../services/calculos"
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilidades de fecha ───────────────────────────────────────────────────────

/** Índice numérico de un mes: permite comparar meses con > < === */
export function indiceMes(anio, mes) {
  return anio * 12 + mes
}

/** Cuenta cuántos lunes hay en el mes dado (usado para egresos semanales) */
export function lunesEnMes(anio, mes) {
  let count = 0
  const d = new Date(anio, mes - 1, 1)
  while (d.getMonth() === mes - 1) {
    if (d.getDay() === 1) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

/** Devuelve el monto real de un egreso para un mes concreto */
export function montoEgresoMes(egreso, anio, mes) {
  if (egreso.frecuencia === "s") return egreso.monto * lunesEnMes(anio, mes)
  return egreso.monto
}

/** Devuelve un array con los próximos N meses a partir del mes siguiente al actual */
export function proximosMeses(n = 6) {
  const hoy = new Date()
  let mes = hoy.getMonth() + 2
  let anio = hoy.getFullYear()
  const result = []
  for (let i = 0; i < n; i++) {
    if (mes > 12) { mes = 1; anio++ }
    result.push({ mes, anio })
    mes++
  }
  return result
}

// ── Filtros de actividad por mes ──────────────────────────────────────────────

/** Salarios activos para un usuario en un mes/año dado */
export function salarioActivoEnMes(salarios, usuarioId, mes, anio, alcance = null) {
  const consulta = indiceMes(anio, mes)
  return (salarios || []).filter(s => {
    if (s.eliminado) return false
    if (s.usuarioId !== usuarioId) return false
    if (alcance !== null && (s.alcance || "compartido") !== alcance) return false
    const inicio = indiceMes(s.anioInicio, s.mesInicio)
    const fin = s.mesFin === null ? Infinity : indiceMes(s.anioFin, s.mesFin)
    return consulta >= inicio && consulta <= fin
  })
}

/** Variaciones activas para un usuario en un mes/año dado */
export function variacionActivaEnMes(variaciones, usuarioId, mes, anio, alcance = null) {
  return (variaciones || []).filter(v => {
    if (v.eliminado) return false
    if (v.usuarioId !== usuarioId) return false
    if (alcance !== null && (v.alcance || "compartido") !== alcance) return false
    return v.mes === mes && v.anio === anio
  })
}

/** Egresos activos en un mes/año dado */
export function egresosActivosEnMes(egresos, mes, anio) {
  const consulta = indiceMes(anio, mes)
  return (egresos || []).filter(e => {
    if (e.eliminado) return false
    const inicio = indiceMes(e.anioInicio, e.mesInicio)
    const fin = e.mesFin === null ? Infinity : indiceMes(e.anioFin, e.mesFin)
    return consulta >= inicio && consulta <= fin
  })
}

/** Inversiones mensuales activas (tipo 1, sin cuentaId) en un mes/año dado */
export function inversionesActivasEnMes(inversiones, mes, anio) {
  const consulta = indiceMes(anio, mes)
  return (inversiones || []).filter(e => {
    if (e.eliminado) return false
    if (e.cuentaId) return false // tipo 2 = rendimientos, ignorar
    if (e.mesInicio != null) {
      const inicio = indiceMes(e.anioInicio, e.mesInicio)
      const fin = e.mesFin == null ? Infinity : indiceMes(e.anioFin, e.mesFin)
      return consulta >= inicio && consulta <= fin
    } else {
      return indiceMes(e.anio, e.mes) === consulta
    }
  })
}

/** Ajustes activos para un usuario en un mes/año dado */
export function ajustesActivosEnMes(ajustes, usuarioId, mes, anio) {
  const consulta = indiceMes(anio, mes)
  return (ajustes || []).filter(a => {
    if (a.eliminado) return false
    if (a.usuarioId !== usuarioId) return false
    if (a.forma === "unico") return a.mes === mes && a.anio === anio
    const inicio = indiceMes(a.anioInicio, a.mesInicio)
    return consulta >= inicio && consulta <= inicio + a.numCuotas - 1
  })
}

// ── Cálculo de ingreso total compartido ──────────────────────────────────────

/**
 * Suma todos los ingresos compartidos de TODOS los usuarios para un mes.
 * Usado para calcular el reparto proporcional.
 */
export function calcularIngresoCompartidoTotal(datos, mes, anio) {
  return (datos.config.usuarios || []).reduce((acc, u) => {
    const sueldos = salarioActivoEnMes(datos.salarios, u.id, mes, anio, "compartido")
      .reduce((a, s) => a + s.monto, 0)
    const extras = variacionActivaEnMes(datos.variaciones, u.id, mes, anio, "compartido")
      .reduce((a, v) => a + v.monto, 0)
    return acc + sueldos + extras
  }, 0)
}

// ── Ingresos totales de todos los usuarios (compartidos + individuales) ────────

/**
 * Suma TODOS los ingresos de TODOS los usuarios para un mes:
 * salarios compartidos + salarios individuales + variaciones compartidas + variaciones individuales.
 *
 * Usado para la columna "Ingresos" en la pantalla Home.
 *
 * NOTA: Este valor es el ingreso bruto del hogar, sin aplicar reparto.
 * Si en el futuro se quiere mostrar el ingreso proporcional al usuario activo,
 * se puede usar: (ingresoCompartidoTotal * pct) + ingresoIndividualUsuario
 * donde pct viene de calcularMes().
 */
export function calcularIngresosTotales(datos, mes, anio) {
  return (datos.config.usuarios || []).reduce((acc, u) => {
    const sueldos = salarioActivoEnMes(datos.salarios, u.id, mes, anio)
      .reduce((a, s) => a + s.monto, 0)
    const extras = variacionActivaEnMes(datos.variaciones, u.id, mes, anio)
      .reduce((a, v) => a + v.monto, 0)
    return acc + sueldos + extras
  }, 0)
}

// ── Egresos totales del hogar ─────────────────────────────────────────────────

/**
 * Suma todos los egresos fijos compartidos + inversiones + aporte al fondo
 * para un mes. Es el total del hogar, sin aplicar reparto.
 *
 * Usado para la columna "Egresos" en la pantalla Home.
 *
 * NOTA FUTURA: si se quiere mostrar la parte proporcional del usuario activo,
 * multiplicar el resultado por el porcentaje de reparto (pct) que devuelve
 * calcularMes(). Los gastos personales (ajustes: créditos y fondos) no están
 * incluidos aquí — esos ya aparecen en la columna "Gastos" como gasto personal.
 */
export function calcularEgresosTotales(datos, mes, anio) {
  const egresosBase = egresosActivosEnMes(datos.egresos, mes, anio)
    .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)

  const inversionesTotales = inversionesActivasEnMes(datos.inversiones, mes, anio)
    .reduce((acc, e) => acc + e.monto, 0)

  const aporteFondo = calcularAporteFondo(datos, mes, anio)

  return egresosBase + inversionesTotales + aporteFondo
}

// ── Cálculo del aporte al fondo de emergencia ─────────────────────────────────

/**
 * Devuelve el aporte mensual al fondo de emergencia para un mes dado.
 * Devuelve 0 si el fondo no está activo o el mes es anterior al inicio.
 */
export function calcularAporteFondo(datos, mes, anio) {
  if (!datos.fondoEmergencia?.activo) return 0
  const consulta = indiceMes(anio, mes)
  const inicioFondo = indiceMes(datos.fondoEmergencia.anioInicio, datos.fondoEmergencia.mesInicio)
  if (consulta < inicioFondo) return 0

  const ingresoTotal = calcularIngresoCompartidoTotal(datos, mes, anio)
  if (datos.fondoEmergencia.tipo === "porcentaje") {
    return ingresoTotal * (datos.fondoEmergencia.valor / 100)
  }
  return datos.fondoEmergencia.valor
}

// ── Función principal de cálculo de un mes ───────────────────────────────────

/**
 * Calcula el resumen financiero de un usuario para un mes/año.
 * Devuelve: { netoProvisorio, gastos, netoFinal }
 */
export function calcularMes(datos, usuarioId, mes, anio) {
  const usuario = datos.config.usuarios.find(u => u.id === usuarioId)
  if (!usuario) return { netoProvisorio: 0, gastos: 0, netoFinal: 0 }

  const numUsuarios = datos.config.numUsuarios
  const reparto = datos.config.reparto

  // Ingresos del usuario
  const ingresoCompartidoUsuario =
    salarioActivoEnMes(datos.salarios, usuarioId, mes, anio, "compartido").reduce((a, s) => a + s.monto, 0) +
    variacionActivaEnMes(datos.variaciones, usuarioId, mes, anio, "compartido").reduce((a, v) => a + v.monto, 0)

  const ingresoIndividualUsuario =
    salarioActivoEnMes(datos.salarios, usuarioId, mes, anio, "individual").reduce((a, s) => a + s.monto, 0) +
    variacionActivaEnMes(datos.variaciones, usuarioId, mes, anio, "individual").reduce((a, v) => a + v.monto, 0)

  const ingresoCompartidoTotal = calcularIngresoCompartidoTotal(datos, mes, anio)

  // Egresos del mes
  const egresosBase = egresosActivosEnMes(datos.egresos, mes, anio)
    .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)

  const inversionesTotales = inversionesActivasEnMes(datos.inversiones, mes, anio)
    .reduce((acc, e) => acc + e.monto, 0)

  const aporteFondo = calcularAporteFondo(datos, mes, anio)

  const egresosTotales = egresosBase + inversionesTotales + aporteFondo

  // Reparto
  let pct
  if (reparto === "proporcional" && ingresoCompartidoTotal > 0) {
    pct = ingresoCompartidoUsuario / ingresoCompartidoTotal
  } else {
    pct = 1 / numUsuarios
  }

  const netoProvisorio = (ingresoCompartidoTotal - egresosTotales) * pct + ingresoIndividualUsuario

  // Gastos personales (créditos y fondos del usuario)
  const gastos = ajustesActivosEnMes(datos.ajustes, usuarioId, mes, anio)
    .reduce((acc, a) => acc + (a.forma === "cuotas" ? a.montoCuota : a.montoTotal), 0)

  const netoFinal = netoProvisorio - gastos

  return { netoProvisorio, gastos, netoFinal }
}

// ── Desglose de gastos para bottom sheet ─────────────────────────────────────

/**
 * Devuelve los ajustes activos de un usuario separados por tipo (fondo / crédito).
 * Incluye info de cuota actual para mostrar "cuota N de M".
 */
export function calcularDetalleGastos(datos, usuarioId, mes, anio) {
  const fondos = []
  const creditos = []
  const consulta = indiceMes(anio, mes)

  ;(datos.ajustes || []).forEach(a => {
    if (a.eliminado || a.usuarioId !== usuarioId) return
    let activo = false
    let cuotaActual = null
    if (a.forma === "unico") {
      activo = a.mes === mes && a.anio === anio
    } else {
      const inicio = indiceMes(a.anioInicio, a.mesInicio)
      activo = consulta >= inicio && consulta <= inicio + a.numCuotas - 1
      if (activo) cuotaActual = consulta - inicio + 1
    }
    if (!activo) return
    const item = {
      nombre: a.nombre,
      monto: a.forma === "cuotas" ? a.montoCuota : a.montoTotal,
      cuotaActual,
      numCuotas: a.numCuotas ?? null,
    }
    if (a.tipo === "fondo") fondos.push(item)
    else creditos.push(item)
  })
  return { fondos, creditos }
}