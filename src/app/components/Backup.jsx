// ════════════════════════════════════════════════════════════════
// BACKUP.JSX
// Tres acciones sobre los datos locales:
//   1. Exportar: descarga la DB completa como archivo JSON
//   2. Importar: carga un JSON desde disco y lo reemplaza como DB activa
//   3. Resetear: borra completamente la DB local y el usuario activo
// No tiene conexión con Drive — es todo local.
// ════════════════════════════════════════════════════════════════
import { useState } from "react"
import { Capacitor } from "@capacitor/core"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"
import { useDatos } from "../context/AppContext"

export default function Backup() {
  const { datos, actualizarDatos, setUsuarioActivo } = useDatos()
  const [exportando, setExportando] = useState(false)

  async function exportar() {
    const contenido = JSON.stringify(datos, null, 2)
    const nombreArchivo = `finanzas-backup-${new Date().toISOString().slice(0, 10)}.json`

    if (Capacitor.isNativePlatform()) {
      setExportando(true)
      try {
        await Filesystem.writeFile({
          path: nombreArchivo,
          data: contenido,
          directory: Directory.Cache,
          encoding: "utf8",
        })

        const { uri } = await Filesystem.getUri({
          path: nombreArchivo,
          directory: Directory.Cache,
        })

        await Share.share({
          title: "Exportar datos FinanzasApp",
          text: "Copia de seguridad de FinanzasApp",
          url: uri,
          dialogTitle: "Guardar backup",
        })
      } catch (e) {
        alert("Error al exportar: " + e.message)
      } finally {
        setExportando(false)
      }
    } else {
      // Web: descarga normal
      const blob = new Blob([contenido], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = nombreArchivo
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  function importar(e) {
    const archivo = e.target.files[0]
    if (!archivo) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        actualizarDatos(json)
        alert("Datos restaurados correctamente")
      } catch {
        alert("Archivo inválido")
      }
    }
    reader.readAsText(archivo)
  }

  function resetear() {
    const ok = window.confirm(
      "⚠️ Esto eliminará TODOS los datos permanentemente.\n\n¿Continuar?"
    )
    if (ok) {
      // Limpiamos el usuario activo primero para evitar estado residual
      setUsuarioActivo(null)
      // Seteamos null: el useEffect de AppContext limpiará el localStorage
      actualizarDatos(null)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>

      <button onClick={exportar} style={{ ...styles.azul, opacity: exportando ? 0.6 : 1 }} disabled={exportando}>
        {exportando ? "⏳ Exportando..." : "📤 Exportar datos"}
      </button>

      <label style={styles.azul}>
        📥 Importar datos
        <input type="file" accept=".json" onChange={importar} style={{ display: "none" }} />
      </label>

      <button onClick={resetear} style={styles.rojo}>
        ⚠️ Resetear datos ⚠️
      </button>

    </div>
  )
}

const styles = {
  azul: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center"
  },
  rojo: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#DC2626",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center"
  }
}