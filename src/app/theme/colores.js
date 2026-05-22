// src/theme/colores.js
// ─────────────────────────────────────────────────────────────────────────────
// Paleta completa de la app. Cambiar aquí afecta toda la interfaz.
// Los valores de COLORES apuntan a CSS variables inyectadas en document.body
// por AppContext según el tema activo.
// ─────────────────────────────────────────────────────────────────────────────

// ── Tema Original (dark tech) ─────────────────────────────────────────────────
export const TEMA_ORIGINAL = {
  "--c-fondo-app":          "rgba(15, 17, 21, 0.80)",
  "--c-fondo-panel":        "rgba(22, 26, 32, 0.80)",
  "--c-fondo-tarjeta":      "rgba(28, 33, 40, 0.75)",
  "--c-fondo-input":        "rgba(35, 42, 51, 0.70)",
  "--c-fondo-opcion":       "rgba(28, 33, 40, 0.70)",
  "--c-fondo-opcion-activa":"rgba(42, 36, 64, 0.80)",
  "--c-fondo-fondo":        "rgba(42, 36, 64, 0.40)",
  "--c-fondo-overlay":      "rgba(0, 0, 0, 0.70)",
  "--c-fondo-bottom-sheet": "rgba(22, 26, 32, 0.95)",
  "--c-fondo":              "rgba(15, 17, 21, 0.95)",

  "--c-borde":              "rgba(44, 52, 64, 0.8)",
  "--c-borde-panel":        "rgba(44, 52, 64, 0.9)",
  "--c-borde-blanco":       "rgba(255, 255, 255, 0.06)",
  "--c-borde-blanco10":     "rgba(255, 255, 255, 0.1)",

  "--c-texto":              "#FFFFFF",
  "--c-texto-blanco":       "#FFFFFF",
  "--c-texto-secundario":   "#C7CDD6",
  "--c-texto-muted":        "#8A93A3",

  "--c-primario":           "#7C5CFF",
  "--c-primario-alpha":     "rgba(124, 92, 255, 0.85)",
  "--c-primario-suave":     "rgba(42, 36, 64, 0.80)",
  "--c-primario-oscuro":    "#5a3fd4",
  "--c-acento":             "#A48BFF",

  "--c-positivo":           "#3DDC97",
  "--c-neutro":             "#4DA3FF",
  "--c-advertencia":        "#FF9F43",
  "--c-negativo":           "#FF5C5C",
  "--c-peligro":            "#FF8B8B",
  "--c-exito":              "#4ade80",

  "--c-credito":            "#4DA3FF",
  "--c-reposicion":         "#3DDC97",

  "--c-sync-ok":            "#4ade80",
  "--c-sync-error":         "#f87171",
}

// ── Tema Pink White (pastel rosado claro) ─────────────────────────────────────
export const TEMA_PINK_WHITE = {
  "--c-fondo-app":          "rgba(255, 240, 245, 0.80)",
  "--c-fondo-panel":        "rgba(255, 228, 236, 0.80)",
  "--c-fondo-tarjeta":      "rgba(255, 235, 242, 0.75)",
  "--c-fondo-input":        "rgba(255, 245, 248, 0.70)",
  "--c-fondo-opcion":       "rgba(255, 228, 236, 0.70)",
  "--c-fondo-opcion-activa":"rgba(255, 182, 210, 0.80)",
  "--c-fondo-fondo":        "rgba(255, 200, 220, 0.40)",
  "--c-fondo-overlay":      "rgba(180, 80, 120, 0.70)",
  "--c-fondo-bottom-sheet": "rgba(255, 235, 242, 0.95)",
  "--c-fondo":              "rgba(255, 240, 245, 0.95)",

  "--c-borde":              "rgba(220, 150, 180, 0.45)",
  "--c-borde-panel":        "rgba(220, 150, 180, 0.60)",
  "--c-borde-blanco":       "rgba(255, 180, 210, 0.20)",
  "--c-borde-blanco10":     "rgba(255, 180, 210, 0.30)",

  "--c-texto":              "#4A2040",
  "--c-texto-blanco":       "#4A2040",
  "--c-texto-secundario":   "#8B4A6B",
  "--c-texto-muted":        "#B87A9A",

  "--c-primario":           "#E8649A",
  "--c-primario-alpha":     "rgba(232, 100, 154, 0.85)",
  "--c-primario-suave":     "rgba(255, 200, 220, 0.60)",
  "--c-primario-oscuro":    "#c44880",
  "--c-acento":             "#F0A0C0",

  "--c-positivo":           "#6DC5A0",
  "--c-neutro":             "#85B4E8",
  "--c-advertencia":        "#F0A060",
  "--c-negativo":           "#E87878",
  "--c-peligro":            "#E89090",
  "--c-exito":              "#6DC5A0",

  "--c-credito":            "#85B4E8",
  "--c-reposicion":         "#6DC5A0",

  "--c-sync-ok":            "#6DC5A0",
  "--c-sync-error":         "#E87878",
}

