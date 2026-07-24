// ════════════════════════════════════════════════════════════════
// FILA_ELIMINABLE.JSX
// Wrapper reutilizable para cualquier fila con botón de borrado.
// Flujo: mostrar icono de papelera → al pulsar, pedir confirmación inline
// → al confirmar, ejecuta onEliminar.
// El estado de "confirmando" es local al componente (no sube al padre).
//
// Uso:
//   <FilaEliminable onEliminar={() => eliminarFn(item.id)}>
//     <div>contenido de la fila</div>
//   </FilaEliminable>
// ════════════════════════════════════════════════════════════════

import { useState } from "react"
import { COLORES } from "../theme"
import { Trash2, Check, X } from "lucide-react"

export default function FilaEliminable({ children, onEliminar }) {
  // confirmando: true = mostrando botones de confirmar/cancelar en lugar de la papelera
  const [confirmando, setConfirmando] = useState(false)

  const styles = {
    fila: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px",
      marginTop: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "8px",
      border: `1px solid ${COLORES.borde}`,
    },
    btnEliminar: {
      padding: "6px 10px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: COLORES.textoSecundario,
      display: "flex",
    },
    btnSi: {
      padding: "6px 12px",
      border: "none",
      backgroundColor: COLORES.peligro,
      color: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
    },
    btnNo: {
      padding: "6px 12px",
      border: "none",
      backgroundColor: COLORES.textoSecundario,
      color: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
    }
  }

  return (
    <div style={styles.fila}>
      <div style={{ flex: 1 }}>{children}</div>
      {confirmando ? (
        // Modo confirmación: dos botones pequeños
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={onEliminar} style={styles.btnSi}><Check size={16} /></button>
          <button onClick={() => setConfirmando(false)} style={styles.btnNo}><X size={16} /></button>
        </div>
      ) : (
        // Modo normal: solo el icono de papelera
        <button onClick={() => setConfirmando(true)} style={styles.btnEliminar}><Trash2 size={18} /></button>
      )}
    </div>
  )
}