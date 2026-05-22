// src/pages/DropboxOAuthCallback.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { procesarCallbackDropboxWeb } from "../services/dropboxSync"

export default function DropboxOAuthCallback() {
  const navigate = useNavigate()
  const [estado, setEstado] = useState("Procesando autenticación con Dropbox...")

  useEffect(() => {
    async function procesar() {
      try {
        const ok = await procesarCallbackDropboxWeb()
        if (ok) {
          setEstado("✅ Conectado. Redirigiendo...")
          setTimeout(() => navigate("/ajustes?dropbox=ok"), 800)
        } else {
          setEstado("❌ No se encontró el código de autorización.")
          setTimeout(() => navigate("/ajustes"), 2000)
        }
      } catch (e) {
        setEstado(`❌ Error: ${e?.message || "Error desconocido"}`)
        setTimeout(() => navigate("/ajustes"), 2000)
      }
    }

    procesar()
  }, [navigate])

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0F1115",
      color: "#C7CDD6",
      fontSize: "16px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <p>{estado}</p>
    </div>
  )
}