// ── Tema Pink Dark (rosado oscuro / ciruela) ──────────────────────────────────
export const TEMA_PINK_DARK = {
  "--c-fondo-app":          "rgba(25, 15, 20, 0.80)",
  "--c-fondo-panel":        "rgba(32, 20, 28, 0.80)",
  "--c-fondo-tarjeta":      "rgba(40, 25, 35, 0.75)",
  "--c-fondo-input":        "rgba(45, 30, 40, 0.70)",
  "--c-fondo-opcion":       "rgba(32, 20, 28, 0.70)",
  "--c-fondo-opcion-activa":"rgba(70, 35, 55, 0.80)",
  "--c-fondo-fondo":        "rgba(70, 35, 55, 0.40)",
  "--c-fondo-overlay":      "rgba(0, 0, 0, 0.70)",
  "--c-fondo-bottom-sheet": "rgba(32, 20, 28, 0.95)",
  "--c-fondo":              "rgba(25, 15, 20, 0.95)",

  "--c-borde":              "rgba(90, 50, 70, 0.80)",
  "--c-borde-panel":        "rgba(90, 50, 70, 0.90)",
  "--c-borde-blanco":       "rgba(255, 255, 255, 0.06)",
  "--c-borde-blanco10":     "rgba(255, 255, 255, 0.10)",

  "--c-texto":              "#FFFFFF",
  "--c-texto-blanco":       "#FFFFFF",
  "--c-texto-secundario":   "#DDBBD0",
  "--c-texto-muted":        "#A07A90",

  "--c-primario":           "#E8649A",
  "--c-primario-alpha":     "rgba(232, 100, 154, 0.85)",
  "--c-primario-suave":     "rgba(120, 50, 80, 0.80)",
  "--c-primario-oscuro":    "#c44880",
  "--c-acento":             "#F0A0C0",

  "--c-positivo":           "#6DC5A0",
  "--c-neutro":             "#85B4E8",
  "--c-advertencia":        "#F0A060",
  "--c-negativo":           "#E87878",
  "--c-peligro":            "#E89090",
  "--c-exito":              "#6DC5A0",

  "--c-credito":            "#85B4E8",
  "--c-reposicion":         "#6DC5A0",

  "--c-sync-ok":            "#6DC5A0",
  "--c-sync-error":         "#E87878",
}

// ── Tema Estándar Dark (azul marino · finanzas clásico oscuro) ────────────────
export const TEMA_ESTANDAR_DARK = {
  "--c-fondo-app":           "rgba(10, 15, 28, 0.80)",
  "--c-fondo-panel":         "rgba(16, 24, 42, 0.80)",
  "--c-fondo-tarjeta":       "rgba(20, 30, 52, 0.75)",
  "--c-fondo-input":         "rgba(26, 38, 62, 0.70)",
  "--c-fondo-opcion":        "rgba(20, 30, 52, 0.70)",
  "--c-fondo-opcion-activa": "rgba(26, 54, 100, 0.80)",
  "--c-fondo-fondo":         "rgba(26, 54, 100, 0.40)",
  "--c-fondo-overlay":       "rgba(0, 8, 24, 0.70)",
  "--c-fondo-bottom-sheet":  "rgba(16, 24, 42, 0.95)",
  "--c-fondo":               "rgba(10, 15, 28, 0.95)",

  "--c-borde":               "rgba(38, 60, 100, 0.80)",
  "--c-borde-panel":         "rgba(38, 60, 100, 0.95)",
  "--c-borde-blanco":        "rgba(255, 255, 255, 0.05)",
  "--c-borde-blanco10":      "rgba(255, 255, 255, 0.10)",

  "--c-texto":               "#E8EDF5",
  "--c-texto-blanco":        "#E8EDF5",
  "--c-texto-secundario":    "#9DAFC8",
  "--c-texto-muted":         "#5C7498",

  "--c-primario":            "#2E7CF6",
  "--c-primario-alpha":      "rgba(46, 124, 246, 0.85)",
  "--c-primario-suave":      "rgba(26, 54, 100, 0.80)",
  "--c-primario-oscuro":     "#1a56c4",
  "--c-acento":              "#6AAAFB",

  "--c-positivo":            "#22C55E",
  "--c-neutro":              "#38BDF8",
  "--c-advertencia":         "#F59E0B",
  "--c-negativo":            "#EF4444",
  "--c-peligro":             "#FCA5A5",
  "--c-exito":               "#4ade80",

  "--c-credito":             "#38BDF8",
  "--c-reposicion":          "#22C55E",

  "--c-sync-ok":             "#4ade80",
  "--c-sync-error":          "#f87171",
}

