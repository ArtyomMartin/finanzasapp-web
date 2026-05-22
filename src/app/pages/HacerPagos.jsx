//HacerPagos.jsx

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import { egresosActivosEnMes, inversionesActivasEnMes, calcularAporteFondo, montoEgresoMes, lunesEnMes } from "../services/calculos"
import { NOMBRES_MESES } from "../services/formateo"
import { COLORES, estiloPantalla, estiloHeader, estiloTitulo, estiloTarjeta, estiloBotonIcono, estiloSubtitulo } from "../theme"

export default function HacerPagos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, fmt } = useDatos()

  const hoy = new Date()
  const [offset, setOffset] = useState(0)
  const [pagados, setPagados] = useState({})

  const dateObj = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1)
  const mesSel = { mes: dateObj.getMonth() + 1, anio: dateObj.getFullYear() }

  const egresos = egresosActivosEnMes(datos.egresos || [], mesSel.mes, mesSel.anio)
    .map(e => ({
      ...e,
      _categoria: "Egreso",
      _montoMes: montoEgresoMes(e, mesSel.anio, mesSel.mes)
    }))

  const inversiones = inversionesActivasEnMes(datos.inversiones || [], mesSel.mes, mesSel.anio)
    .filter(i => !i.cuentaId)
    .map(i => ({ ...i, _categoria: "Inversión", _montoMes: i.monto }))

  let aporteFondoItem = []
  if (datos.fondoEmergencia?.activo) {
    const montoAporte = calcularAporteFondo(datos, mesSel.mes, mesSel.anio)
    if (montoAporte > 0) {
      aporteFondoItem.push({
        id: "fondo-emergencia-aporte",
        nombre: "Fondo de Emergencia",
        _categoria: "Ahorro",
        _montoMes: montoAporte,
        mesInicio: datos.fondoEmergencia.mesInicio,
        anioInicio: datos.fondoEmergencia.anioInicio,
        frecuencia: "m"
      })
    }
  }

  const items = [...egresos, ...inversiones, ...aporteFondoItem]
    .sort((a, b) => b._montoMes - a._montoMes)

  const total = items.reduce((acc, i) => acc + i._montoMes, 0)
  const totalPagado = items.filter(i => pagados[i.id]).reduce((acc, i) => acc + i._montoMes, 0)

  function togglePagado(id) {
    setPagados(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
          <h1 style={estiloTitulo}>Hacer Pagos</h1>
        </div>

        {/* Selector de mes — horizontal */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "24px",
          overflow: "hidden",
          borderRadius: "12px",
          border: `1px solid ${COLORES.borde}`,
          backgroundColor: COLORES.fondoTarjeta,
        }}>
          {[[-1, "Mes anterior"], [0, "Mes actual"], [1, "Mes siguiente"]].map(([o, label]) => (
            <button
              key={o}
              onClick={() => { setOffset(o); setPagados({}) }}
              style={{
                flex: 1,
                padding: "13px 8px",
                fontSize: "14px",
                border: "none",
                borderRight: o < 1 ? `1px solid ${COLORES.borde}` : "none",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
                background: offset === o ? COLORES.primarioSuave : "transparent",
                color: offset === o ? COLORES.textoBlanco : COLORES.textoMuted,
                borderBottom: offset === o ? `2px solid ${COLORES.primario}` : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >{label}</button>
          ))}
        </div>

        <div style={{ ...estiloTarjeta, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", padding: "14px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: COLORES.textoBlanco }}>{NOMBRES_MESES[mesSel.mes - 1]} {mesSel.anio}</div>
            <div style={{ fontSize: "12px", color: COLORES.textoMuted, marginTop: "2px" }}>
              {items.filter(i => pagados[i.id]).length} de {items.length} pagados
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: COLORES.textoMuted, marginBottom: "2px" }}>
              Pagado: <span style={{ color: COLORES.positivo, fontWeight: "700" }}>{fmt(totalPagado)}</span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: COLORES.negativo }}>{fmt(total)} total</div>
          </div>
        </div>

        <div style={{ fontSize: "13px", color: COLORES.textoMuted, marginBottom: "20px", lineHeight: "1.5", padding: "12px", background: COLORES.primarioSuave, borderRadius: "8px", borderLeft: `3px solid ${COLORES.primario}` }}>
          💡 Marcar como pagado es solo visual y no se guarda en ningún lado. Al salir o cambiar de mes se resetea.
        </div>

        <div style={{ marginTop: "8px" }}>
          <p style={{ ...estiloSubtitulo, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Egresos e inversiones del mes</p>

          {items.length === 0 && (
            <p style={{ color: COLORES.textoMuted, fontSize: "14px", textAlign: "center", padding: "24px 0" }}>No hay egresos ni inversiones para este mes.</p>
          )}

          {items.map(item => {
            const esPagado = !!pagados[item.id]
            const esEgreso = item._categoria === "Egreso"
            const esAhorro = item._categoria === "Ahorro"
            const badgeBg = esEgreso ? COLORES.primarioSuave : esAhorro ? COLORES.fondoTarjeta : COLORES.primarioSuave
            const badgeColor = esEgreso ? COLORES.neutro : esAhorro ? COLORES.positivo : COLORES.acento
            const esSemanal = esEgreso && item.frecuencia === "s"

            return (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <button
                  onClick={() => togglePagado(item.id)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", cursor: "pointer", transition: "all 0.15s", gap: "12px",
                    background: esPagado ? COLORES.fondoTarjeta : COLORES.fondoTarjeta,
                    border: `1px solid ${esPagado ? COLORES.positivo : COLORES.borde}`,
                    borderRadius: "10px",
                    opacity: esPagado ? 0.75 : 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                      border: `2px solid ${esPagado ? COLORES.positivo : COLORES.borde}`,
                      background: esPagado ? COLORES.fondoTarjeta : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px",
                      color: COLORES.positivo,
                    }}>
                      {esPagado ? "✓" : ""}
                    </div>
                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap", background: badgeBg, color: badgeColor }}>
                      {item._categoria}
                    </span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "15px", fontWeight: "600", textDecoration: esPagado ? "line-through" : "none", color: esPagado ? COLORES.textoMuted : COLORES.textoBlanco }}>
                        {item.nombre}
                        {esSemanal && (
                          <span style={{ fontSize: "11px", color: COLORES.advertencia, marginLeft: "6px", fontWeight: "400" }}>
                            ({lunesEnMes(mesSel.anio, mesSel.mes)} lunes)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: COLORES.textoMuted, marginTop: "2px" }}>
                        {item.mesInicio
                          ? `Recurrente · desde ${NOMBRES_MESES[item.mesInicio - 1]} ${item.anioInicio}`
                          : `Puntual · ${NOMBRES_MESES[item.mes - 1]} ${item.anio}`
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: esPagado ? COLORES.positivo : COLORES.negativo }}>
                      {fmt(item._montoMes)}
                    </div>
                    <div style={{ fontSize: "11px", color: esPagado ? COLORES.positivo : COLORES.textoMuted, marginTop: "2px" }}>
                      {esPagado ? "Pagado" : "Pendiente"}
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}