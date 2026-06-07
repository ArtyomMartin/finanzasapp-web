// src/theme/colores.js

// TEMAS DISPONIBLES:
//   "retro-flat"      → claro, gris hueso, bordes negros
//   "retro-flat-dark" → oscuro suave, gris pizarra, bajo contraste

export const TEMA_RETRO_FLAT = {
  "--c-fondo-app":           "#f5f5f0",
  "--c-fondo-panel":         "#ececea",
  "--c-fondo-tarjeta":       "#ffffff",
  "--c-fondo-input":         "#ffffff",
  "--c-fondo-opcion":        "#f0f0eb",
  "--c-fondo-opcion-activa": "#dbeafe",
  "--c-fondo-fondo":         "#e8e8e2",
  "--c-fondo-overlay":       "rgba(26, 26, 26, 0.55)",
  "--c-fondo-bottom-sheet":  "#ffffff",
  "--c-fondo":               "#f5f5f0",

  "--c-borde":               "#1a1a1a",
  "--c-borde-panel":         "#1a1a1a",
  "--c-borde-blanco":        "#d4d4cc",
  "--c-borde-blanco10":      "#c8c8c0",

  "--c-texto":               "#1a1a1a",
  "--c-texto-blanco":        "#1a1a1a",
  "--c-texto-secundario":    "#555555",
  "--c-texto-muted":         "#888888",

  "--c-primario":            "#1a1a1a",
  "--c-primario-alpha":      "rgba(26, 26, 26, 0.88)",
  "--c-primario-suave":      "#dbeafe",
  "--c-primario-oscuro":     "#000000",
  "--c-acento":              "#555555",

  "--c-positivo":            "#16a34a",
  "--c-neutro":              "#2563eb",
  "--c-advertencia":         "#d97706",
  "--c-negativo":            "#dc2626",
  "--c-peligro":             "#ef4444",
  "--c-exito":               "#16a34a",

  "--c-credito":             "#2563eb",
  "--c-reposicion":          "#16a34a",
  "--c-sync-ok":             "#16a34a",
  "--c-sync-error":          "#dc2626",

  "--c-pill-blue":           "#C2D7FF",
  "--c-pill-green":          "#C4EFD4",
  "--c-pill-red":            "#FFD0CC",
  "--c-pill-yellow":         "#FFF0B3",
  "--c-pill-purple":         "#E4CFFF",
  "--c-pill-orange":         "#FFE0C2",
  "--c-sombra-hover":        "2px 3px 0 #1a1a1a",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_RETRO_FLAT_DARK = {
  "--c-fondo-app":           "#2c2c2e",
  "--c-fondo-panel":         "#333336",
  "--c-fondo-tarjeta":       "#3a3a3d",
  "--c-fondo-input":         "#3a3a3d",
  "--c-fondo-opcion":        "#333336",
  "--c-fondo-opcion-activa": "#4a4a55",
  "--c-fondo-fondo":         "#4a4a55",
  "--c-fondo-overlay":       "rgba(0, 0, 0, 0.55)",
  "--c-fondo-bottom-sheet":  "#3a3a3d",
  "--c-fondo":               "#2c2c2e",

  "--c-borde":               "#c8c8c4",
  "--c-borde-panel":         "#c8c8c4",
  "--c-borde-blanco":        "#505054",
  "--c-borde-blanco10":      "#606064",

  "--c-texto":               "#e8e8e4",
  "--c-texto-blanco":        "#e8e8e4",
  "--c-texto-secundario":    "#b0b0aa",
  "--c-texto-muted":         "#848480",

  "--c-primario":            "#c8c8c4",
  "--c-primario-alpha":      "rgba(200, 200, 196, 0.90)",
  "--c-primario-suave":      "#4a4a55",
  "--c-primario-oscuro":     "#e8e8e4",
  "--c-acento":              "#b0b0aa",

  "--c-positivo":            "#6abf8a",
  "--c-neutro":              "#7aabde",
  "--c-advertencia":         "#d4956a",
  "--c-negativo":            "#d47a7a",
  "--c-peligro":             "#d49090",
  "--c-exito":               "#6abf8a",

  "--c-credito":             "#7aabde",
  "--c-reposicion":          "#6abf8a",
  "--c-sync-ok":             "#6abf8a",
  "--c-sync-error":          "#d47a7a",

  "--c-pill-blue":           "#3a4a5f",
  "--c-pill-green":          "#2a4a36",
  "--c-pill-red":            "#4a2a2a",
  "--c-pill-yellow":         "#4a3a1a",
  "--c-pill-purple":         "#3a3050",
  "--c-pill-orange":         "#4a3020",
  "--c-sombra-hover":        "2px 3px 0 #c8c8c4",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

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

  pillBlue:          "var(--c-pill-blue)",
  pillGreen:         "var(--c-pill-green)",
  pillRed:           "var(--c-pill-red)",
  pillYellow:        "var(--c-pill-yellow)",
  pillPurple:        "var(--c-pill-purple)",
  pillOrange:        "var(--c-pill-orange)",
  sombraHover:       "var(--c-sombra-hover)",
}

export const BLUR = {
  panel:   "var(--blur-panel)",
  app:     "var(--blur-app)",
  sheet:   "var(--blur-sheet)",
  overlay: "var(--blur-overlay)",
}

export function aplicarTema(tema) {
  const vars = tema === "retro-flat-dark" ? TEMA_RETRO_FLAT_DARK : TEMA_RETRO_FLAT
  Object.entries(vars).forEach(([key, value]) => {
    document.body.style.setProperty(key, value)
  })
}