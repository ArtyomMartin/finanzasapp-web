//Gustos.jsx

import { useState } from "react"
// CAMBIO: importar createPortal para escapar del stacking context del backdropFilter
import { createPortal } from "react-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import FilaEliminable from "../components/FilaEliminable"
import { calcularMes, proximosMeses, ajustesActivosEnMes } from "../services/calculos"
import { NOMBRES_MESES } from "../services/formateo"
// CAMBIO: estiloOverlay y estiloBottomSheet reemplazados por estiloPopupOverlay y estiloPopup
import { COLORES, estiloPantalla, estiloHeader, estiloTitulo, estiloBotonIcono, estiloPopupOverlay, estiloPopup, estiloTarjeta, estiloSubtitulo, estiloLabel } from "../theme"

export default function Gustos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, actualizarDatos, usuarioActivo, fmt } = useDatos()
  const [mesDetalle, setMesDetalle] = useState(null)

  const { ajustes } = datos
  const usuarioId = usuarioActivo

  const hoy = new Date()
  const mesActual = [{ mes: hoy.getMonth() + 1, anio: hoy.getFullYear() }]
  const allMeses = [...mesActual, ...proximosMeses(23)]
  const meses12 = allMeses.slice(0, 12)
  const mesesExtra = allMeses.slice(12)

  const filas = meses12.map(({ mes, anio }) => {
    const { netoProvisorio, gastos, netoFinal } = calcularMes(datos, usuarioId, mes, anio)
    return { mes, anio, netoProvisorio, gastos, netoFinal }
  })

  const detalleData = mesDetalle
    ? calcularMes(datos, usuarioId, mesDetalle.mes, mesDetalle.anio)
    : null

  function ajsActivos(mesN, anioN) {
    return ajustesActivosEnMes(ajustes, usuarioId, mesN, anioN)
  }

  function eliminarAjuste(id) {
    actualizarDatos({ ...datos, ajustes: datos.ajustes.map(a =>
      a.id === id ? { ...a, eliminado: true, actualizadoEn: new Date().toISOString() } : a
    )})
  }

  const mesN   = mesDetalle?.mes
  const anioN  = mesDetalle?.anio
  const ajs        = mesDetalle ? ajsActivos(mesN, anioN) : []
  const ajsFondo   = ajs.filter(a => a.tipo === "fondo")
  const ajsCredito = ajs.filter(a => a.tipo === "credito")
  const sinGastos  = ajsFondo.length === 0 && ajsCredito.length === 0

  return (
    <div style={estiloPantalla}>

      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonIcono, fontSize: "24px", marginRight: "10px" }}>☰</button>
          <h1 style={estiloTitulo}>Neto de cada mes</h1>
        </div>

        <p style={{...estiloSubtitulo, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px"}}>Próximos 12 meses</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filas.map((item, i) => (
            <button key={i} onClick={() => setMesDetalle({ mes: item.mes, anio: item.anio })} style={{ ...estiloTarjeta, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", gap: "12px", border: "none", textAlign: "inherit" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap", background: "rgba(124, 92, 255, 0.2)", color: COLORES?.primario || "#A48BFF" }}>
                  {NOMBRES_MESES[item.mes - 1].slice(0, 3)}
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: COLORES?.texto || "#FFFFFF" }}>{NOMBRES_MESES[item.mes - 1]}</div>
                  <div style={{ fontSize: "12px", color: COLORES?.textoMuted || "#8A93A3", marginTop: "2px" }}>{item.anio}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: item.netoFinal >= 0 ? (COLORES?.info || "#4DA3FF") : (COLORES?.error || "#FF5C5C") }}>
                  {fmt(item.netoFinal)}
                </div>
                <div style={{ fontSize: "12px", color: COLORES?.textoMuted || "#8A93A3", marginTop: "2px" }}>Ver detalle ›</div>
              </div>
            </button>
          ))}
        </div>

        <p style={{ ...estiloSubtitulo, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "24px", marginBottom: "12px" }}>Meses futuros</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {mesesExtra.map(({ mes, anio }, i) => (
            <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 14px", background: COLORES?.superficie || "rgba(28, 33, 40, 0.70)", border: `1px solid ${COLORES?.borde || "rgba(44,52,64,0.8)"}`, borderRadius: "10px", cursor: "pointer", minWidth: "65px", color: "inherit" }} onClick={() => setMesDetalle({ mes, anio })}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: COLORES?.info || "#4DA3FF" }}>{NOMBRES_MESES[mes - 1].slice(0, 3)}</span>
              <span style={{ fontSize: "11px", color: COLORES?.textoMuted || "#8A93A3", marginTop: "2px" }}>{anio}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CAMBIO: createPortal renderiza el popup directo en document.body,
          escapando del backdropFilter del contenedor padre que rompía el position:fixed.
          Reemplaza el bottom sheet anterior. Usar este mismo patrón en otras pantallas. */}
      {mesDetalle && createPortal(
        <div style={{ ...estiloPopupOverlay, animation: "fadeIn 0.2s ease" }} onClick={() => setMesDetalle(null)}>
          <div style={{ ...estiloPopup, animation: "popupIn 0.25s cubic-bezier(0.32,0.72,0,1)" }} onClick={e => e.stopPropagation()}>

            {/* Header del popup */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: COLORES?.texto || "#FFFFFF" }}>
                {NOMBRES_MESES[mesN - 1]} {anioN}
              </h2>
              <button
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: COLORES?.textoMuted || "#8A93A3" }}
                onClick={() => setMesDetalle(null)}
              >✕</button>
            </div>

            {/* Contenido scrollable */}
            <div style={{ overflowY: "auto", paddingBottom: "24px" }}>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={estiloLabel}>Antes de ahorro o credito</span>
                <span style={{ fontSize: "22px", fontWeight: "700", color: COLORES?.exito || "#3DDC97" }}>{fmt(detalleData.netoProvisorio)}</span>
              </div>

              <div style={{ height: "1px", backgroundColor: COLORES?.borde || "rgba(44,52,64,0.8)", margin: "0 20px" }} />

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={estiloLabel}>Ahorro y pagos con cretido personal</span>
                {ajsFondo.map(a => (
                  <FilaEliminable key={a.id} onEliminar={() => eliminarAjuste(a.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "4px 0" }}>
                      <span style={{ fontSize: "15px", color: COLORES?.texto || "#FFFFFF" }}>{a.nombre}</span>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: COLORES?.advertencia || "#FF9F43" }}>- {fmt(a.forma === "cuotas" ? a.montoCuota : a.montoTotal)}</span>
                    </div>
                  </FilaEliminable>
                ))}
                {ajsCredito.map(a => (
                  <FilaEliminable key={a.id} onEliminar={() => eliminarAjuste(a.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "4px 0" }}>
                      <span style={{ fontSize: "15px", color: COLORES?.texto || "#FFFFFF" }}>{a.nombre}</span>
                      <span style={{ fontSize: "15px", fontWeight: "600", color: COLORES?.error || "#FF5C5C" }}>- {fmt(a.forma === "cuotas" ? a.montoCuota : a.montoTotal)}</span>
                    </div>
                  </FilaEliminable>
                ))}
                {sinGastos && (
                  <p style={{ color: COLORES?.textoMuted || "#8A93A3", fontSize: "14px", textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>
                    Sin gastos registrados
                  </p>
                )}
              </div>

              <div style={{ height: "1px", backgroundColor: COLORES?.borde || "rgba(44,52,64,0.8)", margin: "0 20px" }} />

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={estiloLabel}>Neto final disponible</span>
                <span style={{ fontSize: "28px", fontWeight: "700", color: detalleData.netoFinal >= 0 ? (COLORES?.info || "#4DA3FF") : (COLORES?.error || "#FF5C5C") }}>
                  {fmt(detalleData.netoFinal)}
                </span>
              </div>
            </div>

          </div>
        </div>,
        document.body // CAMBIO: punto clave — renderiza fuera del árbol, directo en body
      )}
    </div>
  )
}