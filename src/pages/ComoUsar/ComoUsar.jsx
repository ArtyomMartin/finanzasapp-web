import { NavLink, Routes, Route, Navigate } from "react-router-dom"
import SimuladorBasico from "./SimuladorBasico"
import Medio from "./Medio"
import Avanzado from "./Avanzado"

const tabs = [
  { to: "/como-usar/basico", label: "Nivel Básico" },
  { to: "/como-usar/medio", label: "Nivel Medio" },
  { to: "/como-usar/avanzado", label: "Nivel Avanzado" },
]

export default function ComoUsar() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "var(--c-texto, #1a1a1a)" }}>Cómo usar la app</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} style={({ isActive }) => ({
            padding: "8px 18px", borderRadius: "8px", textDecoration: "none",
            fontSize: "14px", fontWeight: "500",
            background: isActive ? "var(--c-fondo-opcion-activa, #dbeafe)" : "var(--c-fondo-opcion, #f0f0eb)",
            color: isActive ? "var(--c-primario, #1a1a1a)" : "var(--c-texto-secundario, #555555)",
            border: isActive ? "1px solid var(--c-borde, #1a1a1a)" : "1px solid var(--c-borde-blanco, #d4d4cc)",
          })}>
            {t.label}
          </NavLink>
        ))}
      </div>
      <Routes>
        <Route index element={<Navigate to="/como-usar/basico" replace />} />
        <Route path="basico" element={<SimuladorBasico />} />
        <Route path="medio" element={<Medio />} />
        <Route path="avanzado" element={<Avanzado />} />
      </Routes>
    </div>
  )
}