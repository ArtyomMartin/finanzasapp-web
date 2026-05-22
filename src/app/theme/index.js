// src/theme/index.js
export * from "./colores"

// 1. Exportamos todo individualmente (para Gustos.jsx y otros)
export * from "./estilos" 

// 2. Exportamos todo agrupado en un objeto (para Planes.jsx)
import * as estilosObj from "./estilos"
export const estilos = estilosObj