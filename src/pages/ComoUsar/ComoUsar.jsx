import { NavLink, Routes, Route, Navigate } from "react-router-dom"
import Basico from "./Basico"
import Medio from "./Medio"
import Avanzado from "./Avanzado"

const tabs = [
  { to: "basico", label: "Nivel Básico" },
  { to: "medio", label: "Nivel Medio" },
  { to: "avanzado", label: "Nivel Avanzado" },
]

export default function ComoUsar() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>Cómo usar la app</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} style={({ isActive }) => ({
            padding: "8px 18px", borderRadius: "8px", textDecoration: "none",
            fontSize: "14px", fontWeight: "500",
            background: isActive ? "rgba(124,92,255,0.25)" : "rgba(28,33,40,0.7)",
            color: isActive ? "#A48BFF" : "#C7CDD6",
            border: isActive ? "1px solid rgba(124,92,255,0.4)" : "1px solid rgba(44,52,64,0.8)",
          })}>
            {t.label}
          </NavLink>
        ))}
      </div>
      <Routes>
        <Route index element={<Navigate to="basico" />} />
        <Route path="basico" element={<Basico />} />
        <Route path="medio" element={<Medio />} />
        <Route path="avanzado" element={<Avanzado />} />
      </Routes>
    </div>
  )
}