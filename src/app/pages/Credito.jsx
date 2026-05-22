// Credito.jsx

import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import WizardModal from "../components/WizardModal"
import { COLORES, estilos } from "../theme"
import { NOMBRES_MESES } from "../services/formateo"
import { indiceMes } from "../services/calculos"

// ── Pasos del wizard (funciones puras, state vive en Credito) ─────────────

const PASO_FORMA = {
  titulo: "¿Cómo se paga?",
  contenido: (s, set) => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
      {[["unico", "Pago único"], ["cuotas", "En cuotas"]].map(([f, label]) => (
        <button
          key={f}
          onClick={() => set(p => ({ ...p, forma: f }))}
          style={s.forma === f ? estilos.estiloBotonOpcionActivo : estilos.estiloBotonOpcion}
        >
          {label}
        </button>
      ))}
    </div>
  ),
  puedeAvanzar: () => true,
}

const PASO_MODO_CUOTAS = {
  titulo: "¿Cómo lo cargás?",
  contenido: (s, set) => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
      {[["total", "Monto total"], ["cuota", "Valor de cuota"]].map(([m, label]) => (
        <button
          key={m}
          onClick={() => set(p => ({ ...p, modoCuotas: m }))}
          style={{
            flex: 1,
            padding: "13px",
            fontSize: "15px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: s.modoCuotas === m ? COLORES.neutro : COLORES.fondoOpcion,
            color: s.modoCuotas === m ? COLORES.textoBlanco : COLORES.textoSecundario,
            border: s.modoCuotas === m ? "none" : `1px solid ${COLORES.borde}`,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  ),
  puedeAvanzar: () => true,
}

function pasoDatos(fmt) {
  return {
    titulo: "Datos del crédito",
    contenido: (s, set) => {
      const cuotaPreview =
        s.forma === "cuotas" && s.modoCuotas === "total" && s.monto && s.numCuotas
          ? (parseFloat(s.monto) / parseInt(s.numCuotas)).toFixed(2)
          : null
      const totalPreview =
        s.forma === "cuotas" && s.modoCuotas === "cuota" && s.montoCuota && s.numCuotas
          ? (parseFloat(s.montoCuota) * parseInt(s.numCuotas)).toFixed(2)
          : null

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={estilos.estiloLabel}>Usuario</label>
          <select
            value={s.usuarioId}
            onChange={e => set(p => ({ ...p, usuarioId: e.target.value }))}
            style={estilos.estiloInput}
          >
            {s.usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>

          <label style={estilos.estiloLabel}>Nombre</label>
          <input
            placeholder="Ej: iPhone, portátil..."
            value={s.nombre}
            onChange={e => set(p => ({ ...p, nombre: e.target.value }))}
            style={estilos.estiloInput}
          />

          {s.forma === "unico" || (s.forma === "cuotas" && s.modoCuotas === "total") ? (
            <>
              <label style={estilos.estiloLabel}>Monto total</label>
              <input
                placeholder="0.00"
                type="number"
                value={s.monto}
                onChange={e => set(p => ({ ...p, monto: e.target.value }))}
                style={estilos.estiloInput}
              />
            </>
          ) : (
            <>
              <label style={estilos.estiloLabel}>Valor por cuota</label>
              <input
                placeholder="0.00"
                type="number"
                value={s.montoCuota}
                onChange={e => set(p => ({ ...p, montoCuota: e.target.value }))}
                style={estilos.estiloInput}
              />
            </>
          )}

          {s.forma === "cuotas" && (
            <>
              <label style={estilos.estiloLabel}>Número de cuotas</label>
              <input
                placeholder="Ej: 12"
                type="number"
                value={s.numCuotas}
                onChange={e => set(p => ({ ...p, numCuotas: e.target.value }))}
                style={estilos.estiloInput}
              />
              {cuotaPreview && (
                <p style={{ fontSize: "14px", color: COLORES.advertencia, margin: "0", fontWeight: "bold" }}>
                  Cuota mensual: {fmt(parseFloat(cuotaPreview))}
                </p>
              )}
              {totalPreview && (
                <p style={{ fontSize: "14px", color: COLORES.advertencia, margin: "0", fontWeight: "bold" }}>
                  Monto total: {fmt(parseFloat(totalPreview))}
                </p>
              )}
            </>
          )}
        </div>
      )
    },
    puedeAvanzar: (s) => {
      if (!s.nombre) return false
      if (s.forma === "unico") return !!s.monto && parseFloat(s.monto) > 0
      if (s.modoCuotas === "total") return !!s.monto && parseFloat(s.monto) > 0 && !!s.numCuotas && parseInt(s.numCuotas) >= 2
      return !!s.montoCuota && parseFloat(s.montoCuota) > 0 && !!s.numCuotas && parseInt(s.numCuotas) >= 2
    },
  }
}

function pasoFecha() {
  return {
    titulo: "¿Cuándo empieza?",
    contenido: (s, set) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={estilos.estiloLabel}>
          {s.forma === "cuotas" ? "Mes de inicio" : "Mes"}
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={s.mes}
            onChange={e => set(p => ({ ...p, mes: e.target.value }))}
            style={{ ...estilos.estiloInput, flex: 1 }}
          >
            {NOMBRES_MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <input
            placeholder="Año"
            type="number"
            value={s.anio}
            onChange={e => set(p => ({ ...p, anio: e.target.value }))}
            style={{ ...estilos.estiloInput, width: "90px" }}
          />
        </div>
      </div>
    ),
    puedeAvanzar: (s) => !!s.mes && !!s.anio && parseInt(s.anio) > 2000,
  }
}

// ── Componente principal ───────────────────────────────────────────────────

export default function Credito() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { datos, actualizarDatos, usuarioActivo, fmt } = useDatos()
  const hoy = new Date()
  const usuarios = datos.config.usuarios

  const mesDefecto = hoy.getMonth() + 2 > 12 ? 1 : hoy.getMonth() + 2
  const anioDefecto = hoy.getMonth() + 2 > 12 ? hoy.getFullYear() + 1 : hoy.getFullYear()

  function wizardInicial(editando = null) {
    if (editando) {
      return {
        usuarios,
        forma: editando.forma,
        modoCuotas: "total",
        usuarioId: editando.usuarioId,
        nombre: editando.nombre,
        monto: editando.forma === "unico" ? String(editando.montoTotal) : String(editando.montoTotal),
        montoCuota: editando.forma === "cuotas" ? String(editando.montoCuota) : "",
        numCuotas: editando.forma === "cuotas" ? String(editando.numCuotas) : "",
        mes: editando.forma === "unico" ? editando.mes : editando.mesInicio,
        anio: editando.forma === "unico" ? editando.anio : editando.anioInicio,
      }
    }
    return {
      usuarios,
      forma: "unico",
      modoCuotas: "total",
      usuarioId: usuarioActivo || usuarios[0].id,
      nombre: "",
      monto: "",
      montoCuota: "",
      numCuotas: "",
      mes: mesDefecto,
      anio: anioDefecto,
    }
  }

  const [wizardAbierto, setWizardAbierto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [wizardState, setWizardState] = useState(() => wizardInicial())

  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null)

  // Pasos dinámicos: el paso de "modo cuotas" solo aparece si forma === "cuotas"
  const pasos = [
    PASO_FORMA,
    ...(wizardState.forma === "cuotas" ? [PASO_MODO_CUOTAS] : []),
    pasoDatos(fmt),
    pasoFecha(),
  ]

  const mesActualIdx = indiceMes(hoy.getFullYear(), hoy.getMonth() + 1)
  const mesAnteriorIdx = mesActualIdx - 1
  const mesSiguienteIdx = mesActualIdx + 1

  const creditosPendientes = (datos.ajustes || []).filter(a => {
    if (a.eliminado || a.tipo !== "credito") return false
    if (a.usuarioId !== usuarioActivo) return false
    if (a.forma === "unico") {
      return indiceMes(a.anio, a.mes) >= mesAnteriorIdx
    }
    const ultimoMes = indiceMes(a.anioInicio, a.mesInicio - 1) + a.numCuotas
    return ultimoMes >= mesAnteriorIdx
  })

  const totalPendiente = creditosPendientes.reduce((acc, a) => {
    if (a.forma === "unico") {
      if (indiceMes(a.anio, a.mes) >= mesSiguienteIdx) return acc + a.montoTotal
      return acc
    } else {
      const idxInicio = indiceMes(a.anioInicio, a.mesInicio)
      const cuotasPagadas = Math.max(0, mesSiguienteIdx - idxInicio)
      const cuotasPendientes = Math.max(0, a.numCuotas - cuotasPagadas)
      return acc + cuotasPendientes * a.montoCuota
    }
  }, 0)

  function abrirNuevo() {
    setEditandoId(null)
    setWizardState(wizardInicial())
    setWizardAbierto(true)
  }

  function abrirEditar(a) {
    setEditandoId(a.id)
    setWizardState(wizardInicial(a))
    setSeleccionadoId(null)
    setWizardAbierto(true)
  }

  function cerrarWizard() {
    setWizardAbierto(false)
    setEditandoId(null)
  }

  function guardar(s) {
    const ahora = new Date().toISOString()
    const id = editandoId || Date.now()
    let entrada

    if (s.forma === "unico") {
      entrada = {
        id, usuarioId: s.usuarioId, tipo: "credito", forma: "unico",
        nombre: s.nombre, montoTotal: parseFloat(s.monto),
        mes: parseInt(s.mes), anio: parseInt(s.anio),
        eliminado: false,
        creadoEn: editandoId
          ? (datos.ajustes.find(a => a.id === editandoId)?.creadoEn || ahora)
          : ahora,
        actualizadoEn: ahora,
      }
    } else {
      const n = parseInt(s.numCuotas)
      let montoTotal, montoCuota
      if (s.modoCuotas === "total") {
        montoTotal = parseFloat(s.monto)
        montoCuota = montoTotal / n
      } else {
        montoCuota = parseFloat(s.montoCuota)
        montoTotal = montoCuota * n
      }
      entrada = {
        id, usuarioId: s.usuarioId, tipo: "credito", forma: "cuotas",
        nombre: s.nombre, montoTotal, numCuotas: n, montoCuota,
        mesInicio: parseInt(s.mes), anioInicio: parseInt(s.anio),
        eliminado: false,
        creadoEn: editandoId
          ? (datos.ajustes.find(a => a.id === editandoId)?.creadoEn || ahora)
          : ahora,
        actualizadoEn: ahora,
      }
    }

    const nuevosAjustes = editandoId
      ? datos.ajustes.map(a => a.id === editandoId ? entrada : a)
      : [...datos.ajustes, entrada]

    actualizarDatos({ ...datos, ajustes: nuevosAjustes })
    setWizardAbierto(false)
    setEditandoId(null)
  }

  function eliminarAjuste(id) {
    actualizarDatos({
      ...datos,
      ajustes: datos.ajustes.map(a =>
        a.id === id ? { ...a, eliminado: true, actualizadoEn: new Date().toISOString() } : a
      ),
    })
    setConfirmarEliminarId(null)
    setSeleccionadoId(null)
  }

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
          <h1 style={estilos.estiloTitulo}>Crédito</h1>
        </div>

        {/* Botón para abrir wizard */}
        <button
          onClick={abrirNuevo}
          style={{ ...estilos.estiloBotonPrimario, marginBottom: "24px" }}
        >
          💳 + Nuevo crédito 💳
        </button>

        {/* Listado de créditos pendientes */}
        {creditosPendientes.length > 0 && (
          <div>
            <div style={{
              padding: "14px 16px",
              marginBottom: "20px",
              background: COLORES.fondoPanel,
              border: `1px solid ${COLORES.neutro}`,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "14px", color: COLORES.textoSecundario }}>Total pendiente</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: COLORES.neutro }}>
                {fmt(totalPendiente)}
              </span>
            </div>

            <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Créditos pendientes
            </p>

            {creditosPendientes.map(a => {
              const usuario = usuarios.find(u => u.id === a.usuarioId)
              const activo = seleccionadoId === a.id
              const mesTexto = a.forma === "unico"
                ? `${NOMBRES_MESES[a.mes - 1]} ${a.anio}`
                : `${NOMBRES_MESES[a.mesInicio - 1]} ${a.anioInicio} · ${a.numCuotas} cuotas`
              const montoTexto = a.forma === "cuotas"
                ? `${fmt(a.montoCuota)}/mes`
                : `${fmt(a.montoTotal)}`

              return (
                <div key={a.id} style={{ marginBottom: "8px" }}>
                  <button
                    onClick={() => setSeleccionadoId(prev => prev === a.id ? null : a.id)}
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
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "15px", fontWeight: "600", color: COLORES.texto }}>{a.nombre}</div>
                      <div style={{ fontSize: "12px", color: COLORES.textoSecundario, marginTop: "2px" }}>
                        {usuario?.nombre} · {mesTexto}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: COLORES.neutro }}>{montoTexto}</div>
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
                      <button
                        onClick={() => abrirEditar(a)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          fontSize: "13px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          background: COLORES.primarioSuave,
                          color: COLORES.primario,
                          border: `1px solid ${COLORES.primario}`,
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => setConfirmarEliminarId(a.id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          fontSize: "13px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          background: COLORES.fondoPanel,
                          color: COLORES.peligro,
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

        {creditosPendientes.length === 0 && (
          <p style={{ fontSize: "14px", color: COLORES.textoMuted, textAlign: "center", marginTop: "32px", fontStyle: "italic" }}>
            No hay créditos pendientes
          </p>
        )}
      </div>

      {/* Wizard de nuevo/editar crédito */}
      {wizardAbierto && (
        <WizardModal
          pasos={pasos}
          state={wizardState}
          setState={setWizardState}
          onFin={guardar}
          onCerrar={cerrarWizard}
          titulo={editandoId ? "Editar crédito" : "Nuevo crédito"}
          labelFin={editandoId ? "💾 Guardar cambios" : "✓ Guardar"}
        />
      )}

      {/* Modal confirmación eliminar */}
      {confirmarEliminarId && (() => {
        const a = datos.ajustes.find(x => x.id === confirmarEliminarId)
        return createPortal(
          <div
            style={estilos.estiloPopupOverlay}
            onClick={() => setConfirmarEliminarId(null)}
          >
            <div
              style={{ ...estilos.estiloPopup, padding: "28px 24px", textAlign: "center" }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: "18px", fontWeight: "700", color: COLORES.texto, marginBottom: "8px" }}>¿Eliminar crédito?</p>
              <p style={{ fontSize: "14px", color: COLORES.textoSecundario, marginBottom: "24px" }}>
                {a?.nombre} — {fmt(a?.montoTotal)}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setConfirmarEliminarId(null)}
                  style={estilos.estiloBotonSecundario}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => eliminarAjuste(confirmarEliminarId)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORES.peligro}`,
                    background: COLORES.fondoPanel,
                    color: COLORES.peligro,
                    cursor: "pointer",
                    fontWeight: "600",
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