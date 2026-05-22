// src/pages/Ingresos.jsx

import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import WizardModal from "../components/WizardModal"
import { COLORES, estilos } from "../theme"
import { NOMBRES_MESES } from "../services/formateo"
import { indiceMes } from "../services/calculos"

function generarAnios(desde = 0, cantidad = 10) {
  const base = new Date().getFullYear()
  return Array.from({ length: cantidad }, (_, i) => base + desde + i)
}

function mesSiguiente() {
  const hoy = new Date()
  const mes = hoy.getMonth() + 2
  const anio = hoy.getFullYear()
  if (mes > 12) return { mes: 1, anio: anio + 1 }
  return { mes, anio }
}

// ── Pasos del wizard ──────────────────────────────────────────────────────────

const PASO_TIPO = {
  titulo: "¿Qué tipo de ingreso?",
  contenido: (s, set) => (
    <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
      {[["salario", "💼 Salario"], ["variacion", "⚡ Extra"]].map(([t, label]) => (
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

function pasoAlcance(mostrarAlcance) {
  return {
    titulo: "¿Para quién aplica?",
    contenido: (s, set) => (
      <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
        {[
          ["compartido", "🤝 Compartido", "Entra al pool y se reparte según configuración"],
          ["individual", "👤 Individual", "Va directo al bolsillo de este usuario"],
        ].map(([val, label, desc]) => (
          <button
            key={val}
            onClick={() => set(p => ({ ...p, alcance: val }))}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "left",
              background: s.alcance === val
                ? (val === "compartido" ? COLORES.fondoTarjeta : COLORES.primarioSuave)
                : COLORES.fondoOpcion,
              border: s.alcance === val
                ? `1px solid ${val === "compartido" ? COLORES.positivo : COLORES.neutro}`
                : `1px solid ${COLORES.borde}`,
            }}
          >
            <span style={{
              fontSize: "14px",
              fontWeight: "700",
              color: s.alcance === val
                ? (val === "compartido" ? COLORES.positivo : COLORES.neutro)
                : COLORES.textoSecundario,
            }}>
              {label}
            </span>
            <span style={{ fontSize: "11px", color: COLORES.textoSecundario, marginTop: "3px", lineHeight: "1.3" }}>
              {desc}
            </span>
          </button>
        ))}
      </div>
    ),
    puedeAvanzar: () => true,
  }
}

function pasoDatosIngreso(fmt) {
  return {
    titulo: "Datos del ingreso",
    contenido: (s, set) => (
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

        {s.tipo === "salario" && (
          <>
            <label style={estilos.estiloLabel}>Nombre / Fuente (opcional)</label>
            <input
              placeholder="Ej: Trabajo principal, Freelance..."
              value={s.nombre}
              onChange={e => set(p => ({ ...p, nombre: e.target.value }))}
              style={estilos.estiloInput}
            />
          </>
        )}

        {s.tipo === "variacion" && (
          <>
            <label style={estilos.estiloLabel}>Descripción</label>
            <input
              placeholder="Ej: paga extra, incentivo..."
              value={s.descripcion}
              onChange={e => set(p => ({ ...p, descripcion: e.target.value }))}
              style={estilos.estiloInput}
            />
          </>
        )}

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
    puedeAvanzar: (s) => {
      if (!s.monto || parseFloat(s.monto) <= 0) return false
      if (s.tipo === "variacion" && !s.descripcion) return false
      return true
    },
  }
}

function pasoFechaIngreso() {
  return {
    titulo: "¿Cuándo?",
    contenido: (s, set) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={estilos.estiloLabel}>
          {s.tipo === "salario" ? "Mes de inicio" : "Mes"}
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
          <select
            value={s.anio}
            onChange={e => set(p => ({ ...p, anio: e.target.value }))}
            style={{ ...estilos.estiloInput, width: "100px" }}
          >
            {generarAnios(0, 10).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {s.tipo === "salario" && (
          <>
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
      if (!s.mes || !s.anio || parseInt(s.anio) <= 2000) return false
      if (s.tipo === "salario" && s.mesFin && !s.anioFin) return false
      return true
    },
  }
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function Ingresos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { datos, actualizarDatos, usuarioActivo, fmt } = useDatos()
  const hoy = new Date()
  const usuarios = datos.config.usuarios
  const mostrarAlcance = usuarios.length > 1

  const { mes: mesDefecto, anio: anioDefecto } = mesSiguiente()

  function wizardInicial(editando = null) {
    if (editando) {
      return {
        usuarios,
        tipo: editando._tipo,
        alcance: editando._alcance || "compartido",
        usuarioId: editando.usuarioId,
        nombre: editando.nombre || "",
        descripcion: editando.descripcion || "",
        monto: String(editando.monto),
        mes: editando._tipo === "salario" ? editando.mesInicio : editando.mes,
        anio: editando._tipo === "salario" ? editando.anioInicio : editando.anio,
        mesFin: editando.mesFin ? String(editando.mesFin) : "",
        anioFin: editando.anioFin ? String(editando.anioFin) : "",
      }
    }
    return {
      usuarios,
      tipo: "salario",
      alcance: "compartido",
      usuarioId: usuarioActivo || usuarios[0].id,
      nombre: "",
      descripcion: "",
      monto: "",
      mes: mesDefecto,
      anio: anioDefecto,
      mesFin: "",
      anioFin: "",
    }
  }

  const [wizardAbierto, setWizardAbierto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [editandoTipo, setEditandoTipo] = useState(null)
  const [wizardState, setWizardState] = useState(() => wizardInicial())
  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [confirmarEliminarItem, setConfirmarEliminarItem] = useState(null)

  // Pasos dinámicos
  const pasos = [
    PASO_TIPO,
    ...(mostrarAlcance ? [pasoAlcance(mostrarAlcance)] : []),
    pasoDatosIngreso(fmt),
    pasoFechaIngreso(),
  ]

  const hoyIdx = indiceMes(hoy.getFullYear(), hoy.getMonth() + 1)
  const mesActual = hoy.getMonth() + 1
  const anioActual = hoy.getFullYear()

  const itemsListado = [
    ...datos.salarios.filter(s => !s.eliminado).map(s => ({
      ...s, _tipo: "salario",
      _label: usuarios.find(u => u.id === s.usuarioId)?.nombre || s.usuarioId,
      _nombre: s.nombre || "",
      _inicio: indiceMes(s.anioInicio, s.mesInicio),
      _fin: s.mesFin ? indiceMes(s.anioFin, s.mesFin) : Infinity,
      _finTexto: s.mesFin ? `${NOMBRES_MESES[s.mesFin - 1]} ${s.anioFin}` : "Sin fin",
      _inicioTexto: `${NOMBRES_MESES[s.mesInicio - 1]} ${s.anioInicio}`,
      _alcance: s.alcance || "compartido",
    })).filter(s => s._fin >= hoyIdx || s._fin === Infinity),
    ...datos.variaciones.filter(v => !v.eliminado).map(v => ({
      ...v, _tipo: "variacion",
      _label: usuarios.find(u => u.id === v.usuarioId)?.nombre || v.usuarioId,
      _nombre: v.descripcion || "",
      _inicio: indiceMes(v.anio, v.mes),
      _fin: indiceMes(v.anio, v.mes),
      _finTexto: `${NOMBRES_MESES[v.mes - 1]} ${v.anio}`,
      _inicioTexto: `${NOMBRES_MESES[v.mes - 1]} ${v.anio}`,
      _alcance: v.alcance || "compartido",
    })),
  ].sort((a, b) => a._inicio - b._inicio)

  const totalesPorUsuario = usuarios.map(u => {
    const sumSalarios = datos.salarios
      .filter(s =>
        !s.eliminado &&
        s.usuarioId === u.id &&
        indiceMes(s.anioInicio, s.mesInicio) <= indiceMes(anioActual, mesActual) &&
        (s.mesFin === null || indiceMes(s.anioFin, s.mesFin) >= indiceMes(anioActual, mesActual))
      )
      .reduce((acc, s) => acc + s.monto, 0)
    const sumVariaciones = datos.variaciones
      .filter(v => !v.eliminado && v.usuarioId === u.id && v.mes === mesActual && v.anio === anioActual)
      .reduce((acc, v) => acc + v.monto, 0)
    const activos = datos.salarios.filter(s =>
      !s.eliminado &&
      s.usuarioId === u.id &&
      indiceMes(s.anioInicio, s.mesInicio) <= indiceMes(anioActual, mesActual) &&
      (s.mesFin === null || indiceMes(s.anioFin, s.mesFin) >= indiceMes(anioActual, mesActual))
    ).length
    return { ...u, total: sumSalarios + sumVariaciones, numSalarios: activos }
  })

  function abrirNuevo() {
    setEditandoId(null)
    setEditandoTipo(null)
    setWizardState(wizardInicial())
    setWizardAbierto(true)
  }

  function abrirEditar(item) {
    setEditandoId(item.id)
    setEditandoTipo(item._tipo)
    setWizardState(wizardInicial(item))
    setSeleccionadoId(null)
    setWizardAbierto(true)
  }

  function cerrarWizard() {
    setWizardAbierto(false)
    setEditandoId(null)
    setEditandoTipo(null)
  }

  function guardar(s) {
    const ahora = new Date().toISOString()

    if (s.tipo === "salario") {
      const entrada = {
        id: editandoId && editandoTipo === "salario" ? editandoId : Date.now(),
        usuarioId: s.usuarioId,
        nombre: s.nombre.trim() || "",
        monto: parseFloat(s.monto),
        mesInicio: parseInt(s.mes),
        anioInicio: parseInt(s.anio),
        mesFin: s.mesFin ? parseInt(s.mesFin) : null,
        anioFin: s.anioFin ? parseInt(s.anioFin) : null,
        alcance: mostrarAlcance ? s.alcance : "compartido",
        eliminado: false,
        creadoEn: (editandoId && editandoTipo === "salario")
          ? (datos.salarios.find(x => x.id === editandoId)?.creadoEn || ahora)
          : ahora,
        actualizadoEn: ahora,
      }
      const nuevosSalarios = (editandoId && editandoTipo === "salario")
        ? datos.salarios.map(x => x.id === editandoId ? entrada : x)
        : [...datos.salarios, entrada]
      // Si estaba editando una variación, no tocamos salarios originales (nuevo)
      actualizarDatos({ ...datos, salarios: nuevosSalarios })
    } else {
      const entrada = {
        id: editandoId && editandoTipo === "variacion" ? editandoId : Date.now(),
        usuarioId: s.usuarioId,
        monto: parseFloat(s.monto),
        mes: parseInt(s.mes),
        anio: parseInt(s.anio),
        descripcion: s.descripcion,
        alcance: mostrarAlcance ? s.alcance : "compartido",
        eliminado: false,
        creadoEn: (editandoId && editandoTipo === "variacion")
          ? (datos.variaciones.find(x => x.id === editandoId)?.creadoEn || ahora)
          : ahora,
        actualizadoEn: ahora,
      }
      const nuevasVariaciones = (editandoId && editandoTipo === "variacion")
        ? datos.variaciones.map(x => x.id === editandoId ? entrada : x)
        : [...datos.variaciones, entrada]
      actualizarDatos({ ...datos, variaciones: nuevasVariaciones })
    }

    setWizardAbierto(false)
    setEditandoId(null)
    setEditandoTipo(null)
  }

  function asignarFechaFin(item) {
    const ahora = new Date().toISOString()
    if (item._tipo === "salario") {
      actualizarDatos({
        ...datos,
        salarios: datos.salarios.map(s =>
          s.id === item.id
            ? { ...s, mesFin: hoy.getMonth() + 1, anioFin: hoy.getFullYear(), actualizadoEn: ahora }
            : s
        ),
      })
    } else {
      actualizarDatos({
        ...datos,
        variaciones: datos.variaciones.map(v =>
          v.id === item.id ? { ...v, eliminado: true, actualizadoEn: ahora } : v
        ),
      })
    }
    setSeleccionadoId(null)
  }

  function eliminarItem(item) {
    const ahora = new Date().toISOString()
    if (item._tipo === "salario") {
      actualizarDatos({
        ...datos,
        salarios: datos.salarios.map(s =>
          s.id === item.id ? { ...s, eliminado: true, actualizadoEn: ahora } : s
        ),
      })
    } else {
      actualizarDatos({
        ...datos,
        variaciones: datos.variaciones.map(v =>
          v.id === item.id ? { ...v, eliminado: true, actualizadoEn: ahora } : v
        ),
      })
    }
    setConfirmarEliminarItem(null)
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
          <h1 style={estilos.estiloTitulo}>💰 Ingresos</h1>
        </div>

        <button
          onClick={abrirNuevo}
          style={{ ...estilos.estiloBotonPrimario, marginBottom: "24px" }}
        >
          💰 + Nuevo ingreso 💰
        </button>

        {/* Totales del mes */}
        {totalesPorUsuario.some(t => t.total > 0) && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Total ingresos este mes
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {totalesPorUsuario.map(t => (
                <div key={t.id} style={{ ...estilos.estiloTarjeta, flex: 1, minWidth: "140px", display: "flex", flexDirection: "column", gap: "4px", padding: "14px 16px" }}>
                  <span style={{ fontSize: "14px", color: COLORES.textoSecundario }}>{t.nombre}</span>
                  <span style={{ fontSize: "22px", fontWeight: "700", color: COLORES.positivo }}>{fmt(t.total)}</span>
                  {t.numSalarios > 1 && (
                    <span style={{ fontSize: "11px", color: COLORES.primario }}>{t.numSalarios} fuentes activas</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listado */}
        {itemsListado.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Ingresos registrados
            </p>
            {itemsListado.map(item => {
              const activo = seleccionadoId === item.id
              const esIndividual = item._alcance === "individual"
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
                        background: item._tipo === "salario" ? COLORES.fondoTarjeta : COLORES.primarioSuave,
                        color: item._tipo === "salario" ? COLORES.positivo : COLORES.neutro,
                      }}>
                        {item._tipo === "salario" ? "Salario" : "Extra"}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: COLORES.textoBlanco }}>{item._label}</div>
                          {esIndividual && mostrarAlcance && (
                            <span style={{
                              fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px",
                              background: COLORES.primarioSuave, border: `1px solid ${COLORES.neutro}`, color: COLORES.neutro,
                            }}>👤 individual</span>
                          )}
                        </div>
                        {item._nombre ? (
                          <div style={{ fontSize: "13px", color: COLORES.primario, marginTop: "1px" }}>{item._nombre}</div>
                        ) : null}
                        <div style={{ fontSize: "12px", color: COLORES.textoSecundario, marginTop: "2px" }}>
                          {item._inicioTexto}
                          {item._tipo === "salario" && ` → ${item._finTexto}`}
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
                      <button
                        onClick={() => asignarFechaFin(item)}
                        style={{
                          flex: 1, padding: "10px", fontSize: "13px", borderRadius: "8px",
                          cursor: "pointer", fontWeight: "600",
                          background: COLORES.fondoPanel, color: COLORES.advertencia,
                          border: `1px solid ${COLORES.advertencia}`,
                        }}
                      >
                        📅 Finalizar
                      </button>
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
                        onClick={() => setConfirmarEliminarItem(item)}
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
            No hay ingresos registrados
          </p>
        )}
      </div>

      {/* Wizard */}
      {wizardAbierto && (
        <WizardModal
          pasos={pasos}
          state={wizardState}
          setState={setWizardState}
          onFin={guardar}
          onCerrar={cerrarWizard}
          titulo={editandoId ? "Editar ingreso" : "Nuevo ingreso"}
          labelFin={editandoId ? "💾 Guardar cambios" : "✓ Guardar"}
        />
      )}

      {/* Modal confirmación eliminar */}
      {confirmarEliminarItem && (() => {
        const item = confirmarEliminarItem
        return createPortal(
          <div
            style={estilos.estiloPopupOverlay}
            onClick={() => setConfirmarEliminarItem(null)}
          >
            <div
              style={{ ...estilos.estiloPopup, padding: "28px 24px", textAlign: "center" }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: "18px", fontWeight: "700", color: COLORES.texto, marginBottom: "8px" }}>¿Eliminar ingreso?</p>
              <p style={{ fontSize: "14px", color: COLORES.textoSecundario, marginBottom: "24px" }}>
                {item._nombre || item._label} — {fmt(item.monto)}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setConfirmarEliminarItem(null)}
                  style={estilos.estiloBotonSecundario}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => eliminarItem(item)}
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