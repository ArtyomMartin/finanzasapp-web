// AppRoot.jsx para la web

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Gustos from "./pages/Gustos"
import Cuotas from "./pages/Cuotas"
import Planes from "./pages/Planes"
import DetalleGastos from "./pages/DetalleGastos"
import UbiPlata from "./pages/UbiPlata"
import Rendimientos from "./pages/Rendimientos"
import Ingresos from "./pages/Ingresos"
import Gastos from "./pages/Gastos"
import Credito from "./pages/Credito"
import Reposicion from "./pages/Reposicion"
import Egresos from "./pages/Egresos"
import Inversiones from "./pages/Inversiones"
import HacerPagos from "./pages/HacerPagos"
import Ajustes from "./pages/Ajustes"
import FondoEmergencia from "./pages/FondoEmergencia"
import { useDatos } from "./context/AppContext"
import { App as CapacitorApp } from "@capacitor/app"
import { procesarCallbackDropboxWeb, tokenGuardadoDropbox, iniciarAuthDropbox, sincronizarDropbox } from "./services/dropboxSync"
import { tokenGuardado, sincronizar, mergeDatos } from "./services/driveSync"
import Consejos from "./pages/Consejos"
import DrawerMenu from "./components/DrawerMenu"
import WizardModal from "./components/WizardModal"

// ── Servicios de lógica ────────────────────────────────────────────────────
import { calcularMes, calcularDetalleGastos, proximosMeses, calcularIngresosTotales, calcularEgresosTotales } from "./services/calculos"
import { nombreMes } from "./services/formateo"

// ── Tema visual ────────────────────────────────────────────────────────────
import { COLORES } from "./theme/colores"
import {
  estiloContainer, estiloHeader, estiloBotonIcono,
  estiloPantalla, estiloBox,
  estiloBotonPrimario, estiloBotonSecundario, estiloBotonOpcion, estiloBotonOpcionActivo,
  estiloInput, estiloTitulo, estiloSubtitulo, estiloAyuda,
  estiloPopupOverlay, estiloPopup,
  estiloTabla, estiloTh, estiloTd,
} from "./theme/estilos"

const DROPBOX_APP_KEY = "gc2fxvtpc8qv6kq"

// ── Columnas Home ──────────────────────────────────────────────────────────
const COLUMNAS_DISPONIBLES = [
  { id: "ingresos",       label: "Ingresos",      color: "#6EC6F5", defaultOn: true  },
  { id: "egresos",        label: "Egresos",        color: "#F57C7C", defaultOn: true  },
  { id: "netoProvisorio", label: "Neto Prov.",     color: "#3DDC97", defaultOn: false },
  { id: "gastos",         label: "Ahorro/Crédito", color: "#FF9F43", defaultOn: true  },
  { id: "netoFinal",      label: "Neto Final",     color: "#4DA3FF", defaultOn: true  },
]

