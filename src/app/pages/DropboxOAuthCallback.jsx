//C:documentos/Proyectos/FinanzasApp/src/pantallas/DropboxOAuthCallback.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { procesarCallbackDropboxWeb } from "../services/dropboxSync"
import { CheckCircle2, XCircle } from "lucide-react"

export default function DropboxOAuthCallback() {
  const navigate = useNavigate()
  const [estado, setEstado] = useState("Procesando autenticación con Dropbox...")

  useEffect(() => {
    async function procesar() {
      try {
        const ok = await procesarCallbackDropboxWeb()
        if (ok) {
          setEstado(<><CheckCircle2 size={18} /> Conectado. Redirigiendo...</>)
          setTimeout(() => navigate("/ajustes?dropbox=ok"), 800)
        } else {
          setEstado(<><XCircle size={18} /> No se encontró el código de autorización.</>)
          setTimeout(() => navigate("/ajustes"), 2000)
        }
      } catch (e) {
        setEstado(<><XCircle size={18} /> Error: {e?.message || "Error desconocido"}</>)
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
      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>{estado}</p>
    </div>
  )
}
