// src/components/WizardModal.jsx
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { COLORES } from "../theme/colores"
import { estiloBotonPrimario, estiloBotonSecundario, estiloWizard } from "../theme/estilos"
import { X, ArrowLeft, ArrowRight, Check } from "lucide-react"

export default function WizardModal({
  pasos, state, setState, onFin, onCerrar,
  titulo = null, labelFin = <><Check size={16} /> Finalizar</>,
}) {
  const [pasoActual, setPasoActual] = useState(0)

  useEffect(() => {
    if (pasoActual >= pasos.length) setPasoActual(Math.max(0, pasos.length - 1))
  }, [pasos.length])

  // Oculta la barra de navegación inferior mientras el wizard está abierto:
  // en Android el teclado la empuja hacia arriba y tapa el contenido del modal.
  useEffect(() => {
    document.body.classList.add("wizard-abierto")
    return () => document.body.classList.remove("wizard-abierto")
  }, [])

  const total        = pasos.length
  const paso         = pasos[pasoActual]
  const esUltimo     = pasoActual === total - 1
  const puedeAvanzar = paso?.puedeAvanzar ? paso.puedeAvanzar(state) : true

  function siguiente() {
    if (!puedeAvanzar) return
    if (esUltimo) { onFin(state) } else { setPasoActual(p => p + 1) }
  }

  function atras() {
    if (pasoActual === 0) { onCerrar() } else { setPasoActual(p => p - 1) }
  }

  if (!paso) return null

  const porcentaje = ((pasoActual + 1) / total) * 100

  return createPortal(
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: COLORES.fondoOverlay,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
        }}
        onClick={onCerrar}
      >
        {/* Panel */}
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            backgroundColor: COLORES.fondoBottomSheet,
            border: `1px solid ${COLORES.borde}`,
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: COLORES.texto }}>
              {titulo || paso.titulo}
            </span>
            <button
              onClick={onCerrar}
              style={{ background: "none", border: "none", cursor: "pointer", color: COLORES.textoMuted, lineHeight: 1, padding: "4px", display: "flex" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Progreso */}
          <div style={{ padding: "12px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={estiloWizard.pasoIndicador}>Paso {pasoActual + 1} de {total}</span>
              {titulo && <span style={{ fontSize: "12px", color: COLORES.textoMuted }}>{paso.titulo}</span>}
            </div>
            <div style={estiloWizard.progreso}>
              <div style={{ ...estiloWizard.progresoBar, width: `${porcentaje}%` }} />
            </div>
          </div>

          {/* Contenido */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 4px" }}>
            {paso.contenido(state, setState)}
          </div>

          {/* Botones */}
          <div style={{
            padding: "16px 24px 24px",
            borderTop: `1px solid ${COLORES.bordeBlanco}`,
            display: "flex",
            gap: "12px",
          }}>
            <button style={{ ...estiloBotonSecundario, flex: "0 0 auto", display: "flex", alignItems: "center", gap: "6px" }} onClick={atras}>
              {pasoActual === 0 ? <><X size={16} /> Cancelar</> : <><ArrowLeft size={16} /> Atrás</>}
            </button>
            <button
              style={{
                ...estiloBotonPrimario,
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                opacity: puedeAvanzar ? 1 : 0.4,
                cursor: puedeAvanzar ? "pointer" : "not-allowed",
                ...(esUltimo ? { backgroundColor: COLORES.positivo, color: COLORES.fondoApp, borderColor: COLORES.positivo } : {}),
              }}
              onClick={siguiente}
              disabled={!puedeAvanzar}
            >
              {esUltimo ? labelFin : <>Siguiente <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}