// src/components/WizardModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wizard genérico reutilizable. Se monta con createPortal sobre document.body.
//
// DISEÑO CLAVE:
//   El state vive SIEMPRE en el padre, no en este componente.
//   Esto permite que el padre recalcule `pasos` en cada render según el state,
//   logrando wizards completamente dinámicos: pasos que aparecen/desaparecen,
//   ramificaciones según opciones elegidas, etc.
//
// USO:
//   const [wiz, setWiz] = useState({ tipo: null, monto: 0, cuotas: 1 })
//
//   const pasos = [
//     {
//       titulo: "¿Qué tipo?",
//       contenido: (wiz, setWiz) => <BotonesOpciones ... />,
//       puedeAvanzar: (wiz) => wiz.tipo !== null,   // opcional
//     },
//     // paso condicional: solo aparece si tipo === "cuotas"
//     ...(wiz.tipo === "cuotas" ? [{
//       titulo: "¿Cuántas cuotas?",
//       contenido: (wiz, setWiz) => <InputCuotas ... />,
//     }] : []),
//   ]
//
//   <WizardModal
//     pasos={pasos}
//     state={wiz}
//     setState={setWiz}
//     onFin={() => guardar(wiz)}
//     onCerrar={() => setAbierto(false)}
//     titulo="Nuevo crédito"    // opcional: título fijo en encabezado
//     labelFin="✓ Guardar"     // opcional: texto botón final
//   />
//
// NOTAS:
//   - `pasos` se recalcula en cada render del padre → ramificaciones automáticas.
//   - Si el paso actual queda fuera de rango al cambiar pasos dinámicamente,
//     el wizard se ajusta al último paso disponible.
//   - Cerrar overlay o botón ✕ llama a onCerrar sin guardar.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { COLORES, BLUR } from "../theme/colores"
import { estiloBotonPrimario, estiloBotonSecundario, estiloWizard } from "../theme/estilos"

export default function WizardModal({
  pasos,
  state,
  setState,
  onFin,
  onCerrar,
  titulo = null,
  labelFin = "✓ Finalizar",
}) {
  const [pasoActual, setPasoActual] = useState(0)

  // Si los pasos cambian y el índice queda fuera de rango, lo corregimos
  useEffect(() => {
    if (pasoActual >= pasos.length) {
      setPasoActual(Math.max(0, pasos.length - 1))
    }
  }, [pasos.length])

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
      <style>{`
        @keyframes wizardFadeIn  { from { opacity: 0; }                              to { opacity: 1; } }
        @keyframes wizardSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.72)",
          backdropFilter: BLUR.overlay,
          WebkitBackdropFilter: BLUR.overlay,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
          animation: "wizardFadeIn 0.2s ease",
        }}
        onClick={onCerrar}
      >
        {/* Panel */}
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            backgroundColor: "rgba(22, 26, 32, 0.97)",
            backdropFilter: BLUR.sheet,
            WebkitBackdropFilter: BLUR.sheet,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "wizardSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: COLORES.textoBlanco }}>
              {titulo || paso.titulo}
            </span>
            <button
              onClick={onCerrar}
              style={{ background: "none", border: "none", cursor: "pointer", color: COLORES.textoMuted, fontSize: "18px", lineHeight: 1, padding: "4px" }}
            >
              ✕
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

          {/* Contenido — scrollable */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 4px" }}>
            {paso.contenido(state, setState)}
          </div>

          {/* Botones */}
          <div style={{ padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "12px" }}>
            <button style={{ ...estiloBotonSecundario, flex: "0 0 auto" }} onClick={atras}>
              {pasoActual === 0 ? "✕ Cancelar" : "← Atrás"}
            </button>
            <button
              style={{
                ...estiloBotonPrimario,
                flex: 1,
                opacity: puedeAvanzar ? 1 : 0.4,
                cursor: puedeAvanzar ? "pointer" : "not-allowed",
                ...(esUltimo ? { backgroundColor: "rgba(67, 160, 71, 0.85)" } : {}),
              }}
              onClick={siguiente}
              disabled={!puedeAvanzar}
            >
              {esUltimo ? labelFin : "Siguiente →"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
