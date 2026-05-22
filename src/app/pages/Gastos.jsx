// ════════════════════════════════════════════════════════════════
// GASTOS.JSX — FORMULARIO LEGACY
// Formulario unificado que permite elegir tipo (crédito / fondo).
// Redundante con Credito.jsx y Reposicion.jsx, que hacen lo mismo
// de forma separada y con más opciones (modo cuota/total).
// La ruta /gastos existe en App.jsx pero NO aparece en el drawer lateral.
// Considerar: deprecar o mantener como entrada unificada accesible
// solo desde algún punto específico.
// Guarda en datos.ajustes[].
// ════════════════════════════════════════════════════════════════

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDatos } from "../context/AppContext"

const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export default function Gastos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { datos, actualizarDatos } = useDatos()
  const hoy = new Date()
  const usuarios = datos.config.usuarios

  // Permite preseleccionar el tipo vía query param: /gastos?tipo=fondo
  const tipoInicial = searchParams.get("tipo") === "fondo" ? "fondo" : "credito"
  const [tipo, setTipo] = useState(tipoInicial)   // "credito" | "fondo"
  const [forma, setForma] = useState("unico")     // "unico" | "cuotas"

  const [usuarioId, setUsuarioId] = useState(usuarios[0].id)
  const [nombre, setNombre] = useState("")
  const [monto, setMonto] = useState("")
  const [numCuotas, setNumCuotas] = useState(2)
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())

  const montoParsed = parseFloat(monto)
  // Preview del valor de cuota en tiempo real
  const cuotaPreview = monto && numCuotas ? (montoParsed / parseInt(numCuotas)).toFixed(2) : null

  function limpiar() {
    setNombre(""); setMonto(""); setNumCuotas(2)
  }

  function guardar() {
    if (!nombre) return alert("Añade un nombre")
    if (!monto || montoParsed <= 0) return alert("El monto no es válido")

    const ahora = new Date().toISOString()
    const id = Date.now()
    const montoTotal = montoParsed
    let entrada

    if (forma === "unico") {
      entrada = {
        id, usuarioId, tipo, forma: "unico",
        nombre, montoTotal,
        mes: parseInt(mes), anio: parseInt(anio),
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora
      }
    } else {
      const n = parseInt(numCuotas)
      if (!n || n < 2) return alert("El número de cuotas debe ser al menos 2")
      entrada = {
        id, usuarioId, tipo, forma: "cuotas",
        nombre, montoTotal, numCuotas: n,
        montoCuota: montoTotal / n,    // se calcula al guardar
        mesInicio: parseInt(mes), anioInicio: parseInt(anio),
        eliminado: false, creadoEn: ahora, actualizadoEn: ahora
      }
    }

    actualizarDatos({ ...datos, ajustes: [...datos.ajustes, entrada] })
    limpiar()
    alert("Guardado correctamente")
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", backgroundColor: "#0F1115", minHeight: "100vh" }}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.volver}>← Volver</button>
        <h1 style={styles.titulo}>{tipo === "fondo" ? "Reposición" : "Crédito"}</h1>
      </div>

      {/* Selector tipo: Crédito / Reposición */}
      <label style={styles.labelSeccion}>Tipo</label>
      <div style={styles.selectorRow}>
        {[["credito", "Crédito"], ["fondo", "Reposición / Fondo"]].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            style={{ ...styles.tipoBtn, backgroundColor: tipo === t ? "#7C5CFF" : "#1C2128", color: tipo === t ? "white" : "#C7CDD6", border: tipo === t ? "none" : "1px solid #2C3440" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Selector forma: Pago único / En cuotas */}
      <label style={styles.labelSeccion}>Forma de pago</label>
      <div style={styles.selectorRow}>
        {[["unico", "Pago único"], ["cuotas", "En cuotas"]].map(([f, label]) => (
          <button
            key={f}
            onClick={() => setForma(f)}
            style={{ ...styles.tipoBtn, backgroundColor: forma === f ? "#7C5CFF" : "#1C2128", color: forma === f ? "white" : "#C7CDD6", border: forma === f ? "none" : "1px solid #2C3440" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={styles.form}>
        <label style={styles.label}>Usuario</label>
        <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} style={styles.input}>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>

        <label style={styles.label}>Nombre</label>
        <input
          placeholder="Ej: iPhone, préstamo, viaje..."
          value={nombre} onChange={e => setNombre(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Monto total (€)</label>
        <input
          placeholder="0.00" type="number"
          value={monto} onChange={e => setMonto(e.target.value)}
          style={styles.input}
        />

        {/* Número de cuotas — solo visible si forma=cuotas */}
        {forma === "cuotas" && (
          <>
            <label style={styles.label}>Número de cuotas</label>
            <input
              placeholder="Ej: 12" type="number"
              value={numCuotas} onChange={e => setNumCuotas(e.target.value)}
              style={styles.input}
            />
            {/* Preview naranja del valor de cuota */}
            {cuotaPreview && (
              <p style={styles.preview}>Cuota mensual: {cuotaPreview} €</p>
            )}
          </>
        )}

        <label style={styles.label}>{forma === "cuotas" ? "Mes de inicio" : "Mes"}</label>
        <div style={styles.row}>
          <select value={mes} onChange={e => setMes(e.target.value)} style={{ ...styles.input, flex: 1 }}>
            {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <input
            placeholder="Año" type="number"
            value={anio} onChange={e => setAnio(e.target.value)}
            style={{ ...styles.input, width: "90px" }}
          />
        </div>

        <button onClick={guardar} style={styles.botonGuardar}>Guardar</button>
      </div>
    </div>
  )
}

const styles = {
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  volver: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#C7CDD6" },
  titulo: { margin: 0, fontSize: "22px", color: "#FFFFFF" },
  labelSeccion: { fontSize: "13px", color: "#8A93A3", marginBottom: "6px", display: "block" },
  selectorRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  tipoBtn: { flex: 1, padding: "13px", fontSize: "15px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", color: "#8A93A3" },
  input: { padding: "12px", fontSize: "16px", borderRadius: "8px", border: "1px solid #2C3440", backgroundColor: "#232A33", color: "#FFFFFF" },
  row: { display: "flex", gap: "8px" },
  preview: { fontSize: "14px", color: "#FF9F43", margin: "0", fontWeight: "bold" },
  botonGuardar: { marginTop: "12px", padding: "14px", fontSize: "16px", borderRadius: "10px", border: "none", backgroundColor: "#7C5CFF", color: "white", cursor: "pointer", fontWeight: "bold" }
}
