// AppRoot.jsx para la web
// Puerto de src/App.jsx de finanzas-app, montado bajo el prefijo "/app"

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
import { tokenGuardado, sincronizar, mergeDatos, iniciarAuth } from "./services/driveSync"
import Consejos from "./pages/Consejos"
import DrawerMenu from "./components/DrawerMenu"
import WizardModal from "./components/WizardModal"
import { nombreMes, nombreMesCorto } from "./services/formateo"
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Wallet, Settings, Package, Loader2, User, X, ArrowLeft, Check } from "lucide-react";

// ── Servicios de lógica ────────────────────────────────────────────────────
import { calcularMes, calcularDetalleGastos, proximosMeses, calcularIngresosTotales, calcularEgresosTotales } from "./services/calculos"

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
    backgroundColor: COLORES.fondoTarjeta, backdropFilter: "blur(10px)",
    border: `1px solid ${COLORES.bordeBlanco}`,
    fontSize: "13px", fontWeight: "600", color: COLORES.texto,
    cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.3s ease",
  }
  if (status === "off") {
    return (
      <div style={{ ...baseStyle, color: COLORES.textoMuted, borderColor: "rgba(255,255,255,0.05)" }} onClick={onClick} title="Conectar nube">
        <CloudOff size={16} />
      </div>
    )
  }
  const config = {
    idle:    { icon: <Cloud size={16} />,                                                  text: "",        color: COLORES.acento    },
    syncing: { icon: <RefreshCw size={16} className="spin-animation" />,                   text: "Sync...", color: COLORES.acento    },
    success: { icon: <CheckCircle2 size={16} />,                                           text: "Al día",  color: COLORES.syncOk    },
    error:   { icon: <AlertTriangle size={16} />,                                          text: "Error",   color: COLORES.syncError  },
  }
  const current = config[status] || config.idle
  return (
    <div style={{ ...baseStyle, color: current.color, borderColor: current.color + "44" }} onClick={onClick} title="Sincronizar ahora">
      {current.icon}
      {current.text && <span>{current.text}</span>}
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
        navigate("/app", { replace: true })
      } catch (e) {
        console.error("Error sync post-OAuth Dropbox:", e)
        setEstado("error")
      }
    }
    procesar()
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: COLORES.textoBlanco, background: COLORES.fondoApp, gap: "16px" }}>
      {estado === "syncing" ? (
        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}><Loader2 size={18} className="spin-animation" /> Descargando datos de Dropbox...</p>
      ) : (
        <>
          <p style={{ color: COLORES.peligro, display: "flex", alignItems: "center", gap: "8px" }}><XCircle size={18} /> Error al conectar. Inténtalo de nuevo.</p>
          <button onClick={() => navigate("/app", { replace: true })} style={{ color: COLORES.acento, background: "none", border: "none", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" }}><ArrowLeft size={16} /> Volver al inicio</button>
        </>
      )}
    </div>
  )
}

