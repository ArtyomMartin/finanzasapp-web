// src/services/calculos.js

// ── Utilidades de fecha ───────────────────────────────────────────────────────

export function indiceMes(anio, mes) {
  return anio * 12 + mes
}

export function lunesEnMes(anio, mes) {
  let count = 0
  const d = new Date(anio, mes - 1, 1)
  while (d.getMonth() === mes - 1) {
    if (d.getDay() === 1) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

export function montoEgresoMes(egreso, anio, mes) {
  if (egreso.frecuencia === "s") return egreso.monto * lunesEnMes(anio, mes)
  return egreso.monto
}

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

export function variacionActivaEnMes(variaciones, usuarioId, mes, anio, alcance = null) {
  return (variaciones || []).filter(v => {
    if (v.eliminado) return false
    if (v.usuarioId !== usuarioId) return false
    if (alcance !== null && (v.alcance || "compartido") !== alcance) return false
    return v.mes === mes && v.anio === anio
  })
}

export function egresosActivosEnMes(egresos, mes, anio) {
  const consulta = indiceMes(anio, mes)
  return (egresos || []).filter(e => {
    if (e.eliminado) return false
    const inicio = indiceMes(e.anioInicio, e.mesInicio)
    const fin = e.mesFin === null ? Infinity : indiceMes(e.anioFin, e.mesFin)
    return consulta >= inicio && consulta <= fin
  })
}

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

// ── Cálculo de ingresos ───────────────────────────────────────────────────────

export function calcularIngresoCompartidoTotal(datos, mes, anio) {
  return (datos.config.usuarios || []).reduce((acc, u) => {
    const sueldos = salarioActivoEnMes(datos.salarios, u.id, mes, anio, "compartido")
      .reduce((a, s) => a + s.monto, 0)
    const extras = variacionActivaEnMes(datos.variaciones, u.id, mes, anio, "compartido")
      .reduce((a, v) => a + v.monto, 0)
    return acc + sueldos + extras
  }, 0)
}

export function calcularIngresosTotales(datos, mes, anio) {
  return (datos.config.usuarios || []).reduce((acc, u) => {
    const sueldos = salarioActivoEnMes(datos.salarios, u.id, mes, anio)
      .reduce((a, s) => a + s.monto, 0)
    const extras = variacionActivaEnMes(datos.variaciones, u.id, mes, anio)
      .reduce((a, v) => a + v.monto, 0)
    return acc + sueldos + extras
  }, 0)
}

// ── Cálculo del aporte al fondo de emergencia ─────────────────────────────────

export function calcularAporteFondo(datos, mes, anio) {
  const fondo = datos.fondoEmergencia
  if (!fondo?.activo) return 0

  const consulta = indiceMes(anio, mes)
  const inicioFondo = indiceMes(fondo.anioInicio, fondo.mesInicio)
  if (consulta < inicioFondo) return 0

  // Pausa manual explícita
  if (fondo.aportePausadoManual) return 0

  // Auto-pausa al cubrir el objetivo (activo por defecto)
  const autoPausa = fondo.aporteAutoPausa !== false
  if (autoPausa) {
    const montoActual = parseFloat(
      (datos.ubicacion || []).find(c => c.id === "fondo-emergencia")?.monto
    ) || 0
    const egresosBaseMes = egresosActivosEnMes(datos.egresos || [], mes, anio)
      .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)
    const objetivo = (fondo.mesesObjetivo || 3) * egresosBaseMes
    if (objetivo > 0 && montoActual >= objetivo) return 0
  }

  const ingresoTotal = calcularIngresoCompartidoTotal(datos, mes, anio)
  if (fondo.tipo === "porcentaje") {
    return ingresoTotal * (fondo.valor / 100)
  }
  return fondo.valor
}

// ── Detección de déficit ──────────────────────────────────────────────────────

// Devuelve true si los egresos base (sin inversiones ni fondo) superan el ingreso compartido.
// En ese caso, inversiones y aporte al fondo se pausan automáticamente.
export function hayDeficitMes(datos, mes, anio) {
  const ingreso = calcularIngresoCompartidoTotal(datos, mes, anio)
  const egresosBase = egresosActivosEnMes(datos.egresos || [], mes, anio)
    .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)
  return ingreso < egresosBase
}

// ── Egresos totales del hogar ─────────────────────────────────────────────────

