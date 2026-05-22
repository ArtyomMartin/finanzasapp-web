import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Capacitor } from "@capacitor/core"
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"
import Backup from "../components/Backup"
import DrawerMenu from "../components/DrawerMenu"
import { useDatos } from "../context/AppContext"
import { iniciarAuth, tokenGuardado, cerrarSesion, sincronizar, mergeDatos } from "../services/driveSync"
import {
  iniciarAuthDropbox,
  tokenGuardadoDropbox,
  cerrarSesionDropbox,
  sincronizarDropbox,
} from "../services/dropboxSync"
import { purgarDatos } from "../services/purga"
import { 
  COLORES, 
  estiloPantalla, 
  estiloHeader, 
  estiloTitulo, 
  estiloSubtitulo, 
  estiloTarjeta, 
  estiloBotonPrimario, 
  estiloBotonSecundario, 
  estiloBotonOpcion, 
  estiloBotonOpcionActivo 
} from "../theme"

const DROPBOX_APP_KEY = "gc2fxvtpc8qv6kq"

export default function Ajustes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { datos, actualizarDatos, tema, cambiarTema } = useDatos()
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Drive
  const [driveConectado, setDriveConectado] = useState(false)
  const [driveEstado, setDriveEstado] = useState("idle")
  const [driveUltimaSync, setDriveUltimaSync] = useState(null)

  // Dropbox
  const [dropboxConectado, setDropboxConectado] = useState(false)
  const [dropboxEstado, setDropboxEstado] = useState("idle")
  const [dropboxUltimaSync, setDropboxUltimaSync] = useState(null)

  const [logMessages, setLogMessages] = useState([])
  const datosRef = useRef(datos)
  useEffect(() => { datosRef.current = datos }, [datos])

  // ── Estado de la tarjeta de Mantenimiento ──────────────────────────────────
  // anioPurga: año seleccionado para purgar (por defecto el año anterior al actual)
  const anioActual = new Date().getFullYear()
  const [anioPurga, setAnioPurga] = useState(anioActual - 1)
  // Estado del proceso: "idle" | "confirmando" | "purgando" | "ok" | "error"
  const [estadoPurga, setEstadoPurga] = useState("idle")
  // Cuántos registros se compactaron en la última purga
  const [resultadoPurga, setResultadoPurga] = useState(null)

  const addLog = (msg, tipo = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const entrada = `[${timestamp}] [${tipo.toUpperCase()}] ${msg}`
    console.log(entrada)
    setLogMessages(prev => [...prev, { texto: entrada, tipo }])
  }

  useEffect(() => {
    if (tokenGuardado()) {
      addLog("Drive: token guardado encontrado", "ok")
      setDriveConectado(true)
    }
    if (tokenGuardadoDropbox()) {
      addLog("Dropbox: token guardado encontrado", "ok")
      setDropboxConectado(true)
    }

    const params = new URLSearchParams(location.search)
    if (params.get("dropbox") === "ok") {
      addLog("Dropbox: autenticación completada", "ok")
      setDropboxConectado(true)
      hacerSyncDropbox()
    }
  }, [])

  // ── NIVEL ──────────────────────────────────────────────────────────────────

  function cambiarNivel(nuevoNivel) {
    const nuevosDatos = {
      ...datos,
      config: { ...datos.config, nivelSeguimiento: nuevoNivel }
    }
    actualizarDatos(nuevosDatos)
  }

  // ── PAÍS ───────────────────────────────────────────────────────────────────

  function cambiarPais(nuevoPais) {
    const nuevosDatos = {
      ...datos,
      config: { ...datos.config, pais: nuevoPais }
    }
    actualizarDatos(nuevosDatos)
  }

  // ── DRIVE ──────────────────────────────────────────────────────────────────

  async function conectarDrive() {
    addLog("Drive: iniciando autenticación...")
    try {
      await iniciarAuth()
      addLog("Drive: autenticación OK", "ok")
      setDriveConectado(true)
      await hacerSyncDrive()
    } catch (e) {
      addLog(`Drive: error al conectar: ${e?.message || JSON.stringify(e)}`, "error")
      setDriveEstado("error")
    }
  }

  async function desconectarDrive() {
    addLog("Drive: cerrando sesión...")
    try {
      await cerrarSesion()
      setDriveConectado(false)
      setDriveEstado("idle")
      setDriveUltimaSync(null)
      addLog("Drive: sesión cerrada", "ok")
    } catch (e) {
      addLog(`Drive: error al desconectar: ${e?.message || JSON.stringify(e)}`, "error")
    }
  }

  async function hacerSyncDrive() {
    if (!navigator.onLine) {
      addLog("Drive: sin conexión", "error")
      setDriveEstado("offline")
      return
    }
    addLog("Drive: sincronizando...")
    setDriveEstado("syncing")
    try {
      await sincronizar(datosRef.current, actualizarDatos)
      setDriveEstado("ok")
      setDriveUltimaSync(new Date())
      addLog("Drive: sincronización OK", "ok")
    } catch (e) {
      addLog(`Drive: error en sync: ${e?.message || JSON.stringify(e)}`, "error")
      setDriveEstado("error")
    }
  }

  // ── DROPBOX ────────────────────────────────────────────────────────────────

  async function conectarDropbox() {
    addLog("Dropbox: iniciando autenticación...")
    try {
      await iniciarAuthDropbox(DROPBOX_APP_KEY)
      addLog("Dropbox: autenticación OK", "ok")
      setDropboxConectado(true)
      await hacerSyncDropbox()
    } catch (e) {
      if (tokenGuardadoDropbox()) {
        addLog("Dropbox: autenticación OK", "ok")
        setDropboxConectado(true)
        await hacerSyncDropbox()
      } else {
        addLog(`Dropbox: error al conectar: ${e?.message || JSON.stringify(e)}`, "error")
        setDropboxEstado("error")
      }
    }
  }

  async function desconectarDropbox() {
    addLog("Dropbox: cerrando sesión...")
    cerrarSesionDropbox()
    setDropboxConectado(false)
    setDropboxEstado("idle")
    setDropboxUltimaSync(null)
    addLog("Dropbox: sesión cerrada", "ok")
  }

  async function hacerSyncDropbox() {
    if (!navigator.onLine) {
      addLog("Dropbox: sin conexión", "error")
      setDropboxEstado("offline")
      return
    }
    addLog("Dropbox: sincronizando...")
    setDropboxEstado("syncing")
    try {
      await sincronizarDropbox(datosRef.current, actualizarDatos, mergeDatos)
      setDropboxEstado("ok")
      setDropboxUltimaSync(new Date())
      addLog("Dropbox: sincronización OK", "ok")
    } catch (e) {
      addLog(`Dropbox: error en sync: ${e?.message || JSON.stringify(e)}`, "error")
      setDropboxEstado("error")
    }
  }

  // ── MANTENIMIENTO — Backup previo a la purga ───────────────────────────────
  // Reutiliza la misma lógica de Backup.jsx: en nativo usa Capacitor Filesystem
  // + Share; en web descarga un JSON directamente.
  // Se llama automáticamente antes de ejecutar la purga para que el usuario
  // siempre tenga el histórico completo si lo necesita.

  async function exportarBackupPrevio() {
    const json = JSON.stringify(datosRef.current, null, 2)
    const fecha = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
    const nombre = `finanzas-backup-previo-purga-${fecha}.json`

    if (Capacitor.isNativePlatform()) {
      // Nativo: escribir en el sistema de archivos y compartir
      await Filesystem.writeFile({
        path: nombre,
        data: json,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      })
      const uri = await Filesystem.getUri({ path: nombre, directory: Directory.Cache })
      await Share.share({ title: nombre, url: uri.uri })
    } else {
      // Web: descarga directa mediante un enlace temporal
      const blob = new Blob([json], { type: "application/json" })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = nombre
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // ── MANTENIMIENTO — Ejecutar purga ─────────────────────────────────────────
  // Flujo completo:
  //   1. Exportar backup (siempre, antes de tocar datos)
  //   2. Llamar purgarDatos() con el año de corte seleccionado + 1
  //      (ej: si el usuario elige 2024, se purga todo anterior a 2025)
  //   3. Guardar los datos purgados con actualizarDatos()
  //   4. Sincronizar con la nube para que el tombstone viaje y el remoto
  //      quede también limpio
  //   5. Mostrar cuántos registros se compactaron

  async function ejecutarPurga() {
    setEstadoPurga("purgando")
    addLog(`Mantenimiento: iniciando purga del año ${anioPurga}...`)

    try {
      // Paso 1 — Backup automático previo
      addLog("Mantenimiento: exportando backup previo a la purga...")
      await exportarBackupPrevio()
      addLog("Mantenimiento: backup exportado OK", "ok")

      // Paso 2 — Purgar datos
      // anioPurga + 1 porque purgarDatos recibe el año de corte EXCLUSIVO:
      // "elimina registros cerrados ANTES de este año"
      const { datosPurgados, totalPurgados } = purgarDatos(datosRef.current, anioPurga + 1)
      addLog(`Mantenimiento: ${totalPurgados} registros compactados`, "ok")

      // Paso 3 — Persistir localmente
      actualizarDatos(datosPurgados)

      // Paso 4 — Sincronizar en la nube para que los tombstones viajen
      // y el remoto quede limpio también
      if (navigator.onLine) {
        if (tokenGuardadoDropbox()) {
          addLog("Mantenimiento: sincronizando Dropbox tras purga...")
          await sincronizarDropbox(datosPurgados, actualizarDatos, mergeDatos)
          addLog("Mantenimiento: Dropbox sincronizado OK", "ok")
        } else if (tokenGuardado()) {
          addLog("Mantenimiento: sincronizando Drive tras purga...")
          await sincronizar(datosPurgados, actualizarDatos)
          addLog("Mantenimiento: Drive sincronizado OK", "ok")
        }
      } else {
        addLog("Mantenimiento: sin conexión, sync pendiente para la próxima vez", "info")
      }

      // Paso 5 — Mostrar resultado
      setResultadoPurga(totalPurgados)
      setEstadoPurga("ok")
    } catch (e) {
      addLog(`Mantenimiento: error durante la purga: ${e?.message || JSON.stringify(e)}`, "error")
      setEstadoPurga("error")
    }
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  function textoEstado(estado, ultimaSync) {
    if (estado === "syncing") return "⏳ Sincronizando..."
    if (estado === "error") return "❌ Error — toca para reintentar"
    if (estado === "offline") return "📵 Sin conexión"
    if (estado === "ok" && ultimaSync) {
      const mins = Math.floor((new Date() - ultimaSync) / 60000)
      return mins === 0 ? "✅ Sincronizado ahora mismo" : `✅ Sincronizado hace ${mins} min`
    }
    return ""
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  function TarjetaSync({ titulo, conectado, estado, ultimaSync, onConectar, onDesconectar, onSync }) {
    const texto = textoEstado(estado, ultimaSync)
    return (
      <div style={estiloTarjeta}>
        <h2 style={estiloSubtitulo}>{titulo}</h2>
        {!conectado ? (
          <button onClick={onConectar} style={{ ...estiloBotonPrimario, width: "100%" }}>
            Conectar {titulo}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, color: COLORES.exito, fontSize: "14px", fontWeight: "600" }}>
              ✅ Conectado
            </p>
            {texto !== "" && (
              <p
                style={{ margin: 0, color: COLORES.textoSecundario, fontSize: "13px", cursor: estado === "error" ? "pointer" : "default" }}
                onClick={estado === "error" ? onSync : undefined}
              >
                {texto}
              </p>
            )}
            <button onClick={onSync} style={{ ...estiloBotonPrimario, width: "100%" }} disabled={estado === "syncing"}>
              🔄 Sincronizar ahora
            </button>
            <button onClick={onDesconectar} style={{ ...estiloBotonSecundario, width: "100%", color: COLORES.peligro, borderColor: COLORES.peligro }}>
              Desconectar cuenta
            </button>
          </div>
        )}
      </div>
    )
  }

  const nivelActual = datos?.config?.nivelSeguimiento || "avanzado"
  const paisActual  = datos?.config?.pais || "ES"
  const temaActual  = tema || "original"

  const NIVELES_OPCIONES = [
    { id: "basico", label: "🟢 Básico", items: "Ingresos · Egresos · Hacer pagos" },
    { id: "medio", label: "🟡 Medio", items: "Todo lo anterior + Crédito · Reposiciones · Gustos · Planes" },
    { id: "avanzado", label: "🔴 Avanzado", items: "Todo disponible" },
  ]

  const TEMAS_OPCIONES = [
    { id: "original",       label: "🌑 Original",        desc: "Oscuro · Púrpura · Tech"       },
    { id: "pink-white",     label: "🌸 Pink White",      desc: "Claro · Rosado · Suave"        },
    { id: "pink-dark",      label: "🌺 Pink Dark",       desc: "Oscuro · Rosado · Ciruela"     },
    { id: "estandar-dark",  label: "🌊 Estándar Dark",   desc: "Oscuro · Azul · Finanzas"      },
    { id: "estandar-white", label: "☀️ Estándar White",  desc: "Claro · Azul · Profesional"    },
  ]

  // Años disponibles para purgar: desde 3 años atrás hasta el año anterior
  // (nunca se permite purgar el año en curso, porque puede tener registros activos)
  const aniosDisponibles = Array.from(
    { length: Math.max(1, anioActual - (anioActual - 3)) },
    (_, i) => anioActual - 1 - i
  )

  return (
    <div style={estiloPantalla}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ background: "none", border: "none", color: COLORES.primario, fontSize: "24px", cursor: "pointer", marginRight: "10px" }}>☰</button>
          <h1 style={estiloTitulo}>Ajustes</h1>
        </div>

        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

          {/* ── Nivel de seguimiento ── */}
          <div style={estiloTarjeta}>
            <h2 style={estiloSubtitulo}>📊 Nivel de seguimiento</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {NIVELES_OPCIONES.map(({ id, label, items }) => {
                const activo = nivelActual === id
                return (
                  <button
                    key={id}
                    onClick={() => cambiarNivel(id)}
                    style={{
                      ...(activo ? estiloBotonOpcionActivo : estiloBotonOpcion),
                      display: "flex", flexDirection: "column", gap: "3px", textAlign: "left"
                    }}
                  >
                    <span style={{ color: activo ? COLORES.primario : COLORES.texto, fontWeight: "700", fontSize: "14px" }}>
                      {label}
                    </span>
                    <span style={{ color: activo ? COLORES.primarioOscuro : COLORES.textoSecundario, fontSize: "12px" }}>
                      {items}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── País / Moneda ── */}
          <div style={estiloTarjeta}>
            <h2 style={estiloSubtitulo}>🌍 País y moneda</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { codigo: "ES", label: "🇪🇸 España",    simbolo: "€" },
                { codigo: "AR", label: "🇦🇷 Argentina", simbolo: "$" },
              ].map(({ codigo, label, simbolo }) => {
                const activo = paisActual === codigo
                return (
                  <button
                    key={codigo}
                    onClick={() => cambiarPais(codigo)}
                    style={{
                      ...(activo ? estiloBotonOpcionActivo : estiloBotonOpcion),
                      display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}
                  >
                    <span style={{ color: activo ? COLORES.primario : COLORES.texto, fontWeight: "600", fontSize: "15px" }}>
                      {label}
                    </span>
                    <span style={{ color: activo ? COLORES.primario : COLORES.textoSecundario, fontSize: "20px", fontWeight: "700" }}>
                      {simbolo}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Tema visual ── */}
          <div style={estiloTarjeta}>
            <h2 style={estiloSubtitulo}>🎨 Tema visual</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TEMAS_OPCIONES.map(({ id, label, desc }) => {
                const activo = temaActual === id
                return (
                  <button
                    key={id}
                    onClick={() => cambiarTema(id)}
                    style={{
                      ...(activo ? estiloBotonOpcionActivo : estiloBotonOpcion),
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                      <span style={{ color: activo ? COLORES.primario : COLORES.texto, fontWeight: "700", fontSize: "14px" }}>
                        {label}
                      </span>
                      <span style={{ color: activo ? COLORES.primarioOscuro : COLORES.textoSecundario, fontSize: "12px" }}>
                        {desc}
                      </span>
                    </div>
                    <span style={{
                      width: "18px", height: "18px", borderRadius: "50%",
                      border: `2px solid ${activo ? COLORES.primario : COLORES.borde}`,
                      backgroundColor: activo ? COLORES.primario : "transparent",
                      flexShrink: 0,
                    }} />
                  </button>
                )
              })}
            </div>
          </div>

          <TarjetaSync
            titulo="☁️ Google Drive"
            conectado={driveConectado}
            estado={driveEstado}
            ultimaSync={driveUltimaSync}
            onConectar={conectarDrive}
            onDesconectar={desconectarDrive}
            onSync={hacerSyncDrive}
          />

          <TarjetaSync
            titulo="📦 Dropbox"
            conectado={dropboxConectado}
            estado={dropboxEstado}
            ultimaSync={dropboxUltimaSync}
            onConectar={conectarDropbox}
            onDesconectar={desconectarDropbox}
            onSync={hacerSyncDropbox}
          />

          <div style={estiloTarjeta}>
            <h2 style={estiloSubtitulo}>Copia de seguridad local</h2>
            <Backup />
          </div>

          {/* ── Mantenimiento ── */}
          {/* Esta tarjeta permite purgar registros históricos de años anteriores.
              La purga convierte los registros elegibles en tombstones durante el
              merge con la nube, y luego los elimina del resultado final.
              Siempre exporta un backup antes de ejecutar. */}
          <div style={estiloTarjeta}>
            <h2 style={estiloSubtitulo}>🗑️ Mantenimiento</h2>

            <p style={{ margin: "0 0 16px", fontSize: "13px", color: COLORES.textoSecundario, lineHeight: "1.5" }}>
              Elimina registros históricos cerrados del año seleccionado para reducir
              el tamaño de la base de datos. Se exporta un backup automáticamente antes
              de ejecutar.
            </p>

            {/* Selector de año a purgar */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "600", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Cerrar año
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {aniosDisponibles.map(anio => {
                  const activo = anioPurga === anio
                  return (
                    <button
                      key={anio}
                      onClick={() => {
                        setAnioPurga(anio)
                        // Resetear estado si el usuario cambia el año después de una purga
                        if (estadoPurga !== "purgando") {
                          setEstadoPurga("idle")
                          setResultadoPurga(null)
                        }
                      }}
                      disabled={estadoPurga === "purgando"}
                      style={{
                        ...(activo ? estiloBotonOpcionActivo : estiloBotonOpcion),
                        flex: "none",
                        padding: "10px 18px",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      {anio}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Qué se va a purgar — texto informativo */}
            <div style={{
              fontSize: "12px",
              color: COLORES.textoMuted,
              backgroundColor: COLORES.fondoFondo,
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "16px",
              lineHeight: "1.6",
            }}>
              Se eliminarán los registros <strong style={{ color: COLORES.textoSecundario }}>cerrados antes de {anioPurga + 1}</strong>:
              salarios · variaciones · egresos · ajustes · inversiones.
              <br />
              Nunca se tocan: cuentas de inversión · planes · ubicaciones.
            </div>

            {/* Resultado de la última purga */}
            {estadoPurga === "ok" && resultadoPurga !== null && (
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: COLORES.exito, fontWeight: "600" }}>
                ✅ {resultadoPurga} registros eliminados correctamente.
              </p>
            )}
            {estadoPurga === "error" && (
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: COLORES.peligro }}>
                ❌ Error durante la purga. Revisa los logs.
              </p>
            )}

            {/* Botones de acción */}
            {estadoPurga !== "confirmando" ? (
              <button
                onClick={() => setEstadoPurga("confirmando")}
                disabled={estadoPurga === "purgando"}
                style={{
                  ...estiloBotonSecundario,
                  width: "100%",
                  color: COLORES.advertencia,
                  borderColor: COLORES.advertencia,
                  opacity: estadoPurga === "purgando" ? 0.6 : 1,
                }}
              >
                {estadoPurga === "purgando" ? "⏳ Purgando..." : `🗑️ Purgar año ${anioPurga}`}
              </button>
            ) : (
              // Paso de confirmación — evita ejecuciones accidentales
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: COLORES.advertencia, fontWeight: "600", textAlign: "center" }}>
                  ⚠️ Se exportará un backup y se eliminarán los registros. ¿Continuar?
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={ejecutarPurga}
                    style={{
                      ...estiloBotonPrimario,
                      flex: 1,
                      backgroundColor: COLORES.advertencia,
                      color: "#000",
                    }}
                  >
                    Sí, purgar
                  </button>
                  <button
                    onClick={() => setEstadoPurga("idle")}
                    style={{ ...estiloBotonSecundario, flex: 1 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        <div style={{ ...estiloTarjeta, marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ ...estiloSubtitulo, margin: 0 }}>🔍 Logs</h2>
            <button onClick={() => setLogMessages([])} style={{ background: "none", border: `1px solid ${COLORES.borde}`, color: COLORES.textoSecundario, fontSize: "12px", padding: "4px 10px", borderRadius: "6px", cursor: "pointer" }}>Limpiar</button>
          </div>
          <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
            {logMessages.length === 0 ? (
              <p style={{ margin: 0, fontSize: "12px", color: COLORES.textoSecundario, fontStyle: "italic" }}>Sin logs aún...</p>
            ) : (
              logMessages.map((log, i) => (
                <p key={i} style={{
                  margin: 0, fontSize: "12px", fontFamily: "monospace", lineHeight: "1.5",
                  color: log.tipo === "error" ? COLORES.peligro : log.tipo === "ok" ? COLORES.exito : COLORES.textoSecundario
                }}>
                  {log.texto}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}