// ── PANTALLA BIENVENIDA ────────────────────────────────────────────────────
function PantallaBienvenida({ onConfigurar, onSincronizarDropbox, dropboxEstado, onSincronizarDrive, driveEstado }) {
  return (
    <div style={estiloPantalla}>
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ ...estiloBox, animation: "fadeSlideUp 0.4s ease" }}>
        <Wallet size={48} color={COLORES.primario} style={{ marginBottom: "12px" }} />
        <h1 style={estiloTitulo}>FinanzasApp</h1>
        <p style={estiloSubtitulo}>No se encontró ninguna base de datos local.</p>
        <p style={estiloSubtitulo}>¿Cómo querés continuar?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", marginTop: "8px" }}>
          <button onClick={onConfigurar} style={{ ...estiloBotonPrimario, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><Settings size={16} /> Configuración inicial</button>
          <button
            onClick={onSincronizarDropbox}
            disabled={dropboxEstado === "syncing" || dropboxEstado === "auth"}
            style={{
              ...estiloBotonPrimario,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              backgroundColor: "rgba(0, 100, 255, 0.20)",
              border: "1px solid rgba(0, 120, 255, 0.4)",
              color: "#7EB8FF",
              opacity: (dropboxEstado === "syncing" || dropboxEstado === "auth") ? 0.6 : 1,
            }}
          >
            {dropboxEstado === "auth"    ? <><Loader2 size={16} className="spin-animation" /> Autenticando...</>     :
             dropboxEstado === "syncing" ? <><Loader2 size={16} className="spin-animation" /> Descargando datos...</> :
             dropboxEstado === "error"   ? <><XCircle size={16} /> Error — reintentar</>   :
             <><Package size={16} /> Sincronizar con Dropbox</>}
          </button>
          {/* Drive sync oculto temporalmente — mantener código para uso futuro */}
          <span style={{ display: "none" }}>
          <button
            onClick={onSincronizarDrive}
            disabled={driveEstado === "syncing" || driveEstado === "auth"}
            style={{
              ...estiloBotonPrimario,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              backgroundColor: "rgba(66, 133, 244, 0.20)",
              border: "1px solid rgba(66, 133, 244, 0.4)",
              color: "#8AB4F8",
              opacity: (driveEstado === "syncing" || driveEstado === "auth") ? 0.6 : 1,
            }}
          >
            {driveEstado === "auth"    ? <><Loader2 size={16} className="spin-animation" /> Autenticando...</>     :
             driveEstado === "syncing" ? <><Loader2 size={16} className="spin-animation" /> Descargando datos...</> :
             driveEstado === "error"   ? <><XCircle size={16} /> Error — reintentar</>   :
             <><Cloud size={16} /> Sincronizar con Google Drive</>}
          </button>
          {driveEstado === "error" && (
            <p style={{ margin: 0, fontSize: "13px", color: COLORES.peligro, textAlign: "center" }}>
              No se pudo conectar con Google Drive. Intentalo de nuevo.
            </p>
          )}
          </span>
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

function PantallaWizard({ onFinalizar }) {
  const [wiz, setWiz] = useState({ numUsuarios: 2, nombre1: "", nombre2: "", reparto: "igual" })

  const pasos = [
    PASO_USUARIOS,
    PASO_NOMBRES,
    ...(wiz.numUsuarios === 2 ? [PASO_REPARTO] : []),
  ]

  function handleFin() {
    const usuarios = [{ id: "usuario1", nombre: wiz.nombre1.trim() || "Usuario 1" }]
    if (wiz.numUsuarios === 2) usuarios.push({ id: "usuario2", nombre: wiz.nombre2.trim() || "Usuario 2" })
    onFinalizar({ version: 1, numUsuarios: wiz.numUsuarios, usuarios, reparto: wiz.reparto, pais: "ES", nivelSeguimiento: "avanzado" })
  }

  return (
    <div style={{ ...estiloPantalla, alignItems: "center", justifyContent: "center" }}>
      <WizardModal
        pasos={pasos}
        state={wiz}
        setState={setWiz}
        onFin={handleFin}
        onCerrar={() => {}}
        titulo="Configuración inicial"
        labelFin={<><Check size={16} /> Empezar</>}
      />
    </div>
  )
}

// ── PANTALLA QUIÉN ERES ────────────────────────────────────────────────────
function PantallaQuienEres({ usuarios, onSeleccionar }) {
  return (
    <div style={{ ...estiloPantalla, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...estiloBox, animation: "fadeSlideUp 0.4s ease" }}>
        <User size={48} color={COLORES.primario} style={{ marginBottom: "12px" }} />
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

      <DrawerMenu rutaActual={location.pathname} alNavegar={navigate} />

      <div style={estiloHeader}>
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "bold", color: COLORES.textoBlanco }}>FinanzasApp</h2>
      </div>

      {/* Tabla */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", paddingBottom: "72px" }}>
        <div style={{ width: "100%", padding: "8px 4px", maxWidth: "900px", margin: "0 auto", animation: "fadeSlideUp 0.35s ease" }}>
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
                      <td style={{ ...estiloTd, textAlign: "left", fontWeight: "600", color: COLORES.textoBlanco }}>{nombreMesCorto(fila.mes)}</td>
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

      {/* Bottom sheet detalle */}
      {mesDetalle && detalleData && createPortal(
        <div style={{ ...estiloPopupOverlay, animation: "fadeIn 0.2s ease" }} onClick={() => setMesDetalle(null)}>
          <div style={{ ...estiloPopup, animation: "popupIn 0.25s cubic-bezier(0.32,0.72,0,1)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: COLORES.textoBlanco }}>{nombreMes(mesDetalle.mes)} {mesDetalle.anio}</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: COLORES.textoMuted, padding: "4px", display: "flex" }} onClick={() => setMesDetalle(null)}><X size={18} /></button>
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
  const [driveEstado, setDriveEstado] = useState("idle")
  const navigate = useNavigate()
  const location = useLocation()
  const [yaSincronizoInicio, setYaSincronizoInicio] = useState(false)
  const [syncStatus, setSyncStatus] = useState("off")

  const dbExiste = hayDB()

  useEffect(() => {
    if (typeof CapacitorApp?.addListener !== "function") return
    const listenerPromise = CapacitorApp.addListener("backButton", () => {
      if (location.pathname === "/app") { CapacitorApp.exitApp() } else { navigate(-1) }
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

  // Auto-seleccionar usuario si la DB tiene solo uno (ej: después de sync desde bienvenida)
  useEffect(() => {
    if (dbExiste && !usuarioActivo && datos?.config?.numUsuarios === 1 && datos?.config?.usuarios?.length === 1) {
      setUsuarioActivo(datos.config.usuarios[0].id)
    }
  }, [dbExiste, usuarioActivo, datos])

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

  // El path del Route coincide con "/oauth" porque Dropbox redirige ahí (no a "/app/oauth")
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

  async function sincronizarDesdeDrive() {
    try {
      setDriveEstado("auth")
      await iniciarAuth()
      setDriveEstado("syncing")
      await sincronizar({}, actualizarDatos, (_local, remoto) => remoto)
      setDriveEstado("ok")
    } catch (e) {
      console.error("Drive sync error desde wizard:", e)
      setDriveEstado("error")
    }
  }

  if (!dbExiste && modo === null) {
    return (
      <PantallaBienvenida
        onConfigurar={() => setModo("wizard")}
        onSincronizarDropbox={sincronizarDesdeDropbox}
        dropboxEstado={dropboxEstado}
        onSincronizarDrive={sincronizarDesdeDrive}
        driveEstado={driveEstado}
      />
    )
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

export default AppRoot
