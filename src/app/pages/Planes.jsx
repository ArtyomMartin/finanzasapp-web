import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import { COLORES, estilos } from "../theme"

export default function Planes() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, actualizarDatos } = useDatos()
  const planes = (datos.planes || []).filter(p => !p.eliminado)

  const [titulo, setTitulo] = useState("")
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [texto, setTexto] = useState("")

  function guardar() {
    if (!titulo.trim() || !texto.trim()) return alert("Título y texto son obligatorios")
    const nuevo = {
      id: crypto.randomUUID(),
      titulo: titulo.trim(), fecha, texto: texto.trim(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      eliminado: false
    }
    actualizarDatos({ ...datos, planes: [...(datos.planes || []), nuevo] })
    setTitulo(""); setFecha(new Date().toISOString().slice(0, 10)); setTexto("")
  }

  function eliminar(id) {
    if (!confirm("¿Eliminar este plan?")) return
    const actualizados = datos.planes.map(p =>
      p.id === id ? { ...p, eliminado: true, actualizadoEn: new Date().toISOString() } : p
    )
    actualizarDatos({ ...datos, planes: actualizados })
  }

  const ordenados = [...planes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  return (
    <div style={estilos.estiloPantalla}>
      <DrawerMenu
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        rutaActual={location.pathname}
        alNavegar={navigate}
      />

      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estilos.estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estilos.estiloBotonIcono, fontSize: "24px", marginRight: "10px" }}>☰</button>
          <h1 style={estilos.estiloTitulo}>📋 Planes y acuerdos</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
          <label style={estilos.estiloLabel}>Título</label>
          <input placeholder="Ej: Irme/Irnos de vacaciones a canarias..." value={titulo} onChange={e => setTitulo(e.target.value)} style={estilos.estiloInput} />
          <label style={estilos.estiloLabel}>Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={estilos.estiloInput} />
          <label style={estilos.estiloLabel}>Descripción</label>
          <textarea
            placeholder="EJ: Vamos a irnos de vacaciones a Canarias, tenemos que ahorrar mucho..."
            value={texto} onChange={e => setTexto(e.target.value)}
            style={{ ...estilos.estiloInput, resize: "vertical", marginBottom: 0 }} rows={4}
          />
          <button onClick={guardar} style={{ ...estilos.estiloBotonPrimario, marginTop: "4px" }}>+ Guardar plan</button>
        </div>

        <p style={{ fontSize: "13px", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Planes registrados
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {ordenados.length === 0 && (
            <p style={{ color: COLORES.textoMuted, textAlign: "center", padding: "24px 0" }}>No hay planes registrados aún.</p>
          )}
          {ordenados.map(p => (
            <div key={p.id} style={{
              ...estilos.estiloTarjeta,
              padding: "16px",
              borderLeft: `3px solid ${COLORES.primario}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "12px" }}>
                <strong style={{ fontSize: "16px", color: COLORES.textoBlanco, lineHeight: "1.3" }}>{p.titulo}</strong>
                <span style={{
                  fontSize: "12px", color: COLORES.acento,
                  background: COLORES.primarioSuave,
                  border: `1px solid ${COLORES.primario}`,
                  borderRadius: "6px", padding: "3px 8px",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>{p.fecha}</span>
              </div>
              <p style={{ margin: "0 0 14px 0", fontSize: "14px", color: COLORES.textoSecundario, whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{p.texto}</p>
              <button
                onClick={() => eliminar(p.id)}
                style={{
                  background: "rgba(42,26,26,0.60)",
                  border: `1px solid ${COLORES.peligro}`,
                  color: COLORES.peligro,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "7px 14px",
                  borderRadius: "8px",
                }}
              >🗑 Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}