// src/theme/colores.js

// TEMAS DISPONIBLES:
//   "retro-flat"      → claro, gris hueso, bordes negros
//   "retro-flat-dark" → oscuro suave, gris pizarra, bajo contraste
//   "blanco"          → claro, gris azulado, acentos monocromos (negro)
//   "negro-puro"      → oscuro, negros profundos (hasta #000), acento lila
//   "argentina"       → claro, celeste y blanco, acentos dorados

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
  "--c-texto-boton":         "#f5f5f0",

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
  "--c-texto-boton":         "#2c2c2e",

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

export const TEMA_BLANCO = {
  "--c-fondo-app":           "#c8cdd4",
  "--c-fondo-panel":         "#d4d9e0",
  "--c-fondo-tarjeta":       "#dde0e5",
  "--c-fondo-input":         "#dde0e5",
  "--c-fondo-opcion":        "#d4d9e0",
  "--c-fondo-opcion-activa": "#dcd2f5",
  "--c-fondo-fondo":         "#c8cdd4",
  "--c-fondo-overlay":       "rgba(26, 26, 26, 0.55)",
  "--c-fondo-bottom-sheet":  "#dde0e5",
  "--c-fondo":               "#c8cdd4",

  "--c-borde":               "#1a1a1a",
  "--c-borde-panel":         "#1a1a1a",
  "--c-borde-blanco":        "#b8bdc5",
  "--c-borde-blanco10":      "#a7adb7",

  "--c-texto":               "#1a1a1a",
  "--c-texto-blanco":        "#1a1a1a",
  "--c-texto-secundario":    "#3a3a3a",
  "--c-texto-muted":         "#666666",

  "--c-primario":            "#1a1a1a",
  "--c-primario-alpha":      "rgba(26, 26, 26, 0.88)",
  "--c-primario-suave":      "#dbeafe",
  "--c-primario-oscuro":     "#000000",
  "--c-acento":              "#555555",
  "--c-texto-boton":         "#c8cdd4",

  "--c-positivo":            "#5dbd8a",
  "--c-neutro":              "#2563eb",
  "--c-advertencia":         "#b45309",
  "--c-negativo":            "#c0392b",
  "--c-peligro":             "#e57373",
  "--c-exito":               "#5dbd8a",

  "--c-credito":             "#2563eb",
  "--c-reposicion":          "#5dbd8a",
  "--c-sync-ok":             "#5dbd8a",
  "--c-sync-error":          "#c0392b",

  "--c-pill-blue":           "#a8c4f0",
  "--c-pill-green":          "#a8d4b0",
  "--c-pill-red":            "#f0a8a8",
  "--c-pill-yellow":         "#f0dca8",
  "--c-pill-purple":         "#c4a8f0",
  "--c-pill-orange":         "#f0c4a8",
  "--c-sombra-hover":        "2px 3px 0 #1a1a1a",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_NEGRO_PURO = {
  "--c-fondo-app":           "#000000",
  "--c-fondo-panel":         "#0a0a0a",
  "--c-fondo-tarjeta":       "#121212",
  "--c-fondo-input":         "#121212",
  "--c-fondo-opcion":        "#0a0a0a",
  "--c-fondo-opcion-activa": "#241f38",
  "--c-fondo-fondo":         "#000000",
  "--c-fondo-overlay":       "rgba(0, 0, 0, 0.7)",
  "--c-fondo-bottom-sheet":  "#121212",
  "--c-fondo":               "#000000",

  "--c-borde":               "#d8d8d8",
  "--c-borde-panel":         "#d8d8d8",
  "--c-borde-blanco":        "#2a2a2a",
  "--c-borde-blanco10":      "#383838",

  "--c-texto":               "#f0f0f0",
  "--c-texto-blanco":        "#f0f0f0",
  "--c-texto-secundario":    "#b8b8b8",
  "--c-texto-muted":         "#808080",

  "--c-primario":            "#9b8fd4",
  "--c-primario-alpha":      "rgba(155, 143, 212, 0.90)",
  "--c-primario-suave":      "#2a2440",
  "--c-primario-oscuro":     "#7c6fcf",
  "--c-acento":              "#7c6fcf",
  "--c-texto-boton":         "#000000",

  "--c-positivo":            "#5dbd8a",
  "--c-neutro":              "#7aabde",
  "--c-advertencia":         "#ffb74d",
  "--c-negativo":            "#e57373",
  "--c-peligro":             "#e57373",
  "--c-exito":               "#5dbd8a",

  "--c-credito":             "#7aabde",
  "--c-reposicion":          "#5dbd8a",
  "--c-sync-ok":             "#5dbd8a",
  "--c-sync-error":          "#e57373",

  "--c-pill-blue":           "#2a3a52",
  "--c-pill-green":          "#22402a",
  "--c-pill-red":            "#452626",
  "--c-pill-yellow":         "#4a3d20",
  "--c-pill-purple":         "#362a4a",
  "--c-pill-orange":         "#4a3524",
  "--c-sombra-hover":        "2px 3px 0 #d8d8d8",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_ARGENTINA = {
  "--c-fondo-app":           "#eaf4fb",
  "--c-fondo-panel":         "#dcedfa",
  "--c-fondo-tarjeta":       "#ffffff",
  "--c-fondo-input":         "#ffffff",
  "--c-fondo-opcion":        "#dcedfa",
  "--c-fondo-opcion-activa": "#fbe8b8",
  "--c-fondo-fondo":         "#eaf4fb",
  "--c-fondo-overlay":       "rgba(11, 61, 99, 0.55)",
  "--c-fondo-bottom-sheet":  "#ffffff",
  "--c-fondo":               "#eaf4fb",

  "--c-borde":               "#1c6bb5",
  "--c-borde-panel":         "#1c6bb5",
  "--c-borde-blanco":        "#c7ddf0",
  "--c-borde-blanco10":      "#b3d2ec",

  "--c-texto":               "#0d2f4d",
  "--c-texto-blanco":        "#0d2f4d",
  "--c-texto-secundario":    "#33526c",
  "--c-texto-muted":         "#6d8aa1",

  "--c-primario":            "#f0c419",
  "--c-primario-alpha":      "rgba(240, 196, 25, 0.88)",
  "--c-primario-suave":      "#f5e6b8",
  "--c-primario-oscuro":     "#c99f10",
  "--c-acento":              "#4a90d9",
  "--c-texto-boton":         "#0d2f4d",

  "--c-positivo":            "#16a34a",
  "--c-neutro":              "#2f7cc9",
  "--c-advertencia":         "#e08e1e",
  "--c-negativo":            "#dc2626",
  "--c-peligro":             "#e74c3c",
  "--c-exito":               "#16a34a",

  "--c-credito":             "#2f7cc9",
  "--c-reposicion":          "#16a34a",
  "--c-sync-ok":             "#16a34a",
  "--c-sync-error":          "#dc2626",

  "--c-pill-blue":           "#bfe0fb",
  "--c-pill-green":          "#c4efd4",
  "--c-pill-red":            "#ffd0cc",
  "--c-pill-yellow":         "#fbe7a8",
  "--c-pill-purple":         "#e4cfff",
  "--c-pill-orange":         "#ffe0c2",
  "--c-sombra-hover":        "2px 3px 0 #1c6bb5",

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
  textoBoton:        "var(--c-texto-boton)",

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

  // Alias usados por algunas pantallas (Gustos, Inversiones, Rendimientos)
  // para que respeten el tema en vez de caer a colores hardcodeados.
  info:              "var(--c-neutro)",
  error:             "var(--c-negativo)",
  superficie:        "var(--c-fondo-tarjeta)",
}

export const BLUR = {
  panel:   "var(--blur-panel)",
  app:     "var(--blur-app)",
  sheet:   "var(--blur-sheet)",
  overlay: "var(--blur-overlay)",
}

const TEMAS = {
  "retro-flat":      TEMA_RETRO_FLAT,
  "retro-flat-dark": TEMA_RETRO_FLAT_DARK,
  "blanco":          TEMA_BLANCO,
  "negro-puro":      TEMA_NEGRO_PURO,
  "argentina":       TEMA_ARGENTINA,
}

export function aplicarTema(tema) {
  const vars = TEMAS[tema] || TEMA_RETRO_FLAT
  Object.entries(vars).forEach(([key, value]) => {
    document.body.style.setProperty(key, value)
  })
}