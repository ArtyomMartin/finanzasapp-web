// src/pages/Egresos.jsx

import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import WizardModal from "../components/WizardModal"
import { lunesEnMes, montoEgresoMes, indiceMes } from "../services/calculos"
import { COLORES, estilos } from "../theme"
import { NOMBRES_MESES } from "../services/formateo"

const HOY = new Date()
const MES_HOY = HOY.getMonth() + 1
const ANIO_HOY = HOY.getFullYear()
const ANIOS = Array.from({ length: 10 }, (_, i) => ANIO_HOY + i)

function mesSiguiente() {
  const mes = MES_HOY + 1
  if (mes > 12) return { mes: 1, anio: ANIO_HOY + 1 }
  return { mes, anio: ANIO_HOY }
}

// ── Pasos del wizard ──────────────────────────────────────────────────────────

const PASO_FRECUENCIA = {
  titulo: "¿Con qué frecuencia?",
  contenido: (s, set) => (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
        {[["m", "📅 Mensual"], ["s", "📆 Semanal"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => set(p => ({ ...p, frecuencia: val }))}
            style={s.frecuencia === val ? estilos.estiloBotonOpcionActivo : estilos.estiloBotonOpcion}
          >
            {label}
          </button>
        ))}
      </div>
      {s.frecuencia === "s" && (
        <p style={{ fontSize: "12px", color: COLORES.advertencia, margin: "4px 0 0", fontStyle: "italic" }}>
          El total mensual se calculará según los lunes del mes.
        </p>
      )}
    </>
  ),
  puedeAvanzar: () => true,
}

const PASO_DATOS_EGRESO = {
  titulo: "Datos del egreso",
  contenido: (s, set) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={estilos.estiloLabel}>Nombre</label>
      <input
        placeholder="Alquiler, luz, internet…"
        value={s.nombre}
        onChange={e => set(p => ({ ...p, nombre: e.target.value }))}
        style={estilos.estiloInput}
      />

      <label style={estilos.estiloLabel}>Monto</label>
      <input
        placeholder="0.00"
        type="number"
        value={s.monto}
        onChange={e => set(p => ({ ...p, monto: e.target.value }))}
        style={estilos.estiloInput}
      />
    </div>
  ),
  puedeAvanzar: (s) => !!s.nombre.trim() && !!s.monto && parseFloat(s.monto) > 0,
}