// ── Tema Estándar White (blanco · finanzas clásico claro) ─────────────────────
export const TEMA_ESTANDAR_WHITE = {
  "--c-fondo-app":           "rgba(244, 246, 250, 0.80)",
  "--c-fondo-panel":         "rgba(232, 237, 246, 0.80)",
  "--c-fondo-tarjeta":       "rgba(255, 255, 255, 0.75)",
  "--c-fondo-input":         "rgba(255, 255, 255, 0.70)",
  "--c-fondo-opcion":        "rgba(232, 237, 246, 0.70)",
  "--c-fondo-opcion-activa": "rgba(210, 225, 252, 0.80)",
  "--c-fondo-fondo":         "rgba(210, 225, 252, 0.40)",
  "--c-fondo-overlay":       "rgba(30, 60, 120, 0.70)",
  "--c-fondo-bottom-sheet":  "rgba(255, 255, 255, 0.95)",
  "--c-fondo":               "rgba(244, 246, 250, 0.95)",

  "--c-borde":               "rgba(180, 200, 230, 0.70)",
  "--c-borde-panel":         "rgba(180, 200, 230, 0.90)",
  "--c-borde-blanco":        "rgba(100, 140, 200, 0.12)",
  "--c-borde-blanco10":      "rgba(100, 140, 200, 0.20)",

  "--c-texto":               "#0F2147",
  "--c-texto-blanco":        "#0F2147",
  "--c-texto-secundario":    "#3A5A8A",
  "--c-texto-muted":         "#7A9ABE",

  "--c-primario":            "#1A56C4",
  "--c-primario-alpha":      "rgba(26, 86, 196, 0.88)",
  "--c-primario-suave":      "rgba(210, 225, 252, 0.70)",
  "--c-primario-oscuro":     "#0d3a8e",
  "--c-acento":              "#2E7CF6",

  "--c-positivo":            "#16A34A",
  "--c-neutro":              "#0284C7",
  "--c-advertencia":         "#D97706",
  "--c-negativo":            "#DC2626",
  "--c-peligro":             "#EF4444",
  "--c-exito":               "#16A34A",

  "--c-credito":             "#0284C7",
  "--c-reposicion":          "#16A34A",

  "--c-sync-ok":             "#16A34A",
  "--c-sync-error":          "#DC2626",
}

// ── COLORES — apunta a CSS variables (funciona con cualquier tema) ─────────────
export const COLORES = {
  fondoApp:          "var(--c-fondo-app)",
  fondoPanel:        "var(--c-fondo-panel)",
  fondoTarjeta:      "var(--c-fondo-tarjeta)",
  fondoInput:        "var(--c-fondo-input)",
  fondoOpcion:       "var(--c-fondo-opcion)",
  fondoOpcionActiva: "var(--c-fondo-opcion-activa)",
  fondoFondo:        "var(--c-fondo-fondo)",
  fondoOverlay:      "var(--c-fondo-overlay)",
  fondoBottomSheet:  "var(--c-fondo-bottom-sheet)",
  fondo:             "var(--c-fondo)",

  borde:             "var(--c-borde)",
  bordePanel:        "var(--c-borde-panel)",
  bordeBlanco:       "var(--c-borde-blanco)",
  bordeBlanco10:     "var(--c-borde-blanco10)",

  texto:             "var(--c-texto)",
  textoBlanco:       "var(--c-texto-blanco)",
  textoSecundario:   "var(--c-texto-secundario)",
  textoMuted:        "var(--c-texto-muted)",

  primario:          "var(--c-primario)",
  primarioAlpha:     "var(--c-primario-alpha)",
  primarioSuave:     "var(--c-primario-suave)",
  primarioOscuro:    "var(--c-primario-oscuro)",
  acento:            "var(--c-acento)",

  positivo:          "var(--c-positivo)",
  neutro:            "var(--c-neutro)",
  advertencia:       "var(--c-advertencia)",
  negativo:          "var(--c-negativo)",
  peligro:           "var(--c-peligro)",
  exito:             "var(--c-exito)",

  credito:           "var(--c-credito)",
  reposicion:        "var(--c-reposicion)",

  syncOk:            "var(--c-sync-ok)",
  syncError:         "var(--c-sync-error)",
}

export const BLUR = {
  panel:   "blur(12px)",
  app:     "blur(10px)",
  sheet:   "blur(16px)",
  overlay: "blur(4px)",
}

// ── Helper para inyectar un tema en document.body ─────────────────────────────
export function aplicarTema(tema) {
  let vars
  if (tema === "pink-white")          vars = TEMA_PINK_WHITE
  else if (tema === "pink-dark")      vars = TEMA_PINK_DARK
  else if (tema === "estandar-dark")  vars = TEMA_ESTANDAR_DARK
  else if (tema === "estandar-white") vars = TEMA_ESTANDAR_WHITE
  else                                vars = TEMA_ORIGINAL
  
  Object.entries(vars).forEach(([key, value]) => {
    document.body.style.setProperty(key, value)
  })
}