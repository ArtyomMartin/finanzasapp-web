import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Inicio from "./pages/Inicio"
import Privacidad from "./pages/Privacidad"
import ComoUsar from "./pages/ComoUsar/ComoUsar"

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1115", color: "#fff" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/como-usar/*" element={<ComoUsar />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}