// ── SYNC INDICATOR ─────────────────────────────────────────────────────────
const SyncIndicator = ({ status, onClick }) => {
  const baseStyle = {
    position: "fixed", top: "12px", right: "16px", zIndex: 9999,
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 12px", borderRadius: "20px",
    backgroundColor: "rgba(22, 26, 32, 0.95)", backdropFilter: "blur(10px)",
    border: `1px solid rgba(255,255,255,0.1)`,
    fontSize: "13px", fontWeight: "600", color: "#fff",
    cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.3s ease",
  }
  if (status === "off") {
    return <div style={{ ...baseStyle, color: COLORES.textoMuted, borderColor: "rgba(255,255,255,0.05)" }} onClick={onClick} title="Conectar nube"><span style={{ fontSize: "16px" }}>☁️❌</span></div>
  }
  const config = {
    idle:    { icon: <span style={{ fontSize: "16px" }}>☁️</span>,                                                     text: "",       color: COLORES.acento    },
    syncing: { icon: <span className="spin-animation" style={{ fontSize: "16px", display: "inline-block" }}>🔄</span>, text: "Sync...", color: COLORES.acento    },
    success: { icon: <span style={{ fontSize: "16px" }}>✅</span>,                                                     text: "Al día", color: COLORES.syncOk    },
    error:   { icon: <span style={{ fontSize: "16px" }}>⚠️</span>,                                                     text: "Error",  color: COLORES.syncError  },
  }
  const current = config[status] || config.idle
  return (
    <div style={{ ...baseStyle, color: current.color, borderColor: current.color + "44" }} onClick={onClick} title="Sincronizar ahora">
      {current.icon}
      {current.text && <span>{current.text}</span>}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin-animation { animation: spin 1.5s linear infinite; }`}</style>
    </div>
  )
}

// ── DROPBOX OAUTH CALLBACK ─────────────────────────────────────────────────
function DropboxOAuthCallback() {
  const navigate = useNavigate()
  const { actualizarDatos } = useDatos()
  const [estado, setEstado] = useState("syncing")

  useEffect(() => {
    async function procesar() {
      const tokenOk = await procesarCallbackDropboxWeb()
      if (!tokenOk) { setEstado("error"); return }
      try {
        await sincronizarDropbox({}, actualizarDatos, (_local, remoto) => remoto)
        navigate("/", { replace: true })
      } catch (e) {
        console.error("Error sync post-OAuth Dropbox:", e)
        setEstado("error")
      }
    }
    procesar()
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: COLORES.textoBlanco, background: "#0f1115", gap: "16px" }}>
      {estado === "syncing" ? <p>⏳ Descargando datos de Dropbox...</p> : (
        <>
          <p style={{ color: COLORES.peligro }}>❌ Error al conectar. Inténtalo de nuevo.</p>
          <button onClick={() => navigate("/", { replace: true })} style={{ color: COLORES.acento, background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>← Volver al inicio</button>
        </>
      )}
    </div>
  )
}

// ── PANTALLA BIENVENIDA ────────────────────────────────────────────────────
function PantallaBienvenida({ onConfigurar, onSincronizarDropbox, dropboxEstado }) {
  return (
    <div style={estiloPantalla}>
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ ...estiloBox, animation: "fadeSlideUp 0.4s ease" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>💰</div>
        <h1 style={estiloTitulo}>FinanzasApp</h1>
        <p style={estiloSubtitulo}>No se encontró ninguna base de datos local.</p>
        <p style={estiloSubtitulo}>¿Cómo querés continuar?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "8px" }}>
          <button onClick={onConfigurar} style={estiloBotonPrimario}>⚙️ Configuración inicial</button>
          <button
            onClick={onSincronizarDropbox}
            disabled={dropboxEstado === "syncing" || dropboxEstado === "auth"}
            style={{
              ...estiloBotonPrimario,
              backgroundColor: "rgba(0, 100, 255, 0.20)",
              border: "1px solid rgba(0, 120, 255, 0.4)",
              color: "#7EB8FF",
              opacity: (dropboxEstado === "syncing" || dropboxEstado === "auth") ? 0.6 : 1,
            }}
          >
            {dropboxEstado === "auth"    ? "⏳ Autenticando..."     :
             dropboxEstado === "syncing" ? "⏳ Descargando datos..." :
             dropboxEstado === "error"   ? "❌ Error — reintentar"   :
             "📦 Sincronizar con Dropbox"}
          </button>
          {dropboxEstado === "error" && (
            <p style={{ margin: 0, fontSize: "13px", color: COLORES.peligro, textAlign: "center" }}>
              No se pudo conectar. Comprobá tu cuenta e intentalo de nuevo.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── WIZARD DE INICIO ───────────────────────────────────────────────────────
// Los pasos se definen como funciones puras fuera del componente.
// El state vive en PantallaWizard y se pasa a WizardModal → los pasos
// se recalculan en cada render, permitiendo ramificaciones dinámicas.

const NIVELES_OPCIONES = [
  { id: "basico",   label: "🟢 Básico",   items: "Ingresos · Egresos · Hacer pagos",                             detalle: "Para llevar un control simple de lo que entra y sale."     },
  { id: "medio",    label: "🟡 Medio",    items: "Todo lo anterior + Crédito · Reposiciones · Gustos · Planes", detalle: "Para quienes ya llevan un registro activo de sus finanzas." },
  { id: "avanzado", label: "🔴 Avanzado", items: "Todo disponible",                                              detalle: "Inversiones, rendimientos, fondo de emergencia y más."      },
]

// Cada función recibe (state, setState) y devuelve JSX
const PASO_USUARIOS = {
  titulo: "¿Cuántos usuarios usarán la app?",
  contenido: (s, set) => (
    <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
      {[1, 2].map(n => (
        <button key={n} style={{ ...estiloBotonOpcion, ...(s.numUsuarios === n ? estiloBotonOpcionActivo : {}) }} onClick={() => set(p => ({ ...p, numUsuarios: n }))}>
          {n === 1 ? "1 persona" : "2 personas"}
        </button>
      ))}
    </div>
  ),
}

const PASO_NOMBRES = {
  titulo: "¿Cómo se llaman?",
  contenido: (s, set) => (
    <>
      <input style={estiloInput} placeholder="Nombre usuario 1" value={s.nombre1} onChange={e => set(p => ({ ...p, nombre1: e.target.value }))} />
      {s.numUsuarios === 2 && (
        <input style={{ ...estiloInput, marginTop: "10px" }} placeholder="Nombre usuario 2" value={s.nombre2} onChange={e => set(p => ({ ...p, nombre2: e.target.value }))} />
      )}
    </>
  ),
}

const PASO_REPARTO = {
  titulo: "¿Cómo se reparten los gastos?",
  contenido: (s, set) => (
    <>
      {[["igual", "50 / 50"], ["proporcional", "Proporcional al salario"]].map(([r, label]) => (
        <button key={r} style={{ ...estiloBotonOpcion, marginBottom: "12px", ...(s.reparto === r ? estiloBotonOpcionActivo : {}) }} onClick={() => set(p => ({ ...p, reparto: r }))}>
          {label}
        </button>
      ))}
      <p style={estiloAyuda}>
        {s.reparto === "igual"
          ? "Cada persona paga la misma parte, independientemente de su salario."
          : "Cada persona paga según el porcentaje de su salario sobre el total."}
      </p>
    </>
  ),
}

const PASO_PAIS = {
  titulo: "¿En qué país vivís?",
  contenido: (s, set) => (
    <>
      <p style={{ ...estiloAyuda, marginBottom: "12px" }}>Esto define la moneda y el formato de cantidades.</p>
      {[{ codigo: "ES", label: "🇪🇸 España", simbolo: "€" }, { codigo: "AR", label: "🇦🇷 Argentina", simbolo: "$" }].map(({ codigo, label, simbolo }) => (
        <button key={codigo} style={{ ...estiloBotonOpcion, marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", ...(s.pais === codigo ? estiloBotonOpcionActivo : {}) }} onClick={() => set(p => ({ ...p, pais: codigo }))}>
          <span style={{ fontWeight: "600" }}>{label}</span>
          <span style={{ fontSize: "20px", fontWeight: "700", color: s.pais === codigo ? COLORES.acento : COLORES.textoMuted }}>{simbolo}</span>
        </button>
      ))}
    </>
  ),
}

const PASO_NIVEL = {
  titulo: "¿Qué nivel de detalle querés?",
  contenido: (s, set) => (
    <>
      <p style={{ ...estiloAyuda, marginBottom: "12px" }}>Podés cambiarlo cuando quieras desde Ajustes.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {NIVELES_OPCIONES.map(({ id, label, items, detalle }) => (
          <button key={id} style={{ ...estiloBotonOpcion, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "14px 16px", ...(s.nivel === id ? estiloBotonOpcionActivo : {}) }} onClick={() => set(p => ({ ...p, nivel: id }))}>
            <span style={{ fontWeight: "700", fontSize: "15px" }}>{label}</span>
            <span style={{ fontSize: "12px", color: s.nivel === id ? COLORES.acento : COLORES.textoMuted, marginTop: "4px", lineHeight: "1.4" }}>{items}</span>
            <span style={{ fontSize: "11px", color: s.nivel === id ? "#8A70D6" : "#555D6B", marginTop: "3px", fontStyle: "italic" }}>{detalle}</span>
          </button>
        ))}
      </div>
    </>
  ),
}

function PantallaWizard({ onFinalizar }) {
  const [wiz, setWiz] = useState({ numUsuarios: 2, nombre1: "", nombre2: "", reparto: "igual", pais: "ES", nivel: "medio" })

  // Pasos dinámicos: el paso de reparto solo aparece si hay 2 usuarios.
  // Al cambiar numUsuarios en el paso 1, los pasos se recalculan automáticamente
  // en el siguiente render, y WizardModal ajusta el índice si quedara fuera de rango.
  const pasos = [
    PASO_USUARIOS,
    PASO_NOMBRES,
    ...(wiz.numUsuarios === 2 ? [PASO_REPARTO] : []),
    PASO_PAIS,
    PASO_NIVEL,
  ]

  function handleFin() {
    const usuarios = [{ id: "usuario1", nombre: wiz.nombre1.trim() || "Usuario 1" }]
    if (wiz.numUsuarios === 2) usuarios.push({ id: "usuario2", nombre: wiz.nombre2.trim() || "Usuario 2" })
    onFinalizar({ version: 1, numUsuarios: wiz.numUsuarios, usuarios, reparto: wiz.reparto, pais: wiz.pais, nivelSeguimiento: wiz.nivel })
  }

  return (
    <WizardModal
      pasos={pasos}
      state={wiz}
      setState={setWiz}
      onFin={handleFin}
      onCerrar={() => {}}           // wizard de inicio: no se puede cerrar
      titulo="Configuración inicial"
      labelFin="✓ Empezar"
    />
  )
}

// ── PANTALLA QUIÉN ERES ────────────────────────────────────────────────────
function PantallaQuienEres({ usuarios, onSeleccionar }) {
  return (
    <div style={{ ...estiloPantalla, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...estiloBox, animation: "fadeSlideUp 0.4s ease" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>👤</div>
        <h2 style={estiloTitulo}>¿Quién eres?</h2>
        <p style={estiloSubtitulo}>Seleccioná tu perfil para continuar</p>
        {usuarios.map(u => (
          <button key={u.id} style={{ ...estiloBotonPrimario, marginTop: "12px" }} onClick={() => onSeleccionar(u.id)}>{u.nombre}</button>
        ))}
      </div>
    </div>
  )
}

// ── HOME ───────────────────────────────────────────────────────────────────
const LS_KEY_COLUMNAS = "home-columnas-visibles"

function Home() {
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [mesDetalle, setMesDetalle] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { datos, usuarioActivo, fmt } = useDatos()

  const [columnasVisibles, setColumnasVisibles] = useState(() => {
    try {
      const guardado = localStorage.getItem(LS_KEY_COLUMNAS)
      if (guardado) return JSON.parse(guardado)
    } catch (_) {}
    return Object.fromEntries(COLUMNAS_DISPONIBLES.map(c => [c.id, c.defaultOn]))
  })

  useEffect(() => {
    try { localStorage.setItem(LS_KEY_COLUMNAS, JSON.stringify(columnasVisibles)) } catch (_) {}
  }, [columnasVisibles])

  function toggleColumna(id) { setColumnasVisibles(prev => ({ ...prev, [id]: !prev[id] })) }

  const hoy   = new Date()
  const meses = [{ mes: hoy.getMonth() + 1, anio: hoy.getFullYear() }, ...proximosMeses(11)]

  const filas = meses.map(({ mes, anio }) => {
    const { netoProvisorio, gastos, netoFinal } = calcularMes(datos, usuarioActivo, mes, anio)
    const ingresos = calcularIngresosTotales(datos, mes, anio)
    const egresos  = calcularEgresosTotales(datos, mes, anio)
    return { mes, anio, ingresos, egresos, netoProvisorio, gastos, netoFinal }
  })

  const detalleData = mesDetalle
    ? { ...calcularMes(datos, usuarioActivo, mesDetalle.mes, mesDetalle.anio), ...calcularDetalleGastos(datos, usuarioActivo, mesDetalle.mes, mesDetalle.anio) }
    : null

  const columnasActivas = COLUMNAS_DISPONIBLES.filter(c => columnasVisibles[c.id])

  function colorCelda(id, valor) {
    if (id === "ingresos")       return "#6EC6F5"
    if (id === "egresos")        return "#F57C7C"
    if (id === "netoProvisorio") return COLORES.positivo
    if (id === "gastos")         return COLORES.advertencia
    if (id === "netoFinal")      return valor >= 0 ? COLORES.neutro : COLORES.negativo
    return COLORES.textoBlanco
  }

  function renderCelda(id, fila) {
    if (id === "gastos")  return `- ${fmt(fila.gastos)}`
    if (id === "egresos") return `- ${fmt(fila.egresos)}`
    return fmt(fila[id])
  }

  return (
    <div style={{ ...estiloContainer, display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn      { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupIn     { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        tr { transition: background 0.15s ease; }
        tr:hover td { background: rgba(124, 92, 255, 0.08) !important; }
        button { transition: opacity 0.15s ease, transform 0.1s ease; }
        button:active { transform: scale(0.97); opacity: 0.85; }
        .col-checkbox-label:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      <DrawerMenu abierto={drawerAbierto} setAbierto={setDrawerAbierto} rutaActual={location.pathname} alNavegar={navigate} />

      <div style={estiloHeader}>
        <button onClick={() => setDrawerAbierto(true)} style={{ ...estiloBotonIcono, fontSize: "24px" }}>☰</button>
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "bold", color: COLORES.textoBlanco }}>FinanzasApp</h2>
        <div style={{ width: "44px" }} />
      </div>

      {/* Tabla */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ width: "100%", padding: "20px", maxWidth: "900px", margin: "0 auto", animation: "fadeSlideUp 0.35s ease" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: COLORES.textoMuted, marginBottom: "12px", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            12 meses
          </h3>
          {columnasActivas.length === 0 ? (
            <p style={{ color: COLORES.textoMuted, fontSize: "14px", textAlign: "center", marginTop: "32px" }}>Seleccioná al menos una columna para ver datos.</p>
          ) : (
            <div style={{ overflowX: "auto", borderRadius: "12px" }}>
              <table style={estiloTabla}>
                <thead>
                  <tr>
                    <th style={{ ...estiloTh, textAlign: "left" }}>Mes</th>
                    {columnasActivas.map(col => <th key={col.id} style={{ ...estiloTh, color: col.color }}>{col.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", cursor: "pointer" }} onClick={() => setMesDetalle({ mes: fila.mes, anio: fila.anio })}>
                      <td style={{ ...estiloTd, textAlign: "left", fontWeight: "600", color: COLORES.textoBlanco }}>{nombreMes(fila.mes)}</td>
                      {columnasActivas.map(col => (
                        <td key={col.id} style={{ ...estiloTd, color: colorCelda(col.id, fila[col.id]), fontWeight: col.id === "netoFinal" ? "bold" : "normal" }}>
                          {renderCelda(col.id, fila)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Selector de columnas */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: "6px 4px", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "6px", whiteSpace: "nowrap" }}>Columnas</span>
        {COLUMNAS_DISPONIBLES.map(col => {
          const activa = columnasVisibles[col.id]
          return (
            <label key={col.id} className="col-checkbox-label" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "20px", border: `1px solid ${activa ? col.color + "66" : "rgba(255,255,255,0.1)"}`, backgroundColor: activa ? col.color + "18" : "transparent", cursor: "pointer", transition: "all 0.15s ease", userSelect: "none" }}>
              <input type="checkbox" checked={activa} onChange={() => toggleColumna(col.id)} style={{ accentColor: col.color, width: "13px", height: "13px", cursor: "pointer" }} />
              <span style={{ fontSize: "12px", fontWeight: "600", color: activa ? col.color : COLORES.textoMuted, whiteSpace: "nowrap" }}>{col.label}</span>
            </label>
          )
        })}
      </div>

      {/* Bottom sheet detalle */}
      {mesDetalle && detalleData && createPortal(
        <div style={{ ...estiloPopupOverlay, animation: "fadeIn 0.2s ease" }} onClick={() => setMesDetalle(null)}>
          <div style={{ ...estiloPopup, animation: "popupIn 0.25s cubic-bezier(0.32,0.72,0,1)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: COLORES.textoBlanco }}>{nombreMes(mesDetalle.mes)} {mesDetalle.anio}</span>
              <button style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: COLORES.textoMuted, padding: "4px" }} onClick={() => setMesDetalle(null)}>✕</button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.8px" }}>Neto provisorio</span>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: COLORES.positivo }}>{fmt(detalleData.netoProvisorio)}</span>
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", margin: "0 24px" }} />
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.8px" }}>Gastos de {nombreMes(mesDetalle.mes)}</span>
                {detalleData.fondos?.length > 0 && (
                  <>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: COLORES.textoSecundario, marginTop: "4px" }}>Reposición al fondo de liquidez</span>
                    {detalleData.fondos.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "15px", color: COLORES.textoBlanco, flex: 1 }}>{item.nombre}{item.cuotaActual && <span style={{ fontSize: "12px", color: COLORES.textoMuted }}> cuota {item.cuotaActual}/{item.numCuotas}</span>}</span>
                        <span style={{ fontSize: "15px", fontWeight: "600", whiteSpace: "nowrap", color: COLORES.advertencia }}>- {fmt(item.monto)}</span>
                      </div>
                    ))}
                  </>
                )}
                {detalleData.creditos?.length > 0 && (
                  <>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: COLORES.textoSecundario, marginTop: detalleData.fondos?.length > 0 ? "14px" : "0" }}>Crédito</span>
                    {detalleData.creditos.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span style={{ fontSize: "15px", color: COLORES.textoBlanco, flex: 1 }}>{item.nombre}{item.cuotaActual && <span style={{ fontSize: "12px", color: COLORES.textoMuted }}> cuota {item.cuotaActual}/{item.numCuotas}</span>}</span>
                        <span style={{ fontSize: "15px", fontWeight: "600", whiteSpace: "nowrap", color: COLORES.negativo }}>- {fmt(item.monto)}</span>
                      </div>
                    ))}
                  </>
                )}
                {!detalleData.fondos?.length && !detalleData.creditos?.length && (
                  <span style={{ fontSize: "14px", color: COLORES.textoMuted, fontStyle: "italic" }}>Sin gastos registrados</span>
                )}
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", margin: "0 24px" }} />
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.8px" }}>Neto final</span>
                <span style={{ fontSize: "32px", fontWeight: "bold", color: detalleData.netoFinal >= 0 ? COLORES.neutro : COLORES.negativo }}>{fmt(detalleData.netoFinal)}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
function AppRoot() {
  const { datos, actualizarDatos, usuarioActivo, setUsuarioActivo, hayDB } = useDatos()
  const [modo, setModo] = useState(null)
  const [dropboxEstado, setDropboxEstado] = useState("idle")
  const navigate = useNavigate()
  const location = useLocation()
  const [yaSincronizoInicio, setYaSincronizoInicio] = useState(false)
  const [syncStatus, setSyncStatus] = useState("off")

  const dbExiste = hayDB()

useEffect(() => {
    if (typeof CapacitorApp?.addListener !== "function") return
    const listenerPromise = CapacitorApp.addListener("backButton", () => {
      if (location.pathname === "/") { CapacitorApp.exitApp() } else { navigate(-1) }
    })
    return () => { listenerPromise.then(h => h.remove()) }
  }, [location.pathname])

  useEffect(() => {
    if (dbExiste && !yaSincronizoInicio && navigator.onLine) {
      const driveOk = tokenGuardado()
      const dropOk  = tokenGuardadoDropbox()
      if (driveOk || dropOk) { setSyncStatus("idle"); ejecutarSincronizacionGlobal() }
      else setSyncStatus("off")
    } else if (dbExiste && yaSincronizoInicio) {
      const driveOk = tokenGuardado()
      const dropOk  = tokenGuardadoDropbox()
      if (!driveOk && !dropOk) setSyncStatus("off")
      else if (syncStatus === "off") setSyncStatus("idle")
    }
  }, [dbExiste, yaSincronizoInicio])

  const ejecutarSincronizacionGlobal = async () => {
    if (!tokenGuardado() && !tokenGuardadoDropbox()) { navigate("/app/ajustes"); return }
    if (!navigator.onLine) { setSyncStatus("error"); setTimeout(() => setSyncStatus("idle"), 3000); return }
    setSyncStatus("syncing")
    setYaSincronizoInicio(true)
    try {
      if (tokenGuardado())        await sincronizar(datos, actualizarDatos)
      if (tokenGuardadoDropbox()) await sincronizarDropbox(datos, actualizarDatos, mergeDatos)
      setSyncStatus("success")
      setTimeout(() => setSyncStatus("idle"), 3000)
    } catch (error) {
      console.error("Sync Error:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 4000)
    }
  }

  if (location.pathname.endsWith("/oauth")) {
    return <Routes><Route path="/oauth" element={<DropboxOAuthCallback />} /></Routes>
  }

  async function sincronizarDesdeDropbox() {
    try {
      setDropboxEstado("auth")
      await iniciarAuthDropbox(DROPBOX_APP_KEY)
      setDropboxEstado("syncing")
      await sincronizarDropbox({}, actualizarDatos, (_local, remoto) => remoto)
      setDropboxEstado("ok")
    } catch (e) {
      console.error("Dropbox sync error:", e)
      setDropboxEstado("error")
    }
  }

  if (!dbExiste && modo === null) {
    return <PantallaBienvenida onConfigurar={() => setModo("wizard")} onSincronizarDropbox={sincronizarDesdeDropbox} dropboxEstado={dropboxEstado} />
  }

  if (!dbExiste && modo === "wizard") {
    function handleFinalizar(config) {
      const nuevaDB = {
        config,
        salarios: [], variaciones: [], egresos: [], ajustes: [],
        planes: [], ubicacion: [],
        inversiones: [], cuentasInversion: [],
        fondoEmergencia: { activo: false, tipo: "porcentaje", valor: 0, mesesObjetivo: 3, mesInicio: null, anioInicio: null },
        extra1: [], extra2: [], extra3: []
      }
      actualizarDatos(nuevaDB)
      if (config.numUsuarios === 1) setUsuarioActivo(config.usuarios[0].id)
    }
    return <PantallaWizard onFinalizar={handleFinalizar} />
  }

  if (dbExiste && !usuarioActivo) {
    return <PantallaQuienEres usuarios={datos.config.usuarios} onSeleccionar={(id) => setUsuarioActivo(id)} />
  }

  return (
    <>
      {dbExiste && usuarioActivo && <SyncIndicator status={syncStatus} onClick={ejecutarSincronizacionGlobal} />}
      <Routes>
        <Route path="/app"                    element={<Home />}                    />
        <Route path="/app/gustos"             element={<Gustos />}                  />
        <Route path="/app/cuotas"             element={<Cuotas />}                  />
        <Route path="/app/planes"             element={<Planes />}                  />
        <Route path="/app/detalle-gastos"     element={<DetalleGastos />}           />
        <Route path="/app/ubi-plata"          element={<UbiPlata />}                />
        <Route path="/app/rendimientos"       element={<Rendimientos />}            />
        <Route path="/app/ingresos"           element={<Ingresos />}                />
        <Route path="/app/gastos"             element={<Gastos />}                  />
        <Route path="/app/credito"            element={<Credito />}                 />
        <Route path="/app/reposicion"         element={<Reposicion />}              />
        <Route path="/app/egresos"            element={<Egresos />}                 />
        <Route path="/app/hacer-pagos"        element={<HacerPagos />}              />
        <Route path="/app/inversiones"        element={<Inversiones />}             />
        <Route path="/app/ajustes"            element={<Ajustes />}                 />
        <Route path="/app/consejos"           element={<Consejos />}                />
        <Route path="/app/fondo-emergencia"   element={<FondoEmergencia />}         />
        <Route path="/app/oauth"              element={<DropboxOAuthCallback />}    />
      </Routes>
    </>
  )
}

//export default function App() {
//  return <AppRoot />
//}

export default AppRoot