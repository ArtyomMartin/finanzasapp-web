import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { COLORES, BLUR } from '../theme';
import { Home, RefreshCw, CreditCard, TrendingUp, DollarSign, Receipt, Landmark, Shield, FileText, ClipboardList, Search, Calendar, MapPin, BarChart2, Lightbulb, Settings, MoreHorizontal } from "lucide-react"

const PREFIX = "/app"

// Items fijos en la barra inferior
const ITEMS_BARRA = [
  { label: "Inicio",    icono: <Home size={20}/>,        ruta: `${PREFIX}`               },
  { label: "Ahorro",    icono: <RefreshCw size={20}/>,   ruta: `${PREFIX}/reposicion`     },
  { label: "Pagos",     icono: <CreditCard size={20}/>,  ruta: `${PREFIX}/hacer-pagos`    },
  { label: "Rendim.",   icono: <TrendingUp size={20}/>,  ruta: `${PREFIX}/rendimientos`   },
]

// Todo lo demás va al popup "Más"
const ITEMS_MAS = [
  { label: "Ingresos",         icono: <DollarSign size={18}/>,    ruta: `${PREFIX}/ingresos`         },
  { label: "Egresos",          icono: <Home size={18}/>,          ruta: `${PREFIX}/egresos`          },
  { label: "Crédito",          icono: <CreditCard size={18}/>,    ruta: `${PREFIX}/credito`          },
  { label: "Fondo emergencia", icono: <Shield size={18}/>,        ruta: `${PREFIX}/fondo-emergencia` },
  { label: "Netos",            icono: <FileText size={18}/>,      ruta: `${PREFIX}/gustos`           },
  { label: "Planes",           icono: <ClipboardList size={18}/>, ruta: `${PREFIX}/planes`           },
  { label: "Detalle Gastos",   icono: <Search size={18}/>,        ruta: `${PREFIX}/detalle-gastos`   },
  { label: "Cuotas",           icono: <Calendar size={18}/>,      ruta: `${PREFIX}/cuotas`           },
  { label: "Dinero",           icono: <MapPin size={18}/>,        ruta: `${PREFIX}/ubi-plata`        },
  { label: "Inversiones",      icono: <BarChart2 size={18}/>,     ruta: `${PREFIX}/inversiones`      },
  { label: "Consejos",         icono: <Lightbulb size={18}/>,     ruta: `${PREFIX}/consejos`         },
  { label: "Ajustes",          icono: <Settings size={18}/>,      ruta: `${PREFIX}/ajustes`          },
]

const DrawerMenu = ({ rutaActual, alNavegar }) => {
  const [masAbierto, setMasAbierto] = useState(false)

  const barraVisible = ITEMS_BARRA
  const masVisible   = ITEMS_MAS

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
            bottom: "72px",
            right: "8px",
            zIndex: 9002,
            backgroundColor: COLORES.fondo || "rgba(17, 24, 39, 0.98)",
            backdropFilter: BLUR || "blur(16px)",
            WebkitBackdropFilter: BLUR || "blur(16px)",
            border: `1px solid ${COLORES.borde}`,
            borderRadius: "16px",
            padding: "8px",
            minWidth: "200px",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.4)",
            animation: "popupMasIn 0.2s cubic-bezier(0.32,0.72,0,1)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <style>{`@keyframes popupMasIn { from { opacity:0; transform:scale(0.92) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
          {masVisible.map(item => {
            const activo = rutaActual === item.ruta
            return (
              <button
                key={item.ruta}
                onClick={() => navegar(item.ruta)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px 16px",
                  background: activo ? `${COLORES.primario}22` : "none",
                  border: "none",
                  borderRadius: "10px",
                  color: activo ? COLORES.primario : COLORES.texto || COLORES.textoBlanco,
                  fontSize: "15px",
                  fontWeight: activo ? "700" : "500",
                  textAlign: "left",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span style={{display:"flex",alignItems:"center",gap:"10px"}}>{item.icono}{item.label}</span>
              </button>
            )
          })}
        </div>,
        document.body
      )}

      {/* Barra inferior */}
      <div className="drawer-menu-barra" style={estiloBarra}>
        {barraVisible.map(item => {
          const activo = rutaActual === item.ruta
          return (
            <button key={item.ruta} style={estiloItem(activo)} onClick={() => navegar(item.ruta)}>
              <span style={estiloIcono}>{item.icono}</span>
              <span style={estiloLabel(activo)}>{item.label}</span>
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
