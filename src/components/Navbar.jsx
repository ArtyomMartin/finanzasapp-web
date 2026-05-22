import { Link, useLocation } from "react-router-dom"

const links = [
  { to: "/", label: "Inicio" },
  { to: "/como-usar", label: "Cómo usar la app" },
  { to: "/app", label: "App online" },
  { to: "/privacidad", label: "Privacidad" },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: "flex", gap: "8px", padding: "16px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(22,26,32,0.95)", position: "sticky", top: 0, zIndex: 100
    }}>
      {links.map(l => (
        <Link key={l.to} to={l.to} style={{
          padding: "8px 16px", borderRadius: "8px", textDecoration: "none",
          fontSize: "14px", fontWeight: "500",
          background: pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to))
            ? "rgba(124,92,255,0.25)" : "transparent",
          color: pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to))
            ? "#A48BFF" : "#C7CDD6",
        }}>{l.label}</Link>
      ))}
    </nav>
  )
}