import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import FilaEliminable from "../components/FilaEliminable"
import { COLORES, estiloPantalla, estiloHeader, estiloTitulo, estiloInput, estiloTarjeta } from "../theme"

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function Cuotas() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, actualizarDatos, usuarioActivo, fmt } = useDatos()
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())

  const mesN  = parseInt(mes)
  const anioN = parseInt(anio)
  const usuarios = datos.config.usuarios

  const cuotasActivas = datos.ajustes.filter(a => {
    if (a.eliminado || a.forma !== "cuotas") return false
    if (a.usuarioId !== usuarioActivo) return false
    const inicio   = a.anioInicio * 12 + a.mesInicio
    const consulta = anioN * 12 + mesN
    return consulta >= inicio && consulta < inicio + a.numCuotas
  })

  function numeroCuota(a) {
    const inicio   = a.anioInicio * 12 + a.mesInicio
    const consulta = anioN * 12 + mesN
    return consulta - inicio + 1
  }

  const totalCuotas = cuotasActivas.reduce((acc, a) => acc + a.montoCuota, 0)

  function eliminar(id) {
    actualizarDatos({
      ...datos,
      ajustes: datos.ajustes.map(a => a.id === id ? { ...a, eliminado: true, actualizadoEn: new Date().toISOString() } : a)
    })
  }

  function nombreUsuario(id) {
    return usuarios.find(u => u.id === id)?.nombre ?? id
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
          <button onClick={() => setMenuAbierto(true)} style={{ background: "none", border: "none", fontSize: "24px", marginRight: "10px", cursor: "pointer", color: COLORES.primario }}>☰</button>
          <h1 style={estiloTitulo}>Cuotas</h1>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <select value={mes} onChange={e => setMes(e.target.value)} style={{ ...estiloInput, flex: 1 }}>
            {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={anio} onChange={e => setAnio(e.target.value)} style={{ ...estiloInput, width: "90px" }}>
            {Array.from({ length: 5 }, (_, i) => hoy.getFullYear() - 1 + i).map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div style={{ ...estiloTarjeta, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", marginTop: "12px" }}>
          <span>Total cuotas del mes</span>
          <strong>{fmt ? fmt(totalCuotas) : `${totalCuotas.toFixed(2)} €`}</strong>
        </div>

        {cuotasActivas.length === 0 ? (
          <p style={{ color: COLORES.textoSecundario, marginTop: "20px" }}>No hay cuotas activas para este mes</p>
        ) : (
          cuotasActivas.map(a => (
            <FilaEliminable key={a.id} onEliminar={() => eliminar(a.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div>{a.nombre}</div>
                  <div style={{ fontSize: "13px", color: COLORES.textoSecundario }}>
                    {nombreUsuario(a.usuarioId)} · {a.tipo} · cuota {numeroCuota(a)} de {a.numCuotas}
                  </div>
                </div>
                <strong>{fmt ? fmt(a.montoCuota) : `${a.montoCuota.toFixed(2)} €`}</strong>
              </div>
            </FilaEliminable>
          ))
        )}
      </div>
    </div>
  )
}