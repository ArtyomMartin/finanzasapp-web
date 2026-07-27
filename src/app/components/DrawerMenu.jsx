import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { COLORES, BLUR } from '../theme';
import { Home, RefreshCw, CreditCard, TrendingUp, DollarSign, Shield, FileText, ClipboardList, Search, Calendar, MapPin, BarChart2, Lightbulb, Settings, MoreHorizontal } from "lucide-react"

const PREFIX = "/app"

// ── Configuración de la barra inferior ─────────────────────────────────────
// Los extremos son fijos: "Inicio" a la izquierda y "Más" a la derecha.
// Los 3 slots centrales se eligen desde Ajustes (editor: EditorBarraNav).
// El popup "Más" NO es una lista aparte: se deriva del catálogo quitando lo
// que ya está en la barra, así lo que se saca de abajo reaparece solo en la
// grilla y nunca hay duplicados.

export const LS_KEY_NAV = "nav-barra-slots"
export const EVENTO_NAV = "nav-barra-cambiada"
export const NUM_SLOTS   = 3

export const ITEM_INICIO = { id: "inicio", label: "Inicio", Icono: Home, ruta: `${PREFIX}` }

// Todo lo navegable menos Inicio. Son 15 → 3 en la barra + 12 en la grilla 3×4.
export const CATALOGO_NAV = [
  { id: "reposicion",       label: "Ahorro",           Icono: RefreshCw,     ruta: `${PREFIX}/reposicion`       },
  { id: "hacer-pagos",      label: "Pagos",            Icono: CreditCard,    ruta: `${PREFIX}/hacer-pagos`      },
  { id: "rendimientos",     label: "Rendimientos",     Icono: TrendingUp,    ruta: `${PREFIX}/rendimientos`,     labelBarra: "Rendim."  },
  { id: "ingresos",         label: "Ingresos",         Icono: DollarSign,    ruta: `${PREFIX}/ingresos`         },
  { id: "egresos",          label: "Egresos",          Icono: Home,          ruta: `${PREFIX}/egresos`          },
  { id: "credito",          label: "Crédito",          Icono: CreditCard,    ruta: `${PREFIX}/credito`          },
  { id: "fondo-emergencia", label: "Fondo emergencia", Icono: Shield,        ruta: `${PREFIX}/fondo-emergencia`, labelBarra: "Fondo"    },
  { id: "gustos",           label: "Netos",            Icono: FileText,      ruta: `${PREFIX}/gustos`           },
  { id: "planes",           label: "Planes",           Icono: ClipboardList, ruta: `${PREFIX}/planes`           },
  { id: "detalle-gastos",   label: "Detalle Gastos",   Icono: Search,        ruta: `${PREFIX}/detalle-gastos`,   labelBarra: "Gastos"   },
  { id: "cuotas",           label: "Cuotas",           Icono: Calendar,      ruta: `${PREFIX}/cuotas`           },
  { id: "ubi-plata",        label: "Dinero",           Icono: MapPin,        ruta: `${PREFIX}/ubi-plata`        },
  { id: "inversiones",      label: "Inversiones",      Icono: BarChart2,     ruta: `${PREFIX}/inversiones`,      labelBarra: "Invers."  },
  { id: "consejos",         label: "Consejos",         Icono: Lightbulb,     ruta: `${PREFIX}/consejos`         },
  { id: "ajustes",          label: "Ajustes",          Icono: Settings,      ruta: `${PREFIX}/ajustes`          },
]

export const SLOTS_POR_DEFECTO = ["reposicion", "hacer-pagos", "rendimientos"]

export const itemNav = (id) => CATALOGO_NAV.find(i => i.id === id)

// Devuelve siempre 3 ids válidos y sin repetir, pase lo que pase en localStorage.
export function leerSlots() {
  let ids = []
  try {
    const guardado = localStorage.getItem(LS_KEY_NAV)
    if (guardado) {
      const parsed = JSON.parse(guardado)
      if (Array.isArray(parsed)) ids = parsed.filter(id => itemNav(id))
    }
  } catch (_) {}
  ids = [...new Set(ids)].slice(0, NUM_SLOTS)
  // Completa los huecos con los valores por defecto (y, si hiciera falta, con
  // el primer ítem libre del catálogo).
  for (const id of [...SLOTS_POR_DEFECTO, ...CATALOGO_NAV.map(i => i.id)]) {
    if (ids.length === NUM_SLOTS) break
    if (!ids.includes(id)) ids.push(id)
  }
  return ids
}

export function guardarSlots(ids) {
  try { localStorage.setItem(LS_KEY_NAV, JSON.stringify(ids)) } catch (_) {}
  // Avisa a las barras montadas en otras pantallas para que se actualicen ya.
  window.dispatchEvent(new Event(EVENTO_NAV))
}

