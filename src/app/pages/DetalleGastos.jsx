import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
// Importamos calculos centralizados (eliminando locales)
import { lunesEnMes, montoEgresoMes } from "../services/calculos"
import { COLORES, estiloPantalla, estiloHeader, estiloTitulo, estiloBotonSecundario } from "../theme"

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function estaActivo(item, mes, anio) {
  const inicio = item.anioInicio * 12 + (item.mesInicio - 1)
  const actual = anio * 12 + (mes - 1)
  if (actual < inicio) return false
  if (item.mesFin != null && item.anioFin != null) {
    const fin = item.anioFin * 12 + (item.mesFin - 1)
    if (actual > fin) return false
  }
  return true
}

export default function DetalleGastos() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  
  // Usamos fmt del contexto centralizado
  const { datos, fmt } = useDatos()
  const [anioSel, setAnioSel] = useState(null)
  const [mesSel, setMesSel] = useState(null)

  const salarios = (datos.salarios || []).filter(s => !s.eliminado)
  const variaciones = (datos.variaciones || []).filter(v => !v.eliminado)
  const egresos = (datos.egresos || []).filter(e => !e.eliminado)
  const ajustes = (datos.ajustes || []).filter(a => !a.eliminado)
  const usuarios = datos.config?.usuarios || []

  const aniosSet = new Set()
  ;[...salarios, ...egresos].forEach(item => {
    for (let a = item.anioInicio; a <= (item.anioFin ?? new Date().getFullYear() + 1); a++) {
      aniosSet.add(a)
    }
  })
  variaciones.forEach(v => aniosSet.add(v.anio))
  ajustes.forEach(a => {
    if (a.anio) aniosSet.add(a.anio)
    if (a.anioInicio) {
      for (let y = a.anioInicio; y <= (a.anioFin ?? new Date().getFullYear() + 1); y++) {
        aniosSet.add(y)
      }
    }
  })
  const anios = [...aniosSet].sort((a, b) => b - a)

  function mesesConDatos(anio) {
    const mesesSet = new Set()
    for (let m = 1; m <= 12; m++) {
      const hayAlgo =
        salarios.some(s => estaActivo(s, m, anio)) ||
        egresos.some(e => estaActivo(e, m, anio)) ||
        variaciones.some(v => v.anio === anio && v.mes === m) ||
        ajustes.some(a => {
          if (a.mes && a.anio) return a.anio === anio && a.mes === m
          if (a.mesInicio && a.anioInicio) return estaActivo(a, m, anio)
          return false
        })
      if (hayAlgo) mesesSet.add(m)
    }
    return [...mesesSet].sort((a, b) => b - a)
  }

  function DetallesMes({ anio, mes }) {
    const salariosDelMes = salarios.filter(s => estaActivo(s, mes, anio))
    const variacionesDelMes = variaciones.filter(v => v.anio === anio && v.mes === mes)
    const egresosDelMes = egresos.filter(e => estaActivo(e, mes, anio))
    const ajustesDelMes = ajustes.filter(a => {
      if (a.mes && a.anio) return a.anio === anio && a.mes === mes
      if (a.mesInicio && a.anioInicio) return estaActivo(a, mes, anio)
      return false
    })

    return (
      <div>
        <h3 style={{ marginTop: "20px", color: COLORES.positivo }}>💰 Salarios</h3>
        {salariosDelMes.length === 0 && <p style={{ color: COLORES.textoSecundario }}>Sin registros</p>}
        {salariosDelMes.map(s => {
          const usuario = usuarios.find(u => u.id === s.usuarioId)
          const vars = variacionesDelMes.filter(v => v.usuarioId === s.usuarioId)
          return (
            <div key={s.id} style={styles.detalleFila}>
              <strong>{usuario?.nombre ?? s.usuarioId}</strong>: {fmt ? fmt(s.monto) : `${s.monto} €`}
              {vars.map(v => (
                <div key={v.id} style={{ marginLeft: "12px", color: v.monto >= 0 ? COLORES.positivo : COLORES.peligro, fontSize: "0.9em" }}>
                  {v.monto >= 0 ? "+" : ""}{fmt ? fmt(v.monto) : `${v.monto} €`} — {v.descripcion}
                </div>
              ))}
            </div>
          )
        })}

        <h3 style={{ marginTop: "20px", color: COLORES.advertencia }}>📤 Egresos</h3>
        {egresosDelMes.length === 0 && <p style={{ color: COLORES.textoSecundario }}>Sin registros</p>}
        {egresosDelMes.map(e => {
          const total = montoEgresoMes(e, anio, mes)
          const esSemanal = e.frecuencia === "s"
          return (
            <div key={e.id} style={styles.detalleFila}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{e.nombre}</strong>
                {esSemanal && (
                  <span style={{ fontSize: "11px", color: COLORES.advertencia, background: COLORES.fondoPanel, border: `1px solid ${COLORES.advertencia}`, borderRadius: "4px", padding: "1px 6px" }}>
                    semanal
                  </span>
                )}
              </div>
              <div style={{ marginTop: "4px", color: COLORES.positivo }}>
                {fmt ? fmt(total) : `${total} €`}
                {esSemanal && (
                  <span style={{ fontSize: "11px", color: COLORES.textoSecundario, marginLeft: "6px" }}>
                    (€{e.monto.toFixed(2)} × {lunesEnMes(anio, mes)} lunes)
                  </span>
                )}
              </div>
            </div>
          )
        })}

        <h3 style={{ marginTop: "20px", color: COLORES.neutro }}>💰💳 Ahorro/Credito</h3>
        {ajustesDelMes.length === 0 && <p style={{ color: COLORES.textoSecundario }}>Sin registros</p>}
        {ajustesDelMes.map(a => {
          const usuario = usuarios.find(u => u.id === a.usuarioId)
          return (
            <div key={a.id} style={styles.detalleFila}>
              <strong>{usuario?.nombre ?? a.usuarioId}</strong> — {a.nombre}<br />
              <span style={{ fontSize: "0.85em", color: COLORES.textoSecundario }}>
                {a.tipo} · {a.forma}
                {a.montoTotal != null && ` · Total: ${fmt ? fmt(a.montoTotal) : `${a.montoTotal} €`}`}
                {a.montoCuota != null && ` · Cuota: ${fmt ? fmt(a.montoCuota) : `${a.montoCuota} €`}`}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (!anioSel) return (
    <div style={estiloPantalla}>
      <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />
      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonSecundario, fontSize: "24px", marginRight: "10px", padding: "0 10px", border: 'none', background: 'transparent' }}>☰</button>
          <h1 style={estiloTitulo}>Detalle de Gastos</h1>
        </div>
        {anios.length === 0 && <p style={{ color: COLORES.textoSecundario }}>Sin datos registrados.</p>}
        {anios.map(a => (
          <button key={a} onClick={() => setAnioSel(a)} style={styles.btnItem}>{a} →</button>
        ))}
      </div>
    </div>
  )

  const meses2 = mesesConDatos(anioSel)
  if (!mesSel) return (
    <div style={estiloPantalla}>
      <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />
      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonSecundario, fontSize: "24px", marginRight: "10px", padding: "0 10px", border: 'none', background: 'transparent' }}>☰</button>
          <button onClick={() => setAnioSel(null)} style={{ ...estiloBotonSecundario, border: 'none', background: 'transparent', padding: 0 }}>← Volver</button>
          <h1 style={estiloTitulo}>{anioSel}</h1>
        </div>
        {meses2.length === 0 && <p style={{ color: COLORES.textoSecundario }}>Sin datos para este año.</p>}
        {meses2.map(m => (
          <button key={m} onClick={() => setMesSel(m)} style={styles.btnItem}>{MESES[m - 1]} →</button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={estiloPantalla}>
      <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />
      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonSecundario, fontSize: "24px", marginRight: "10px", padding: "0 10px", border: 'none', background: 'transparent' }}>☰</button>
          <button onClick={() => setMesSel(null)} style={{ ...estiloBotonSecundario, border: 'none', background: 'transparent', padding: 0 }}>← Volver</button>
          <h1 style={estiloTitulo}>{MESES[mesSel - 1]} {anioSel}</h1>
        </div>
        <DetallesMes anio={anioSel} mes={mesSel} />
      </div>
    </div>
  )
}

const styles = {
  btnItem: {
    display: "block", width: "100%", padding: "12px", marginBottom: "10px",
    fontSize: "1.1em", cursor: "pointer",
    backgroundColor: COLORES.fondoTarjeta,
    color: COLORES.textoBlanco, border: `1px solid ${COLORES.borde}`, borderRadius: "8px",
    textAlign: "left",
  },
  detalleFila: {
    marginBottom: "8px", padding: "10px 12px",
    background: COLORES.fondoPanel,
    border: `1px solid ${COLORES.bordePanel}`,
    borderRadius: "8px",
  },
}