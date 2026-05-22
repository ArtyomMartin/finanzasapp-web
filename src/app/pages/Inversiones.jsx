// src/pages/Inversiones.jsx

import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import WizardModal from "../components/WizardModal"
import { COLORES, estilos } from "../theme"
import { NOMBRES_MESES } from "../services/formateo"

function generarAnios(desde = 0, cantidad = 10) {
  const base = new Date().getFullYear()
  return Array.from({ length: cantidad }, (_, i) => base + desde + i)
}

const idx = (a, m) => a * 12 + m

// ── Pasos wizard nuevo ────────────────────────────────────────────────────────

const PASO_TIPO = {
  titulo: "¿Qué tipo de inversión?",
  contenido: (s, set) => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
      {[["recurrente", "🔁 Recurrente"], ["puntual", "⚡ Puntual"]].map(([t, label]) => (
        <button
          key={t}
          onClick={() => set(p => ({ ...p, tipo: t }))}
          style={s.tipo === t ? estilos.estiloBotonOpcionActivo : estilos.estiloBotonOpcion}
        >
          {label}
        </button>
      ))}
    </div>
  ),
  puedeAvanzar: () => true,
}

const PASO_DATOS = {
  titulo: "Datos de la inversión",
  contenido: (s, set) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={estilos.estiloLabel}>Nombre</label>
      <input
        placeholder="Ej: Fondo Indexado, Cripto..."
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

function pasoFecha() {
  return {
    titulo: "¿Cuándo?",
    contenido: (s, set) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={estilos.estiloLabel}>
          {s.tipo === "recurrente" ? "Mes de inicio" : "Mes"}
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={s.mes}
            onChange={e => set(p => ({ ...p, mes: e.target.value }))}
            style={{ ...estilos.estiloInput, flex: 1 }}
          >
            {NOMBRES_MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={s.anio}
            onChange={e => set(p => ({ ...p, anio: e.target.value }))}
            style={{ ...estilos.estiloInput, width: "100px" }}
          >
            {generarAnios(0, 10).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {s.tipo === "recurrente" && (
          <>
            <label style={estilos.estiloLabel}>Mes de fin (vacío = indefinido)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={s.mesFin}
                onChange={e => set(p => ({ ...p, mesFin: e.target.value, anioFin: "" }))}
                style={{ ...estilos.estiloInput, flex: 1 }}
              >
                <option value="">— Sin fin —</option>
                {NOMBRES_MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
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
                }}
                disabled={!s.mesFin}
              >
                <option value="">—</option>
                {generarAnios(0, 10).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </>
        )}
      </div>
    ),
    puedeAvanzar: (s) => {
      if (!s.mes || !s.anio) return false
      if (s.tipo === "recurrente" && s.mesFin && !s.anioFin) return false
      return true
    },
  }
}

// ── Pasos wizard edición ──────────────────────────────────────────────────────

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
            <span style={{ fontSize: "16px", fontWeight: "700", color: COLORES.positivo }}>{s._fmtActual}</span>
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
              {generarAnios(0, 10).map(a => <option key={a} value={a}>{a}</option>)}
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
              La inversión anterior quedará cerrada el mes previo al inicio de la nueva. El historial se conserva.
            </span>
          </div>
        </div>
      ),
      puedeAvanzar: (s) => !!s.editDesde && !!s.editDesdeAnio,
    },
  ]
}

