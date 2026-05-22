import React from 'react';
import ReactDOM from 'react-dom';
import { useDatos } from '../context/AppContext';
import { COLORES, BLUR } from '../theme';

const PREFIX = "/app"

// Definición de todos los items con el nivel mínimo requerido
const ITEMS_PRINCIPALES = [
  { label: "💰 Ingresos",            ruta: `${PREFIX}/ingresos`,         nivel: "basico" },
  { label: "🏠 Egresos",             ruta: `${PREFIX}/egresos`,          nivel: "basico" },
  { label: "💸 Hacer Pagos",         ruta: `${PREFIX}/hacer-pagos`,      nivel: "basico" },
  { label: "💳 Crédito",             ruta: `${PREFIX}/credito`,          nivel: "medio" },
  { label: "🔄 Ahorro",              ruta: `${PREFIX}/reposicion`,       nivel: "medio" },
  { label: "🛡️ Fondo de emergencia", ruta: `${PREFIX}/fondo-emergencia`, nivel: "avanzado" },
]

const ITEMS_SECUNDARIOS = [
  { label: "🧾 Netos",          ruta: `${PREFIX}/gustos`,         nivel: "medio" },
  { label: "📝 Planes",         ruta: `${PREFIX}/planes`,         nivel: "medio" },
  { label: "🔍 Detalle Gastos", ruta: `${PREFIX}/detalle-gastos`, nivel: "medio" },
  { label: "📅 Cuotas",         ruta: `${PREFIX}/cuotas`,         nivel: "avanzado" },
  { label: "📍 Dinero",         ruta: `${PREFIX}/ubi-plata`,      nivel: "avanzado" },
  { label: "📈 Inversiones",    ruta: `${PREFIX}/inversiones`,    nivel: "avanzado" },
  { label: "📈 Rendimientos",   ruta: `${PREFIX}/rendimientos`,   nivel: "avanzado" },
  { label: "💡 Consejos",        ruta: `${PREFIX}/consejos`,       nivel: "avanzado" },
]

const ORDEN_NIVELES = { basico: 0, medio: 1, avanzado: 2 }

function itemVisible(item, nivelActivo) {
  return ORDEN_NIVELES[item.nivel] <= ORDEN_NIVELES[nivelActivo]
}

const DrawerMenu = ({ abierto, setAbierto, rutaActual, alNavegar }) => {
  const { nivel } = useDatos()

  const primarios   = ITEMS_PRINCIPALES.filter(i => itemVisible(i, nivel))
  const secundarios = ITEMS_SECUNDARIOS.filter(i => itemVisible(i, nivel))

  const styles = {
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9998,
      opacity: abierto ? 1 : 0,
      pointerEvents: abierto ? "auto" : "none",
      transition: "opacity 0.3s ease",
    },
    drawer: {
      position: "fixed", top: 0, left: 0, bottom: 0, width: "280px",
      backgroundColor: COLORES.fondo || "rgba(17, 24, 39, 0.9)",
      backdropFilter: BLUR || "blur(15px)", WebkitBackdropFilter: BLUR || "blur(15px)",
      zIndex: 9999,
      display: "flex", flexDirection: "column",
      borderRight: `1px solid ${COLORES.borde}`,
      transform: abierto ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease",
    },
    header: { padding: "24px 20px", borderBottom: `1px solid ${COLORES.borde}` },
    logo: { fontSize: "22px", fontWeight: "800", color: COLORES.primario },
    nivelBadge: {
      marginTop: "6px",
      fontSize: "11px",
      fontWeight: "600",
      color: COLORES.textoSecundario,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    scroll: { flex: 1, overflowY: "auto", padding: "12px" },
    label: { padding: "16px 8px 8px", fontSize: "11px", fontWeight: "700", color: COLORES.textoSecundario, textTransform: "uppercase", letterSpacing: "1px" },
    item: {
      width: "100%", padding: "12px 16px", background: "none", border: "none", color: COLORES.texto,
      textAlign: "left", fontSize: "15px", fontWeight: "500", borderRadius: "10px", cursor: "pointer", margin: "2px 0",
      transition: "all 0.2s"
    },
    activo: { backgroundColor: `${COLORES.primario}26`, color: COLORES.primario, fontWeight: "700" } // 26 = ~15% opacidad
  }

  const navegar = (ruta) => { alNavegar(ruta); setAbierto(false) }

  const contenido = (
    <>
      <div style={styles.overlay} onClick={() => setAbierto(false)} />
      <div style={styles.drawer}>
        <div style={styles.header}>
          <div style={styles.logo}>FinanzasApp</div>
          <div style={styles.nivelBadge}>
            {{ basico: "● Básico", medio: "●● Medio", avanzado: "●●● Avanzado" }[nivel]}
          </div>
        </div>
        <div style={styles.scroll}>
          <button
            style={{ ...styles.item, ...(rutaActual === `${PREFIX}` ? styles.activo : {}) }}
            onClick={() => navegar(`${PREFIX}`)}
          >
            🏠 Inicio
          </button>

          <div style={styles.label}>Principales</div>
          {primarios.map(b => (
            <button
              key={b.ruta}
              style={{ ...styles.item, ...(rutaActual === b.ruta ? styles.activo : {}) }}
              onClick={() => navegar(b.ruta)}
            >
              {b.label}
            </button>
          ))}

          {secundarios.length > 0 && (
            <>
              <div style={styles.label}>Otros</div>
              {secundarios.map(b => (
                <button
                  key={b.ruta}
                  style={{ ...styles.item, ...(rutaActual === b.ruta ? styles.activo : {}) }}
                  onClick={() => navegar(b.ruta)}
                >
                  {b.label}
                </button>
              ))}
            </>
          )}

          <div style={{ margin: "20px 16px", height: "1px", backgroundColor: COLORES.borde }} />
          <button
            style={{ ...styles.item, ...(rutaActual === `${PREFIX}/ajustes` ? styles.activo : {}) }}
            onClick={() => navegar(`${PREFIX}/ajustes`)}
          >
            ⚙️ Ajustes
          </button>
        </div>
      </div>
    </>
  )

  return ReactDOM.createPortal(contenido, document.body)
}

export default DrawerMenu