export function calcularEgresosTotales(datos, mes, anio) {
  const egresosBase = egresosActivosEnMes(datos.egresos, mes, anio)
    .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)

  const ingreso = calcularIngresoCompartidoTotal(datos, mes, anio)

  // Si hay déficit, inversiones y fondo se pausan automáticamente
  if (ingreso < egresosBase) return egresosBase

  const inversionesTotales = inversionesActivasEnMes(datos.inversiones, mes, anio)
    .reduce((acc, e) => acc + e.monto, 0)

  const aporteFondo = calcularAporteFondo(datos, mes, anio)

  return egresosBase + inversionesTotales + aporteFondo
}

// ── Función principal de cálculo de un mes ───────────────────────────────────

export function calcularMes(datos, usuarioId, mes, anio) {
  const usuario = datos.config.usuarios.find(u => u.id === usuarioId)
  if (!usuario) return { netoProvisorio: 0, gastos: 0, netoFinal: 0 }

  const numUsuarios = datos.config.numUsuarios
  const reparto = datos.config.reparto

  const ingresoCompartidoUsuario =
    salarioActivoEnMes(datos.salarios, usuarioId, mes, anio, "compartido").reduce((a, s) => a + s.monto, 0) +
    variacionActivaEnMes(datos.variaciones, usuarioId, mes, anio, "compartido").reduce((a, v) => a + v.monto, 0)

  const ingresoIndividualUsuario =
    salarioActivoEnMes(datos.salarios, usuarioId, mes, anio, "individual").reduce((a, s) => a + s.monto, 0) +
    variacionActivaEnMes(datos.variaciones, usuarioId, mes, anio, "individual").reduce((a, v) => a + v.monto, 0)

  const ingresoCompartidoTotal = calcularIngresoCompartidoTotal(datos, mes, anio)
  const egresosTotales = calcularEgresosTotales(datos, mes, anio)

  let pct
  if (reparto === "proporcional" && ingresoCompartidoTotal > 0) {
    pct = ingresoCompartidoUsuario / ingresoCompartidoTotal
  } else {
    pct = 1 / numUsuarios
  }

  const netoProvisorio = (ingresoCompartidoTotal - egresosTotales) * pct + ingresoIndividualUsuario

  const gastos = ajustesActivosEnMes(datos.ajustes, usuarioId, mes, anio)
    .reduce((acc, a) => acc + (a.forma === "cuotas" ? a.montoCuota : a.montoTotal), 0)

  const netoFinal = netoProvisorio - gastos

  return { netoProvisorio, gastos, netoFinal }
}

// ── Desglose de gastos para bottom sheet ─────────────────────────────────────

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

// ── Proyección de runway del fondo de emergencia ──────────────────────────────

function _clonarDatosConEscenario(datos, escenario) {
  const { usuariosEliminados } = escenario || {}
  if (!usuariosEliminados || usuariosEliminados.length === 0) return datos
  return {
    ...datos,
    salarios: (datos.salarios || []).map(s =>
      usuariosEliminados.includes(s.usuarioId) ? { ...s, monto: 0 } : s
    ),
    variaciones: (datos.variaciones || []).map(v =>
      usuariosEliminados.includes(v.usuarioId) ? { ...v, monto: 0 } : v
    ),
  }
}

// escenario: { usuariosEliminados: [id, ...] }
// Devuelve cuántos meses aguanta el fondo ante el escenario dado.
export function proyectarRunwayFondo(datos, escenario, { horizonteMaxMeses = 60 } = {}) {
  const saldoActual = parseFloat(
    (datos.ubicacion || []).find(c => c.id === "fondo-emergencia")?.monto
  ) || 0

  const datosEscenario = _clonarDatosConEscenario(datos, escenario)

  const hoy = new Date()
  let mes = hoy.getMonth() + 2
  let anio = hoy.getFullYear()
  if (mes > 12) { mes = 1; anio++ }

  let saldo = saldoActual
  let totalDeficit = 0
  let mesesConDeficit = 0

  for (let i = 0; i < horizonteMaxMeses; i++) {
    const ingreso = calcularIngresoCompartidoTotal(datosEscenario, mes, anio)
    const egresosBase = egresosActivosEnMes(datosEscenario.egresos || [], mes, anio)
      .reduce((acc, e) => acc + montoEgresoMes(e, anio, mes), 0)

    const deficit = egresosBase - ingreso
    if (deficit > 0) {
      saldo -= deficit
      totalDeficit += deficit
      mesesConDeficit++
      if (saldo <= 0) {
        return {
          mesesRunway: i + 1,
          fechaAgotamiento: new Date(anio, mes - 1, 1),
          huboDeficit: true,
          deficitMensualPromedio: totalDeficit / mesesConDeficit,
          saldoActual,
        }
      }
    }

    mes++
    if (mes > 12) { mes = 1; anio++ }
  }

  return {
    mesesRunway: mesesConDeficit > 0 ? horizonteMaxMeses : null,
    fechaAgotamiento: null,
    huboDeficit: mesesConDeficit > 0,
    deficitMensualPromedio: mesesConDeficit > 0 ? totalDeficit / mesesConDeficit : 0,
    saldoActual,
  }
}

