// src/theme/estilos.js
// ─────────────────────────────────────────────────────────────────────────────
// Objetos de estilo reutilizables. Se nutren de colores.js.
// Importar con: import { estiloBoton, estiloTarjeta, ... } from "../theme/estilos"
// ─────────────────────────────────────────────────────────────────────────────

import { COLORES, BLUR } from "./colores"

// ── Layout ────────────────────────────────────────────────────────────────────

export const estiloPantalla = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: COLORES.fondoApp,
  backdropFilter: BLUR.app,
  WebkitBackdropFilter: BLUR.app,
  color: COLORES.textoBlanco,
  overflowX: "hidden",
  maxWidth: "900px",
  margin: "0 auto",
  padding: "0 16px",
  width: "100%",
  position: "relative"
}

export const estiloContainer = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: COLORES.fondoApp,
  backdropFilter: BLUR.app,
  WebkitBackdropFilter: BLUR.app,
  color: COLORES.textoBlanco,
  overflowX: "hidden",
  maxWidth: "900px",
  margin: "0 auto",
  width: "100%",
  position: "relative"
}

export const estiloHeader = {
  position: "sticky",
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 35px",
  background: "transparent",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  borderBottom: `0 solid ${COLORES.borde}`,
  zIndex: 10,
  boxSizing: "border-box",
}

// ── Tarjetas / Cajas ──────────────────────────────────────────────────────────

export const estiloBox = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: COLORES.fondoTarjeta,
  backdropFilter: BLUR.panel,
  WebkitBackdropFilter: BLUR.panel,
  border: `1px solid ${COLORES.bordeBlanco}`,
  borderRadius: "20px",
  padding: "32px 24px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

export const estiloWizardBox = {
  ...estiloBox,
  alignItems: "stretch",
}

export const estiloTarjeta = {
  backgroundColor: COLORES.fondoTarjeta,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: "12px",
  overflow: "hidden",
}

// ── Botones ───────────────────────────────────────────────────────────────────

export const estiloBotonPrimario = {
  width: "100%",
  padding: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: COLORES.primarioAlpha,
  color: COLORES.textoBlanco,
  cursor: "pointer",
  fontWeight: "bold",
}

export const estiloBotonSecundario = {
  padding: "14px 20px",
  fontSize: "15px",
  borderRadius: "12px",
  border: `1px solid ${COLORES.borde}`,
  backgroundColor: COLORES.fondoOpcion,
  color: COLORES.textoSecundario,
  cursor: "pointer",
}

export const estiloBotonOpcion = {
  flex: 1,
  padding: "14px",
  fontSize: "15px",
  borderRadius: "10px",
  border: `2px solid ${COLORES.borde}`,
  backgroundColor: COLORES.fondoOpcion,
  color: COLORES.textoSecundario,
  cursor: "pointer",
  transition: "all 0.2s",
}

export const estiloBotonOpcionActivo = {
  ...estiloBotonOpcion,
  borderColor: COLORES.primario,
  backgroundColor: COLORES.primarioSuave,
  color: COLORES.acento,
  fontWeight: "bold",
}

export const estiloBotonIcono = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: COLORES.acento,
  padding: "4px",
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export const estiloInput = {
  width: "100%",
  padding: "13px",
  fontSize: "16px",
  borderRadius: "10px",
  border: `1px solid ${COLORES.bordePanel}`,
  backgroundColor: COLORES.fondoInput,
  color: COLORES.textoBlanco,
  marginBottom: "12px",
  boxSizing: "border-box",
  outline: "none",
}

// ── Tipografía ────────────────────────────────────────────────────────────────

export const estiloTitulo = {
  fontSize: "24px",
  fontWeight: "bold",
  color: COLORES.textoBlanco,
  marginBottom: "8px",
  textAlign: "center",
}

export const estiloSubtitulo = {
  fontSize: "15px",
  color: COLORES.textoSecundario,
  textAlign: "center",
  marginBottom: "8px",
}

export const estiloLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: COLORES.textoMuted,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
}

export const estiloAyuda = {
  fontSize: "13px",
  color: COLORES.textoMuted,
  marginTop: "12px",
  lineHeight: "1.5",
  padding: "10px",
  backgroundColor: COLORES.fondoFondo,
  borderRadius: "8px",
}

