import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import { NOMBRES_MESES } from "../services/formateo"
import { 
  COLORES, 
  estiloPantalla, 
  estiloHeader, 
  estiloTitulo, 
  estiloSubtitulo, 
  estiloTarjeta, 
  estiloBotonPrimario, 
  estiloBotonSecundario, 
  estiloInput, 
  estiloLabel, 
  estiloPopupOverlay,
  estiloPopup,
  estiloTabla, 
  estiloTh, 
  estiloTd, 
  estiloBotonOpcion, 
  estiloBotonOpcionActivo 
} from "../theme"

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const SIMBOLO = { ES: "€", AR: "$" }

// ── HELPERS DE CÁLCULO ────────────────────────────────────────────────────────

function calcularDietz(montoInicial, montoFinal, aportaciones, anio, mes) {
  // Si no hay monto inicial o final, no hay rendimiento calculable
  if (!montoInicial || montoInicial === 0 || montoFinal === null || montoFinal === undefined || montoFinal === "") return null
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

function calcularNeto(bruto, inflacion) {
  if (bruto === null || inflacion === null || inflacion === undefined) return null
  return (1 + bruto) / (1 + inflacion) - 1
}

function calcularAnual(rendimientosMensuales) {
  const validos = rendimientosMensuales.filter(r => r !== null)
  if (!validos.length) return null
  return validos.reduce((acc, r) => acc * (1 + r), 1) - 1
}

function fmtPct(n) {
  if (n === null || n === undefined) return "—"
  return (n * 100).toFixed(2) + "%"
}

function colorPct(n) {
  if (n === null || n === undefined) return COLORES.textoSecundario
  return n >= 0 ? COLORES.positivo : COLORES.peligro
}

// ── API INFLACIÓN ─────────────────────────────────────────────────────────────

async function fetchInflacionES(anio, mes) {
  const urlCache = `https://servicios.ine.es/wstempus/jsCache/ES/DATOS_SERIE/IPC206449?nult=36`
  const urlProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/IPC206449?nult=36`)}`

  for (const url of [urlCache, urlProxy]) {
    try {
      const r = await fetch(url)
      if (!r.ok) continue
      const json = await r.json()
      const datos = Array.isArray(json) ? json : (json.Data || [])
      const entrada = datos.find(d => d.Anyo === anio && d.FK_Periodo === mes)
      if (entrada) return { valor: entrada.Valor / 100, razon: null }
    } catch { continue }
  }
  return { valor: null, razon: "no_publicado" }
}

async function fetchInflacionAR(anio, mes) {
  const indecUrl = `https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=36&format=json`
  const urlProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(indecUrl)}`

  for (const url of [indecUrl, urlProxy]) {
    try {
      const r = await fetch(url)
      if (!r.ok) continue
      const json = await r.json()
      const series = json.data || []
      const clave = `${anio}-${String(mes).padStart(2, "0")}`
      const fila = series.find(d => d[0] === clave)
      if (fila && fila[1] !== null) return { valor: fila[1] / 100, razon: null }
      if (fila && fila[1] === null) return { valor: null, razon: "no_publicado" }
    } catch { continue }
  }
  return { valor: null, razon: "no_publicado" }
}

async function fetchInflacion(pais, anio, mes) {
  if (pais === "AR") return fetchInflacionAR(anio, mes)
  return fetchInflacionES(anio, mes)
}

// ── HELPERS DB ────────────────────────────────────────────────────────────────

function getCuentas(datos) {
  return (datos.cuentasInversion || []).filter(c => !c.eliminado)
}

function getRegistros(datos, cuentaId, anio) {
  return (datos.inversiones || []).filter(
    r => !r.eliminado && r.cuentaId === cuentaId && r.anio === anio
  ).sort((a, b) => a.mes - b.mes)
}

function getAnios(datos) {
  // Solo incluir años que tengan registros reales; agregar año actual solo si no hay ningún año
  const set = new Set(
    (datos.inversiones || [])
      .filter(r => !r.eliminado && r.cuentaId !== undefined)
      .map(r => r.anio)
  )
  if (set.size === 0) set.add(new Date().getFullYear())
  return [...set].sort((a, b) => b - a)
}

function nuevoId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function Rendimientos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, actualizarDatos, fmt } = useDatos()

  const pais = datos?.config?.pais || "ES"
  const simbolo = SIMBOLO[pais] || "€"

  // Estado UI
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear())
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null)
  const [modal, setModal] = useState(null)
  const [cargandoInflacion, setCargandoInflacion] = useState(false)

  const cuentas = getCuentas(datos)
  const anios = getAnios(datos)

  useEffect(() => {
    if (!cuentaSeleccionada && cuentas.length > 0) {
      setCuentaSeleccionada(cuentas[0].id)
    }
  }, [cuentas.length, cuentaSeleccionada])

  const registros = cuentaSeleccionada ? getRegistros(datos, cuentaSeleccionada, anioSeleccionado) : []

  const registrosCalculados = registros.map(r => {
    const bruto = calcularDietz(r.montoInicial, r.montoFinal, r.aportaciones, r.anio, r.mes)
    const neto = calcularNeto(bruto, r.inflacion)
    return { ...r, bruto, neto }
  })

  // Solo incluir meses con rendimiento calculado para el acumulado anual
  const rendimientoAnual = calcularAnual(registrosCalculados.map(r => r.bruto))
  const rendimientoAnualNeto = registrosCalculados.every(r => r.inflacion !== null && r.inflacion !== undefined)
    && registrosCalculados.length > 0
    ? calcularAnual(registrosCalculados.map(r => r.neto))
    : null

  // ── ACCIONES ────────────────────────────────────────────────────────────────

  function guardarCuenta(nombre, cuentaId = null) {
    const ahora = new Date().toISOString()
    let nuevasCuentas
    if (cuentaId) {
      nuevasCuentas = (datos.cuentasInversion || []).map(c => c.id === cuentaId ? { ...c, nombre, actualizadoEn: ahora } : c)
    } else {
      const nueva = { id: nuevoId(), nombre, eliminado: false, creadoEn: ahora, actualizadoEn: ahora }
      nuevasCuentas = [...(datos.cuentasInversion || []), nueva]
      setTimeout(() => setCuentaSeleccionada(nueva.id), 0)
    }
    actualizarDatos({ ...datos, cuentasInversion: nuevasCuentas })
    setModal(null)
  }

  function eliminarCuenta(cuentaId) {
    const ahora = new Date().toISOString()
    const nuevasCuentas = (datos.cuentasInversion || []).map(c => c.id === cuentaId ? { ...c, eliminado: true, actualizadoEn: ahora } : c)
    const nuevasInversiones = (datos.inversiones || []).map(r => r.cuentaId === cuentaId ? { ...r, eliminado: true, actualizadoEn: ahora } : r)
    actualizarDatos({ ...datos, cuentasInversion: nuevasCuentas, inversiones: nuevasInversiones })
    if (cuentaSeleccionada === cuentaId) setCuentaSeleccionada(null)
    setModal(null)
  }

  function guardarMes(form) {
    const ahora = new Date().toISOString()
    let nuevasInversiones
    if (form.registroId) {
      nuevasInversiones = (datos.inversiones || []).map(r => r.id === form.registroId
        ? { ...r, montoInicial: form.montoInicial, montoFinal: form.montoFinal, inflacion: form.inflacion, actualizadoEn: ahora }
        : r
      )
    } else {
      const nuevo = {
        id: nuevoId(), cuentaId: cuentaSeleccionada, mes: form.mes, anio: form.anio,
        montoInicial: form.montoInicial,
        // montoFinal puede ser null si no se ingresó aún
        montoFinal: form.montoFinal,
        aportaciones: [], inflacion: form.inflacion, eliminado: false, creadoEn: ahora, actualizadoEn: ahora,
      }
      nuevasInversiones = [...(datos.inversiones || []), nuevo]
    }
    actualizarDatos({ ...datos, inversiones: nuevasInversiones })
    setModal(null)
  }

  function eliminarMes(registroId) {
    const ahora = new Date().toISOString()
    const nuevasInversiones = (datos.inversiones || []).map(r => r.id === registroId ? { ...r, eliminado: true, actualizadoEn: ahora } : r)
    actualizarDatos({ ...datos, inversiones: nuevasInversiones })
    setModal(null)
  }

  function guardarAportacion(registroId, aportacion) {
    const ahora = new Date().toISOString()
    const nuevasInversiones = (datos.inversiones || []).map(r => {
      if (r.id !== registroId) return r
      const nuevasAp = [...(r.aportaciones || []), { ...aportacion, id: nuevoId() }]
      return { ...r, aportaciones: nuevasAp, actualizadoEn: ahora }
    })
    actualizarDatos({ ...datos, inversiones: nuevasInversiones })
    setModal(null)
  }

  function eliminarAportacion(registroId, apId) {
    const ahora = new Date().toISOString()
    const nuevasInversiones = (datos.inversiones || []).map(r => {
      if (r.id !== registroId) return r
      const nuevasAp = (r.aportaciones || []).filter(a => a.id !== apId)
      return { ...r, aportaciones: nuevasAp, actualizadoEn: ahora }
    })
    actualizarDatos({ ...datos, inversiones: nuevasInversiones })
  }

  function borrarAnio() {
    const ahora = new Date().toISOString()
    const nuevasInversiones = (datos.inversiones || []).map(r =>
      r.cuentaId === cuentaSeleccionada && r.anio === anioSeleccionado ? { ...r, eliminado: true, actualizadoEn: ahora } : r
    )
    actualizarDatos({ ...datos, inversiones: nuevasInversiones })
    setModal(null)
  }

  function exportarAnio() {
    const registrosAnio = (datos.inversiones || []).filter(r => !r.eliminado && r.cuentaId === cuentaSeleccionada && r.anio === anioSeleccionado)
    const cuenta = cuentas.find(c => c.id === cuentaSeleccionada)
    const payload = { cuenta: cuenta?.nombre || "cuenta", anio: anioSeleccionado, pais, registros: registrosAnio, exportadoEn: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inversiones-${cuenta?.nombre || "cuenta"}-${anioSeleccionado}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function cargarInflacionAutomatica(registroId, anio, mes) {
    setCargandoInflacion(true)
    try {
      const { valor, razon } = await fetchInflacion(pais, anio, mes)
      if (valor !== null) {
        const ahora = new Date().toISOString()
        const nuevasInversiones = (datos.inversiones || []).map(r => r.id === registroId ? { ...r, inflacion: valor, actualizadoEn: ahora } : r)
        actualizarDatos({ ...datos, inversiones: nuevasInversiones })
      } else if (razon === "no_publicado") {
        const fuente = pais === "AR" ? "INDEC" : "INE"
        alert(`El dato de inflación de ${NOMBRES_MESES[mes - 1]} ${anio} todavía no fue publicado por el ${fuente}.`)
      } else {
        alert("No se pudo conectar con la API. Verificá tu conexión o ingresá la inflación manualmente.")
      }
    } finally {
      setCargandoInflacion(false)
    }
  }

  const cuentaActual = cuentas.find(c => c.id === cuentaSeleccionada)

  return (
    <div style={estiloPantalla}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes popupIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .tarjeta-vacia:hover { border-color: ${COLORES.primario} !important; cursor: pointer; }
      `}</style>

      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={estiloHeader}>
        <button onClick={() => setMenuAbierto(true)} style={{ background: "none", border: "none", color: COLORES.primario, fontSize: "24px", cursor: "pointer", marginRight: "10px" }}>☰</button>
        <h1 style={estiloTitulo}>📈 Rendimientos</h1>
        <button onClick={() => setModal({ tipo: "cuenta" })} style={{ background: "none", border: `1px solid ${COLORES.primario}`, color: COLORES.primario, borderRadius: "8px", width: "36px", height: "36px", cursor: "pointer" }} title="Nueva cuenta">＋</button>
      </div>

      {cuentas.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: "12px" }}>
          <div style={{ fontSize: "40px" }}>🏦</div>
          <p style={{ color: COLORES.textoSecundario, textAlign: "center" }}>No tenés cuentas de inversión todavía.</p>
          <button onClick={() => setModal({ tipo: "cuenta" })} style={estiloBotonPrimario}>+ Agregar cuenta</button>
        </div>
      )}

      {cuentas.length > 0 && (
        <>
          {/* Selector de cuentas */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {cuentas.map(c => (
              <button
                key={c.id}
                onClick={() => setCuentaSeleccionada(c.id)}
                style={cuentaSeleccionada === c.id ? estiloBotonOpcionActivo : estiloBotonOpcion}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          {/* Selector de años + acciones */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {anios.map(a => (
                <button
                  key={a}
                  onClick={() => setAnioSeleccionado(a)}
                  style={anioSeleccionado === a ? estiloBotonOpcionActivo : estiloBotonOpcion}
                >
                  {a}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={exportarAnio} style={{ background: "none", border: `1px solid ${COLORES.borde}`, color: COLORES.textoSecundario, fontSize: "12px", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }} title="Exportar año">⬇ JSON</button>
              <button onClick={() => setModal({ tipo: "confirmarBorrarAnio" })} style={{ background: "none", border: `1px solid ${COLORES.borde}`, color: COLORES.peligro, fontSize: "12px", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }} title="Borrar año">🗑</button>
            </div>
          </div>

          {/* Resumen anual */}
          {registrosCalculados.some(r => r.bruto !== null) && (
            <div style={{ ...estiloTarjeta, display: "flex", flexWrap: "wrap", padding: "16px 20px", marginBottom: "20px", gap: "0" }}>
              <div style={{ flex: "1 1 120px", display: "flex", flexDirection: "column", gap: "4px", padding: "4px 8px" }}>
                <span style={{ fontSize: "11px", color: COLORES.textoSecundario, textTransform: "uppercase" }}>Rendimiento anual bruto</span>
                <span style={{ fontSize: "20px", fontWeight: "700", color: colorPct(rendimientoAnual) }}>{fmtPct(rendimientoAnual)}</span>
              </div>
              <div style={{ width: "1px", backgroundColor: COLORES.borde, margin: "0 8px" }} />
              <div style={{ flex: "1 1 120px", display: "flex", flexDirection: "column", gap: "4px", padding: "4px 8px" }}>
                <span style={{ fontSize: "11px", color: COLORES.textoSecundario, textTransform: "uppercase" }}>Rendimiento anual neto</span>
                <span style={{ fontSize: "20px", fontWeight: "700", color: colorPct(rendimientoAnualNeto) }}>{rendimientoAnualNeto !== null ? fmtPct(rendimientoAnualNeto) : <span style={{ color: COLORES.textoMuted, fontSize: "14px" }}>Sin inflación</span>}</span>
              </div>
              <div style={{ width: "1px", backgroundColor: COLORES.borde, margin: "0 8px" }} />
              <div style={{ flex: "1 1 120px", display: "flex", flexDirection: "column", gap: "4px", padding: "4px 8px" }}>
                <span style={{ fontSize: "11px", color: COLORES.textoSecundario, textTransform: "uppercase" }}>Capital final</span>
                <span style={{ fontSize: "20px", fontWeight: "700", color: COLORES.textoBlanco }}>
                  {(() => {
                    const ultimo = [...registrosCalculados].reverse().find(r => r.montoFinal !== null && r.montoFinal !== undefined && r.montoFinal !== "")
                    return ultimo ? fmt(ultimo.montoFinal, pais, simbolo) : "—"
                  })()}
                </span>
              </div>
            </div>
          )}

          {/* Grid de meses */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px", marginBottom: "24px" }}>
            {NOMBRES_MESES.map((nombre, idx) => {
              const mesNum = idx + 1
              const reg = registrosCalculados.find(r => r.mes === mesNum)
              return (
                <TarjetaMes
                  key={mesNum}
                  mesNombre={nombre}
                  mesNum={mesNum}
                  anio={anioSeleccionado}
                  registro={reg || null}
                  fmt={fmt}
                  simbolo={simbolo}
                  pais={pais}
                  cargandoInflacion={cargandoInflacion}
                  onAgregar={() => setModal({ tipo: "mes", mes: mesNum, anio: anioSeleccionado, registro: null })}
                  onEditar={(r) => setModal({ tipo: "mes", mes: mesNum, anio: anioSeleccionado, registro: r })}
                  onEliminar={(id) => setModal({ tipo: "confirmarBorrarMes", registroId: id })}
                  onAgregarAportacion={(registroId) => setModal({ tipo: "aportacion", registroId })}
                  onEliminarAportacion={eliminarAportacion}
                  onCargarInflacion={cargarInflacionAutomatica}
                />
              )
            })}
          </div>

          {/* Tabla resumen */}
          {registrosCalculados.some(r => r.bruto !== null) && (
            <div style={{ marginTop: "24px" }}>
              <p style={estiloSubtitulo}>Resumen del año {anioSeleccionado}</p>
              <div style={{ overflowX: "auto" }}>
                <table style={estiloTabla}>
                  <thead>
                    <tr>
                      <th style={{ ...estiloTh, textAlign: "left" }}>Mes</th>
                      <th style={estiloTh}>Inicial</th>
                      <th style={estiloTh}>Final</th>
                      <th style={estiloTh}>Bruto</th>
                      <th style={estiloTh}>Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosCalculados.map((r, i) => (
                      <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? COLORES.fondoTarjeta : COLORES.fondoPanel }}>
                        <td style={{ ...estiloTd, textAlign: "left", fontWeight: "600", color: COLORES.textoBlanco }}>{NOMBRES_MESES[r.mes - 1]}</td>
                        <td style={{ ...estiloTd, color: COLORES.textoSecundario }}>{fmt(r.montoInicial, pais, simbolo)}</td>
                        <td style={{ ...estiloTd, color: COLORES.textoSecundario }}>{r.montoFinal !== null && r.montoFinal !== undefined && r.montoFinal !== "" ? fmt(r.montoFinal, pais, simbolo) : <span style={{ color: COLORES.textoMuted }}>—</span>}</td>
                        <td style={{ ...estiloTd, color: colorPct(r.bruto) }}>{fmtPct(r.bruto)}</td>
                        <td style={{ ...estiloTd, color: colorPct(r.neto) }}>{fmtPct(r.neto)}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: COLORES.primarioSuave, borderTop: `2px solid ${COLORES.primario}` }}>
                      <td style={{ ...estiloTd, textAlign: "left", color: COLORES.textoBlanco }}><strong>Total</strong></td>
                      <td style={estiloTd} colSpan={2} />
                      <td style={{ ...estiloTd, color: colorPct(rendimientoAnual) }}><strong>{fmtPct(rendimientoAnual)}</strong></td>
                      <td style={{ ...estiloTd, color: colorPct(rendimientoAnualNeto) }}><strong>{fmtPct(rendimientoAnualNeto)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {registros.length === 0 && cuentaActual && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: "12px" }}>
              <p style={{ color: COLORES.textoSecundario, textAlign: "center" }}>No hay datos para {cuentaActual.nombre} en {anioSeleccionado}.</p>
              <button onClick={() => setModal({ tipo: "mes", mes: new Date().getMonth() + 1, anio: anioSeleccionado, registro: null })} style={estiloBotonPrimario}>+ Agregar mes</button>
            </div>
          )}
        </>
      )}

      {/* Modales via portal */}
      {modal?.tipo === "cuenta" && <ModalCuenta cuentas={cuentas} onGuardar={guardarCuenta} onEliminar={eliminarCuenta} onCerrar={() => setModal(null)} />}
      {modal?.tipo === "mes" && <ModalMes mes={modal.mes} anio={modal.anio} registro={modal.registro} pais={pais} simbolo={simbolo} onGuardar={guardarMes} onCerrar={() => setModal(null)} />}
      {modal?.tipo === "aportacion" && <ModalAportacion registroId={modal.registroId} simbolo={simbolo} onGuardar={guardarAportacion} onCerrar={() => setModal(null)} />}
      {modal?.tipo === "confirmarBorrarAnio" && <ModalConfirmar titulo={`¿Borrar todos los datos de ${anioSeleccionado}?`} descripcion="Esta acción eliminará todos los registros del año. No se puede deshacer." onConfirmar={borrarAnio} onCancelar={() => setModal(null)} />}
      {modal?.tipo === "confirmarBorrarMes" && <ModalConfirmar titulo="¿Borrar este mes?" descripcion="Se eliminará el registro del mes. No se puede deshacer." onConfirmar={() => eliminarMes(modal.registroId)} onCancelar={() => setModal(null)} />}
    </div>
  )
}

// ── TARJETA MES ───────────────────────────────────────────────────────────────
// Ya no tiene estado expandido; los botones abren popups directamente.

function TarjetaMes({ mesNombre, mesNum, anio, registro, fmt, simbolo, pais, cargandoInflacion, onAgregar, onEditar, onEliminar, onAgregarAportacion, onEliminarAportacion, onCargarInflacion }) {

  if (!registro) {
    return (
      <div
        style={{ ...estiloTarjeta, cursor: "pointer", padding: "14px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}
        onClick={onAgregar}
        className="tarjeta-vacia"
      >
        <div style={{ fontSize: "12px", color: COLORES.textoSecundario, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{mesNombre}</div>
        <div style={{ color: COLORES.textoMuted, fontSize: "20px" }}>＋</div>
      </div>
    )
  }

  const bruto = calcularDietz(registro.montoInicial, registro.montoFinal, registro.aportaciones, anio, mesNum)
  const neto = calcularNeto(bruto, registro.inflacion)
  const tieneMontoFinal = registro.montoFinal !== null && registro.montoFinal !== undefined && registro.montoFinal !== ""
  const totalAportaciones = (registro.aportaciones || []).reduce((s, a) => s + a.monto, 0)

  return (
    <div style={{ ...estiloTarjeta, border: `1px solid ${COLORES.primario}`, padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ fontSize: "12px", color: COLORES.textoSecundario, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{mesNombre}</div>

      {tieneMontoFinal ? (
        <>
          <div style={{ fontSize: "18px", fontWeight: "700", color: colorPct(bruto) }}>{fmtPct(bruto)}</div>
          <div style={{ fontSize: "13px", color: COLORES.textoSecundario }}>{fmt(registro.montoFinal, pais, simbolo)}</div>
          {registro.inflacion !== null && registro.inflacion !== undefined && (
            <div style={{ fontSize: "11px", color: colorPct(neto) }}>Neto: {fmtPct(neto)}</div>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: "13px", color: COLORES.textoSecundario }}>Inicio: {fmt(registro.montoInicial, pais, simbolo)}</div>
          <div style={{ fontSize: "11px", color: COLORES.textoMuted, fontStyle: "italic" }}>Sin monto final</div>
        </>
      )}

      {totalAportaciones > 0 && (
        <div style={{ fontSize: "11px", color: COLORES.primario }}>+{fmt(totalAportaciones, pais, simbolo)} aport.</div>
      )}

      {/* Acciones inline */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
        <button
          onClick={() => onCargarInflacion(registro.id, anio, mesNum)}
          disabled={cargandoInflacion}
          style={{ background: "transparent", border: `1px solid ${COLORES.borde}`, color: COLORES.textoSecundario, fontSize: "11px", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" }}
          title="Cargar inflación automática"
        >
          {cargandoInflacion ? "⏳" : "📡"}
        </button>
        <button
          onClick={() => onAgregarAportacion(registro.id)}
          style={{ background: "transparent", border: `1px solid ${COLORES.borde}`, color: COLORES.textoSecundario, fontSize: "11px", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" }}
          title="Agregar aportación"
        >
          + Aport.
        </button>
        <button
          onClick={() => onEditar(registro)}
          style={{ background: "transparent", border: `1px solid ${COLORES.borde}`, color: COLORES.textoSecundario, fontSize: "11px", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" }}
        >
          ✏️
        </button>
        <button
          onClick={() => onEliminar(registro.id)}
          style={{ background: "transparent", border: `1px solid ${COLORES.borde}`, color: COLORES.peligro, fontSize: "11px", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" }}
        >
          🗑
        </button>
      </div>
    </div>
  )
}

// ── MODAL BASE (portal centrado) ──────────────────────────────────────────────

function ModalBase({ titulo, onCerrar, children }) {
  return createPortal(
    <div style={{ ...estiloPopupOverlay, animation: "fadeIn 0.2s ease" }} onClick={onCerrar}>
      <div style={{ ...estiloPopup, animation: "popupIn 0.25s cubic-bezier(0.32,0.72,0,1)" }} onClick={e => e.stopPropagation()}>
        {/* Header del popup */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: `1px solid ${COLORES.borde}`, flexShrink: 0 }}>
          <span style={{ fontSize: "17px", fontWeight: "700", color: COLORES.textoBlanco }}>{titulo}</span>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: COLORES.textoSecundario, lineHeight: 1 }}>✕</button>
        </div>
        {/* Contenido scrollable */}
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 20px 28px" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── MODALES ───────────────────────────────────────────────────────────────────

function ModalCuenta({ cuentas, onGuardar, onEliminar, onCerrar }) {
  const [nombre, setNombre] = useState("")
  const [editando, setEditando] = useState(null)

  function handleGuardar() {
    if (!nombre.trim()) return
    onGuardar(nombre.trim(), editando)
    setNombre("")
    setEditando(null)
  }

  return (
    <ModalBase titulo="Cuentas de inversión" onCerrar={onCerrar}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          style={{ ...estiloInput, flex: 1, marginBottom: 0 }}
          placeholder="Nombre de la cuenta"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGuardar()}
          autoFocus
        />
        <button onClick={handleGuardar} style={{ ...estiloBotonPrimario, width: "auto", padding: "0 16px" }}>
          {editando ? "Guardar" : "＋"}
        </button>
      </div>
      {cuentas.map(c => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORES.borde}` }}>
          <span style={{ color: COLORES.textoBlanco }}>{c.nombre}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => { setEditando(c.id); setNombre(c.nombre) }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORES.acento }}>✏️</button>
            <button onClick={() => onEliminar(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORES.peligro }}>🗑</button>
          </div>
        </div>
      ))}
    </ModalBase>
  )
}

function ModalMes({ mes, anio, registro, pais, simbolo, onGuardar, onCerrar }) {
  const [montoInicial, setMontoInicial] = useState(registro?.montoInicial ?? "")
  // montoFinal es opcional: puede quedar vacío si el mes no terminó
  const [montoFinal, setMontoFinal] = useState(
    registro?.montoFinal !== null && registro?.montoFinal !== undefined && registro?.montoFinal !== ""
      ? registro.montoFinal
      : ""
  )
  const [inflacion, setInflacion] = useState(
    registro?.inflacion !== null && registro?.inflacion !== undefined
      ? (registro.inflacion * 100).toFixed(4)
      : ""
  )

  function handleGuardar() {
    const ini = parseFloat(String(montoInicial).replace(",", "."))
    if (isNaN(ini)) return
    // montoFinal puede ser null si no se ingresó
    const fin = montoFinal !== "" ? parseFloat(String(montoFinal).replace(",", ".")) : null
    if (montoFinal !== "" && isNaN(fin)) return
    const infl = inflacion !== "" ? parseFloat(String(inflacion).replace(",", ".")) / 100 : null
    onGuardar({ mes, anio, montoInicial: ini, montoFinal: fin, inflacion: infl, registroId: registro?.id ?? null })
  }

  return (
    <ModalBase titulo={`${NOMBRES_MESES[mes - 1]} ${anio}`} onCerrar={onCerrar}>
      <label style={estiloLabel}>Monto inicial ({simbolo}) *</label>
      <input style={estiloInput} type="number" placeholder="0.00" value={montoInicial} onChange={e => setMontoInicial(e.target.value)} autoFocus />

      <label style={estiloLabel}>Monto final ({simbolo}) — opcional si el mes no terminó</label>
      <input style={estiloInput} type="number" placeholder="0.00" value={montoFinal} onChange={e => setMontoFinal(e.target.value)} />

      <label style={estiloLabel}>Inflación mensual (%) — opcional</label>
      <input style={estiloInput} type="number" placeholder={pais === "AR" ? "ej: 4.2" : "ej: 0.38"} value={inflacion} onChange={e => setInflacion(e.target.value)} />

      <button onClick={handleGuardar} style={estiloBotonPrimario}>Guardar</button>
    </ModalBase>
  )
}

function ModalAportacion({ registroId, simbolo, onGuardar, onCerrar }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [monto, setMonto] = useState("")

  function handleGuardar() {
    const m = parseFloat(String(monto).replace(",", "."))
    if (isNaN(m) || !fecha) return
    onGuardar(registroId, { fecha, monto: m })
  }

  return (
    <ModalBase titulo="Nueva aportación" onCerrar={onCerrar}>
      <label style={estiloLabel}>Fecha</label>
      <input style={estiloInput} type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      <label style={estiloLabel}>Monto ({simbolo})</label>
      <input style={estiloInput} type="number" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value)} autoFocus />
      <button onClick={handleGuardar} style={estiloBotonPrimario}>Agregar</button>
    </ModalBase>
  )
}

function ModalConfirmar({ titulo, descripcion, onConfirmar, onCancelar }) {
  return (
    <ModalBase titulo={titulo} onCerrar={onCancelar}>
      <p style={{ color: COLORES.textoSecundario, marginBottom: "20px", lineHeight: "1.5" }}>{descripcion}</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onCancelar} style={{ ...estiloBotonSecundario, flex: 1 }}>Cancelar</button>
        <button onClick={onConfirmar} style={{ ...estiloBotonPrimario, backgroundColor: COLORES.peligro }}>Confirmar</button>
      </div>
    </ModalBase>
  )
}