function pasoFechaEgreso() {
  return {
    titulo: "¿Cuándo?",
    contenido: (s, set) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={estilos.estiloLabel}>Mes de inicio</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={s.mesInicio}
            onChange={e => set(p => ({ ...p, mesInicio: e.target.value }))}
            style={{ ...estilos.estiloInput, flex: 1 }}
          >
            {NOMBRES_MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={s.anioInicio}
            onChange={e => set(p => ({ ...p, anioInicio: e.target.value }))}
            style={{ ...estilos.estiloInput, width: "100px" }}
          >
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <label style={estilos.estiloLabel}>Mes de fin (vacío = indefinido)</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={s.mesFin}
            onChange={e => set(p => ({ ...p, mesFin: e.target.value, anioFin: "" }))}
            style={{ ...estilos.estiloInput, flex: 1 }}
          >
            <option value="">— Sin fin —</option>
            {NOMBRES_MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={s.anioFin}
            onChange={e => set(p => ({ ...p, anioFin: e.target.value }))}
            style={{
              ...estilos.estiloInput,
              width: "100px",
              border: s.mesFin && !s.anioFin
                ? `2px solid ${COLORES.advertencia}`
                : `1px solid ${COLORES.borde}`,
              background: s.mesFin && !s.anioFin ? COLORES.fondoPanel : COLORES.fondoInput,
              color: s.mesFin && !s.anioFin ? COLORES.advertencia : COLORES.textoBlanco,
            }}
            disabled={!s.mesFin}
          >
            <option value="">Año</option>
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
    ),
    puedeAvanzar: (s) => {
      if (!s.mesInicio || !s.anioInicio) return false
      if (s.mesFin && !s.anioFin) return false
      return true
    },
  }
}

// Pasos del wizard de edición (solo monto + vigencia)
function pasosEdicion() {
  return [
    {
      titulo: "Nuevo monto",
      contenido: (s, set) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{
            padding: "12px 14px",
            background: COLORES.fondoPanel,
            borderRadius: "10px",
            border: `1px solid ${COLORES.borde}`,
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}>
            <span style={{ fontSize: "13px", color: COLORES.textoSecundario }}>Monto actual</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: COLORES.negativo }}>{s._fmtActual}</span>
          </div>
          <label style={estilos.estiloLabel}>Nuevo monto</label>
          <input
            placeholder="0.00"
            type="number"
            value={s.editMonto}
            onChange={e => set(p => ({ ...p, editMonto: e.target.value }))}
            style={estilos.estiloInput}
          />
        </div>
      ),
      puedeAvanzar: (s) => !!s.editMonto && parseFloat(s.editMonto) > 0,
    },
    {
      titulo: "¿Vigente desde?",
      contenido: (s, set) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={estilos.estiloLabel}>Vigente desde</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={s.editDesde}
              onChange={e => set(p => ({ ...p, editDesde: e.target.value }))}
              style={{ ...estilos.estiloInput, flex: 1 }}
            >
              {NOMBRES_MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select
              value={s.editDesdeAnio}
              onChange={e => set(p => ({ ...p, editDesdeAnio: e.target.value }))}
              style={{ ...estilos.estiloInput, width: "100px" }}
            >
              {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <label style={estilos.estiloLabel}>Hasta (vacío = indefinido)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={s.editHasta}
              onChange={e => set(p => ({ ...p, editHasta: e.target.value, editHastaAnio: "" }))}
              style={{ ...estilos.estiloInput, flex: 1 }}
            >
              <option value="">— Sin fin —</option>
              {NOMBRES_MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select
              value={s.editHastaAnio}
              onChange={e => set(p => ({ ...p, editHastaAnio: e.target.value }))}
              style={{
                ...estilos.estiloInput,
                width: "100px",
                border: s.editHasta && !s.editHastaAnio
                  ? `2px solid ${COLORES.advertencia}`
                  : `1px solid ${COLORES.borde}`,
                background: s.editHasta && !s.editHastaAnio ? COLORES.fondoPanel : COLORES.fondoInput,
                color: s.editHasta && !s.editHastaAnio ? COLORES.advertencia : COLORES.textoBlanco,
              }}
              disabled={!s.editHasta}
            >
              <option value="">Año</option>
              {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{
            display: "flex", gap: "10px", alignItems: "flex-start",
            backgroundColor: COLORES.primarioSuave, borderRadius: "10px",
            padding: "12px", border: `1px solid ${COLORES.bordePanel}`,
            marginTop: "4px",
          }}>
            <span style={{ fontSize: "16px", marginTop: "1px" }}>ℹ️</span>
            <span style={{ fontSize: "12px", color: COLORES.neutro, lineHeight: "1.5" }}>
              El egreso anterior quedará cerrado el mes previo al inicio del nuevo. El historial se conserva.
            </span>
          </div>
        </div>
      ),
      puedeAvanzar: (s) => {
        if (!s.editDesde || !s.editDesdeAnio) return false
        if (s.editHasta && !s.editHastaAnio) return false
        return true
      },
    },
  ]
}

