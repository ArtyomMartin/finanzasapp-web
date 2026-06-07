// src/theme/estilos.js
// ─────────────────────────────────────────────────────────────────────────────
// Objetos de estilo reutilizables. Se nutren de colores.js.
// Estética: flat retro "Google Pills" — bordes sólidos, sin blur, sin sombras suaves.
// ─────────────────────────────────────────────────────────────────────────────

import { COLORES } from "./colores"

// ── Layout ────────────────────────────────────────────────────────────────────

export const estiloPantalla = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: COLORES.fondoApp,
  color: COLORES.texto,
  overflowX: "hidden",
  maxWidth: "900px",
  margin: "0 auto",
  padding: "0 16px",
  width: "100%",
  position: "relative",
}

export const estiloContainer = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: COLORES.fondoApp,
  color: COLORES.texto,
  overflowX: "hidden",
  maxWidth: "900px",
  margin: "0 auto",
  width: "100%",
  position: "relative",
}

export const estiloHeader = {
  position: "sticky",
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  background: COLORES.fondoApp,
  borderBottom: `1px solid ${COLORES.bordeBlanco}`,
  zIndex: 10,
  boxSizing: "border-box",
}

// ── Tarjetas / Cajas ──────────────────────────────────────────────────────────

export const estiloBox = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: COLORES.fondoTarjeta,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: "16px",
  padding: "32px 24px",
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
  fontSize: "15px",
  fontWeight: "600",
  borderRadius: "12px",
  border: `1px solid ${COLORES.borde}`,
  backgroundColor: COLORES.primario,
  color: COLORES.fondoApp,
  cursor: "pointer",
  transition: "box-shadow 0.15s ease, transform 0.15s ease",
}

export const estiloBotonSecundario = {
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "500",
  borderRadius: "12px",
  border: `1px solid ${COLORES.borde}`,
  backgroundColor: COLORES.fondoTarjeta,
  color: COLORES.textoSecundario,
  cursor: "pointer",
  transition: "box-shadow 0.15s ease, transform 0.15s ease",
}

export const estiloBotonOpcion = {
  flex: 1,
  padding: "12px 14px",
  fontSize: "14px",
  fontWeight: "500",
  borderRadius: "20px",
  border: `1px solid ${COLORES.borde}`,
  backgroundColor: COLORES.fondoOpcion,
  color: COLORES.textoSecundario,
  cursor: "pointer",
  transition: "box-shadow 0.15s ease, transform 0.15s ease",
}

export const estiloBotonOpcionActivo = {
  ...estiloBotonOpcion,
  backgroundColor: COLORES.fondoOpcionActiva,
  color: COLORES.texto,
  fontWeight: "700",
  boxShadow: COLORES.sombraHover,
}

export const estiloBotonIcono = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: COLORES.texto,
  padding: "4px",
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export const estiloInput = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "15px",
  borderRadius: "10px",
  border: `1px solid ${COLORES.borde}`,
  backgroundColor: COLORES.fondoInput,
  color: COLORES.texto,
  marginBottom: "12px",
  boxSizing: "border-box",
  outline: "none",
}

// ── Tipografía ────────────────────────────────────────────────────────────────

export const estiloTitulo = {
  fontSize: "22px",
  fontWeight: "700",
  color: COLORES.texto,
  marginBottom: "8px",
  textAlign: "center",
}

export const estiloSubtitulo = {
  fontSize: "14px",
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
  padding: "10px 14px",
  backgroundColor: COLORES.fondoFondo,
  border: `1px solid ${COLORES.bordeBlanco}`,
  borderRadius: "10px",
}

// ── Overlay ───────────────────────────────────────────────────────────────────

export const estiloOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: COLORES.fondoOverlay,
  zIndex: 100,
}

// ── Bottom Sheet (DEPRECADO — usar estiloPopup en pantallas nuevas) ────────────

export const estiloBottomSheet = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  width: "100%",
  maxWidth: "900px",
  backgroundColor: COLORES.fondoBottomSheet,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: "20px 20px 0 0",
  zIndex: 102,
  transition: "transform 0.3s ease",
  maxHeight: "85vh",
  display: "flex",
  flexDirection: "column",
}

// ── Popup ─────────────────────────────────────────────────────────────────────
// Usar siempre con createPortal(content, document.body)

export const estiloPopupOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: COLORES.fondoOverlay,
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
  border: `1px solid ${COLORES.borde}`,
  borderRadius: "16px",
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
  padding: "12px 10px",
  textAlign: "right",
  fontWeight: "600",
  fontSize: "11px",
  color: COLORES.textoMuted,
  backgroundColor: COLORES.fondoPanel,
  borderBottom: `1px solid ${COLORES.bordeBlanco}`,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
}

export const estiloTd = {
  padding: "12px 10px",
  textAlign: "right",
  whiteSpace: "nowrap",
  borderBottom: `1px solid ${COLORES.bordeBlanco}`,
}

// ── Wizard ────────────────────────────────────────────────────────────────────

export const estiloWizard = {
  titulo: { fontSize: "18px", fontWeight: "700", color: COLORES.texto, marginBottom: "20px" },
  pasoIndicador: { fontSize: "11px", color: COLORES.textoMuted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" },
  progreso: { width: "100%", height: "4px", backgroundColor: COLORES.bordeBlanco, borderRadius: "2px", marginBottom: "24px", overflow: "hidden", border: `1px solid ${COLORES.bordeBlanco}` },
  progresoBar: { height: "100%", backgroundColor: COLORES.primario, borderRadius: "2px", transition: "width 0.3s ease" },
  botonesRow: { display: "flex", gap: "12px", marginTop: "24px" },
  opcionesRow: { display: "flex", gap: "8px", marginBottom: "24px" },
}