// ── Pasos wizard fecha de fin ─────────────────────────────────────────────────

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
              {generarAnios(0, 10).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      ),
      puedeAvanzar: (s) => !!s.finMes && !!s.finAnio,
    },
  ]
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function Inversiones() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { datos, actualizarDatos, fmt } = useDatos()
  const hoy = new Date()
  const HOY_MES = hoy.getMonth() + 1
  const HOY_ANIO = hoy.getFullYear()

  const [wizardAbierto, setWizardAbierto] = useState(false)
  const [wizardModo, setWizardModo] = useState(null) // "nuevo" | "editar" | "fin"
  const [itemEditando, setItemEditando] = useState(null)
  const [wizardState, setWizardState] = useState({})

  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)

  const hoyIdx = idx(HOY_ANIO, HOY_MES)

  const itemsListado = (datos.inversiones || [])
    .filter(i => !i.eliminado && !i.cuentaId)
    .map(i => {
      if (i.mesInicio) {
        return {
          ...i, _tipo: "recurrente",
          _inicio: idx(i.anioInicio, i.mesInicio),
          _fin: i.mesFin ? idx(i.anioFin, i.mesFin) : Infinity,
          _inicioTexto: `${NOMBRES_MESES[i.mesInicio - 1]} ${i.anioInicio}`,
          _finTexto: i.mesFin ? `${NOMBRES_MESES[i.mesFin - 1]} ${i.anioFin}` : "Sin fin",
        }
      } else {
        return {
          ...i, _tipo: "puntual",
          _inicio: idx(i.anio, i.mes),
          _fin: idx(i.anio, i.mes),
          _inicioTexto: `${NOMBRES_MESES[i.mes - 1]} ${i.anio}`,
          _finTexto: `${NOMBRES_MESES[i.mes - 1]} ${i.anio}`,
        }
      }
    })
    .filter(i => i._fin >= hoyIdx || i._fin === Infinity)
    .sort((a, b) => a._inicio - b._inicio)

  function abrirNuevo() {
    setItemEditando(null)
    setWizardState({
      tipo: "recurrente",
      nombre: "",
      monto: "",
      mes: HOY_MES,
      anio: HOY_ANIO,
      mesFin: "",
      anioFin: "",
    })
    setWizardModo("nuevo")
    setWizardAbierto(true)
  }

  function abrirEditar(item) {
    setItemEditando(item)
    setWizardState({
      editMonto: "",
      editDesde: HOY_MES,
      editDesdeAnio: HOY_ANIO,
      _fmtActual: fmt(item.monto),
    })
    setWizardModo("editar")
    setSeleccionadoId(null)
    setWizardAbierto(true)
  }

  function abrirFin(item) {
    setItemEditando(item)
    setWizardState({ finMes: HOY_MES, finAnio: HOY_ANIO })
    setWizardModo("fin")
    setSeleccionadoId(null)
    setWizardAbierto(true)
  }

  function cerrarWizard() {
    setWizardAbierto(false)
    setWizardModo(null)
    setItemEditando(null)
  }

  function guardarNuevo(s) {
    const ahora = new Date().toISOString()
    let entrada
    if (s.tipo === "recurrente") {
      entrada = {
        id: Date.now(), nombre: s.nombre, monto: parseFloat(s.monto),
        mesInicio: parseInt(s.mes), anioInicio: parseInt(s.anio),
        mesFin: s.mesFin ? parseInt(s.mesFin) : null,
        anioFin: s.anioFin ? parseInt(s.anioFin) : null,
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora,
      }
    } else {
      entrada = {
        id: Date.now(), nombre: s.nombre, monto: parseFloat(s.monto),
        mes: parseInt(s.mes), anio: parseInt(s.anio),
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora,
      }
    }
    actualizarDatos({ ...datos, inversiones: [...(datos.inversiones || []), entrada] })
    cerrarWizard()
  }

  function guardarEdicion(s) {
    const ahora = new Date().toISOString()
    if (itemEditando._tipo === "recurrente") {
      let mesFinViejo = parseInt(s.editDesde) - 1
      let anioFinViejo = parseInt(s.editDesdeAnio)
      if (mesFinViejo === 0) { mesFinViejo = 12; anioFinViejo -= 1 }
      const cerrados = datos.inversiones.map(i =>
        i.id === itemEditando.id
          ? { ...i, mesFin: mesFinViejo, anioFin: anioFinViejo, actualizadoEn: ahora }
          : i
      )
      const nuevo = {
        id: Date.now(), nombre: itemEditando.nombre, monto: parseFloat(s.editMonto),
        mesInicio: parseInt(s.editDesde), anioInicio: parseInt(s.editDesdeAnio),
        mesFin: null, anioFin: null,
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora,
      }
      actualizarDatos({ ...datos, inversiones: [...cerrados, nuevo] })
    } else {
      const cerrados = datos.inversiones.map(i =>
        i.id === itemEditando.id ? { ...i, eliminado: true, actualizadoEn: ahora } : i
      )
      const nuevo = {
        id: Date.now(), nombre: itemEditando.nombre, monto: parseFloat(s.editMonto),
        mes: itemEditando.mes, anio: itemEditando.anio,
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora,
      }
      actualizarDatos({ ...datos, inversiones: [...cerrados, nuevo] })
    }
    cerrarWizard()
  }

  function guardarFin(s) {
    const ahora = new Date().toISOString()
    actualizarDatos({
      ...datos,
      inversiones: datos.inversiones.map(i =>
        i.id === itemEditando.id
          ? { ...i, mesFin: parseInt(s.finMes), anioFin: parseInt(s.finAnio), actualizadoEn: ahora }
          : i
      ),
    })
    cerrarWizard()
  }

  function eliminarItem(id) {
    const ahora = new Date().toISOString()
    actualizarDatos({
      ...datos,
      inversiones: datos.inversiones.map(i =>
        i.id === id ? { ...i, eliminado: true, actualizadoEn: ahora } : i
      ),
    })
    setConfirmarEliminarId(null)
    setSeleccionadoId(null)
  }

  const pasos = wizardModo === "nuevo"
    ? [PASO_TIPO, PASO_DATOS, pasoFecha()]
    : wizardModo === "editar"
      ? pasosEdicion()
      : pasosAsignarFin()

  const onFin = wizardModo === "nuevo"
    ? guardarNuevo
    : wizardModo === "editar"
      ? guardarEdicion
      : guardarFin

  const tituloWizard = wizardModo === "nuevo"
    ? "Nueva inversión"
    : wizardModo === "editar"
      ? `Editar: ${itemEditando?.nombre}`
      : `Fecha de fin: ${itemEditando?.nombre}`

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
          <h1 style={estilos.estiloTitulo}>📈 Inversiones</h1>
        </div>

        <button
          onClick={abrirNuevo}
          style={{ ...estilos.estiloBotonPrimario, marginBottom: "24px" }}
        >
          📈 + Nueva inversión 📈
        </button>

        {/* Listado */}
        {itemsListado.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Inversiones registradas
            </p>
            {itemsListado.map(item => {
              const activo = seleccionadoId === item.id
              return (
                <div key={item.id} style={{ marginBottom: "8px" }}>
                  <button
                    onClick={() => setSeleccionadoId(prev => prev === item.id ? null : item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px",
                      cursor: "pointer",
                      gap: "12px",
                      background: activo ? COLORES.primarioSuave : COLORES.fondoOpcion,
                      border: `1px solid ${activo ? COLORES.primario : COLORES.borde}`,
                      borderRadius: activo ? "10px 10px 0 0" : "10px",
                      color: "inherit",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap",
                        background: item._tipo === "recurrente" ? COLORES.primarioSuave : COLORES.fondoPanel,
                        color: item._tipo === "recurrente" ? COLORES.primario : COLORES.info,
                      }}>
                        {item._tipo === "recurrente" ? "Recurrente" : "Puntual"}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: COLORES.textoBlanco }}>{item.nombre}</div>
                        <div style={{ fontSize: "12px", color: COLORES.textoSecundario, marginTop: "2px" }}>
                          {item._inicioTexto}
                          {item._tipo === "recurrente" && ` → ${item._finTexto}`}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: COLORES.positivo }}>{fmt(item.monto)}</div>
                      <div style={{ fontSize: "12px", color: activo ? COLORES.primario : COLORES.textoSecundario, marginTop: "2px" }}>
                        {activo ? "▲" : "▼"}
                      </div>
                    </div>
                  </button>

                  {activo && (
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      padding: "10px",
                      background: COLORES.fondoPanel,
                      borderRadius: "0 0 10px 10px",
                      border: `1px solid ${COLORES.borde}`,
                      borderTop: "none",
                    }}>
                      {item._tipo === "recurrente" && (
                        <button
                          onClick={() => abrirFin(item)}
                          style={{
                            flex: 1, padding: "10px", fontSize: "13px", borderRadius: "8px",
                            cursor: "pointer", fontWeight: "600",
                            background: COLORES.fondoPanel, color: COLORES.advertencia,
                            border: `1px solid ${COLORES.advertencia}`,
                          }}
                        >
                          📅 Fecha de fin
                        </button>
                      )}
                      <button
                        onClick={() => abrirEditar(item)}
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
                        onClick={() => setConfirmarEliminarId(item.id)}
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

        {itemsListado.length === 0 && (
          <p style={{ fontSize: "14px", color: COLORES.textoMuted, textAlign: "center", marginTop: "32px", fontStyle: "italic" }}>
            No hay inversiones registradas.
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
      {confirmarEliminarId && (() => {
        const item = (datos.inversiones || []).find(i => i.id === confirmarEliminarId)
        return createPortal(
          <div
            style={estilos.estiloPopupOverlay}
            onClick={() => setConfirmarEliminarId(null)}
          >
            <div
              style={{ ...estilos.estiloPopup, padding: "28px 24px", textAlign: "center" }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: "18px", fontWeight: "700", color: COLORES.texto, marginBottom: "8px" }}>¿Eliminar inversión?</p>
              <p style={{ fontSize: "14px", color: COLORES.textoSecundario, marginBottom: "24px" }}>
                {item?.nombre} — {fmt(item?.monto)}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setConfirmarEliminarId(null)}
                  style={estilos.estiloBotonSecundario}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => eliminarItem(confirmarEliminarId)}
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