// Pasos para asignar fecha de fin
function pasosAsignarFin() {
  return [
    {
      titulo: "¿Hasta cuándo?",
      contenido: (s, set) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={estilos.estiloLabel}>Último mes activo</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={s.finMes}
              onChange={e => set(p => ({ ...p, finMes: e.target.value }))}
              style={{ ...estilos.estiloInput, flex: 1 }}
            >
              {NOMBRES_MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select
              value={s.finAnio}
              onChange={e => set(p => ({ ...p, finAnio: e.target.value }))}
              style={{ ...estilos.estiloInput, width: "100px" }}
            >
              {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      ),
      puedeAvanzar: (s) => !!s.finMes && !!s.finAnio,
    },
  ]
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function Egresos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { datos, actualizarDatos, fmt } = useDatos()

  const { mes: mesDefecto, anio: anioDefecto } = mesSiguiente()

  // Wizard nuevo/editar egreso
  const [wizardAbierto, setWizardAbierto] = useState(false)
  const [wizardModo, setWizardModo] = useState(null) // "nuevo" | "editar" | "fin"
  const [egresoEditando, setEgresoEditando] = useState(null)
  const [wizardState, setWizardState] = useState({})

  const [selId, setSelId] = useState(null)
  const [confirmarEliminarItem, setConfirmarEliminarItem] = useState(null)

  const ahora2 = indiceMes(ANIO_HOY, MES_HOY)
  const activos = (datos.egresos || [])
    .filter(e => !e.eliminado)
    .filter(e => {
      const fin = (e.mesFin && e.anioFin) ? indiceMes(e.anioFin, e.mesFin) : Infinity
      return fin >= ahora2
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  function wizardNuevoInicial() {
    return {
      frecuencia: "m",
      nombre: "",
      monto: "",
      mesInicio: mesDefecto,
      anioInicio: anioDefecto,
      mesFin: "",
      anioFin: "",
    }
  }

  function wizardEditarInicial(egreso, fmtFn) {
    return {
      editMonto: "",
      editDesde: MES_HOY,
      editDesdeAnio: ANIO_HOY,
      editHasta: "",
      editHastaAnio: "",
      _fmtActual: fmtFn(egreso.monto) + (egreso.frecuencia === "s" ? " (semanal)" : ""),
    }
  }

  function wizardFinInicial() {
    return {
      finMes: MES_HOY,
      finAnio: ANIO_HOY,
    }
  }

  function abrirNuevo() {
    setEgresoEditando(null)
    setWizardState(wizardNuevoInicial())
    setWizardModo("nuevo")
    setWizardAbierto(true)
  }

  function abrirEditar(egreso) {
    setEgresoEditando(egreso)
    setWizardState(wizardEditarInicial(egreso, fmt))
    setWizardModo("editar")
    setSelId(null)
    setWizardAbierto(true)
  }

  function abrirFin(egreso) {
    setEgresoEditando(egreso)
    setWizardState(wizardFinInicial())
    setWizardModo("fin")
    setSelId(null)
    setWizardAbierto(true)
  }

  function cerrarWizard() {
    setWizardAbierto(false)
    setWizardModo(null)
    setEgresoEditando(null)
  }

  function guardarNuevo(s) {
    const ts = new Date().toISOString()
    const entrada = {
      id: Date.now(),
      nombre: s.nombre.trim(),
      monto: parseFloat(s.monto),
      frecuencia: s.frecuencia,
      mesInicio: parseInt(s.mesInicio),
      anioInicio: parseInt(s.anioInicio),
      mesFin: s.mesFin ? parseInt(s.mesFin) : null,
      anioFin: s.anioFin ? parseInt(s.anioFin) : null,
      eliminado: false,
      creadoEn: ts,
      actualizadoEn: ts,
    }
    actualizarDatos({ ...datos, egresos: [...datos.egresos, entrada] })
    cerrarWizard()
  }

  function guardarEdicion(s) {
    const ts = new Date().toISOString()
    let mesFinViejo = parseInt(s.editDesde) - 1
    let anioFinViejo = parseInt(s.editDesdeAnio)
    if (mesFinViejo === 0) { mesFinViejo = 12; anioFinViejo -= 1 }
    const cerrado = datos.egresos.map(e =>
      e.id === egresoEditando.id
        ? { ...e, mesFin: mesFinViejo, anioFin: anioFinViejo, actualizadoEn: ts }
        : e
    )
    const nuevo = {
      id: Date.now(),
      nombre: egresoEditando.nombre,
      monto: parseFloat(s.editMonto),
      frecuencia: egresoEditando.frecuencia || "m",
      mesInicio: parseInt(s.editDesde),
      anioInicio: parseInt(s.editDesdeAnio),
      mesFin: s.editHasta ? parseInt(s.editHasta) : null,
      anioFin: s.editHastaAnio ? parseInt(s.editHastaAnio) : null,
      eliminado: false,
      creadoEn: ts,
      actualizadoEn: ts,
    }
    actualizarDatos({ ...datos, egresos: [...cerrado, nuevo] })
    cerrarWizard()
  }

  function guardarFin(s) {
    const ts = new Date().toISOString()
    const nuevos = datos.egresos.map(e =>
      e.id === egresoEditando.id
        ? { ...e, mesFin: parseInt(s.finMes), anioFin: parseInt(s.finAnio), actualizadoEn: ts }
        : e
    )
    actualizarDatos({ ...datos, egresos: nuevos })
    cerrarWizard()
  }

  function eliminarEgreso(egreso) {
    const ts = new Date().toISOString()
    const nuevos = datos.egresos.map(e =>
      e.id === egreso.id ? { ...e, eliminado: true, actualizadoEn: ts } : e
    )
    actualizarDatos({ ...datos, egresos: nuevos })
    setConfirmarEliminarItem(null)
    setSelId(null)
  }

  function labelFin(e) {
    if (!e.mesFin || !e.anioFin) return "Sin fin"
    return `${NOMBRES_MESES[e.mesFin - 1]} ${e.anioFin}`
  }

  function montoFila(e) {
    return montoEgresoMes(e, anioDefecto, mesDefecto)
  }

  // Pasos según modo
  const pasos = wizardModo === "nuevo"
    ? [PASO_FRECUENCIA, PASO_DATOS_EGRESO, pasoFechaEgreso()]
    : wizardModo === "editar"
      ? pasosEdicion()
      : pasosAsignarFin()

  const onFin = wizardModo === "nuevo"
    ? guardarNuevo
    : wizardModo === "editar"
      ? guardarEdicion
      : guardarFin

  const tituloWizard = wizardModo === "nuevo"
    ? "Nuevo egreso"
    : wizardModo === "editar"
      ? `Editar: ${egresoEditando?.nombre}`
      : `Fecha de fin: ${egresoEditando?.nombre}`

  const labelFinal = wizardModo === "nuevo"
    ? "✓ Guardar"
    : wizardModo === "editar"
      ? "💾 Aplicar cambio"
      : "✓ Confirmar"

  return (
    <div style={estilos.estiloPantalla}>
      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={{ animation: "fadeIn 0.35s ease" }}>
        <div style={estilos.estiloHeader}>
          <button
            onClick={() => setMenuAbierto(true)}
            style={{ background: "none", border: "none", fontSize: "24px", marginRight: "10px", cursor: "pointer", color: COLORES.primario }}
          >
            ☰
          </button>
          <h1 style={estilos.estiloTitulo}>💸 Egresos fijos</h1>
        </div>

        <button
          onClick={abrirNuevo}
          style={{ ...estilos.estiloBotonPrimario, marginBottom: "24px" }}
        >
          💸 + Nuevo egreso 💸
        </button>

        {/* Listado */}
        {activos.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Egresos activos
            </p>
            {activos.map(e => {
              const sel = selId === e.id
              const total = montoFila(e)
              const esSemanal = e.frecuencia === "s"
              return (
                <div key={e.id} style={{ marginBottom: "8px" }}>
                  <button
                    onClick={() => setSelId(prev => prev === e.id ? null : e.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px",
                      cursor: "pointer",
                      gap: "12px",
                      background: sel ? COLORES.primarioSuave : COLORES.fondoOpcion,
                      border: `1px solid ${sel ? COLORES.primario : COLORES.borde}`,
                      borderRadius: sel ? "10px 10px 0 0" : "10px",
                      color: "inherit",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap",
                        background: COLORES.fondoTarjeta,
                        color: COLORES.negativo,
                      }}>
                        {esSemanal ? "Semanal" : "Mensual"}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: COLORES.textoBlanco }}>{e.nombre}</div>
                        <div style={{ fontSize: "12px", color: COLORES.textoSecundario, marginTop: "2px" }}>
                          {NOMBRES_MESES[e.mesInicio - 1]} {e.anioInicio} → {labelFin(e)}
                        </div>
                        {esSemanal && (
                          <div style={{ fontSize: "11px", color: COLORES.advertencia, marginTop: "2px" }}>
                            {fmt(e.monto)} × {lunesEnMes(anioDefecto, mesDefecto)} lunes
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: COLORES.negativo }}>{fmt(total)}</div>
                      <div style={{ fontSize: "12px", color: sel ? COLORES.primario : COLORES.textoSecundario, marginTop: "2px" }}>
                        {sel ? "▲" : "▼"}
                      </div>
                    </div>
                  </button>

                  {sel && (
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      padding: "10px",
                      background: COLORES.fondoPanel,
                      borderRadius: "0 0 10px 10px",
                      border: `1px solid ${COLORES.borde}`,
                      borderTop: "none",
                    }}>
                      <button
                        onClick={() => abrirFin(e)}
                        style={{
                          flex: 1, padding: "10px", fontSize: "13px", borderRadius: "8px",
                          cursor: "pointer", fontWeight: "600",
                          background: COLORES.fondoPanel, color: COLORES.advertencia,
                          border: `1px solid ${COLORES.advertencia}`,
                        }}
                      >
                        📅 Fecha de fin
                      </button>
                      <button
                        onClick={() => abrirEditar(e)}
                        style={{
                          flex: 1, padding: "10px", fontSize: "13px", borderRadius: "8px",
                          cursor: "pointer", fontWeight: "600",
                          background: COLORES.primarioSuave, color: COLORES.primario,
                          border: `1px solid ${COLORES.primario}`,
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => setConfirmarEliminarItem(e)}
                        style={{
                          flex: 1, padding: "10px", fontSize: "13px", borderRadius: "8px",
                          cursor: "pointer", fontWeight: "600",
                          background: COLORES.fondoPanel, color: COLORES.peligro,
                          border: `1px solid ${COLORES.peligro}`,
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activos.length === 0 && (
          <p style={{ fontSize: "14px", color: COLORES.textoMuted, textAlign: "center", marginTop: "32px", fontStyle: "italic" }}>
            Aún no hay egresos activos.
          </p>
        )}
      </div>

      {/* Wizard */}
      {wizardAbierto && (
        <WizardModal
          pasos={pasos}
          state={wizardState}
          setState={setWizardState}
          onFin={onFin}
          onCerrar={cerrarWizard}
          titulo={tituloWizard}
          labelFin={labelFinal}
        />
      )}

      {/* Modal confirmación eliminar */}
      {confirmarEliminarItem && (() => {
        const e = confirmarEliminarItem
        return createPortal(
          <div
            style={estilos.estiloPopupOverlay}
            onClick={() => setConfirmarEliminarItem(null)}
          >
            <div
              style={{ ...estilos.estiloPopup, padding: "28px 24px", textAlign: "center" }}
              onClick={ev => ev.stopPropagation()}
            >
              <p style={{ fontSize: "18px", fontWeight: "700", color: COLORES.texto, marginBottom: "8px" }}>¿Eliminar egreso?</p>
              <p style={{ fontSize: "14px", color: COLORES.textoSecundario, marginBottom: "24px" }}>
                {e.nombre} — {fmt(e.monto)}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setConfirmarEliminarItem(null)}
                  style={estilos.estiloBotonSecundario}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => eliminarEgreso(e)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px",
                    border: `1px solid ${COLORES.peligro}`,
                    background: COLORES.fondoPanel, color: COLORES.peligro,
                    cursor: "pointer", fontWeight: "600",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      })()}
    </div>
  )
}