import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Inicio from "./pages/Inicio"
import Privacidad from "./pages/Privacidad"
import ComoUsar from "./pages/ComoUsar/ComoUsar"

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1115", color: "#fff" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/como-usar/*" element={<ComoUsar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  )
}