// ── Helpers internos de rendimiento (Dietz) ───────────────────────────────────

function _calcularDietz(montoInicial, montoFinal, aportaciones, anio, mes) {
  if (!montoInicial || montoFinal === null || montoFinal === undefined || montoFinal === "") return null
  const diasEnMes = new Date(anio, mes, 0).getDate()
  let flujoTotal = 0
  let flujosPonderados = 0
  for (const ap of (aportaciones || [])) {
    const dia = new Date(ap.fecha).getDate()
    const peso = (diasEnMes - dia) / diasEnMes
    flujoTotal += ap.monto
    flujosPonderados += ap.monto * peso
  }
  const denominador = montoInicial + flujosPonderados
  if (denominador === 0) return null
  return (montoFinal - montoInicial - flujoTotal) / denominador
}

function _calcularNetoInflacion(bruto, inflacion) {
  if (bruto === null || inflacion === null || inflacion === undefined) return null
  return (1 + bruto) / (1 + inflacion) - 1
}

// ── Promedio de rendimiento del portfolio ─────────────────────────────────────

// Devuelve el rendimiento mensual promedio ponderado por saldo de los últimos N meses.
// tipo: "neto" (descuenta inflación) | "bruto"
export function promedioRendimientoPortfolio(datos, { meses = 12, tipo = "neto" } = {}) {
  const hoy = new Date()
  let mes = hoy.getMonth() + 1
  let anio = hoy.getFullYear()

  const mesesObj = []
  for (let i = 0; i < meses; i++) {
    mesesObj.unshift({ mes, anio })
    mes--
    if (mes < 1) { mes = 12; anio-- }
  }

  const cuentas = (datos.cuentasInversion || []).filter(c => !c.eliminado)
  let sumaPonderada = 0
  let sumaWeights = 0
  let mesesConDato = 0
  const cuentasIncluidas = new Set()

  for (const { mes: m, anio: a } of mesesObj) {
    for (const cuenta of cuentas) {
      const registro = (datos.inversiones || []).find(
        r => !r.eliminado && r.cuentaId === cuenta.id && r.mes === m && r.anio === a
      )
      if (!registro) continue
      const bruto = _calcularDietz(registro.montoInicial, registro.montoFinal, registro.aportaciones, a, m)
      const rendimiento = tipo === "neto"
        ? _calcularNetoInflacion(bruto, registro.inflacion)
        : bruto
      if (rendimiento === null) continue
      const saldo = registro.montoInicial || 0
      sumaPonderada += rendimiento * saldo
      sumaWeights += saldo
      mesesConDato++
      cuentasIncluidas.add(cuenta.nombre)
    }
  }

  return {
    rMensual: sumaWeights > 0 ? sumaPonderada / sumaWeights : null,
    mesesConDato,
    cuentasIncluidas: [...cuentasIncluidas],
  }
}

// ── Saldo actual total de cuentas de inversión ────────────────────────────────

export function calcularSaldoTotalInversion(datos) {
  const cuentas = (datos.cuentasInversion || []).filter(c => !c.eliminado)
  return cuentas.reduce((total, cuenta) => {
    const registros = (datos.inversiones || [])
      .filter(r => !r.eliminado && r.cuentaId === cuenta.id && r.montoFinal !== null && r.montoFinal !== undefined && r.montoFinal !== "")
      .sort((a, b) => indiceMes(b.anio, b.mes) - indiceMes(a.anio, a.mes))
    const ultimo = registros[0]
    return total + (ultimo ? parseFloat(ultimo.montoFinal) || 0 : 0)
  }, 0)
}

// ── Proyección de inversiones a futuro ────────────────────────────────────────

// Devuelve un array con snapshot al final de cada año proyectado.
// anios: número de años a proyectar
export function proyectarInversion({ saldoInicial, aporteMensual, rMensual, anios }) {
  const resultados = []
  let saldo = saldoInicial
  let aportadoAcum = 0
  const totalMeses = anios * 12

  for (let i = 1; i <= totalMeses; i++) {
    saldo = saldo * (1 + rMensual) + aporteMensual
    aportadoAcum += aporteMensual
    if (i % 12 === 0) {
      resultados.push({
        anio: i / 12,
        aportadoAcum,
        rendimientoAcum: saldo - saldoInicial - aportadoAcum,
        saldo,
      })
    }
  }
  return resultados
}
