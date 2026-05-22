// ════════════════════════════════════════════════════════════════
// FILA_ELIMINABLE.JSX
// Wrapper reutilizable para cualquier fila con botón de borrado.
// Flujo: mostrar 🗑 → al pulsar, pedir confirmación inline (✓ / ✕)
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

export default function FilaEliminable({ children, onEliminar }) {
  // confirmando: true = mostrando botones ✓/✕ en lugar del 🗑
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
      fontSize: "18px",
      cursor: "pointer",
      color: COLORES.textoSecundario
    },
    btnSi: {
      padding: "6px 12px",
      border: "none",
      backgroundColor: COLORES.peligro,
      color: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    btnNo: {
      padding: "6px 12px",
      border: "none",
      backgroundColor: COLORES.textoSecundario,
      color: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold"
    }
  }

  return (
    <div style={styles.fila}>
      <div style={{ flex: 1 }}>{children}</div>
      {confirmando ? (
        // Modo confirmación: dos botones pequeños
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={onEliminar} style={styles.btnSi}>✓</button>
          <button onClick={() => setConfirmando(false)} style={styles.btnNo}>✕</button>
        </div>
      ) : (
        // Modo normal: solo el icono de papelera
        <button onClick={() => setConfirmando(true)} style={styles.btnEliminar}>🗑</button>
      )}
    </div>
  )
}