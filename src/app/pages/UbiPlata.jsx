import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import { COLORES, estilos } from "../theme" // Importación centralizada del tema

export default function UbiPlata() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  
  // Extraemos también fmt del contexto
  const { datos, actualizarDatos, fmt } = useDatos()

  const ubicacion = datos.ubicacion || []

  const camposNormales = ubicacion.filter(c => !c.protegido)
  const entradaFondo = ubicacion.find(c => c.id === "fondo-emergencia")

  const [editando, setEditando] = useState(false)
  const [camposEdit, setCamposEdit] = useState([])

  const [editandoFondo, setEditandoFondo] = useState(false)
  const [nuevoMontoFondo, setNuevoMontoFondo] = useState("")

  function abrirEditor() {
    setCamposEdit(camposNormales.map(c => ({ ...c })))
    setEditando(true)
  }

  function cerrarEditor() { setEditando(false) }

  function guardar() {
    const ahora = new Date().toISOString()
    const limpios = camposEdit
      .filter(c => c.nombre.trim() !== "")
      .map(c => ({ ...c, monto: parseFloat(c.monto) || 0, actualizadoEn: ahora }))
    const nuevaUbicacion = entradaFondo ? [...limpios, entradaFondo] : limpios
    actualizarDatos({ ...datos, ubicacion: nuevaUbicacion })
    setEditando(false)
  }

  function añadirCampo() {
    setCamposEdit([...camposEdit, { id: Date.now().toString(), nombre: "", monto: "" }])
  }

  function eliminarCampo(id) {
    setCamposEdit(camposEdit.filter(c => c.id !== id))
  }

  function cambiarCampo(id, key, valor) {
    setCamposEdit(camposEdit.map(c => c.id === id ? { ...c, [key]: valor } : c))
  }

  function guardarMontoFondo() {
    const v = parseFloat(nuevoMontoFondo)
    if (isNaN(v) || v < 0) return alert("Valor inválido")
    const ahora = new Date().toISOString()
    const nuevaUbicacion = ubicacion.map(c =>
      c.id === "fondo-emergencia" ? { ...c, monto: v, actualizadoEn: ahora } : c
    )
    actualizarDatos({ ...datos, ubicacion: nuevaUbicacion })
    setEditandoFondo(false)
    setNuevoMontoFondo("")
  }

  const total = ubicacion.reduce((sum, c) => sum + (parseFloat(c.monto) || 0), 0)

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
          <h1 style={estilos.estiloTitulo}>Ubicacion del dinero</h1>
        </div>

        {!editando ? (
          <>
            {camposNormales.length === 0 && !entradaFondo ? (
              <p style={{ color: COLORES.textoMuted }}>No hay campos definidos todavía.</p>
            ) : (
              <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${COLORES.borde || "rgba(44,52,64,0.8)"}`, marginBottom: "16px" }}>
                <table style={estilos.estiloTabla}>
                  <tbody>
                    {camposNormales.map(c => (
                      <tr key={c.id}>
                        <td style={{ ...estilos.estiloTd, textAlign: "left" }}>{c.nombre}</td>
                        <td style={{ ...estilos.estiloTd, textAlign: "right", fontWeight: "bold" }}>
                          {fmt(parseFloat(c.monto) || 0)}
                        </td>
                      </tr>
                    ))}

                    {entradaFondo && (
                      <tr style={{ background: "rgba(58,53,31,0.35)" }}>
                        <td style={estilos.estiloTd}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🛡️ {entradaFondo.nombre}</span>
                            <span style={{ fontSize: "10px", color: COLORES.advertencia, background: "rgba(255,217,61,0.12)", border: "1px solid rgba(255,217,61,0.3)", borderRadius: "4px", padding: "1px 6px" }}>
                              protegido
                            </span>
                          </div>
                        </td>
                        <td style={{ ...estilos.estiloTd, textAlign: "right" }}>
                          {editandoFondo ? (
                            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
                              <input
                                type="number"
                                value={nuevoMontoFondo}
                                onChange={e => setNuevoMontoFondo(e.target.value)}
                                style={{ ...estilos.estiloInput, flex: "0 0 110px", textAlign: "right", padding: "6px" }}
                                autoFocus
                              />
                              <button onClick={guardarMontoFondo} style={{ color: COLORES.exito, background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>✓</button>
                              <button onClick={() => setEditandoFondo(false)} style={{ color: COLORES.peligro, background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>✕</button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                              <span style={{ fontWeight: "bold", color: COLORES.advertencia }}>
                                {fmt(parseFloat(entradaFondo.monto) || 0)}
                              </span>
                              <button
                                onClick={() => { setEditandoFondo(true); setNuevoMontoFondo(entradaFondo.monto?.toString() || "0") }}
                                style={{ color: COLORES.primario, background: "none", border: "none", fontSize: "13px", cursor: "pointer" }}
                              >✏️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}

                    <tr style={{ borderTop: `1px solid ${COLORES.borde || "rgba(44,52,64,0.8)"}` }}>
                      <td style={{ ...estilos.estiloTd, textAlign: "left", fontWeight: "bold", color: COLORES.exito }}>Total</td>
                      <td style={{ ...estilos.estiloTd, textAlign: "right", fontWeight: "bold", color: COLORES.exito }}>
                        {fmt(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <button onClick={abrirEditor} style={{ ...estilos.estiloBotonSecundario, marginTop: "8px" }}>✏️ Editar</button>
          </>
        ) : (
          <>
            {camposEdit.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                <input
                  placeholder="Nombre" value={c.nombre}
                  onChange={e => cambiarCampo(c.id, "nombre", e.target.value)}
                  style={{ ...estilos.estiloInput, flex: 2 }}
                />
                <input
                  placeholder="Importe" type="number" value={c.monto}
                  onChange={e => cambiarCampo(c.id, "monto", e.target.value)}
                  style={{ ...estilos.estiloInput, flex: "0 0 100px" }}
                />
                <button onClick={() => eliminarCampo(c.id)} style={{ color: COLORES.peligro, background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
              </div>
            ))}

            {entradaFondo && (
              <div style={{ padding: "10px 12px", background: "rgba(58,53,31,0.40)", borderRadius: "8px", border: "1px solid rgba(255,217,61,0.2)", marginBottom: "12px", fontSize: "13px", color: COLORES.textoMuted }}>
                🛡️ <strong style={{ color: COLORES.advertencia }}>Fondo de emergencia</strong> — se edita directamente en la tabla o desde la pantalla Fondo de emergencia.
              </div>
            )}

            <button onClick={añadirCampo} style={{ ...estilos.estiloBotonSecundario, marginBottom: "16px", display: "block" }}>+ Añadir campo</button>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={guardar} style={estilos.estiloBotonPrimario}>💾 Guardar</button>
              <button onClick={cerrarEditor} style={estilos.estiloBotonSecundario}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}