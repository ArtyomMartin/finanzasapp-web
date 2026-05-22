//FondoEmergencia.jsx

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDatos } from "../context/AppContext"
import DrawerMenu from "../components/DrawerMenu"
import { calcularIngresoCompartidoTotal, egresosActivosEnMes, montoEgresoMes } from "../services/calculos"
import { COLORES, estiloPantalla, estiloHeader, estiloTitulo, estiloTarjeta, estiloBotonPrimario, estiloBotonSecundario, estiloBotonIcono, estiloLabel, estiloInput, estiloWizardBox } from "../theme"

export default function FondoEmergencia() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { datos, actualizarDatos, fmt } = useDatos()

  const fondo = datos.fondoEmergencia || {}
  const activo = !!fondo.activo
  const ubicacion = datos.ubicacion || []
  const entradaFondo = ubicacion.find(c => c.id === "fondo-emergencia")
  const montoActual = parseFloat(entradaFondo?.monto) || 0

  const hoy = new Date()
  const mes = hoy.getMonth() + 1
  const anio = hoy.getFullYear()
  
  let mesSig = mes + 1;
  let anioSig = anio;
  if (mesSig > 12) { mesSig = 1; anioSig++; }

  const ingresoMes = calcularIngresoCompartidoTotal(datos, mes, anio)
  const egresosMesSiguiente = egresosActivosEnMes(datos.egresos || [], mesSig, anioSig)
    .reduce((acc, e) => acc + montoEgresoMes(e, anioSig, mesSig), 0)

  const [paso, setPaso] = useState(0)
  const [wizMeses, setWizMeses] = useState(fondo.mesesObjetivo || 3)
  const [wizTipo, setWizTipo] = useState(fondo.tipo || "porcentaje")
  const [wizValor, setWizValor] = useState(fondo.valor || "")

  const [editandoSaldo, setEditandoSaldo] = useState(false)
  const [nuevoSaldo, setNuevoSaldo] = useState("")

  const [editandoConfig, setEditandoConfig] = useState(false)
  const [editTipo, setEditTipo] = useState(fondo.tipo || "porcentaje")
  const [editValor, setEditValor] = useState(fondo.valor || "")
  const [editMeses, setEditMeses] = useState(fondo.mesesObjetivo || 3)

  const objetivo = (fondo.mesesObjetivo || 3) * egresosMesSiguiente
  const aporteMensual = fondo.activo
    ? fondo.tipo === "porcentaje"
      ? ingresoMes * (fondo.valor / 100)
      : fondo.valor
    : 0

  const progresoPct = objetivo > 0 ? Math.min(100, (montoActual / objetivo) * 100) : 0
  const cubierto = montoActual >= objetivo && objetivo > 0

  function activarFondo() {
    const valor = parseFloat(wizValor)
    if (!valor || valor <= 0) return alert("Ingresa un valor válido")
    if (wizTipo === "porcentaje" && valor > 100) return alert("El porcentaje no puede superar 100")

    const ahora = new Date().toISOString()
    const nuevaUbicacion = ubicacion.find(c => c.id === "fondo-emergencia")
      ? ubicacion
      : [...ubicacion, { id: "fondo-emergencia", nombre: "Fondo de emergencia", monto: 0, protegido: true, creadoEn: ahora }]

    actualizarDatos({
      ...datos,
      fondoEmergencia: {
        activo: true,
        tipo: wizTipo,
        valor: valor,
        mesesObjetivo: wizMeses,
        mesInicio: mes,
        anioInicio: anio,
      },
      ubicacion: nuevaUbicacion,
    })
    setPaso(0)
  }

  function guardarSaldo() {
    const v = parseFloat(nuevoSaldo)
    if (isNaN(v) || v < 0) return alert("Valor inválido")
    const nuevaUbicacion = ubicacion.map(c =>
      c.id === "fondo-emergencia" ? { ...c, monto: v } : c
    )
    actualizarDatos({ ...datos, ubicacion: nuevaUbicacion })
    setEditandoSaldo(false)
    setNuevoSaldo("")
  }

  function guardarConfig() {
    const valor = parseFloat(editValor)
    if (!valor || valor <= 0) return alert("Valor inválido")
    if (editTipo === "porcentaje" && valor > 100) return alert("El porcentaje no puede superar 100")
    actualizarDatos({
      ...datos,
      fondoEmergencia: {
        ...fondo,
        tipo: editTipo,
        valor: valor,
        mesesObjetivo: editMeses,
      }
    })
    setEditandoConfig(false)
  }

  function desactivarFondo() {
    if (!window.confirm("¿Desactivar el fondo de emergencia? El saldo acumulado se conserva en Ubi Plata.")) return
    actualizarDatos({
      ...datos,
      fondoEmergencia: { ...fondo, activo: false }
    })
  }

  if (paso === 1) {
    return (
      <div style={estiloPantalla}>
        <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />
        <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
          <div style={estiloHeader}>
            <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonIcono, fontSize: "24px", marginRight: "10px" }}>☰</button>
            <button onClick={() => setPaso(0)} style={estiloBotonIcono}>← Volver</button>
            <h1 style={estiloTitulo}>Fondo de emergencia</h1>
          </div>

          <div style={estiloWizardBox}>
            <div style={{ fontSize: "12px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Paso 1 de 2</div>
            <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "700", color: COLORES.textoBlanco }}>¿Cuántos meses de gastos quieres cubrir?</h2>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: COLORES.textoMuted, lineHeight: "1.5" }}>Lo recomendado es entre 3 y 7 meses de tus gastos fijos (calculado sobre el mes próximo).</p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {[3, 5, 7].map(m => (
                <button
                  key={m}
                  onClick={() => setWizMeses(m)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "16px 8px", borderRadius: "10px", cursor: "pointer",
                    background: wizMeses === m ? COLORES.primarioSuave : COLORES.fondoOpcion,
                    border: `1px solid ${wizMeses === m ? COLORES.primario : COLORES.borde}`,
                    color: wizMeses === m ? COLORES.textoBlanco : COLORES.textoSecundario,
                  }}
                >
                  <span style={{ fontSize: "28px", fontWeight: "800" }}>{m}</span>
                  <span style={{ fontSize: "12px", color: wizMeses === m ? COLORES.textoSecundario : COLORES.textoMuted }}>meses</span>
                </button>
              ))}
            </div>

            {egresosMesSiguiente > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: COLORES.primarioSuave, borderRadius: "8px", marginBottom: "16px" }}>
                <span style={{ color: COLORES.textoMuted, fontSize: "13px" }}>Objetivo estimado:</span>
                <span style={{ color: COLORES.advertencia, fontWeight: "700", fontSize: "16px" }}>{fmt(wizMeses * egresosMesSiguiente)}</span>
              </div>
            )}
            {egresosMesSiguiente === 0 && (
              <p style={{ color: COLORES.textoMuted, fontSize: "13px", marginTop: "12px" }}>
                💡 No hay egresos registrados el mes próximo, el objetivo se calculará cuando los agregues.
              </p>
            )}

            <button onClick={() => setPaso(2)} style={estiloBotonPrimario}>Siguiente →</button>
          </div>
        </div>
      </div>
    )
  }

  if (paso === 2) {
    return (
      <div style={estiloPantalla}>
        <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />
        <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
          <div style={estiloHeader}>
            <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonIcono, fontSize: "24px", marginRight: "10px" }}>☰</button>
            <button onClick={() => setPaso(1)} style={estiloBotonIcono}>← Volver</button>
            <h1 style={estiloTitulo}>Fondo de emergencia</h1>
          </div>

          <div style={estiloWizardBox}>
            <div style={{ fontSize: "12px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Paso 2 de 2</div>
            <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "700", color: COLORES.textoBlanco }}>¿Cómo quieres aportar cada mes?</h2>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: COLORES.textoMuted, lineHeight: "1.5" }}>Este importe se mostrará como referencia en Hacer Pagos.</p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {[["porcentaje", "% de ingresos"], ["fijo", "Monto fijo"]].map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => { setWizTipo(t); setWizValor("") }}
                  style={{
                    flex: 1, padding: "13px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
                    background: wizTipo === t ? COLORES.primarioSuave : COLORES.fondoOpcion,
                    border: `1px solid ${wizTipo === t ? COLORES.primario : COLORES.borde}`,
                    color: wizTipo === t ? COLORES.textoBlanco : COLORES.textoSecundario,
                  }}
                >{label}</button>
              ))}
            </div>

            <label style={estiloLabel}>
              {wizTipo === "porcentaje" ? "Porcentaje de los ingresos (%)" : "Monto fijo mensual (€)"}
            </label>
            <input
              type="number"
              placeholder={wizTipo === "porcentaje" ? "Ej: 10" : "Ej: 200"}
              value={wizValor}
              onChange={e => setWizValor(e.target.value)}
              style={estiloInput}
            />

            {wizValor > 0 && ingresoMes > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: COLORES.primarioSuave, borderRadius: "8px", marginBottom: "16px", marginTop: "16px" }}>
                <span style={{ color: COLORES.textoMuted, fontSize: "13px" }}>Aporte estimado este mes:</span>
                <span style={{ color: COLORES.positivo, fontWeight: "700", fontSize: "16px" }}>
                  {fmt(wizTipo === "porcentaje" ? ingresoMes * (wizValor / 100) : parseFloat(wizValor) || 0)}
                </span>
              </div>
            )}

            <button onClick={activarFondo} style={{...estiloBotonPrimario, marginTop: "16px"}}>✅ Activar fondo</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={estiloPantalla}>
      <DrawerMenu abierto={menuAbierto} setAbierto={setMenuAbierto} rutaActual={location.pathname} alNavegar={navigate} />

      <div style={{ animation: "fadeSlideUp 0.35s ease" }}>
        <div style={estiloHeader}>
          <button onClick={() => setMenuAbierto(true)} style={{ ...estiloBotonIcono, fontSize: "24px", marginRight: "10px" }}>☰</button>
          <h1 style={estiloTitulo}>🛡️ Fondo de emergencia</h1>
        </div>

        {!activo ? (
          <div style={{ background: COLORES.fondoTarjeta, border: `1px solid ${COLORES.advertencia}`, borderRadius: "16px", padding: "28px 20px", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛡️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "20px", color: COLORES.textoBlanco }}>¿Tienes fondo de emergencia?</h2>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: COLORES.textoMuted, lineHeight: "1.6" }}>
              Un fondo de emergencia te protege ante imprevistos sin endeudarte.
              Lo ideal es tener entre 3 y 7 meses de tus gastos fijos ahorrados.
            </p>
            <button onClick={() => setPaso(1)} style={estiloBotonPrimario}>Empezar a construirlo →</button>
          </div>
        ) : (
          <>
            <div style={{ ...estiloTarjeta, borderLeft: `4px solid ${cubierto ? COLORES.positivo : COLORES.advertencia}`, padding: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Saldo actual en el fondo
                    </p>
                    {!editandoSaldo && (
                      <button
                        onClick={() => { setEditandoSaldo(true); setNuevoSaldo(montoActual.toString()) }}
                        style={{ background: "none", border: "none", color: COLORES.primario, fontSize: "13px", cursor: "pointer", padding: 0 }}
                      >✏️ Editar</button>
                    )}
                  </div>
                  
                  {editandoSaldo ? (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={nuevoSaldo}
                        onChange={e => setNuevoSaldo(e.target.value)}
                        style={{ ...estiloInput, flex: 1, minWidth: 0, width: "auto" }}
                        autoFocus
                      />
                      <button onClick={guardarSaldo} style={{ ...estiloBotonPrimario, margin: 0, padding: "12px 16px", width: "auto", flexShrink: 0 }}>Guardar</button>
                      <button onClick={() => setEditandoSaldo(false)} style={{ ...estiloBotonSecundario, margin: 0, padding: "12px 16px", width: "auto", flexShrink: 0 }}>✕</button>
                    </div>
                  ) : (
                    <>
                      <p style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: "800", color: COLORES.advertencia }}>
                        {fmt(montoActual)}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: COLORES.textoMuted }}>
                          Objetivo ({fondo.mesesObjetivo} meses): <strong style={{color: COLORES.textoBlanco}}>{fmt(objetivo)}</strong>
                        </p>
                        {cubierto && (
                          <span style={{ background: COLORES.fondoPanel, color: COLORES.positivo, border: `1px solid ${COLORES.positivo}`, borderRadius: "8px", padding: "2px 8px", fontSize: "11px", fontWeight: "700" }}>
                            ✓ Cubierto
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ background: COLORES.fondoPanel, borderRadius: "99px", height: "10px", overflow: "hidden", marginBottom: "8px", marginTop: "16px" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  width: `${progresoPct}%`,
                  background: cubierto ? COLORES.positivo : COLORES.advertencia,
                  transition: "width 0.6s ease"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: COLORES.textoMuted }}>
                <span>{progresoPct.toFixed(1)}% completado</span>
                {!cubierto && <span>Faltan {fmt(Math.max(0, objetivo - montoActual))}</span>}
              </div>
            </div>

            <div style={{ ...estiloTarjeta, padding: "16px" }}>
              {!editandoConfig ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Aporte mensual configurado
                    </p>
                    <button
                      onClick={() => { setEditandoConfig(true); setEditTipo(fondo.tipo); setEditValor(fondo.valor); setEditMeses(fondo.mesesObjetivo) }}
                      style={{ background: "none", border: "none", color: COLORES.primario, fontSize: "13px", cursor: "pointer", padding: 0 }}
                    >✏️ Editar</button>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 14px", background: COLORES.fondoPanel, borderRadius: "8px", border: `1px solid ${COLORES.borde}` }}>
                      <span style={{ fontSize: "11px", color: COLORES.textoMuted }}>Tipo</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: COLORES.primario }}>
                        {fondo.tipo === "porcentaje" ? `${fondo.valor}% de ingresos` : `${fmt(fondo.valor)} fijo`}
                      </span>
                    </div>
                    {ingresoMes > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 14px", background: COLORES.fondoPanel, borderRadius: "8px", border: `1px solid ${COLORES.borde}` }}>
                        <span style={{ fontSize: "11px", color: COLORES.textoMuted }}>Este mes</span>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: COLORES.positivo }}>{fmt(aporteMensual)}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 14px", background: COLORES.fondoPanel, borderRadius: "8px", border: `1px solid ${COLORES.borde}` }}>
                      <span style={{ fontSize: "11px", color: COLORES.textoMuted }}>Objetivo</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: COLORES.advertencia }}>{fondo.mesesObjetivo} meses</span>
                    </div>
                  </div>

                  {!cubierto && objetivo > 0 && aporteMensual > 0 && (
                    <div style={{ marginTop: "12px", padding: "10px 12px", background: COLORES.primarioSuave, borderRadius: "8px", borderLeft: `3px solid ${COLORES.primario}` }}>
                      <p style={{ margin: 0, fontSize: "13px", color: COLORES.textoSecundario }}>
                        💡 A este ritmo alcanzarás el objetivo en aproximadamente{" "}
                        <strong style={{ color: COLORES.primario }}>
                          {Math.ceil(Math.max(0, objetivo - montoActual) / aporteMensual)} meses
                        </strong>
                      </p>
                    </div>
                  )}

                  {cubierto && (
                    <div style={{ marginTop: "12px", padding: "10px 12px", background: COLORES.fondoPanel, borderRadius: "8px", borderLeft: `3px solid ${COLORES.positivo}` }}>
                      <p style={{ margin: 0, fontSize: "13px", color: COLORES.positivo }}>
                        🎉 ¡Fondo cubierto! Puedes redirigir este aporte a inversiones u otros objetivos.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: COLORES.textoMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Editar configuración
                  </p>

                  <label style={estiloLabel}>Meses de gastos a cubrir</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    {[3, 5, 7].map(m => (
                      <button
                        key={m}
                        onClick={() => setEditMeses(m)}
                        style={{
                          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", borderRadius: "10px", cursor: "pointer",
                          padding: "10px 16px",
                          background: editMeses === m ? COLORES.primarioSuave : COLORES.fondoOpcion,
                          border: `1px solid ${editMeses === m ? COLORES.primario : COLORES.borde}`,
                          color: editMeses === m ? COLORES.textoBlanco : COLORES.textoSecundario,
                        }}
                      >
                        <span style={{ fontSize: "18px", fontWeight: "800" }}>{m}</span>
                        <span style={{ fontSize: "11px" }}>meses</span>
                      </button>
                    ))}
                  </div>

                  <label style={estiloLabel}>Tipo de aporte</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    {[["porcentaje", "% ingresos"], ["fijo", "Monto fijo"]].map(([t, label]) => (
                      <button
                        key={t}
                        onClick={() => { setEditTipo(t); setEditValor("") }}
                        style={{
                          flex: 1, padding: "13px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
                          background: editTipo === t ? COLORES.primarioSuave : COLORES.fondoOpcion,
                          border: `1px solid ${editTipo === t ? COLORES.primario : COLORES.borde}`,
                          color: editTipo === t ? COLORES.textoBlanco : COLORES.textoSecundario,
                        }}
                      >{label}</button>
                    ))}
                  </div>

                  <label style={estiloLabel}>
                    {editTipo === "porcentaje" ? "Porcentaje (%)" : "Monto fijo (€)"}
                  </label>
                  <input
                    type="number"
                    value={editValor}
                    onChange={e => setEditValor(e.target.value)}
                    style={{ ...estiloInput, marginBottom: "12px" }}
                  />

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={guardarConfig} style={estiloBotonPrimario}>💾 Guardar</button>
                    <button onClick={() => setEditandoConfig(false)} style={estiloBotonSecundario}>Cancelar</button>
                  </div>
                </>
              )}
            </div>

            {!editandoConfig && (
              <button onClick={desactivarFondo} style={{ ...estiloBotonSecundario, width: "100%", marginTop: "4px", color: COLORES.peligro, borderColor: COLORES.peligro }}>
                Desactivar fondo
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}