// src/theme/colores.js

// TEMAS DISPONIBLES:
//   "retro-flat"      → claro, gris hueso, bordes negros
//   "retro-flat-dark" → oscuro suave, gris pizarra, bajo contraste
//   "argentina"       → claro, celeste y blanco, acentos dorados
//   "flores"          → claro, tonos rosados y delicados
//   "terminal"        → oscuro, negro y verde estilo Matrix
//   "hp-slytherin"    → oscuro, verde, gris y dorado (Slytherin)
//   "contraste"       → claro, fondo blanco, acento azul brillante

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

export const TEMA_FLORES = {
  "--c-fondo-app":           "#fdf2f6",
  "--c-fondo-panel":         "#fbe6ee",
  "--c-fondo-tarjeta":       "#ffffff",
  "--c-fondo-input":         "#ffffff",
  "--c-fondo-opcion":        "#fce8f0",
  "--c-fondo-opcion-activa": "#f7cfe0",
  "--c-fondo-fondo":         "#fdf2f6",
  "--c-fondo-overlay":       "rgba(157, 23, 77, 0.35)",
  "--c-fondo-bottom-sheet":  "#ffffff",
  "--c-fondo":               "#fdf2f6",

  "--c-borde":               "#e8a3c0",
  "--c-borde-panel":         "#e8a3c0",
  "--c-borde-blanco":        "#f5d6e4",
  "--c-borde-blanco10":      "#f0c7db",

  "--c-texto":               "#6b2142",
  "--c-texto-blanco":        "#6b2142",
  "--c-texto-secundario":    "#9c4a6e",
  "--c-texto-muted":         "#c48aa8",

  "--c-primario":            "#ec6ea3",
  "--c-primario-alpha":      "rgba(236, 110, 163, 0.88)",
  "--c-primario-suave":      "#fbd5e6",
  "--c-primario-oscuro":     "#d1487e",
  "--c-acento":              "#f4a6c6",
  "--c-texto-boton":         "#ffffff",

  "--c-positivo":            "#6fbf8a",
  "--c-neutro":              "#7aa8d9",
  "--c-advertencia":         "#e0a458",
  "--c-negativo":            "#e0708a",
  "--c-peligro":             "#e0708a",
  "--c-exito":               "#6fbf8a",

  "--c-credito":             "#7aa8d9",
  "--c-reposicion":          "#6fbf8a",
  "--c-sync-ok":             "#6fbf8a",
  "--c-sync-error":          "#e0708a",

  "--c-pill-blue":           "#cfe0f5",
  "--c-pill-green":          "#d3ecd9",
  "--c-pill-red":            "#f7d0da",
  "--c-pill-yellow":         "#fbe8c4",
  "--c-pill-purple":         "#e6d4f5",
  "--c-pill-orange":         "#f7ddc4",
  "--c-sombra-hover":        "2px 3px 0 #e8a3c0",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_TERMINAL = {
  "--c-fondo-app":           "#000000",
  "--c-fondo-panel":         "#050805",
  "--c-fondo-tarjeta":       "#0a0f0a",
  "--c-fondo-input":         "#0a0f0a",
  "--c-fondo-opcion":        "#071007",
  "--c-fondo-opcion-activa": "#123a12",
  "--c-fondo-fondo":         "#000000",
  "--c-fondo-overlay":       "rgba(0, 0, 0, 0.8)",
  "--c-fondo-bottom-sheet":  "#0a0f0a",
  "--c-fondo":               "#000000",

  "--c-borde":               "#00ff41",
  "--c-borde-panel":         "#00ff41",
  "--c-borde-blanco":        "#143014",
  "--c-borde-blanco10":      "#1a3d1a",

  "--c-texto":               "#00ff41",
  "--c-texto-blanco":        "#00ff41",
  "--c-texto-secundario":    "#33cc55",
  "--c-texto-muted":         "#1f8a3a",

  "--c-primario":            "#00ff41",
  "--c-primario-alpha":      "rgba(0, 255, 65, 0.85)",
  "--c-primario-suave":      "#0d3d18",
  "--c-primario-oscuro":     "#00cc34",
  "--c-acento":              "#39ff6a",
  "--c-texto-boton":         "#000000",

  "--c-positivo":            "#00ff41",
  "--c-neutro":              "#33cc99",
  "--c-advertencia":         "#ccff33",
  "--c-negativo":            "#ff3333",
  "--c-peligro":             "#ff3333",
  "--c-exito":               "#00ff41",

  "--c-credito":             "#33cc99",
  "--c-reposicion":          "#00ff41",
  "--c-sync-ok":             "#00ff41",
  "--c-sync-error":          "#ff3333",

  "--c-pill-blue":           "#113322",
  "--c-pill-green":          "#0d3d18",
  "--c-pill-red":            "#331111",
  "--c-pill-yellow":         "#333311",
  "--c-pill-purple":         "#1a331a",
  "--c-pill-orange":         "#332211",
  "--c-sombra-hover":        "2px 3px 0 #00ff41",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_HP_SLYTHERIN = {
  "--c-fondo-app":           "#1a2820",
  "--c-fondo-panel":         "#22332a",
  "--c-fondo-tarjeta":       "#2a3d32",
  "--c-fondo-input":         "#2a3d32",
  "--c-fondo-opcion":        "#22332a",
  "--c-fondo-opcion-activa": "#3a5240",
  "--c-fondo-fondo":         "#1a2820",
  "--c-fondo-overlay":       "rgba(10, 20, 15, 0.7)",
  "--c-fondo-bottom-sheet":  "#2a3d32",
  "--c-fondo":               "#1a2820",

  "--c-borde":               "#c0a94f",
  "--c-borde-panel":         "#c0a94f",
  "--c-borde-blanco":        "#3d5245",
  "--c-borde-blanco10":      "#47604f",

  "--c-texto":               "#e8e8e0",
  "--c-texto-blanco":        "#e8e8e0",
  "--c-texto-secundario":    "#b8c4ba",
  "--c-texto-muted":         "#7d8f82",

  "--c-primario":            "#2a7a4f",
  "--c-primario-alpha":      "rgba(42, 122, 79, 0.88)",
  "--c-primario-suave":      "#3a5240",
  "--c-primario-oscuro":     "#1e5c3a",
  "--c-acento":              "#c0a94f",
  "--c-texto-boton":         "#0d150f",

  "--c-positivo":            "#4caf7d",
  "--c-neutro":              "#8fa8c4",
  "--c-advertencia":         "#d4af37",
  "--c-negativo":            "#c0524a",
  "--c-peligro":             "#c0524a",
  "--c-exito":               "#4caf7d",

  "--c-credito":             "#8fa8c4",
  "--c-reposicion":          "#4caf7d",
  "--c-sync-ok":             "#4caf7d",
  "--c-sync-error":          "#c0524a",

  "--c-pill-blue":           "#2c3d4a",
  "--c-pill-green":          "#234a34",
  "--c-pill-red":            "#4a2c28",
  "--c-pill-yellow":         "#4a3f1e",
  "--c-pill-purple":         "#33304a",
  "--c-pill-orange":         "#4a3620",
  "--c-sombra-hover":        "2px 3px 0 #c0a94f",

  "--blur-panel":            "none",
  "--blur-app":              "none",
  "--blur-sheet":            "none",
  "--blur-overlay":          "none",
}

export const TEMA_CONTRASTE = {
  "--c-fondo-app":           "#ffffff",
  "--c-fondo-panel":         "#f2f2f2",
  "--c-fondo-tarjeta":       "#ffffff",
  "--c-fondo-input":         "#ffffff",
  "--c-fondo-opcion":        "#f0f4ff",
  "--c-fondo-opcion-activa": "#d6e4ff",
  "--c-fondo-fondo":         "#ffffff",
  "--c-fondo-overlay":       "rgba(0, 0, 0, 0.5)",
  "--c-fondo-bottom-sheet":  "#ffffff",
  "--c-fondo":               "#ffffff",

  "--c-borde":               "#0b3d91",
  "--c-borde-panel":         "#0b3d91",
  "--c-borde-blanco":        "#d0d8e8",
  "--c-borde-blanco10":      "#c0cbe0",

  "--c-texto":               "#0a0a0a",
  "--c-texto-blanco":        "#0a0a0a",
  "--c-texto-secundario":    "#333333",
  "--c-texto-muted":         "#6b6b6b",

  "--c-primario":            "#1466ff",
  "--c-primario-alpha":      "rgba(20, 102, 255, 0.90)",
  "--c-primario-suave":      "#d6e4ff",
  "--c-primario-oscuro":     "#0d4bd1",
  "--c-acento":              "#1466ff",
  "--c-texto-boton":         "#ffffff",

  "--c-positivo":            "#16c46a",
  "--c-neutro":              "#1466ff",
  "--c-advertencia":         "#ffb020",
  "--c-negativo":            "#ff3b3b",
  "--c-peligro":             "#ff3b3b",
  "--c-exito":               "#16c46a",

  "--c-credito":             "#1466ff",
  "--c-reposicion":          "#16c46a",
  "--c-sync-ok":             "#16c46a",
  "--c-sync-error":          "#ff3b3b",

  "--c-pill-blue":           "#bcd4ff",
  "--c-pill-green":          "#b8f0d0",
  "--c-pill-red":            "#ffc4c4",
  "--c-pill-yellow":         "#ffe4a8",
  "--c-pill-purple":         "#d8c4ff",
  "--c-pill-orange":         "#ffd0a8",
  "--c-sombra-hover":        "2px 3px 0 #0b3d91",

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
  "argentina":       TEMA_ARGENTINA,
  "flores":          TEMA_FLORES,
  "terminal":        TEMA_TERMINAL,
  "hp-slytherin":    TEMA_HP_SLYTHERIN,
  "contraste":       TEMA_CONTRASTE,
}

export function aplicarTema(tema) {
  const vars = TEMAS[tema] || TEMA_RETRO_FLAT
  Object.entries(vars).forEach(([key, value]) => {
    document.body.style.setProperty(key, value)
  })
}