// ── Bottom Sheet (DEPRECADO — usar estiloPopup en pantallas nuevas) ────────────
// Mantener por compatibilidad con pantallas que aún no se migraron.
// PROBLEMA: position:fixed dentro de un ancestro con backdropFilter queda
// atrapado en ese stacking context y no se ancla al viewport real.
// SOLUCIÓN: usar createPortal(content, document.body) + estiloPopupOverlay/estiloPopup

export const estiloOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: COLORES.fondoOverlay,
  backdropFilter: BLUR.overlay,
  zIndex: 100,
}

export const estiloBottomSheet = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  width: "100%",
  maxWidth: "900px",
  backgroundColor: COLORES.fondoBottomSheet,
  backdropFilter: BLUR.sheet,
  WebkitBackdropFilter: BLUR.sheet,
  border: `1px solid ${COLORES.bordeBlanco10}`,
  borderRadius: "24px 24px 0 0",
  boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
  zIndex: 102,
  transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1)",
  maxHeight: "85vh",
  display: "flex",
  flexDirection: "column",
}

// ── Popup (reemplaza Bottom Sheet) ────────────────────────────────────────────
// Usar SIEMPRE con createPortal(content, document.body) para escapar del
// stacking context que genera backdropFilter en estiloPantalla/estiloContainer.
//
// Patrón de uso en cualquier pantalla:
//
//   import { createPortal } from "react-dom"
//   import { estiloPopupOverlay, estiloPopup } from "../theme"
//
//   {abierto && createPortal(
//     <div style={estiloPopupOverlay} onClick={cerrar}>
//       <div style={estiloPopup} onClick={e => e.stopPropagation()}>
//         {/* contenido */}
//       </div>
//     </div>,
//     document.body
//   )}
//
// Animación sugerida (en tu CSS global):
//   @keyframes popupIn {
//     from { opacity: 0; transform: scale(0.95) translateY(8px); }
//     to   { opacity: 1; transform: scale(1)    translateY(0);   }
//   }

export const estiloPopupOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: COLORES.fondoOverlay,
  backdropFilter: BLUR.overlay,
  WebkitBackdropFilter: BLUR.overlay,
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  boxSizing: "border-box",
}

export const estiloPopup = {
  width: "100%",
  maxWidth: "480px",
  maxHeight: "80vh",
  backgroundColor: COLORES.fondoBottomSheet,
  backdropFilter: BLUR.sheet,
  WebkitBackdropFilter: BLUR.sheet,
  border: `1px solid ${COLORES.bordeBlanco10}`,
  borderRadius: "20px",
  boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

// ── Tabla ─────────────────────────────────────────────────────────────────────

export const estiloTabla = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "14px",
  backgroundColor: COLORES.fondoTarjeta,
  borderRadius: "12px",
  overflow: "hidden",
  border: `1px solid ${COLORES.borde}`,
}

export const estiloTh = {
  padding: "14px 10px",
  textAlign: "right",
  fontWeight: "bold",
  fontSize: "12px",
  color: COLORES.textoMuted,
  backgroundColor: COLORES.fondoPanel,
  borderBottom: `1px solid ${COLORES.borde}`,
  textTransform: "uppercase",
}

export const estiloTd = {
  padding: "14px 10px",
  textAlign: "right",
  whiteSpace: "nowrap",
}

// ── Wizard ────────────────────────────────────────────────────────────────────

export const estiloWizard = {
  titulo: { fontSize: "18px", fontWeight: "bold", color: COLORES.textoBlanco, marginBottom: "20px" },
  pasoIndicador: { fontSize: "12px", color: COLORES.textoMuted, marginBottom: "8px", textTransform: "uppercase" },
  progreso: { width: "100%", height: "4px", backgroundColor: "rgba(44,52,64,0.5)", borderRadius: "2px", marginBottom: "24px", overflow: "hidden" },
  progresoBar: { height: "100%", backgroundColor: COLORES.primario, borderRadius: "2px", transition: "width 0.3s ease" },
  botonesRow: { display: "flex", gap: "12px", marginTop: "24px" },
  opcionesRow: { display: "flex", gap: "12px", marginBottom: "24px" },
}