const DrawerMenu = ({ rutaActual, alNavegar }) => {
  const [masAbierto, setMasAbierto] = useState(false)
  const [slots, setSlots] = useState(leerSlots)

  useEffect(() => {
    const refrescar = () => setSlots(leerSlots())
    window.addEventListener(EVENTO_NAV, refrescar)
    window.addEventListener("storage", refrescar)
    return () => {
      window.removeEventListener(EVENTO_NAV, refrescar)
      window.removeEventListener("storage", refrescar)
    }
  }, [])

  const barraVisible = [ITEM_INICIO, ...slots.map(itemNav).filter(Boolean)]
  const masVisible   = CATALOGO_NAV.filter(i => !slots.includes(i.id))

  const navegar = (ruta) => { setMasAbierto(false); alNavegar(ruta) }

  const estiloBarra = {
    position: "fixed",
    bottom: "16px", left: "16px", right: "16px",
    height: "64px",
    backgroundColor: COLORES.fondo || "rgba(17, 24, 39, 0.97)",
    backdropFilter: BLUR || "blur(16px)",
    WebkitBackdropFilter: BLUR || "blur(16px)",
    border: `1px solid ${COLORES.borde}`,
    borderRadius: "20px",
    display: "flex",
    alignItems: "stretch",
    zIndex: 9000,
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    overflow: "hidden",
  }

  const estiloItem = (activo) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 4px",
    color: activo ? COLORES.primario : COLORES.textoMuted,
    transition: "color 0.15s ease",
    WebkitTapHighlightColor: "transparent",
  })

  const estiloIcono = { fontSize: "20px", lineHeight: 1 }
  const estiloLabel = (activo) => ({
    fontSize: "10px",
    fontWeight: activo ? "700" : "500",
    letterSpacing: "0.02em",
    color: activo ? COLORES.primario : COLORES.textoMuted,
  })

  const contenido = (
    <>
      {/* Overlay del popup "Más" */}
      {masAbierto && ReactDOM.createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9001,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={() => setMasAbierto(false)}
        />,
        document.body
      )}

      {/* Popup "Más" */}
      {masAbierto && ReactDOM.createPortal(
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9002,
            width: "min(92vw, 420px)",
            backgroundColor: COLORES.fondoBottomSheet,
            border: `1px solid ${COLORES.borde}`,
            borderRadius: "24px",
            padding: "20px 16px 20px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.18)",
            animation: "popupMasIn 0.22s cubic-bezier(0.32,0.72,0,1)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <style>{`@keyframes popupMasIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.94); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }`}</style>

          {/* Cabecera */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px", padding:"0 4px" }}>
            <span style={{ fontSize:"17px", fontWeight:"700", color: COLORES.texto }}>Más opciones</span>
            <button
              onClick={() => setMasAbierto(false)}
              style={{
                width:"32px", height:"32px", borderRadius:"50%",
                border:`1px solid ${COLORES.bordeBlanco}`,
                background: COLORES.fondoOpcion,
                color: COLORES.texto,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", fontSize:"14px",
                WebkitTapHighlightColor:"transparent",
              }}
              aria-label="Cerrar"
            >✕</button>
          </div>

          {/* Grilla 3×4 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}>
            {masVisible.map(item => {
              const activo = rutaActual === item.ruta
              const Icono  = item.Icono
              return (
                <button
                  key={item.id}
                  onClick={() => navegar(item.ruta)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 6px",
                    background: activo ? COLORES.fondoOpcionActiva : COLORES.fondoOpcion,
                    border: `1px solid ${activo ? COLORES.borde : COLORES.bordeBlanco}`,
                    borderRadius: "16px",
                    color: activo ? COLORES.primario : COLORES.texto,
                    cursor: "pointer",
                    transition: "transform 0.1s ease, box-shadow 0.1s ease",
                    WebkitTapHighlightColor: "transparent",
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{ color: activo ? COLORES.primario : COLORES.textoSecundario, display:"flex", alignItems:"center" }}>
                    <Icono size={18} />
                  </span>
                  <span style={{
                    fontSize: "11.5px",
                    fontWeight: activo ? "700" : "600",
                    textAlign: "center",
                    lineHeight: "1.2",
                    color: activo ? COLORES.primario : COLORES.texto,
                  }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}

      {/* Barra inferior */}
      <div className="drawer-menu-barra" style={estiloBarra}>
        {barraVisible.map(item => {
          const activo = rutaActual === item.ruta
          const Icono  = item.Icono
          return (
            <button key={item.id} style={estiloItem(activo)} onClick={() => navegar(item.ruta)}>
              <span style={estiloIcono}><Icono size={20} /></span>
              <span style={estiloLabel(activo)}>{item.labelBarra || item.label}</span>
            </button>
          )
        })}
        {/* Botón "Más" */}
        <button style={estiloItem(masAbierto)} onClick={() => setMasAbierto(v => !v)}>
          <MoreHorizontal size={20} />
          <span style={estiloLabel(masAbierto)}>Más</span>
        </button>
      </div>
    </>
  )

  return ReactDOM.createPortal(contenido, document.body)
}

export default DrawerMenu
