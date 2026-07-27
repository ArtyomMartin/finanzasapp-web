import { useState } from "react"
import ReactDOM from "react-dom"
import { MoreHorizontal, Lock, RotateCcw, Check, LayoutGrid } from "lucide-react"
import { COLORES, estiloBotonPrimario, estiloBotonSecundario } from "../theme"
import {
  CATALOGO_NAV, ITEM_INICIO, NUM_SLOTS, SLOTS_POR_DEFECTO,
  leerSlots, guardarSlots, itemNav,
} from "./DrawerMenu"

// Editor de los 3 slots centrales de la barra inferior.
// Inicio y Más son fijos. Se elige un slot y luego un destino del catálogo:
// si ese destino ya estaba en otro slot, los dos se intercambian, así nunca
// hay repetidos. Lo que sale de la barra vuelve solo a la grilla de "Más".

export default function EditorBarraNav() {
  const [abierto, setAbierto] = useState(false)
  const [slots, setSlots]     = useState(leerSlots)
  const [slotSel, setSlotSel] = useState(0)

  // Al abrir se relee, por si cambió desde otra pantalla.
  function abrir() { setSlots(leerSlots()); setSlotSel(0); setAbierto(true) }

  function aplicar(nuevos) {
    setSlots(nuevos)
    guardarSlots(nuevos)
  }

  function elegirDestino(id) {
    const idx = slots.indexOf(id)
    const nuevos = [...slots]
    if (idx === -1) nuevos[slotSel] = id          // libre: ocupa el slot elegido
    else { nuevos[idx] = nuevos[slotSel]; nuevos[slotSel] = id }   // ya estaba: intercambio
    aplicar(nuevos)
  }

  function restablecer() { aplicar([...SLOTS_POR_DEFECTO]) }

  const previa = [
    { ...ITEM_INICIO, fijo: true },
    ...slots.map(itemNav).filter(Boolean),
    { id: "mas", label: "Más", Icono: MoreHorizontal, fijo: true },
  ]

  const estiloRanura = (activo, fijo) => ({
    flex: 1,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "4px",
    padding: "10px 2px",
    borderRadius: "12px",
    border: `1px solid ${activo ? COLORES.primario : "transparent"}`,
    background: activo ? COLORES.fondoOpcionActiva : "transparent",
    color: fijo ? COLORES.textoMuted : (activo ? COLORES.primario : COLORES.texto),
    cursor: fijo ? "default" : "pointer",
    opacity: fijo ? 0.55 : 1,
    fontFamily: "inherit",
    WebkitTapHighlightColor: "transparent",
    transition: "background 0.15s ease, border-color 0.15s ease",
  })

  const popup = (
    <>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9500,
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }}
        onClick={() => setAbierto(false)}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 9501,
          width: "min(92vw, 440px)", maxHeight: "88vh",
          display: "flex", flexDirection: "column",
          backgroundColor: COLORES.fondoBottomSheet,
          border: `1px solid ${COLORES.borde}`,
          borderRadius: "24px",
          boxShadow: "0 8px 48px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.18)",
          animation: "editorNavIn 0.22s cubic-bezier(0.32,0.72,0,1)",
          overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes editorNavIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.94); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }`}</style>

        {/* Cabecera */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <span style={{ fontSize: "17px", fontWeight: "700", color: COLORES.texto }}>Barra inferior</span>
          <button
            onClick={() => setAbierto(false)}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1px solid ${COLORES.bordeBlanco}`,
              background: COLORES.fondoOpcion, color: COLORES.texto,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "14px", WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Cerrar"
          >✕</button>
        </div>

        {/* Previa de la barra */}
        <div style={{ padding: "0 20px" }}>
          <div style={{
            display: "flex", alignItems: "stretch",
            border: `1px solid ${COLORES.borde}`, borderRadius: "18px",
            backgroundColor: COLORES.fondoPanel, padding: "4px",
          }}>
            {previa.map((item, i) => {
              const Icono   = item.Icono
              const posSlot = i - 1                       // 0..2 para los editables
              const editable = !item.fijo
              const activo   = editable && posSlot === slotSel
              return (
                <button
                  key={item.id}
                  onClick={() => editable && setSlotSel(posSlot)}
                  disabled={item.fijo}
                  style={estiloRanura(activo, item.fijo)}
                >
                  <Icono size={20} />
                  <span style={{ fontSize: "10px", fontWeight: activo ? "700" : "500", textAlign: "center", lineHeight: 1.2 }}>
                    {item.labelBarra || item.label}
                  </span>
                  {item.fijo && <Lock size={9} />}
                </button>
              )
            })}
          </div>
          <p style={{ margin: "12px 0 8px", fontSize: "12.5px", color: COLORES.textoSecundario, lineHeight: 1.45 }}>
            Inicio y Más son fijos. Tocá uno de los {NUM_SLOTS} botones del medio y después elegí
            qué pantalla querés ahí. El que salga vuelve a la grilla de “Más”.
          </p>
        </div>

        {/* Catálogo */}
        <div style={{ overflowY: "auto", padding: "4px 20px 8px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {CATALOGO_NAV.map(item => {
              const enBarra   = slots.includes(item.id)
              const enSlotSel = slots[slotSel] === item.id
              const Icono     = item.Icono
              return (
                <button
                  key={item.id}
                  onClick={() => elegirDestino(item.id)}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "8px", padding: "14px 6px",
                    background: enSlotSel ? COLORES.fondoOpcionActiva : COLORES.fondoOpcion,
                    border: `1px solid ${enSlotSel ? COLORES.primario : (enBarra ? COLORES.borde : COLORES.bordeBlanco)}`,
                    borderRadius: "16px",
                    color: enSlotSel ? COLORES.primario : COLORES.texto,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    WebkitTapHighlightColor: "transparent",
                    transition: "background 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {enBarra && (
                    <span style={{
                      position: "absolute", top: "6px", right: "6px",
                      width: "14px", height: "14px", borderRadius: "50%",
                      backgroundColor: enSlotSel ? COLORES.primario : COLORES.borde,
                      color: COLORES.textoBoton,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={9} />
                    </span>
                  )}
                  <span style={{ color: enSlotSel ? COLORES.primario : COLORES.textoSecundario, display: "flex" }}>
                    <Icono size={18} />
                  </span>
                  <span style={{ fontSize: "11.5px", fontWeight: enSlotSel ? "700" : "600", textAlign: "center", lineHeight: 1.2 }}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Pie */}
        <div style={{ display: "flex", gap: "10px", padding: "12px 20px 20px", borderTop: `1px solid ${COLORES.bordeBlanco}` }}>
          <button
            onClick={restablecer}
            style={{ ...estiloBotonSecundario, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <RotateCcw size={15} /> Restablecer
          </button>
          <button
            onClick={() => setAbierto(false)}
            style={{ ...estiloBotonPrimario, flex: 1, width: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <Check size={15} /> Listo
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {slots.map(itemNav).filter(Boolean).map(item => {
          const Icono = item.Icono
          return (
            <span
              key={item.id}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 10px", borderRadius: "20px",
                border: `1px solid ${COLORES.bordeBlanco}`,
                backgroundColor: COLORES.fondoOpcion,
                fontSize: "12.5px", fontWeight: "600", color: COLORES.textoSecundario,
              }}
            >
              <Icono size={13} /> {item.label}
            </span>
          )
        })}
      </div>
      <button
        onClick={abrir}
        style={{ ...estiloBotonSecundario, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      >
        <LayoutGrid size={16} /> Editar barra inferior
      </button>
      {abierto && ReactDOM.createPortal(popup, document.body)}
    </>
  )
}
