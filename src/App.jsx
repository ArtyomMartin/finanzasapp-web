import { useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Inicio from "./pages/Inicio"
import Privacidad from "./pages/Privacidad"
import ComoUsar from "./pages/ComoUsar/ComoUsar"
import { AppProvider } from "./app/context/AppContext"
import AppRoot from "./app/AppRoot"
import { aplicarTema } from "./app/theme/colores"


export default function App() {
  const location = useLocation()
  const enApp = location.pathname.startsWith("/app") || location.pathname === "/oauth"

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("finanzas-datos")
      const tema = guardado ? JSON.parse(guardado)?.config?.tema : null
      aplicarTema(tema || "retro-flat")
    } catch (_) {
      aplicarTema("retro-flat")
    }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "#fff" }}>
      <Navbar />
      {enApp ? (
        <AppProvider>
          <AppRoot />
        </AppProvider>
      ) : (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/como-usar/*" element={<ComoUsar />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </div>
  )
}